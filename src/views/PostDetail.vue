<template>
  <div class="post-detail-page">
    <div class="container">
      <router-link to="/community" class="back-link">← 返回社区</router-link>

      <div v-if="loading" class="loading">加载中...</div>

      <template v-else-if="post">
        <article class="post-detail">
          <div class="post-header">
            <div class="post-author">
              <div class="author-avatar">{{ post.users?.nickname?.charAt(0) || '琳' }}</div>
              <div class="author-info">
                <span class="author-name">{{ post.users?.nickname || '琳凯蒂亚居民' }}</span>
                <span class="post-time">{{ formatTime(post.created_at) }}</span>
              </div>
            </div>
            <div class="post-actions" v-if="isOwner">
              <router-link :to="`/community/edit/${post.id}`" class="btn btn-outline btn-small">编辑</router-link>
              <button class="btn btn-danger btn-small" @click="handleDelete">删除</button>
            </div>
          </div>

          <h1 class="post-title">{{ post.title }}</h1>
          <div class="post-content">{{ post.content }}</div>

          <div class="post-footer">
            <LikeButton
              :liked="false"
              :count="post.like_count || 0"
              target-type="post"
              :target-id="post.id"
              @toggle="handleLike"
            />
            <button class="fav-btn" @click="handleFavorite">⭐ 收藏</button>
          </div>
        </article>

        <!-- 评论区 -->
        <section class="comments-section">
          <h3>评论 ({{ comments.length }})</h3>

          <CommentForm
            v-if="userStore.isLoggedIn"
            @submit="handleComment"
            placeholder="写下你的评论..."
          />
          <p v-else class="login-hint">
            <a href="#" @click.prevent="showLogin = true">登录</a>后即可发表评论
          </p>

          <div class="comments-list">
            <CommentItem
              v-for="comment in comments"
              :key="comment.id"
              :comment="comment"
              :current-user-id="userStore.user?.id"
              @reply="handleReply"
              @delete="handleDeleteComment"
              @like="handleLike"
            />
          </div>
        </section>
      </template>

      <div v-else class="not-found">帖子不存在</div>

      <LoginModal v-if="showLogin" @close="showLogin = false" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { getPostById, getComments, deletePost } from '@/api'
import { formatTime } from '@/utils'
import LikeButton from '@/components/LikeButton.vue'
import CommentItem from '@/components/CommentItem.vue'
import CommentForm from '@/components/CommentForm.vue'
import LoginModal from '@/components/LoginModal.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const post = ref(null)
const comments = ref([])
const loading = ref(true)
const showLogin = ref(false)

const isOwner = computed(() => post.value?.user_id === userStore.user?.id)

onMounted(async () => {
  try {
    // TODO: 从 API 获取帖子详情
    // post.value = await getPostById(route.params.id)
    // comments.value = await getComments(route.params.id)
    post.value = {
      id: route.params.id,
      title: '示例帖子',
      content: '这是一个示例帖子的内容...',
      users: { nickname: '琳凯蒂亚居民', avatar_url: null },
      user_id: 'sample',
      like_count: 0,
      created_at: new Date().toISOString()
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

async function handleDelete() {
  if (!confirm('确定要删除这篇帖子吗？')) return
  await deletePost(post.value.id)
  router.push('/community')
}

function handleComment({ content }) {
  console.log('发表评论:', content)
}

function handleReply(commentId) {
  console.log('回复评论:', commentId)
}

function handleDeleteComment(commentId) {
  console.log('删除评论:', commentId)
}

function handleLike({ liked, targetType, targetId }) {
  console.log('点赞:', { liked, targetType, targetId })
}

function handleFavorite() {
  console.log('收藏帖子:', post.value.id)
}
</script>

<style scoped>
.back-link {
  display: inline-block; margin-bottom: 20px;
  color: #667eea; text-decoration: none; font-size: 14px;
}
.back-link:hover { text-decoration: underline; }
.loading, .not-found { text-align: center; padding: 60px 0; color: #666; }
.post-detail {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px; padding: 24px;
  margin-bottom: 32px;
}
.post-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 16px;
}
.post-author { display: flex; align-items: center; gap: 10px; }
.author-avatar {
  width: 40px; height: 40px; border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; color: #fff; font-weight: bold;
}
.author-name { font-size: 15px; color: #ccc; display: block; }
.post-time { font-size: 12px; color: #666; }
.post-actions { display: flex; gap: 8px; }
.btn-danger { background: #ff6b6b; border-color: #ff6b6b; color: #fff; }
.post-title { font-size: 24px; color: #fff; margin-bottom: 16px; }
.post-content {
  font-size: 15px; color: #ddd; line-height: 1.8;
  white-space: pre-wrap; margin-bottom: 20px;
}
.post-footer {
  display: flex; align-items: center; gap: 16px;
  padding-top: 16px; border-top: 1px solid rgba(255, 255, 255, 0.08);
}
.fav-btn {
  background: none; border: none; color: #888;
  cursor: pointer; font-size: 13px; padding: 4px 8px;
  border-radius: 4px; transition: color 0.2s;
}
.fav-btn:hover { color: #ffa500; }
.comments-section { margin-top: 32px; }
.comments-section h3 { color: #fff; margin-bottom: 16px; }
.login-hint { text-align: center; color: #888; padding: 16px 0; }
.login-hint a { color: #667eea; cursor: pointer; }
</style>