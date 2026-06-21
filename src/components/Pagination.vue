<template>
  <div class="pagination" v-if="totalPages > 1">
    <button class="page-btn" :disabled="currentPage === 1" @click="goTo(currentPage - 1)">
      ← 上一页
    </button>

    <template v-for="page in displayedPages" :key="page">
      <span class="page-ellipsis" v-if="page === '...'">...</span>
      <button
        v-else
        class="page-btn"
        :class="{ active: page === currentPage }"
        @click="goTo(page)"
      >
        {{ page }}
      </button>
    </template>

    <button class="page-btn" :disabled="currentPage === totalPages" @click="goTo(currentPage + 1)">
      下一页 →
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  maxVisible: { type: Number, default: 5 }
})

const emit = defineEmits(['change'])

const displayedPages = computed(() => {
  const pages = []
  const total = props.totalPages
  const current = props.currentPage
  const max = props.maxVisible

  if (total <= max) {
    for (let i = 1; i <= total; i++) pages.push(i)
    return pages
  }

  pages.push(1)
  const start = Math.max(2, current - Math.floor(max / 2) + 2)
  const end = Math.min(total - 1, current + Math.floor(max / 2) - 2)

  if (start > 2) pages.push('...')
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < total - 1) pages.push('...')
  pages.push(total)

  return pages
})

function goTo(page) {
  if (page < 1 || page > props.totalPages) return
  emit('change', page)
}
</script>

<style scoped>
.pagination {
  display: flex; align-items: center; justify-content: center;
  gap: 6px; margin-top: 24px;
}
.page-btn {
  padding: 6px 14px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  background: transparent; color: #ccc;
  cursor: pointer; font-size: 13px;
  transition: all 0.2s;
}
.page-btn:hover:not(:disabled) { border-color: #667eea; color: #667eea; }
.page-btn.active { background: #667eea; border-color: #667eea; color: #fff; }
.page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.page-ellipsis { padding: 0 4px; color: #666; }
</style>