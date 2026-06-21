import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/api/supabaseClient'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isLoggedIn = computed(() => !!user.value)

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

  // 登录
  async function login(phone, code) {
    // TODO: 调用 verify-sms Edge Function
    // const { data, error } = await supabase.functions.invoke('verify-sms', { body: { phone, code } })
    // if (error) throw error
    // user.value = data.user
    // localStorage.setItem('rincatia_user', JSON.stringify(data.user))
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

  return { user, isLoggedIn, login, logout, fetchProfile, updateProfile }
})