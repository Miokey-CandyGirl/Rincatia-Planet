<template>
  <div class="world-page">
    <div class="container">
      <!-- 页面头部 -->
      <header class="page-header">
        <h1 class="page-title">琳凯蒂亚世界</h1>
        <p class="page-subtitle">探索《光线传奇》的宏大世界观，走进双月交辉的奇幻星球</p>
        <p class="page-university" style="font-size: 20px; font-weight: bold;">华田中央大学艺术传媒学院</p>
      </header>

      <!-- 豆瓣阅读推广 -->
      <div class="douban-promo">
        <div class="douban-promo-content">
          <span class="douban-promo-icon">📖</span>
          <div class="douban-promo-text">
            <p class="douban-promo-title">想要阅读完整版故事？（作者：林倾雨）</p>
            <p class="douban-promo-desc">以下仅为故事概要，完整版《光线传奇之彩虹水晶》现已在豆瓣阅读平台发布！</p>
          </div>
          <a href="https://read.douban.com/column/71054869/" target="_blank" rel="noopener noreferrer" class="douban-promo-btn">
            前往阅读 →
          </a>
        </div>
      </div>

      <!-- 子导航 -->
      <nav class="world-nav">
        <router-link to="/world/worldview" class="nav-tab" active-class="active">
          <span class="tab-icon">🌍</span>
          <span class="tab-label">世界观</span>
        </router-link>
        <router-link to="/world/rainbow-crystal" class="nav-tab" active-class="active">
          <span class="tab-icon">🌈</span>
          <span class="tab-label">彩虹水晶</span>
        </router-link>
        <router-link to="/world/starfall-war" class="nav-tab" active-class="active">
          <span class="tab-icon">⚔️</span>
          <span class="tab-label">星陨之战</span>
        </router-link>
        <router-link to="/world/zero-judgment" class="nav-tab" active-class="active">
          <span class="tab-icon">⚖️</span>
          <span class="tab-label">归零审判</span>
        </router-link>
        <router-link to="/world/derivative-works" class="nav-tab" active-class="active">
          <span class="tab-icon">📚</span>
          <span class="tab-label">衍生作品</span>
        </router-link>
        <router-link to="/world/cultural-works" class="nav-tab" active-class="active">
          <span class="tab-icon">🎨</span>
          <span class="tab-label">文化作品</span>
        </router-link>
        <router-link to="/world/tian-calendar" class="nav-tab" active-class="active">
          <span class="tab-icon">📅</span>
          <span class="tab-label">田历历法</span>
        </router-link>
      </nav>

      <!-- 子页面内容 -->
      <router-view v-slot="{ Component }">
        <transition name="router-view" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup>
</script>

<style>
@import '@/assets/styles/world.css';
</style>