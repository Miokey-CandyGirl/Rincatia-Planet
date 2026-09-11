// ============================================================
// iDrome search-proxy Edge Function
//
// 百度 AI 搜索 + DeepSeek 流式整合
// 依据：AI应用设计方案.md 第 19 章 + AI应用分步执行.md 步骤 7.2
//
// 环境变量（在 Supabase Dashboard → Edge Functions → Secrets 设置）：
// - DEEPSEEK_API_KEY    — DeepSeek API 密钥
// - BAIDU_AI_SEARCH_KEY — 百度 AI 搜索 API Key（bce-v3/ALTAK-xxxx 格式）
//
// 部署方式：
//   supabase functions deploy search-proxy --no-verify-jwt
//   或在 Supabase Dashboard → Edge Functions → New Function 中粘贴此代码
// ============================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY')
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'
const BAIDU_AI_BASE = 'https://qianfan.baidubce.com'
const BAIDU_AI_KEY = Deno.env.get('BAIDU_AI_SEARCH_KEY')

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
}

/**
 * 截断查询到 72 字符（一个汉字占 2 字符，按 API 文档要求）
 */
function truncateQuery(query: string): string {
  let charCount = 0
  let result = ''
  for (const ch of query) {
    const code = ch.charCodeAt(0)
    // 中文字符（CJK 统一汉字范围）算 2 字符
    const cost = (code >= 0x4e00 && code <= 0x9fff) ? 2 : 1
    if (charCount + cost > 72) break
    charCount += cost
    result += ch
  }
  return result
}

/**
 * 百度 AI 搜索 — 网页搜索
 * POST /v2/ai_search/web_search
 * 返回结构化搜索结果
 *
 * 认证方式（依据官方文档，两种 Header 均尝试）：
 * 1. Authorization: Bearer <API Key>
 * 2. X-Appbuilder-Authorization: Bearer <AppBuilder API Key>
 */
async function baiduWebSearch(query: string) {
  if (!BAIDU_AI_KEY) {
    throw new Error('BAIDU_AI_SEARCH_KEY 环境变量未设置')
  }

  const truncatedQuery = truncateQuery(query)
  console.log('[search-proxy] 百度搜索查询:', truncatedQuery, '(原始长度:', query.length, ')')
  console.log('[search-proxy] API Key 前缀:', BAIDU_AI_KEY.substring(0, 20) + '...')

  // 请求体 — 依据百度官方文档 /v2/ai_search/web_search
  // search_filter 仅在有实际过滤条件（如 site）时才传入，空 match 对象会导致 0 结果
  const requestBody: Record<string, any> = {
    messages: [{ role: 'user', content: truncatedQuery }],
    search_source: 'baidu_search_v2',
    resource_type_filter: [{ type: 'web', top_k: 10 }],
    search_recency_filter: 'year'
  }

  // 尝试两种认证 Header
  const authHeaders: Record<string, string>[] = [
    { 'Authorization': `Bearer ${BAIDU_AI_KEY}` },
    { 'X-Appbuilder-Authorization': `Bearer ${BAIDU_AI_KEY}` }
  ]

  let lastError: any = null
  let lastResponseData: any = null

  for (let i = 0; i < authHeaders.length; i++) {
    const headerName = Object.keys(authHeaders[i])[0]
    console.log(`[search-proxy] 尝试认证方式 ${i + 1}: ${headerName}`)

    try {
      const response = await fetch(`${BAIDU_AI_BASE}/v2/ai_search/web_search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders[i]
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errText = await response.text().catch(() => '')
        console.error(`[search-proxy] 认证方式 ${i + 1} HTTP 错误:`, response.status, errText)
        lastError = new Error(`百度搜索 API 错误 ${response.status}: ${errText}`)
        continue
      }

      const data = await response.json()
      lastResponseData = data

      // 记录完整响应结构（用于调试）
      console.log(`[search-proxy] 认证方式 ${i + 1} 响应字段:`, Object.keys(data))
      console.log(`[search-proxy] 认证方式 ${i + 1} 完整响应:`, JSON.stringify(data).slice(0, 1000))

      // 检查 API 错误响应
      if (data.code) {
        console.error(`[search-proxy] 认证方式 ${i + 1} 业务错误:`, data.code, data.message)
        lastError = new Error(`百度搜索错误 ${data.code}: ${data.message || '未知错误'}`)
        continue
      }

      const references = data.references || []
      console.log(`[search-proxy] 认证方式 ${i + 1} 返回`, references.length, '条结果')

      if (references.length > 0) {
        return references.map((r: any) => ({
          title: r.title || '',
          abstract: (r.snippet || r.content || '').slice(0, 500),
          url: r.url || '',
          date: r.date || '',
          website: r.website || r.web_anchor || ''
        }))
      }
      // 0 条结果 — 尝试下一种认证方式
    } catch (err: any) {
      console.error(`[search-proxy] 认证方式 ${i + 1} 异常:`, err.message)
      lastError = err
    }
  }

  // 所有认证方式都返回 0 结果或失败
  if (lastResponseData && !lastError) {
    // API 返回了有效响应但 0 条结果
    console.warn('[search-proxy] 所有认证方式均返回 0 条结果')
    return []
  }

  throw lastError || new Error('百度搜索未返回结果')
}

/**
 * 调用 DeepSeek 流式 API
 */
async function streamDeepSeek(messages: any[], options: any = {}) {
  const body: any = {
    model: options.model || 'deepseek-v4-flash',
    messages: messages,
    stream: true,
    max_tokens: options.maxTokens || 4096,
    temperature: options.temperature ?? 0.7,
    stream_options: { include_usage: true }
  }

  // 深度思考模式 — 显式控制，确保禁用时不会默认启用
  if (options.thinking?.type === 'enabled') {
    body.thinking = { type: 'enabled' }
  } else {
    // 显式禁用思考，防止 DeepSeek 在搜索模式下默认启用思考
    body.thinking = { type: 'disabled' }
  }

  return await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify(body)
  })
}

/**
 * 发送 SSE 状态事件
 */
function sendSSEEvent(controller: ReadableStreamDefaultController, event: string, data: any) {
  const encoder = new TextEncoder()
  const payload = `data: ${JSON.stringify({ type: 'status', event, ...data })}\n\n`
  controller.enqueue(encoder.encode(payload))
}

/**
 * 将上游 ReadableStream 透传到 controller
 */
async function pipeStreamToController(upstreamResponse: Response, controller: ReadableStreamDefaultController) {
  const reader = upstreamResponse.body!.getReader()
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    controller.enqueue(value)
  }
}

serve(async (req: Request) => {
  // CORS 预检
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  try {
    const { messages, options = {} } = await req.json()

    // 使用最后一条「用户」消息作为搜索查询（而非最后一条消息）
    // 因为前端可能在 messages 数组末尾包含空的 AI 占位消息
    const userMessages = messages.filter((m: any) => m.role === 'user')
    const lastUserMessage = userMessages.length > 0 ? userMessages[userMessages.length - 1].content : ''
    const lastMessage = lastUserMessage || messages[messages.length - 1]?.content || ''

    // 诊断日志 — 记录收到的消息和搜索查询
    console.log('[search-proxy] 收到请求, 消息数:', messages.length, '选项:', JSON.stringify(options))
    console.log('[search-proxy] 最后一条用户消息:', lastUserMessage.substring(0, 100))
    console.log('[search-proxy] 所有消息角色:', messages.map((m: any) => m.role))

    // 搜索判断 — 简单开关逻辑
    // 规则：用户开启联网搜索 → 执行百度搜索
    //       用户未开启 → 直接使用 DeepSeek
    const needsSearch = options.webSearchEnabled === true

    console.log('[search-proxy] 搜索判断:', {
      webSearchEnabled: options.webSearchEnabled,
      needsSearch,
      messagePreview: lastMessage.substring(0, 50)
    })

    const stream = new ReadableStream({
      async start(controller) {
        // ========== 不需要搜索 — 直接 DeepSeek ==========
        if (!needsSearch) {
          try {
            const dsResponse = await streamDeepSeek(messages, options)
            if (!dsResponse.ok) {
              const errText = await dsResponse.text().catch(() => '')
              sendSSEEvent(controller, 'error', { message: `DeepSeek 错误 ${dsResponse.status}: ${errText}` })
            } else {
              await pipeStreamToController(dsResponse, controller)
            }
          } catch (err: any) {
            sendSSEEvent(controller, 'error', { message: err.message })
          }
          controller.close()
          return
        }

        // ========== 需要搜索 — 百度搜索 + DeepSeek 整合 ==========
        try {
          // 1. 通知前端：正在搜索
          sendSSEEvent(controller, 'searching', { provider: 'baidu' })

          // 2. 调用百度搜索
          const searchResults = await baiduWebSearch(lastMessage)

          // 3. 通知前端：搜索完成
          sendSSEEvent(controller, 'search_done', {
            provider: 'baidu',
            count: searchResults.length,
            results: searchResults
          })

          // 4. 将搜索结果注入 system prompt
          const searchContext = searchResults
            .map((r: any, i: number) =>
              `[${i + 1}] ${r.title}\n${r.abstract}\n链接: ${r.url}${r.date ? `\n日期: ${r.date}` : ''}`
            )
            .join('\n\n')

          const systemMsg = {
            role: 'system',
            content: `以下是来自百度搜索的实时信息，请基于这些信息回答用户问题。如果搜索结果不足以回答问题，请如实说明。在回答中适当位置标注引用来源编号（如 [1]、[2]）。\n\n搜索结果：\n${searchContext}`
          }

          // 5. 调用 DeepSeek 流式生成
          const dsResponse = await streamDeepSeek([systemMsg, ...messages], options)

          if (!dsResponse.ok) {
            const errText = await dsResponse.text().catch(() => '')
            sendSSEEvent(controller, 'error', { message: `DeepSeek 错误 ${dsResponse.status}: ${errText}` })
          } else {
            await pipeStreamToController(dsResponse, controller)
          }
        } catch (err: any) {
          // 搜索失败 — 降级为纯 DeepSeek 对话
          console.error('[search-proxy] 搜索失败，降级:', err.message)
          sendSSEEvent(controller, 'search_failed', {
            provider: 'baidu',
            reason: err.message
          })

          try {
            const dsResponse = await streamDeepSeek(messages, options)
            if (dsResponse.ok) {
              await pipeStreamToController(dsResponse, controller)
            }
          } catch (fallbackErr: any) {
            sendSSEEvent(controller, 'error', { message: fallbackErr.message })
          }
        }

        controller.close()
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        ...CORS_HEADERS
      }
    })
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
      }
    )
  }
})
