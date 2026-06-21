<template>
  <div class="community-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">社区（Community）开发中……</h1>
        <p class="page-subtitle">与其他学习者交流，分享学习心得和琳凯蒂亚文化</p>
      </div>

      <div class="community-toolbar">
        <SearchBar placeholder="搜索帖子..." @search="handleSearch" />
        <router-link to="/community/new" class="btn btn-primary" v-if="userStore.isLoggedIn">
          发布新帖
        </router-link>
        <button class="btn btn-primary" v-else @click="showLogin = true">
          登录后发帖
        </button>
      </div>

      <div class="sort-bar">
        <button :class="{ active: sortBy === 'created_at' }" @click="sortBy = 'created_at'">最新</button>
        <button :class="{ active: sortBy === 'like_count' }" @click="sortBy = 'like_count'">最热</button>
      </div>

      <div class="post-list">
        <PostCard v-for="post in posts" :key="post.id" :post="post" />
      </div>

      <div v-if="posts.length === 0" class="empty-state">
        <p>暂无帖子，成为第一个发帖的人吧！</p>
      </div>

      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @change="onPageChange"
      />

      <LoginModal v-if="showLogin" @close="showLogin = false" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/store/user'
import SearchBar from '@/components/SearchBar.vue'
import PostCard from '@/components/PostCard.vue'
import Pagination from '@/components/Pagination.vue'
import LoginModal from '@/components/LoginModal.vue'

const userStore = useUserStore()
const showLogin = ref(false)
const sortBy = ref('created_at')
const currentPage = ref(1)
const totalPages = ref(1)

const posts = ref([
  {
    id: '1',
    title: '欢迎来到琳凯蒂亚社区！',
    content: '大家好，这里是琳凯蒂亚语学习社区。欢迎分享你的学习心得和问题...',
    users: { nickname: '管理员', avatar_url: null },
    like_count: 15,
    comment_count: 5,
    is_pinned: true,
    created_at: new Date().toISOString()
  }
])

function handleSearch(query) {
  console.log('搜索:', query)
}

function onPageChange(page) {
  currentPage.value = page
}
</script>

<style scoped>
.community-toolbar {
  display: flex; align-items: center; gap: 16px;
  margin-bottom: 16px;
}
.sort-bar {
  display: flex; gap: 8px; margin-bottom: 20px;
}
.sort-bar button {
  background: none; border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px; padding: 4px 14px;
  color: #aaa; cursor: pointer; font-size: 13px;
  transition: all 0.2s;
}
.sort-bar button.active {
  background: #667eea; border-color: #667eea; color: #fff;
}
.sort-bar button:hover:not(.active) { border-color: #667eea; color: #667eea; }
.empty-state { text-align: center; padding: 60px 0; color: #666; }
</style>