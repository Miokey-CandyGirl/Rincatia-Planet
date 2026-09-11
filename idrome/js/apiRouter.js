/**
 * iDrome — 统一 API 路由器
 *
 * 按设计方案第 23 章和第 33.1 节实现：
 * - APIRouter 单例对象 — 统一调度入口
 * - chat(messages, options) — 统一入口，根据 options 选择 chat / chatStream / chatWithThinking
 * - 健康检查 + 自动回退（DeepSeek → 豆包）
 * - 失败计数熔断：连续 3 次失败标记不可用，每 5 分钟重试恢复
 * - 开发环境 Mock 拦截：在 chat() 方法入口处注入，不覆盖 window.fetch
 *
 * 安全架构：
 * - 前端不持有任何 API 密钥
 * - 所有健康检查和 API 调用通过 Edge Function 代理
 * - 仅持有 Supabase JWT
 *
 * 约束：
 * - Mock 层通过 APIRouter.chat() 入口注入，使用 mockChat() 函数
 * - 禁止全局覆盖 window.fetch
 */

'use strict'

import { DeepSeekAPI } from './deepseek.js'
import { APIError, retryWithBackoff } from './errorHandler.js'
import { isMockEnabled, mockChat } from '../test/mock/mockLayer.js'

/** 熔断阈值 */
const CIRCUIT_BREAKER_THRESHOLD = 3

/** 恢复探测间隔（5 分钟） */
const RECOVERY_INTERVAL = 5 * 60 * 1000

/**
 * APIRouter — 统一 API 调度器
 */
class APIRouterClass {
  constructor() {
    // Edge Function 代理端点
    this.proxyUrls = {
      deepseek: null,  // 初始化后设置 → chat-proxy（统一代理 DeepSeek + 豆包对话）
      doubao: null,    // 由 chat-proxy 内部路由（isDoubao 判断），不需单独端点
      baidu: null,     // 初始化后设置 → search-proxy
      voice: null      // 初始化后设置 → voice-proxy（ASR + TTS）
    }

    // Supabase JWT（非 API 密钥）
    this.jwt = null

    // 服务能力缓存
    this.capabilities = {}

    // 服务健康状态
    this.healthStatus = {
      deepseek: false,
      doubao: false
    }

    // 失败计数（用于熔断）
    this.failCount = {
      deepseek: 0,
      doubao: 0
    }

    // DeepSeekAPI 实例
    this.deepseek = null

    // 是否已初始化
    this.initialized = false

    // 恢复探测定时器
    this.recoveryTimer = null

    // Mock 回退开关（临时用户启用：API 失败时自动回退 Mock）
    this.mockFallback = false
  }

  /**
   * 结构化日志记录
   */
  log(level, event, data = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,           // 'info' | 'warn' | 'error'
      event,           // 'api_call' | 'auth_error' | 'token_exceeded' ...
      userId: data.userId,
      model: data.model,
      provider: data.provider,
      error: data.error?.message,
      status: data.status,
      duration: data.duration,
      tokens: data.tokens
    }
    console.log(JSON.stringify(entry))
  }

  /**
   * 初始化 API 路由器
   * 获取 Supabase JWT 并创建 DeepSeekAPI 实例
   */
  async initialize() {
    if (this.initialized) return

    // 获取 Supabase 会话 JWT（不获取 API 密钥）
    const supabase = typeof window !== 'undefined' ? window.supabase : null
    if (!supabase || !supabase.auth) {
      console.warn('[iDrome APIRouter] Supabase 客户端未初始化，Mock 模式将作为回退')
      this.initialized = true
      return
    }

    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error || !session) {
        console.warn('[iDrome APIRouter] 无有效会话，Mock 模式将作为回退')
        this.initialized = true
        return
      }

      // 仅持有 JWT token，不接触任何第三方 API 密钥
      this.jwt = session.access_token

      // 设置代理端点
      const supabaseUrl =
        (window.IDROME_CONFIG?.supabaseUrl) ||
        'https://kbbtsurqznyyqfoaoutt.supabase.co'
      this.proxyUrls.deepseek = `${supabaseUrl}/functions/v1/chat-proxy`
      this.proxyUrls.baidu = `${supabaseUrl}/functions/v1/search-proxy`
      this.proxyUrls.voice = `${supabaseUrl}/functions/v1/voice-proxy`

      // 创建 DeepSeekAPI 实例
      this.deepseek = new DeepSeekAPI()

      // 检测各服务能力
      await this.detectCapabilities()

      // 启动恢复探测定时器
      this.startRecoveryProbe()

      this.initialized = true
      console.log('[iDrome APIRouter] 初始化完成，健康状态:', this.healthStatus)
    } catch (e) {
      console.warn('[iDrome APIRouter] 初始化失败，Mock 模式将作为回退:', e.message)
      this.initialized = true
    }
  }

  /**
   * 检测各服务能力
   */
  async detectCapabilities() {
    const [deepseekHealth, doubaoHealth] = await Promise.allSettled([
      this.healthCheck('deepseek'),
      this.healthCheck('doubao')
    ])

    this.healthStatus.deepseek = deepseekHealth.status === 'fulfilled' && deepseekHealth.value
    this.healthStatus.doubao = doubaoHealth.status === 'fulfilled' && doubaoHealth.value
    this.log('info', 'health_check', { healthStatus: this.healthStatus })
  }

  /**
   * 服务健康检查
   * 通过 chat-proxy Edge Function 的 healthcheck 端点检测服务可用性
   * chat-proxy 返回 { providers: { deepseek: {apiConfigured}, doubao: {apiConfigured} } }
   * @param {'deepseek'|'doubao'} provider
   * @returns {Promise<boolean>}
   */
  async healthCheck(provider) {
    try {
      if (!this.deepseek) return false

      // 调用 chat-proxy healthcheck 端点，解析返回的 providers 信息
      const response = await fetch(this.deepseek.proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await this.deepseek.getAuthHeaders()).Authorization}`
        },
        body: JSON.stringify({ action: 'healthcheck' })
      })

      if (!response.ok) return false

      const data = await response.json()
      const providerInfo = data?.providers?.[provider]
      // apiConfigured 表示对应 API Key 已在 Edge Function 环境变量中配置
      return !!(providerInfo && providerInfo.apiConfigured)
    } catch (e) {
      console.warn(`[iDrome APIRouter] healthCheck(${provider}) 失败:`, e?.message || e)
      return false
    }
  }

  /**
   * 启动恢复探测定时器
   * 每 5 分钟重试不可用的服务
   */
  startRecoveryProbe() {
    if (this.recoveryTimer) clearInterval(this.recoveryTimer)

    this.recoveryTimer = setInterval(async () => {
      for (const provider of Object.keys(this.healthStatus)) {
        if (!this.healthStatus[provider]) {
          console.log(`[iDrome APIRouter] 恢复探测: ${provider}`)
          const recovered = await this.healthCheck(provider)
          if (recovered) {
            this.healthStatus[provider] = true
            this.failCount[provider] =  0
            console.log(`[iDrome APIRouter] ${provider} 已恢复`)
          }
        }
      }
    }, RECOVERY_INTERVAL)
  }

  /**
   * 停止恢复探测
   */
  stopRecoveryProbe() {
    if (this.recoveryTimer) {
      clearInterval(this.recoveryTimer)
      this.recoveryTimer = null
    }
  }

  /**
   * 记录调用失败
   * @param {'deepseek'|'doubao'} provider
   */
  recordFailure(provider) {
    this.failCount[provider]++
    if (this.failCount[provider] >= CIRCUIT_BREAKER_THRESHOLD) {
      this.healthStatus[provider] = false
      this.log('warn', 'circuit_breaker_open', { provider, failCount: this.failCount[provider] })
    }
  }

  /**
   * 记录调用成功
   * @param {'deepseek'|'doubao'} provider
   */
  recordSuccess(provider) {
    this.failCount[provider] = 0
    this.healthStatus[provider] = true
  }

  /**
   * 对话调用（统一入口）
   *
   * 被 chat.js 的 sendMessage() 调用
   * 根据选项自动选择普通对话、流式对话或深度思考模式
   *
   * @param {Array} messages - 消息数组
   * @param {Object} options - 选项
   *   @param {boolean} [options.stream=true] - 是否流式
   *   @param {Object} [options.thinking] - 思考模式 { type: 'enabled' | 'disabled' }
   *   @param {number} [options.maxTokens] - 最大输出 token
   *   @param {number} [options.temperature] - 温度
   *   @param {string} [options.model] - 模型名
   *   @param {string} [options.conversationId] - 对话 ID（用于 usage 记录）
   *   @param {AbortSignal} [options.signal] - 中断信号
   *   @param {Function} [options.onChunk] - 正文 chunk 回调 (delta, fullContent)
   *   @param {Function} [options.onContentChunk] - 同 onChunk（别名）
   *   @param {Function} [options.onReasoningChunk] - 思考 chunk 回调 (delta, fullReasoning)
   *   @param {Function} [options.onDone] - 流结束回调 (fullContent, usage)
   *   @param {Function} [options.onError] - 错误回调 (error)
   * @returns {Promise<{content: string, reasoning?: string, usage?: Object}>}
   */
  async chat(messages, options = {}) {
    // ========== 开发环境 Mock 拦截 ==========
    // 在 chat() 方法入口处注入，不覆盖 window.fetch
    // 设计方案第 33.1 节：避免拦截 Supabase SDK 内部的 fetch 调用
    // 临时用户（mockFallback=true）跳过 Mock-first，先尝试真实 API，失败后回退 Mock
    if (isMockEnabled() && !this.mockFallback) {
      this.log('info', 'mock_intercept', { messageCount: messages.length })
      return mockChat(messages, options)
    }

    // ========== 真实 API 调用 ==========
    if (!this.initialized) {
      await this.initialize()
    }

    if (!this.deepseek) {
      // 临时用户无 Supabase session → deepseek 实例未创建 → 回退 Mock
      if (this.mockFallback) {
        this.log('warn', 'fallback_to_mock', { reason: 'no_deepseek_instance' })
        return mockChat(messages, options)
      }
      throw new APIError(503, 'APIRouter 未初始化，DeepSeek 不可用', 'server')
    }

    // 检查服务健康状态
    const modelName = options.model || 'deepseek-v4-flash'
    const isDoubao = modelName.toLowerCase().includes('doubao') || modelName.toLowerCase().includes('seed')
    const provider = isDoubao ? 'doubao' : 'deepseek'

    if (!this.healthStatus[provider]) {
      this.log('warn', 'service_unavailable', { provider })
      // 服务不可用时回退到 Mock
      if (isMockEnabled() || this.mockFallback) {
        return mockChat(messages, options)
      }
      throw new APIError(503, `${provider === 'doubao' ? '豆包' : 'DeepSeek'} 服务暂时不可用`, 'server')
    }

    const isThinkingMode = options.thinking?.type === 'enabled'
    const isStream = options.stream !== false

    // ========== 联网搜索模式 — 路由到 search-proxy ==========
    if (options.webSearchEnabled && this.proxyUrls.baidu) {
      console.log('[iDrome APIRouter] 联网搜索已启用，路由到 search-proxy:', this.proxyUrls.baidu)
      try {
        const result = await this.chatWithSearch(messages, options)
        this.recordSuccess('deepseek')
        console.log('[iDrome APIRouter] 搜索对话完成，内容长度:', result.content?.length || 0)
        return result
      } catch (err) {
        this.recordFailure('deepseek')
        if (err.name === 'AbortError') throw err

        // 搜索失败 — 降级为普通对话
        console.error('[iDrome APIRouter] 搜索失败，降级为普通对话:', err.message)
        this.log('warn', 'search_fallback', { error: err.message })
        options.webSearchEnabled = false  // 降级：关闭搜索标志后继续普通对话
      }
    }

    try {
      let result

      if (isThinkingMode) {
        // 深度思考模式
        result = await new Promise((resolve, reject) => {
          this.deepseek.chatWithThinking(
            messages,
            options.onReasoningChunk || (() => {}),
            options.onChunk || options.onContentChunk || (() => {}),
            (fullContent, usage, fullReasoning) => resolve({ content: fullContent, reasoning: fullReasoning || undefined, usage }),
            reject,
            {
              maxTokens: options.maxTokens,
              temperature: options.temperature,
              model: options.model,
              conversationId: options.conversationId,
              signal: options.signal
            }
          )
        })
      } else if (isStream) {
        // 流式对话
        result = await new Promise((resolve, reject) => {
          this.deepseek.chatStream(
            messages,
            options.onChunk || options.onContentChunk || (() => {}),
            (fullContent, usage) => resolve({ content: fullContent, usage }),
            reject,
            {
              maxTokens: options.maxTokens,
              temperature: options.temperature,
              model: options.model,
              conversationId: options.conversationId,
              signal: options.signal,
              thinking: options.thinking
            }
          )
        })
      } else {
        // 非流式对话
        result = await this.deepseek.chat(messages, {
          maxTokens: options.maxTokens,
          temperature: options.temperature,
          model: options.model,
          conversationId: options.conversationId,
          thinking: options.thinking
        })
      }

      this.recordSuccess(provider)
      return result
    } catch (err) {
      this.recordFailure(provider)

      // AbortError 直接抛出
      if (err.name === 'AbortError') throw err

      // 不可重试的错误直接抛出
      if (err instanceof APIError && !err.isRetryable()) throw err

      // 可重试的错误：尝试回退到 Mock（开发环境或临时用户）
      if (isMockEnabled() || this.mockFallback) {
        this.log('warn', 'fallback_to_mock', { error: err.message })
        return mockChat(messages, options)
      }

      throw err
    }
  }

  /**
   * 联网搜索对话（通过 search-proxy Edge Function）
   *
   * SSE 流中包含两种事件：
   * 1. 状态事件 — { type: 'status', event: 'searching'|'search_done'|'search_failed', ... }
   * 2. DeepSeek 数据块 — { choices: [{ delta: { content|reasoning_content } }], usage? }
   *
   * @param {Array} messages - 消息数组
   * @param {Object} options - 同 chat()，额外支持 onSearchStatus 回调
   * @returns {Promise<{content: string, reasoning?: string, usage?: Object}>}
   */
  async chatWithSearch(messages, options = {}) {
    const supabase = typeof window !== 'undefined' ? window.supabase : null
    if (!supabase || !supabase.auth) {
      throw new APIError(401, '未登录 — Supabase 客户端未初始化', 'auth')
    }

    const { data: { session }, error: sessionErr } = await supabase.auth.getSession()
    if (sessionErr || !session) {
      throw new APIError(401, '未登录或会话已过期', 'auth')
    }

    const response = await fetch(this.proxyUrls.baidu, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        messages,
        options: {
          webSearchEnabled: true,
          model: options.model || 'deepseek-v4-flash',
          maxTokens: options.maxTokens,
          temperature: options.temperature,
          thinking: options.thinking
        }
      }),
      signal: options.signal
    })

    console.log('[iDrome APIRouter] search-proxy 响应状态:', response.status, response.statusText)
    if (!response.ok) {
      const errText = await response.text().catch(() => '')
      console.error('[iDrome APIRouter] search-proxy 返回错误:', response.status, errText)
      throw APIError.fromResponse(response.status, errText)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let fullContent = ''
    let fullReasoning = ''
    let capturedUsage = null
    let capturedSearchResults = null  // 捕获搜索结果

    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        // flush 残留缓冲区
        if (buffer) {
          const trimmed = buffer.trim()
          if (trimmed.startsWith('data: ')) {
            const data = trimmed.slice(6)
            if (data !== '[DONE]') {
              try {
                const parsed = JSON.parse(data)
                if (parsed.type !== 'status') {
                  const delta = parsed.choices?.[0]?.delta
                  if (delta?.content) {
                    fullContent += delta.content
                    options.onChunk?.(delta.content, fullContent)
                  }
                  if (delta?.reasoning_content) {
                    fullReasoning += delta.reasoning_content
                    options.onReasoningChunk?.(delta.reasoning_content, fullReasoning)
                  }
                  if (parsed.usage) capturedUsage = parsed.usage
                }
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

          // 状态事件
          if (parsed.type === 'status') {
            console.log('[iDrome APIRouter] 收到 SSE 状态事件:', parsed.event, '数据长度:', data.length, 'keys:', Object.keys(parsed))
            if (parsed.event === 'searching') {
              options.onSearchStatus?.('searching', parsed)
            } else if (parsed.event === 'search_done') {
              // 捕获搜索结果，供调用方在回答末尾展示
              capturedSearchResults = parsed.results || []
              console.log('[iDrome APIRouter] 搜索完成，结果数:', capturedSearchResults.length, 'count字段:', parsed.count, 'results类型:', Array.isArray(parsed.results) ? 'Array' : typeof parsed.results)
              options.onSearchStatus?.('success', parsed)
            } else if (parsed.event === 'search_failed') {
              console.warn('[iDrome APIRouter] 搜索失败:', parsed.reason)
              options.onSearchStatus?.('failed', parsed)
            } else if (parsed.event === 'error') {
              throw new APIError(500, parsed.message || 'Edge Function 错误', 'server')
            }
            continue
          }

          // DeepSeek 数据块
          const delta = parsed.choices?.[0]?.delta
          if (delta?.content) {
            fullContent += delta.content
            options.onChunk?.(delta.content, fullContent)
          }
          if (delta?.reasoning_content) {
            fullReasoning += delta.reasoning_content
            options.onReasoningChunk?.(delta.reasoning_content, fullReasoning)
          }
          if (parsed.usage) capturedUsage = parsed.usage
        } catch (err) {
          // 如果是 APIError 重新抛出
          if (err instanceof APIError) throw err
          // 其他解析错误 — 记录详细信息用于调试
          console.error('[iDrome APIRouter] SSE 解析失败:', err.message, '数据前200字符:', data.substring(0, 200))
        }
      }
    }

    return {
      content: fullContent,
      reasoning: fullReasoning || undefined,
      usage: capturedUsage,
      searchResults: capturedSearchResults  // 返回搜索结果
    }
  }

  /**
   * 带自动回退的 API 调用
   * @param {string} capability - 能力名称
   * @param {Array} providers - 优先顺序
   * @param {Function} callFn - 实际调用函数
   */
  async callWithFallback(capability, providers, callFn) {
    let lastError = null

    for (const provider of providers) {
      if (!this.healthStatus[provider]) {
        console.warn(`[${capability}] ${provider} 服务不可用，尝试下一个`)
        continue
      }

      try {
        const result = await callFn(provider)
        this.recordSuccess(provider)
        return result
      } catch (err) {
        console.error(`[${capability}] ${provider} 调用失败:`, err.message)
        lastError = err
        this.recordFailure(provider)
      }
    }

    throw lastError || new APIError(503, `[${capability}] 所有服务商均不可用`, 'server')
  }
}

/** 全局单例 */
export const apiRouter = new APIRouterClass()

export default apiRouter
