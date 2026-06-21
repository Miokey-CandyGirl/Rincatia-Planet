<template>
  <div class="community-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">琳凯蒂亚社区欢迎您</h1>
        <p class="page-subtitle">与其他用户一起交流，分享田语学习心得和探索琳凯蒂亚文化</p>
      </div>

      <!-- 公告栏 -->
      <div class="community-notice" v-if="pinnedPosts.length">
        <span class="notice-icon">📢</span>
        <div class="notice-marquee">
          <div class="notice-track">
            <span
              class="notice-item"
              v-for="p in [...pinnedPosts, ...pinnedPosts]"
              :key="p.id + '-' + Math.random()"
              @click="goToPost(p.id)"
            >{{ p.title }}</span>
          </div>
        </div>
      </div>

      <!-- 工具栏 -->
      <div class="community-toolbar">
        <SearchBar placeholder="搜索帖子..." @search="handleSearch" />
        <router-link to="/community/new" class="btn-new-post" v-if="userStore.isLoggedIn">
          + 发布新帖
        </router-link>
        <button class="btn-new-post" v-else @click="showLogin = true">
          + 登录后发帖
        </button>
      </div>

      <!-- 分类标签 -->
      <div class="category-tabs">
        <button
          v-for="cat in categories"
          :key="cat.value"
          :class="['cat-tab', { active: activeCategory === cat.value }]"
          @click="switchCategory(cat.value)"
        >{{ cat.label }}</button>
      </div>

      <!-- 排序栏 -->
      <div class="sort-bar">
        <button :class="{ active: sortBy === 'created_at' }" @click="setSort('created_at')">最新</button>
        <button :class="{ active: sortBy === 'like_count' }" @click="setSort('like_count')">最热</button>
        <button :class="{ active: sortBy === 'comment_count' }" @click="setSort('comment_count')">最多回复</button>
      </div>

      <!-- 主内容区 -->
      <div class="community-layout">
        <div class="community-main">
          <div class="post-list" v-if="posts.length">
            <div
              class="post-card"
              v-for="post in posts"
              :key="post.id"
              @click="goToPost(post.id)"
            >
              <div class="post-header">
                <div class="post-author">
                  <div class="author-avatar">{{ post.users?.nickname?.charAt(0) || '琳' }}</div>
                  <div>
                    <span class="author-name">{{ post.users?.nickname || '琳凯蒂亚居民' }}</span>
                    <span class="post-time">{{ formatTime(post.created_at) }}</span>
                  </div>
                </div>
                <div class="post-badges">
                  <span class="post-category" v-if="post.category && post.category !== 'general'">
                    {{ categoryLabel(post.category) }}
                  </span>
                  <span class="post-pinned" v-if="post.is_pinned">📌 置顶</span>
                  <span class="post-essence" v-if="post.is_essence">✨ 精华</span>
                </div>
              </div>

              <h3 class="post-title">{{ post.title }}</h3>
              <p class="post-excerpt">{{ post.content?.substring(0, 150) }}{{ post.content?.length > 150 ? '...' : '' }}</p>

              <div class="post-footer">
                <div class="post-stats">
                  <span class="stat">❤️ {{ post.like_count || 0 }}</span>
                  <span class="stat">💬 {{ post.comment_count || 0 }}</span>
                  <span class="stat">👁 {{ post.view_count || 0 }}</span>
                </div>
                <span class="read-more">阅读全文 →</span>
              </div>
            </div>
          </div>

          <div v-if="loading" class="loading">加载中...</div>

          <div v-if="!loading && posts.length === 0" class="empty-state">
            <span class="empty-icon">📝</span>
            <p>暂无帖子，成为第一个发帖的人吧！</p>
            <router-link to="/community/new" class="btn btn-primary" v-if="userStore.isLoggedIn">发布新帖</router-link>
          </div>

          <div v-if="error" class="error-state">
            <p>加载失败，请刷新重试</p>
          </div>

          <Pagination
            :current-page="currentPage"
            :total-pages="totalPages"
            @change="onPageChange"
          />
        </div>

        <!-- 侧边栏 -->
        <aside class="community-sidebar">
          <HotTopics :topics="hotTopics" @click="goToPost" />
          <ActiveUsers :users="activeUsers" />
          <div class="sidebar-card">
            <h3 class="sidebar-title">📊 社区统计</h3>
            <div class="community-stats">
              <div class="stat-item">
                <span class="stat-value">{{ stats.postCount }}</span>
                <span class="stat-label">帖子</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ stats.userCount }}</span>
                <span class="stat-label">用户</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ stats.commentCount }}</span>
                <span class="stat-label">评论</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <LoginModal v-if="showLogin" @close="showLogin = false" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { getPosts, getHotTopics, getActiveUsers, getCommunityStats } from '@/api'
import { formatTime } from '@/utils'
import SearchBar from '@/components/SearchBar.vue'
import Pagination from '@/components/Pagination.vue'
import HotTopics from '@/components/HotTopics.vue'
import ActiveUsers from '@/components/ActiveUsers.vue'
import LoginModal from '@/components/LoginModal.vue'

const router = useRouter()
const userStore = useUserStore()

const posts = ref([])
const pinnedPosts = ref([])
const hotTopics = ref([])
const activeUsers = ref([])
const stats = ref({ postCount: 0, userCount: 0, commentCount: 0 })
const loading = ref(true)
const error = ref(false)
const showLogin = ref(false)

const sortBy = ref('created_at')
const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = 10
const activeCategory = ref('')
const searchQuery = ref('')

const categories = [
  { label: '全部', value: '' },
  { label: '📝 学习心得', value: 'learning' },
  { label: '🎨 文化创作', value: 'culture' },
  { label: '❓ 答疑解惑', value: 'qa' },
  { label: '💬 综合讨论', value: 'general' },
  { label: '☁️ 资源下载', value: 'download' }
]

function categoryLabel(value) {
  const map = { learning: '学习心得', culture: '文化创作', qa: '答疑解惑', general: '综合讨论', download: '资源下载' }
  return map[value] || value
}

async function fetchPosts() {
  loading.value = true
  error.value = false
  try {
    const result = await getPosts({
      page: currentPage.value,
      pageSize,
      orderBy: sortBy.value,
      ascending: false,
      category: activeCategory.value,
      search: searchQuery.value
    })
    const all = result.data || []
    posts.value = all.filter(p => !p.is_pinned)
    pinnedPosts.value = all.filter(p => p.is_pinned)
    totalPages.value = Math.max(1, Math.ceil((result.count || 0) / pageSize))
  } catch (e) {
    console.error('加载帖子失败:', e)
    error.value = true
  } finally {
    loading.value = false
  }
}

async function fetchSidebar() {
  try {
    const [topics, users, statsData] = await Promise.all([
      getHotTopics(5),
      getActiveUsers(10),
      getCommunityStats()
    ])
    hotTopics.value = topics
    activeUsers.value = users
    stats.value = statsData
  } catch (e) {
    console.error('加载侧边栏失败:', e)
  }
}

function switchCategory(value) {
  activeCategory.value = value
  currentPage.value = 1
}

function setSort(value) {
  sortBy.value = value
  currentPage.value = 1
}

function handleSearch(query) {
  searchQuery.value = query
  currentPage.value = 1
}

function onPageChange(page) {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function goToPost(id) {
  router.push(`/community/post/${id}`)
}

watch([sortBy, activeCategory, searchQuery], () => {
  fetchPosts()
})

onMounted(() => {
  fetchPosts()
  fetchSidebar()
})
</script>

<style>
@import '@/assets/styles/community.css';
</style>