/**
 * iDrome — 联网搜索前端模块
 *
 * 按设计方案第 19 章和分步执行步骤 7.3 实现：
 * - initSearch() — 初始化搜索按钮（🌐）事件监听
 * - toggleWebSearch() — 切换联网搜索开关
 * - showSearchStatus() — 显示搜索状态 UI（正在搜索 → 搜索完成/失败）
 * - hideSearchStatus() — 隐藏搜索状态
 * - formatSearchCitations() — 格式化搜索结果引用
 *
 * 状态管理：
 * - state.webSearchEnabled — 是否开启联网搜索
 * - 搜索状态 UI 临时显示在消息列表底部，搜索完成后自动隐藏
 */

'use strict'

import { state } from './state.js'
import { showToast } from './toast.js'

/**
 * 初始化联网搜索按钮
 * 绑定 🌐 按钮点击事件，切换 state.webSearchEnabled
 */
export function initSearch() {
  const btn = document.getElementById('webSearchBtn')
  if (!btn) {
    console.warn('[iDrome Search] initSearch: webSearchBtn 元素未找到')
    return
  }
  console.log('[iDrome Search] initSearch: 找到 webSearchBtn，准备绑定事件')

  // 防重复绑定
  if (btn.dataset.bound === 'true') {
    console.log('[iDrome Search] initSearch: 按钮已绑定，跳过')
    return
  }
  btn.dataset.bound = 'true'

  btn.addEventListener('click', () => {
    toggleWebSearch()
  })

  // 同步初始状态到 UI
  if (state.webSearchEnabled) {
    btn.setAttribute('aria-pressed', 'true')
    btn.classList.add('active')
  }
}

/**
 * 切换联网搜索开关
 */
export function toggleWebSearch() {
  console.log('[iDrome Search] toggleWebSearch 被调用，切换前:', state.webSearchEnabled)
  state.webSearchEnabled = !state.webSearchEnabled
  console.log('[iDrome Search] toggleWebSearch 切换后:', state.webSearchEnabled)

  const btn = document.getElementById('webSearchBtn')
  if (btn) {
    btn.setAttribute('aria-pressed', String(state.webSearchEnabled))
    btn.classList.toggle('active', state.webSearchEnabled)
  }

  if (state.webSearchEnabled) {
    showToast('联网搜索已开启', 'success', 1500)
  } else {
    showToast('联网搜索已关闭', 'info', 1500)
  }
}

/**
 * 显示搜索状态 UI
 * - searching 状态：在消息列表底部显示内联进度指示器
 * - success/failed 状态：使用 toast 组件显示通知
 *
 * @param {string} status — 'searching' | 'success' | 'failed'
 * @param {Object} data — { count?, results?, reason? }
 */
export function showSearchStatus(status, data = {}) {
  console.log('[iDrome Search] showSearchStatus 被调用:', status, data)

  if (status === 'searching') {
    // 搜索中 — 显示内联进度指示器
    const messageList = document.getElementById('messageList')
    if (!messageList) {
      console.warn('[iDrome Search] messageList 元素未找到')
      return
    }

    let statusEl = document.getElementById('searchStatus')
    if (!statusEl) {
      statusEl = document.createElement('div')
      statusEl.id = 'searchStatus'
      statusEl.className = 'search-status'
      messageList.appendChild(statusEl)
    }

    statusEl.className = 'search-status searching'
    statusEl.innerHTML = `
      <div class="search-spinner"></div>
      <span>正在搜索互联网...</span>
    `
    statusEl.style.display = 'flex'
  } else if (status === 'success') {
    // 搜索完成 — 隐藏内联进度，使用 toast 通知
    hideSearchStatus()
    const count = data.count || 0
    if (count > 0) {
      showToast(`搜索完成，找到 ${count} 条结果`, 'success', 3000)
    } else {
      showToast('搜索完成，但未找到相关结果', 'info', 3000)
    }
  } else if (status === 'failed') {
    // 搜索失败 — 隐藏内联进度，使用 toast 通知
    hideSearchStatus()
    showToast('搜索失败，已降级为普通对话', 'warning', 3000)
  } else if (status === 'skipped') {
    // 智能判断跳过搜索 — 仅隐藏进度，不干扰用户
    hideSearchStatus()
    showToast('智能判断：此问题无需联网搜索', 'info', 2000)
  }
}

/**
 * 隐藏搜索状态
 */
export function hideSearchStatus() {
  const statusEl = document.getElementById('searchStatus')
  if (statusEl) {
    statusEl.style.display = 'none'
  }
}

/**
 * 格式化搜索结果引用（供 AI 回答末尾展示）
 *
 * @param {Array} results — 搜索结果数组
 * @returns {string} 格式化后的引用 HTML
 */
export function formatSearchCitations(results) {
  if (!results || results.length === 0) return ''

  const items = results.map((r, i) => {
    const escapedTitle = r.title
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    return `<a href="${r.url}" target="_blank" rel="noopener noreferrer" class="search-citation-link">[${i + 1}] ${escapedTitle}</a>`
  }).join('')

  return `<div class="search-citations"><span class="search-citations-label">参考来源：</span>${items}</div>`
}
