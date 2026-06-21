import { supabase } from './supabaseClient'

// ==================== 帖子相关 ====================

/** 获取帖子列表（分页、排序） */
export async function getPosts({ page = 1, pageSize = 10, orderBy = 'created_at', ascending = false } = {}) {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  const { data, error, count } = await supabase
    .from('posts')
    .select('*, users(nickname, avatar_url)', { count: 'exact' })
    .order(orderBy, { ascending })
    .range(from, to)
  if (error) throw error
  return { data, count }
}

/** 获取帖子详情 */
export async function getPostById(id) {
  const { data, error } = await supabase
    .from('posts')
    .select('*, users(nickname, avatar_url)')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

/** 创建帖子 */
export async function createPost({ title, content, userId }) {
  const { data, error } = await supabase
    .from('posts')
    .insert({ title, content, user_id: userId })
    .select()
    .single()
  if (error) throw error
  return data
}

/** 更新帖子 */
export async function updatePost(id, updates) {
  const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

/** 删除帖子 */
export async function deletePost(id) {
  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) throw error
}

// ==================== 评论相关 ====================

/** 获取帖子的评论列表 */
export async function getComments(postId) {
  const { data, error } = await supabase
    .from('comments')
    .select('*, users(nickname, avatar_url)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

/** 发表评论 */
export async function createComment({ postId, userId, content, parentId = null }) {
  const { data, error } = await supabase
    .from('comments')
    .insert({ post_id: postId, user_id: userId, content, parent_id: parentId })
    .select()
    .single()
  if (error) throw error
  return data
}

/** 删除评论 */
export async function deleteComment(id) {
  const { error } = await supabase.from('comments').delete().eq('id', id)
  if (error) throw error
}

// ==================== 点赞相关 ====================

/** 切换点赞（存在则取消，不存在则创建） */
export async function toggleLike({ userId, targetType, targetId }) {
  const { data: existing } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', userId)
    .eq('target_type', targetType)
    .eq('target_id', targetId)
    .single()

  if (existing) {
    const { error } = await supabase.from('likes').delete().eq('id', existing.id)
    if (error) throw error
    return { liked: false }
  } else {
    const { error } = await supabase
      .from('likes')
      .insert({ user_id: userId, target_type: targetType, target_id: targetId })
    if (error) throw error
    return { liked: true }
  }
}

/** 获取用户点赞列表 */
export async function getUserLikes(userId, targetType) {
  const { data, error } = await supabase
    .from('likes')
    .select('*')
    .eq('user_id', userId)
    .eq('target_type', targetType)
  if (error) throw error
  return data
}

// ==================== 收藏相关 ====================

/** 切换收藏 */
export async function toggleFavorite({ userId, targetType, targetId }) {
  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('target_type', targetType)
    .eq('target_id', targetId)
    .single()

  if (existing) {
    const { error } = await supabase.from('favorites').delete().eq('id', existing.id)
    if (error) throw error
    return { favorited: false }
  } else {
    const { error } = await supabase
      .from('favorites')
      .insert({ user_id: userId, target_type: targetType, target_id: targetId })
    if (error) throw error
    return { favorited: true }
  }
}

/** 获取用户收藏列表 */
export async function getUserFavorites(userId) {
  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', userId)
  if (error) throw error
  return data
}

// ==================== 用户相关 ====================

/** 获取用户信息 */
export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}

/** 更新用户资料 */
export async function updateUserProfile(userId, updates) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}

// ==================== 学习记录相关 ====================

/** 获取用户学习记录 */
export async function getLearningRecords(userId) {
  const { data, error } = await supabase
    .from('learning_records')
    .select('*')
    .eq('user_id', userId)
  if (error) throw error
  return data
}

/** 更新学习记录 */
export async function updateLearningRecord({ userId, contentType, contentId, progress }) {
  const { data, error } = await supabase
    .from('learning_records')
    .upsert({ user_id: userId, content_type: contentType, content_id: contentId, progress })
    .select()
    .single()
  if (error) throw error
  return data
}

// ==================== 文件相关 ====================

/** 上传文件 */
export async function uploadFile({ file, userId, postId }) {
  const filePath = `${userId}/${Date.now()}_${file.name}`
  const { error: uploadError } = await supabase.storage
    .from('attachments')
    .upload(filePath, file)
  if (uploadError) throw uploadError

  const { data, error } = await supabase
    .from('files')
    .insert({
      user_id: userId,
      post_id: postId,
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
      mime_type: file.type
    })
    .select()
    .single()
  if (error) throw error
  return data
}

/** 获取文件下载 URL */
export function getFileUrl(filePath) {
  const { data } = supabase.storage.from('attachments').getPublicUrl(filePath)
  return data.publicUrl
}