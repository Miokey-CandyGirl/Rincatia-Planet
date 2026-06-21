<template>
  <div class="user-page">
    <div class="container">
      <h1 class="page-title">个人中心</h1>

      <div class="user-layout">
        <!-- 侧边栏 - 个人资料卡 -->
        <aside class="user-sidebar">
          <div class="user-profile-card">
            <div class="profile-avatar-wrapper" @click="showEditProfile = true" title="点击更换头像">
              <img
                v-if="userStore.user?.avatar_url"
                :src="userStore.user.avatar_url"
                class="profile-avatar-img"
                alt="头像"
              />
              <div v-else class="profile-avatar-placeholder">
                {{ userStore.user?.nickname?.charAt(0) || '琳' }}
              </div>
              <div class="avatar-edit-hint">📷</div>
            </div>

            <h3 class="profile-name">{{ userStore.user?.nickname || '琳凯蒂亚居民' }}</h3>

            <div class="profile-role-tag" v-if="userStore.user?.role === 'admin'">
              <span class="role-dot admin"></span>管理员
            </div>
            <div class="profile-role-tag" v-else-if="userStore.user?.role === 'moderator'">
              <span class="role-dot moderator"></span>版主
            </div>

            <div class="profile-info-list">
              <div class="profile-info-item" v-if="userStore.user?.phone">
                <span class="info-icon">📱</span>
                <span>{{ userStore.user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') }}</span>
              </div>
              <div class="profile-info-item" v-if="userStore.user?.location">
                <span class="info-icon">📍</span>
                <span>{{ userStore.user.location }}</span>
              </div>
              <div class="profile-info-item" v-if="userStore.user?.gender">
                <span class="info-icon">{{ userStore.user.gender === 'male' ? '👨' : userStore.user.gender === 'female' ? '👩' : '👤' }}</span>
                <span>{{ genderLabel(userStore.user.gender) }}</span>
              </div>
              <div class="profile-info-item" v-if="userStore.user?.birthday">
                <span class="info-icon">🎂</span>
                <span>{{ userStore.user.birthday }}</span>
              </div>
              <div class="profile-info-item" v-if="userStore.user?.created_at">
                <span class="info-icon">📅</span>
                <span>加入于 {{ formatDate(userStore.user.created_at) }}</span>
              </div>
            </div>

            <p class="profile-signature" v-if="userStore.user?.signature">
              "{{ userStore.user.signature }}"
            </p>
            <p class="profile-bio">{{ userStore.user?.bio || '这个人很懒，什么都没写...' }}</p>

            <div class="profile-stats-mini">
              <div class="stat-mini">
                <span class="stat-mini-val">{{ myPosts.length }}</span>
                <span class="stat-mini-label">帖子</span>
              </div>
              <div class="stat-mini">
                <span class="stat-mini-val">{{ myComments.length }}</span>
                <span class="stat-mini-label">评论</span>
              </div>
              <div class="stat-mini">
                <span class="stat-mini-val">{{ myFavorites.length }}</span>
                <span class="stat-mini-label">收藏</span>
              </div>
            </div>

            <button class="btn btn-primary btn-full" @click="showEditProfile = true">
              ✏️ 编辑个人资料
            </button>
          </div>

          <nav class="user-nav">
            <button :class="{ active: activeTab === 'posts' }" @click="activeTab = 'posts'">
              📝 我的帖子
            </button>
            <button :class="{ active: activeTab === 'comments' }" @click="activeTab = 'comments'">
              💬 我的评论
            </button>
            <button :class="{ active: activeTab === 'favorites' }" @click="activeTab = 'favorites'">
              ⭐ 我的收藏
            </button>
            <button :class="{ active: activeTab === 'learning' }" @click="activeTab = 'learning'">
              📖 学习记录
            </button>
            <button :class="{ active: activeTab === 'likes' }" @click="activeTab = 'likes'">
              ❤️ 点赞记录
            </button>
          </nav>
        </aside>

        <!-- 主内容区 -->
        <div class="user-main">
          <section v-if="activeTab === 'posts'">
            <h2 class="section-title">我的帖子</h2>
            <PostCard v-for="post in myPosts" :key="post.id" :post="post" />
            <div v-if="myPosts.length === 0" class="empty">暂无帖子，快去社区发帖吧！</div>
          </section>

          <section v-if="activeTab === 'comments'">
            <h2 class="section-title">我的评论</h2>
            <CommentItem
              v-for="comment in myComments"
              :key="comment.id"
              :comment="comment"
              :current-user-id="userStore.user?.id"
              @delete="handleDeleteComment"
            />
            <div v-if="myComments.length === 0" class="empty">暂无评论</div>
          </section>

          <section v-if="activeTab === 'favorites'">
            <h2 class="section-title">我的收藏</h2>
            <PostCard v-for="post in myFavorites" :key="post.id" :post="post" />
            <div v-if="myFavorites.length === 0" class="empty">暂无收藏</div>
          </section>

          <section v-if="activeTab === 'learning'">
            <h2 class="section-title">学习记录</h2>
            <div class="learning-list">
              <div class="learning-item" v-for="record in learningRecords" :key="record.id">
                <span class="learning-type">{{ record.content_type === 'grammar' ? '语法' : '词汇' }}</span>
                <span class="learning-name">{{ record.content_id }}</span>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: record.progress + '%' }"></div>
                </div>
                <span class="progress-text">{{ record.progress }}%</span>
              </div>
            </div>
            <div v-if="learningRecords.length === 0" class="empty">暂无学习记录，开始学习琳凯蒂亚语吧！</div>
          </section>

          <section v-if="activeTab === 'likes'">
            <h2 class="section-title">点赞记录</h2>
            <PostCard v-for="post in likedPosts" :key="post.id" :post="post" />
            <div v-if="likedPosts.length === 0" class="empty">暂无点赞记录</div>
          </section>
        </div>
      </div>

      <!-- ========== 编辑资料弹窗 ========== -->
      <div class="modal-overlay" v-if="showEditProfile" @click.self="showEditProfile = false">
        <div class="modal-content profile-edit-modal">
          <div class="modal-header">
            <h2>编辑个人资料</h2>
            <button class="modal-close-btn" @click="showEditProfile = false">&times;</button>
          </div>

          <form @submit.prevent="handleSaveProfile" class="profile-form">
            <!-- 头像编辑 -->
            <div class="form-group avatar-edit-group">
              <label>头像</label>
              <div class="avatar-edit-area">
                <div class="avatar-preview" @click="triggerAvatarUpload">
                  <img
                    v-if="avatarPreview || editForm.avatar_url"
                    :src="avatarPreview || editForm.avatar_url"
                    class="avatar-preview-img"
                    alt="头像预览"
                  />
                  <div v-else class="avatar-preview-placeholder">
                    {{ editForm.nickname?.charAt(0) || '琳' }}
                  </div>
                  <div class="avatar-upload-overlay">
                    <span>📷 更换头像</span>
                  </div>
                </div>
                <input
                  ref="avatarInput"
                  type="file"
                  accept="image/*"
                  style="display:none"
                  @change="handleAvatarChange"
                />
                <p class="avatar-hint">支持 JPG、PNG、GIF，最大 2MB</p>
              </div>
            </div>

            <!-- 昵称 -->
            <div class="form-group">
              <label>昵称 <span class="required">*</span></label>
              <input
                type="text"
                v-model="editForm.nickname"
                maxlength="20"
                placeholder="给自己取个名字吧"
              />
              <span class="char-count">{{ editForm.nickname.length }}/20</span>
            </div>

            <!-- 个性签名 -->
            <div class="form-group">
              <label>个性签名</label>
              <input
                type="text"
                v-model="editForm.signature"
                maxlength="50"
                placeholder="一句话介绍自己"
              />
              <span class="char-count">{{ editForm.signature.length }}/50</span>
            </div>

            <!-- 个人简介 -->
            <div class="form-group">
              <label>个人简介</label>
              <textarea
                v-model="editForm.bio"
                rows="3"
                maxlength="200"
                placeholder="介绍一下自己吧..."
              ></textarea>
              <span class="char-count">{{ editForm.bio.length }}/200</span>
            </div>

            <!-- 地理位置 -->
            <div class="form-group">
              <label>地理位置</label>
              <input
                type="text"
                v-model="editForm.location"
                maxlength="50"
                placeholder="例如：琳凯蒂亚星球·青竹区"
              />
            </div>

            <!-- 性别 & 生日 -->
            <div class="form-row">
              <div class="form-group form-half">
                <label>性别</label>
                <select v-model="editForm.gender">
                  <option value="">保密</option>
                  <option value="male">男</option>
                  <option value="female">女</option>
                </select>
              </div>
              <div class="form-group form-half">
                <label>生日</label>
                <input type="date" v-model="editForm.birthday" />
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="form-actions">
              <button type="submit" class="btn btn-primary" :disabled="saving || !editForm.nickname.trim()">
                {{ saving ? '保存中...' : '💾 保存资料' }}
              </button>
              <button type="button" class="btn btn-outline" @click="showEditProfile = false">
                取消
              </button>
            </div>

            <p v-if="saveMsg" :class="['save-msg', saveSuccess ? 'success' : 'error']">{{ saveMsg }}</p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/store/user'
import { uploadAvatar } from '@/api'
import PostCard from '@/components/PostCard.vue'
import CommentItem from '@/components/CommentItem.vue'

const userStore = useUserStore()
const activeTab = ref('posts')
const showEditProfile = ref(false)
const saving = ref(false)
const saveMsg = ref('')
const saveSuccess = ref(false)
const avatarInput = ref(null)
const avatarPreview = ref('')

const editForm = reactive({
  nickname: '',
  bio: '',
  signature: '',
  location: '',
  gender: '',
  birthday: '',
  avatar_url: ''
})

const myPosts = ref([])
const myComments = ref([])
const myFavorites = ref([])
const likedPosts = ref([])
const learningRecords = ref([])

function genderLabel(val) {
  if (val === 'male') return '男'
  if (val === 'female') return '女'
  return '保密'
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

function initEditForm() {
  const u = userStore.user
  editForm.nickname = u?.nickname || ''
  editForm.bio = u?.bio || ''
  editForm.signature = u?.signature || ''
  editForm.location = u?.location || ''
  editForm.gender = u?.gender || ''
  editForm.birthday = u?.birthday || ''
  editForm.avatar_url = u?.avatar_url || ''
  avatarPreview.value = ''
  saveMsg.value = ''
}

function triggerAvatarUpload() {
  avatarInput.value?.click()
}

async function handleAvatarChange(e) {
  const file = e.target.files?.[0]
  if (!file) return

  // 校验文件大小 (2MB)
  if (file.size > 2 * 1024 * 1024) {
    saveMsg.value = '头像文件不能超过 2MB'
    saveSuccess.value = false
    return
  }

  // 预览
  const reader = new FileReader()
  reader.onload = (ev) => { avatarPreview.value = ev.target.result }
  reader.readAsDataURL(file)

  // 上传头像
  try {
    saveMsg.value = '头像上传中...'
    saveSuccess.value = true
    const result = await uploadAvatar({ userId: userStore.user.id, file })
    editForm.avatar_url = result.avatar_url
    userStore.user.avatar_url = result.avatar_url
    saveMsg.value = '头像已更新'
    saveSuccess.value = true
  } catch (e) {
    saveMsg.value = '头像上传失败，请稍后重试'
    saveSuccess.value = false
    console.error('头像上传失败:', e)
  }
}

async function handleSaveProfile() {
  if (!editForm.nickname.trim()) return
  saving.value = true
  saveMsg.value = ''
  try {
    await userStore.updateProfile({
      nickname: editForm.nickname.trim(),
      bio: editForm.bio,
      signature: editForm.signature,
      location: editForm.location,
      gender: editForm.gender,
      birthday: editForm.birthday
    })
    saveMsg.value = '资料保存成功！'
    saveSuccess.value = true
    setTimeout(() => { showEditProfile.value = false }, 800)
  } catch (e) {
    saveMsg.value = '保存失败，请稍后重试'
    saveSuccess.value = false
    console.error('保存资料失败:', e)
  } finally {
    saving.value = false
  }
}

function handleDeleteComment(commentId) {
  myComments.value = myComments.value.filter(c => c.id !== commentId)
}

onMounted(() => {
  initEditForm()
})
</script>

<style scoped>
/* ========== 布局 ========== */
.user-layout { display: flex; gap: 32px; margin-top: 24px; }
.user-sidebar { width: 280px; flex-shrink: 0; }
.user-main { flex: 1; min-width: 0; }

/* ========== 个人资料卡 ========== */
.user-profile-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px; padding: 24px;
  text-align: center; margin-bottom: 16px;
}

.profile-avatar-wrapper {
  position: relative;
  width: 80px; height: 80px;
  margin: 0 auto 12px;
  cursor: pointer;
  border-radius: 50%;
  overflow: hidden;
}

.profile-avatar-img {
  width: 100%; height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.profile-avatar-placeholder {
  width: 100%; height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex; align-items: center; justify-content: center;
  font-size: 32px; color: #fff; font-weight: bold;
}

.avatar-edit-hint {
  position: absolute; bottom: 0; left: 0; right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 12px;
  padding: 4px 0;
  opacity: 0;
  transition: opacity 0.2s;
}
.profile-avatar-wrapper:hover .avatar-edit-hint { opacity: 1; }

.profile-name {
  color: #fff; font-size: 18px; margin: 0 0 8px;
}

.profile-role-tag {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 3px 12px;
  border-radius: 20px;
  font-size: 12px; margin-bottom: 12px;
  background: rgba(102, 126, 234, 0.15);
  color: #667eea;
}

.role-dot {
  width: 8px; height: 8px; border-radius: 50%;
}
.role-dot.admin { background: #ff6b6b; }
.role-dot.moderator { background: #4ade80; }

.profile-info-list {
  text-align: left;
  margin-bottom: 12px;
}

.profile-info-item {
  display: flex; align-items: center; gap: 8px;
  padding: 4px 0;
  color: #aaa; font-size: 13px;
}
.info-icon { font-size: 14px; flex-shrink: 0; }

.profile-signature {
  color: #ffd700; font-size: 13px;
  font-style: italic; margin-bottom: 8px;
}

.profile-bio {
  color: #888; font-size: 13px;
  margin-bottom: 16px; line-height: 1.6;
}

.profile-stats-mini {
  display: flex; justify-content: center; gap: 24px;
  margin-bottom: 16px;
  padding: 12px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.stat-mini { text-align: center; }
.stat-mini-val { display: block; color: #fff; font-size: 18px; font-weight: bold; }
.stat-mini-label { display: block; color: #666; font-size: 11px; }

/* ========== 导航 ========== */
.user-nav { display: flex; flex-direction: column; gap: 4px; }
.user-nav button {
  text-align: left; padding: 10px 16px;
  background: none; border: none; border-radius: 8px;
  color: #ccc; cursor: pointer; font-size: 14px;
  transition: all 0.2s;
}
.user-nav button:hover { background: rgba(255, 255, 255, 0.05); }
.user-nav button.active { background: rgba(102, 126, 234, 0.2); color: #667eea; }

/* ========== 主内容 ========== */
.section-title { color: #fff; margin-bottom: 16px; font-size: 18px; }
.empty { text-align: center; padding: 40px 0; color: #666; }

.learning-list { display: flex; flex-direction: column; gap: 12px; }
.learning-item {
  display: flex; align-items: center; gap: 12px;
  padding: 12px; background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
}
.learning-type { padding: 2px 8px; background: rgba(102, 126, 234, 0.2); border-radius: 4px; font-size: 12px; color: #667eea; }
.learning-name { flex: 1; color: #ccc; font-size: 14px; }
.progress-bar { width: 100px; height: 6px; background: rgba(255, 255, 255, 0.1); border-radius: 3px; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg, #667eea, #764ba2); border-radius: 3px; transition: width 0.3s; }
.progress-text { font-size: 12px; color: #888; width: 36px; text-align: right; }

/* ========== 编辑资料弹窗 ========== */
.modal-overlay {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(0, 0, 0, 0.7);
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(4px);
}
.profile-edit-modal {
  max-width: 500px; width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  background: linear-gradient(135deg, #1a1a3e, #0d0d2b);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px; padding: 32px;
}
.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 24px;
}
.modal-header h2 { color: #fff; margin: 0; font-size: 20px; }
.modal-close-btn {
  background: none; border: none; color: #fff;
  font-size: 28px; cursor: pointer;
}

.profile-form .form-group {
  margin-bottom: 18px; position: relative;
}
.profile-form .form-group label {
  display: block; margin-bottom: 6px; color: #ccc; font-size: 14px;
}
.required { color: #ff6b6b; }
.profile-form .form-group input,
.profile-form .form-group textarea,
.profile-form .form-group select {
  width: 100%; padding: 10px 14px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff; outline: none; box-sizing: border-box;
  font-size: 14px;
}
.profile-form .form-group input:focus,
.profile-form .form-group textarea:focus,
.profile-form .form-group select:focus {
  border-color: rgba(102, 126, 234, 0.5);
}
.profile-form .form-group select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23aaa' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
}
.profile-form .form-group select option {
  background: #1a1a3e; color: #fff;
}

.char-count {
  position: absolute; right: 8px; bottom: 8px;
  font-size: 11px; color: #666;
}
.form-row {
  display: flex; gap: 16px;
}
.form-half { flex: 1; }

.avatar-edit-group { text-align: center; }
.avatar-edit-area {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
}
.avatar-preview {
  position: relative;
  width: 96px; height: 96px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid rgba(255, 255, 255, 0.1);
}
.avatar-preview-img {
  width: 100%; height: 100%;
  object-fit: cover;
}
.avatar-preview-placeholder {
  width: 100%; height: 100%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex; align-items: center; justify-content: center;
  font-size: 36px; color: #fff; font-weight: bold;
}
.avatar-upload-overlay {
  position: absolute; inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 13px;
  opacity: 0; transition: opacity 0.2s;
}
.avatar-preview:hover .avatar-upload-overlay { opacity: 1; }
.avatar-hint { color: #666; font-size: 12px; }

.form-actions {
  display: flex; gap: 12px; margin-top: 24px;
}
.btn-full { width: 100%; }

.save-msg {
  text-align: center; margin-top: 12px; font-size: 13px;
}
.save-msg.success { color: #4ade80; }
.save-msg.error { color: #ff6b6b; }

/* ========== 响应式 ========== */
@media (max-width: 768px) {
  .user-layout { flex-direction: column; }
  .user-sidebar { width: 100%; }
  .form-row { flex-direction: column; gap: 0; }
  .profile-edit-modal { padding: 20px; }
}
</style>