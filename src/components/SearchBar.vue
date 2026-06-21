<template>
  <div class="search-bar">
    <input
      type="text"
      :placeholder="placeholder"
      v-model="query"
      @input="onInput"
      @keyup.enter="onSearch"
    />
    <button class="search-btn" @click="onSearch">🔍</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { debounce } from '@/utils'

const props = defineProps({
  placeholder: { type: String, default: '搜索...' }
})

const emit = defineEmits(['search'])
const query = ref('')

const onInput = debounce(() => {
  emit('search', query.value)
}, 300)

function onSearch() {
  emit('search', query.value)
}
</script>

<style scoped>
.search-bar {
  display: flex;
  gap: 8px;
  max-width: 400px;
}
.search-bar input {
  flex: 1;
  padding: 8px 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  outline: none;
  transition: border-color 0.3s;
}
.search-bar input:focus { border-color: rgba(255, 255, 255, 0.5); }
.search-btn {
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}
.search-btn:hover { background: rgba(255, 255, 255, 0.1); }
</style>