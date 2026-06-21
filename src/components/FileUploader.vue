<template>
  <div class="file-uploader">
    <label class="upload-label">
      <input type="file" multiple @change="handleFiles" :accept="accept" />
      <span class="upload-btn">📎 选择文件</span>
    </label>
    <div class="file-list" v-if="files.length">
      <div class="file-item" v-for="(file, index) in files" :key="index">
        <span class="file-name">{{ file.name }}</span>
        <span class="file-size">{{ formatSize(file.size) }}</span>
        <button class="remove-btn" @click="removeFile(index)">&times;</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  accept: { type: String, default: 'image/*,.pdf,.doc,.docx' }
})

const emit = defineEmits(['update:files'])
const files = ref([])

function handleFiles(e) {
  const newFiles = Array.from(e.target.files)
  files.value = [...files.value, ...newFiles]
  emit('update:files', files.value)
}

function removeFile(index) {
  files.value.splice(index, 1)
  emit('update:files', files.value)
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}
</script>

<style scoped>
.file-uploader { margin: 12px 0; }
.upload-label input { display: none; }
.upload-btn {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 6px 14px;
  border: 1px dashed rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: #aaa; cursor: pointer;
  font-size: 13px; transition: all 0.2s;
}
.upload-btn:hover { border-color: #667eea; color: #667eea; }
.file-list { margin-top: 8px; }
.file-item {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 10px; background: rgba(255, 255, 255, 0.05);
  border-radius: 6px; margin-bottom: 4px;
  font-size: 13px;
}
.file-name { color: #ccc; flex: 1; }
.file-size { color: #666; }
.remove-btn {
  background: none; border: none; color: #ff6b6b;
  cursor: pointer; font-size: 16px;
}
</style>