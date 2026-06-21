<template>
  <div class="admin-page">
    <div class="container">
      <h1 class="page-title">管理员后台</h1>
      <p class="page-subtitle">数据管理 · 用户管理 · 内容审核</p>

      <!-- 非管理员拦截 -->
      <div v-if="!isAdmin" class="empty-state">
        <span class="empty-icon">🔒</span>
        <p>此页面仅限管理员访问</p>
        <router-link to="/" class="btn btn-primary">返回首页</router-link>
      </div>

      <template v-else>
        <!-- ========== 统计卡片 ========== -->
        <div class="admin-stats">
          <div class="admin-stat-card">
            <span class="stat-icon">📝</span>
            <span class="stat-value">{{ stats.postCount }}</span>
            <span class="stat-label">总帖子数</span>
          </div>
          <div class="admin-stat-card">
            <span class="stat-icon">👥</span>
            <span class="stat-value">{{ stats.userCount }}</span>
            <span class="stat-label">总用户数</span>
          </div>
          <div class="admin-stat-card">
            <span class="stat-icon">💬</span>
            <span class="stat-value">{{ stats.commentCount }}</span>
            <span class="stat-label">总评论数</span>
          </div>
          <div class="admin-stat-card">
            <span class="stat-icon">📌</span>
            <span class="stat-value">{{ pinnedCount }}</span>
            <span class="stat-label">置顶帖</span>
          </div>
          <div class="admin-stat-card">
            <span class="stat-icon">🚫</span>
            <span class="stat-value">{{ bannedUserCount }}</span>
            <span class="stat-label">已封禁</span>
          </div>
        </div>

        <!-- ========== 导航标签 ========== -->
        <nav class="admin-nav">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            :class="['admin-tab', { active: activeTab === tab.key }]"
            @click="switchTab(tab.key)"
          >{{ tab.label }}</button>
        </nav>

        <!-- ========== 帖子管理 ========== -->
        <div class="admin-section" v-if="activeTab === 'posts'">
          <div class="admin-section-header">
            <h3>帖子管理</h3>
            <span class="admin-count">共 {{ adminPosts.length }} 篇</span>
          </div>
          <div v-if="adminPosts.length" style="overflow-x:auto;">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>标题</th>
                  <th>作者</th>
                  <th>分类</th>
                  <th>时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in adminPosts" :key="p.id">
                  <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                    {{ p.title }}
                  </td>
                  <td>{{ p.users?.nickname || '-' }}</td>
                  <td>{{ categoryLabel(p.category) }}</td>
                  <td>{{ formatTime(p.created_at) }}</td>
                  <td>
                    <button class="action-btn pin" @click="togglePin(p)">
                      {{ p.is_pinned ? '取消置顶' : '置顶' }}
                    </button>
                    <button class="action-btn essence" @click="toggleEssence(p)">
                      {{ p.is_essence ? '取消精华' : '精华' }}
                    </button>
                    <button class="action-btn delete" @click="deletePostAdmin(p.id)">
                      删除
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="admin-empty" v-else>暂无帖子</div>
        </div>

        <!-- ========== 用户管理 ========== -->
        <div class="admin-section" v-if="activeTab === 'users'">
          <div class="admin-section-header">
            <h3>用户管理</h3>
            <div class="admin-search-bar">
              <input
                v-model="userSearch"
                type="text"
                placeholder="搜索用户昵称或手机号..."
                @input="onUserSearch"
                class="search-input"
              />
              <span v-if="userSearch" class="search-clear" @click="clearUserSearch">✕</span>
              <span class="admin-count">{{ adminUsers.length }} 位用户</span>
            </div>
          </div>
          <div v-if="adminUsers.length" style="overflow-x:auto;">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>用户</th>
                  <th>联系方式</th>
                  <th>角色</th>
                  <th>状态</th>
                  <th>注册时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="u in adminUsers" :key="u.id" :class="{ 'banned-row': u.is_banned }">
                  <td>
                    <div class="user-cell">
                      <div class="user-cell-avatar">
                        <img v-if="u.avatar_url" :src="u.avatar_url" class="mini-avatar" alt="" />
                        <span v-else class="mini-avatar-placeholder">{{ u.nickname?.charAt(0) || '?' }}</span>
                      </div>
                      <div class="user-cell-info">
                        <span class="user-cell-name">{{ u.nickname || '未命名' }}</span>
                        <span class="user-cell-id" :title="u.id">ID: {{ u.id.slice(0, 8) }}...</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="contact-cell">
                      <span v-if="u.phone" class="contact-item">📱 {{ u.phone }}</span>
                      <span v-if="u.email" class="contact-item">📧 {{ u.email }}</span>
                    </div>
                  </td>
                  <td>
                    <span :class="['role-badge', u.role || 'user']">{{ roleLabel(u.role) }}</span>
                  </td>
                  <td>
                    <span :class="['status-badge', u.is_banned ? 'banned' : 'active']">
                      {{ u.is_banned ? '已封禁' : '正常' }}
                    </span>
                  </td>
                  <td>{{ formatTime(u.created_at) }}</td>
                  <td>
                    <div class="action-btn-group">
                      <button
                        class="action-btn info"
                        @click="viewUserDetail(u)"
                        title="查看详情"
                      >详情</button>
                      <button
                        class="action-btn essence"
                        @click="toggleUserRole(u)"
                        v-if="u.role !== 'admin'"
                      >
                        {{ u.role === 'moderator' ? '降级' : '升版主' }}
                      </button>
                      <button
                        :class="['action-btn', u.is_banned ? 'unban' : 'ban']"
                        @click="toggleUserBan(u)"
                        v-if="u.role !== 'admin'"
                      >
                        {{ u.is_banned ? '解封' : '封禁' }}
                      </button>
                      <button
                        class="action-btn delete"
                        @click="deleteUserAdmin(u.id)"
                        v-if="u.role !== 'admin'"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="admin-empty" v-else>暂无用户</div>
        </div>
      </template>

      <!-- ========== 用户详情弹窗 ========== -->
      <div class="modal-overlay" v-if="showUserDetail" @click.self="showUserDetail = false">
        <div class="modal-content user-detail-modal">
          <div class="modal-header">
            <h2>用户详情</h2>
            <button class="modal-close-btn" @click="showUserDetail = false">&times;</button>
          </div>
          <div class="user-detail-body" v-if="currentUserDetail">
            <div class="user-detail-header">
              <div class="user-detail-avatar">
                <img v-if="currentUserDetail.avatar_url" :src="currentUserDetail.avatar_url" alt="" />
                <span v-else>{{ currentUserDetail.nickname?.charAt(0) || '?' }}</span>
              </div>
              <div class="user-detail-name">
                <h3>{{ currentUserDetail.nickname || '未命名' }}</h3>
                <span :class="['role-badge', currentUserDetail.role || 'user']">{{ roleLabel(currentUserDetail.role) }}</span>
                <span :class="['status-badge', currentUserDetail.is_banned ? 'banned' : 'active']" style="margin-left:4px;">
                  {{ currentUserDetail.is_banned ? '已封禁' : '正常' }}
                </span>
              </div>
            </div>
            <div class="user-detail-grid">
              <div class="detail-item">
                <span class="detail-label">手机号</span>
                <span class="detail-value">{{ currentUserDetail.phone || '-' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">邮箱</span>
                <span class="detail-value">{{ currentUserDetail.email || '-' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">位置</span>
                <span class="detail-value">{{ currentUserDetail.location || '-' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">性别</span>
                <span class="detail-value">{{ genderLabel(currentUserDetail.gender) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">生日</span>
                <span class="detail-value">{{ currentUserDetail.birthday || '-' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">注册时间</span>
                <span class="detail-value">{{ formatTime(currentUserDetail.created_at) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">个性签名</span>
                <span class="detail-value">{{ currentUserDetail.signature || '-' }}</span>
              </div>
              <div class="detail-item" style="grid-column: 1 / -1;">
                <span class="detail-label">个人简介</span>
                <span class="detail-value">{{ currentUserDetail.bio || '-' }}</span>
              </div>
            </div>
            <div class="user-detail-stats">
              <div class="detail-stat">
                <span class="detail-stat-val">{{ currentUserDetail.post_count }}</span>
                <span class="detail-stat-label">帖子</span>
              </div>
              <div class="detail-stat">
                <span class="detail-stat-val">{{ currentUserDetail.comment_count }}</span>
                <span class="detail-stat-label">评论</span>
              </div>
            </div>
            <div class="user-detail-actions">
              <button
                v-if="currentUserDetail.role !== 'admin'"
                :class="['btn', currentUserDetail.is_banned ? 'btn-primary' : 'btn-warning']"
                @click="toggleUserBanFromDetail"
              >
                {{ currentUserDetail.is_banned ? '解封用户' : '封禁用户' }}
              </button>
              <button
                v-if="currentUserDetail.role !== 'admin'"
                class="btn btn-danger"
                @click="deleteUserFromDetail"
              >
                删除用户
              </button>
            </div>
          </div>
          <div class="admin-empty" v-else>加载中...</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import {
  checkIsAdmin, adminGetAllPosts, adminGetAllUsers, adminSearchUsers,
  getCommunityStats, adminTogglePin, adminToggleEssence, deletePost,
  adminUpdateUserRole, adminToggleUserBan, adminDeleteUser, adminGetUserDetail
} from '@/api'
import { formatTime } from '@/utils'

const router = useRouter()
const userStore = useUserStore()

const isAdmin = ref(false)
const activeTab = ref('posts')
const adminPosts = ref([])
const adminUsers = ref([])
const pinnedCount = ref(0)
const userSearch = ref('')
const stats = ref({ postCount: 0, userCount: 0, commentCount: 0 })

// 用户详情弹窗
const showUserDetail = ref(false)
const currentUserDetail = ref(null)

const bannedUserCount = computed(() => adminUsers.value.filter(u => u.is_banned).length)

const tabs = [
  { key: 'posts', label: '📝 帖子管理' },
  { key: 'users', label: '👥 用户管理' }
]

function categoryLabel(value) {
  const map = { learning: '学习心得', culture: '文化创作', qa: '答疑解惑', general: '综合讨论' }
  return map[value] || '综合讨论'
}

function roleLabel(value) {
  const map = { admin: '管理员', moderator: '版主', user: '普通用户' }
  return map[value] || '普通用户'
}

function genderLabel(val) {
  if (val === 'male') return '男'
  if (val === 'female') return '女'
  return '保密'
}

function switchTab(key) {
  activeTab.value = key
  if (key === 'posts') fetchAdminPosts()
  if (key === 'users') fetchAdminUsers()
}

let userSearchTimer = null
function onUserSearch() {
  clearTimeout(userSearchTimer)
  userSearchTimer = setTimeout(() => fetchAdminUsers(), 300)
}

function clearUserSearch() {
  userSearch.value = ''
  fetchAdminUsers()
}

async function fetchAdminPosts() {
  try {
    const result = await adminGetAllPosts({ page: 1, pageSize: 50 })
    adminPosts.value = result.data || []
    pinnedCount.value = adminPosts.value.filter(p => p.is_pinned).length
  } catch (e) {
    console.error('加载帖子列表失败:', e)
  }
}

async function fetchAdminUsers() {
  try {
    let result
    if (userSearch.value.trim()) {
      result = await adminSearchUsers({ search: userSearch.value.trim(), page: 1, pageSize: 50 })
    } else {
      result = await adminGetAllUsers({ page: 1, pageSize: 50 })
    }
    adminUsers.value = result.data || []
  } catch (e) {
    console.error('加载用户列表失败:', e)
  }
}

async function togglePin(post) {
  try {
    await adminTogglePin(post.id, !post.is_pinned)
    post.is_pinned = !post.is_pinned
    pinnedCount.value = adminPosts.value.filter(p => p.is_pinned).length
  } catch (e) {
    console.error('操作失败:', e)
  }
}

async function toggleEssence(post) {
  try {
    await adminToggleEssence(post.id, !post.is_essence)
    post.is_essence = !post.is_essence
  } catch (e) {
    console.error('操作失败:', e)
  }
}

async function deletePostAdmin(postId) {
  if (!confirm('确定删除这篇帖子？此操作不可恢复。')) return
  try {
    await deletePost(postId)
    adminPosts.value = adminPosts.value.filter(p => p.id !== postId)
  } catch (e) {
    console.error('删除失败:', e)
  }
}

async function toggleUserRole(user) {
  const newRole = user.role === 'moderator' ? 'user' : 'moderator'
  const actionLabel = newRole === 'moderator' ? '升级为版主' : '降级为普通用户'
  if (!confirm(`确定将「${user.nickname}」${actionLabel}？`)) return
  try {
    await adminUpdateUserRole(user.id, newRole)
    user.role = newRole
  } catch (e) {
    console.error('操作失败:', e)
  }
}

async function toggleUserBan(user) {
  const newBan = !user.is_banned
  const actionLabel = newBan ? '封禁' : '解封'
  if (!confirm(`确定${actionLabel}用户「${user.nickname}」？${newBan ? '封禁后该用户将无法发帖和评论。' : ''}`)) return
  try {
    await adminToggleUserBan(user.id, newBan)
    user.is_banned = newBan
  } catch (e) {
    console.error('操作失败:', e)
  }
}

async function deleteUserAdmin(userId) {
  const user = adminUsers.value.find(u => u.id === userId)
  if (!confirm(`确定删除用户「${user?.nickname || userId}」？此操作不可恢复，用户的所有帖子也将被删除。`)) return
  try {
    await adminDeleteUser(userId)
    adminUsers.value = adminUsers.value.filter(u => u.id !== userId)
  } catch (e) {
    console.error('删除失败:', e)
  }
}

// 用户详情
async function viewUserDetail(user) {
  showUserDetail.value = true
  currentUserDetail.value = null
  try {
    const detail = await adminGetUserDetail(user.id)
    currentUserDetail.value = detail
  } catch (e) {
    console.error('加载用户详情失败:', e)
  }
}

async function toggleUserBanFromDetail() {
  if (!currentUserDetail.value) return
  await toggleUserBan(currentUserDetail.value)
  // 同步更新列表中的状态
  const listUser = adminUsers.value.find(u => u.id === currentUserDetail.value.id)
  if (listUser) listUser.is_banned = currentUserDetail.value.is_banned
}

async function deleteUserFromDetail() {
  if (!currentUserDetail.value) return
  await deleteUserAdmin(currentUserDetail.value.id)
  showUserDetail.value = false
}

onMounted(async () => {
  if (!userStore.user?.id) {
    router.push('/')
    return
  }
  isAdmin.value = await checkIsAdmin(userStore.user.id)
  if (isAdmin.value) {
    const statsData = await getCommunityStats()
    stats.value = statsData
    fetchAdminPosts()
  }
})
</script>

<style scoped>
/* ========== 空状态 ========== */
.empty-state {
  text-align: center; padding: 80px 20px;
}
.empty-state .empty-icon {
  font-size: 64px; display: block; margin-bottom: 16px;
}
.empty-state p {
  color: #aaa; margin-bottom: 24px;
}

/* ========== 统计卡片 ========== */
.admin-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.admin-stat-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 20px 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  transition: all 0.3s;
}
.admin-stat-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(102, 126, 234, 0.3);
}

.stat-icon { font-size: 28px; }
.stat-value {
  font-size: 28px; font-weight: bold;
  color: #fff;
}
.stat-label { color: #888; font-size: 13px; }

/* ========== 导航标签 ========== */
.admin-nav {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  flex-wrap: wrap;
}

.admin-nav .admin-tab {
  flex: 1;
  min-width: 100px;
  padding: 0.7rem 1rem;
  border-radius: 9px;
  text-align: center;
  color: #aaa;
  font-size: 0.9rem;
  font-weight: 500;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.admin-nav .admin-tab:hover {
  color: #fff;
  background: rgba(102, 126, 234, 0.1);
}

.admin-nav .admin-tab.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  font-weight: 600;
}

/* ========== 区块 ========== */
.admin-section {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 1.5rem;
  animation: fadeIn 0.3s ease;
}

.admin-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 12px;
}
.admin-section-header h3 {
  color: #ccc;
  margin: 0;
}

.admin-search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
}

.search-input {
  padding: 8px 32px 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 13px;
  width: 220px;
  outline: none;
}
.search-input:focus {
  border-color: rgba(102, 126, 234, 0.5);
}
.search-input::placeholder { color: #666; }

.search-clear {
  position: absolute;
  right: 100px;
  color: #666;
  cursor: pointer;
  font-size: 14px;
}
.search-clear:hover { color: #fff; }

.admin-count {
  color: #666;
  font-size: 13px;
  white-space: nowrap;
}

/* ========== 表格 ========== */
.admin-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.admin-table th {
  text-align: left;
  padding: 0.8rem 0.6rem;
  color: #888;
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  white-space: nowrap;
}

.admin-table td {
  padding: 0.7rem 0.6rem;
  color: #bbb;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  vertical-align: middle;
}

.admin-table tr:hover td {
  background: rgba(255, 255, 255, 0.02);
}

.admin-table tr.banned-row td {
  opacity: 0.6;
  text-decoration: line-through;
}

/* 用户单元格 */
.user-cell {
  display: flex; align-items: center; gap: 10px;
}
.user-cell-avatar {
  width: 36px; height: 36px;
  flex-shrink: 0;
}
.mini-avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  object-fit: cover;
}
.mini-avatar-placeholder {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 14px; font-weight: bold;
}
.user-cell-info {
  display: flex; flex-direction: column;
}
.user-cell-name {
  color: #fff; font-size: 14px;
}
.user-cell-id {
  color: #555; font-size: 11px;
}

.contact-cell {
  display: flex; flex-direction: column; gap: 2px;
}
.contact-item { font-size: 12px; color: #888; }

/* 操作按钮 */
.action-btn-group {
  display: flex; gap: 4px; flex-wrap: wrap;
}

.action-btn {
  padding: 0.3rem 0.7rem;
  border-radius: 6px;
  border: 1px solid;
  background: transparent;
  cursor: pointer;
  font-size: 0.75rem;
  transition: all 0.2s;
  font-family: inherit;
  white-space: nowrap;
}

.action-btn.pin { color: #ffa502; border-color: rgba(255, 165, 0, 0.3); }
.action-btn.pin:hover { background: rgba(255, 165, 0, 0.1); }

.action-btn.essence { color: #667eea; border-color: rgba(102, 126, 234, 0.3); }
.action-btn.essence:hover { background: rgba(102, 126, 234, 0.1); }

.action-btn.delete { color: #ff6b6b; border-color: rgba(255, 107, 107, 0.3); }
.action-btn.delete:hover { background: rgba(255, 107, 107, 0.1); }

.action-btn.ban { color: #ffa502; border-color: rgba(255, 165, 0, 0.3); }
.action-btn.ban:hover { background: rgba(255, 165, 0, 0.1); }

.action-btn.unban { color: #4ade80; border-color: rgba(74, 222, 128, 0.3); }
.action-btn.unban:hover { background: rgba(74, 222, 128, 0.1); }

.action-btn.info { color: #60a5fa; border-color: rgba(96, 165, 250, 0.3); }
.action-btn.info:hover { background: rgba(96, 165, 250, 0.1); }

/* 角色徽章 */
.role-badge {
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}
.role-badge.admin { background: rgba(255, 107, 107, 0.15); color: #ff6b6b; }
.role-badge.moderator { background: rgba(74, 222, 128, 0.15); color: #4ade80; }
.role-badge.user { background: rgba(102, 126, 234, 0.15); color: #667eea; }

/* 状态徽章 */
.status-badge {
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}
.status-badge.active { background: rgba(74, 222, 128, 0.1); color: #4ade80; }
.status-badge.banned { background: rgba(255, 107, 107, 0.1); color: #ff6b6b; }

.admin-empty {
  text-align: center; padding: 40px 20px;
  color: #666;
}

/* ========== 用户详情弹窗 ========== */
.modal-overlay {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(0, 0, 0, 0.7);
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(4px);
}

.user-detail-modal {
  max-width: 560px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  background: linear-gradient(135deg, #1a1a3e, #0d0d2b);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 32px;
}

.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 24px;
}
.modal-header h2 {
  color: #fff; margin: 0; font-size: 20px;
}
.modal-close-btn {
  background: none; border: none; color: #fff;
  font-size: 28px; cursor: pointer;
}

.user-detail-header {
  display: flex; align-items: center; gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.user-detail-avatar {
  width: 64px; height: 64px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}
.user-detail-avatar img {
  width: 100%; height: 100%;
  object-fit: cover;
}
.user-detail-avatar span {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff; font-size: 24px; font-weight: bold;
}

.user-detail-name h3 {
  color: #fff; margin: 0 0 6px;
}

.user-detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
}
.detail-item {
  display: flex; flex-direction: column; gap: 4px;
}
.detail-label {
  color: #666; font-size: 12px;
}
.detail-value {
  color: #ccc; font-size: 14px;
}

.user-detail-stats {
  display: flex; gap: 24px;
  padding: 16px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 20px;
}
.detail-stat { text-align: center; }
.detail-stat-val { display: block; color: #fff; font-size: 22px; font-weight: bold; }
.detail-stat-label { display: block; color: #666; font-size: 12px; }

.user-detail-actions {
  display: flex; gap: 12px;
}

.btn-warning {
  background: rgba(255, 165, 0, 0.15);
  color: #ffa502;
  border: 1px solid rgba(255, 165, 0, 0.3);
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}
.btn-warning:hover { background: rgba(255, 165, 0, 0.25); }

.btn-danger {
  background: rgba(255, 107, 107, 0.15);
  color: #ff6b6b;
  border: 1px solid rgba(255, 107, 107, 0.3);
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}
.btn-danger:hover { background: rgba(255, 107, 107, 0.25); }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ========== 响应式 ========== */
@media (max-width: 768px) {
  .admin-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  .admin-stat-card {
    padding: 14px 10px;
  }
  .stat-value { font-size: 22px; }
  .admin-section { padding: 1rem; }
  .admin-section-header { flex-direction: column; align-items: flex-start; }
  .search-input { width: 100%; }
  .user-detail-grid { grid-template-columns: 1fr; }
  .user-detail-actions { flex-direction: column; }
  .action-btn-group { flex-direction: column; }
}
</style>