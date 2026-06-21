<template>
  <div class="comment-item" :class="{ 'is-reply': depth > 0 }">
    <div class="comment-header">
      <div class="comment-user">
        <div class="comment-avatar">{{ comment.users?.nickname?.charAt(0) || '琳' }}</div>
        <span class="comment-nickname">{{ comment.users?.nickname || '琳凯蒂亚居民' }}</span>
      </div>
      <span class="comment-time">{{ formatTime(comment.created_at) }}</span>
    </div>
    <div class="comment-content">{{ comment.content }}</div>
    <div class="comment-actions">
      <LikeButton
        :liked="false"
        :count="comment.like_count || 0"
        target-type="comment"
        :target-id="comment.id"
        @toggle="handleLike"
      />
      <button class="reply-btn" @click="$emit('reply', comment.id)" v-if="depth === 0">
        回复
      </button>
      <button class="delete-btn" v-if="isOwner" @click="$emit('delete', comment.id)">
        删除
      </button>
    </div>
    <!-- 嵌套回复 -->
    <div class="replies" v-if="comment.replies?.length">
      <CommentItem
        v-for="reply in comment.replies"
        :key="reply.id"
        :comment="reply"
        :depth="depth + 1"
        :current-user-id="currentUserId"
        @reply="(id) => $emit('reply', id)"
        @delete="(id) => $emit('delete', id)"
        @like="(payload) => $emit('like', payload)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import LikeButton from './LikeButton.vue'
import { formatTime } from '@/utils'

const props = defineProps({
  comment: { type: Object, required: true },
  depth: { type: Number, default: 0 },
  currentUserId: { type: String, default: '' }
})

defineEmits(['reply', 'delete', 'like'])

const isOwner = computed(() => props.comment.user_id === props.currentUserId)
</script>

<style scoped>
.comment-item {
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.comment-item.is-reply {
  margin-left: 32px;
  border-left: 2px solid rgba(255, 255, 255, 0.1);
  padding-left: 12px;
}
.comment-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 6px;
}
.comment-user { display: flex; align-items: center; gap: 8px; }
.comment-avatar {
  width: 28px; height: 28px; border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; color: #fff; font-weight: bold;
}
.comment-nickname { font-size: 14px; color: #ccc; }
.comment-time { font-size: 12px; color: #666; }
.comment-content { font-size: 14px; color: #ddd; margin-bottom: 8px; line-height: 1.6; }
.comment-actions { display: flex; align-items: center; gap: 12px; }
.reply-btn, .delete-btn {
  background: none; border: none; color: #888;
  font-size: 12px; cursor: pointer; padding: 2px 6px;
  border-radius: 4px; transition: color 0.2s;
}
.reply-btn:hover { color: #667eea; }
.delete-btn:hover { color: #ff6b6b; }
</style>