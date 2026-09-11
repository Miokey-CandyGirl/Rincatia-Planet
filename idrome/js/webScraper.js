/**
 * iDrome — 网页内容抓取前端模块
 *
 * 配合百度搜索 API 和 web-scraper Edge Function 使用
 * 提供以下功能：
 * - scrapeUrl(url, options) — 抓取单个 URL 内容
 * - scrapeBatch(urls, options) — 批量抓取多个 URL
 * - searchAndScrape(query, options) — 搜索并抓取 top N 结果
 * - extractContent(url) — 快速提取纯文本内容
 *
 * 所有请求通过 Edge Function 代理，前端不直接接触目标网站
 */

'use strict'

import { showToast } from './toast.js'

// ==================== 配置 ====================

/** Edge Function 基础 URL */
const FUNCTION_BASE = (typeof window !== 'undefined' && window.IDROME_CONFIG)
  ? `${window.IDROME_CONFIG.supabaseUrl}/functions/v1`
  : 'https://kbbtsurqznyyqfoaoutt.supabase.co/functions/v1'

/** 默认抓取选项 */
const DEFAULT_OPTIONS = {
  format: 'markdown',       // 输出格式：text | markdown | json
  maxLength: 30000,         // 最大内容长度
  extractMetadata: true,    // 是否提取元数据
  extractLinks: false,      // 是否提取链接
  extractImages: false,     // 是否提取图片
  retry: 3,                 // 重试次数
  timeout: 15000            // 超时（毫秒）
}

// ==================== 工具函数 ====================

/**
 * 获取认证 token
 */
function getAuthToken() {
  try {
    // 从 localStorage 获取 Supabase session token
    const keys = Object.keys(localStorage).filter(k => k.includes('auth-token'))
    for (const key of keys) {
      const stored = localStorage.getItem(key)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.access_token) return parsed.access_token
      }
    }
  } catch (e) {
    console.warn('[webScraper] 获取认证 token 失败:', e.message)
  }
  return null
}

/**
 * 调用 Edge Function
 */
async function callEdgeFunction(action, payload) {
  const token = getAuthToken()
  if (!token) {
    throw new Error('未登录，请先登录后再使用抓取功能')
  }

  const response = await fetch(`${FUNCTION_BASE}/web-scraper`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    throw new Error(errData.error || errData.detail || `请求失败 (${response.status})`)
  }

  return response.json()
}

// ==================== 公共 API ====================

/**
 * 抓取单个 URL 的内容
 * @param {string} url - 目标 URL
 * @param {Object} [options] - 抓取选项
 * @param {string} [options.format='markdown'] - 输出格式：text | markdown | json
 * @param {number} [options.maxLength=30000] - 最大内容长度
 * @param {boolean} [options.extractMetadata=true] - 是否提取元数据
 * @param {boolean} [options.extractLinks=false] - 是否提取链接
 * @param {boolean} [options.extractImages=false] - 是否提取图片
 * @param {number} [options.retry=3] - 重试次数
 * @param {number} [options.timeout=15000] - 超时（毫秒）
 * @returns {Promise<Object>} 抓取结果 { title, description, content, url, fetchedAt, format, wordCount }
 */
export async function scrapeUrl(url, options = {}) {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options }

  console.log(`[webScraper] 抓取 URL: ${url} (格式: ${mergedOptions.format})`)

  try {
    const result = await callEdgeFunction('scrape', {
      url,
      options: mergedOptions
    })

    console.log(`[webScraper] 抓取成功: ${result.title || '无标题'} (${result.wordCount} 字符)`)
    return result
  } catch (err) {
    console.error(`[webScraper] 抓取失败: ${url}`, err.message)
    throw err
  }
}

/**
 * 批量抓取多个 URL
 * @param {string[]} urls - URL 数组（最多 20 个）
 * @param {Object} [options] - 抓取选项（同 scrapeUrl）
 * @param {number} [options.concurrency=3] - 并发数
 * @returns {Promise<Object>} { results, total, success, failed }
 */
export async function scrapeBatch(urls, options = {}) {
  if (!Array.isArray(urls) || urls.length === 0) {
    throw new Error('URL 列表不能为空')
  }

  if (urls.length > 20) {
    throw new Error('批量抓取最多支持 20 个 URL')
  }

  const mergedOptions = { ...DEFAULT_OPTIONS, ...options }
  console.log(`[webScraper] 批量抓取 ${urls.length} 个 URL`)

  const result = await callEdgeFunction('batch', {
    urls,
    options: mergedOptions
  })

  console.log(`[webScraper] 批量抓取完成: 成功 ${result.success}/${result.total}`)
  return result
}

/**
 * 快速提取纯文本内容
 * @param {string} url - 目标 URL
 * @param {number} [maxLength=10000] - 最大长度
 * @returns {Promise<string>} 纯文本内容
 */
export async function extractContent(url, maxLength = 10000) {
  const result = await scrapeUrl(url, {
    format: 'text',
    maxLength,
    extractMetadata: false,
    extractLinks: false,
    extractImages: false,
    retry: 2,
    timeout: 10000
  })
  return result.content
}

/**
 * 搜索并抓取 — 先通过百度搜索获取结果，再抓取 top N 结果的完整内容
 * @param {string} query - 搜索查询
 * @param {Object} [options] - 选项
 * @param {number} [options.topN=3] - 抓取前 N 条结果的完整内容
 * @param {number} [options.maxLength=10000] - 每条结果最大内容长度
 * @param {boolean} [options.showProgress=true] - 是否显示进度提示
 * @returns {Promise<Object>} { query, searchResults, scrapedContents }
 */
export async function searchAndScrape(query, options = {}) {
  const {
    topN = 3,
    maxLength = 10000,
    showProgress = true
  } = options

  if (showProgress) {
    showToast('正在搜索...', 'info', 2000)
  }

  console.log(`[webScraper] 搜索并抓取: "${query}" (top ${topN})`)

  // 1. 调用搜索 API 获取搜索结果
  // 通过现有的 search-proxy 获取搜索结果（非流式模式）
  const searchResponse = await fetch(`${FUNCTION_BASE}/search-proxy`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify({
      messages: [{ role: 'user', content: query }],
      options: { webSearchEnabled: true, stream: false }
    })
  })

  if (!searchResponse.ok) {
    throw new Error(`搜索请求失败 (${searchResponse.status})`)
  }

  // 由于 search-proxy 返回 SSE 流，需要解析搜索结果
  // 这里使用更简单的方式：直接调用百度搜索 API 的简化版本
  // 或者从 SSE 流中提取搜索结果事件
  const searchResults = await parseSearchResultsFromSSE(searchResponse)

  if (!searchResults || searchResults.length === 0) {
    if (showProgress) showToast('未找到搜索结果', 'warning', 2000)
    return { query, searchResults: [], scrapedContents: [] }
  }

  if (showProgress) {
    showToast(`找到 ${searchResults.length} 条结果，正在抓取前 ${topN} 条...`, 'info', 2000)
  }

  // 2. 抓取 top N 结果的完整内容
  const topUrls = searchResults.slice(0, topN).map(r => r.url).filter(Boolean)
  const scrapedContents = []

  for (let i = 0; i < topUrls.length; i++) {
    try {
      if (showProgress) {
        showToast(`抓取中 (${i + 1}/${topUrls.length})...`, 'info', 1500)
      }
      const content = await scrapeUrl(topUrls[i], {
        format: 'markdown',
        maxLength,
        extractMetadata: true,
        retry: 2,
        timeout: 12000
      })
      scrapedContents.push({
        ...content,
        searchRank: i + 1,
        searchTitle: searchResults[i].title
      })
    } catch (err) {
      console.warn(`[webScraper] 抓取第 ${i + 1} 条结果失败:`, err.message)
      scrapedContents.push({
        url: topUrls[i],
        searchRank: i + 1,
        searchTitle: searchResults[i].title,
        error: err.message
      })
    }
  }

  if (showProgress) {
    const successCount = scrapedContents.filter(c => !c.error).length
    showToast(`抓取完成: ${successCount}/${topN} 成功`, 'success', 2000)
  }

  return { query, searchResults, scrapedContents }
}

/**
 * 从 SSE 流中解析搜索结果
 */
async function parseSearchResultsFromSSE(response) {
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let searchResults = []

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.startsWith('data: ') && trimmed !== 'data: [DONE]') {
        try {
          const parsed = JSON.parse(trimmed.slice(6))
          if (parsed.type === 'status' && parsed.event === 'search_done' && parsed.results) {
            searchResults = parsed.results
          }
        } catch { /* 忽略解析错误 */ }
      }
    }
  }

  return searchResults
}

/**
 * 将抓取的内容格式化为 AI 上下文
 * @param {Object} scrapeResult - scrapeUrl 返回的结果
 * @returns {string} 格式化的上下文文本
 */
export function formatAsContext(scrapeResult) {
  if (!scrapeResult) return ''

  let text = `## 网页内容：${scrapeResult.title || '无标题'}\n`
  text += `**来源**: ${scrapeResult.url}\n`
  if (scrapeResult.description) {
    text += `**摘要**: ${scrapeResult.description}\n`
  }
  if (scrapeResult.fetchedAt) {
    text += `**抓取时间**: ${scrapeResult.fetchedAt}\n`
  }
  text += `\n### 正文内容\n\n${scrapeResult.content}\n`

  return text
}

/**
 * 将多个抓取结果格式化为 AI 上下文
 * @param {Array} scrapeResults - scrapeUrl 返回的结果数组
 * @returns {string} 格式化的上下文文本
 */
export function formatBatchAsContext(scrapeResults) {
  if (!Array.isArray(scrapeResults) || scrapeResults.length === 0) return ''

  return scrapeResults.map((r, i) => {
    if (r.error) {
      return `### 来源 ${i + 1}（抓取失败）\nURL: ${r.url}\n错误: ${r.error}\n`
    }
    return `### 来源 ${i + 1}\n${formatAsContext(r)}`
  }).join('\n---\n\n')
}

// 全局导出
if (typeof window !== 'undefined') {
  window.iDromeWebScraper = {
    scrapeUrl,
    scrapeBatch,
    extractContent,
    searchAndScrape,
    formatAsContext,
    formatBatchAsContext
  }
}
