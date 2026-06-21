// @ts-nocheck
// 校验短信验证码并完成登录/注册 Edge Function
// 部署到 Supabase: npx supabase functions deploy verify-sms
// 注意：此文件运行在 Supabase Deno 环境中，URL 导入和 Deno 全局变量是正常的

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

// 演示账号配置（固定手机号 + 固定验证码，无需短信发送）
const DEMO_ACCOUNTS: Record<string, { code: string; userId: string; nickname: string; role: string }> = {
  '19908162025': { code: '150808', userId: 'b0000000-0000-4000-8000-000000000001', nickname: '琳凯蒂亚居民', role: 'user' },
  '19708162025': { code: '150808', userId: 'b0000000-0000-4000-8000-000000000002', nickname: '琳凯蒂亚管理员', role: 'admin' }
}

serve(async (req) => {
  try {
    const { phone, code } = await req.json()

    // 1. 校验参数
    if (!phone || !code) {
      return new Response(
        JSON.stringify({ success: false, message: '手机号和验证码不能为空' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return new Response(
        JSON.stringify({ success: false, message: '手机号格式不正确' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // ========== 演示账号处理：固定验证码，直接验证 Supabase 用户 ==========
    if (phone in DEMO_ACCOUNTS) {
      const demoAccount = DEMO_ACCOUNTS[phone]
      if (code !== demoAccount.code) {
        return new Response(
          JSON.stringify({ success: false, message: '验证码错误' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        )
      }

      // 查找或创建演示用户
      let userId = demoAccount.userId
      const phoneEmail = `${phone}@phone.rincatia.local`

      // 检查 public.users 表中是否存在
      const { data: existingUser } = await supabaseAdmin
        .from('users')
        .select('id, phone, role')
        .eq('id', userId)
        .single()

      if (!existingUser) {
        // 用户不存在（迁移未运行），动态创建
        console.log(`演示账号 ${phone} 不存在，正在创建...`)

        // 先创建 auth.users
        const { error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: phoneEmail,
          phone: phone,
          email_confirm: true,
          phone_confirm: true,
          user_metadata: { nickname: demoAccount.nickname, phone: phone },
          app_metadata: { provider: 'sms', demo: true }
        })

        if (authError && !authError.message?.includes('already')) {
          console.error('创建 auth 用户失败:', authError)
          return new Response(
            JSON.stringify({ success: false, message: '系统错误，请稍后重试' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          )
        }

        // 如果 auth 用户已存在，通过 email 查找 ID
        if (authError?.message?.includes('already')) {
          const { data: byEmail } = await supabaseAdmin.auth.admin.listUsers()
          const found = byEmail?.users?.find(u => u.email === phoneEmail || u.phone === phone)
          if (found) {
            userId = found.id
          }
        }

        // 创建 public.users 记录
        const { error: insertError } = await supabaseAdmin
          .from('users')
          .insert({
            id: userId,
            phone: phone,
            email: phoneEmail,
            nickname: demoAccount.nickname,
            role: demoAccount.role,
            avatar_url: '',
            post_count: 0,
            is_banned: false,
            created_at: new Date().toISOString()
          })

        if (insertError) {
          console.error('创建 public.users 记录失败:', insertError)
        }
      }

      // 获取用户完整信息
      const { data: userProfile } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      return new Response(
        JSON.stringify({
          success: true,
          message: '登录成功',
          user: {
            id: userId,
            phone: phone,
            email: phoneEmail,
            nickname: userProfile?.nickname || demoAccount.nickname,
            avatar_url: userProfile?.avatar_url || '',
            role: userProfile?.role || demoAccount.role
          }
        }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }
    // ========== 演示账号处理结束 ==========

    // 2. 从数据库取出最新一条未使用的验证码
    const now = new Date().toISOString()
    const { data: smsRecord, error: fetchError } = await supabaseAdmin
      .from('sms_codes')
      .select('*')
      .eq('phone', phone)
      .eq('used', false)
      .gt('expires_at', now)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (fetchError || !smsRecord) {
      return new Response(
        JSON.stringify({ success: false, message: '验证码不存在或已过期，请重新获取' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 3. 比对验证码
    if (smsRecord.code !== code) {
      return new Response(
        JSON.stringify({ success: false, message: '验证码错误' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 4. 标记验证码已使用
    await supabaseAdmin
      .from('sms_codes')
      .update({ used: true })
      .eq('id', smsRecord.id)

    // 5. 查找或创建用户
    const phoneEmail = `${phone}@phone.rincatia.local`
    let userId: string

    // 先尝试用 phone 查找 users 表
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id, phone')
      .eq('phone', phone)
      .single()

    if (existingUser) {
      userId = existingUser.id
    } else {
      // 创建 Supabase Auth 用户
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: phoneEmail,
        phone: phone,
        email_confirm: true,
        phone_confirm: true,
        user_metadata: { nickname: phone.slice(-4) + '用户' },
        app_metadata: { provider: 'sms' }
      })

      if (authError) {
        // 如果用户已存在（通过 email 冲突），尝试查找
        if (authError.message?.includes('already') || authError.code === 'email_exists') {
          const { data: byEmail } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('email', phoneEmail)
            .single()
          if (byEmail) {
            userId = byEmail.id
          } else {
            throw authError
          }
        } else {
          throw authError
        }
      } else {
        userId = authUser.user.id
        // 在 public.users 表中创建记录
        const { error: insertUserError } = await supabaseAdmin
          .from('users')
          .insert({
            id: userId,
            phone: phone,
            email: phoneEmail,
            nickname: '用户' + phone.slice(-4),
            role: 'user'
          })
        if (insertUserError) {
          console.error('创建 users 表记录失败:', insertUserError)
        }
      }
    }

    // 6. 获取用户完整信息
    const { data: userProfile } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    return new Response(
      JSON.stringify({
        success: true,
        message: '登录成功',
        user: {
          id: userId,
          phone: phone,
          email: phoneEmail,
          nickname: userProfile?.nickname || '用户' + phone.slice(-4),
          avatar_url: userProfile?.avatar_url || '',
          role: userProfile?.role || 'user'
        }
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('verify-sms error:', err)
    return new Response(
      JSON.stringify({ success: false, message: '服务器错误' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})