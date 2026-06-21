<template>
  <div class="sidebar-card" v-if="users.length">
    <h3 class="sidebar-title">👥 活跃用户</h3>
    <div
      class="active-user-item"
      v-for="(user, index) in users"
      :key="user.id"
    >
      <span class="user-rank">{{ index + 1 }}</span>
      <div class="user-mini-avatar">{{ user.nickname?.charAt(0) || '琳' }}</div>
      <span class="user-mini-name" :title="user.nickname">{{ user.nickname || '琳凯蒂亚居民' }}</span>
      <span class="user-post-count" v-if="user.post_count">{{ user.post_count }} 帖</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  users: { type: Array, default: () => [] }
})
</script>