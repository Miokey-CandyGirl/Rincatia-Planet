<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <button class="modal-close" @click="$emit('close')">&times;</button>

      <h2 class="modal-title">琳凯蒂亚星球通行证</h2>

      <!-- 登录方式切换 -->
      <div class="auth-tabs">
        <button
          class="auth-tab"
          :class="{ active: authMode === 'sms' }"
          @click="switchMode('sms')"
        >手机验证登录</button>
        <button
          class="auth-tab"
          :class="{ active: authMode === 'email' }"
          @click="switchMode('email')"
        >邮箱验证登录</button>
      </div>

      <!-- ========== 短信验证码登录 ========== -->
      <template v-if="authMode === 'sms'">
        <p class="modal-subtitle">输入您的手机号码，获取验证码登录</p>

        <form @submit.prevent="handleSendSms" class="login-form">
          <div class="form-group">
            <label>手机</label>
            <input
              type="tel"
              v-model="phone"
              placeholder="请输入手机号码"
              maxlength="11"
              :disabled="smsCountdown > 0"
            />
          </div>

          <p v-if="!isValidPhoneNum && phone.length > 0" class="hint-msg">请输入正确的11位手机号码</p>
          <p v-if="phone.length === 0 && smsCountdown === 0" class="hint-msg">请输入手机号码以获取验证码</p>
          <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
          <p v-if="successMsg" class="success-msg">{{ successMsg }}</p>

          <button
            type="submit"
            class="btn btn-primary btn-full"
            :disabled="!isValidPhoneNum || smsCountdown > 0 || sending"
          >
            {{ smsCountdown > 0 ? `${smsCountdown}秒后重试` : sending ? '发送中...' : '获取验证码' }}
          </button>
        </form>

        <form @submit.prevent="handleSmsLogin" class="login-form" v-if="codeSent">
          <div class="form-group">
            <label>验证码</label>
            <input
              type="text"
              v-model="code"
              placeholder="请输入6位验证码"
              maxlength="6"
            />
          </div>

          <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
          <p v-if="code.length === 0" class="hint-msg">请输入6位短信验证码</p>
          <p v-if="code.length > 0 && !isValidCode" class="hint-msg">验证码只能包含数字</p>
          <p v-if="code.length > 0 && code.length < 6 && isValidCode" class="hint-msg">验证码为6位数字，当前已输入{{ code.length }}位</p>

          <button
            type="submit"
            class="btn btn-primary btn-full"
            :disabled="code.length !== 6 || loggingIn || !agreed"
          >
            {{ loggingIn ? '登录中...' : '登录' }}
          </button>

          <p v-if="code.length === 6 && !agreed" class="hint-msg">
            请先勾选「我已阅读并同意《琳凯蒂亚星球用户协议》」
          </p>
        </form>
      </template>

      <!-- ========== 邮箱验证码登录 ========== -->
      <template v-if="authMode === 'email'">
        <p class="modal-subtitle">输入您的邮箱地址，获取验证码登录</p>

        <form @submit.prevent="handleSendEmailCode" class="login-form">
          <div class="form-group">
            <label>邮箱</label>
            <input
              type="email"
              v-model="email"
              placeholder="请输入邮箱地址"
              :disabled="emailCodeSent"
            />
          </div>

          <p v-if="!isValidEmail && email.length > 0" class="hint-msg">请输入正确的邮箱地址</p>
          <p v-if="email.length === 0 && emailCountdown === 0" class="hint-msg">请输入邮箱地址以获取验证码</p>
          <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
          <p v-if="successMsg" class="success-msg">{{ successMsg }}</p>

          <button
            type="submit"
            class="btn btn-primary btn-full"
            :disabled="!isValidEmail || emailCountdown > 0 || sendingEmailCode"
          >
            {{ emailCountdown > 0 ? `${emailCountdown}秒后重试` : sendingEmailCode ? '发送中...' : '获取验证码' }}
          </button>
        </form>

        <form @submit.prevent="handleEmailLogin" class="login-form" v-if="emailCodeSent">
          <div class="form-group">
            <label>验证码</label>
            <input
              type="text"
              v-model="emailCode"
              placeholder="请输入6位验证码"
              maxlength="6"
            />
          </div>

          <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
          <p v-if="emailCode.length === 0" class="hint-msg">请输入6位邮箱验证码</p>
          <p v-if="emailCode.length > 0 && !isValidEmailCode" class="hint-msg">验证码只能包含数字</p>
          <p v-if="emailCode.length > 0 && emailCode.length < 6 && isValidEmailCode" class="hint-msg">验证码为6位数字，当前已输入{{ emailCode.length }}位</p>

          <button
            type="submit"
            class="btn btn-primary btn-full"
            :disabled="emailCode.length !== 6 || emailLoggingIn || !agreed"
          >
            {{ emailLoggingIn ? '验证中...' : '登录' }}
          </button>

          <p v-if="emailCode.length === 6 && !agreed" class="hint-msg">
            请先勾选「我已阅读并同意《琳凯蒂亚星球用户协议》」
          </p>
        </form>
      </template>

      <!-- ========== 用户协议 & 社群 ========== -->
      <div class="modal-footer-section">
        <div style="display: flex; justify-content: center; align-items: center;" class="qq-group">
          <span style="font-size: 24px;" class="qq-icon"></span>
          <span style="text-align: center;">琳凯蒂亚星球官方QQ群：<strong>🐧515385616</strong><br>（欢迎您的加入！）</span>
        </div>

        <label style="display: flex; justify-content: center; align-items: center;" class="agreement-checkbox">
          <input type="checkbox" v-model="agreed" />
          <span class="check-text">
            我已阅读并同意
            <a href="#" class="agreement-link" @click.prevent="showAgreement = true">《琳凯蒂亚星球用户协议》</a>
          </span>
        </label>
      </div>

      <!-- ========== 用户协议弹窗 ========== -->
      <div class="agreement-overlay" v-if="showAgreement" @click.self="showAgreement = false">
        <div class="agreement-content">
          <div class="agreement-header">
            <h3>琳凯蒂亚星球用户协议</h3>
            <button class="agreement-close" @click="showAgreement = false">&times;</button>
          </div>
          <div class="agreement-body">
            <h4>一、总则</h4>
            <p>欢迎来到琳凯蒂亚星球（以下简称"本平台"）。本平台是《光线传奇》世界观下的琳凯蒂亚语学习与文化交流社区。您在使用本平台服务前，请仔细阅读本协议。一旦您注册或使用本平台，即表示您已充分理解并同意本协议的全部条款。</p>

            <h4>二、用户注册与账号管理</h4>
            <p>1. 您承诺在注册时提供真实、准确的个人信息（手机号或邮箱）。</p>
            <p>2. 您应妥善保管账号及验证码，因账号信息泄露导致的一切后果由您自行承担。</p>
            <p>3. 每个手机号或邮箱仅可注册一个账号，禁止恶意注册多个账号。</p>

            <h4>三、用户行为规范</h4>
            <p>您在使用本平台时，不得从事以下行为：</p>
            <p>1. 发布违反中华人民共和国法律法规的内容；</p>
            <p>2. 发布淫秽、色情、赌博、暴力、凶杀、恐怖或教唆犯罪的内容；</p>
            <p>3. 侮辱、诽谤他人，侵害他人合法权益；</p>
            <p>4. 发布广告、垃圾信息或进行商业推广（经平台授权的商务合作除外）；</p>
            <p>5. 利用技术手段恶意攻击、干扰平台正常运行；</p>
            <p>6. 其他违反公序良俗或损害平台及其他用户利益的行为。</p>

            <h4>四、知识产权</h4>
            <p>1. 琳凯蒂亚语（Rincatian）、《光线传奇》世界观、琳凯蒂亚星球相关设定及内容的知识产权归原作者及平台所有。</p>
            <p>2. 用户在平台发布的原创内容（包括但不限于翻译作品、学习笔记、文化创作），其著作权归用户本人所有，但用户授予平台在平台范围内展示、传播该内容的权利。</p>
            <p>3. 未经授权，任何第三方不得将琳凯蒂亚语及相关世界观内容用于商业用途。</p>

            <h4>五、隐私保护</h4>
            <p>1. 本平台重视用户隐私保护，您的手机号、邮箱等个人信息仅用于账号认证和平台服务，不会向第三方泄露。</p>
            <p>2. 除法律法规要求或经您明确同意外，本平台不会将您的个人信息用于其他目的。</p>
            <p>3. 本平台采用合理的安全措施保护您的个人信息安全。</p>

            <h4>六、免责声明</h4>
            <p>1. 本平台提供的琳凯蒂亚语学习内容仅供学习交流之用，不构成任何形式的语言权威认证。</p>
            <p>2. 因不可抗力、系统维护、网络故障等原因导致的服务中断，平台将尽力及时恢复，但不承担由此产生的任何责任。</p>
            <p>3. 用户之间通过本平台产生的交流与互动，属于用户个人行为，平台不对其内容及后果承担责任。</p>

            <h4>七、违规处理</h4>
            <p>对于违反本协议的用户，平台有权根据情节严重程度采取以下措施：</p>
            <p>1. 警告并删除违规内容；</p>
            <p>2. 限制或暂停账号使用权限；</p>
            <p>3. 永久封禁账号；</p>
            <p>4. 如涉及违法犯罪行为，将配合司法机关处理。</p>

            <h4>八、协议修改</h4>
            <p>本平台保留随时修改本协议的权利。修改后的协议将在平台公示，一经发布即生效。用户继续使用本平台服务即视为同意修改后的协议。如不同意修改内容，请停止使用本平台服务。</p>

            <h4>九、联系我们</h4>
            <p>如您对本协议有任何疑问或建议，请通过以下方式联系我们：</p>
            <p>邮箱：1778181360@qq.com</p>
            <p>QQ群：515385616</p>

            <p class="agreement-date">本协议最后更新于：华田12年03月，公历2026年06月</p>
          </div>
          <div class="agreement-footer">
            <button class="btn btn-primary" @click="showAgreement = false">我已阅读并同意</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { isValidPhone } from '@/utils'
import { useUserStore } from '@/store/user'
import { supabase } from '@/api/supabaseClient'
import { useTianCalendar } from '@/composables/useTianCalendar'

const emit = defineEmits(['close'])
const userStore = useUserStore()
const { tianDate } = useTianCalendar()

// 用户协议
const agreed = ref(false)
const showAgreement = ref(false)

// 认证模式
const authMode = ref('sms')
const errorMsg = ref('')
const successMsg = ref('')

// 硬编码演示账号（无需调用 Edge Function）
const DEMO_ACCOUNTS = {
  '19908162025': { code: '150808', role: 'user', nickname: '琳凯蒂亚居民' },
  '19708162025': { code: '150808', role: 'admin', nickname: '琳凯蒂亚管理员' }
}

function isDemoPhone(phone) {
  return phone in DEMO_ACCOUNTS
}

// 短信登录
const phone = ref('')
const code = ref('')
const codeSent = ref(false)
const sending = ref(false)
const loggingIn = ref(false)
const smsCountdown = ref(0)

const isValidPhoneNum = computed(() => isValidPhone(phone.value))
const isValidCode = computed(() => /^\d*$/.test(code.value))

// 邮箱验证码登录
const email = ref('')
const emailCode = ref('')
const emailCodeSent = ref(false)
const sendingEmailCode = ref(false)
const emailLoggingIn = ref(false)
const emailCountdown = ref(0)

const isValidEmail = computed(() => {
  return email.value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
})
const isValidEmailCode = computed(() => /^\d*$/.test(emailCode.value))

// 切换认证模式
function switchMode(mode) {
  authMode.value = mode
  errorMsg.value = ''
  successMsg.value = ''
}

// ========== 短信验证码登录 ==========
async function handleSendSms() {
  if (!isValidPhoneNum.value || smsCountdown.value > 0) return
  sending.value = true
  errorMsg.value = ''
  successMsg.value = ''
  try {
    // 硬编码演示账号：跳过 Edge Function 发送短信，直接显示验证码输入框
    if (isDemoPhone(phone.value)) {
      agreed.value = true // 自动同意用户协议
      codeSent.value = true
      successMsg.value = '演示账号，请输入固定验证码 150808 完成登录'
      smsCountdown.value = 60
      const timer = setInterval(() => {
        smsCountdown.value--
        if (smsCountdown.value <= 0) clearInterval(timer)
      }, 1000)
      return
    }

    const { data, error } = await supabase.functions.invoke('send-sms', {
      body: { phone: phone.value }
    })

    if (error) {
      // 根据错误类型给出更具体的提示
      const errMsg = error.message || ''
      if (errMsg.includes('频率') || errMsg.includes('频繁') || errMsg.includes('rate')) {
        errorMsg.value = '操作过于频繁，请60秒后再试'
      } else if (errMsg.includes('网络') || errMsg.includes('fetch') || errMsg.includes('timeout')) {
        errorMsg.value = '网络连接失败，请检查网络后重试'
      } else {
        errorMsg.value = error.message || '短信发送失败，请检查网络连接'
      }
      return
    }

    if (!data?.success) {
      const errMsg = data?.message || ''
      if (errMsg.includes('频率') || errMsg.includes('频繁') || errMsg.includes('60秒')) {
        errorMsg.value = '操作过于频繁，请60秒后再试'
      } else if (errMsg.includes('禁用') || errMsg.includes('封禁') || errMsg.includes('blocked')) {
        errorMsg.value = '该手机号已被禁用，请联系管理员'
      } else {
        errorMsg.value = data?.message || '短信发送失败，请稍后重试'
      }
      return
    }

    codeSent.value = true
    successMsg.value = '验证码已发送，请注意查收短信'
    smsCountdown.value = 60
    const timer = setInterval(() => {
      smsCountdown.value--
      if (smsCountdown.value <= 0) clearInterval(timer)
    }, 1000)
  } catch (e) {
    errorMsg.value = '发送验证码失败，请稍后重试'
  } finally {
    sending.value = false
  }
}

async function handleSmsLogin() {
  if (code.value.length !== 6) return
  if (!/^\d{6}$/.test(code.value)) { errorMsg.value = '验证码只能包含数字，请重新输入'; return }
  if (!agreed.value) { errorMsg.value = '请先阅读并同意用户协议'; return }
  loggingIn.value = true
  errorMsg.value = ''
  successMsg.value = ''
  try {
    // 所有用户（包括演示账号）统一通过 Edge Function 验证
    const { data, error } = await supabase.functions.invoke('verify-sms', {
      body: { phone: phone.value, code: code.value }
    })

    if (error) {
      const errMsg = error.message || ''
      if (errMsg.includes('网络') || errMsg.includes('fetch') || errMsg.includes('timeout')) {
        errorMsg.value = '网络连接失败，请检查网络后重试'
      } else {
        errorMsg.value = error.message || '验证失败，请检查网络连接'
      }
      return
    }

    if (!data?.success) {
      const errMsg = data?.message || ''
      if (errMsg.includes('过期') || errMsg.includes('expired') || errMsg.includes('超时')) {
        errorMsg.value = '验证码已过期，请重新获取'
      } else if (errMsg.includes('错误') || errMsg.includes('不正确') || errMsg.includes('invalid')) {
        errorMsg.value = '验证码错误，请重新输入'
      } else if (errMsg.includes('禁用') || errMsg.includes('封禁') || errMsg.includes('blocked')) {
        errorMsg.value = '您的账号已被禁用，请联系管理员'
      } else if (errMsg.includes('尝试') || errMsg.includes('次数') || errMsg.includes('attempt')) {
        errorMsg.value = '验证码尝试次数过多，请重新获取验证码'
      } else {
        errorMsg.value = data?.message || '验证码错误或已过期，请重新获取'
      }
      return
    }

    // 登录成功
    userStore.setUser(data.user)
    emit('close')
  } catch (e) {
    errorMsg.value = '登录失败，请稍后重试'
  } finally {
    loggingIn.value = false
  }
}

// ========== 邮箱验证码登录 ==========
async function handleSendEmailCode() {
  if (!isValidEmail.value || emailCountdown.value > 0) return
  sendingEmailCode.value = true
  errorMsg.value = ''
  successMsg.value = ''
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        shouldCreateUser: true
      }
    })

    if (error) {
      const errMsg = error.message || ''
      if (errMsg.includes('rate') || errMsg.includes('频率') || errMsg.includes('频繁')) {
        errorMsg.value = '操作过于频繁，请稍后再试'
      } else if (errMsg.includes('网络') || errMsg.includes('fetch') || errMsg.includes('timeout')) {
        errorMsg.value = '网络连接失败，请检查网络后重试'
      } else {
        errorMsg.value = error.message || '邮件发送失败，请检查邮箱地址'
      }
      return
    }

    emailCodeSent.value = true
    successMsg.value = '验证码已发送至您的邮箱，请注意查收'
    emailCountdown.value = 60
    const timer = setInterval(() => {
      emailCountdown.value--
      if (emailCountdown.value <= 0) clearInterval(timer)
    }, 1000)
  } catch (e) {
    errorMsg.value = '发送验证码失败，请稍后重试'
  } finally {
    sendingEmailCode.value = false
  }
}

async function handleEmailLogin() {
  if (emailCode.value.length !== 6) return
  if (!/^\d{6}$/.test(emailCode.value)) { errorMsg.value = '验证码只能包含数字，请重新输入'; return }
  if (!agreed.value) { errorMsg.value = '请先阅读并同意用户协议'; return }
  emailLoggingIn.value = true
  errorMsg.value = ''
  successMsg.value = ''
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email: email.value,
      token: emailCode.value,
      type: 'email'
    })

    if (error) {
      const errMsg = error.message || ''
      if (errMsg.includes('expired') || errMsg.includes('过期') || errMsg.includes('超时')) {
        errorMsg.value = '验证码已过期，请重新获取'
      } else if (errMsg.includes('invalid') || errMsg.includes('错误') || errMsg.includes('不正确')) {
        errorMsg.value = '验证码错误，请重新输入'
      } else if (errMsg.includes('网络') || errMsg.includes('fetch') || errMsg.includes('timeout')) {
        errorMsg.value = '网络连接失败，请检查网络后重试'
      } else {
        errorMsg.value = '验证码错误或已过期，请重新获取'
      }
      return
    }

    if (data.user) {
      await userStore.syncUserFromAuth(data.user)
      emit('close')
    }
  } catch (e) {
    errorMsg.value = '登录失败，请稍后重试'
  } finally {
    emailLoggingIn.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(0, 0, 0, 0.7);
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(4px);
}
.modal-content {
  background: linear-gradient(135deg, #1a1a3e, #0d0d2b);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px; padding: 32px;
  max-width: 420px; width: 90%;
  position: relative;
}
.modal-close {
  position: absolute; top: 12px; right: 16px;
  background: none; border: none; color: #fff;
  font-size: 24px; cursor: pointer;
}
.modal-title { text-align: center; margin-bottom: 16px; color: #fff; }
.modal-subtitle { text-align: center; color: #aaa; margin-bottom: 20px; font-size: 14px; }

/* 认证模式切换标签 */
.auth-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.15);
}
.auth-tab {
  flex: 1;
  padding: 10px 0;
  border: none;
  background: rgba(255, 255, 255, 0.05);
  color: #999;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}
.auth-tab.active {
  background: linear-gradient(45deg, rgba(255, 215, 0, 0.2), rgba(0, 188, 212, 0.2));
  color: #ffd700;
  font-weight: 600;
}
.auth-tab:hover:not(.active) {
  background: rgba(255, 255, 255, 0.1);
  color: #ccc;
}

.login-form { margin-top: 16px; }
.form-group { margin-bottom: 16px; }
.form-group label { display: block; margin-bottom: 6px; color: #ccc; font-size: 14px; }
.form-group input {
  width: 100%; padding: 10px 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff; outline: none;
  box-sizing: border-box;
}
.form-group input:focus { border-color: rgba(255, 255, 255, 0.5); }
.btn-full { width: 100%; }
.error-msg { color: #ff6b6b; font-size: 13px; margin-bottom: 12px; text-align: center; }
.success-msg { color: #4ade80; font-size: 13px; margin-bottom: 12px; text-align: center; }
.hint-msg { color: #fbbf24; font-size: 12px; margin-bottom: 8px; text-align: center; }

/* ==================== 用户协议 & 社群 ==================== */
.modal-footer-section {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.qq-group {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: rgba(255, 215, 0, 0.08);
  border-radius: 8px;
  color: #ccc;
  font-size: 13px;
  margin-bottom: 12px;
}

.qq-icon {
  font-size: 16px;
}

.qq-group strong {
  color: #ffd700;
  font-weight: 600;
}

.agreement-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 12px;
  color: #aaa;
  user-select: none;
}

.agreement-checkbox input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #ffd700;
  cursor: pointer;
  flex-shrink: 0;
}

.check-text {
  line-height: 1.5;
}

.agreement-link {
  color: #ffd700;
  text-decoration: underline;
  cursor: pointer;
}

.agreement-link:hover {
  color: #fff;
}

/* ==================== 用户协议弹窗 ==================== */
.agreement-overlay {
  position: fixed; inset: 0; z-index: 1100;
  background: rgba(0, 0, 0, 0.85);
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(6px);
  padding: 20px;
}

.agreement-content {
  background: linear-gradient(135deg, #1a1a3e, #0d0d2b);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 16px;
  max-width: 560px; width: 100%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}

.agreement-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
}

.agreement-header h3 {
  color: #ffd700;
  margin: 0;
  font-size: 18px;
}

.agreement-close {
  background: none;
  border: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
}

.agreement-body {
  padding: 20px 24px;
  overflow-y: auto;
  color: #ccc;
  font-size: 13px;
  line-height: 1.8;
}

.agreement-body h4 {
  color: #ffd700;
  margin: 16px 0 8px;
  font-size: 14px;
}

.agreement-body p {
  margin: 4px 0;
  text-indent: 1em;
}

.agreement-date {
  text-align: right;
  color: #888;
  margin-top: 16px;
  font-size: 12px;
}

.agreement-footer {
  padding: 16px 24px;
  border-top: 1px solid rgba(255, 215, 0, 0.2);
  text-align: center;
}
</style>