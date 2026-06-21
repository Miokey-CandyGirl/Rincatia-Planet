<template>
  <div class="post-editor-page">
    <div class="container">
      <h1 class="page-title">{{ isEdit ? '编辑帖子' : '发布新帖' }}</h1>

      <form @submit.prevent="handleSubmit" class="editor-form">
        <div class="form-group">
          <label>标题</label>
          <input
            type="text"
            v-model="title"
            placeholder="请输入帖子标题"
            maxlength="100"
            required
          />
        </div>

        <div class="form-group">
          <label>内容</label>
          <textarea
            v-model="content"
            placeholder="请输入帖子内容..."
            rows="10"
            maxlength="10000"
            required
          ></textarea>
          <span class="char-count">{{ content.length }}/10000</span>
        </div>

        <div class="form-group">
          <label>附件（可选）</label>
          <FileUploader @update:files="files = $event" />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="submitting || !title.trim() || !content.trim()">
            {{ submitting ? '发布中...' : isEdit ? '保存修改' : '发布帖子' }}
          </button>
          <router-link to="/community" class="btn btn-outline">取消</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { createPost, updatePost, getPostById } from '@/api'
import FileUploader from '@/components/FileUploader.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const isEdit = !!route.params.id
const title = ref('')
const content = ref('')
const files = ref([])
const submitting = ref(false)

onMounted(async () => {
  if (isEdit) {
    try {
      const post = await getPostById(route.params.id)
      title.value = post.title
      content.value = post.content
    } catch (e) {
      console.error(e)
      router.push('/community')
    }
  }
})

async function handleSubmit() {
  if (submitting.value || !title.value.trim() || !content.value.trim()) return
  submitting.value = true

  try {
    const payload = {
      title: title.value.trim(),
      content: content.value.trim(),
      userId: userStore.user.id
    }

    if (isEdit) {
      await updatePost(route.params.id, payload)
    } else {
      const newPost = await createPost(payload)
      // TODO: 上传附件
      router.push(`/community/post/${newPost.id}`)
      return
    }
    router.push(`/community/post/${route.params.id}`)
  } catch (e) {
    console.error(e)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.editor-form { max-width: 800px; }
.form-group { margin-bottom: 20px; }
.form-group label { display: block; margin-bottom: 8px; color: #ccc; font-size: 14px; }
.form-group input, .form-group textarea {
  width: 100%; padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  color: #fff; outline: none;
  font-size: 14px; box-sizing: border-box;
  transition: border-color 0.3s;
}
.form-group input:focus, .form-group textarea:focus {
  border-color: rgba(255, 255, 255, 0.3);
}
.form-group textarea { resize: vertical; line-height: 1.6; }
.char-count { font-size: 12px; color: #666; display: block; text-align: right; margin-top: 4px; }
.form-actions { display: flex; gap: 12px; }
</style>