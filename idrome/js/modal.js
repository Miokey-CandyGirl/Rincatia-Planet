/**
 * iDrome — 应用内置弹窗组件
 *
 * 替代浏览器原生 alert / confirm / prompt，提供：
 * - showModalAlert(message, options) → Promise<void>
 * - showModalConfirm(message, options) → Promise<boolean>
 * - showModalPrompt(message, defaultValue, options) → Promise<string|null>
 *
 * 特性：
 * - Promise 化设计，不阻塞主线程
 * - 主题适配（使用 CSS 变量）
 * - 键盘交互（Enter 确认 / Esc 取消）
 * - 多弹窗堆叠支持
 * - 焦点管理（打开时聚焦输入框/按钮，关闭后归还焦点）
 * - 动画过渡（淡入 + 缩放）
 */

'use strict'

/* ============================================================
 * 弹窗状态管理
 * ============================================================ */

/** 当前活跃的弹窗栈（支持堆叠） */
const modalStack = []

/** 弹窗 ID 计数器 */
let modalIdCounter = 0

/* ============================================================
 * DOM 构建
 * ============================================================ */

/**
 * 创建弹窗 DOM 结构
 * @param {Object} config - 弹窗配置
 * @returns {{overlay: HTMLElement, dialog: HTMLElement, close: Function}}
 */
function createModalElement(config) {
  const { type, title, message, defaultValue, placeholder, confirmText, cancelText, danger } = config

  const overlay = document.createElement('div')
  overlay.className = 'modal-overlay'
  overlay.dataset.modalId = ++modalIdCounter

  const dialog = document.createElement('div')
  dialog.className = `modal-dialog modal-${type}${danger ? ' modal-danger' : ''}`
  dialog.setAttribute('role', 'dialog')
  dialog.setAttribute('aria-modal', 'true')

  // 标题栏
  let titleHtml = ''
  if (title) {
    titleHtml = `<div class="modal-header"><h3 class="modal-title">${escapeHtml(title)}</h3></div>`
  }

  // 图标（根据类型和危险级别）
  let iconHtml = ''
  if (type === 'confirm') {
    iconHtml = danger
      ? '<svg class="modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
      : '<svg class="modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
  } else if (type === 'alert') {
    iconHtml = '<svg class="modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
  } else if (type === 'prompt') {
    iconHtml = '<svg class="modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>'
  }

  // 输入框（仅 prompt 类型）
  let inputHtml = ''
  if (type === 'prompt') {
    inputHtml = `<input type="text" class="modal-input" placeholder="${escapeHtml(placeholder || '')}" value="${escapeHtml(defaultValue || '')}" autocomplete="off" />`
  }

  // 消息内容
  const messageHtml = message ? `<div class="modal-message">${escapeHtml(message)}</div>` : ''

  // 按钮组
  let buttonsHtml = ''
  if (type === 'alert') {
    buttonsHtml = `<div class="modal-buttons"><button class="modal-btn modal-btn-primary" data-action="confirm">${escapeHtml(confirmText || '确定')}</button></div>`
  } else {
    buttonsHtml = `<div class="modal-buttons">
      <button class="modal-btn modal-btn-default" data-action="cancel">${escapeHtml(cancelText || '取消')}</button>
      <button class="modal-btn ${danger ? 'modal-btn-danger' : 'modal-btn-primary'}" data-action="confirm">${escapeHtml(confirmText || '确定')}</button>
    </div>`
  }

  dialog.innerHTML = `
    ${titleHtml}
    <div class="modal-body">
      ${iconHtml}
      <div class="modal-content">
        ${messageHtml}
        ${inputHtml}
      </div>
    </div>
    ${buttonsHtml}
  `

  overlay.appendChild(dialog)

  // 关闭函数（移除 DOM 并清理）
  const close = () => {
    dialog.classList.add('modal-closing')
    overlay.classList.add('modal-overlay-closing')
    setTimeout(() => {
      overlay.remove()
      // 从栈中移除
      const idx = modalStack.findIndex(m => m.overlay === overlay)
      if (idx >= 0) modalStack.splice(idx, 1)
      // 归还焦点
      if (config.previousFocus && config.previousFocus.focus) {
        try { config.previousFocus.focus() } catch (e) { /* 忽略 */ }
      }
    }, 200)
  }

  return { overlay, dialog, close }
}

/* ============================================================
 * 工具函数
 * ============================================================ */

/**
 * HTML 转义
 */
function escapeHtml(text) {
  if (text === null || text === undefined) return ''
  const div = document.createElement('div')
  div.textContent = String(text)
  return div.innerHTML
}

/**
 * 将弹窗添加到 DOM 并显示
 */
function showModalElement(overlay, previousFocus) {
  document.body.appendChild(overlay)
  // 触发动画（下一帧添加 active 类）
  requestAnimationFrame(() => {
    overlay.classList.add('modal-overlay-active')
  })
}

/* ============================================================
 * 公共 API
 * ============================================================ */

/**
 * 显示 Alert 弹窗（仅确认按钮）
 * @param {string} message - 提示消息
 * @param {Object} [options] - 选项
 * @param {string} [options.title] - 标题
 * @param {string} [options.confirmText] - 确认按钮文本
 * @returns {Promise<void>} 用户点击确认后 resolve
 */
export function showModalAlert(message, options = {}) {
  return new Promise((resolve) => {
    const config = {
      type: 'alert',
      title: options.title,
      message,
      confirmText: options.confirmText,
      previousFocus: document.activeElement
    }

    const { overlay, dialog, close } = createModalElement(config)
    showModalElement(overlay)

    const confirmBtn = dialog.querySelector('[data-action="confirm"]')
    if (confirmBtn) confirmBtn.focus()

    const handleConfirm = () => {
      close()
      resolve()
    }

    confirmBtn?.addEventListener('click', handleConfirm)

    // 键盘：Enter 确认
    overlay.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleConfirm()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        handleConfirm()
      }
    })

    modalStack.push({ overlay, close })
  })
}

/**
 * 显示 Confirm 弹窗（确认/取消）
 * @param {string} message - 提示消息
 * @param {Object} [options] - 选项
 * @param {string} [options.title] - 标题
 * @param {string} [options.confirmText] - 确认按钮文本
 * @param {string} [options.cancelText] - 取消按钮文本
 * @param {boolean} [options.danger] - 是否为危险操作（红色确认按钮）
 * @returns {Promise<boolean>} 用户点击确认返回 true，取消返回 false
 */
export function showModalConfirm(message, options = {}) {
  return new Promise((resolve) => {
    const config = {
      type: 'confirm',
      title: options.title,
      message,
      confirmText: options.confirmText,
      cancelText: options.cancelText,
      danger: options.danger,
      previousFocus: document.activeElement
    }

    const { overlay, dialog, close } = createModalElement(config)
    showModalElement(overlay)

    const confirmBtn = dialog.querySelector('[data-action="confirm"]')
    const cancelBtn = dialog.querySelector('[data-action="cancel"]')

    // 危险操作时默认聚焦取消按钮（防误触）
    if (options.danger && cancelBtn) {
      cancelBtn.focus()
    } else if (confirmBtn) {
      confirmBtn.focus()
    }

    const handleConfirm = () => { close(); resolve(true) }
    const handleCancel = () => { close(); resolve(false) }

    confirmBtn?.addEventListener('click', handleConfirm)
    cancelBtn?.addEventListener('click', handleCancel)

    // 点击遮罩层取消
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) handleCancel()
    })

    // 键盘交互
    overlay.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleConfirm()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        handleCancel()
      }
    })

    modalStack.push({ overlay, close })
  })
}

/**
 * 显示 Prompt 弹窗（文本输入）
 * @param {string} message - 提示消息
 * @param {string} [defaultValue=''] - 默认值
 * @param {Object} [options] - 选项
 * @param {string} [options.title] - 标题
 * @param {string} [options.placeholder] - 输入框占位文本
 * @param {string} [options.confirmText] - 确认按钮文本
 * @param {string} [options.cancelText] - 取消按钮文本
 * @param {number} [options.maxLength] - 最大输入长度
 * @returns {Promise<string|null>} 确认返回输入值，取消返回 null
 */
export function showModalPrompt(message, defaultValue = '', options = {}) {
  return new Promise((resolve) => {
    const config = {
      type: 'prompt',
      title: options.title,
      message,
      defaultValue,
      placeholder: options.placeholder,
      confirmText: options.confirmText,
      cancelText: options.cancelText,
      previousFocus: document.activeElement
    }

    const { overlay, dialog, close } = createModalElement(config)
    showModalElement(overlay)

    const input = dialog.querySelector('.modal-input')
    const confirmBtn = dialog.querySelector('[data-action="confirm"]')
    const cancelBtn = dialog.querySelector('[data-action="cancel"]')

    if (options.maxLength && input) {
      input.maxLength = options.maxLength
    }

    // 聚焦输入框并选中文本
    if (input) {
      input.focus()
      input.select()
    }

    const handleSubmit = () => {
      const value = input ? input.value : ''
      close()
      resolve(value)
    }

    const handleCancel = () => {
      close()
      resolve(null)
    }

    confirmBtn?.addEventListener('click', handleSubmit)
    cancelBtn?.addEventListener('click', handleCancel)

    // 输入框 Enter 提交
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        e.stopPropagation()
        handleSubmit()
      }
    })

    // 遮罩层点击取消
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) handleCancel()
    })

    // 键盘 Esc 取消
    overlay.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleCancel()
      }
    })

    modalStack.push({ overlay, close })
  })
}

/**
 * 关闭所有活跃弹窗（紧急清理用）
 */
export function closeAllModals() {
  modalStack.forEach(m => {
    try { m.close() } catch (e) { /* 忽略 */ }
  })
  modalStack.length = 0
}

/**
 * 显示自定义内容弹窗（用于文件预览等复杂内容）
 *
 * @param {Object} config - 弹窗配置
 * @param {string} config.title - 标题
 * @param {string} config.bodyHtml - 正文 HTML（原始 HTML，调用方负责转义）
 * @param {string} [config.footerHtml] - 底部 HTML（如操作按钮）
 * @param {'normal'|'large'|'fullscreen'} [config.size='large'] - 弹窗尺寸
 * @param {Function} [config.onMount] - 弹窗挂载后回调，参数为 dialog 元素
 * @param {string} [config.closeText='关闭'] - 关闭按钮文本
 * @param {boolean} [config.closeOnOverlay=true] - 点击遮罩是否关闭
 * @returns {Promise<void>} 弹窗关闭后 resolve
 */
export function showCustomModal(config = {}) {
  return new Promise((resolve) => {
    const size = config.size || 'large'
    const overlay = document.createElement('div')
    overlay.className = 'modal-overlay'
    overlay.dataset.modalId = ++modalIdCounter

    const dialog = document.createElement('div')
    dialog.className = `modal-dialog modal-custom modal-${size}`
    dialog.setAttribute('role', 'dialog')
    dialog.setAttribute('aria-modal', 'true')

    const titleHtml = config.title
      ? `<div class="modal-header modal-custom-header"><h3 class="modal-title">${escapeHtml(config.title)}</h3><button class="modal-custom-close" data-action="close" aria-label="关闭" title="关闭"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>`
      : `<div class="modal-custom-header"><button class="modal-custom-close" data-action="close" aria-label="关闭" title="关闭"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>`

    const footerHtml = config.footerHtml
      ? `<div class="modal-custom-footer">${config.footerHtml}</div>`
      : `<div class="modal-custom-footer"><button class="modal-btn modal-btn-default" data-action="close">${escapeHtml(config.closeText || '关闭')}</button></div>`

    dialog.innerHTML = `
      ${titleHtml}
      <div class="modal-custom-body">${config.bodyHtml || ''}</div>
      ${footerHtml}
    `

    overlay.appendChild(dialog)
    showModalElement(overlay, document.activeElement)

    const close = () => {
      dialog.classList.add('modal-closing')
      overlay.classList.add('modal-overlay-closing')
      setTimeout(() => {
        overlay.remove()
        const idx = modalStack.findIndex(m => m.overlay === overlay)
        if (idx >= 0) modalStack.splice(idx, 1)
        if (config.onUnmount) {
          try { config.onUnmount() } catch (_) {}
        }
        resolve()
      }, 200)
    }

    // 关闭按钮
    dialog.querySelectorAll('[data-action="close"]').forEach(btn => {
      btn.addEventListener('click', close)
    })

    // 遮罩层点击关闭
    if (config.closeOnOverlay !== false) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close()
      })
    }

    // Esc 关闭
    overlay.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
      }
    })

    // 聚焦关闭按钮
    const closeBtn = dialog.querySelector('[data-action="close"]')
    if (closeBtn) closeBtn.focus()

    modalStack.push({ overlay, close })

    // 挂载回调 — 在 DOM 已插入后调用
    if (config.onMount) {
      requestAnimationFrame(() => {
        try { config.onMount(dialog) } catch (_) {}
      })
    }
  })
}

// 全局导出（供非模块脚本使用）
if (typeof window !== 'undefined') {
  window.iDromeModal = {
    alert: showModalAlert,
    confirm: showModalConfirm,
    prompt: showModalPrompt,
    custom: showCustomModal,
    closeAll: closeAllModals
  }
}
