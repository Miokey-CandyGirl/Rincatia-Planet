<template>
  <div class="post-editor-page">
    <div class="container">
      <router-link to="/community" class="back-link">← 返回社区</router-link>
      <h1 class="page-title">{{ isEdit ? '编辑帖子' : '发布新帖' }}</h1>

      <form @submit.prevent="handleSubmit" class="editor-form">
        <div class="form-group">
          <label>分类</label>
          <select v-model="category">
            <option value="general">💬 综合讨论</option>
            <option value="learning">📝 学习心得</option>
            <option value="culture">🎨 文化创作</option>
            <option value="qa">❓ 答疑解惑</option>
          </select>
        </div>

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
          <label>附件（可选，支持图片/PDF/文档）</label>
          <FileUploader @update:files="files = $event" />
        </div>

        <div class="form-actions">
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="submitting || !title.trim() || !content.trim()"
          >
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
import { createPost, updatePost, getPostById, uploadFile } from '@/api'
import FileUploader from '@/components/FileUploader.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const isEdit = !!route.params.id
const title = ref('')
const content = ref('')
const category = ref('general')
const files = ref([])
const submitting = ref(false)

onMounted(async () => {
  if (isEdit) {
    try {
      const post = await getPostById(route.params.id)
      if (post.user_id !== userStore.user?.id) {
        router.push('/community')
        return
      }
      title.value = post.title
      content.value = post.content
      category.value = post.category || 'general'
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
    let postId = route.params.id

    if (isEdit) {
      await updatePost(route.params.id, {
        title: title.value.trim(),
        content: content.value.trim(),
        category: category.value
      })
    } else {
      const newPost = await createPost({
        title: title.value.trim(),
        content: content.value.trim(),
        userId: userStore.user.id,
        category: category.value
      })
      postId = newPost.id
    }

    // 上传附件
    if (files.value.length && postId) {
      for (const file of files.value) {
        try {
          await uploadFile({ file, userId: userStore.user.id, postId })
        } catch (e) {
          console.error('文件上传失败:', file.name, e)
        }
      }
    }

    router.push(`/community/post/${postId}`)
  } catch (e) {
    console.error('发布失败:', e)
    alert('发布失败，请重试')
  } finally {
    submitting.value = false
  }
}
</script>

<style>
@import '@/assets/styles/community.css';
</style>