/**
 * iDrome — 导航面板交互
 *
 * 按设计方案第 4.1 节实现：
 * - Logo 点击 → state.navPanelOpen = !state.navPanelOpen
 * - 面板外点击 / Esc 键 → state.navPanelOpen = false
 * - 面板展开/收起动画（CSS transition + class 切换）
 * - 用户头像下拉菜单（禁用 hover 触发，仅点击）
 * - 移动端/平板左右滑动手势打开/关闭面板
 *
 * 约束：禁用 hover 触发，仅通过点击或滑动展开/收起
 */

'use strict'

import { state } from './state.js'

/** 滑动手势阈值（像素） */
const SWIPE_THRESHOLD = 50
/** 边缘触发区域宽度（像素）— 从屏幕左边缘开始触发打开 */
const EDGE_THRESHOLD = 40
/** 垂直滑动容差（像素）— 超过此值则判定为垂直滚动，不触发水平滑动 */
const VERTICAL_TOLERANCE = 60

/**
 * 初始化导航面板交互
 * - Logo 点击切换面板
 * - 遮罩层点击关闭
 * - Esc 键关闭
 * - 用户头像下拉菜单（点击触发）
 * - 移动端/平板滑动手势
 */
export function initNavPanel() {
  // 1. Logo 点击 → 切换导航面板
  const logoBtn = document.getElementById('logoBtn')
  if (logoBtn) {
    logoBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      state.navPanelOpen = !state.navPanelOpen
    })
  }

  // 2. 遮罩层点击 → 关闭面板
  const overlay = document.getElementById('navPanelOverlay')
  if (overlay) {
    overlay.addEventListener('click', () => {
      state.navPanelOpen = false
    })
  }

  // 3. 点击面板外部关闭（桌面端点击导航面板外的区域）
  document.addEventListener('click', (e) => {
    if (!state.navPanelOpen) return

    const navPanel = document.getElementById('navPanel')
    const logoBtnEl = document.getElementById('logoBtn')

    // 如果点击不在面板内且不在 Logo 按钮上，关闭面板
    if (navPanel && !navPanel.contains(e.target) && !logoBtnEl?.contains(e.target)) {
      // 仅在面板展开时且点击的不是面板内部元素时关闭
      // 避免点击设置面板等模态框时误关闭
      const settingsModal = document.getElementById('settingsModal')
      if (settingsModal && settingsModal.classList.contains('open')) return

      state.navPanelOpen = false
    }
  })

  // 4. Esc 键关闭面板
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.navPanelOpen) {
      state.navPanelOpen = false
    }
  })

  // 5. 初始化用户头像下拉菜单
  initUserDropdown()

  // 6. 初始化移动端/平板滑动手势
  initSwipeGestures()

  console.log('[iDrome NavPanel] 导航面板交互已初始化')
}

/**
 * 初始化滑动手势
 * - 从左边缘向右滑动 → 打开导航面板
 * - 面板打开时向左滑动 → 关闭导航面板
 * - 仅在移动端和平板设备上启用（宽度 < 1024px）
 * - 不干扰垂直滚动和其他触摸交互
 */
function initSwipeGestures() {
  let touchStartX = 0
  let touchStartY = 0
  let touchStartTime = 0
  let isTracking = false

  document.addEventListener('touchstart', (e) => {
    // 仅在移动端/平板启用
    if (window.innerWidth >= 1024) return

    // 仅追踪单指触摸
    if (e.touches.length !== 1) return

    const touch = e.touches[0]
    touchStartX = touch.clientX
    touchStartY = touch.clientY
    touchStartTime = Date.now()
    isTracking = true
  }, { passive: true })

  document.addEventListener('touchend', (e) => {
    if (!isTracking) return
    isTracking = false

    // 仅在移动端/平板启用
    if (window.innerWidth >= 1024) return

    const touch = e.changedTouches[0]
    if (!touch) return

    const deltaX = touch.clientX - touchStartX
    const deltaY = touch.clientY - touchStartY
    const elapsedTime = Date.now() - touchStartTime

    // 时间过长则不视为滑动（可能是拖拽操作）
    if (elapsedTime > 500) return

    // 垂直位移过大则判定为垂直滚动，不触发水平滑动
    if (Math.abs(deltaY) > VERTICAL_TOLERANCE) return

    // 水平滑动距离不足，不触发
    if (Math.abs(deltaX) < SWIPE_THRESHOLD) return

    // 向右滑动 — 从左边缘开始 → 打开面板
    if (deltaX > 0 && !state.navPanelOpen) {
      // 仅当触摸起点在屏幕左边缘时触发
      if (touchStartX <= EDGE_THRESHOLD) {
        state.navPanelOpen = true
      }
    }

    // 向左滑动 — 面板已打开时 → 关闭面板
    if (deltaX < 0 && state.navPanelOpen) {
      state.navPanelOpen = false
    }
  }, { passive: true })
}

/**
 * 初始化用户头像下拉菜单
 * 约束：禁用 hover 触发，仅通过点击展开/收起
 */
function initUserDropdown() {
  const userArea = document.getElementById('userArea')
  const dropdown = document.getElementById('userDropdownMenu')
  if (!userArea || !dropdown) return

  // 点击用户区域切换下拉菜单
  userArea.addEventListener('click', (e) => {
    e.stopPropagation()
    const isOpen = dropdown.classList.contains('show')
    dropdown.setAttribute('aria-hidden', String(!isOpen))
    dropdown.classList.toggle('show', !isOpen)
  })

  // 点击外部关闭下拉菜单
  document.addEventListener('click', () => {
    dropdown.setAttribute('aria-hidden', 'true')
    dropdown.classList.remove('show')
  })

  // 下拉菜单项点击
  dropdown.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation()
      const action = item.dataset.action
      dropdown.setAttribute('aria-hidden', 'true')
      dropdown.classList.remove('show')

      // 通过自定义事件通知 app.js 处理具体动作
      document.dispatchEvent(new CustomEvent('idrome:user-action', {
        detail: { action }
      }))
    })
  })
}

/**
 * 更新导航面板 UI（由 state 订阅调用）
 * @param {boolean} isOpen - 面板是否展开
 */
export function updateNavPanelUI(isOpen) {
  const panel = document.getElementById('navPanel')
  const overlay = document.getElementById('navPanelOverlay')
  const logoBtn = document.getElementById('logoBtn')

  if (panel) {
    if (isOpen) {
      panel.classList.add('expanded')
      panel.setAttribute('aria-hidden', 'false')
    } else {
      panel.classList.remove('expanded')
      panel.setAttribute('aria-hidden', 'true')
    }
  }

  // Logo 按钮激活态
  if (logoBtn) {
    logoBtn.classList.toggle('active', isOpen)
    logoBtn.setAttribute('aria-label', isOpen ? '收起导航面板' : '展开导航面板')
  }

  // 遮罩层仅在移动端显示
  if (overlay) {
    if (isOpen && window.innerWidth < 768) {
      overlay.style.display = 'block'
    } else {
      overlay.style.display = 'none'
    }
  }
}
