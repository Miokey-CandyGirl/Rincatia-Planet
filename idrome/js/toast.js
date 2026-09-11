/**
 * iDrome — 通用 Toast 提示组件
 *
 * 按设计方案第 8.3 节实现：
 * - toast-success：底部弹出，叶绿 #5B8C5A 背景
 * - toast-error：底部弹出，红色 #EA4335 背景
 * - toast-warning：底部弹出，黄色 #FBBC04 背景
 * - toast-info：底部弹出，智慧蓝 #2C5F8A 背景
 * - 动画：从底部滑入 + 淡入 300ms，消失时淡出 300ms
 * - 2 秒后自动消失（可配置）
 */

'use strict'

/** Toast 容器 ID */
const TOAST_CONTAINER_ID = 'toastContainer'

/** SVG 图标映射 */
const TOAST_ICONS = {
  success: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  error: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
  warning: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  info: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
}

/**
 * 获取或创建 Toast 容器
 * @returns {HTMLElement}
 */
function getContainer() {
  let container = document.getElementById(TOAST_CONTAINER_ID)
  if (!container) {
    container = document.createElement('div')
    container.id = TOAST_CONTAINER_ID
    container.className = 'toast-container'
    container.setAttribute('role', 'region')
    container.setAttribute('aria-label', '通知')
    document.body.appendChild(container)
  }
  return container
}

/**
 * 显示 Toast 提示
 * @param {string} message - 提示消息
 * @param {'success'|'error'|'warning'|'info'} type - 提示类型
 * @param {number} duration - 显示时长（毫秒），默认 2000
 * @returns {HTMLElement} Toast 元素
 */
export function showToast(message, type = 'info', duration = 2000) {
  const container = getContainer()

  const toast = document.createElement('div')
  toast.className = `toast toast-${type}`
  toast.setAttribute('role', 'status')
  toast.setAttribute('aria-live', 'polite')

  const icon = TOAST_ICONS[type] || TOAST_ICONS.info
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-text">${escapeHtml(message)}</span>
  `

  container.appendChild(toast)

  // 触发动画
  requestAnimationFrame(() => {
    toast.classList.add('show')
  })

  // 自动消失
  if (duration > 0) {
    setTimeout(() => {
      dismissToast(toast)
    }, duration)
  }

  return toast
}

/**
 * 手动关闭 Toast
 * @param {HTMLElement} toast
 */
export function dismissToast(toast) {
  if (!toast || !toast.parentNode) return
  toast.classList.remove('show')
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast)
    }
  }, 300)
}

/**
 * 安全转义 HTML
 * @param {string} text
 * @returns {string}
 */
function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = String(text)
  return div.innerHTML
}

export default { showToast, dismissToast }
