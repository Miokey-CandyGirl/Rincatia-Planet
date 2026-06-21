// 发送短信验证码 Edge Function
// 部署到 MemFire Cloud (Supabase 兼容)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const ALIYUN_ACCESS_KEY_ID = Deno.env.get('ALIYUN_ACCESS_KEY_ID')!
const ALIYUN_ACCESS_KEY_SECRET = Deno.env.get('ALIYUN_ACCESS_KEY_SECRET')!
const ALIYUN_SMS_SIGN_NAME = Deno.env.get('ALIYUN_SMS_SIGN_NAME')!
const ALIYUN_SMS_TEMPLATE_CODE = Deno.env.get('ALIYUN_SMS_TEMPLATE_CODE')!

serve(async (req) => {
  const { phone } = await req.json()

  // 1. 校验手机号格式
  if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
    return new Response(JSON.stringify({ success: false, message: '手机号格式不正确' }), { status: 400 })
  }

  // 2. 生成 6 位随机验证码
  const code = String(Math.floor(100000 + Math.random() * 900000))

  // 3. 将验证码存入数据库（5 分钟过期）
  // TODO: 使用 Supabase 数据库或 Redis 存储验证码

  // 4. 调用阿里云短信 API 发送验证码
  // TODO: 实现阿里云短信 API 调用

  return new Response(JSON.stringify({ success: true, message: '验证码已发送' }), {
    headers: { 'Content-Type': 'application/json' }
  })
})