<template>
  <button
    class="fav-btn"
    :class="{ active: favorited }"
    @click="$emit('toggle')"
    :title="favorited ? '取消收藏' : '收藏'"
  >
    {{ favorited ? '⭐ 已收藏' : '☆ 收藏' }}
  </button>
</template>

<script setup>
defineProps({
  favorited: { type: Boolean, default: false },
  targetType: { type: String, default: 'post' },
  targetId: { type: String, default: '' }
})

defineEmits(['toggle'])
</script>