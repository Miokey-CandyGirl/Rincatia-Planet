<template>
  <div class="comment-form">
    <textarea
      v-model="content"
      :placeholder="placeholder"
      rows="3"
      @keyup.enter.ctrl="handleSubmit"
    ></textarea>
    <div class="form-footer">
      <span class="char-count">{{ content.length }}/500</span>
      <button
        class="btn btn-primary btn-small"
        :disabled="!content.trim() || submitting"
        @click="handleSubmit"
      >
        {{ submitting ? '发送中...' : '发表评论' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  placeholder: { type: String, default: '写下你的评论...' },
  replyTo: { type: String, default: '' }
})

const emit = defineEmits(['submit'])
const content = ref('')
const submitting = ref(false)

async function handleSubmit() {
  if (!content.value.trim() || submitting.value) return
  submitting.value = true
  emit('submit', { content: content.value.trim(), replyTo: props.replyTo })
  content.value = ''
  submitting.value = false
}
</script>

<style scoped>
.comment-form { margin: 16px 0; }
.comment-form textarea {
  width: 100%; padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  color: #fff; resize: vertical;
  outline: none; box-sizing: border-box;
  font-size: 14px; line-height: 1.6;
}
.comment-form textarea:focus { border-color: rgba(255, 255, 255, 0.3); }
.form-footer {
  display: flex; align-items: center; justify-content: space-between;
  margin-top: 8px;
}
.char-count { font-size: 12px; color: #666; }
</style>