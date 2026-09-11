/* ==========================================
   琳凯蒂亚语在线词典 — Service Worker
   版本: v1.0.0
   ========================================== */

const CACHE_NAME = 'lincatian-dict-cache-v1.0.0'
const CACHE_IMAGE = 'lincatian-dict-images-v1.0.0'

// 预缓存核心静态资源列表
const PRECACHE_URLS = [
  '/dictionary/dictionary.html',
  '/dictionary/offline.html',
  '/dictionary/manifest.json',
  '/flag_logo.png',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js',
  'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
  'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'
]

// 图片缓存过期时间：7天（毫秒）
const IMAGE_MAX_AGE = 7 * 24 * 60 * 60 * 1000

// ===== 工具函数 =====

function isHtmlRequest(request) {
  return request.destination === 'document' ||
    request.headers.get('accept')?.includes('text/html')
}

function isStaticAsset(request) {
  const dest = request.destination
  return dest === 'style' || dest === 'script' || dest === 'font'
}

function isImageRequest(request) {
  return request.destination === 'image'
}

function isThirdParty(url) {
  try {
    return new URL(url).origin !== self.location.origin
  } catch {
    return true
  }
}

// ===== 安装事件 =====
self.addEventListener('install', (event) => {
  console.log('[SW] 安装中 v1.0.0...')
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME)
        console.log('[SW] 预缓存核心资源:', PRECACHE_URLS.length, '个')
        await cache.addAll(PRECACHE_URLS)
        console.log('[SW] 预缓存完成')
      } catch (err) {
        console.error('[SW] 预缓存部分资源失败:', err.message)
        // 部分失败不阻塞安装，后续 fetch 会尝试网络请求
      }
      // 立即激活，不等待旧 SW 释放页面
      await self.skipWaiting()
      console.log('[SW] skipWaiting 完成，新 SW 已立即激活')
    })()
  )
})

// ===== 激活事件 =====
self.addEventListener('activate', (event) => {
  console.log('[SW] 激活中 v1.0.0...')
  event.waitUntil(
    (async () => {
      try {
        // 清理旧版本缓存
        const cacheNames = await caches.keys()
        const validCaches = [CACHE_NAME, CACHE_IMAGE]
        const deleted = []
        for (const name of cacheNames) {
          if (!validCaches.includes(name)) {
            await caches.delete(name)
            deleted.push(name)
          }
        }
        if (deleted.length > 0) {
          console.log('[SW] 已清理旧缓存:', deleted.join(', '))
        } else {
          console.log('[SW] 无需清理旧缓存')
        }
      } catch (err) {
        console.error('[SW] 清理缓存时出错:', err.message)
      }

      // 立即接管所有打开的页面
      await self.clients.claim()
      console.log('[SW] clients.claim 完成，已接管所有页面')
    })()
  )
})

// ===== 请求拦截 =====
self.addEventListener('fetch', (event) => {
  const { request } = event

  // 跳过非 GET 请求
  if (request.method !== 'GET') return

  // 跳过 chrome-extension 等非 http(s) 协议
  const url = new URL(request.url)
  if (!url.protocol.startsWith('http')) return

  // 跳过 Supabase API 请求（含用户数据的响应不应缓存）
  if (url.hostname.includes('supabase.co')) return

  // HTML 文档：网络优先，缓存回退
  if (isHtmlRequest(request) && !isThirdParty(request.url)) {
    event.respondWith(networkFirst(request))
    return
  }

  // CSS / JS / 字体：缓存优先，网络回退
  if (isStaticAsset(request)) {
    event.respondWith(cacheFirst(request))
    return
  }

  // 图片：缓存优先，定期更新
  if (isImageRequest(request)) {
    event.respondWith(cacheFirstWithRefresh(request))
    return
  }

  // 其他同源请求：网络优先，缓存回退
  if (!isThirdParty(request.url)) {
    event.respondWith(networkFirst(request))
    return
  }
})

// ===== 缓存策略 =====

// 网络优先，缓存回退（适用于 HTML 文档）
async function networkFirst(request) {
  try {
    const response = await fetch(request)
    // 缓存成功响应（仅同源资源）
    if (response.ok && !isThirdParty(request.url)) {
      try {
        const cache = await caches.open(CACHE_NAME)
        cache.put(request, response.clone())
      } catch (err) {
        console.warn('[SW] 缓存写入失败:', err.message)
      }
    }
    return response
  } catch (err) {
    console.warn('[SW] 网络请求失败，尝试缓存回退:', request.url)
    try {
      const cached = await caches.match(request)
      if (cached) {
        console.log('[SW] 缓存命中:', request.url)
        return cached
      }
    } catch (cacheErr) {
      console.error('[SW] 缓存读取失败:', cacheErr.message)
    }
    // 网络和缓存均失败，返回离线回退页面
    return offlineFallback(request)
  }
}

// 缓存优先，网络回退（适用于 CSS / JS / 字体）
async function cacheFirst(request) {
  try {
    const cached = await caches.match(request)
    if (cached) {
      // 后台更新缓存（stale-while-revalidate）
      updateCache(request)
      return cached
    }
  } catch (err) {
    console.warn('[SW] 缓存读取失败:', err.message)
  }

  // 缓存未命中，请求网络
  try {
    const response = await fetch(request)
    if (response.ok) {
      try {
        const cache = await caches.open(CACHE_NAME)
        cache.put(request, response.clone())
      } catch (err) {
        console.warn('[SW] 缓存写入失败:', err.message)
      }
    }
    return response
  } catch (err) {
    console.warn('[SW] 网络请求失败，无缓存可用:', request.url)
    // 对于 CSS/JS/字体，返回空响应（避免页面崩溃）
    return new Response('', { status: 408, statusText: 'Request Timeout' })
  }
}

// 缓存优先 + 定期刷新（适用于图片）
async function cacheFirstWithRefresh(request) {
  try {
    const cached = await caches.match(request)
    if (cached) {
      // 检查缓存是否过期
      try {
        const cache = await caches.open(CACHE_IMAGE)
        const keys = await cache.keys()
        const matchedKey = keys.find(k => k.url === request.url)
        if (matchedKey) {
          const cachedResponse = await cache.match(matchedKey)
          const dateHeader = cachedResponse?.headers.get('sw-cached-date')
          if (dateHeader) {
            const age = Date.now() - parseInt(dateHeader)
            if (age > IMAGE_MAX_AGE) {
              // 缓存已过期，后台更新
              updateImageCache(request)
            }
          }
        }
      } catch { /* 时间检查失败，继续使用缓存 */ }
      return cached
    }
  } catch (err) {
    console.warn('[SW] 图片缓存读取失败:', err.message)
  }

  // 缓存未命中，请求网络
  try {
    const response = await fetch(request)
    if (response.ok) {
      try {
        const cache = await caches.open(CACHE_IMAGE)
        const cachedResponse = response.clone()
        // 添加自定义缓存时间头
        const headers = new Headers(cachedResponse.headers)
        headers.set('sw-cached-date', Date.now().toString())
        const timedResponse = new Response(cachedResponse.body, {
          status: cachedResponse.status,
          statusText: cachedResponse.statusText,
          headers: headers
        })
        cache.put(request, timedResponse)
      } catch (err) {
        console.warn('[SW] 图片缓存写入失败:', err.message)
      }
    }
    return response
  } catch (err) {
    console.warn('[SW] 图片网络请求失败，返回占位:', err.message)
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect fill="#1a1a2e" width="200" height="200"/><text fill="#5a5a7a" font-family="sans-serif" font-size="14" text-anchor="middle" x="100" y="105">图片加载失败</text></svg>',
      { status: 200, headers: { 'Content-Type': 'image/svg+xml' } }
    )
  }
}

// 后台更新缓存（stale-while-revalidate）
async function updateCache(request) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, response)
    }
  } catch {
    // 静默失败，不影响用户体验
  }
}

// 后台更新图片缓存
async function updateImageCache(request) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(CACHE_IMAGE)
      const headers = new Headers(response.headers)
      headers.set('sw-cached-date', Date.now().toString())
      const timedResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: headers
      })
      cache.put(request, timedResponse)
    }
  } catch {
    // 静默失败
  }
}

// 离线回退
async function offlineFallback(request) {
  // 如果是 HTML 请求，返回离线页面
  if (isHtmlRequest(request)) {
    try {
      const cache = await caches.open(CACHE_NAME)
      const offlinePage = await cache.match('/dictionary/offline.html')
      if (offlinePage) return offlinePage
    } catch (err) {
      console.error('[SW] 离线页面获取失败:', err.message)
    }
    // 兜底：返回简单 HTML
    return new Response(
      '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>离线</title><style>body{font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#0f0f1a;color:#e0e0e0;text-align:center}</style></head><body><div><h1 style="color:#ffd700">琳凯蒂亚语词典</h1><p>当前离线，请检查网络连接</p><button onclick="location.reload()" style="margin-top:1rem;padding:0.6rem 1.5rem;border:1px solid #7b9fff;border-radius:8px;background:rgba(123,159,255,0.15);color:#7b9fff;font-size:1rem;cursor:pointer">重试</button></div></body></html>',
      { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    )
  }

  // 非 HTML 请求返回 JSON 占位
  return new Response(
    JSON.stringify({ error: 'offline', message: '当前处于离线状态，该资源不可用' }),
    { status: 503, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
  )
}

// ===== 消息监听（用于主页面与 SW 通信） =====
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    console.log('[SW] 收到 SKIP_WAITING 消息，立即激活')
    self.skipWaiting()
  }
  if (event.data?.type === 'GET_VERSION') {
    event.ports[0]?.postMessage({ version: 'v1.0.0' })
  }
})