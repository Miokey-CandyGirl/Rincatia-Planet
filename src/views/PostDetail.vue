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
                <span class="author-name">
                  {{ post.users?.nickname || '琳凯蒂亚居民' }}
                  <span :class="['post-category-badge', post.category || 'general']">
                    {{ categoryLabel(post.category) }}
                  </span>
                </span>
                <span class="post-time">{{ formatTime(post.created_at) }}</span>
              </div>
            </div>
            <div class="post-actions" v-if="isOwner || isAdmin">
              <router-link :to="`/community/edit/${post.id}`" class="btn btn-outline btn-small" v-if="isOwner">编辑</router-link>
              <button class="btn btn-danger btn-small" @click="handleDelete">删除</button>
            </div>
          </div>

          <h1 class="post-title">{{ post.title }}</h1>
          <div class="post-content" v-html="renderedContent"></div>

          <!-- 附件 -->
          <div class="post-files" v-if="postFiles.length">
            <div class="files-title">📎 附件 ({{ postFiles.length }})</div>
            <a
              class="file-link"
              v-for="file in postFiles"
              :key="file.id"
              @click.prevent="downloadAttachment(file)"
              href="#"
            >
              📄 {{ file.file_name }}
              <span style="font-size:0.75rem;color:#666;margin-left:auto">{{ formatSize(file.file_size) }}</span>
            </a>
          </div>

          <div class="post-footer">
            <div class="action-group">
              <LikeButton
                :liked="userLiked"
                :count="post.like_count || 0"
                target-type="post"
                :target-id="post.id"
                @toggle="handleLike"
              />
              <FavoriteButton
                :favorited="userFavorited"
                target-type="post"
                :target-id="post.id"
                @toggle="handleFavorite"
              />
            </div>
            <span class="post-views">👁 {{ post.view_count || 0 }} 次浏览</span>
          </div>
        </article>

        <!-- 评论区 -->
        <section class="comments-section">
          <h3>💬 评论 ({{ comments.length }})</h3>

          <CommentForm
            v-if="userStore.isLoggedIn"
            @submit="handleComment"
            placeholder="写下你的评论..."
          />
          <p v-else class="login-hint">
            <a href="#" @click.prevent="showLogin = true">登录</a>后即可发表评论
          </p>

          <div class="comments-list" v-if="comments.length">
            <CommentItem
              v-for="comment in comments"
              :key="comment.id"
              :comment="comment"
              :current-user-id="userStore.user?.id"
              @reply="handleReply"
              @delete="handleDeleteComment"
              @like="() => {}"
            />
          </div>
          <div class="empty-state" v-else-if="!loading">
            <p>暂无评论，来说两句吧</p>
          </div>
        </section>
      </template>

      <div v-else class="not-found">帖子不存在或已被删除</div>

      <LoginModal v-if="showLogin" @close="showLogin = false" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import {
  getPostById, getComments, deletePost, createComment, deleteComment,
  toggleLike, toggleFavorite, getUserLikes, getUserFavorites,
  getPostFiles, getFileUrl, incrementViewCount, checkIsAdmin
} from '@/api'
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
const postFiles = ref([])
const loading = ref(true)
const showLogin = ref(false)
const userLiked = ref(false)
const userFavorited = ref(false)
const isAdmin = ref(false)

const isOwner = computed(() => post.value?.user_id === userStore.user?.id)

const renderedContent = computed(() => {
  if (!post.value?.content) return ''
  return post.value.content
    .replace(/\n/g, '<br>')
    .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
})

function categoryLabel(value) {
  const map = { learning: '学习心得', culture: '文化创作', qa: '答疑解惑', general: '综合讨论' }
  return map[value] || '综合讨论'
}

function formatSize(bytes) {
  if (!bytes) return ''
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

async function downloadAttachment(file) {
  try {
    const url = await getFileUrl(file.file_path)
    // getFileUrl returns the publicUrl directly
    window.open(url, '_blank')
  } catch (e) {
    console.error('下载失败:', e)
  }
}

async function fetchPost() {
  loading.value = true
  try {
    const [postData, filesData, commentData] = await Promise.all([
      getPostById(route.params.id),
      getPostFiles(route.params.id),
      getComments(route.params.id)
    ])
    post.value = postData
    postFiles.value = filesData
    comments.value = commentData || []

    // 增加浏览量
    incrementViewCount(route.params.id).catch(() => {})

    // 检查当前用户是否已点赞/收藏
    if (userStore.user?.id) {
      const [likes, favs, adminCheck] = await Promise.all([
        getUserLikes(userStore.user.id, 'post'),
        getUserFavorites(userStore.user.id),
        checkIsAdmin(userStore.user.id)
      ])
      userLiked.value = likes.some(l => l.target_id === route.params.id)
      userFavorited.value = favs.some(f => f.target_id === route.params.id && f.target_type === 'post')
      isAdmin.value = adminCheck
    }
  } catch (e) {
    console.error('加载帖子失败:', e)
    post.value = null
  } finally {
    loading.value = false
  }
}

async function handleLike() {
  if (!userStore.isLoggedIn) { showLogin.value = true; return }
  try {
    const result = await toggleLike({
      userId: userStore.user.id,
      targetType: 'post',
      targetId: post.value.id
    })
    userLiked.value = result.liked
    post.value.like_count = (post.value.like_count || 0) + (result.liked ? 1 : -1)
  } catch (e) {
    console.error('点赞失败:', e)
  }
}

async function handleFavorite() {
  if (!userStore.isLoggedIn) { showLogin.value = true; return }
  try {
    const result = await toggleFavorite({
      userId: userStore.user.id,
      targetType: 'post',
      targetId: post.value.id
    })
    userFavorited.value = result.favorited
  } catch (e) {
    console.error('收藏失败:', e)
  }
}

async function handleComment({ content }) {
  if (!userStore.isLoggedIn) return
  try {
    const newComment = await createComment({
      postId: post.value.id,
      userId: userStore.user.id,
      content
    })
    newComment.users = { nickname: userStore.user.nickname, avatar_url: userStore.user.avatar_url }
    comments.value.push(newComment)
    post.value.comment_count = (post.value.comment_count || 0) + 1
  } catch (e) {
    console.error('评论失败:', e)
  }
}

async function handleReply(commentId) {
  // 简单实现：在评论框中 @回复
  alert('回复功能开发中，请在新评论中 @对方昵称')
}

async function handleDeleteComment(commentId) {
  if (!confirm('确定删除这条评论？')) return
  try {
    await deleteComment(commentId)
    comments.value = comments.value.filter(c => c.id !== commentId)
    post.value.comment_count = Math.max(0, (post.value.comment_count || 1) - 1)
  } catch (e) {
    console.error('删除评论失败:', e)
  }
}

async function handleDelete() {
  if (!confirm('确定删除这篇帖子？此操作不可恢复。')) return
  try {
    await deletePost(post.value.id)
    router.push('/community')
  } catch (e) {
    console.error('删除帖子失败:', e)
  }
}

onMounted(fetchPost)
</script>

<style>
@import '@/assets/styles/community.css';
</style>