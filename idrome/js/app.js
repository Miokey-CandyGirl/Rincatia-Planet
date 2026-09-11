/**
 * iDrome (DromAI) — 应用入口
 * Step 4: DeepSeek API 对接
 *
 * 模块化架构：
 * - store.js / state.js — Proxy 响应式 Store
 * - auth.js — Supabase 认证
 * - navpanel.js — 导航面板交互
 * - settings.js — 设置面板
 * - toast.js — 通用 Toast 提示
 * - input.js — 输入框交互
 * - chat.js — 对话渲染（真实 API + Mock 回退）
 * - keyboard.js — 键盘快捷键
 * - markdown.js — Markdown + KaTeX 渲染
 * - apiRouter.js — 统一 API 路由（DeepSeek 代理 + Mock 拦截 + 熔断）
 * - deepseek.js — DeepSeek API 封装（SSE 流式）
 * - errorHandler.js — 错误处理（分类 + 重试 + UI 渲染）
 * - usageTracker.js — Token 估算 + 上下文管理
 * - network.js — 网络状态检测
 * - mockLayer.js — Mock SSE 流式响应（开发环境）
 */

'use strict'

import { state, subscribe } from './state.js'
import { checkAuth, showLoginPage, hideLoginPage, setupCrossTabSync, logout } from './auth.js?v=lytalk1'
import { initNavPanel, updateNavPanelUI } from './navpanel.js'
import { initSettings, applyTheme, openSettings, closeSettings } from './settings.js?v=step10'
import { showToast } from './toast.js'
import { showModalAlert, showModalConfirm, showModalPrompt } from './modal.js?v=step10'
import { initInputArea } from './input.js'
import { sendMessage, renderMessages, initScrollControl, loadMessages, stopGenerating } from './chat.js?v=step10'
import { initKeyboardShortcuts } from './keyboard.js'
import { apiRouter } from './apiRouter.js?v=step10'
import { initNetworkMonitor } from './network.js'
import { initSearch } from './search.js?v=step10'
import { initMessageNav, renderMessageNav } from './messageNav.js?v=step10'
import {
  loadAllConversations,
  loadAllMessages,
  deleteConversation,
  renameConversation,
  togglePin,
  toggleArchive,
  searchMessageContent,
  batchDeleteConversations,
  batchArchiveConversations,
  loadConversationGroups,
  createConversationGroup,
  renameConversationGroup,
  deleteConversationGroup,
  moveConversationToGroup,
  loadSearchReferencesBatch
} from './conversations.js?v=step10'

/* ============================================================
 * 1. 模式定义
 * ============================================================ */

/** 模式 SVG 图标映射 */
const MODE_ICONS = {
  general: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  'tian-translation': '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h7M9 3v2c0 4.418-2.239 8-5 8M5 9c0 2.144 2.952 3.908 6.7 4M12 20l4-9 4 9M14.5 16h3"/></svg>',
  'novel-culture': '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>'
}

/** 模式名称映射 */
const MODE_NAMES = {
  general: '普通',
  'tian-translation': '田语',
  'novel-culture': '小说'
}

/** 批量管理状态（Step 5.7 新增） */
let batchMode = false
let selectedConversations = new Set()

/** 折叠组状态 — 记录哪些组标题被折叠 */
let collapsedGroups = new Set()

/**
 * 自定义分组 — Supabase 为数据源，localStorage 仅作离线缓存
 * 对话-分组映射存储在 conversations.custom_group_id 字段（Supabase）
 */
let customGroups = []
try {
  const stored = localStorage.getItem('idrome-custom-groups')
  if (stored) customGroups = JSON.parse(stored)
} catch { customGroups = [] }

/** 保存自定义分组到 localStorage（仅作离线缓存，数据源为 Supabase） */
function saveCustomGroups() {
  try {
    localStorage.setItem('idrome-custom-groups', JSON.stringify(customGroups))
  } catch { /* 忽略存储错误 */ }
}

/**
 * 空对话列表占位（Step 5 已替换为 Supabase 真实数据）
 */
const mockConversations = []
const mockMessages = []

/* ============================================================
 * 2. 工具函数
 * ============================================================ */

/**
 * 安全转义 HTML
 */
function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

/**
 * 格式化时间为相对时间分组标签
 */
function getTimeGroup(isoTime) {
  const now = new Date()
  const time = new Date(isoTime)
  const diffMs = now - time
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays <= 0 && now.getUTCDate() === time.getUTCDate()) return '今天'
  if (diffDays <= 1) return '昨天'
  if (diffDays <= 7) return '本周'
  if (diffDays <= 30) return '本月'
  return '更早'
}

/**
 * 格式化时间为简短显示
 */
function formatShortTime(isoTime) {
  const time = new Date(isoTime)
  const now = new Date()
  const diffMs = now - time
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays <= 0) {
    return time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
  if (diffDays <= 1) return '昨天'
  if (diffDays <= 7) return `${diffDays} 天前`
  return time.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
}

/* ============================================================
 * 3. 对话列表渲染
 * ============================================================ */

/**
 * 按时间分组渲染对话列表（含置顶/归档分组 + 批量模式）
 * @param {Array} conversations - 对话数组
 */
function renderConversationList(conversations) {
  const container = document.getElementById('conversationList')
  if (!container) return

  const pinned = conversations.filter(c => c.pinned && !c.archived && !c.custom_group_id)
  const normal = conversations
    .filter(c => !c.pinned && !c.archived && !c.custom_group_id)
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
  const archived = conversations.filter(c => c.archived)

  if (conversations.length === 0) {
    container.innerHTML = '<div class="conversation-list-empty">暂无对话</div>'
    return
  }

  let html = ''

  // 自定义分组
  customGroups.forEach(group => {
    const groupConvs = conversations.filter(c => c.custom_group_id === group.id && !c.archived)
    if (groupConvs.length === 0 && !group.keepEmpty) return
    const isCollapsed = collapsedGroups.has('custom-' + group.id)
    html += renderGroupHeader('custom-' + group.id, `📂 ${escapeHtml(group.name)}`, groupConvs.length, isCollapsed)
    if (!isCollapsed) {
      groupConvs.forEach(conv => { html += renderConversationItem(conv) })
    }
    html += `</div>`
  })

  // 置顶分组
  if (pinned.length > 0) {
    const isCollapsed = collapsedGroups.has('pinned')
    html += renderGroupHeader('pinned', '📌 置顶', pinned.length, isCollapsed)
    if (!isCollapsed) {
      pinned.forEach(conv => { html += renderConversationItem(conv) })
    }
    html += `</div>`
  }

  // 常规分组（按时间细分）
  const groups = {}
  const groupOrder = ['今天', '昨天', '本周', '本月', '更早']
  normal.forEach(conv => {
    const group = getTimeGroup(conv.updated_at)
    if (!groups[group]) groups[group] = []
    groups[group].push(conv)
  })

  groupOrder.forEach(groupName => {
    if (!groups[groupName]) return
    const isCollapsed = collapsedGroups.has('time-' + groupName)
    html += renderGroupHeader('time-' + groupName, groupName, groups[groupName].length, isCollapsed)
    if (!isCollapsed) {
      groups[groupName].forEach(conv => { html += renderConversationItem(conv) })
    }
    html += `</div>`
  })

  // 归档分组
  if (archived.length > 0) {
    const isCollapsed = collapsedGroups.has('archived')
    html += renderGroupHeader('archived', '📦 归档', archived.length, isCollapsed)
    if (!isCollapsed) {
      archived.forEach(conv => { html += renderConversationItem(conv) })
    }
    html += `</div>`
  }

  container.innerHTML = html

  // 绑定组标题点击事件（折叠/展开）
  container.querySelectorAll('.conversation-group-title').forEach(title => {
    title.addEventListener('click', (e) => {
      // 如果点击的是操作按钮，不触发展开/折叠
      if (e.target.closest('.group-action-btn')) return
      e.stopPropagation()
      const groupId = title.dataset.groupId
      if (!groupId) return
      if (collapsedGroups.has(groupId)) {
        collapsedGroups.delete(groupId)
      } else {
        collapsedGroups.add(groupId)
      }
      renderConversationList(state.conversations)
    })

    // 右键/长按 — 重命名自定义分组
    const groupId = title.dataset.groupId
    if (groupId && groupId.startsWith('custom-')) {
      title.addEventListener('contextmenu', (e) => {
        e.preventDefault()
        const customId = groupId.replace('custom-', '')
        renameCustomGroup(customId)
      })
    }

    // 分组操作按钮（重命名/删除）
    title.querySelectorAll('.group-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation()
        const action = btn.dataset.groupAction
        const customId = btn.dataset.customId
        if (action === 'rename') {
          renameCustomGroup(customId)
        } else if (action === 'delete') {
          deleteCustomGroup(customId)
        }
      })
    })
  })

  // 绑定点击事件
  container.querySelectorAll('.conversation-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.closest('.swipe-action-btn')) return
      if (e.target.closest('.batch-checkbox')) return
      if (e.target.closest('.conv-more-btn')) return

      // 批量模式下切换选中
      if (batchMode) {
        const convId = item.dataset.convId
        const checkbox = item.querySelector('.batch-checkbox')
        if (selectedConversations.has(convId)) {
          selectedConversations.delete(convId)
          item.classList.remove('batch-selected')
          if (checkbox) checkbox.textContent = '☐'
        } else {
          selectedConversations.add(convId)
          item.classList.add('batch-selected')
          if (checkbox) checkbox.textContent = '☑'
        }
        updateBatchActionBar()
        return
      }

      const convId = item.dataset.convId
      loadConversation(convId)
    })

    // "更多"按钮 — 切换操作菜单显示（桌面端）
    const moreBtn = item.querySelector('.conv-more-btn')
    if (moreBtn) {
      moreBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        // 关闭其他已展开的项
        container.querySelectorAll('.conversation-item.swiped').forEach(other => {
          if (other !== item) other.classList.remove('swiped')
        })
        item.classList.toggle('swiped')
      })
    }

    // 左滑操作按钮
    item.querySelectorAll('.swipe-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation()
        const action = btn.dataset.action
        const convId = item.dataset.convId
        item.classList.remove('swiped')
        handleConversationAction(action, convId, e)
      })
    })
  })

  // 点击空白处关闭所有展开的操作菜单
  container.addEventListener('click', (e) => {
    if (!e.target.closest('.conversation-item') || !e.target.closest('.conv-more-btn')) {
      container.querySelectorAll('.conversation-item.swiped').forEach(item => {
        item.classList.remove('swiped')
      })
    }
  })

  // 更新批量模式 UI
  if (batchMode) {
    container.classList.add('batch-mode')
    updateBatchActionBar()
  } else {
    container.classList.remove('batch-mode')
  }
}

/**
 * 处理对话操作（左滑菜单）
 * @param {string} action - 操作类型 rename/archive/delete/pin
 * @param {string} convId - 对话 ID
 */
async function handleConversationAction(action, convId, event) {
  const conv = state.conversations.find(c => c.id === convId)
  if (!conv) return

  switch (action) {
    case 'rename': {
      const newTitle = await showModalPrompt('输入新标题：', conv.title, {
        title: '重命名对话',
        confirmText: '保存',
        maxLength: 50
      })
      if (newTitle !== null && newTitle.trim()) {
        const success = await renameConversation(convId, newTitle.trim())
        if (success) {
          conv.title = newTitle.trim()
          renderConversationList(state.conversations)
          showToast('已重命名', 'success', 1500)
        } else {
          showToast('重命名失败', 'error')
        }
      }
      break
    }
    case 'archive': {
      const newArchived = !conv.archived
      const success = await toggleArchive(convId, newArchived)
      if (success) {
        conv.archived = newArchived
        renderConversationList(state.conversations)
        showToast(newArchived ? '已归档' : '已取消归档', 'success', 1500)
      }
      break
    }
    case 'delete': {
      const confirmed = await showModalConfirm('确定删除此对话？所有消息将一并删除。', {
        title: '删除对话',
        confirmText: '删除',
        danger: true
      })
      if (confirmed) {
        const success = await deleteConversation(convId)
        if (success) {
          state.conversations = state.conversations.filter(c => c.id !== convId)
          renderConversationList(state.conversations)
          // 如果删除的是当前对话，回到欢迎页
          if (state.currentConversationId === convId) {
            handleNewConversation()
          }
          showToast('已删除', 'success', 1500)
        } else {
          showToast('删除失败', 'error')
        }
      }
      break
    }
    case 'pin': {
      const newPinned = !conv.pinned
      const success = await togglePin(convId, newPinned)
      if (success) {
        conv.pinned = newPinned
        renderConversationList(state.conversations)
        showToast(newPinned ? '已置顶' : '已取消置顶', 'success', 1500)
      }
      break
    }
    case 'group': {
      showGroupSelector(convId, event)
      break
    }
  }
}

/**
 * 渲染分组标题（含折叠箭头和数量统计）
 * @param {string} groupId - 分组唯一标识
 * @param {string} label - 显示名称
 * @param {number} count - 对话数量
 * @param {boolean} collapsed - 是否折叠
 * @returns {string} HTML
 */
function renderGroupHeader(groupId, label, count, collapsed) {
  const arrow = collapsed ? '▶' : '▼'
  const isCustom = groupId.startsWith('custom-')
  const customId = isCustom ? groupId.replace('custom-', '') : ''
  const groupActions = isCustom ? `
    <button class="group-action-btn" data-group-action="rename" data-custom-id="${customId}" aria-label="重命名分组" title="重命名分组">
      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
    </button>
    <button class="group-action-btn" data-group-action="delete" data-custom-id="${customId}" aria-label="删除分组" title="删除分组">
      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
    </button>` : ''
  return `<div class="conversation-group" data-group-id="${groupId}">
    <div class="conversation-group-title" data-group-id="${groupId}" role="button" tabindex="0" aria-expanded="${!collapsed}">
      <span class="group-arrow">${arrow}</span>
      <span class="group-label">${label}</span>
      <span class="group-count">${count}</span>
      ${groupActions}
    </div>`
}

/**
 * 新建自定义分组（Supabase 为数据源）
 */
async function createCustomGroup() {
  const name = await showModalPrompt('输入分组名称：', '', {
    title: '新建分组',
    confirmText: '创建',
    placeholder: '例如：工作、学习、项目...',
    maxLength: 30
  })
  if (!name || !name.trim()) return
  const trimmedName = name.trim()

  // 写入 Supabase（数据源）
  const { data: dbGroup, error } = await createConversationGroup(trimmedName)
  if (error || !dbGroup) {
    showToast(error || '创建分组失败', 'error', 3000)
    return
  }
  customGroups.push({ id: dbGroup.id, name: dbGroup.name, color: dbGroup.color || '' })
  saveCustomGroups() // 更新离线缓存
  renderConversationList(state.conversations)
  showToast(`已创建分组"${trimmedName}"`, 'success', 1500)
}

/**
 * 重命名自定义分组（Supabase 为数据源）
 */
async function renameCustomGroup(groupId) {
  const group = customGroups.find(g => g.id === groupId)
  if (!group) return
  const newName = await showModalPrompt('输入新的分组名称：', group.name, {
    title: '重命名分组',
    confirmText: '保存',
    maxLength: 30
  })
  if (newName !== null && newName.trim() && newName.trim() !== group.name) {
    const trimmed = newName.trim()
    // 写入 Supabase（数据源）
    const { success, error } = await renameConversationGroup(groupId, trimmed)
    if (!success) {
      showToast(error || '重命名失败', 'error', 3000)
      return
    }
    group.name = trimmed
    saveCustomGroups() // 更新离线缓存
    renderConversationList(state.conversations)
    showToast('分组已重命名', 'success', 1500)
  }
}

/**
 * 删除自定义分组（Supabase 为数据源）
 */
async function deleteCustomGroup(groupId) {
  const confirmed = await showModalConfirm('确定删除此分组？分组内的对话将移至无分组。', {
    title: '删除分组',
    confirmText: '删除',
    danger: true
  })
  if (!confirmed) return
  // 写入 Supabase（数据源）
  const { success, error } = await deleteConversationGroup(groupId)
  if (!success) {
    showToast(error || '删除分组失败', 'error', 3000)
    return
  }
  customGroups = customGroups.filter(g => g.id !== groupId)
  // 清除内存中对话的分组关联（数据库已通过 ON DELETE SET NULL 自动处理）
  state.conversations.forEach(conv => {
    if (conv.custom_group_id === groupId) {
      conv.custom_group_id = null
    }
  })
  saveCustomGroups() // 更新离线缓存
  renderConversationList(state.conversations)
  showToast('分组已删除', 'success', 1500)
}

/**
 * 将对话移至自定义分组（Supabase 为数据源，映射存储在 conversations.custom_group_id）
 */
async function moveToCustomGroup(convId, groupId) {
  const conv = state.conversations.find(c => c.id === convId)
  if (!conv) return

  // 写入 Supabase（数据源 — conversations.custom_group_id）
  const { success, error } = await moveConversationToGroup(convId, groupId)
  if (!success) {
    showToast(error || '移动分组失败', 'error', 3000)
    return
  }
  conv.custom_group_id = groupId || null
  renderConversationList(state.conversations)
  const groupName = groupId ? customGroups.find(g => g.id === groupId)?.name : '无分组'
  showToast(`已移至"${groupName}"`, 'success', 1500)
}

/**
 * 显示"移至分组"选择菜单（点击组名选择）
 * @param {string} convId - 对话 ID
 * @param {MouseEvent} [event] - 触发事件（用于定位弹窗）
 */
async function showGroupSelector(convId, event) {
  const conv = state.conversations.find(c => c.id === convId)
  if (!conv) return

  // 如果没有自定义分组，提示创建
  if (customGroups.length === 0) {
    const confirmed = await showModalConfirm('尚无自定义分组，是否立即创建？', {
      title: '创建分组',
      confirmText: '创建'
    })
    if (confirmed) {
      createCustomGroup()
    }
    return
  }

  // 关闭已存在的选择菜单
  closeGroupSelector()

  const currentGroupId = conv.custom_group_id || ''

  // 构建弹窗菜单
  const menu = document.createElement('div')
  menu.className = 'group-selector-menu'
  menu.id = 'groupSelectorMenu'
  menu.innerHTML = `
    <div class="group-selector-header">移至分组</div>
    <div class="group-selector-list">
      <button class="group-selector-item ${!currentGroupId ? 'active' : ''}" data-group-id="">
        <span class="group-selector-name">无分组</span>
        ${!currentGroupId ? '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
      </button>
      ${customGroups.map(g => `
        <button class="group-selector-item ${currentGroupId === g.id ? 'active' : ''}" data-group-id="${g.id}">
          <span class="group-selector-name">${escapeHtml(g.name)}</span>
          ${currentGroupId === g.id ? '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
        </button>
      `).join('')}
    </div>
    <button class="group-selector-new" id="groupSelectorNew">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      新建分组
    </button>
  `

  document.body.appendChild(menu)

  // 定位弹窗（优先使用事件位置，否则居中）
  if (event && event.target) {
    const rect = event.target.getBoundingClientRect()
    const menuRect = menu.getBoundingClientRect()
    let left = rect.left
    let top = rect.bottom + 4
    // 防止超出视口右侧
    if (left + menuRect.width > window.innerWidth - 8) {
      left = window.innerWidth - menuRect.width - 8
    }
    // 防止超出视口底部
    if (top + menuRect.height > window.innerHeight - 8) {
      top = rect.top - menuRect.height - 4
    }
    menu.style.left = left + 'px'
    menu.style.top = top + 'px'
  } else {
    menu.style.left = '50%'
    menu.style.top = '50%'
    menu.style.transform = 'translate(-50%, -50%)'
  }

  // 绑定点击事件
  menu.querySelectorAll('.group-selector-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation()
      const targetGroupId = item.dataset.groupId || null
      closeGroupSelector()
      moveToCustomGroup(convId, targetGroupId || null)
    })
  })

  // 新建分组按钮
  const newBtn = menu.querySelector('#groupSelectorNew')
  if (newBtn) {
    newBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      closeGroupSelector()
      createCustomGroup().then(() => {
        // 创建完成后重新打开选择菜单
        if (event) showGroupSelector(convId, event)
      })
    })
  }

  // 点击菜单外部关闭
  setTimeout(() => {
    document.addEventListener('click', closeGroupSelectorOnOutside)
  }, 0)
}

/**
 * 关闭分组选择菜单
 */
function closeGroupSelector() {
  const existing = document.getElementById('groupSelectorMenu')
  if (existing) existing.remove()
  document.removeEventListener('click', closeGroupSelectorOnOutside)
}

/**
 * 点击外部关闭分组选择菜单
 */
function closeGroupSelectorOnOutside(e) {
  const menu = document.getElementById('groupSelectorMenu')
  if (menu && !menu.contains(e.target)) {
    closeGroupSelector()
  }
}

/**
 * Step 9 PWA — 缓存对话快照到 Service Worker（供离线浏览）
 * 仅缓存元数据（id/title/mode/updated_at），不含消息内容，保护隐私
 * @param {Array} conversations - 对话列表
 */
function cacheConversationsSnapshot(conversations) {
  if (!navigator.serviceWorker || !conversations || conversations.length === 0) return
  try {
    const snapshot = conversations.map(c => ({
      id: c.id,
      title: c.title,
      mode: c.mode,
      pinned: c.pinned,
      archived: c.archived,
      updated_at: c.updated_at,
      custom_group_id: c.custom_group_id
    }))
    navigator.serviceWorker.ready.then(registration => {
      registration.active?.postMessage({
        type: 'CACHE_CONVERSATIONS',
        payload: { conversations: snapshot, cachedAt: Date.now() }
      })
    }).catch(() => { /* SW 未就绪，静默失败 */ })
  } catch (e) {
    console.warn('[iDrome PWA] 缓存对话快照失败:', e)
  }
}

/**
 * 渲染单个对话列表项（含批量模式 checkbox）
 */
function renderConversationItem(conv) {
  const icon = MODE_ICONS[conv.mode] || MODE_ICONS['general']
  const timeStr = formatShortTime(conv.updated_at)
  const pinnedClass = conv.pinned ? ' pinned' : ''
  const archivedClass = conv.archived ? ' archived' : ''
  const activeClass = conv.id === state.currentConversationId ? ' active' : ''
  const batchSelectedClass = selectedConversations.has(conv.id) ? ' batch-selected' : ''

  const pinIcon = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg>'
  const renameIcon = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>'
  const archiveIcon = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>'
  const deleteIcon = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>'
  const groupIcon = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>'

  // 批量模式下显示 checkbox
  const batchCheckbox = batchMode ? `<span class="batch-checkbox" aria-hidden="true">${batchSelectedClass ? '☑' : '☐'}</span>` : ''

  return `
    <div class="conversation-item${pinnedClass}${archivedClass}${activeClass}${batchSelectedClass}" data-conv-id="${conv.id}" role="button" tabindex="0">
      ${batchCheckbox}
      <span class="conversation-mode-icon" aria-hidden="true">${icon}</span>
      <div class="conversation-title-text">${escapeHtml(conv.title)}</div>
      ${conv.pinned ? `<span class="conversation-pin" aria-label="已置顶">${pinIcon}</span>` : ''}
      <button class="conv-more-btn" data-action="more" aria-label="更多操作" title="更多操作">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
      </button>
      <div class="conversation-swipe-actions">
        <button class="swipe-action-btn pin" data-action="pin" aria-label="置顶" title="${conv.pinned ? '取消置顶' : '置顶'}">${pinIcon}</button>
        <button class="swipe-action-btn rename" data-action="rename" aria-label="重命名" title="重命名">${renameIcon}</button>
        <button class="swipe-action-btn group" data-action="group" aria-label="移至分组" title="移至分组">${groupIcon}</button>
        <button class="swipe-action-btn archive" data-action="archive" aria-label="归档" title="${conv.archived ? '取消归档' : '归档'}">${archiveIcon}</button>
        <button class="swipe-action-btn delete" data-action="delete" aria-label="删除" title="删除">${deleteIcon}</button>
      </div>
    </div>
  `
}

/* ============================================================
 * 4. 加载对话
 * ============================================================ */

/**
 * 加载指定对话 — 从 Supabase 加载消息
 * @param {string} convId - 对话 ID
 */
async function loadConversation(convId) {
  const conv = state.conversations.find(c => c.id === convId)
  if (!conv) return

  // 清除暂停状态和发送按钮样式
  state.isPaused = false
  const sendBtn = document.getElementById('sendBtn')
  if (sendBtn) {
    sendBtn.classList.remove('generating', 'paused')
  }

  state.currentConversationId = convId
  state.currentMode = conv.mode
  state.modeLocked = true // 加载已有对话时锁定模式

  // 更新当前模型（模型选择器 UI 由设置面板管理，无需手动更新）
  if (conv.model) {
    state.currentModel = conv.model
    // 同步到 localStorage 以保持一致性
    try { localStorage.setItem('idrome-current-model', conv.model) } catch (_) {}
    // 更新设置面板中的模型选中态
    document.querySelectorAll('.model-option-settings').forEach(opt => {
      opt.classList.toggle('selected', opt.dataset.model === conv.model)
    })
  }

  // 更新对话标题
  const titleEl = document.getElementById('conversationTitle')
  if (titleEl) titleEl.textContent = conv.title

  // 隐藏欢迎页，显示对话区
  const welcomePage = document.getElementById('welcomePage')
  const chatArea = document.getElementById('chatArea')
  if (welcomePage) welcomePage.style.display = 'none'
  if (chatArea) chatArea.style.display = 'flex'

  // 从 Supabase 加载消息
  const messages = await loadAllMessages(convId)

  // 适配消息格式（数据库消息 → 前端消息对象）
  // 注意：reasoning_time 字段在数据库中存储思考用时，映射到前端的 thinking_time
  const adaptedMessages = messages.map(m => ({
    id: `msg-${m.id}`,
    db_id: m.id,
    conversation_id: m.conversation_id,
    role: m.role,
    content: m.content || '',
    reasoning: m.reasoning || '',
    expired: m.expired || false,
    version: m.version || 1,
    created_at: m.created_at,
    updated_at: m.updated_at || m.created_at,
    thinking_time: m.reasoning_time || null
  }))

  // 批量加载搜索引用 — 恢复 AI 回复中的引用链接和参考来源
  const aiMessageIds = adaptedMessages
    .filter(m => m.role === 'assistant')
    .map(m => m.db_id)

  if (aiMessageIds.length > 0) {
    try {
      const referencesMap = await loadSearchReferencesBatch(aiMessageIds)
      adaptedMessages.forEach(msg => {
        if (referencesMap[msg.db_id] && referencesMap[msg.db_id].length > 0) {
          msg.searchResults = referencesMap[msg.db_id]
        }
      })
    } catch (e) {
      console.warn('[iDrome App] 加载搜索引用失败:', e.message)
    }
  }

  // 客户端兜底排序：created_at → updated_at → db_id（三级排序确保稳定）
  console.log('[iDrome App] 排序前:', adaptedMessages.map(m => ({
    id: m.db_id, role: m.role, created_at: m.created_at, updated_at: m.updated_at
  })))
  adaptedMessages.sort((a, b) => {
    const createdCmp = new Date(a.created_at) - new Date(b.created_at)
    if (createdCmp !== 0) return createdCmp
    const updatedCmp = new Date(a.updated_at) - new Date(b.updated_at)
    if (updatedCmp !== 0) return updatedCmp
    return (a.db_id || 0) - (b.db_id || 0)
  })
  console.log('[iDrome App] 排序后:', adaptedMessages.map(m => ({
    id: m.db_id, role: m.role, created_at: m.created_at, updated_at: m.updated_at
  })))

  state.messages = adaptedMessages
  loadMessages(adaptedMessages)

  // 高亮当前对话项
  document.querySelectorAll('.conversation-item').forEach(item => {
    item.classList.toggle('active', item.dataset.convId === convId)
  })

  // 移动端关闭导航面板
  if (window.innerWidth < 768) {
    state.navPanelOpen = false
  }
}

/* ============================================================
 * 5. 欢迎页交互
 * ============================================================ */

/** 各模式的预设问题集合 */
const SUGGESTION_QUESTIONS = {
  'general': [
    { icon: 'pen',      text: '为我演示微积分题解答过程' },
    { icon: 'code',     text: '用 Python 实现一个快速排序算法' },
    { icon: 'bulb',     text: '用表总结如何使用Excel函数' },
    { icon: 'mail',     text: '帮我写首关于星空的现代诗版情书' }
  ],
  'tian-translation': [
    { icon: 'translate', text: '帮我翻译一段中文到琳凯蒂亚语' },
    { icon: 'book',      text: '琳凯蒂亚语的语法特点是什么？' },
    { icon: 'search',    text: '"光"在琳凯蒂亚语中的词源是什么？' },
    { icon: 'star',      text: '现代琳凯蒂亚语为什么又叫做田语？' }
  ],
  'novel-culture': [
    { icon: 'globe',      text: '《光线传奇》的主要世界观是什么？' },
    { icon: 'calendar',   text: '琳凯蒂亚文化中田历有哪些重要的节日？' },
    { icon: 'user',       text: '分析《光线传奇》中主角的成长轨迹' },
    { icon: 'layers',     text: '琳凯蒂亚文明的核心价值观是什么？' }
  ]
}

/** 预设问题图标 SVG 路径 */
const SUGGESTION_ICONS = {
  pen:      '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>',
  code:     '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  bulb:     '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>',
  mail:     '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  translate:'<path d="M4 5h7M9 3v2c0 4.418-2.239 8-5 8M5 9c0 2.144 2.952 3.908 6.7 4M12 20l4-9 4 9M14.5 16h3"/>',
  book:     '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  search:   '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  globe:    '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  star:     '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
  user:     '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  layers:   '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>'
}

/**
 * 渲染预设问题卡片
 * @param {string} mode - 当前模式
 */
function renderSuggestionCards(mode) {
  const container = document.getElementById('suggestionCards')
  if (!container) return

  const questions = SUGGESTION_QUESTIONS[mode] || SUGGESTION_QUESTIONS['general']

  container.innerHTML = questions.map(q => {
    const iconPath = SUGGESTION_ICONS[q.icon] || SUGGESTION_ICONS.bulb
    return `<button class="suggestion-card" data-question="${q.text}">
      <svg class="suggestion-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        ${iconPath}
      </svg>
      <span class="suggestion-card__text">${q.text}</span>
    </button>`
  }).join('')

  // 绑定点击事件
  container.querySelectorAll('.suggestion-card').forEach(card => {
    card.addEventListener('click', () => {
      const question = card.dataset.question
      if (question) {
        sendMessage(question)
      }
    })
  })
}

/**
 * 初始化欢迎页交互
 * - 模式选择卡片点击切换（单选互斥）
 * - 建议问题卡片点击 → 填充输入框并发送
 */
function initWelcomePage() {
  // 渲染当前模式的预设问题
  renderSuggestionCards(state.currentMode)

  // 模式选择卡片
  document.querySelectorAll('.mode-card').forEach(card => {
    card.addEventListener('click', () => {
      // 模式锁定后不可切换
      if (state.modeLocked) {
        showToast('对话已开始，模式不可切换', 'warning', 1500)
        return
      }
      selectMode(card.dataset.mode)
    })
  })
}

/**
 * 选择对话模式
 * 切换模式时带过渡动画地更新预设问题列表
 */
function selectMode(mode) {
  if (state.currentMode === mode) return

  state.currentMode = mode

  // 更新模式卡片选中状态
  document.querySelectorAll('.mode-card').forEach(card => {
    const isSelected = card.dataset.mode === mode
    card.classList.toggle('selected', isSelected)
    card.setAttribute('aria-checked', isSelected ? 'true' : 'false')
  })

  // 带动画地更新预设问题
  const container = document.getElementById('suggestionCards')
  if (!container) return

  // 淡出 → 替换内容 → 淡入
  container.classList.add('transitioning')
  setTimeout(() => {
    renderSuggestionCards(mode)
    container.classList.remove('transitioning')
  }, 200)
}

/* ============================================================
 * 6. 顶部导航按钮
 * ============================================================ */

/**
 * 初始化顶部导航按钮
 */
function initTopNavButtons() {
  const readAloudBtn = document.getElementById('readAloudBtn')
  if (readAloudBtn) {
    readAloudBtn.addEventListener('click', () => {
    })
  }

  // 分享按钮（步骤 10 实现）
  const shareBtn = document.getElementById('shareBtn')
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      showToast('分享功能将在步骤 10 实现', 'info')
    })
  }

  // 模型选择器已迁移至系统设置面板（settings.js initModelSelector）

  // 新对话按钮
  const newConvBtn = document.getElementById('newConversationBtn')
  if (newConvBtn) {
    newConvBtn.addEventListener('click', handleNewConversation)
  }

  // 批量管理按钮（Step 5.7 新增）
  const batchBtn = document.getElementById('batchManageBtn')
  if (batchBtn) {
    batchBtn.addEventListener('click', () => {
      toggleBatchMode()
    })
  }

  // 新建分组按钮
  const createGroupBtn = document.getElementById('createGroupBtn')
  if (createGroupBtn) {
    createGroupBtn.addEventListener('click', () => {
      createCustomGroup()
    })
  }
}

/* ============================================================
 * 模型参数管理（Step 5.8）
 * ============================================================ */

/** localStorage 键名 */
const MODEL_PARAMS_KEY = 'idrome_model_params'

/**
 * 从 localStorage 加载模型参数
 */
function loadModelParams() {
  try {
    const stored = localStorage.getItem(MODEL_PARAMS_KEY)
    if (stored) {
      const params = JSON.parse(stored)
      state.modelParams = {
        temperature: params.temperature ?? 0.7,
        maxTokens: params.maxTokens ?? 4096
      }
      console.log('[iDrome] 模型参数已加载:', state.modelParams)
    }
  } catch (e) {
    console.warn('[iDrome] 加载模型参数失败:', e)
  }
}

/**
 * 保存模型参数到 localStorage
 * @param {Object} params - { temperature, maxTokens }
 */
export function saveModelParams(params) {
  state.modelParams = { ...state.modelParams, ...params }
  try {
    localStorage.setItem(MODEL_PARAMS_KEY, JSON.stringify(state.modelParams))
    showToast('参数已保存', 'success', 1500)
  } catch (e) {
    console.warn('[iDrome] 保存模型参数失败:', e)
    showToast('保存失败', 'error')
  }
}

/* ============================================================
 * 批量管理（Step 5.7）
 * ============================================================ */

/**
 * 切换批量管理模式
 */
function toggleBatchMode() {
  batchMode = !batchMode
  selectedConversations.clear()

  if (batchMode) {
    showToast('已进入批量管理模式', 'info', 1500)
  } else {
    showToast('已退出批量管理模式', 'info', 1000)
  }

  renderConversationList(state.conversations)
  updateBatchActionBar()
}

/**
 * 更新批量操作栏
 */
function updateBatchActionBar() {
  let actionBar = document.getElementById('batchActionBar')

  if (!batchMode) {
    if (actionBar) actionBar.style.display = 'none'
    return
  }

  if (!actionBar) {
    actionBar = document.createElement('div')
    actionBar.id = 'batchActionBar'
    actionBar.className = 'batch-action-bar'
    actionBar.innerHTML = `
      <button class="batch-btn batch-select-all" id="batchSelectAllBtn">全选</button>
      <button class="batch-btn batch-delete" id="batchDeleteBtn">删除 (<span id="batchCount">0</span>)</button>
      <button class="batch-btn batch-archive" id="batchArchiveBtn">归档</button>
      <button class="batch-btn batch-cancel" id="batchCancelBtn">取消</button>
    `
    const navPanel = document.getElementById('navPanel')
    if (navPanel) {
      navPanel.appendChild(actionBar)
    }

    // 绑定按钮
    actionBar.querySelector('#batchSelectAllBtn').addEventListener('click', () => {
      const allIds = state.conversations.map(c => c.id)
      if (selectedConversations.size === allIds.length) {
        selectedConversations.clear()
      } else {
        selectedConversations = new Set(allIds)
      }
      renderConversationList(state.conversations)
      updateBatchActionBar()
    })

    actionBar.querySelector('#batchDeleteBtn').addEventListener('click', () => {
      handleBatchDelete()
    })

    actionBar.querySelector('#batchArchiveBtn').addEventListener('click', () => {
      handleBatchArchive()
    })

    actionBar.querySelector('#batchCancelBtn').addEventListener('click', () => {
      toggleBatchMode()
    })
  }

  actionBar.style.display = 'flex'
  const countEl = actionBar.querySelector('#batchCount')
  if (countEl) countEl.textContent = selectedConversations.size

  // 更新全选按钮文本
  const selectAllBtn = actionBar.querySelector('#batchSelectAllBtn')
  if (selectAllBtn) {
    const allIds = state.conversations.map(c => c.id)
    selectAllBtn.textContent = selectedConversations.size === allIds.length && allIds.length > 0 ? '取消全选' : '全选'
  }
}

/**
 * 批量删除
 */
async function handleBatchDelete() {
  if (selectedConversations.size === 0) {
    showToast('请先选择对话', 'warning', 1500)
    return
  }

  const count = selectedConversations.size
  const confirmed = await showModalConfirm(`确定删除选中的 ${count} 个对话？所有消息将一并删除。`, {
    title: '批量删除',
    confirmText: '删除',
    danger: true
  })
  if (!confirmed) return

  const ids = Array.from(selectedConversations)
  const success = await batchDeleteConversations(ids)

  if (success) {
    state.conversations = state.conversations.filter(c => !selectedConversations.has(c.id))
    // 如果当前对话被删除，回到欢迎页
    if (state.currentConversationId && selectedConversations.has(state.currentConversationId)) {
      handleNewConversation()
    }
    selectedConversations.clear()
    renderConversationList(state.conversations)
    showToast(`已删除 ${count} 个对话`, 'success', 1500)
  } else {
    showToast('批量删除失败', 'error')
  }
}

/**
 * 批量归档
 */
async function handleBatchArchive() {
  if (selectedConversations.size === 0) {
    showToast('请先选择对话', 'warning', 1500)
    return
  }

  const ids = Array.from(selectedConversations)
  const success = await batchArchiveConversations(ids, true)

  if (success) {
    state.conversations.forEach(c => {
      if (selectedConversations.has(c.id)) {
        c.archived = true
      }
    })
    selectedConversations.clear()
    renderConversationList(state.conversations)
    showToast('已批量归档', 'success', 1500)
  } else {
    showToast('批量归档失败', 'error')
  }
}

/**
 * 处理新建对话
 */
function handleNewConversation() {
  // 如果 AI 正在生成，静默停止（避免旧对话的 AI 回复继续写入）
  if (state.isGenerating) {
    stopGenerating(true)
    state.isGenerating = false
  }

  // 清除暂停状态
  state.isPaused = false
  const sendBtn = document.getElementById('sendBtn')
  if (sendBtn) {
    sendBtn.classList.remove('generating', 'paused')
  }

  state.currentConversationId = null
  state.messages = []
  state.modeLocked = false

  // 清除消息列表 DOM（防止旧对话消息残留）
  const messageList = document.getElementById('messageList')
  if (messageList) messageList.innerHTML = ''

  const welcomePage = document.getElementById('welcomePage')
  const chatArea = document.getElementById('chatArea')
  const titleEl = document.getElementById('conversationTitle')
  if (welcomePage) welcomePage.style.display = 'flex'
  if (chatArea) chatArea.style.display = 'none'
  if (titleEl) titleEl.textContent = 'iDrome — Ketiá Luminé'

  // 清除对话列表选中态
  document.querySelectorAll('.conversation-item').forEach(item => {
    item.classList.remove('active')
  })

  // 模型选择器 UI 由设置面板管理，此处无需手动更新

  // 重置模式选择（回到默认普通模式）
  selectMode('general')

  // 新建对话后自动收回导航面板
  state.navPanelOpen = false
}

/* ============================================================
 * 7. 网络状态检测
 * ============================================================ */
// Step 4：已迁移到 js/network.js 模块
// initNetworkMonitor() 在 init() 中调用，提供更完善的网络监控功能

/* ============================================================
 * 8. 搜索框
 * ============================================================ */

/**
 * 初始化搜索框（支持标题搜索 + 消息内容搜索）
 * 注意：此函数更名为 initConversationSearch，避免与 search.js 导入的 initSearch 标识符冲突
 */
function initConversationSearch() {
  const input = document.getElementById('searchInput')
  const modeToggle = document.getElementById('searchModeToggle')
  if (!input) return

  let searchMode = 'title'
  let contentSearchTimer = null

  // 搜索模式切换
  if (modeToggle) {
    const titleSearchSvg = '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'
    const contentSearchSvg = '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>'

    modeToggle.addEventListener('click', (e) => {
      e.stopPropagation()
      searchMode = searchMode === 'title' ? 'content' : 'title'
      const iconEl = document.getElementById('searchModeIcon')
      if (iconEl) {
        iconEl.innerHTML = searchMode === 'title' ? titleSearchSvg : contentSearchSvg
      }
      modeToggle.title = searchMode === 'title' ? '搜对话标题' : '搜对话内容'
      showToast(`搜索模式：${searchMode === 'title' ? '标题' : '内容'}`, 'info', 1000)

      // 清空搜索并重新渲染
      input.value = ''
      renderConversationList(state.conversations)
    })
  }

  // 防止点击搜索框时导航面板关闭
  input.addEventListener('click', (e) => {
    e.stopPropagation()
  })

  // 搜索输入
  input.addEventListener('input', () => {
    const query = input.value.trim()
    if (!query) {
      renderConversationList(state.conversations)
      return
    }

    if (searchMode === 'title') {
      // 标题搜索（本地过滤）
      const lowerQuery = query.toLowerCase()
      const filtered = state.conversations.filter(c => {
        return c.title.toLowerCase().includes(lowerQuery)
      })
      renderConversationList(filtered)
    } else {
      // 消息内容搜索（Supabase ilike 查询，防抖 300ms）
      if (contentSearchTimer) clearTimeout(contentSearchTimer)
      contentSearchTimer = setTimeout(async () => {
        const results = await searchMessageContent(query)
        renderMessageSearchResults(results, query)
      }, 300)
    }
  })
}

/**
 * 渲染消息内容搜索结果
 * @param {Array} results - 搜索结果
 * @param {string} query - 关键词
 */
function renderMessageSearchResults(results, query) {
  const container = document.getElementById('conversationList')
  if (!container) return

  if (results.length === 0) {
    container.innerHTML = `<div class="conversation-list-empty">未找到包含 "${escapeHtml(query)}" 的消息</div>`
    return
  }

  let html = `<div class="conversation-group">
    <div class="conversation-group-title">搜索结果（${results.length}）</div>`

  results.forEach(result => {
    const icon = MODE_ICONS[result.mode] || MODE_ICONS['general']
    // 高亮关键词
    const highlightedSnippet = escapeHtml(result.snippet).replace(
      new RegExp(escapeHtml(query), 'gi'),
      (match) => `<mark>${match}</mark>`
    )
    html += `
      <div class="conversation-item search-result-item" data-conv-id="${result.conversationId}" role="button" tabindex="0">
        <span class="conversation-mode-icon" aria-hidden="true">${icon}</span>
        <div class="search-result-body">
          <div class="search-result-title">${escapeHtml(result.conversationTitle)}</div>
          <div class="search-result-snippet">${highlightedSnippet}</div>
        </div>
      </div>
    `
  })

  html += `</div>`
  container.innerHTML = html

  // 点击搜索结果跳转到对话
  container.querySelectorAll('.search-result-item').forEach(item => {
    item.addEventListener('click', () => {
      const convId = item.dataset.convId
      loadConversation(convId)
    })
  })
}

/* ============================================================
 * 9. 用户信息展示
 * ============================================================ */

/**
 * 更新用户信息 UI
 */
function updateUserUI(user) {
  if (!user) return

  const userNameEl = document.getElementById('userName')
  if (userNameEl) {
    userNameEl.textContent = user.nickname || user.email || '逐梦用户'
  }

  const userAccountEl = document.getElementById('userAccount')
  if (userAccountEl) {
    // 显示登录账号（手机号或邮箱）
    const account = user.phone || user.email || ''
    if (account) {
      userAccountEl.textContent = account
    } else {
      userAccountEl.textContent = ''
    }
  }

  const userAvatarEl = document.getElementById('userAvatar')
  if (userAvatarEl) {
    if (user.avatar_url) {
      userAvatarEl.innerHTML = `<img src="${escapeHtml(user.avatar_url)}" alt="用户头像" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`
    } else {
      userAvatarEl.innerHTML = `<img src="assets/images/idrome_logo.jpg" alt="用户头像" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`
    }
  }
}

/* ============================================================
 * 10. 用户操作处理
 * ============================================================ */

/**
 * 处理用户下拉菜单操作
 */
function handleUserAction(action) {
  switch (action) {
    case 'website':
      showToast('将在步骤 10 实现进入官网功能', 'info')
      break
    case 'account':
      showToast('账户设置将在步骤 10 实现', 'info')
      break
    case 'settings':
      openSettings()
      break
    case 'logout':
      logout()
      break
  }
}

/* ============================================================
 * 11. 应用初始化
 * ============================================================ */

/**
 * 初始化滚动条自动隐藏
 * 监听可滚动容器的 scroll 事件，滚动时添加 .scrolling 类显示滚动条
 * 滚动停止 800ms 后移除 .scrolling 类隐藏滚动条
 * 鼠标悬停时也显示滚动条（由 CSS :hover 控制）
 */
function initScrollbarAutoHide() {
  const scrollableSelectors = [
    '#messageList',
    '#navPanel .nav-panel-content',
    '#navPanel .nav-panel-middle',
    '.settings-body',
    '.search-results-panel',
    '.dropdown-menu',
    '.user-dropdown-menu',
    '.conversation-list-wrapper',
    '.scrollable',
    '#messageInput'
  ]

  const scrollTimers = new WeakMap()

  function attachScrollListener(el) {
    if (!el || el.dataset.scrollbarBound === 'true') return
    el.dataset.scrollbarBound = 'true'

    el.addEventListener('scroll', () => {
      el.classList.add('scrolling')
      clearTimeout(scrollTimers.get(el))
      scrollTimers.set(el, setTimeout(() => {
        el.classList.remove('scrolling')
      }, 800))
    }, { passive: true })
  }

  // 初始绑定
  scrollableSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(attachScrollListener)
  })

  // 动态添加的元素（如设置面板、下拉菜单）— 使用 MutationObserver
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType !== 1) return
        // 检查新增节点本身
        scrollableSelectors.forEach(sel => {
          if (node.matches && node.matches(sel)) {
            attachScrollListener(node)
          }
          // 检查新增节点的子元素
          if (node.querySelectorAll) {
            node.querySelectorAll(sel).forEach(attachScrollListener)
          }
        })
      })
    })
  })

  observer.observe(document.body, { childList: true, subtree: true })
}

/**
 * 初始化应用
 */
async function init() {
  console.log('[iDrome] 启动 Step 5 — 数据持久化')

  // 1. 检查登录状态
  const user = await checkAuth()
  if (!user) {
    showLoginPage()
    return
  }
  state.currentUser = user

  // 1.1 确保登录页（若存在）被隐藏，主界面元素恢复显示
  hideLoginPage()

  // 1.15 尽早初始化联网搜索按钮（避免后续初始化失败导致按钮未绑定）
  try {
    initSearch()
  } catch (e) {
    console.error('[iDrome] initSearch 失败:', e)
  }

  // 1.2 旧版临时用户迁移：清除 temp 用户数据，引导重新登录
  if (user.auth_type === 'temp') {
    console.log('[iDrome] 检测到旧版临时用户，清除并引导重新登录')
    try { localStorage.removeItem('rincatia_user') } catch (_) {}
    showLoginPage()
    return
  }

  // 2. 初始化 API 路由器（Step 4 新增）
  //    开发环境自动启用 Mock 拦截，生产环境通过 Edge Function 代理
  await apiRouter.initialize()

  // 2.1 加载模型参数（Step 5.8 新增 — 从 localStorage 读取）
  loadModelParams()

  // 3. 初始化 UI

  // 3.1 设置（主题、字体、设置面板）
  initSettings()

  // 3.2 导航面板（Logo 点击、Esc、用户下拉菜单）
  initNavPanel()

  // 3.3 欢迎页交互（模式选择 + 建议问题卡片）
  initWelcomePage()

  // 3.4 输入框（绑定发送回调为 chat.js 的 sendMessage）
  initInputArea((content) => {
    sendMessage(content)
  })

  // 3.5 顶部导航按钮
  initTopNavButtons()

  // 3.55 消息导航面板（右侧滑出，用户消息快速定位）
  initMessageNav()

  // 3.6 滚动控制（智能滚动 + 回到底部按钮）
  initScrollControl()

  // 3.61 滚动条自动隐藏（滚动时显示，停止后隐藏）
  initScrollbarAutoHide()

  // 3.7 网络状态检测（Step 4 — 使用独立的 network.js 模块）
  initNetworkMonitor({
    onOnline: () => showToast('网络已恢复', 'success', 1500),
    onOffline: () => showToast('网络已断开', 'warning', 2000)
  })

  // 3.8 搜索框（对话列表搜索，非联网搜索）
  initConversationSearch()

  // 3.9 键盘快捷键（9 项）
  initKeyboardShortcuts({
    onNewConversation: handleNewConversation
  })

  // 3.10 加载对话数据（Step 5 — 从 Supabase 加载真实数据）
  // 先加载分组，再加载对话（分组和对话-分组映射均以 Supabase 为数据源）
  loadConversationGroups().then(dbGroups => {
    // Supabase 为数据源 — 始终用云端数据替换本地缓存
    customGroups = (dbGroups || []).map(g => ({ id: g.id, name: g.name, color: g.color || '' }))
    saveCustomGroups() // 更新离线缓存

    // 加载对话（对话的 custom_group_id 字段由 Supabase 提供，无需本地映射）
    return loadAllConversations()
  }).then(conversations => {
    state.conversations = conversations
    renderConversationList(state.conversations)
    console.log(`[iDrome] 已加载 ${conversations.length} 个对话，${customGroups.length} 个分组`)
    // Step 9 PWA — 缓存对话快照供离线浏览（仅元数据，不含消息内容）
    cacheConversationsSnapshot(conversations)
  }).catch(e => {
    console.warn('[iDrome] 加载对话列表失败:', e.message)
    state.conversations = []
    renderConversationList(state.conversations)
  })

  // 3.11 渲染对话列表（初始空，异步加载后更新）
  renderConversationList(state.conversations)

  // 3.12 更新用户信息 UI
  updateUserUI(state.currentUser)

  // 3.13 监听用户操作事件（来自 navpanel.js 下拉菜单）
  document.addEventListener('idrome:user-action', (e) => {
    handleUserAction(e.detail.action)
  })

  // 3.14 监听 Token 警告事件（Step 4 新增）
  document.addEventListener('idrome:token-warning', (e) => {
    const { percentage, level } = e.detail
    if (level === 'critical') {
      showToast(`上下文已严重超限 (${percentage}%)，建议开启新对话`, 'warning', 3000)
    } else {
      showToast(`上下文接近上限 (${percentage}%)，建议清理历史`, 'info', 3000)
    }
  })

  // 3.15 监听对话更新事件（AI 标题生成后触发列表刷新）
  document.addEventListener('idrome:conversation-updated', (e) => {
    const { conversationId } = e.detail
    const conv = state.conversations.find(c => c.id === conversationId)
    if (conv) {
      // 移到列表最前
      state.conversations = state.conversations.filter(c => c.id !== conversationId)
      state.conversations = [conv, ...state.conversations]
      renderConversationList(state.conversations)
    }
  })

  // 4. 订阅状态变化 → 更新 UI
  subscribe((target, key, newValue) => {
    if (key === 'navPanelOpen') {
      updateNavPanelUI(newValue)
    }

    if (key === 'theme') {
      console.log('[iDrome] 主题切换为:', newValue)
    }

    if (key === 'isGenerating') {
      const sendBtn = document.getElementById('sendBtn')
      if (sendBtn) {
        sendBtn.disabled = newValue || !state.inputContent
      }
    }

    if (key === 'conversations') {
      renderConversationList(newValue)
    }
  })

  // 5. 跨标签页登录状态同步
  setupCrossTabSync(
    (user) => {
      updateUserUI(user)
      showToast('检测到登录状态更新', 'success')
    },
    () => {
      showLoginPage()
    }
  )

  // 6. 桌面端自动展开导航面板
  if (window.innerWidth >= 1200) {
    state.navPanelOpen = true
  }

  console.log('[iDrome] Step 5 初始化完成')
}

// URL 参数自动登录（开发测试便捷入口）
//   ?temp=true  →  免登录临时入口（无时间限制）
// 注意：使用与 auth.js 相同的 key 'rincatia_user'
//       Supabase SDK 使用默认 storageKey，不会冲突清除
(function autoLoginFromUrlParams() {
  const USER_KEY = 'rincatia_user'
  const params = new URLSearchParams(window.location.search)

  function cleanUrl() {
    const cleanUrl = window.location.pathname + window.location.hash
    window.history.replaceState({}, document.title, cleanUrl)
  }

})()

// DOM 就绪后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
