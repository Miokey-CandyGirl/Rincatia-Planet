<template>
  <div class="sidebar-card" v-if="topics.length">
    <h3 class="sidebar-title">🔥 热门话题</h3>
    <div
      class="hot-topic-item"
      v-for="(topic, index) in topics"
      :key="topic.id"
      @click="$emit('click', topic.id)"
    >
      <span :class="['topic-rank', rankClass(index)]">{{ index + 1 }}</span>
      <span class="topic-title" :title="topic.title">{{ topic.title }}</span>
      <span class="topic-count">{{ topic.comment_count || 0 }} 评</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  topics: { type: Array, default: () => [] }
})

defineEmits(['click'])

function rankClass(index) {
  if (index === 0) return 'top-1'
  if (index === 1) return 'top-2'
  if (index === 2) return 'top-3'
  return 'top-other'
}
</script>