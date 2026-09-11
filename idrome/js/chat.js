/**
 * iDrome — 对话渲染模块
 *
 * 按设计方案第 4.4 节实现：
 * - sendMessage() — 用户消息添加到 state.messages，触发 AI 回复
 * - generateAIReply() — 通过 apiRouter 调用 DeepSeek API（开发环境自动 Mock）
 * - renderMessages() — 根据 state.messages 渲染消息气泡列表
 * - Markdown 渲染：marked.parse() + DOMPurify.sanitize() + KaTeX
 * - 代码块语法高亮 + 复制按钮
 * - 消息操作按钮组（hover 显示：复制 / 重新生成 / 点赞 / 删除）
 * - 智能滚动控制（用户上滚暂停自动滚底，500ms 后恢复）
 * - "↓ 回到底部"浮动按钮
 * - 停止生成按钮（AbortController）
 * - 错误处理（消息气泡内显示错误 + 重试按钮）
 * - 上下文管理（Token 估算 + 滑动窗口 + 进度条）
 * - 打字机流式输出效果
 */

'use strict'

import { state } from './state.js'
import { renderMarkdown } from './markdown.js'
import { showToast } from './toast.js'
import { apiRouter } from './apiRouter.js?v=step10'
import { APIError, renderErrorBubble } from './errorHandler.js'
import { manageContext, updateContextProgress, showUsageInfo } from './usageTracker.js'
import {
  createConversation as dbCreateConversation,
  insertMessage as dbInsertMessage,
  updateMessageContent as dbUpdateMessageContent,
  markMessagesExpired as dbMarkMessagesExpired,
  deleteMessage as dbDeleteMessage,
  touchConversation as dbTouchConversation,
  updateConversationTitle as dbUpdateConversationTitle,
  generateTitle as dbGenerateTitle,
  saveSearchReferences as dbSaveSearchReferences
} from './conversations.js?v=step10'
import { showSearchStatus, hideSearchStatus } from './search.js?v=step10'
import { loadKnowledge, loadUserKnowledgeBase, clearCache as clearKnowledgeCache } from './knowledgeLoader.js?v=step10'

/** 滚动控制状态 */
let autoScrollEnabled = true
let scrollTimer = null

/** 当前 AbortController（用于停止生成） */
let currentAbortController = null

/** AI 响应开始时间戳（用于计算思考用时） */
let aiResponseStartTime = null

/** 思考过程时间跟踪 */
let thinkingStartTime = null
let thinkingEndTime = null

/** 程序化滚动标志 — 用于区分用户滚动和代码触发的滚动 */
let isProgrammaticScroll = false

/** 模式名称映射 */
const MODE_NAMES = {
  general: '普通',
  'tian-translation': '田语',
  'novel-culture': '小说'
}

/* ============================================================
 * 工具函数
 * ============================================================ */

/**
 * 安全转义 HTML
 */
function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = String(text)
  return div.innerHTML
}

/**
 * 获取当前时间 ISO 字符串
 */
function nowISO() {
  return new Date().toISOString()
}

/**
 * 生成唯一 ID
 */
function genId(prefix = 'msg') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

/**
 * 处理引用标记 — 将气泡文本中的 [n] 转换为可点击链接
 * 遍历文本节点（跳过 a/code/pre 标签内），用正则匹配 [n] 并替换为超链接
 * @param {Element} bubble - 消息气泡元素
 * @param {Array} searchResults - 搜索结果数组
 */
function processCitations(bubble, searchResults) {
  if (!bubble || !searchResults || searchResults.length === 0) return

  const urlMap = {}
  searchResults.forEach((r, i) => {
    urlMap[i + 1] = r.url
  })

  const walker = document.createTreeWalker(bubble, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement
      if (!parent) return NodeFilter.FILTER_REJECT
      if (parent.closest('a, code, pre, .search-sources-folded')) return NodeFilter.FILTER_REJECT
      if (!/\[\d+\]/.test(node.nodeValue)) return NodeFilter.FILTER_REJECT
      return NodeFilter.FILTER_ACCEPT
    }
  })

  const nodesToReplace = []
  let node
  while ((node = walker.nextNode())) {
    nodesToReplace.push(node)
  }

  nodesToReplace.forEach(textNode => {
    const text = textNode.nodeValue
    const fragment = document.createDocumentFragment()
    let lastIndex = 0
    const regex = /\[(\d+)\]/g
    let match
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)))
      }
      const num = parseInt(match[1], 10)
      const url = urlMap[num]
      if (url) {
        const a = document.createElement('a')
        a.href = url
        a.target = '_blank'
        a.rel = 'noopener noreferrer'
        a.className = 'citation-link'
        a.textContent = match[0]
        a.title = searchResults[num - 1]?.title || `参考来源 ${num}`
        fragment.appendChild(a)
      } else {
        fragment.appendChild(document.createTextNode(match[0]))
      }
      lastIndex = match.index + match[0].length
    }
    if (lastIndex < text.length) {
      fragment.appendChild(document.createTextNode(text.slice(lastIndex)))
    }
    textNode.parentNode.replaceChild(fragment, textNode)
  })
}

/**
 * 在回答末尾追加折叠的搜索来源
 * @param {Element} bubble - 消息气泡元素
 * @param {Array} searchResults - 搜索结果数组
 */
function appendSearchSources(bubble, searchResults) {
  if (!bubble || !searchResults || searchResults.length === 0) return
  // 避免重复追加
  if (bubble.querySelector('.search-sources-folded')) return

  const sourcesDiv = document.createElement('div')
  sourcesDiv.className = 'search-sources-folded'

  const items = searchResults.map((r, i) => {
    const title = escapeHtml(r.title || '无标题')
    const website = r.website ? escapeHtml(r.website) : ''
    return `<li class="search-source-item">
      <a href="${escapeHtml(r.url)}" target="_blank" rel="noopener noreferrer" class="search-source-link">
        <span class="citation-num">[${i + 1}]</span>
        <span class="source-title">${title}</span>
        ${website ? `<span class="source-website">${website}</span>` : ''}
      </a>
    </li>`
  }).join('')

  sourcesDiv.innerHTML = `
    <details class="search-sources-details">
      <summary class="search-sources-summary">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
        <span>参考来源（${searchResults.length}）</span>
      </summary>
      <div class="search-sources-scroll">
        <ol class="search-sources-list">${items}</ol>
      </div>
    </details>
  `
  bubble.appendChild(sourcesDiv)
}

/* ============================================================
 * 消息渲染
 * ============================================================ */

/**
 * 格式化消息时间显示
 * - 今天：HH:MM
 * - 昨天：昨天 HH:MM
 * - 前天：前天 HH:MM
 * - 明天：明天 HH:MM
 * - 后天：后天 HH:MM
 * - 今年：MM月DD日 HH:MM
 * - 更早：YYYY年MM月DD日 HH:MM
 * @param {string} isoString - ISO 时间字符串
 * @returns {string} 格式化后的时间文本
 */
function formatMessageTime(isoString) {
  if (!isoString) return ''
  const date = new Date(isoString)
  if (isNaN(date.getTime())) return ''

  const now = new Date()
  const pad = n => String(n).padStart(2, '0')
  const hh = pad(date.getHours())
  const mm = pad(date.getMinutes())

  // 将日期规范化为当天 00:00 用于比较
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const dateDay = startOfDay(date)
  const nowDay = startOfDay(now)
  const dayDiff = Math.round((dateDay - nowDay) / (24 * 60 * 60 * 1000))

  // 今天
  if (dayDiff === 0) return `${hh}:${mm}`

  // 昨天和前天
  if (dayDiff === -1) return `昨天 ${hh}:${mm}`
  if (dayDiff === -2) return `前天 ${hh}:${mm}`

  // 明天和后天
  if (dayDiff === 1) return `明天 ${hh}:${mm}`
  if (dayDiff === 2) return `后天 ${hh}:${mm}`

  // 今年
  if (date.getFullYear() === now.getFullYear()) {
    return `${date.getMonth() + 1}月${date.getDate()}日 ${hh}:${mm}`
  }

  // 更早
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${hh}:${mm}`
}

/**
 * 渲染消息列表
 * @param {Array} messages - 消息数组
 * @param {boolean} append - 是否追加模式（仅渲染最后一条）
 */
export function renderMessages(messages, append = false) {
  const container = document.getElementById('messageList')
  if (!container) return

  if (append && messages.length > 0) {
    // 追加模式：只渲染最后一条
    const lastMsg = messages[messages.length - 1]
    container.insertAdjacentHTML('beforeend', renderMessageItem(lastMsg))
  } else {
    // 全量渲染
    let html = ''
    messages.forEach(msg => {
      html += renderMessageItem(msg)
    })
    container.innerHTML = html
  }

  // 处理搜索引用标记 [n] → 可点击链接（仅对有 searchResults 的 AI 消息）
  if (append && messages.length > 0) {
    const lastMsg = messages[messages.length - 1]
    if (lastMsg && lastMsg.role === 'assistant' && lastMsg.searchResults) {
      const items = container.querySelectorAll('.message-item:not(.loading-message)')
      const lastItem = items[items.length - 1]
      const bubble = lastItem?.querySelector('.message-bubble')
      if (bubble) processCitations(bubble, lastMsg.searchResults)
    }
  } else {
    messages.forEach(msg => {
      if (msg.role === 'assistant' && msg.searchResults && msg.searchResults.length > 0) {
        const item = container.querySelector(`.message-item[data-msg-id="${msg.id}"]`)
        const bubble = item?.querySelector('.message-bubble')
        if (bubble) processCitations(bubble, msg.searchResults)
      }
    })
  }

  // 为代码块添加复制按钮
  container.querySelectorAll('pre').forEach(pre => {
    if (!pre.closest('.code-block-wrapper')) {
      addCopyButtonToCodeBlock(pre)
    }
  })

  // 增强表格：滚动容器 + 复制按钮 + 边缘渐变
  enhanceTables(container)

  // 绑定消息操作按钮
  bindMessageActions(container)

  // 绑定思考过程折叠/展开
  container.querySelectorAll('.thinking-process .thinking-header').forEach(header => {
    if (header.dataset.bound === 'true') return
    header.dataset.bound = 'true'
    header.addEventListener('click', () => {
      header.parentElement.classList.toggle('expanded')
    })
  })

  if (autoScrollEnabled) {
    scrollToBottom()
  }

  // 检查滚动位置，更新"回到底部"按钮状态
  checkScrollPosition()
}

/**
 * 最终化最后一条消息（流式结束后更新，避免全量 re-render 闪烁）
 * 仅更新气泡内容、思考过程、代码块按钮、操作按钮绑定
 * @param {Object} msg - 最终消息对象
 */
function finalizeLastMessage(msg) {
  const container = document.getElementById('messageList')
  if (!container) return

  const items = container.querySelectorAll('.message-item')
  const lastItem = items[items.length - 1]
  if (!lastItem) return

  // 0. 计算思考过程用时（仅思考阶段，非整个回复周期）
  if (thinkingStartTime && thinkingEndTime) {
    msg.thinking_time = ((thinkingEndTime - thinkingStartTime) / 1000).toFixed(1)
  } else if (thinkingStartTime && !thinkingEndTime) {
    // 思考未正常结束（如用户中止）— 用当前时间估算
    msg.thinking_time = ((Date.now() - thinkingStartTime) / 1000).toFixed(1)
  }
  aiResponseStartTime = null
  thinkingStartTime = null
  thinkingEndTime = null

  // 1. 更新气泡内容（最终内容可能与流式内容略有差异）
  const bubble = lastItem.querySelector('.message-bubble')
  if (bubble) {
    bubble.innerHTML = renderMarkdown(msg.content || '')
    // 如果有搜索结果，处理引用标记 [n] → 可点击链接，并追加折叠来源
    if (msg.searchResults && msg.searchResults.length > 0) {
      processCitations(bubble, msg.searchResults)
      appendSearchSources(bubble, msg.searchResults)
    }
  }

  // 2. 更新思考过程
  if (msg.reasoning) {
    let thinkingEl = lastItem.querySelector('.thinking-process')
    if (!thinkingEl) {
      // 流式过程中未创建（reasoning 来自最终结果），现在创建
      const escapedReasoning = msg.reasoning
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
      thinkingEl = document.createElement('div')
      thinkingEl.className = 'thinking-process expanded thinking-inline'
      const timeBadge = msg.thinking_time ? `<span class="thinking-time-badge">用时 ${msg.thinking_time}s</span>` : ''
      thinkingEl.innerHTML = `
        <div class="thinking-header">
          <svg class="thinking-toggle" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
          <span>思考过程</span>
          ${timeBadge}
        </div>
        <div class="thinking-content">${escapedReasoning}</div>
      `
      if (bubble) {
        lastItem.insertBefore(thinkingEl, bubble)
      } else {
        lastItem.appendChild(thinkingEl)
      }
    } else {
      // 已存在，更新内容和用时标签
      const content = thinkingEl.querySelector('.thinking-content')
      if (content) content.textContent = msg.reasoning
      const header = thinkingEl.querySelector('.thinking-header')
      if (header && msg.thinking_time) {
        let badge = header.querySelector('.thinking-time-badge')
        if (!badge) {
          badge = document.createElement('span')
          badge.className = 'thinking-time-badge'
          header.appendChild(badge)
        }
        badge.textContent = `用时 ${msg.thinking_time}s`
      }
    }

    // 绑定折叠/展开（若未绑定）
    const header = thinkingEl.querySelector('.thinking-header')
    if (header && header.dataset.bound !== 'true') {
      header.dataset.bound = 'true'
      header.addEventListener('click', () => {
        thinkingEl.classList.toggle('expanded')
      })
    }
  }

  // 3. 为代码块添加复制按钮（仅最后一条消息）
  lastItem.querySelectorAll('pre').forEach(pre => {
    if (!pre.closest('.code-block-wrapper')) {
      addCopyButtonToCodeBlock(pre)
    }
  })

  // 4. 绑定操作按钮（仅最后一条消息，若未绑定）
  lastItem.querySelectorAll('.msg-action-btn').forEach(btn => {
    if (btn.dataset.bound === 'true') return
    btn.dataset.bound = 'true'
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      const action = btn.dataset.action
      const msgId = lastItem.dataset.msgId
      const msgObj = state.messages.find(m => m.id === msgId)
      if (!msgObj) return

      switch (action) {
        case 'copy':
          copyToClipboard(msgObj.content).then(() => {
            showToast('已复制', 'success', 1500)
          })
          break
        case 'regenerate':
          handleRegenerate(msgObj)
          break
        case 'like':
          showToast('感谢反馈', 'success', 1000)
          btn.classList.add('active')
          break
        case 'delete':
          handleDeleteMessage(msgId)
          break
      }
    })
  })

  // 5. 确保操作按钮区域存在
  if (!lastItem.querySelector('.message-actions')) {
    const copyIcon = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'
    const regenerateIcon = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>'
    const likeIcon = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>'
    const deleteIcon = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>'

    const actionsDiv = document.createElement('div')
    actionsDiv.className = 'message-actions'
    actionsDiv.innerHTML = `
      <button class="msg-action-btn" data-action="copy" aria-label="复制" title="复制">${copyIcon}</button>
      <button class="msg-action-btn" data-action="regenerate" aria-label="重新生成" title="重新生成">${regenerateIcon}</button>
      <button class="msg-action-btn" data-action="like" aria-label="赞" title="赞">${likeIcon}</button>
      <button class="msg-action-btn" data-action="delete" aria-label="删除" title="删除">${deleteIcon}</button>
    `
    lastItem.appendChild(actionsDiv)

    // 绑定新生成的按钮
    actionsDiv.querySelectorAll('.msg-action-btn').forEach(btn => {
      btn.dataset.bound = 'true'
      btn.addEventListener('click', (e) => {
        e.stopPropagation()
        const action = btn.dataset.action
        const msgId = lastItem.dataset.msgId
        const msgObj = state.messages.find(m => m.id === msgId)
        if (!msgObj) return
        switch (action) {
          case 'copy':
            copyToClipboard(msgObj.content).then(() => {
              showToast('已复制', 'success', 1500)
            })
            break
          case 'regenerate':
            handleRegenerate(msgObj)
            break
          case 'like':
            showToast('感谢反馈', 'success', 1000)
            btn.classList.add('active')
            break
          case 'delete':
            handleDeleteMessage(msgId)
            break
        }
      })
    })
  }

  // 6. 增强表格（滚动容器 + 复制按钮）
  enhanceTables(lastItem)

  if (autoScrollEnabled) scrollToBottom()
  checkScrollPosition()
}

/**
 * 渲染单条消息
 */
function renderMessageItem(msg) {
  const isUser = msg.role === 'user'
  const bubbleClass = isUser ? 'user' : 'assistant'
  const content = renderMarkdown(msg.content || '')
  const msgId = msg.id || genId()

  // 消息操作按钮 SVG
  const copyIcon = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'
  const regenerateIcon = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>'
  const likeIcon = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>'
  const deleteIcon = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>'

  let actions = ''
  if (isUser) {
    actions = `
      <div class="message-actions">
        <button class="msg-action-btn" data-action="copy" aria-label="复制" title="复制">${copyIcon}</button>
        <button class="msg-action-btn" data-action="delete" aria-label="删除" title="删除">${deleteIcon}</button>
      </div>
    `
  } else {
    actions = `
      <div class="message-actions">
        <button class="msg-action-btn" data-action="copy" aria-label="复制" title="复制">${copyIcon}</button>
        <button class="msg-action-btn" data-action="regenerate" aria-label="重新生成" title="重新生成">${regenerateIcon}</button>
        <button class="msg-action-btn" data-action="like" aria-label="赞" title="赞">${likeIcon}</button>
        <button class="msg-action-btn" data-action="delete" aria-label="删除" title="删除">${deleteIcon}</button>
      </div>
    `
  }

  // 思考过程（仅 AI 消息且有 reasoning 内容时显示，位于正式文本上方）
  let thinkingHtml = ''
  if (!isUser && msg.reasoning) {
    // 转义 HTML 防止 XSS
    const escapedReasoning = msg.reasoning
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    const timeBadge = msg.thinking_time ? `<span class="thinking-time-badge">用时 ${msg.thinking_time}s</span>` : ''
    thinkingHtml = `
      <div class="thinking-process expanded thinking-inline">
        <div class="thinking-header">
          <svg class="thinking-toggle" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
          <span>思考过程</span>
          ${timeBadge}
        </div>
        <div class="thinking-content">${escapedReasoning}</div>
      </div>
    `
  }

  // 搜索来源折叠区（仅 AI 消息且有搜索结果时）
  let searchSourcesHtml = ''
  if (!isUser && msg.searchResults && msg.searchResults.length > 0) {
    const sourcesItems = msg.searchResults.map((r, i) => {
      const title = escapeHtml(r.title || '无标题')
      const website = r.website ? escapeHtml(r.website) : ''
      return `<li class="search-source-item">
        <a href="${escapeHtml(r.url)}" target="_blank" rel="noopener noreferrer" class="search-source-link">
          <span class="citation-num">[${i + 1}]</span>
          <span class="source-title">${title}</span>
          ${website ? `<span class="source-website">${website}</span>` : ''}
        </a>
      </li>`
    }).join('')
    searchSourcesHtml = `
      <div class="search-sources-folded">
        <details class="search-sources-details">
          <summary class="search-sources-summary">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
            <span>参考来源（${msg.searchResults.length}）</span>
          </summary>
          <div class="search-sources-scroll">
            <ol class="search-sources-list">${sourcesItems}</ol>
          </div>
        </details>
      </div>
    `
  }

  // 消息发送时间
  const timeText = formatMessageTime(msg.created_at)
  const timeHtml = timeText ? `<span class="message-time">${timeText}</span>` : ''

  return `
    <div class="message-item ${bubbleClass}" data-msg-id="${msgId}" role="article" aria-label="${isUser ? '用户消息' : 'AI 回复'}">
      ${thinkingHtml}
      <div class="message-bubble" aria-live="${isUser ? 'off' : 'polite'}">${content}${searchSourcesHtml}</div>
      <div class="message-footer">
        ${timeHtml}
        ${actions}
      </div>
    </div>
  `
}

/**
 * 为代码块添加复制按钮
 */
function addCopyButtonToCodeBlock(pre) {
  const code = pre.querySelector('code')
  if (!code) return

  const wrapper = document.createElement('div')
  wrapper.className = 'code-block-wrapper'
  pre.parentNode.insertBefore(wrapper, pre)
  wrapper.appendChild(pre)

  const lang = code.className.match(/language-(\w+)/)
  const langLabel = lang ? lang[1] : ''

  const header = document.createElement('div')
  header.className = 'code-block-header'

  const langSpan = document.createElement('span')
  langSpan.className = 'code-lang'
  langSpan.textContent = langLabel

  const copyBtn = document.createElement('button')
  copyBtn.className = 'code-copy-btn'
  copyBtn.setAttribute('aria-label', '复制代码')

  const copyIconSvg = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'
  const checkIconSvg = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>'
  copyBtn.innerHTML = copyIconSvg

  copyBtn.addEventListener('click', () => {
    copyToClipboard(code.textContent).then(() => {
      copyBtn.innerHTML = checkIconSvg
      copyBtn.classList.add('copied')
      showToast('代码已复制', 'success', 1500)
      setTimeout(() => {
        copyBtn.innerHTML = copyIconSvg
        copyBtn.classList.remove('copied')
      }, 2000)
    }).catch(() => {
      showToast('复制失败', 'error')
    })
  })

  header.appendChild(langSpan)
  header.appendChild(copyBtn)
  wrapper.insertBefore(header, pre)
}

/* ============================================================
 * 消息操作按钮
 * ============================================================ */

/**
 * 增强表格 — 与代码块风格统一
 * 左上角 "table" 标识 + 右上角复制按钮 + 横向滚动 + 边缘渐变提示
 * @param {Element} container - 包含表格的容器元素
 */
function enhanceTables(container) {
  const tables = container.querySelectorAll('table')
  tables.forEach(table => {
    // 跳过已处理的表格
    if (table.closest('.table-block-wrapper')) return

    // 创建外层容器（与 .code-block-wrapper 统一风格）
    const wrapper = document.createElement('div')
    wrapper.className = 'table-block-wrapper'
    table.parentNode.insertBefore(wrapper, table)

    // 创建顶部栏（与 .code-block-header 统一风格）
    const header = document.createElement('div')
    header.className = 'table-block-header'

    // 左上角：table 标识
    const label = document.createElement('span')
    label.className = 'table-block-lang'
    label.textContent = 'table'

    // 右上角：复制按钮
    const copyBtn = document.createElement('button')
    copyBtn.className = 'table-copy-btn'
    copyBtn.setAttribute('aria-label', '复制表格')

    const copyIconSvg = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'
    const checkIconSvg = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>'
    copyBtn.innerHTML = copyIconSvg

    copyBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      const tsv = tableToTSV(table)
      copyToClipboard(tsv).then(() => {
        showToast('表格已复制，可粘贴到 Excel/Word', 'success', 2000)
        copyBtn.innerHTML = checkIconSvg
        copyBtn.classList.add('copied')
        setTimeout(() => {
          copyBtn.innerHTML = copyIconSvg
          copyBtn.classList.remove('copied')
        }, 2000)
      }).catch(() => {
        showToast('复制失败', 'error')
      })
    })

    header.appendChild(label)
    header.appendChild(copyBtn)

    // 创建表格滚动区域
    const scrollArea = document.createElement('div')
    scrollArea.className = 'table-scroll-area'

    wrapper.appendChild(header)
    wrapper.appendChild(scrollArea)
    scrollArea.appendChild(table)

    // 检测横向滚动状态，添加边缘渐变
    const updateScrollHints = () => {
      const canScrollLeft = scrollArea.scrollLeft > 2
      const canScrollRight = scrollArea.scrollLeft < scrollArea.scrollWidth - scrollArea.clientWidth - 2
      scrollArea.classList.toggle('scrollable-left', canScrollLeft)
      scrollArea.classList.toggle('scrollable-right', canScrollRight)
    }
    scrollArea.addEventListener('scroll', updateScrollHints)
    requestAnimationFrame(updateScrollHints)
  })
}

/**
 * 将 HTML 表格转换为 TSV（制表符分隔）格式
 * 支持 Excel/Word 粘贴时保持表格结构
 * @param {HTMLTableElement} table
 * @returns {string}
 */
function tableToTSV(table) {
  const rows = table.querySelectorAll('tr')
  const lines = []
  rows.forEach(row => {
    const cells = row.querySelectorAll('th, td')
    const cellTexts = Array.from(cells).map(cell => {
      // 获取纯文本，替换换行和制表符
      let text = cell.textContent.replace(/\t/g, ' ').replace(/\n/g, ' ').trim()
      // 如果包含特殊字符，用引号包裹
      if (text.includes('"')) {
        text = '"' + text.replace(/"/g, '""') + '"'
      }
      return text
    })
    lines.push(cellTexts.join('\t'))
  })
  return lines.join('\n')
}

/**
 * 复制文本到剪贴板（兼容非 HTTPS 环境）
 * @param {string} text - 要复制的文本
 * @returns {Promise<void>}
 */
function copyToClipboard(text) {
  // 优先使用 Clipboard API（需 HTTPS 或 localhost）
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    return navigator.clipboard.writeText(text)
  }

  // 降级：使用 execCommand
  return new Promise((resolve, reject) => {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()

    try {
      if (document.execCommand('copy')) {
        resolve()
      } else {
        reject(new Error('execCommand copy failed'))
      }
    } catch (e) {
      reject(e)
    } finally {
      document.body.removeChild(textarea)
    }
  })
}

/**
 * 绑定消息操作按钮事件
 */
function bindMessageActions(container) {
  // 绑定操作按钮点击事件
  container.querySelectorAll('.msg-action-btn').forEach(btn => {
    if (btn.dataset.bound === 'true') return
    btn.dataset.bound = 'true'

    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      const action = btn.dataset.action
      const msgItem = btn.closest('.message-item')
      if (!msgItem) return

      const msgId = msgItem.dataset.msgId
      const msg = state.messages.find(m => m.id === msgId)
      if (!msg) return

      switch (action) {
        case 'copy':
          copyToClipboard(msg.content).then(() => {
            showToast('已复制', 'success', 1500)
          })
          break
        case 'regenerate':
          handleRegenerate(msg)
          break
        case 'like':
          showToast('感谢反馈', 'success', 1000)
          btn.classList.add('active')
          break
        case 'delete':
          handleDeleteMessage(msgId)
          break
      }
    })
  })

  // 绑定鼠标悬停事件（补充 CSS :hover，确保浏览器自动化和触屏环境可用）
  container.querySelectorAll('.message-item').forEach(item => {
    if (item.dataset.hoverBound === 'true') return
    item.dataset.hoverBound = 'true'

    item.addEventListener('mouseenter', () => {
      item.classList.add('show-actions')
    })
    item.addEventListener('mouseleave', () => {
      item.classList.remove('show-actions')
    })
  })
}

/**
 * 处理重新生成 — 删除原 AI 回复后重新调用 API
 */
function handleRegenerate(msg) {
  if (state.isGenerating) {
    showToast('请等待当前回复完成', 'warning')
    return
  }

  // 清除暂停状态
  if (state.isPaused) {
    state.isPaused = false
    const sendBtn = document.getElementById('sendBtn')
    if (sendBtn) sendBtn.classList.remove('paused', 'generating')
  }

  // 找到该 AI 消息之前的用户消息
  const idx = state.messages.findIndex(m => m.id === msg.id)
  if (idx === -1) return

  // 删除该 AI 消息（本地 + Supabase）
  const removedMsg = state.messages[idx]
  if (removedMsg.db_id) {
    dbDeleteMessage(removedMsg.db_id).catch(e => {
      console.warn('[iDrome Chat] 删除消息失败:', e.message)
    })
  }

  state.messages = state.messages.slice(0, idx)
  renderMessages(state.messages)

  // 触发 AI 回复
  generateAIReply()
}

/**
 * 显示确认对话框
 * @param {string} title - 对话框标题
 * @param {string} message - 提示文本
 * @param {string} confirmText - 确认按钮文本
 * @param {string} cancelText - 取消按钮文本
 * @returns {Promise<boolean>} 用户是否确认
 */
function showConfirmDialog(title, message, confirmText = '确认', cancelText = '取消') {
  return new Promise(resolve => {
    // 创建遮罩层
    const overlay = document.createElement('div')
    overlay.className = 'confirm-dialog-overlay'

    // 创建对话框
    const dialog = document.createElement('div')
    dialog.className = 'confirm-dialog'
    dialog.innerHTML = `
      <div class="confirm-dialog-header">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <span class="confirm-dialog-title">${title}</span>
      </div>
      <div class="confirm-dialog-body">${message}</div>
      <div class="confirm-dialog-footer">
        <button class="confirm-btn-cancel">${cancelText}</button>
        <button class="confirm-btn-ok">${confirmText}</button>
      </div>
    `

    overlay.appendChild(dialog)
    document.body.appendChild(overlay)

    let resolved = false

    const cleanup = () => {
      overlay.classList.add('closing')
      setTimeout(() => {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay)
      }, 200)
    }

    // 取消按钮
    dialog.querySelector('.confirm-btn-cancel').addEventListener('click', () => {
      if (resolved) return
      resolved = true
      cleanup()
      resolve(false)
    })

    // 确认按钮
    dialog.querySelector('.confirm-btn-ok').addEventListener('click', () => {
      if (resolved) return
      resolved = true
      cleanup()
      resolve(true)
    })

    // 点击遮罩层取消
    overlay.addEventListener('click', e => {
      if (e.target === overlay && !resolved) {
        resolved = true
        cleanup()
        resolve(false)
      }
    })

    // ESC 键取消
    const escHandler = e => {
      if (e.key === 'Escape' && !resolved) {
        resolved = true
        cleanup()
        document.removeEventListener('keydown', escHandler)
        resolve(false)
      }
    }
    document.addEventListener('keydown', escHandler)

    // 自动聚焦确认按钮
    setTimeout(() => dialog.querySelector('.confirm-btn-ok').focus(), 100)
  })
}

/**
 * 处理删除消息（本地 + Supabase）
 */
async function handleDeleteMessage(msgId) {
  const confirmed = await showConfirmDialog(
    '删除消息',
    '此操作不可撤销，确定要删除这条消息吗？',
    '🗑️ 确认删除',
    '取消'
  )
  if (!confirmed) return

  const msg = state.messages.find(m => m.id === msgId)
  if (msg && msg.db_id) {
    dbDeleteMessage(msg.db_id).catch(e => {
      console.warn('[iDrome Chat] 删除消息失败:', e.message)
    })
  }
  state.messages = state.messages.filter(m => m.id !== msgId)
  renderMessages(state.messages)
  showToast('消息已删除', 'success', 1500)
}

/* ============================================================
 * 发送消息 + Mock 流式回复
 * ============================================================ */

/**
 * 发送消息
 * @param {string} content - 消息内容
 * @param {Object} options - 附加选项
 */
export async function sendMessage(content, options = {}) {
  if (!content || state.isGenerating || state.isPaused) return

  // 如果没有当前对话，创建新对话（持久化到 Supabase）
  if (!state.currentConversationId) {
    await createNewConversation(content)
  }

  // 添加用户消息到状态
  const userMsg = {
    id: genId('user'),
    conversation_id: state.currentConversationId,
    role: 'user',
    content,
    created_at: nowISO()
  }

  // 持久化用户消息到 Supabase（异步，不阻塞渲染）
  // 传入客户端 created_at — 确保与 AI 消息的时间戳顺序一致
  dbInsertMessage({
    conversation_id: state.currentConversationId,
    role: 'user',
    content,
    created_at: userMsg.created_at
  }).then(inserted => {
    if (inserted) {
      // 更新消息 ID 为数据库 ID
      const idx = state.messages.findIndex(m => m.id === userMsg.id)
      if (idx !== -1) {
        state.messages[idx].db_id = inserted.id
      }
    }
  }).catch(e => {
    console.warn('[iDrome Chat] 用户消息持久化失败:', e.message)
  })

  // 更新对话的 updated_at 时间戳
  dbTouchConversation(state.currentConversationId)

  // 如果是首条消息，异步生成 AI 标题
  const isFirstMessage = state.messages.length === 0
  if (isFirstMessage) {
    dbGenerateTitle(content).then(title => {
      dbUpdateConversationTitle(state.currentConversationId, title).then(() => {
        // 更新本地状态中的标题
        const conv = state.conversations.find(c => c.id === state.currentConversationId)
        if (conv) {
          conv.title = title
          const titleEl = document.getElementById('conversationTitle')
          if (titleEl) titleEl.textContent = title
          // 触发对话列表重新渲染
          document.dispatchEvent(new CustomEvent('idrome:conversation-updated', {
            detail: { conversationId: state.currentConversationId, title }
          }))
        }
      })
    }).catch(e => {
      console.warn('[iDrome Chat] AI 标题生成失败:', e.message)
    })
  }

  // 使用展开赋值模式（Proxy 响应式）
  state.messages = [...state.messages, userMsg]
  console.log('[iDrome Chat] 用户消息已创建:', { id: userMsg.id, created_at: userMsg.created_at, content: content.substring(0, 30) })

  // 渲染用户消息
  renderMessages(state.messages, true)

  // 触发 AI 回复（持久化在 generateAIReply 中处理）
  await generateAIReply()

  // 如果是从建议卡片触发，且模式未锁定
  if (options.autoLock !== false && !state.modeLocked) {
    state.modeLocked = true
  }
}

/**
 * 创建新对话（持久化到 Supabase）
 * @param {string} firstMessage - 首条消息（用于生成标题）
 * @returns {Promise<Object|null>} 新对话对象
 */
async function createNewConversation(firstMessage) {
  const title = firstMessage.slice(0, 20) + (firstMessage.length > 20 ? '...' : '')

  // 尝试通过 Supabase 创建对话
  const conv = await dbCreateConversation(state.currentMode, state.currentModel || 'deepseek-v4-flash')

  if (conv) {
    // Supabase 创建成功
    state.conversations = [conv, ...state.conversations]
    state.currentConversationId = conv.id
  } else {
    // 降级：使用本地临时对话（Supabase 不可用时）
    const localConv = {
      id: genId('conv'),
      title,
      mode: state.currentMode,
      pinned: false,
      archived: false,
      model_version: state.currentModel || 'deepseek-v4-flash',
      updated_at: nowISO(),
      created_at: nowISO()
    }
    state.conversations = [localConv, ...state.conversations]
    state.currentConversationId = localConv.id
  }

  // 更新 UI
  const titleEl = document.getElementById('conversationTitle')
  if (titleEl) titleEl.textContent = title

  const welcomePage = document.getElementById('welcomePage')
  const chatArea = document.getElementById('chatArea')
  if (welcomePage) welcomePage.style.display = 'none'
  if (chatArea) chatArea.style.display = 'flex'

  return state.conversations[0]
}

/**
 * 生成 AI 回复（流式）
 * 步骤 4：通过 apiRouter 调用真实 DeepSeek API
 * 开发环境自动回退到 Mock 层
 */
async function generateAIReply() {
  state.isGenerating = true

  // 记录 AI 响应开始时间
  aiResponseStartTime = Date.now()
  thinkingStartTime = null
  thinkingEndTime = null

  // 创建 AI 占位消息
  const aiMsg = {
    id: genId('ai'),
    conversation_id: state.currentConversationId,
    role: 'assistant',
    content: '',
    reasoning: '',
    created_at: nowISO(),
    model_version: state.currentModel || 'deepseek-v4-flash'
  }

  state.messages = [...state.messages, aiMsg]
  console.log('[iDrome Chat] AI消息已创建:', { id: aiMsg.id, created_at: aiMsg.created_at })

  // 持久化 AI 空消息到 Supabase（内容后续 UPDATE）
  // 传入客户端 created_at — 确保排在用户消息之后（generateAIReply 在 sendMessage 中被 await 调用，时间戳必然晚于用户消息）
  dbInsertMessage({
    conversation_id: state.currentConversationId,
    role: 'assistant',
    content: '',
    reasoning: '',
    created_at: aiMsg.created_at
  }).then(inserted => {
    if (inserted) {
      aiMsg.db_id = inserted.id
    }
  }).catch(e => {
    console.warn('[iDrome Chat] AI 消息持久化失败:', e.message)
  })

  // 渲染空 AI 消息（显示加载动画）
  renderMessages(state.messages, true)

  // 显示加载动画
  showLoadingAnimation()

  // 创建 AbortController（用于停止生成）
  currentAbortController = new AbortController()

  // 显示停止生成按钮
  showStopGeneratingBtn()

  // 上下文管理 — 检查 Token 用量并执行滑动窗口
  const contextResult = await manageContext(state.messages.filter(m => !m.expired))
  const messagesToSend = contextResult.messages

  // 更新上下文进度条
  updateContextProgress(contextResult.tokens)

  // 注入系统提示词 — 加载当前模式的知识库（system-prompt.md + 辅助文件）
  // 普通模式仅在新对话首轮追加用户个人知识库内容，后续轮次不重复添加（减少 API 费用）
  try {
    const systemPrompt = await loadKnowledge(state.currentMode, state.currentModel)
    let fullSystemPrompt = systemPrompt

    // 普通模式 — 仅首轮注入用户个人知识库
    // 判定依据：当前 state.messages 中用户消息数为 1（即本轮是首轮交互）
    // 继续已有对话时，用户消息数 > 1，不再重复注入（首轮已注入过，AI 回复已体现知识库内容）
    const userMessageCount = state.messages.filter(m => m.role === 'user').length
    const isFirstRound = userMessageCount <= 1
    if (state.currentMode === 'general' && isFirstRound && state.knowledgeBaseFiles?.length > 0) {
      const userKnowledge = await loadUserKnowledgeBase(state.knowledgeCharLimit || 3000)
      if (userKnowledge) {
        fullSystemPrompt += `\n\n## 用户个人知识库\n\n以下是通过用户上传的文件提取的内容。请在回答时：\n1. 优先参考这些知识库内容回答用户问题\n2. 引用知识库中的具体信息时，可注明"根据知识库内容"\n3. 若知识库内容与用户问题无关，可正常回答无需强行引用\n\n### 知识库内容\n\n${userKnowledge}`
        console.log('[iDrome Chat] 个人知识库已注入（首轮）')
      }
    } else if (state.currentMode === 'general' && !isFirstRound) {
      // 后续轮次：提示 AI 此对话已有个人知识库上下文（不重复发送内容，仅保留引用提示）
      fullSystemPrompt += `\n\n## 用户个人知识库\n\n本对话首轮已注入用户个人知识库内容，请结合历史对话上下文中的知识库信息回答。`
      console.log('[iDrome Chat] 个人知识库首轮已注入，本轮跳过（节省 API 费用）')
    }

    // 将 system-prompt 作为第一条消息注入
    messagesToSend.unshift({
      role: 'system',
      content: fullSystemPrompt
    })
    console.log(`[iDrome Chat] 系统提示词已注入: ${state.currentMode} (${fullSystemPrompt.length} 字符)`)
  } catch (e) {
    console.warn('[iDrome Chat] 系统提示词加载失败，使用默认行为:', e.message)
  }

  try {
    // 通过 apiRouter 调用 API（开发环境自动 Mock 拦截）
    const result = await apiRouter.chat(messagesToSend, {
      stream: true,
      thinking: state.deepThinkingEnabled ? { type: 'enabled' } : { type: 'disabled' },
      conversationId: state.currentConversationId,
      model: state.currentModel || 'deepseek-v4-flash',
      temperature: state.modelParams?.temperature ?? 0.7,
      maxTokens: state.modelParams?.maxTokens ?? 4096,
      signal: currentAbortController.signal,
      webSearchEnabled: state.webSearchEnabled,
      onSearchStatus: (status, data) => {
        // 搜索状态回调 — 显示搜索进度 UI
        console.log('[iDrome Chat] onSearchStatus 回调被调用:', status, data)
        if (status === 'searching') {
          showSearchStatus('searching', data)
        } else if (status === 'success') {
          showSearchStatus('success', data)
        } else if (status === 'failed') {
          showSearchStatus('failed', data)
        } else if (status === 'skipped') {
          showSearchStatus('skipped', data)
        }
      },
      onChunk: (delta, fullContent) => {
        // 第一个 content chunk — 思考过程结束
        if (thinkingStartTime && !thinkingEndTime) {
          thinkingEndTime = Date.now()
        }
        // 更新 AI 消息内容
        hideLoadingAnimation()
        const lastMsg = state.messages[state.messages.length - 1]
        if (lastMsg && lastMsg.role === 'assistant') {
          lastMsg.content = fullContent
          updateLastMessage(fullContent)
        }
      },
      onReasoningChunk: (delta, fullReasoning) => {
        // 仅在用户明确启用深度思考时才显示思考过程
        // 防止搜索模式或 API 自动返回 reasoning_content 时误触发深度思考 UI
        if (!state.deepThinkingEnabled) return
        // 第一个 reasoning chunk — 思考过程开始
        if (!thinkingStartTime) {
          thinkingStartTime = Date.now()
        }
        // 显示思考过程并保存到消息对象
        if (delta) {
          const lastMsg = state.messages[state.messages.length - 1]
          if (lastMsg && lastMsg.role === 'assistant') {
            lastMsg.reasoning = fullReasoning
          }
          showThinkingProcess(fullReasoning)
        }
      }
    })

    // 确保最终内容已渲染
    hideLoadingAnimation()
    hideThinkingProcess()

    // 更新最后一条消息（避免全量 re-render 导致闪烁）
    const lastMsg = state.messages[state.messages.length - 1]
    if (lastMsg && lastMsg.role === 'assistant') {
      lastMsg.content = result.content
      // 仅在用户明确启用深度思考时才保存 reasoning，防止搜索模式下 API 自动返回的 reasoning 被持久化
      // 这样可确保"思考模式关闭 → 不存储任何思考内容 → 重新渲染时也不会显示思考气泡"
      if (result.reasoning && state.deepThinkingEnabled) {
        lastMsg.reasoning = result.reasoning
      } else {
        // 思考未启用时强制清空，避免历史残留或 API 误返回
        lastMsg.reasoning = ''
        lastMsg.thinking_time = null
      }
      if (result.searchResults && result.searchResults.length > 0) {
        lastMsg.searchResults = result.searchResults
      }
      // 仅更新最后一条消息，不触发全量 re-render
      finalizeLastMessage(lastMsg)

      // 持久化最终内容到 Supabase
      // 思考未启用时 reasoning 传 null，避免数据库残留思考内容
      if (lastMsg.db_id) {
        const persistReasoning = state.deepThinkingEnabled ? result.reasoning : null
        dbUpdateMessageContent(lastMsg.db_id, result.content, persistReasoning, state.deepThinkingEnabled ? lastMsg.thinking_time : null).catch(e => {
          console.warn('[iDrome Chat] AI 消息内容更新失败:', e.message)
        })
        // 持久化搜索引用 — 重新进入对话后可恢复引用链接和参考来源
        if (result.searchResults && result.searchResults.length > 0) {
          dbSaveSearchReferences(lastMsg.db_id, result.searchResults).catch(e => {
            console.warn('[iDrome Chat] 搜索引用保存失败:', e.message)
          })
        }
      } else {
        // db_id 尚未赋值（insert 还在进行中）— 延迟重试
        setTimeout(() => {
          if (lastMsg.db_id) {
            dbUpdateMessageContent(lastMsg.db_id, result.content, result.reasoning, lastMsg.thinking_time).catch(() => {})
            if (result.searchResults && result.searchResults.length > 0) {
              dbSaveSearchReferences(lastMsg.db_id, result.searchResults).catch(() => {})
            }
          }
        }, 1000)
      }

      // 更新对话 updated_at
      dbTouchConversation(state.currentConversationId)
    }

    // 显示 Token 用量信息
    if (result.usage) {
      showUsageInfo(result.usage)
    }

  } catch (e) {
    hideLoadingAnimation()

    if (e.name === 'AbortError') {
      // 用户主动停止 — 保留已生成内容（包括思考过程）
      console.log('[iDrome Chat] 用户停止生成')
      const lastMsg = state.messages[state.messages.length - 1]
      if (lastMsg && lastMsg.role === 'assistant') {
        finalizeLastMessage(lastMsg)
      }
    } else {
      // 真正的错误 — 移除动态思考元素
      removeThinkingProcess()
      console.error('[iDrome Chat] AI 回复失败：', e)

      // 在消息气泡内渲染错误信息 + 重试按钮
      const container = document.getElementById('messageList')
      if (container) {
        // 移除空的 AI 占位消息
        const lastMsg = state.messages[state.messages.length - 1]
        if (lastMsg && lastMsg.role === 'assistant' && !lastMsg.content) {
          state.messages = state.messages.slice(0, -1)
        }

        renderErrorBubble(container, e, () => {
          // 重试回调 — 移除错误气泡后重新生成
          const errorEl = container.querySelector('.error-message')
          if (errorEl) errorEl.remove()
          generateAIReply()
        })
      }

      // 同时显示 Toast 提示
      if (e instanceof APIError) {
        showToast(e.getUserMessage(), 'error')
      } else {
        showToast('AI 回复失败，请重试', 'error')
      }
    }
  } finally {
    state.isGenerating = false
    // 仅在非暂停状态下重置按钮（暂停时保持"继续"按钮状态）
    if (!state.isPaused) {
      hideStopGeneratingBtn()
    }
    hideSearchStatus()
    currentAbortController = null
  }
}

/**
 * 停止生成（暂停）
 * @param {boolean} silent - 是否静默停止（不显示 toast）
 */
export function stopGenerating(silent = false) {
  if (currentAbortController) {
    currentAbortController.abort()
    if (!silent) showToast('已暂停生成', 'info', 1000)

    // 检查是否有已生成的部分内容 — 如果有则进入暂停状态
    const lastMsg = state.messages[state.messages.length - 1]
    if (lastMsg && lastMsg.role === 'assistant' && lastMsg.content && lastMsg.content.trim()) {
      state.isPaused = true
      // 将发送按钮切换为"继续"状态
      const sendBtn = document.getElementById('sendBtn')
      if (sendBtn) {
        sendBtn.classList.remove('generating')
        sendBtn.classList.add('paused')
        sendBtn.setAttribute('aria-label', '继续生成')
        sendBtn.title = '继续生成'
      }
    }
  }
}

/**
 * 继续生成 — 从暂停位置继续生成剩余内容
 * 保留已生成的文本，将部分内容作为 assistant 消息发送给 API，模型将继续生成
 */
export async function continueGeneration() {
  if (state.isGenerating) return

  state.isPaused = false

  const sendBtn = document.getElementById('sendBtn')
  if (sendBtn) {
    sendBtn.classList.remove('paused')
  }

  const lastMsg = state.messages[state.messages.length - 1]
  if (!lastMsg || lastMsg.role !== 'assistant' || !lastMsg.content || !lastMsg.content.trim()) {
    // 无部分内容可继续 — 从头生成
    await generateAIReply()
    return
  }

  // 保留已生成的部分内容，继续生成
  state.isGenerating = true
  aiResponseStartTime = Date.now()

  // 重置思考计时（续写时重新计时）
  thinkingStartTime = null
  thinkingEndTime = null

  currentAbortController = new AbortController()
  showStopGeneratingBtn()

  // 记住部分内容 — API 返回的 delta 是续写部分，需要拼接到 partialContent 后面
  const partialContent = lastMsg.content
  const partialReasoning = lastMsg.reasoning || ''

  // 发送的消息包含部分 assistant 回复 — 模型将从此处继续
  const contextResult = await manageContext(state.messages.filter(m => !m.expired))
  const messagesToSend = contextResult.messages
  updateContextProgress(contextResult.tokens)

  try {
    const result = await apiRouter.chat(messagesToSend, {
      stream: true,
      thinking: state.deepThinkingEnabled ? { type: 'enabled' } : { type: 'disabled' },
      conversationId: state.currentConversationId,
      model: state.currentModel || 'deepseek-v4-flash',
      temperature: state.modelParams?.temperature ?? 0.7,
      maxTokens: state.modelParams?.maxTokens ?? 4096,
      signal: currentAbortController.signal,
      webSearchEnabled: state.webSearchEnabled,
      onSearchStatus: (status, data) => {
        if (status === 'searching') {
          showSearchStatus('searching', data)
        } else if (status === 'success') {
          showSearchStatus('success', data)
        } else if (status === 'failed') {
          showSearchStatus('failed', data)
        } else if (status === 'skipped') {
          showSearchStatus('skipped', data)
        }
      },
      onChunk: (delta, fullContent) => {
        // fullContent 是续写部分，需要拼接到 partialContent
        const newFullContent = partialContent + fullContent
        if (thinkingStartTime && !thinkingEndTime) {
          thinkingEndTime = Date.now()
        }
        hideLoadingAnimation()
        const msg = state.messages[state.messages.length - 1]
        if (msg && msg.role === 'assistant') {
          msg.content = newFullContent
          updateLastMessage(newFullContent)
        }
      },
      onReasoningChunk: (delta, fullReasoning) => {
        // 仅在用户明确启用深度思考时才显示思考过程
        if (!state.deepThinkingEnabled) {
          if (delta && !delta._logged) {
            console.log('[iDrome Chat] 思考已禁用，忽略 API 返回的 reasoning_content')
            delta._logged = true
          }
          return
        }
        if (!thinkingStartTime) {
          thinkingStartTime = Date.now()
        }
        if (delta) {
          const msg = state.messages[state.messages.length - 1]
          if (msg && msg.role === 'assistant') {
            msg.reasoning = partialReasoning + fullReasoning
          }
          showThinkingProcess(partialReasoning + fullReasoning)
        }
      }
    })

    hideLoadingAnimation()
    hideThinkingProcess()

    const msg = state.messages[state.messages.length - 1]
    if (msg && msg.role === 'assistant') {
      // 拼接部分内容 + 续写内容
      msg.content = partialContent + result.content
      // 仅在用户明确启用深度思考时才拼接 reasoning，否则清空
      if (result.reasoning && state.deepThinkingEnabled) {
        msg.reasoning = partialReasoning + result.reasoning
      } else {
        msg.reasoning = ''
        msg.thinking_time = null
      }
      if (result.searchResults && result.searchResults.length > 0) {
        msg.searchResults = result.searchResults
      }
      finalizeLastMessage(msg)

      // 更新数据库中的消息内容
      // 思考未启用时 reasoning 传 null
      if (msg.db_id) {
        const persistReasoning = state.deepThinkingEnabled ? msg.reasoning : null
        dbUpdateMessageContent(msg.db_id, msg.content, persistReasoning, state.deepThinkingEnabled ? msg.thinking_time : null).catch(e => {
          console.warn('[iDrome Chat] 续写内容更新失败:', e.message)
        })
      }
      dbTouchConversation(state.currentConversationId)
    }

    if (result.usage) {
      showUsageInfo(result.usage)
    }
  } catch (e) {
    hideLoadingAnimation()

    if (e.name === 'AbortError') {
      // 用户再次暂停 — 保留已生成内容
      console.log('[iDrome Chat] 续写被暂停')
      const msg = state.messages[state.messages.length - 1]
      if (msg && msg.role === 'assistant') {
        finalizeLastMessage(msg)
      }
    } else {
      removeThinkingProcess()
      console.error('[iDrome Chat] 续写失败：', e)
      if (e instanceof APIError) {
        showToast(e.getUserMessage(), 'error')
      } else {
        showToast('续写失败，请重试', 'error')
      }
    }
  } finally {
    state.isGenerating = false
    if (!state.isPaused) {
      hideStopGeneratingBtn()
    }
    hideSearchStatus()
    currentAbortController = null
  }
}

/* ============================================================
 * 加载动画 / 思考过程 / 停止按钮
 * ============================================================ */

/**
 * 显示加载动画 — 注入到 AI 消息气泡内部（非独立消息项）
 */
function showLoadingAnimation() {
  const container = document.getElementById('messageList')
  if (!container) return

  // 找到最后一条 AI 消息（排除 loading 占位）
  const items = container.querySelectorAll('.message-item:not(.loading-message)')
  const lastItem = items[items.length - 1]
  if (!lastItem) return

  const bubble = lastItem.querySelector('.message-bubble')
  if (bubble) {
    bubble.innerHTML = `
      <div class="loading-dots">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    `
  }

  if (autoScrollEnabled) scrollToBottom()
  checkScrollPosition()
}

/**
 * 隐藏加载动画 — 清除气泡中的加载占位（内容到达时由 updateLastMessage 替换）
 */
function hideLoadingAnimation() {
  const container = document.getElementById('messageList')
  if (!container) return
  const items = container.querySelectorAll('.message-item:not(.loading-message)')
  const lastItem = items[items.length - 1]
  if (!lastItem) return
  const bubble = lastItem.querySelector('.message-bubble')
  if (bubble && bubble.querySelector('.loading-dots')) {
    bubble.innerHTML = ''
  }
}

/**
 * 显示思考过程 — 渲染在 AI 消息气泡内部（正式文本上方）
 */
function showThinkingProcess(reasoning) {
  const container = document.getElementById('messageList')
  if (!container) return

  // 找到当前 AI 消息项（排除 loading 占位消息）
  const items = container.querySelectorAll('.message-item:not(.loading-message)')
  const lastItem = items[items.length - 1]
  if (!lastItem) return

  let thinkingEl = lastItem.querySelector('.thinking-process')
  if (!thinkingEl) {
    thinkingEl = document.createElement('div')
    thinkingEl.className = 'thinking-process expanded thinking-inline'
    thinkingEl.innerHTML = `
      <div class="thinking-header">
        <svg class="thinking-toggle" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
        <span>思考过程</span>
        <span class="thinking-time-badge thinking-time-live"></span>
      </div>
      <div class="thinking-content"></div>
    `
    // 插入到 message-bubble 之前（上方）
    const bubble = lastItem.querySelector('.message-bubble')
    if (bubble) {
      lastItem.insertBefore(thinkingEl, bubble)
    } else {
      lastItem.appendChild(thinkingEl)
    }

    // 点击折叠/展开
    const header = thinkingEl.querySelector('.thinking-header')
    header.dataset.bound = 'true'
    header.addEventListener('click', () => {
      thinkingEl.classList.toggle('expanded')
    })

    // 实时更新思考用时
    if (thinkingStartTime) {
      const liveBadge = thinkingEl.querySelector('.thinking-time-live')
      if (liveBadge) {
        const updateLiveTime = () => {
          if (!thinkingEl.isConnected) return
          const elapsed = ((Date.now() - thinkingStartTime) / 1000).toFixed(1)
          liveBadge.textContent = `用时 ${elapsed}s`
          if (!thinkingEndTime) {
            requestAnimationFrame(updateLiveTime)
          }
        }
        requestAnimationFrame(updateLiveTime)
      }
    }
  }

  const content = thinkingEl.querySelector('.thinking-content')
  if (content) {
    content.textContent = reasoning
  }

  if (autoScrollEnabled) scrollToBottom()
}

/**
 * 隐藏思考过程 — 正式文本输出完成后保留思考内容
 * 不移除元素，由 renderMessages() 最终渲染时通过 renderMessageItem 保留
 */
function hideThinkingProcess() {
  // 不移除思考过程元素 — 保留显示
  // 最终渲染 renderMessages() 会通过 renderMessageItem 重新包含思考内容
}

/**
 * 移除动态思考过程元素（仅用于错误时清理）
 */
function removeThinkingProcess() {
  const container = document.getElementById('messageList')
  if (!container) return
  const thinkingEls = container.querySelectorAll('.thinking-process.thinking-inline')
  thinkingEls.forEach(el => el.remove())
}

/**
 * 显示停止生成按钮 — 将发送按钮转为暂停状态
 */
function showStopGeneratingBtn() {
  const sendBtn = document.getElementById('sendBtn')
  if (sendBtn) {
    sendBtn.classList.add('generating')
    sendBtn.classList.remove('paused')
    sendBtn.disabled = false
    sendBtn.setAttribute('aria-label', '暂停生成')
    sendBtn.title = '暂停生成'
  }
}

/**
 * 隐藏停止生成按钮 — 恢复发送按钮为正常状态
 */
function hideStopGeneratingBtn() {
  const sendBtn = document.getElementById('sendBtn')
  if (sendBtn) {
    sendBtn.classList.remove('generating', 'paused')
    sendBtn.setAttribute('aria-label', '发送消息')
    sendBtn.title = '发送消息'
    // 触发 input 事件，让 input.js 重新评估 disabled 状态
    const input = document.getElementById('messageInput')
    if (input) {
      input.dispatchEvent(new Event('input', { bubbles: true }))
    }
  }
}

/* ============================================================
 * 消息更新（流式渲染）
 * ============================================================ */

/**
 * 更新最后一条消息的内容
 */
function updateLastMessage(content) {
  const container = document.getElementById('messageList')
  if (!container) return

  // 排除 loading 占位消息，找到真正的 AI 消息
  const items = container.querySelectorAll('.message-item:not(.loading-message)')
  const lastItem = items[items.length - 1]
  if (!lastItem) return

  const bubble = lastItem.querySelector('.message-bubble')
  if (bubble) {
    bubble.innerHTML = renderMarkdown(content)
  }

  if (autoScrollEnabled) {
    scrollToBottom()
  }

  // 检查滚动位置
  checkScrollPosition()
}

/* ============================================================
 * 滚动控制
 * ============================================================ */

/**
 * 滚动到底部（瞬时，不使用平滑动画，避免干扰用户滚动）
 */
export function scrollToBottom() {
  const container = document.getElementById('messageList')
  if (container) {
    isProgrammaticScroll = true
    container.scrollTop = container.scrollHeight
    // 下一事件循环重置标志（scroll 事件在当前同步代码后触发）
    setTimeout(() => { isProgrammaticScroll = false }, 0)
  }
}

/**
 * 平滑滚动到底部（仅用于用户点击按钮）
 */
export function scrollToBottomSmooth() {
  const container = document.getElementById('messageList')
  if (container) {
    isProgrammaticScroll = true
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' })
    // 平滑滚动持续较久，延长标志时间
    setTimeout(() => { isProgrammaticScroll = false }, 500)
  }
}

/**
 * 检查滚动位置并更新按钮状态
 * 在每次渲染消息后调用，确保按钮状态正确
 */
export function checkScrollPosition() {
  const container = document.getElementById('messageList')
  const scrollBtn = document.getElementById('scrollToBottomBtn')
  if (!container || !scrollBtn) return

  // 如果 chatArea 不可见，跳过
  const chatArea = document.getElementById('chatArea')
  if (chatArea && chatArea.style.display === 'none') return

  const isScrollable = container.scrollHeight > container.clientHeight + 10
  const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100

  if (isScrollable && !isAtBottom) {
    scrollBtn.style.display = 'flex'
  } else {
    scrollBtn.style.display = 'none'
  }
}

/**
 * 初始化智能滚动控制
 * - 用户上滚暂停自动滚底
 * - 500ms 后恢复
 * - "↓ 回到底部"浮动按钮
 */
export function initScrollControl() {
  const container = document.getElementById('messageList')
  const scrollBtn = document.getElementById('scrollToBottomBtn')
  if (!container) return

  container.addEventListener('scroll', () => {
    // 跳过程序化滚动 — 只处理用户触发的滚动
    if (isProgrammaticScroll) return

    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 5

    if (isAtBottom) {
      // 用户滚回底部 — 恢复自动滚动
      autoScrollEnabled = true
      if (scrollBtn) scrollBtn.style.display = 'none'
    } else {
      // 用户离开了底部 — 禁用自动滚动
      autoScrollEnabled = false
      if (scrollBtn) scrollBtn.style.display = 'flex'

      // 非生成状态下 500ms 后恢复自动滚动
      // 生成状态下保持用户滚动位置，不自动回底
      if (scrollTimer) clearTimeout(scrollTimer)
      if (!state.isGenerating) {
        scrollTimer = setTimeout(() => {
          autoScrollEnabled = true
        }, 500)
      }
    }
  })

  // wheel 事件 — 用户向上滚动时立即禁用自动滚动（无论是否在生成中）
  container.addEventListener('wheel', (e) => {
    if (e.deltaY < 0) {
      // 向上滚动 — 立即禁用
      autoScrollEnabled = false
      if (scrollBtn) scrollBtn.style.display = 'flex'
    }
  })

  // 移动端触摸滑动 — 检测上滑并立即禁用自动滚动
  let lastTouchY = 0
  container.addEventListener('touchstart', (e) => {
    lastTouchY = e.touches[0].clientY
  }, { passive: true })
  container.addEventListener('touchmove', (e) => {
    const currentY = e.touches[0].clientY
    if (currentY > lastTouchY) {
      // 手指向上滑（内容向下移动）— 禁用自动滚动
      autoScrollEnabled = false
      if (scrollBtn) scrollBtn.style.display = 'flex'
    }
    lastTouchY = currentY
  }, { passive: true })

  // 键盘方向键 — 向上键/PageUp 禁用自动滚动
  container.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      autoScrollEnabled = false
      if (scrollBtn) scrollBtn.style.display = 'flex'
    }
  })

  // ========== 滚动条 ==========
  // 滚动条样式由 CSS 控制（覆盖式，始终可见但不占布局空间）
  // 无需 JS 切换 .scrolling 类

  if (scrollBtn) {
    scrollBtn.addEventListener('click', () => {
      autoScrollEnabled = true
      scrollToBottomSmooth()
      scrollBtn.style.display = 'none'
    })
  }

  console.log('[iDrome Chat] 滚动控制已初始化')
}

/**
 * 加载对话消息
 * @param {Array} messages - 消息列表
 */
export function loadMessages(messages) {
  state.messages = messages || []
  autoScrollEnabled = true
  renderMessages(state.messages)
}

export default {
  sendMessage,
  stopGenerating,
  continueGeneration,
  renderMessages,
  scrollToBottom,
  checkScrollPosition,
  initScrollControl,
  loadMessages
}
