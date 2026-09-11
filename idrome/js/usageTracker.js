/**
 * iDrome — Token 用量追踪与上下文管理
 *
 * 按设计方案第 17.4 节实现：
 * - 前端 Token 估算（js-tiktoken cl100k_base）
 * - 上下文窗口管理（500K/800K/950K 三级阈值）
 * - 上下文进度条 UI
 * - Token 耗尽警告（使用超过 90% 时提示）
 * - 每次对话完成后显示预估 Token 消耗和费用
 *
 * 约束：
 * - tiktoken 需使用 js-tiktoken@1.0.14 版本并通过 CDN 引入
 */

'use strict'

/** DeepSeek V4-Flash 上下文窗口大小（1M tokens） */
const MAX_CONTEXT_TOKENS = 1_000_000

/** 三级阈值 */
const THRESHOLDS = {
  NORMAL: 500_000,       // < 500K: 正常对话
  WARNING: 800_000,      // 500K-800K: 滑动窗口
  CRITICAL: 950_000      // > 800K: 用户提示，> 950K: 强制截断
}

/** DeepSeek V4-Flash 价格（美元 / 1M tokens） */
const PRICING = {
  INPUT: 0.14,   // $0.14 / 1M input tokens
  OUTPUT: 0.28   // $0.28 / 1M output tokens
}

/** tiktoken 编码器（延迟加载） */
let encoder = null
let encoderLoadingPromise = null

/**
 * 加载 tiktoken 编码器
 * 通过 CDN 引入 js-tiktoken@1.0.14（ESM 动态导入）
 * @returns {Promise<Object|null>}
 */
async function loadEncoder() {
  if (encoder) return encoder
  if (encoderLoadingPromise) return encoderLoadingPromise

  encoderLoadingPromise = (async () => {
    try {
      // 使用 ESM 动态导入（js-tiktoken 仅提供 ESM 构建）
      const tiktokenModule = await import('https://cdn.jsdelivr.net/npm/js-tiktoken@1.0.14/+esm')
      const { getEncoding } = tiktokenModule
      encoder = await getEncoding('cl100k_base')
      console.log('[iDrome Usage] tiktoken 编码器已加载')
      return encoder
    } catch (e) {
      console.warn('[iDrome Usage] tiktoken 加载失败，使用粗略估算:', e.message)
      return null
    }
  })()

  return encoderLoadingPromise
}

/**
 * 估算文本的 Token 数量
 * - 优先使用 tiktoken 精确计算
 * - 失败时使用粗略估算：中文 1 字符 ≈ 1.5 tokens，英文 1 单词 ≈ 1.3 tokens
 * @param {string} text
 * @returns {Promise<number>}
 */
export async function estimateTokens(text) {
  if (!text || typeof text !== 'string') return 0

  // 尝试使用 tiktoken
  const enc = await loadEncoder()
  if (enc) {
    try {
      return enc.encode(text).length
    } catch {
      // 失败则使用粗略估算
    }
  }

  // 粗略估算
  return roughEstimateTokens(text)
}

/**
 * 粗略估算 Token 数量（不依赖 tiktoken）
 * 中文 1 字符 ≈ 1.5 tokens，英文 1 单词 ≈ 1.3 tokens
 * @param {string} text
 * @returns {number}
 */
function roughEstimateTokens(text) {
  if (!text) return 0

  // 中文字符数
  const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length
  // 非中文字符（英文 + 标点 + 数字）
  const nonChinese = text.length - chineseChars
  // 英文单词数（粗略）
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length

  return Math.ceil(chineseChars * 1.5 + englishWords * 1.3 + (nonChinese - englishWords) * 0.5)
}

/**
 * 估算消息列表的总 Token 数
 * @param {Array} messages - 消息数组
 * @returns {Promise<number>}
 */
export async function estimateMessagesTokens(messages) {
  if (!messages || !Array.isArray(messages)) return 0

  let total = 0
  for (const msg of messages) {
    // 每条消息的 overhead（role + 结构）
    total += 4
    if (msg.content) {
      total += await estimateTokens(msg.content)
    }
    if (msg.reasoning) {
      total += await estimateTokens(msg.reasoning)
    }
  }
  // 总 overhead
  total += 3
  return total
}

/**
 * 上下文管理策略
 * @param {Array} messages - 当前消息列表
 * @returns {Promise<{ strategy: string, tokens: number, truncated?: Array }>}
 */
export async function manageContext(messages) {
  const tokens = await estimateMessagesTokens(messages)

  // 正常对话：< 500K
  if (tokens < THRESHOLDS.NORMAL) {
    return { strategy: 'normal', tokens, messages }
  }

  // 滑动窗口：500K-800K，自动移除最早的消息对
  if (tokens < THRESHOLDS.WARNING) {
    const truncated = applySlidingWindow(messages, tokens, THRESHOLDS.NORMAL)
    return { strategy: 'sliding_window', tokens, messages: truncated }
  }

  // 用户提示：> 800K
  if (tokens < THRESHOLDS.CRITICAL) {
    showTokenWarning(tokens, 'warning')
    const truncated = applySlidingWindow(messages, tokens, THRESHOLDS.WARNING)
    return { strategy: 'warning', tokens, messages: truncated }
  }

  // 强制截断：> 950K
  showTokenWarning(tokens, 'critical')
  const truncated = applySlidingWindow(messages, tokens, THRESHOLDS.CRITICAL)
  return { strategy: 'force_truncate', tokens, messages: truncated }
}

/**
 * 滑动窗口 — 移除最早的消息对，保留最近的消息
 * @param {Array} messages
 * @param {number} currentTokens
 * @param {number} targetTokens
 * @returns {Array}
 */
function applySlidingWindow(messages, currentTokens, targetTokens) {
  if (!messages || messages.length <= 2) return messages

  const result = [...messages]
  let tokens = currentTokens

  // 从最早的消息开始移除（保留第一条 system 消息和最后几条）
  while (tokens > targetTokens && result.length > 4) {
    // 找到第一条非 system 消息
    const idx = result.findIndex(m => m.role !== 'system')
    if (idx === -1 || idx >= result.length - 2) break

    const removed = result.splice(idx, 1)[0]
    // 粗略减少 token 数
    if (removed.content) {
      tokens -= roughEstimateTokens(removed.content) + 4
    }
  }

  return result
}

/**
 * 显示 Token 警告
 * @param {number} tokens
 * @param {'warning'|'critical'} level
 */
function showTokenWarning(tokens, level) {
  const percentage = ((tokens / MAX_CONTEXT_TOKENS) * 100).toFixed(1)

  if (level === 'critical') {
    console.warn(`[iDrome Usage] 上下文已严重超限: ${percentage}% (${tokens} tokens)`)
  } else {
    console.warn(`[iDrome Usage] 上下文接近上限: ${percentage}% (${tokens} tokens)`)
  }

  // 通过自定义事件通知 UI
  document.dispatchEvent(new CustomEvent('idrome:token-warning', {
    detail: { tokens, percentage, level }
  }))
}

/**
 * 更新上下文进度条 UI
 * @param {number} tokens
 */
export function updateContextProgress(tokens) {
  const progressBar = document.getElementById('contextProgress')
  const progressText = document.getElementById('contextProgressText')

  if (!progressBar && !progressText) return

  const percentage = Math.min((tokens / MAX_CONTEXT_TOKENS) * 100, 100)
  const displayTokens = tokens >= 1000 ? `${(tokens / 1000).toFixed(1)}K` : `${tokens}`

  if (progressBar) {
    progressBar.style.width = `${percentage}%`

    // 根据使用比例调整颜色
    if (percentage < 50) {
      progressBar.className = 'context-progress-fill normal'
    } else if (percentage < 80) {
      progressBar.className = 'context-progress-fill warning'
    } else {
      progressBar.className = 'context-progress-fill critical'
    }
  }

  if (progressText) {
    progressText.textContent = `${displayTokens} / 1M tokens (${percentage.toFixed(1)}%)`
  }
}

/**
 * 计算单次对话的费用
 * @param {number} promptTokens
 * @param {number} completionTokens
 * @returns {number} 美元
 */
export function calculateCost(promptTokens, completionTokens) {
  const inputCost = (promptTokens / 1_000_000) * PRICING.INPUT
  const outputCost = (completionTokens / 1_000_000) * PRICING.OUTPUT
  return inputCost + outputCost
}

/**
 * 显示单次对话的 Token 消耗和费用
 * @param {Object} usage - { prompt_tokens, completion_tokens, total_tokens }
 */
export function showUsageInfo(usage) {
  if (!usage) return

  const cost = calculateCost(usage.prompt_tokens || 0, usage.completion_tokens || 0)
  const costDisplay = cost < 0.01 ? `$${(cost * 1000).toFixed(4)}‰` : `$${cost.toFixed(4)}`

  console.log(
    `[iDrome Usage] Token 消耗: 输入 ${usage.prompt_tokens || 0} / 输出 ${usage.completion_tokens || 0} / 总计 ${usage.total_tokens || 0} | 费用: ${costDisplay}`
  )

  // 通过自定义事件通知 UI
  document.dispatchEvent(new CustomEvent('idrome:usage-update', {
    detail: { usage, cost }
  }))
}

/**
 * 预估发送前的 Token 消耗
 * @param {Array} messages
 * @returns {Promise<{ tokens: number, estimatedCost: number }>}
 */
export async function estimateBeforeSend(messages) {
  const tokens = await estimateMessagesTokens(messages)
  // 假设输出约为输入的 30%
  const estimatedOutputTokens = Math.ceil(tokens * 0.3)
  const estimatedCost = calculateCost(tokens, estimatedOutputTokens)
  return { tokens, estimatedOutputTokens, estimatedCost }
}

export default {
  estimateTokens,
  estimateMessagesTokens,
  manageContext,
  updateContextProgress,
  calculateCost,
  showUsageInfo,
  estimateBeforeSend,
  MAX_CONTEXT_TOKENS,
  THRESHOLDS
}
