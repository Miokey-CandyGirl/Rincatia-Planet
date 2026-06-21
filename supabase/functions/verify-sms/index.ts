// 校验短信验证码并完成登录/注册 Edge Function
// 部署到 MemFire Cloud (Supabase 兼容)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { phone, code } = await req.json()

  // 1. 校验手机号和验证码
  if (!phone || !code) {
    return new Response(JSON.stringify({ success: false, message: '手机号和验证码不能为空' }), { status: 400 })
  }

  // 2. 从数据库取出验证码比对
  // TODO: 从 Supabase 数据库或 Redis 取出验证码进行比对

  // 3. 验证通过 → 调用 Supabase Auth Admin API
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // 查找用户是否存在
  // 不存在 → 创建用户（自动注册）
  // 已存在 → 直接登录

  // 4. 删除已使用的验证码
  // TODO: 删除已使用的验证码

  // 5. 返回 JWT Token + 用户信息
  return new Response(JSON.stringify({
    success: true,
    message: '登录成功',
    // access_token: '...',
    // user: { id, phone, ... }
  }), {
    headers: { 'Content-Type': 'application/json' }
  })
})