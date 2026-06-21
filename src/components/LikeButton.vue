<template>
  <button class="like-button" :class="{ liked: isLiked }" @click="handleToggle" :disabled="loading">
    <span class="like-icon">{{ isLiked ? '❤️' : '🤍' }}</span>
    <span class="like-count" v-if="count > 0">{{ count }}</span>
  </button>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  liked: { type: Boolean, default: false },
  count: { type: Number, default: 0 },
  targetType: { type: String, required: true },
  targetId: { type: String, required: true }
})

const emit = defineEmits(['toggle'])
const isLiked = ref(props.liked)
const loading = ref(false)

async function handleToggle() {
  loading.value = true
  isLiked.value = !isLiked.value
  emit('toggle', { liked: isLiked.value, targetType: props.targetType, targetId: props.targetId })
  loading.value = false
}
</script>

<style scoped>
.like-button {
  background: none;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  transition: background 0.2s;
}
.like-button:hover { background: rgba(255, 255, 255, 0.1); }
.like-button:disabled { opacity: 0.5; cursor: not-allowed; }
.like-icon { font-size: 16px; }
.like-count { font-size: 13px; color: #aaa; }
</style>