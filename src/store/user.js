import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/api/supabaseClient'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isLoggedIn = computed(() => !!user.value && !!user.value.id)

  // 从 localStorage 恢复登录状态
  function init() {
    const stored = localStorage.getItem('rincatia_user')
    if (stored) {
      try {
        user.value = JSON.parse(stored)
      } catch {
        localStorage.removeItem('rincatia_user')
      }
    }
  }

  // 监听 Supabase Auth 状态变化（自动恢复登录态）
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      syncUserFromAuth(session.user)
    } else if (event === 'SIGNED_OUT') {
      user.value = null
      localStorage.removeItem('rincatia_user')
    }
  })

  // 从 Supabase Auth 用户同步到 users 表
  async function syncUserFromAuth(authUser) {
    if (!authUser) return
    // 先查 users 表是否存在
    const { data: existing } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single()

    if (existing) {
      user.value = existing
    } else {
      // 用户不存在则创建
      const { data: newUser } = await supabase
        .from('users')
        .insert({
          id: authUser.id,
          email: authUser.email,
          nickname: authUser.user_metadata?.nickname || authUser.email?.split('@')[0] || '琳凯蒂亚居民',
          avatar_url: authUser.user_metadata?.avatar_url || ''
        })
        .select()
        .single()
      user.value = newUser
    }
    localStorage.setItem('rincatia_user', JSON.stringify(user.value))
  }

  // 登录（短信验证码，由 LoginModal 调用 Edge Functions 完成）
  function setUser(userData) {
    user.value = userData
    localStorage.setItem('rincatia_user', JSON.stringify(userData))
  }

  // 注销
  async function logout() {
    await supabase.auth.signOut()
    user.value = null
    localStorage.removeItem('rincatia_user')
  }

  // 获取最新用户信息
  async function fetchProfile() {
    if (!user.value?.id) return
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.value.id)
      .single()
    if (data) {
      user.value = data
      localStorage.setItem('rincatia_user', JSON.stringify(data))
    }
  }

  // 更新用户资料
  async function updateProfile(updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.value.id)
      .select()
      .single()
    if (error) throw error
    user.value = data
    localStorage.setItem('rincatia_user', JSON.stringify(data))
  }

  // 初始化
  init()

  return { user, isLoggedIn, setUser, logout, fetchProfile, updateProfile, syncUserFromAuth }
})