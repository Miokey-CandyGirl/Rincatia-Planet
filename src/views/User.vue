<template>
  <div class="user-page">
    <div class="container">
      <h1 class="page-title">个人中心</h1>

      <div class="user-layout">
        <!-- 侧边栏 -->
        <aside class="user-sidebar">
          <div class="user-profile-card">
            <div class="profile-avatar">{{ userStore.user?.nickname?.charAt(0) || '琳' }}</div>
            <h3>{{ userStore.user?.nickname || '琳凯蒂亚居民' }}</h3>
            <p class="profile-phone">{{ userStore.user?.phone || '' }}</p>
            <p class="profile-bio">{{ userStore.user?.bio || '这个人很懒，什么都没写...' }}</p>
            <button class="btn btn-outline btn-small" @click="showEditProfile = true">编辑资料</button>
          </div>

          <nav class="user-nav">
            <button :class="{ active: activeTab === 'posts' }" @click="activeTab = 'posts'">
              我的帖子
            </button>
            <button :class="{ active: activeTab === 'comments' }" @click="activeTab = 'comments'">
              我的评论
            </button>
            <button :class="{ active: activeTab === 'favorites' }" @click="activeTab = 'favorites'">
              我的收藏
            </button>
            <button :class="{ active: activeTab === 'learning' }" @click="activeTab = 'learning'">
              学习记录
            </button>
            <button :class="{ active: activeTab === 'likes' }" @click="activeTab = 'likes'">
              点赞记录
            </button>
          </nav>
        </aside>

        <!-- 主内容 -->
        <div class="user-main">
          <!-- 我的帖子 -->
          <section v-if="activeTab === 'posts'">
            <h2>我的帖子</h2>
            <PostCard v-for="post in myPosts" :key="post.id" :post="post" />
            <div v-if="myPosts.length === 0" class="empty">暂无帖子</div>
          </section>

          <!-- 我的评论 -->
          <section v-if="activeTab === 'comments'">
            <h2>我的评论</h2>
            <CommentItem
              v-for="comment in myComments"
              :key="comment.id"
              :comment="comment"
              :current-user-id="userStore.user?.id"
              @delete="handleDeleteComment"
            />
            <div v-if="myComments.length === 0" class="empty">暂无评论</div>
          </section>

          <!-- 我的收藏 -->
          <section v-if="activeTab === 'favorites'">
            <h2>我的收藏</h2>
            <PostCard v-for="post in myFavorites" :key="post.id" :post="post" />
            <div v-if="myFavorites.length === 0" class="empty">暂无收藏</div>
          </section>

          <!-- 学习记录 -->
          <section v-if="activeTab === 'learning'">
            <h2>学习记录</h2>
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
            <div v-if="learningRecords.length === 0" class="empty">暂无学习记录</div>
          </section>

          <!-- 点赞记录 -->
          <section v-if="activeTab === 'likes'">
            <h2>点赞记录</h2>
            <PostCard v-for="post in likedPosts" :key="post.id" :post="post" />
            <div v-if="likedPosts.length === 0" class="empty">暂无点赞记录</div>
          </section>
        </div>
      </div>

      <!-- 编辑资料弹窗 -->
      <div class="modal-overlay" v-if="showEditProfile" @click.self="showEditProfile = false">
        <div class="modal-content">
          <h2>编辑个人资料</h2>
          <form @submit.prevent="handleSaveProfile">
            <div class="form-group">
              <label>昵称</label>
              <input type="text" v-model="editForm.nickname" maxlength="20" />
            </div>
            <div class="form-group">
              <label>个人简介</label>
              <textarea v-model="editForm.bio" rows="3" maxlength="200"></textarea>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary" :disabled="saving">
                {{ saving ? '保存中...' : '保存' }}
              </button>
              <button type="button" class="btn btn-outline" @click="showEditProfile = false">取消</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useUserStore } from '@/store/user'
import PostCard from '@/components/PostCard.vue'
import CommentItem from '@/components/CommentItem.vue'

const userStore = useUserStore()
const activeTab = ref('posts')
const showEditProfile = ref(false)
const saving = ref(false)

const editForm = reactive({
  nickname: userStore.user?.nickname || '',
  bio: userStore.user?.bio || ''
})

const myPosts = ref([])
const myComments = ref([])
const myFavorites = ref([])
const likedPosts = ref([])
const learningRecords = ref([])

async function handleSaveProfile() {
  saving.value = true
  try {
    await userStore.updateProfile({ nickname: editForm.nickname, bio: editForm.bio })
    showEditProfile.value = false
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }
}

function handleDeleteComment(commentId) {
  console.log('删除评论:', commentId)
}
</script>

<style scoped>
.user-layout { display: flex; gap: 32px; margin-top: 24px; }
.user-sidebar { width: 240px; flex-shrink: 0; }
.user-main { flex: 1; min-width: 0; }
.user-profile-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px; padding: 24px;
  text-align: center; margin-bottom: 16px;
}
.profile-avatar {
  width: 64px; height: 64px; border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; color: #fff; font-weight: bold;
  margin: 0 auto 12px;
}
.profile-phone { color: #666; font-size: 13px; margin-bottom: 8px; }
.profile-bio { color: #999; font-size: 13px; margin-bottom: 16px; }
.user-nav { display: flex; flex-direction: column; gap: 4px; }
.user-nav button {
  text-align: left; padding: 10px 16px;
  background: none; border: none; border-radius: 8px;
  color: #ccc; cursor: pointer; font-size: 14px;
  transition: all 0.2s;
}
.user-nav button:hover { background: rgba(255, 255, 255, 0.05); }
.user-nav button.active { background: rgba(102, 126, 234, 0.2); color: #667eea; }
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
.modal-overlay {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(0, 0, 0, 0.7);
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(4px);
}
.modal-content {
  background: linear-gradient(135deg, #1a1a3e, #0d0d2b);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px; padding: 32px;
  max-width: 420px; width: 90%;
}
.form-group { margin-bottom: 16px; }
.form-group label { display: block; margin-bottom: 6px; color: #ccc; font-size: 14px; }
.form-group input, .form-group textarea {
  width: 100%; padding: 10px 14px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff; outline: none; box-sizing: border-box;
}
.form-actions { display: flex; gap: 12px; margin-top: 20px; }
</style>