/**
 * iDrome — 网络状态检测模块
 *
 * 按设计方案第 4.8 节和第 8.3 节实现：
 * - 监听 online / offline 事件
 * - 断网时顶部显示黄色横幅 #FBBC04 + 输入框禁用
 * - 恢复网络时隐藏横幅 + 恢复输入框
 * - 步骤 9 的离线写入队列复用此组件的横幅 UI
 */

'use strict'

/** 网络状态回调列表 */
const listeners = []

/** 当前网络状态 */
let isOnline = navigator.onLine

/**
 * 初始化网络状态监控
 * @param {Object} options - { onOnline, onOffline }
 */
export function initNetworkMonitor(options = {}) {
  const banner = document.getElementById('networkBanner')
  const inputArea = document.querySelector('.input-area')

  /**
   * 更新网络状态 UI
   */
  function updateStatus() {
    isOnline = navigator.onLine

    if (!isOnline) {
      // 断网：显示黄色横幅 + 禁用输入框
      if (banner) {
        banner.style.display = 'block'
        banner.innerHTML = `
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align: middle; margin-right: 6px; flex-shrink: 0;">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <span>网络已断开，请检查网络连接</span>
        `
        banner.className = 'network-banner offline'
      }

      if (inputArea) {
        inputArea.classList.add('disabled')
      }

      console.warn('[iDrome Network] 网络已断开')
      options.onOffline?.()
    } else {
      // 恢复网络：隐藏横幅 + 恢复输入框
      if (banner) {
        banner.style.display = 'none'
        banner.className = 'network-banner'
      }

      if (inputArea) {
        inputArea.classList.remove('disabled')
      }

      console.log('[iDrome Network] 网络已恢复')
      options.onOnline?.()
    }

    // 通知所有监听器
    listeners.forEach(fn => {
      try { fn(isOnline) } catch (e) { /* 忽略 */ }
    })
  }

  // 监听 online / offline 事件
  window.addEventListener('online', updateStatus)
  window.addEventListener('offline', updateStatus)

  // 初始检查
  updateStatus()

  console.log('[iDrome Network] 网络监控已初始化，当前状态:', isOnline ? '在线' : '离线')
}

/**
 * 添加网络状态变化监听器
 * @param {Function} callback - 回调函数 (isOnline: boolean) => void
 * @returns {Function} 移除监听器的函数
 */
export function onNetworkChange(callback) {
  listeners.push(callback)
  return () => {
    const idx = listeners.indexOf(callback)
    if (idx >= 0) listeners.splice(idx, 1)
  }
}

/**
 * 获取当前网络状态
 * @returns {boolean}
 */
export function getNetworkStatus() {
  return isOnline
}

/**
 * 检测网络质量（通过测量请求延迟）
 * @returns {Promise<'good'|'poor'|'offline'>}
 */
export async function checkNetworkQuality() {
  if (!navigator.onLine) return 'offline'

  try {
    const start = Date.now()
    // 向 Edge Function 发送健康检查请求
    const supabaseUrl =
      (typeof window !== 'undefined' && window.IDROME_CONFIG?.supabaseUrl) ||
      'https://kbbtsurqznyyqfoaoutt.supabase.co'
    await fetch(`${supabaseUrl}/functions/v1/chat-proxy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'healthcheck' })
    })
    const latency = Date.now() - start

    return latency < 2000 ? 'good' : 'poor'
  } catch {
    return 'poor'
  }
}

export default {
  initNetworkMonitor,
  onNetworkChange,
  getNetworkStatus,
  checkNetworkQuality
}
