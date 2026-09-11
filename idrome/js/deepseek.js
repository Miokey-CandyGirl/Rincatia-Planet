/**
 * iDrome — DeepSeek API 封装
 *
 * 按设计方案第 17 章实现：
 * - DeepSeekAPI 类 — chat / chatStream / chatWithThinking
 * - getAuthHeaders() — 从 Supabase session 获取 JWT（非 API 密钥）
 * - SSE 流式解析：TextDecoder({ stream: true }) + buffer 分包
 * - 双参数回调：(delta, fullContent) 增量追加渲染
 * - stream_options: { include_usage: true } 通过 Edge Function 处理
 *
 * 安全架构：
 * - 前端不持有任何 API 密钥
 * - 所有调用通过 chat-proxy Edge Function 代理
 * - 仅持有 Supabase JWT
 */

'use strict'

import { APIError } from './errorHandler.js'

/**
 * Supabase 客户端获取函数
 * @returns {Object|null} supabase 客户端
 */
function getSupabase() {
  if (typeof window !== 'undefined' && window.supabase) {
    return window.supabase
  }
  return null
}

/**
 * 获取 Edge Function 代理端点
 * @returns {string}
 */
function getProxyUrl() {
  // 从全局配置或硬编码获取 Supabase URL
  const supabaseUrl =
    (typeof window !== 'undefined' && window.IDROME_CONFIG?.supabaseUrl) ||
    'https://kbbtsurqznyyqfoaoutt.supabase.co'
  return `${supabaseUrl}/functions/v1/chat-proxy`
}

/**
 * DeepSeek API 封装类
 *
 * 安全架构：前端不持有 API 密钥，所有调用通过 Edge Function 代理
 */
export class DeepSeekAPI {
  constructor() {
    // 不持有 API 密钥，仅记录 Edge Function 代理端点
    this.proxyUrl = getProxyUrl()
    this.defaultModel = 'deepseek-v4-flash'
  }

  /**
   * 获取认证头（使用 Supabase JWT，非 API 密钥）
   * Edge Function 后端通过 JWT 验证用户身份，再从环境变量读取真实 API 密钥
   * @returns {Promise<Object>}
   */
  async getAuthHeaders() {
    const supabase = getSupabase()
    if (!supabase || !supabase.auth) {
      throw new APIError(401, '未登录 — Supabase 客户端未初始化', 'auth')
    }

    const { data: { session }, error } = await supabase.auth.getSession()
    if (error || !session) {
      throw new APIError(401, '未登录或会话已过期', 'auth')
    }

    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`
    }
  }

  /**
   * 非流式对话（普通模式）
   * @param {Array} messages - 消息数组
   * @param {Object} options - { maxTokens, temperature, model, conversationId }
   * @returns {Promise<Object>} { content, usage }
   */
  async chat(messages, options = {}) {
    const reqOptions = {
      model: options.model || this.defaultModel,
      stream: false,
      maxTokens: options.maxTokens,
      temperature: options.temperature
    }
    // 显式传递 thinking 参数，确保禁用时不会默认启用
    if (options.thinking) {
      reqOptions.thinking = options.thinking
    }
    const response = await fetch(this.proxyUrl, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify({
        messages: messages,
        conversationId: options.conversationId,
        options: reqOptions
      })
    })

    if (!response.ok) {
      const errText = await response.text().catch(() => '')
      throw APIError.fromResponse(response.status, errText)
    }

    const data = await response.json()
    return {
      content: data.choices?.[0]?.message?.content || '',
      usage: data.usage || null
    }
  }

  /**
   * 流式对话（SSE 流式输出，实现打字机效果）
   * Edge Function 透传 DeepSeek 的 SSE 流，前端解析 data: 行
   *
   * @param {Array} messages - 消息数组
   * @param {Function} onChunk - 正文 chunk 回调 (delta, fullContent)
   * @param {Function} onDone - 流结束回调 (fullContent, usage)
   * @param {Function} onError - 错误回调 (error)
   * @param {Object} options - { maxTokens, temperature, model, conversationId, signal }
   */
  async chatStream(messages, onChunk, onDone, onError, options = {}) {
    try {
      const reqOptions = {
        model: options.model || this.defaultModel,
        stream: true,
        maxTokens: options.maxTokens,
        temperature: options.temperature
      }
      // 显式传递 thinking 参数，确保禁用时不会默认启用
      if (options.thinking) {
        reqOptions.thinking = options.thinking
      }
      const response = await fetch(this.proxyUrl, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify({
          messages: messages,
          conversationId: options.conversationId,
          options: reqOptions
        }),
        signal: options.signal  // AbortSignal 支持
      })

      if (!response.ok) {
        const errText = await response.text().catch(() => '')
        throw APIError.fromResponse(response.status, errText)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let fullContent = ''
      let capturedUsage = null

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          // 流结束：flush 解码器缓冲区中残留的字节
          if (buffer) {
            const trimmed = buffer.trim()
            if (trimmed.startsWith('data: ')) {
              const data = trimmed.slice(6)
              if (data !== '[DONE]') {
                try {
                  const parsed = JSON.parse(data)
                  const delta = parsed.choices?.[0]?.delta?.content
                  if (delta) {
                    fullContent += delta
                    onChunk?.(delta, fullContent)
                  }
                  if (parsed.usage) capturedUsage = parsed.usage
                } catch { /* 跳过 */ }
              }
            }
          }
          break
        }

        // { stream: true } 确保 UTF-8 多字节字符不会被截断
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''  // 保留最后一个不完整的行

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || !trimmed.startsWith('data: ')) continue
          const data = trimmed.slice(6)
          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)
            const delta = parsed.choices?.[0]?.delta?.content
            if (delta) {
              fullContent += delta
              onChunk?.(delta, fullContent)
            }
            if (parsed.usage) capturedUsage = parsed.usage
          } catch { /* 跳过解析失败的行 */ }
        }
      }

      onDone?.(fullContent, capturedUsage)
    } catch (err) {
      // AbortError 不视为错误
      if (err.name === 'AbortError') {
        onDone?.('', null)
        return
      }
      onError?.(err)
    }
  }

  /**
   * 深度思考模式对话
   * 当 thinking.type = 'enabled' 时，模型会先进行内部推理，
   * 返回的 reasoning_content 包含推理过程，content 包含最终回答
   *
   * 回调语义（双参数模式）：
   * - onReasoningChunk(delta, fullReasoning): 推理过程增量
   * - onContentChunk(delta, fullContent): 最终回答增量
   *
   * @param {Array} messages - 消息数组
   * @param {Function} onReasoningChunk - 推理过程回调
   * @param {Function} onContentChunk - 正文回调
   * @param {Function} onDone - 流结束回调 (fullContent, usage)
   * @param {Function} onError - 错误回调
   * @param {Object} options - { maxTokens, temperature, model, conversationId, signal }
   */
  async chatWithThinking(messages, onReasoningChunk, onContentChunk, onDone, onError, options = {}) {
    try {
      const response = await fetch(this.proxyUrl, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify({
          messages: messages,
          conversationId: options.conversationId,
          options: {
            model: options.model || this.defaultModel,
            stream: true,
            thinking: { type: 'enabled' },
            maxTokens: options.maxTokens,
            temperature: options.temperature
          }
        }),
        signal: options.signal
      })

      if (!response.ok) {
        const errText = await response.text().catch(() => '')
        throw APIError.fromResponse(response.status, errText)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let fullReasoning = ''
      let fullContent = ''
      let capturedUsage = null

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          // 流结束：flush 残留缓冲区
          if (buffer) {
            const trimmed = buffer.trim()
            if (trimmed.startsWith('data: ')) {
              const data = trimmed.slice(6)
              if (data !== '[DONE]') {
                try {
                  const parsed = JSON.parse(data)
                  const delta = parsed.choices?.[0]?.delta
                  if (delta?.reasoning_content) {
                    fullReasoning += delta.reasoning_content
                    onReasoningChunk?.(delta.reasoning_content, fullReasoning)
                  }
                  if (delta?.content) {
                    fullContent += delta.content
                    onContentChunk?.(delta.content, fullContent)
                  }
                  if (parsed.usage) capturedUsage = parsed.usage
                } catch { /* 跳过 */ }
              }
            }
          }
          break
        }

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || !trimmed.startsWith('data: ')) continue
          const data = trimmed.slice(6)
          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)
            const delta = parsed.choices?.[0]?.delta
            // 深度思考模式：delta 中可能包含 reasoning_content 或 content
            if (delta?.reasoning_content) {
              fullReasoning += delta.reasoning_content
              onReasoningChunk?.(delta.reasoning_content, fullReasoning)
            }
            if (delta?.content) {
              fullContent += delta.content
              onContentChunk?.(delta.content, fullContent)
            }
            if (parsed.usage) capturedUsage = parsed.usage
          } catch { /* 跳过解析失败的行 */ }
        }
      }

      onDone?.(fullContent, capturedUsage, fullReasoning)
    } catch (err) {
      if (err.name === 'AbortError') {
        onDone?.('', null, '')
        return
      }
      onError?.(err)
    }
  }

  /**
   * 健康检查
   * 通过 Edge Function 的 healthcheck 端点检测服务可用性
   * @returns {Promise<boolean>}
   */
  async healthCheck() {
    try {
      const response = await fetch(this.proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await this.getAuthHeaders()).Authorization}`
        },
        body: JSON.stringify({ action: 'healthcheck' })
      })
      return response.ok
    } catch {
      return false
    }
  }
}

export default DeepSeekAPI
