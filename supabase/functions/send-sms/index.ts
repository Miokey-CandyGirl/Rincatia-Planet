// 发送短信验证码 Edge Function
// 部署到 Supabase: npx supabase functions deploy send-sms

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { crypto } from 'https://deno.land/std@0.168.0/crypto/mod.ts'

const ALIYUN_ACCESS_KEY_ID = Deno.env.get('ALIYUN_ACCESS_KEY_ID')!
const ALIYUN_ACCESS_KEY_SECRET = Deno.env.get('ALIYUN_ACCESS_KEY_SECRET')!
const ALIYUN_SMS_SIGN_NAME = Deno.env.get('ALIYUN_SMS_SIGN_NAME')!
const ALIYUN_SMS_TEMPLATE_CODE = Deno.env.get('ALIYUN_SMS_TEMPLATE_CODE')!

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

// 阿里云短信 API 签名算法（V1）
async function sendAliyunSms(phone: string, code: string) {
  const params: Record<string, string> = {
    AccessKeyId: ALIYUN_ACCESS_KEY_ID,
    Action: 'SendSms',
    Format: 'JSON',
    OutId: '',
    PhoneNumbers: phone,
    RegionId: 'cn-hangzhou',
    SignName: ALIYUN_SMS_SIGN_NAME,
    SignatureMethod: 'HMAC-SHA1',
    SignatureVersion: '1.0',
    SignatureNonce: crypto.randomUUID(),
    TemplateCode: ALIYUN_SMS_TEMPLATE_CODE,
    TemplateParam: JSON.stringify({ code }),
    Timestamp: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
    Version: '2017-05-25',
  }

  // 排序参数
  const sortedKeys = Object.keys(params).sort()
  const canonicalizedQuery = sortedKeys
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&')

  const stringToSign = `GET&${encodeURIComponent('/')}&${encodeURIComponent(canonicalizedQuery)}`

  // HMAC-SHA1 签名
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(ALIYUN_ACCESS_KEY_SECRET + '&'),
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(stringToSign))
  const base64Signature = btoa(String.fromCharCode(...new Uint8Array(signature)))

  const url = `https://dysmsapi.aliyuncs.com/?Signature=${encodeURIComponent(base64Signature)}&${canonicalizedQuery}`

  const response = await fetch(url)
  const result = await response.json()
  return result
}

serve(async (req) => {
  try {
    const { phone } = await req.json()
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown'

    // 1. 校验手机号格式
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      return new Response(
        JSON.stringify({ success: false, message: '手机号格式不正确' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 2. 检查发送频率（同一手机号 60 秒内只能发送一次）
    const { data: recent } = await supabaseAdmin
      .from('sms_codes')
      .select('created_at')
      .eq('phone', phone)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (recent) {
      const elapsed = Date.now() - new Date(recent.created_at).getTime()
      if (elapsed < 60000) {
        return new Response(
          JSON.stringify({ success: false, message: `请${Math.ceil((60000 - elapsed) / 1000)}秒后再试` }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        )
      }
    }

    // 3. 生成 6 位随机验证码
    const code = String(Math.floor(100000 + Math.random() * 900000))

    // 4. 存入 sms_codes 表（5 分钟过期）
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()
    const { error: insertError } = await supabaseAdmin
      .from('sms_codes')
      .insert({
        phone,
        code,
        expires_at: expiresAt,
        used: false,
        ip_address: clientIP
      })

    if (insertError) {
      console.error('存储验证码失败:', insertError)
      return new Response(
        JSON.stringify({ success: false, message: '系统错误，请稍后重试' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 5. 调用阿里云短信 API 发送验证码
    const smsResult = await sendAliyunSms(phone, code)

    if (smsResult.Code !== 'OK') {
      console.error('阿里云短信发送失败:', smsResult)
      return new Response(
        JSON.stringify({ success: false, message: '短信发送失败，请稍后重试' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true, message: '验证码已发送' }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('send-sms error:', err)
    return new Response(
      JSON.stringify({ success: false, message: '服务器错误' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})