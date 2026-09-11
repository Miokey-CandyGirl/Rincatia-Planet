/**
 * iDrome — 键盘快捷键模块
 *
 * 按设计方案第 4.7 节实现全部 9 个快捷键：
 * | 快捷键          | 功能                  | 触发条件           |
 * |----------------|----------------------|-------------------|
 * | Enter          | 换行                  | 输入框内           |
 * | Ctrl + Enter   | 发送消息               | 输入框聚焦时        |
 * | Esc            | 关闭导航面板/弹窗        | 全局               |
 * | Ctrl + K       | 聚焦搜索框             | 导航面板展开时       |
 * | Ctrl + N       | 新建对话               | 全局               |
 * | Ctrl + /       | 显示快捷键帮助弹窗       | 全局（弹窗步骤10实现） |
 * | Ctrl + Shift + C | 复制最后一条 AI 回复   | 全局               |
 * | ↑ / ↓          | 消息列表上下滚动         | 对话区聚焦时        |
 * | Tab            | 在输入框按钮间切换焦点    | 输入框聚焦时        |
 *
 * > Ctrl+Enter / Tab 由 input.js 原生处理，此模块注册全局快捷键
 */

'use strict'

import { state } from './state.js'
import { showToast } from './toast.js'

/**
 * 初始化键盘快捷键
 * @param {Object} handlers - 处理函数
 * @param {Function} handlers.onNewConversation - 新建对话
 * @param {Function} handlers.onFocusSearch - 聚焦搜索框
 * @param {Function} handlers.onCopyLastAIReply - 复制最后一条 AI 回复
 * @param {Function} handlers.onShowShortcuts - 显示快捷键帮助
 */
export function initKeyboardShortcuts(handlers = {}) {
  document.addEventListener('keydown', (e) => {
    // Esc — 关闭导航面板/弹窗（navpanel.js 已注册，此处处理弹窗）
    if (e.key === 'Escape') {
      // 关闭设置面板
      const settingsModal = document.getElementById('settingsModal')
      if (settingsModal && settingsModal.classList.contains('open')) {
        e.preventDefault()
        settingsModal.classList.remove('open')
        settingsModal.setAttribute('aria-hidden', 'true')
        setTimeout(() => { settingsModal.style.display = 'none' }, 200)
        return
      }

      // 关闭快捷键帮助弹窗
      const shortcutModal = document.getElementById('shortcutHelpModal')
      if (shortcutModal && shortcutModal.style.display !== 'none') {
        e.preventDefault()
        shortcutModal.style.display = 'none'
        return
      }
      // navpanel.js 处理导航面板关闭
    }

    // Ctrl + K — 聚焦搜索框（导航面板展开时）
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      if (state.navPanelOpen) {
        e.preventDefault()
        const searchInput = document.getElementById('searchInput')
        if (searchInput) {
          searchInput.focus()
          showToast('搜索框已聚焦', 'info', 1000)
        }
      }
      return
    }

    // Ctrl + N — 新建对话
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
      e.preventDefault()
      if (typeof handlers.onNewConversation === 'function') {
        handlers.onNewConversation()
      }
      return
    }

    // Ctrl + / — 显示快捷键帮助
    if ((e.ctrlKey || e.metaKey) && (e.key === '/' || e.code === 'Slash')) {
      e.preventDefault()
      if (typeof handlers.onShowShortcuts === 'function') {
        handlers.onShowShortcuts()
      } else {
        // 预留弹窗占位（步骤 10 完善）
        showShortcutHelpPlaceholder()
      }
      return
    }

    // Ctrl + Shift + C — 复制最后一条 AI 回复
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
      e.preventDefault()
      if (typeof handlers.onCopyLastAIReply === 'function') {
        handlers.onCopyLastAIReply()
      } else {
        copyLastAIReply()
      }
      return
    }

    // ↑ / ↓ — 消息列表滚动（对话区聚焦时）
    if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && !e.ctrlKey && !e.metaKey) {
      const activeEl = document.activeElement
      const input = document.getElementById('messageInput')

      // 仅在消息列表聚焦时触发（非输入框）
      if (activeEl && activeEl.tagName !== 'TEXTAREA' && activeEl.tagName !== 'INPUT') {
        const messageList = document.getElementById('messageList')
        if (messageList) {
          e.preventDefault()
          const scrollAmount = 50
          messageList.scrollBy({
            top: e.key === 'ArrowDown' ? scrollAmount : -scrollAmount,
            behavior: 'smooth'
          })
        }
      }
      return
    }
  })

  console.log('[iDrome Keyboard] 快捷键已初始化（9 项）')
}

/**
 * 复制最后一条 AI 回复
 */
function copyLastAIReply() {
  const aiMessages = state.messages.filter(m => m.role === 'assistant' && m.content)
  if (aiMessages.length === 0) {
    showToast('暂无 AI 回复可复制', 'warning', 1500)
    return
  }

  const lastReply = aiMessages[aiMessages.length - 1]
  navigator.clipboard.writeText(lastReply.content).then(() => {
    showToast('已复制最后一条 AI 回复', 'success', 1500)
  }).catch(() => {
    showToast('复制失败', 'error')
  })
}

/**
 * 快捷键帮助弹窗占位（步骤 10 完善）
 */
function showShortcutHelpPlaceholder() {
  let modal = document.getElementById('shortcutHelpModal')
  if (!modal) {
    modal = document.createElement('div')
    modal.id = 'shortcutHelpModal'
    modal.className = 'shortcut-help-modal'
    modal.style.cssText = `
      position: fixed; inset: 0; z-index: 10000;
      display: flex; align-items: center; justify-content: center;
      background: rgba(0,0,0,0.4);
    `
    modal.innerHTML = `
      <div class="shortcut-help-content" style="
        background: var(--bg-main); border-radius: var(--radius-lg);
        padding: var(--spacing-xl); max-width: 480px; width: 90%;
        box-shadow: var(--shadow-lg); position: relative;
      ">
        <button class="shortcut-help-close" id="shortcutHelpClose" style="
          position: absolute; top: var(--spacing-sm); right: var(--spacing-sm);
          width: 32px; height: 32px; border-radius: var(--radius-full);
          display: flex; align-items: center; justify-content: center;
          background: var(--bg-btn-default); color: var(--text-secondary);
        " aria-label="关闭">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <h2 style="margin-bottom: var(--spacing-md); font-size: 1.25rem;">键盘快捷键</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
          <tbody>
            <tr><td style="padding: 6px 0; color: var(--text-secondary);">Enter</td><td style="text-align: right;">换行</td></tr>
            <tr><td style="padding: 6px 0; color: var(--text-secondary);">Ctrl + Enter</td><td style="text-align: right;">发送消息</td></tr>
            <tr><td style="padding: 6px 0; color: var(--text-secondary);">Esc</td><td style="text-align: right;">关闭面板/弹窗</td></tr>
            <tr><td style="padding: 6px 0; color: var(--text-secondary);">Ctrl + K</td><td style="text-align: right;">聚焦搜索框</td></tr>
            <tr><td style="padding: 6px 0; color: var(--text-secondary);">Ctrl + N</td><td style="text-align: right;">新建对话</td></tr>
            <tr><td style="padding: 6px 0; color: var(--text-secondary);">Ctrl + /</td><td style="text-align: right;">显示快捷键帮助</td></tr>
            <tr><td style="padding: 6px 0; color: var(--text-secondary);">Ctrl + Shift + C</td><td style="text-align: right;">复制最后 AI 回复</td></tr>
            <tr><td style="padding: 6px 0; color: var(--text-secondary);">↑ / ↓</td><td style="text-align: right;">消息列表滚动</td></tr>
            <tr><td style="padding: 6px 0; color: var(--text-secondary);">Tab</td><td style="text-align: right;">切换按钮焦点</td></tr>
          </tbody>
        </table>
        <p style="margin-top: var(--spacing-md); font-size: 0.75rem; color: var(--text-hint); text-align: center;">
          快捷键帮助弹窗将在步骤 10 完善样式
        </p>
      </div>
    `
    document.body.appendChild(modal)

    // 关闭按钮
    const closeBtn = modal.querySelector('#shortcutHelpClose')
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none'
    })

    // 点击遮罩关闭
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none'
      }
    })
  }
  modal.style.display = 'flex'
}

export default { initKeyboardShortcuts }
