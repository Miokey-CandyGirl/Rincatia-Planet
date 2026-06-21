import { supabase } from './supabaseClient'

// ==================== 帖子相关 ====================

/** 获取帖子列表（分页、排序，支持分类过滤和搜索） */
export async function getPosts({ page = 1, pageSize = 10, orderBy = 'created_at', ascending = false, category = '', search = '' } = {}) {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('posts')
    .select('*, users(nickname, avatar_url)', { count: 'exact' })

  if (category) {
    query = query.eq('category', category)
  }
  if (search) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
  }

  const { data, error, count } = await query
    .order('is_pinned', { ascending: false })
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
export async function createPost({ title, content, userId, category = 'general' }) {
  const { data, error } = await supabase
    .from('posts')
    .insert({ title, content, user_id: userId, category })
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

/** 获取帖子的附件列表 */
export async function getPostFiles(postId) {
  const { data, error } = await supabase
    .from('files')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data || []
}

// ==================== 社区统计相关 ====================

/** 获取热门话题（按评论数排序） */
export async function getHotTopics(limit = 5) {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, comment_count')
    .order('comment_count', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data || []
}

/** 获取活跃用户（按发帖数排序） */
export async function getActiveUsers(limit = 10) {
  const { data, error } = await supabase
    .from('users')
    .select('id, nickname, avatar_url, post_count')
    .order('post_count', { ascending: false })
    .limit(limit)
  if (error) {
    // 如果 post_count 字段不存在，回退到按创建时间排序
    const { data: fallback, error: fallbackError } = await supabase
      .from('users')
      .select('id, nickname, avatar_url')
      .limit(limit)
    if (fallbackError) throw fallbackError
    return (fallback || []).map(u => ({ ...u, post_count: 0 }))
  }
  return data || []
}

/** 获取社区统计 */
export async function getCommunityStats() {
  const [{ count: postCount }, { count: userCount }, { count: commentCount }] = await Promise.all([
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('comments').select('*', { count: 'exact', head: true })
  ])
  return { postCount: postCount || 0, userCount: userCount || 0, commentCount: commentCount || 0 }
}

/** 增加帖子浏览量 */
export async function incrementViewCount(postId) {
  const { error } = await supabase.rpc('increment_view_count', { post_id: postId })
  if (error) {
    // 如果 RPC 函数不存在，静默失败
    console.warn('increment_view_count RPC not available:', error.message)
  }
}

// ==================== 管理员相关 ====================

/** 检查用户是否为管理员 */
export async function checkIsAdmin(userId) {
  if (!userId) return false
  try {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single()
    if (error || !data) return false
    return data.role === 'admin'
  } catch {
    return false
  }
}

/** 获取所有帖子（管理员） */
export async function adminGetAllPosts({ page = 1, pageSize = 20 } = {}) {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  const { data, error, count } = await supabase
    .from('posts')
    .select('*, users(nickname)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)
  if (error) throw error
  return { data, count }
}

/** 获取所有用户（管理员） */
export async function adminGetAllUsers({ page = 1, pageSize = 20 } = {}) {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  const { data, error, count } = await supabase
    .from('users')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)
  if (error) throw error
  return { data, count }
}

/** 管理员设置帖子置顶 */
export async function adminTogglePin(postId, isPinned) {
  const { error } = await supabase
    .from('posts')
    .update({ is_pinned: isPinned })
    .eq('id', postId)
  if (error) throw error
}

/** 管理员设置精华帖 */
export async function adminToggleEssence(postId, isEssence) {
  const { error } = await supabase
    .from('posts')
    .update({ is_essence: isEssence })
    .eq('id', postId)
  if (error) throw error
}

/** 管理员更新用户角色 */
export async function adminUpdateUserRole(userId, role) {
  const { error } = await supabase
    .from('users')
    .update({ role })
    .eq('id', userId)
  if (error) throw error
}

/** 管理员封禁/解封用户 */
export async function adminToggleUserBan(userId, isBanned) {
  const { error } = await supabase
    .from('users')
    .update({ is_banned: isBanned })
    .eq('id', userId)
  if (error) throw error
}

/** 管理员删除用户 */
export async function adminDeleteUser(userId) {
  const { error } = await supabase.from('users').delete().eq('id', userId)
  if (error) throw error
}

/** 管理员搜索用户 */
export async function adminSearchUsers({ search = '', page = 1, pageSize = 20 } = {}) {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  let query = supabase
    .from('users')
    .select('*', { count: 'exact' })

  if (search) {
    query = query.or(`nickname.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`)
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to)
  if (error) throw error
  return { data, count }
}

/** 管理员获取用户详情（含统计） */
export async function adminGetUserDetail(userId) {
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  if (userError) throw userError

  const [{ count: postCount }, { count: commentCount }] = await Promise.all([
    supabase.from('posts').select('*', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('comments').select('*', { count: 'exact', head: true }).eq('user_id', userId)
  ])

  return { ...user, post_count: postCount || 0, comment_count: commentCount || 0 }
}

// ==================== 头像上传 ====================

/** 上传用户头像到 Supabase Storage */
export async function uploadAvatar({ userId, file }) {
  const fileExt = file.name.split('.').pop()
  const filePath = `avatars/${userId}_${Date.now()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    })
  if (uploadError) throw uploadError

  // 获取公开 URL
  const { data: urlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath)

  const avatarUrl = urlData.publicUrl

  // 更新用户头像
  const { data, error } = await supabase
    .from('users')
    .update({ avatar_url: avatarUrl })
    .eq('id', userId)
    .select()
    .single()
  if (error) throw error

  return data
}

/** 获取附件下载链接 */
export async function downloadFile(filePath) {
  const { data, error } = await supabase.storage
    .from('attachments')
    .createSignedUrl(filePath, 60) // 60秒有效期
  if (error) throw error
  return data.signedUrl
}

// ==================== 开发测试用 ====================

/** 开发测试登录（跳过短信验证，固定手机号+验证码） */
export async function devLogin({ phone = '13800138000', code = '123456' } = {}) {
  // 开发环境固定验证码
  const DEV_CODE = '123456'
  if (code !== DEV_CODE) {
    throw new Error('验证码错误')
  }

  // 查找或创建用户
  const { data: existing } = await supabase
    .from('users')
    .select('*')
    .eq('phone', phone)
    .single()

  if (existing) {
    return existing
  }

  // 创建新用户（只用 public.users 表，不创建 auth 用户）
  const userId = crypto.randomUUID()
  const { data: newUser, error } = await supabase
    .from('users')
    .insert({
      id: userId,
      phone: phone,
      nickname: '测试用户' + phone.slice(-4),
      role: 'user',
      created_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) throw error
  return newUser
}

/** 创建/升级管理员账号（开发用） */
export async function devCreateAdmin({ phone = '13800138000' } = {}) {
  // 先尝试开发登录
  let user = await devLogin({ phone, code: '123456' })

  // 升级为管理员
  const { data, error } = await supabase
    .from('users')
    .update({ role: 'admin', nickname: '管理员' })
    .eq('id', user.id)
    .select()
    .single()

  if (error) throw error
  return data
}