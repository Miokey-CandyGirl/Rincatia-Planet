<template>
  <div class="rincatian-page">
    <div class="container">
      <!-- 页面头部 -->
      <header class="page-header">
        <h1 class="page-title">田语教学</h1>
        <p class="page-subtitle">琳凯蒂亚星球和地球往来的官方交际语言，每个音节都流淌着魔法气息</p>
        <p class="page-university" style="font-size: 20px; font-weight: bold;">华田中央大学思源教育学院田语系</p>
      </header>

      <!-- 子导航 -->
      <nav class="rincatian-nav">
        <router-link to="/Rincatian/phonetics" class="nav-tab" active-class="active">
          <span class="tab-icon">🔤</span>
          <span class="tab-label">语音文字</span>
        </router-link>
        <router-link to="/Rincatian/vocabulary" class="nav-tab" active-class="active">
          <span class="tab-icon">📖</span>
          <span class="tab-label">词汇查询</span>
        </router-link>
        <router-link to="/Rincatian/grammar" class="nav-tab" active-class="active">
          <span class="tab-icon">📐</span>
          <span class="tab-label">语法学习</span>
        </router-link>
        <router-link to="/Rincatian/practice" class="nav-tab" active-class="active">
          <span class="tab-icon">✏️</span>
          <span class="tab-label">专项练习</span>
        </router-link>
        <router-link to="/Rincatian/history" class="nav-tab" active-class="active">
          <span class="tab-icon">📜</span>
          <span class="tab-label">语言历史</span>
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
@import '@/assets/styles/Rincatian.css';
</style>