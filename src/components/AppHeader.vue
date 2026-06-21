<template>
  <header class="header">
    <nav class="navbar">
      <div class="nav-container">
        <router-link to="/" class="nav-logo">
          <div class="rincatian-flag" @click.prevent.stop="toggleMenu()">
            <img src="/rincatian-flag.png" alt="琳凯蒂亚国旗" class="flag-icon">
            <!-- 国旗导航菜单 -->
            <div class="flag-navigation-menu" :class="{ open: isMenuOpen }">
              <div class="flag-menu-header">
                <div class="flag-menu-title">
                  <img src="/rincatian-flag.png" alt="琳凯蒂亚国旗" class="menu-flag-icon">
                  <span>国家官网导航</span>
                </div>
              </div>
              <div class="flag-menu-items">
                <div
                  v-for="item in menuItems"
                  :key="item.id"
                  class="flag-menu-item"
                  :class="{ active: isActiveRoute(item.path) }"
                  @click="navigateTo(item.path)"
                >
                  <span class="menu-item-icon">{{ item.icon }}</span>
                  <span class="menu-item-text">{{ item.label }}</span>
                  <span v-if="isActiveRoute(item.path)" class="current-indicator">•</span>
                </div>
              </div>
              <div class="flag-menu-footer">
                <div class="menu-footer-text">🎉欢迎您来琳凯蒂亚🎉</div>
                <div class="menu-footer-subtitle">Rincatia Planet</div>
              </div>
            </div>
          </div>
          <div class="planet-icon"></div>
          <div class="logo-text">
            <span class="logo-chinese">琳凯蒂亚星球</span>
            <span class="logo-english">My Rincatia Planet</span>
          </div>
        </router-link>

        <ul class="nav-menu">
          <li><router-link to="/" active-class="active" exact>首页</router-link></li>
          <li><router-link to="/Rincatian" active-class="active">田语</router-link></li>
          <li><router-link to="/world" active-class="active">世界</router-link></li>
          <li><router-link to="/business" active-class="active">商务</router-link></li>
          <li><router-link to="/community" active-class="active">社区</router-link></li>
        </ul>

        <div class="nav-extras">
          <!-- 田历日期 -->
          <div class="tian-calendar" @click="router.push('/world/tian-calendar')" title="点击查看田历历法">
            <span class="calendar-icon">📅</span>
            <span class="tian-date">{{ formattedDate }}</span>
          </div>

          <!-- 认证按钮 -->
          <div class="auth-buttons" v-if="!userStore.isLoggedIn">
            <button class="btn btn-primary btn-small" @click="$emit('show-login')">进入星球</button>
          </div>
          <div class="user-info" v-else>
            <div class="user-avatar">{{ userStore.user?.nickname?.charAt(0) || '琳' }}</div>
            <span class="user-name">{{ userStore.user?.nickname || '琳凯蒂亚居民' }}</span>
            <div class="user-dropdown">
              <router-link to="/user">个人中心</router-link>
              <a href="#" @click.prevent="handleLogout">退出登录</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router'
import { useFlagNavigation } from '@/composables/useFlagNavigation'
import { useTianCalendar } from '@/composables/useTianCalendar'

defineEmits(['show-login'])
const userStore = useUserStore()
const router = useRouter()

const {
  isMenuOpen,
  menuItems,
  toggleMenu,
  navigateTo,
  isActiveRoute,
  getCurrentPageName
} = useFlagNavigation()

const {
  formattedDate,
  tianDate
} = useTianCalendar()

async function handleLogout() {
  await userStore.logout()
  router.push('/')
}
</script>