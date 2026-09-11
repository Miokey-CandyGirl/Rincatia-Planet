/**
 * iDrome — 统一错误处理模块
 *
 * 按设计方案第 4.6 节和第 23 章实现：
 * - APIError 统一错误分类（network / auth / budget / rate_limit / server）
 * - 指数退避重试（max 3 次，base 1s）
 * - 错误 UI 渲染（消息气泡内显示错误 + 重试按钮）
 * - 用户友好的错误消息
 */

'use strict'

/**
 * API 错误类 — 统一错误分类
 */
export class APIError extends Error {
  /**
   * @param {number} status - HTTP 状态码
   * @param {string} message - 错误消息
   * @param {string} type - 错误类型: network | auth | budget | rate_limit | server | unknown
   */
  constructor(status, message, type = 'unknown') {
    super(message)
    this.name = 'APIError'
    this.status = status
    this.type = type
  }

  /**
   * 从 HTTP 响应构造 APIError
   * @param {number} status - HTTP 状态码
   * @param {string} responseText - 响应正文
   * @returns {APIError}
   */
  static fromResponse(status, responseText) {
    let message = responseText
    let type = 'unknown'

    try {
      const parsed = JSON.parse(responseText)
      message = parsed.error || parsed.message || responseText
      if (parsed.code === 'BUDGET_EXCEEDED') type = 'budget'
    } catch {
      // 非 JSON 响应
    }

    // 根据状态码分类
    if (status === 0 || status === -1) {
      type = 'network'
      message = '网络连接失败，请检查网络后重试'
    } else if (status === 401 || status === 403) {
      type = 'auth'
      message = message || '登录已过期，请重新登录'
    } else if (status === 429) {
      type = message.includes('预算') ? 'budget' : 'rate_limit'
      message = message || '请求过于频繁，请稍后再试'
    } else if (status >= 500) {
      type = 'server'
      message = message || '服务器暂时不可用，请稍后重试'
    }

    return new APIError(status, message, type)
  }

  /**
   * 判断是否可重试
   */
  isRetryable() {
    return this.type === 'network' || this.type === 'server' || this.type === 'rate_limit'
  }

  /**
   * 获取用户友好的错误消息
   */
  getUserMessage() {
    switch (this.type) {
      case 'network':
        return '网络连接失败，请检查网络后重试'
      case 'auth':
        return '登录已过期，请重新登录'
      case 'budget':
        return '月度预算已超限，请下月再试或联系管理员'
      case 'rate_limit':
        return '请求过于频繁，请稍后再试'
      case 'server':
        return '服务器暂时不可用，请稍后重试'
      default:
        return this.message || '未知错误，请重试'
    }
  }
}

/**
 * 指数退避重试
 * @param {Function} fn - 要重试的异步函数
 * @param {Object} options - { maxRetries, baseDelay, signal }
 * @returns {Promise<any>}
 */
export async function retryWithBackoff(fn, options = {}) {
  const { maxRetries = 3, baseDelay = 1000, signal } = options
  let lastError = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    // 检查中断信号
    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError')
    }

    try {
      return await fn(attempt)
    } catch (err) {
      lastError = err

      // AbortError 不重试
      if (err.name === 'AbortError') throw err

      // APIError 且不可重试
      if (err instanceof APIError && !err.isRetryable()) throw err

      // 最后一次尝试不再等待
      if (attempt === maxRetries) throw err

      // 指数退避：base * 2^attempt + 随机抖动
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 500
      console.warn(`[iDrome Error] 第 ${attempt + 1} 次重试，${delay.toFixed(0)}ms 后重试...`)

      await new Promise((resolve, reject) => {
        const timer = setTimeout(resolve, delay)
        if (signal) {
          signal.addEventListener('abort', () => {
            clearTimeout(timer)
            reject(new DOMException('Aborted', 'AbortError'))
          }, { once: true })
        }
      })
    }
  }

  throw lastError
}

/**
 * 在消息气泡内渲染错误信息 + 重试按钮
 * @param {HTMLElement} container - 消息列表容器
 * @param {Error} error - 错误对象
 * @param {Function} onRetry - 重试回调
 */
export function renderErrorBubble(container, error, onRetry) {
  if (!container) return

  const apiError = error instanceof APIError ? error : new APIError(0, error.message, 'unknown')
  const userMessage = apiError.getUserMessage()
  const canRetry = apiError.isRetryable()

  const errorEl = document.createElement('div')
  errorEl.className = 'message-item assistant error-message'
  errorEl.setAttribute('role', 'alert')
  errorEl.innerHTML = `
    <div class="message-bubble error-bubble">
      <div class="error-content">
        <svg class="error-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span class="error-text">${escapeHtml(userMessage)}</span>
      </div>
      ${canRetry ? `
        <button class="error-retry-btn" type="button">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="23 4 23 10 17 10"/>
            <polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          重试
        </button>
      ` : ''}
    </div>
  `

  if (canRetry && onRetry) {
    const retryBtn = errorEl.querySelector('.error-retry-btn')
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        errorEl.remove()
        onRetry()
      })
    }
  }

  container.appendChild(errorEl)
}

/**
 * 安全转义 HTML
 */
function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = String(text)
  return div.innerHTML
}

export default {
  APIError,
  retryWithBackoff,
  renderErrorBubble
}
