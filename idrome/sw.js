// ============================================================
// iDrome Service Worker — PWA 离线支持
//
// 依据：AI应用设计方案.md 第 15 章 + AI应用分步执行.md 步骤 9
//
// 缓存策略：
// - HTML 文档：网络优先，缓存回退 (idrome-html-v1)
// - CSS / JS / vendor：缓存优先，后台更新 (idrome-static-v1)
// - 图片：缓存优先，定期刷新 (idrome-images-v1)
// - 对话历史快照：缓存优先，同步时更新 (idrome-conversations-v1)
// - Supabase API：不缓存（含敏感用户数据）
// - AI API 请求：不缓存（每次需实时响应）
// - CDN 资源：缓存优先 (idrome-cdn-v1)
//
// 更新策略：SKIP_WAITING + CLIENTS_CLAIM
// ============================================================

const CACHE_VERSIONS = {
  html: 'idrome-html-v6',
  static: 'idrome-static-v11',
  images: 'idrome-images-v2',
  conversations: 'idrome-conversations-v2',
  cdn: 'idrome-cdn-v2'
}

const ALL_CACHES = Object.values(CACHE_VERSIONS)

// 核心资源 — 安装时预缓存（使用相对路径，基于 SW 所在目录解析）
const CORE_ASSETS = [
  './dromai.html',
  './offline.html',
  './manifest.json',
  './css/main.css',
  './css/chat.css',
  './css/navpanel.css',
  './css/settings.css',
  './css/modes.css'
]

// ============================================================
// 安装 — 预缓存核心资源
// ============================================================
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSIONS.static).then((cache) => {
      return cache.addAll(CORE_ASSETS).catch((err) => {
        console.warn('[iDrome SW] 部分核心资源预缓存失败:', err.message)
      })
    })
  )
  // 立即激活，不等旧 SW 释放
  self.skipWaiting()
})

// ============================================================
// 激活 — 清理旧缓存
// ============================================================
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => !ALL_CACHES.includes(name))
          .map((name) => caches.delete(name))
      )
    })
  )
  // 立即控制所有客户端
  self.clients.claim()
})

// ============================================================
// 请求拦截 — 根据资源类型选择缓存策略
// ============================================================
self.addEventListener('fetch', (event) => {
  const request = event.request
  const url = new URL(request.url)

  // ========== 不缓存的请求 ==========
  // Supabase API 请求（含敏感用户数据）
  if (url.hostname.includes('supabase.co')) {
    return
  }

  // DeepSeek / 百度 API 请求（每次需实时响应）
  if (url.hostname.includes('deepseek.com') || url.hostname.includes('baidubce.com')) {
    return
  }

  // 非 GET 请求不缓存
  if (request.method !== 'GET') {
    return
  }

  // ========== HTML 文档 — 网络优先，缓存回退 ==========
  if (request.mode === 'navigate' || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const cloned = response.clone()
          caches.open(CACHE_VERSIONS.html).then((cache) => {
            cache.put(request, cloned)
          })
          return response
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            return cached || caches.match('./offline.html')
          })
        })
    )
    return
  }

  // ========== CSS / JS — 缓存优先，后台更新 ==========
  if (url.pathname.endsWith('.css') || url.pathname.endsWith('.js')) {
    // 本地资源
    if (url.origin === self.location.origin) {
      event.respondWith(
        caches.open(CACHE_VERSIONS.static).then((cache) => {
          return cache.match(request).then((cached) => {
            const fetchPromise = fetch(request).then((response) => {
              cache.put(request, response.clone())
              return response
            }).catch(() => cached)
            return cached || fetchPromise
          })
        })
      )
      return
    }

    // CDN 资源
    if (url.hostname.includes('cdn.jsdelivr.net') || url.hostname.includes('unpkg.com')) {
      event.respondWith(
        caches.open(CACHE_VERSIONS.cdn).then((cache) => {
          return cache.match(request).then((cached) => {
            const fetchPromise = fetch(request).then((response) => {
              cache.put(request, response.clone())
              return response
            }).catch(() => cached)
            return cached || fetchPromise
          })
        })
      )
      return
    }
  }

  // ========== 图片 — 缓存优先 ==========
  if (request.destination === 'image' || url.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)$/i)) {
    event.respondWith(
      caches.open(CACHE_VERSIONS.images).then((cache) => {
        return cache.match(request).then((cached) => {
          const fetchPromise = fetch(request).then((response) => {
            cache.put(request, response.clone())
            return response
          }).catch(() => cached)
          return cached || fetchPromise
        })
      })
    )
    return
  }

  // ========== 其他请求 — 透传 ==========
  // 不拦截，让浏览器正常处理
})

// ============================================================
// 消息通信 — 接收主线程指令
// ============================================================
self.addEventListener('message', (event) => {
  const { type } = event.data || {}

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting()
      break

    case 'CLEAR_CONVERSATIONS_CACHE':
      // 注销时清除对话快照，防止用户 B 看到用户 A 的对话
      caches.delete(CACHE_VERSIONS.conversations).then(() => {
        console.log('[iDrome SW] 对话缓存已清除')
      })
      break

    case 'CLEAR_ALL_CACHES':
      // 注销时清除所有缓存
      Promise.all(ALL_CACHES.map((name) => caches.delete(name))).then(() => {
        console.log('[iDrome SW] 所有缓存已清除')
      })
      break

    case 'CACHE_CONVERSATIONS':
      // 缓存对话快照（供离线浏览）
      if (event.data.payload) {
        caches.open(CACHE_VERSIONS.conversations).then((cache) => {
          const response = new Response(JSON.stringify(event.data.payload))
          cache.put('/idrome/conversations-snapshot', response)
        })
      }
      break
  }
})
