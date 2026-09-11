/**
 * iDrome — 消息导航面板模块
 *
 * 功能：
 * - 右侧滑出面板，列出当前对话中所有用户消息
 * - 点击消息项快速定位到对应消息位置（滚动 + 高亮闪烁）
 * - 支持桌面端（侧边面板）/ 平板（侧边面板）/ 移动端（全宽滑出）
 * - 消息发送后面板自动刷新
 * - 键盘可访问（Esc 关闭、Tab 导航）
 *
 * 参考：ChatGPT / Claude 等产品的消息定位跳转功能
 */

'use strict'

import { state } from './state.js'

/** 面板状态 */
let isPanelOpen = false
// 以"消息 id 签名"判断是否需要重渲染（仅比较数量会在切换会话后漏更新，
// 导致面板残留上一个会话的消息 id，点击跳转失效）
let lastRenderedSignature = ''

/** DOM 元素引用 */
let panelEl = null
let overlayEl = null
let listEl = null
let emptyEl = null
let toggleBtn = null
let closeBtn = null

/**
 * 截取消息摘要（去除 Markdown 标记，截断到 80 字符）
 * @param {string} content
 * @returns {string}
 */
function getSnippet(content) {
  if (!content) return '(空消息)'
  // 去除 Markdown 语法标记，保留纯文本
  let text = content
    .replace(/```[\s\S]*?```/g, '[代码块]')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '[图片]')
    .replace(/\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/[#*_~>-]/g, '')
    .replace(/\n+/g, ' ')
    .trim()
  if (text.length > 80) {
    text = text.slice(0, 80) + '...'
  }
  return text || '(空消息)'
}

/**
 * 格式化时间戳为简短显示
 * @param {string} isoTime
 * @returns {string}
 */
function formatTime(isoTime) {
  if (!isoTime) return ''
  try {
    const date = new Date(isoTime)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()

    const hh = String(date.getHours()).padStart(2, '0')
    const mm = String(date.getMinutes()).padStart(2, '0')

    if (isToday) {
      return `${hh}:${mm}`
    }

    // 昨天
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    if (date.toDateString() === yesterday.toDateString()) {
      return `昨天 ${hh}:${mm}`
    }

    // 其他日期
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${month}/${day} ${hh}:${mm}`
  } catch (_) {
    return ''
  }
}

/**
 * HTML 转义
 * @param {string} text
 * @returns {string}
 */
function escapeHtml(text) {
  if (text === null || text === undefined) return ''
  const div = document.createElement('div')
  div.textContent = String(text)
  return div.innerHTML
}

/**
 * 渲染消息导航列表
 * 从 state.messages 中提取所有用户消息并渲染到面板
 */
export function renderMessageNav() {
  if (!listEl || !emptyEl) return

  const userMessages = (state.messages || []).filter(m => m.role === 'user')

  // 空状态
  if (userMessages.length === 0) {
    listEl.innerHTML = ''
    emptyEl.style.display = 'flex'
    lastRenderedSignature = ''
    return
  }

  emptyEl.style.display = 'none'

  // 仅在消息集合变化时重新渲染（避免每次都重绘）
  const signature = userMessages.map(m => m.id).join('|')
  if (signature === lastRenderedSignature) return
  lastRenderedSignature = signature

  listEl.innerHTML = userMessages.map((msg, idx) => {
    const snippet = getSnippet(msg.content)
    const time = formatTime(msg.created_at)
    return `
      <div class="msg-nav-item" role="listitem" tabindex="0"
           data-msg-id="${escapeHtml(msg.id)}"
           data-msg-index="${idx + 1}"
           aria-label="第${idx + 1}条用户消息: ${escapeHtml(snippet)}">
        <span class="msg-nav-item-index">${idx + 1}</span>
        <span class="msg-nav-item-snippet">${escapeHtml(snippet)}</span>
        <span class="msg-nav-item-time">${escapeHtml(time)}</span>
      </div>
    `
  }).join('')

  // 绑定点击事件
  listEl.querySelectorAll('.msg-nav-item').forEach(item => {
    const jump = () => {
      const msgId = item.dataset.msgId
      jumpToMessage(msgId)
      // 移动端点击后自动关闭面板
      if (window.innerWidth <= 768) {
        closePanel()
      }
    }

    item.addEventListener('click', jump)
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        jump()
      }
    })
  })
}

/**
 * 跳转到指定消息 — 滚动到消息位置并高亮闪烁
 * @param {string} msgId - 消息 ID
 */
function jumpToMessage(msgId) {
  if (!msgId) return

  const messageList = document.getElementById('messageList')
  if (!messageList) return

  // 遍历查找目标消息元素 — 避免 CSS 选择器注入问题
  const items = messageList.querySelectorAll('.message-item')
  let targetEl = null
  for (const item of items) {
    if (item.dataset.msgId === msgId) {
      targetEl = item
      break
    }
  }

  if (!targetEl) {
    console.warn('[iDrome MsgNav] 未找到消息元素:', msgId)
    return
  }

  // 滚动到消息位置
  targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' })

  // 高亮闪烁动画
  targetEl.classList.remove('msg-jump-highlight')
  // 强制 reflow 以重新触发动画
  void targetEl.offsetWidth
  targetEl.classList.add('msg-jump-highlight')

  // 1.5 秒后移除高亮类
  setTimeout(() => {
    targetEl.classList.remove('msg-jump-highlight')
  }, 1500)

  // 标记当前活跃项
  if (listEl) {
    listEl.querySelectorAll('.msg-nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.msgId === msgId)
    })
  }
}

/**
 * 打开面板
 */
function openPanel() {
  if (!panelEl) return
  panelEl.classList.add('open')
  panelEl.setAttribute('aria-hidden', 'false')
  isPanelOpen = true
  // 桌面端通知布局让位（messagenav.css 中 body.msg-nav-open 规则）
  document.body.classList.add('msg-nav-open')

  // 渲染消息列表（强制重新渲染）
  lastRenderedSignature = ''
  renderMessageNav()

  // 聚焦面板（便于键盘操作）
  setTimeout(() => {
    if (closeBtn) closeBtn.focus()
  }, 300)
}

/**
 * 关闭面板
 */
function closePanel() {
  if (!panelEl) return
  panelEl.classList.remove('open')
  panelEl.setAttribute('aria-hidden', 'true')
  isPanelOpen = false
  // 移除桌面端布局让位
  document.body.classList.remove('msg-nav-open')

  // 归还焦点到切换按钮
  if (toggleBtn) toggleBtn.focus()
}

/**
 * 切换面板开关状态
 */
function togglePanel() {
  if (isPanelOpen) {
    closePanel()
  } else {
    openPanel()
  }
}

/**
 * 初始化消息导航面板
 * 绑定按钮事件、键盘快捷键、消息变化监听
 */
export function initMessageNav() {
  panelEl = document.getElementById('msgNavPanel')
  overlayEl = document.getElementById('msgNavOverlay')
  listEl = document.getElementById('msgNavList')
  emptyEl = document.getElementById('msgNavEmpty')
  toggleBtn = document.getElementById('messageNavBtn')
  closeBtn = document.getElementById('msgNavCloseBtn')

  if (!panelEl || !toggleBtn) {
    console.warn('[iDrome MsgNav] 面板元素未找到，跳过初始化')
    return
  }

  // 切换按钮
  toggleBtn.addEventListener('click', togglePanel)

  // 关闭按钮
  if (closeBtn) {
    closeBtn.addEventListener('click', closePanel)
  }

  // 遮罩层点击关闭（移动端）
  if (overlayEl) {
    overlayEl.addEventListener('click', closePanel)
  }

  // 键盘：Esc 关闭面板
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isPanelOpen) {
      closePanel()
    }
  })

  // 监听消息列表变化 — 自动刷新导航列表
  // 使用 MutationObserver 监听 DOM 变化（消息渲染时触发）
  const messageList = document.getElementById('messageList')
  if (messageList) {
    const observer = new MutationObserver(() => {
      if (isPanelOpen) {
        renderMessageNav()
      }
    })
    observer.observe(messageList, { childList: true, subtree: false })
  }

  console.log('[iDrome MsgNav] 消息导航面板已初始化')
}

export default { initMessageNav, renderMessageNav }
