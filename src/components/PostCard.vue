<template>
  <div class="post-card" @click="goToDetail">
    <div class="post-header">
      <div class="post-author">
        <div class="author-avatar">{{ post.users?.nickname?.charAt(0) || '琳' }}</div>
        <div class="author-info">
          <span class="author-name">{{ post.users?.nickname || '琳凯蒂亚居民' }}</span>
          <span class="post-time">{{ formatTime(post.created_at) }}</span>
        </div>
      </div>
      <span class="post-pinned" v-if="post.is_pinned">📌 置顶</span>
    </div>

    <h3 class="post-title">{{ post.title }}</h3>
    <p class="post-excerpt">{{ post.content?.substring(0, 150) }}{{ post.content?.length > 150 ? '...' : '' }}</p>

    <div class="post-footer">
      <div class="post-stats">
        <span class="stat">❤️ {{ post.like_count || 0 }}</span>
        <span class="stat">💬 {{ post.comment_count || 0 }}</span>
      </div>
      <span class="read-more">阅读全文 →</span>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { formatTime } from '@/utils'

const props = defineProps({
  post: { type: Object, required: true }
})

const router = useRouter()

function goToDetail() {
  router.push(`/community/post/${props.post.id}`)
}
</script>

<style scoped>
.post-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 16px;
}
.post-card:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}
.post-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 12px;
}
.post-author { display: flex; align-items: center; gap: 10px; }
.author-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; color: #fff; font-weight: bold;
}
.author-name { font-size: 14px; color: #ccc; display: block; }
.post-time { font-size: 12px; color: #666; }
.post-pinned { font-size: 12px; color: #ffa500; }
.post-title { font-size: 18px; color: #fff; margin-bottom: 8px; }
.post-excerpt { font-size: 14px; color: #999; line-height: 1.6; margin-bottom: 12px; }
.post-footer {
  display: flex; align-items: center; justify-content: space-between;
}
.post-stats { display: flex; gap: 16px; }
.stat { font-size: 13px; color: #888; }
.read-more { font-size: 13px; color: #667eea; }
</style>