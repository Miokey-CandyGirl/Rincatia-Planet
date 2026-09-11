/**
 * iDrome — 域名跳转优化工具
 *
 * 功能：当 .top 域名无法访问时，自动尝试相同前缀的 .com 或 .cn 域名
 * 适用场景：外部链接跳转、API 请求回退
 *
 * 使用方式：
 *   import { navigateWithFallback, fetchWithFallback } from './domainFallback.js'
 *   await navigateWithFallback('https://lytalk.rincatian.top')
 */

'use strict'

/** 支持的顶级域（按优先级排序） */
const SUPPORTED_TLDS = ['.top', '.com', '.cn']

/** 域名探测缓存（避免重复探测） */
const probeCache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 分钟缓存

/**
 * 从 URL 中提取域名和顶级域
 */
function parseUrl(url) {
  try {
    const parsed = new URL(url)
    const hostname = parsed.hostname
    for (const tld of SUPPORTED_TLDS) {
      if (hostname.endsWith(tld)) {
        const base = hostname.slice(0, -tld.length)
        return {
          base,
          tld,
          hostname,
          path: parsed.pathname + parsed.search + parsed.hash,
          protocol: parsed.protocol
        }
      }
    }
    return null
  } catch {
    return null
  }
}

/**
 * 生成备用域名列表
 * 如 'lytalk.rincatian.top' → ['lytalk.rincatian.top', 'lytalk.rincatian.com', 'lytalk.rincatian.cn']
 */
export function getFallbackUrls(url) {
  const parsed = parseUrl(url)
  if (!parsed) return [url]

  const urls = []
  for (const tld of SUPPORTED_TLDS) {
    urls.push(`${parsed.protocol}//${parsed.base}${tld}${parsed.path}`)
  }
  return urls
}

/**
 * 探测 URL 是否可访问（HEAD 请求，超时 3 秒）
 */
export async function probeUrl(url, timeout = 3000) {
  const cached = probeCache.get(url)
  if (cached && Date.now() - cached.time < CACHE_TTL) {
    return cached.available
  }

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeout)
    const response = await fetch(url, {
      method: 'HEAD',
      mode: 'no-cors',
      signal: controller.signal,
      redirect: 'follow'
    })
    clearTimeout(timer)
    const available = response.type === 'opaque' || response.ok
    probeCache.set(url, { available, time: Date.now() })
    return available
  } catch {
    probeCache.set(url, { available: false, time: Date.now() })
    return false
  }
}

/**
 * 导航到 URL（带域名回退）
 * 先探测 .top 域名，不可用则尝试 .com → .cn
 */
export async function navigateWithFallback(url, newWindow = true) {
  const fallbackUrls = getFallbackUrls(url)

  // 并行探测所有域名
  const probeResults = await Promise.all(
    fallbackUrls.map(u => probeUrl(u).then(available => ({ url: u, available })))
  )

  const firstAvailable = probeResults.find(r => r.available)
  if (firstAvailable) {
    if (newWindow) {
      window.open(firstAvailable.url, '_blank', 'noopener,noreferrer')
    } else {
      window.location.href = firstAvailable.url
    }
    return firstAvailable.url
  }

  // 全部探测失败 — 仍尝试打开原始 URL（探测可能因 CORS 误判）
  console.warn('[domainFallback] 所有域名探测失败，尝试直接打开:', url)
  if (newWindow) {
    window.open(url, '_blank', 'noopener,noreferrer')
  } else {
    window.location.href = url
  }
  return url
}

/**
 * fetch 请求（带域名回退）
 * 网络错误时自动尝试下一个域名
 */
export async function fetchWithFallback(url, options = {}) {
  const fallbackUrls = getFallbackUrls(url)

  let lastError = null
  for (const tryUrl of fallbackUrls) {
    try {
      return await fetch(tryUrl, options)
    } catch (err) {
      console.warn(`[domainFallback] 请求失败，尝试下一个域名: ${tryUrl}`, err.message)
      lastError = err
    }
  }

  throw lastError || new Error(`所有域名均不可用: ${url}`)
}

export default {
  getFallbackUrls,
  probeUrl,
  navigateWithFallback,
  fetchWithFallback
}
