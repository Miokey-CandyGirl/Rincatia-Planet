/**
 * 国旗导航菜单 - Vue 3 Composable
 * 点击国旗展开导航菜单，包含动画效果和菜单项交互
 * 基于 consultation/flag-navigation.js 实现
 */

import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// 导航菜单项配置（与 consultation 一致）
const MENU_ITEMS = [
  { id: 'index', label: '首页', icon: '🏠', path: '/' },
  { id: 'grammar', label: '田语', icon: '📝', path: '/Rincatian' },
  { id: 'dictionary', label: '世界', icon: '📚', path: '/world' },
  { id: 'culture', label: '商务', icon: '🎨', path: '/business' },
  { id: 'community', label: '社区', icon: '💬', path: '/community' }
]

export function useFlagNavigation() {
  const isMenuOpen = ref(false)
  const router = useRouter()
  const route = useRoute()

  // 切换菜单
  function toggleMenu() {
    isMenuOpen.value = !isMenuOpen.value
  }

  // 打开菜单
  function openMenu() {
    isMenuOpen.value = true
  }

  // 关闭菜单
  function closeMenu() {
    isMenuOpen.value = false
  }

  // 导航到指定页面
  function navigateTo(path) {
    closeMenu()
    router.push(path)
  }

  // 检查当前路由是否激活
  // 根路径 '/' 精确匹配，其他路径支持子路由匹配
  function isActiveRoute(path) {
    if (path === '/') {
      return route.path === '/'
    }
    return route.path === path || route.path.startsWith(path + '/')
  }

  // 获取当前页面名称
  function getCurrentPageName() {
    const currentItem = MENU_ITEMS.find(item => isActiveRoute(item.path))
    return currentItem ? currentItem.label : '首页'
  }

  // 点击外部关闭菜单
  function handleClickOutside(event) {
    const menu = document.querySelector('.flag-navigation-menu')
    const flag = document.querySelector('.rincatian-flag')
    if (
      menu &&
      !menu.contains(event.target) &&
      flag &&
      !flag.contains(event.target)
    ) {
      closeMenu()
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })

  return {
    isMenuOpen,
    menuItems: MENU_ITEMS,
    toggleMenu,
    openMenu,
    closeMenu,
    navigateTo,
    isActiveRoute,
    getCurrentPageName
  }
}

export default useFlagNavigation