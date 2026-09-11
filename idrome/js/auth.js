/**
 * iDrome — 认证与会话管理
 *
 * 按设计方案第 14 章实现：
 * - checkAuth() — 从 localStorage 读取 rincatia_user，失败则尝试 Supabase getSession()
 * - showLoginPage() — 显示登录引导页
 * - loginRedirect() — 跳转主网站登录页
 * - 跨标签页同步：window.addEventListener('storage', ...)
 * - logout() — 清除 localStorage + Supabase session + SW 缓存
 */

'use strict'

import { state } from './state.js'
import { probeUrl } from './domainFallback.js'

/** localStorage 键名（与主网站共享） */
const USER_STORAGE_KEY = 'rincatia_user'

/** SW 缓存名（注销时需清除） */
const SW_CACHE_NAME = 'idrome-conversations-v1'

/**
 * 获取 Supabase 客户端实例（若已加载）
 * @returns {Object|null}
 */
function getSupabase() {
  // Supabase SDK 通过 vendor 脚本加载，挂载在 window.supabase
  if (typeof window !== 'undefined' && window.supabase) {
    return window.supabase
  }
  return null
}

/**
 * 检查登录状态
 * 1. 从 localStorage 读取共享会话 rincatia_user
 * 2. 若 localStorage 无数据，尝试从 Supabase Auth 恢复会话
 * 3. 均失败返回 null
 *
 * @returns {Promise<Object|null>} 用户对象或 null
 */
export async function checkAuth() {
  // 1. 从 localStorage 读取共享会话
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)

      // 防御性处理：区分用户档案 vs Supabase session 格式
      // Supabase session 格式：{access_token, refresh_token, user: {id, ...}}
      // 用户档案格式：{id, email, nickname, ...}
      let user = null
      if (parsed && parsed.access_token && parsed.user) {
        // 这是 Supabase session 格式 — 提取 user 对象
        console.warn('[iDrome Auth] localStorage 中检测到 Supabase session 格式，提取用户档案')
        user = syncUserFromAuth(parsed.user)
      } else if (parsed && parsed.id) {
        // 这是正常的用户档案格式
        user = parsed
      }

      if (user && user.id) {
        console.log('[iDrome Auth] 从 localStorage 恢复用户会话:', user.nickname || user.id)
        return user
      }
    }
  } catch (e) {
    console.warn('[iDrome Auth] localStorage 读取失败（数据损坏）:', e)
    // 数据损坏时清除，避免反复出错
    try { localStorage.removeItem(USER_STORAGE_KEY) } catch (_) {}
  }

  // 2. 尝试从 Supabase Auth 恢复会话
  //    （使用默认 storageKey 'sb-<ref>-auth-token'，与主站共享）
  const supabase = getSupabase()
  if (supabase && supabase.auth) {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        // 从 Supabase session 构建用户对象并写入 localStorage
        const user = syncUserFromAuth(session.user)
        console.log('[iDrome Auth] 从 Supabase 恢复会话:', user.nickname || user.id)
        return user
      }
    } catch (e) {
      console.warn('[iDrome Auth] Supabase getSession 失败:', e)
    }
  }

  // 3. 未登录
  return null
}

/**
 * 从 Supabase Auth 用户同步到 users 表格式并写入 localStorage
 * @param {Object} authUser - Supabase auth.users 记录
 * @returns {Object} 标准化用户对象
 */
function syncUserFromAuth(authUser) {
  const user = {
    id: authUser.id,
    email: authUser.email || '',
    nickname: authUser.user_metadata?.nickname || authUser.user_metadata?.full_name || '逐梦用户',
    avatar_url: authUser.user_metadata?.avatar_url || '',
    created_at: authUser.created_at || new Date().toISOString()
  }

  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
  } catch (e) {
    console.warn('[iDrome Auth] localStorage 写入失败:', e)
  }

  return user
}

/**
 * 显示登录引导页
 * 在页面中显示登录引导覆盖层（Logo + 说明 + 登录/注册按钮）
 */
export function showLoginPage() {
  console.log('[iDrome Auth] 用户未登录，显示登录引导页')

  // 隐藏主应用内容
  const topNav = document.querySelector('.top-nav')
  const navPanel = document.querySelector('.nav-panel')
  const mainContent = document.querySelector('.main-content')
  const inputArea = document.querySelector('.input-area')

  if (topNav) topNav.style.display = 'none'
  if (navPanel) navPanel.style.display = 'none'
  if (mainContent) mainContent.style.display = 'none'
  if (inputArea) inputArea.style.display = 'none'

  // 显示或创建登录页
  let loginPage = document.getElementById('loginPage')
  if (!loginPage) {
    loginPage = createLoginPage()
    document.body.appendChild(loginPage)
  }
  loginPage.style.display = 'flex'
}

/**
 * 隐藏登录引导页，恢复主应用界面元素
 * 在登录成功后不依赖 reload 的场景下调用
 */
export function hideLoginPage() {
  console.log('[iDrome Auth] 隐藏登录引导页，恢复主界面')

  const loginPage = document.getElementById('loginPage')
  if (loginPage) {
    loginPage.style.display = 'none'
  }

  // 恢复主应用元素显示（与 showLoginPage 中隐藏的元素对应）
  const topNav = document.querySelector('.top-nav')
  const navPanel = document.querySelector('.nav-panel')
  const mainContent = document.querySelector('.main-content')
  const inputArea = document.querySelector('.input-area')

  if (topNav) topNav.style.display = ''
  if (navPanel) navPanel.style.display = ''
  if (mainContent) mainContent.style.display = ''
  if (inputArea) inputArea.style.display = ''
}

/**
 * 创建登录引导页 DOM
 * @returns {HTMLElement}
 */
function createLoginPage() {
  const page = document.createElement('div')
  page.id = 'loginPage'
  page.className = 'login-page'
  page.setAttribute('role', 'main')
  page.innerHTML = `
    <div class="login-container">
      <img src="assets/images/idrome_logo.jpg" alt="iDrome" class="login-logo" width="64" height="64">
      <h1 class="login-title">欢迎使用 iDrome</h1>
      <p class="login-subtitle">DromAI — 你的琳凯蒂亚智慧助手</p>
      <div class="login-divider"></div>
      <p class="login-description">请先登录琳凯蒂亚社区账号以使用 AI 智能助手</p>
      <div class="login-buttons">
        <button class="login-btn login-btn-lytalk" id="lytalkLoginBtn">💬 使用 Lytalk（TT号）登录</button>
        <button class="login-btn login-btn-primary" id="loginRedirectBtn">前往主站登录或注册</button>
      </div>
      <button class="login-temp-btn login-temp-sync-btn" id="tempLoginSyncBtn">☁ 开发测试临时入口</button>
      <p class="login-hint">登录后可跨设备同步对话历史</p>
      <p class="login-temp-hint" id="loginTempHint">云同步测试入口支持账号登录，可在不同设备使用同一账号测试数据同步</p>
    </div>
  `

  // 绑定按钮事件
  setTimeout(() => {
    const loginBtn = page.querySelector('#loginRedirectBtn')
    const tempSyncBtn = page.querySelector('#tempLoginSyncBtn')

    console.log('[iDrome Auth] 登录页按钮绑定:', {
      loginBtn: !!loginBtn,
      tempSyncBtn: !!tempSyncBtn
    })

    if (loginBtn) loginBtn.addEventListener('click', () => loginRedirect('login'))
    const lytalkBtn = page.querySelector('#lytalkLoginBtn')
    if (lytalkBtn) lytalkBtn.addEventListener('click', showLytalkDialog)
    if (tempSyncBtn) {
      tempSyncBtn.addEventListener('click', () => {
        console.log('[iDrome Auth] 云同步测试入口按钮被点击')
        showCloudSyncDialog()
      })
    } else {
      console.error('[iDrome Auth] 未找到云同步测试入口按钮 #tempLoginSyncBtn')
    }
  }, 0)

  return page
}

/** localStorage 键名 — 测试账号列表 */
const TEST_ACCOUNTS_KEY = 'idrome_test_accounts'

/** 预置测试账号（统一密码，首次使用时自动注册） */
const PRESET_TEST_ACCOUNTS = [
  { email: 'idrome.test1@rincatia.com', password: 'Rincatia2026', label: '测试账号 1' },
  { email: 'idrome.test2@rincatia.com', password: 'Rincatia2026', label: '测试账号 2' },
  { email: 'idrome.test3@rincatia.com', password: 'Rincatia2026', label: '测试账号 3' }
]

/**
 * 获取已保存的测试账号列表
 * @returns {Array<{email: string, userId: string, nickname: string}>}
 */
function getTestAccounts() {
  try {
    const stored = localStorage.getItem(TEST_ACCOUNTS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch { return [] }
}

/**
 * 保存测试账号到列表
 * @param {Object} account - { email, userId, nickname }
 */
function saveTestAccount(account) {
  try {
    const accounts = getTestAccounts()
    // 去重（按 email）
    const idx = accounts.findIndex(a => a.email === account.email)
    if (idx !== -1) {
      accounts[idx] = { ...accounts[idx], ...account }
    } else {
      accounts.push(account)
    }
    localStorage.setItem(TEST_ACCOUNTS_KEY, JSON.stringify(accounts))
  } catch (e) {
    console.warn('[iDrome Auth] 保存测试账号失败:', e)
  }
}

/**
 * 登录预置测试账号（仅 signIn，账号需在 Supabase Dashboard 手动创建）
 *
 * @param {string} email - 预置账号邮箱
 * @param {string} password - 预置账号密码
 * @param {HTMLElement} statusEl - 用于显示状态的元素
 * @returns {Promise<boolean>} 是否登录成功
 */
async function autoLoginPresetAccount(email, password, statusEl) {
  const supabase = getSupabase()
  if (!supabase?.auth) {
    if (statusEl) statusEl.textContent = 'Supabase 未初始化'
    return false
  }

  if (statusEl) statusEl.textContent = '正在登录...'
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error && data?.user) {
      saveTestAccount({
        email,
        userId: data.user.id,
        nickname: email.split('@')[0]
      })
      console.log('[iDrome Auth] 预置账号登录成功:', email)
      return true
    }

    // 登录失败 — 根据错误类型给出针对性提示
    if (error) {
      const msg = error.message || ''
      if (msg.includes('Invalid login credentials')) {
        if (statusEl) statusEl.textContent = '账号未创建或密码错误，请在 Supabase Dashboard 手动创建该账号'
      } else if (msg.includes('Email not confirmed')) {
        if (statusEl) statusEl.textContent = '邮箱未确认，请在 Dashboard 中确认该用户邮箱'
      } else if (msg.includes('invalid')) {
        if (statusEl) statusEl.textContent = '邮箱被 Supabase 拒绝: ' + msg
      } else if (msg.includes('Failed to fetch')) {
        if (statusEl) statusEl.textContent = '网络异常，无法连接服务器，请检查网络或代理后重试'
      } else {
        if (statusEl) statusEl.textContent = '登录失败: ' + msg
      }
      console.error('[iDrome Auth] 预置账号登录失败:', msg, '| code:', error.code)
    }
  } catch (e) {
    if (statusEl) statusEl.textContent = '异常: ' + e.message
    console.error('[iDrome Auth] signIn 异常:', e)
  }

  return false
}

/**
 * 显示云同步测试账号选择对话框
 * 展示预置测试账号供一键登录（仅保留 3 个测试账号登录按钮）
 */
function showCloudSyncDialog() {
  console.log('[iDrome Auth] showCloudSyncDialog 被调用')

  // 移除已有对话框
  const existing = document.getElementById('cloudSyncDialog')
  if (existing) existing.remove()

  // 合并预置账号与已保存账号信息（用于显示 userId）
  const savedAccounts = getTestAccounts() || []
  const presetWithInfo = PRESET_TEST_ACCOUNTS.map(p => {
    const saved = savedAccounts.find(s => s.email === p.email)
    return { ...p, userId: saved?.userId || null }
  })

  const dialog = document.createElement('div')
  dialog.id = 'cloudSyncDialog'
  dialog.className = 'cloud-sync-dialog-overlay'
  dialog.innerHTML = `
    <div class="cloud-sync-dialog">
      <div class="cloud-sync-header">
        <h2>云同步测试 — 账号选择</h2>
        <button class="cloud-sync-close" id="cloudSyncClose">✕</button>
      </div>
      <div class="cloud-sync-body">
        <div class="cloud-sync-section">
          <label class="cloud-sync-label">预置测试账号（点击直接登录）</label>
          <div class="cloud-sync-account-list" id="presetAccountList">
            ${presetWithInfo.map(acc => `
              <div class="cloud-sync-account-item cloud-sync-preset-item" data-email="${acc.email}" data-password="${acc.password}">
                <div class="cloud-sync-account-info">
                  <div class="cloud-sync-account-email">${acc.label}</div>
                  <div class="cloud-sync-account-uid">${acc.email}${acc.userId ? ' · ID: ' + acc.userId.slice(0, 8) + '...' : ''}</div>
                </div>
                <button class="cloud-sync-account-select" data-email="${acc.email}" data-password="${acc.password}">登录</button>
              </div>
            `).join('')}
          </div>
          <div class="cloud-sync-status" id="csPresetStatus"></div>
        </div>
      </div>
      <div class="cloud-sync-footer">
        <p class="cloud-sync-hint">提示：在不同设备选择同一测试账号即可同步对话数据</p>
      </div>
  `

  document.body.appendChild(dialog)

  // 绑定事件
  const closeBtn = dialog.querySelector('#cloudSyncClose')
  const presetStatus = dialog.querySelector('#csPresetStatus')
  const presetButtons = dialog.querySelectorAll('.cloud-sync-account-select')

  // 关闭
  closeBtn.addEventListener('click', () => dialog.remove())
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.remove()
  })

  // 预置账号一键登录
  presetButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const email = btn.dataset.email
      const password = btn.dataset.password

      // 禁用所有预置按钮
      presetButtons.forEach(b => { b.disabled = true; b.textContent = '...' })
      btn.textContent = '登录中'
      presetStatus.textContent = ''
      presetStatus.style.color = ''

      const ok = await autoLoginPresetAccount(email, password, presetStatus)
      if (ok) {
        presetStatus.style.color = 'var(--accent-green, #10b981)'
        presetStatus.textContent = '登录成功，正在刷新...'
        setTimeout(() => {
          dialog.remove()
          window.location.reload()
        }, 800)
      } else {
        // 恢复按钮状态
        presetButtons.forEach(b => { b.disabled = false; b.textContent = '登录' })
      }
    })
  })
}

/**
 * Lytalk（TT号）登录 — 与主站共用同一 Edge Function
 * 流程：Lytalk 密码验证（双域名回退）→ 换本站原生会话 → setSession（写入共享 storageKey）
 * 密码只提交给 Lytalk 官方端点，不经过本站任何服务器
 *
 * @param {string} ttid - Lytalk TT号（6 位或 11 位）
 * @param {string} password - Lytalk 密码
 * @param {HTMLElement} statusEl - 用于显示状态的元素
 * @returns {Promise<boolean>} 是否登录成功
 */
async function loginWithLytalk(ttid, password, statusEl) {
  const cfg = window.IDROME_CONFIG?.lytalk
  if (!cfg) {
    if (statusEl) statusEl.textContent = 'Lytalk 配置缺失'
    return false
  }
  if (!/^[1-9]\d{5}$|^1[3-9]\d{9}$/.test(ttid)) {
    if (statusEl) statusEl.textContent = 'TT号格式不正确（6 位或 11 位数字）'
    return false
  }

  // 1. Lytalk 密码验证（@rincatia.com → 凭据错误回退 @lyt.com）
  let lytalkToken = null
  let lastMsg = ''
  for (const domain of cfg.domains) {
    try {
      const res = await fetch(`${cfg.url}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: cfg.anonKey },
        body: JSON.stringify({ email: `${ttid}@${domain}`, password, gotrue_meta_security: {} })
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.access_token) { lytalkToken = data.access_token; break }
      lastMsg = data.error_description || data.msg || data.error || '登录失败'
      if (!/Invalid login credentials/i.test(lastMsg)) break   // 非凭据错误不回退
    } catch (e) { lastMsg = e.message }
  }
  if (!lytalkToken) {
    if (statusEl) statusEl.textContent = /Invalid login/i.test(lastMsg)
      ? 'TT号或密码错误'
      : ('Lytalk 登录失败：' + lastMsg)
    return false
  }

  // 2. 换取本站原生会话（与主站走同一个 Edge Function）
  const main = window.IDROME_CONFIG
  const fnRes = await fetch(`${main.supabaseUrl}/functions/v1/lytalk-login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: main.supabaseAnonKey,
      Authorization: `Bearer ${main.supabaseAnonKey}`
    },
    body: JSON.stringify({ lytalk_token: lytalkToken })
  })
  const fnData = await fnRes.json().catch(() => ({}))
  if (!fnRes.ok || !fnData?.success || !fnData?.session) {
    if (statusEl) statusEl.textContent = fnData?.message || '登录失败，请稍后重试'
    return false
  }

  // 3. 建立本站会话（写入共享 storageKey 'sb-<ref>-auth-token' → 主站/其他标签页同步）
  const supabase = getSupabase()
  if (!supabase?.auth) {
    if (statusEl) statusEl.textContent = 'Supabase 未初始化'
    return false
  }
  const { error } = await supabase.auth.setSession({
    access_token: fnData.session.access_token,
    refresh_token: fnData.session.refresh_token
  })
  if (error) {
    if (statusEl) statusEl.textContent = '会话建立失败：' + error.message
    return false
  }

  // 4. 写入共享用户档案（rincatia_user，主站 store 与 iDrome checkAuth 均读取）
  syncUserFromAuth({
    id: fnData.user.id,
    email: fnData.user.email,
    user_metadata: { nickname: fnData.user.nickname, avatar_url: fnData.user.avatar_url },
    created_at: new Date().toISOString()
  })
  console.log('[iDrome Auth] Lytalk 登录成功:', fnData.user.nickname || fnData.user.id)
  return true
}

/** 《iDrome AI 工具使用协议》全文（iDrome 专用协议，替代琳凯蒂亚星球用户协议） */
const IDROME_AGREEMENT_HTML = `
  <h3>一、协议的接受</h3>
  <p>1.1 iDrome 是琳凯蒂亚星球（rincatian.top / rincatia.com）推出的 AI 智能助手（DromAI），为社区用户提供田语学习辅助、世界观百科问答与对话交流等服务。</p>
  <p>1.2 您使用琳凯蒂亚社区账号或 Lytalk（青聊）TT号登录并使用 iDrome，即视为已阅读、理解并同意本协议的全部内容。</p>
  <h3>二、AI 生成内容说明</h3>
  <p>2.1 iDrome 的回复由人工智能模型自动生成，可能存在错误、遗漏或与事实不符之处（即"幻觉"内容），不构成任何形式的专业建议。</p>
  <p>2.2 涉及琳凯蒂亚世界观与田语的内容，以社区官方资料为准；AI 生成内容仅供参考，请您自行甄别。</p>
  <h3>三、账号与使用规范</h3>
  <p>3.1 您应妥善保管账号凭据，不得出借、出租、转让账号，不得将 iDrome 用于自动化批量调用或任何破坏服务稳定性的行为。</p>
  <p>3.2 您承诺不利用 iDrome 生成、传播法律法规禁止的内容，包括但不限于危害国家安全、暴力恐怖、色情低俗、侵权诽谤等内容；系统对异常请求设有检测与限流措施。</p>
  <p>3.3 如您违反上述规范，平台有权视情节暂停或终止向您提供服务。</p>
  <h3>四、数据与隐私</h3>
  <p>4.1 为实现跨设备同步，您的对话记录将存储于云端；您可随时删除对话记录，注销账号时相关数据将一并清除。</p>
  <p>4.2 未经您的明确授权，平台不会对外公开您的对话内容。</p>
  <h3>五、服务变更与免责声明</h3>
  <p>5.1 iDrome 依赖第三方模型服务，可能因配额、网络或服务调整等原因暂时不可用或功能变更，恕不另行通知。</p>
  <p>5.2 对于因不可抗力、第三方服务故障或您自身操作不当造成的损失，平台在法律允许的最大范围内不承担责任。</p>
  <h3>六、协议的更新</h3>
  <p>6.1 本协议可能随服务发展而更新，更新后的协议将在本页面公布；协议更新后您继续使用 iDrome，即视为接受更新后的内容。</p>
`

/**
 * 显示《iDrome AI 工具使用协议》全文弹窗
 * 底部提供「同意并继续」按钮，一键勾选 Lytalk 登录对话框中的协议复选框
 */
function showIdromeAgreement() {
  const existing = document.getElementById('idromeAgreementDialog')
  if (existing) existing.remove()

  const dialog = document.createElement('div')
  dialog.id = 'idromeAgreementDialog'
  dialog.className = 'cloud-sync-dialog-overlay'
  dialog.innerHTML = `
    <div class="cloud-sync-dialog agreement-dialog">
      <div class="cloud-sync-header">
        <h2>《iDrome AI 工具使用协议》</h2>
        <button class="cloud-sync-close" id="idromeAgreementClose">✕</button>
      </div>
      <div class="agreement-body">${IDROME_AGREEMENT_HTML}</div>
      <div class="cloud-sync-footer">
        <button class="cloud-sync-btn cloud-sync-btn-primary" id="idromeAgreementAccept">同意并继续</button>
      </div>
    </div>
  `
  document.body.appendChild(dialog)

  const close = () => dialog.remove()
  dialog.querySelector('#idromeAgreementClose').addEventListener('click', close)
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) close()
  })
  dialog.querySelector('#idromeAgreementAccept').addEventListener('click', () => {
    const checkbox = document.querySelector('#ltAgreed')
    if (checkbox) checkbox.checked = true
    close()
  })
}

/**
 * 显示 Lytalk（TT号）登录对话框
 * 仿云同步对话框风格：TT号 + 密码 + 协议勾选，成功后刷新页面进入应用
 */
function showLytalkDialog() {
  console.log('[iDrome Auth] showLytalkDialog 被调用')

  // 移除已有对话框
  const existing = document.getElementById('lytalkDialog')
  if (existing) existing.remove()

  const dialog = document.createElement('div')
  dialog.id = 'lytalkDialog'
  dialog.className = 'cloud-sync-dialog-overlay'
  dialog.innerHTML = `
    <div class="cloud-sync-dialog">
      <div class="cloud-sync-header">
        <h2>Lytalk（TT号）登录</h2>
        <button class="cloud-sync-close" id="lytalkClose">✕</button>
      </div>
      <div class="cloud-sync-body">
        <div class="cloud-sync-section">
          <p class="lytalk-dialog-tip">使用琳凯蒂亚官方即时通讯 Lytalk（青聊）的 TT 号登录，与主站账号互通</p>
          <div class="cloud-sync-form-group">
            <label class="cloud-sync-label" for="ltTtid">TT号</label>
            <input type="text" id="ltTtid" class="cloud-sync-input" placeholder="6 位或 11 位数字，如：100001" autocomplete="username" inputmode="numeric">
          </div>
          <div class="cloud-sync-form-group">
            <label class="cloud-sync-label" for="ltPassword">密码</label>
            <input type="password" id="ltPassword" class="cloud-sync-input" placeholder="Lytalk 账号密码" autocomplete="current-password">
          </div>
          <label class="lytalk-agreement">
            <input type="checkbox" id="ltAgreed">
            <span>我已阅读并同意<a href="#" id="ltAgreementLink">《iDrome AI 工具使用协议》</a></span>
          </label>
          <div class="cloud-sync-error" id="ltStatus"></div>
          <div class="cloud-sync-buttons">
            <button class="cloud-sync-btn cloud-sync-btn-primary" id="ltLoginBtn">登录</button>
          </div>
        </div>
      </div>
      <div class="cloud-sync-footer">
        <p class="cloud-sync-hint">还没有TT账号？<a href="https://lytalk.rincatian.top" target="_blank" rel="noopener noreferrer" id="lytalkRegisterLink" class="lytalk-register-link">前往Lytalk注册</a></p>
      </div>
    </div>
  `

  document.body.appendChild(dialog)

  // 绑定事件
  const closeBtn = dialog.querySelector('#lytalkClose')
  const loginBtn = dialog.querySelector('#ltLoginBtn')
  const ttidInput = dialog.querySelector('#ltTtid')
  const passwordInput = dialog.querySelector('#ltPassword')
  const agreedInput = dialog.querySelector('#ltAgreed')
  const agreementLink = dialog.querySelector('#ltAgreementLink')
  const statusEl = dialog.querySelector('#ltStatus')

  closeBtn.addEventListener('click', () => dialog.remove())
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.remove()
  })
  agreementLink.addEventListener('click', (e) => {
    e.preventDefault()
    showIdromeAgreement()
  })

  // 前往 Lytalk 注册：原生 <a target="_blank"> 跳转不受弹窗拦截影响
  // 打开弹窗后并行探测两个镜像域名（rincatian.top ↔ rincatia.com），将 href 替换为首个可用域名
  const registerLink = dialog.querySelector('#lytalkRegisterLink')
  if (registerLink) {
    const regCandidates = ['https://lytalk.rincatian.top', 'https://lytalk.rincatia.com']
    Promise.all(regCandidates.map(u => probeUrl(u).then(ok => ({ u, ok }))))
      .then(results => {
        const hit = results.find(r => r.ok)
        if (hit) registerLink.href = hit.u
      })
  }

  async function submit() {
    const ttid = ttidInput.value.trim()
    const password = passwordInput.value
    statusEl.style.color = ''

    if (!ttid || !password) { statusEl.textContent = '请输入 TT号 和密码'; return }
    if (!agreedInput.checked) { statusEl.textContent = '请先阅读并同意《iDrome AI 工具使用协议》'; return }

    loginBtn.disabled = true
    loginBtn.textContent = '登录中...'
    statusEl.textContent = ''

    const ok = await loginWithLytalk(ttid, password, statusEl)
    if (ok) {
      statusEl.style.color = 'var(--accent-green, #10b981)'
      statusEl.textContent = '登录成功，正在刷新...'
      setTimeout(() => {
        dialog.remove()
        window.location.reload()
      }, 800)
    } else {
      loginBtn.disabled = false
      loginBtn.textContent = '登录'
    }
  }

  loginBtn.addEventListener('click', submit)
  ttidInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') passwordInput.focus()
  })
  passwordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submit()
  })
}

/**
 * 跳转主网站登录/注册页
 * 主站为 hash 路由（无独立 /login 页面），跳转首页并通过 showLogin query 唤起登录弹窗
 * @param {'login'|'register'} type
 */
export function loginRedirect(type = 'login') {
  const basePath = window.location.origin
  const fullPath = `${basePath}/#/?showLogin=true&mode=${type === 'register' ? 'register' : 'login'}`

  console.log('[iDrome Auth] 跳转主网站:', fullPath)
  window.location.href = fullPath
}

/**
 * 退出登录
 * 清除 localStorage + Supabase session + SW 缓存
 */
export async function logout() {
  console.log('[iDrome Auth] 退出登录')

  // 1. 清除 localStorage
  try {
    localStorage.removeItem(USER_STORAGE_KEY)
    // 清除 iDrome 用户特定的数据（防止用户 B 看到用户 A 的分组）
    localStorage.removeItem('idrome-custom-groups')
    localStorage.removeItem('idrome-conv-group-map')
  } catch (e) {
    console.warn('[iDrome Auth] localStorage 清除失败:', e)
  }

  // 2. 清除 Supabase session
  const supabase = getSupabase()
  if (supabase && supabase.auth) {
    try {
      await supabase.auth.signOut()
    } catch (e) {
      console.warn('[iDrome Auth] Supabase signOut 失败:', e)
    }
  }

  // 3. 清除 Service Worker 缓存（防止用户 B 看到用户 A 的对话）
  if ('caches' in window) {
    try {
      await caches.delete(SW_CACHE_NAME)
      console.log('[iDrome Auth] SW 缓存已清除:', SW_CACHE_NAME)
    } catch (e) {
      console.warn('[iDrome Auth] SW 缓存清除失败:', e)
    }
  }

  // 4. 更新状态
  state.currentUser = null

  // 5. 显示登录页
  showLoginPage()
}

/**
 * 设置跨标签页登录状态同步
 * 监听 storage 事件，当其他标签页登录/注销时自动更新
 * @param {Function} onLogin - 其他标签页登录时的回调
 * @param {Function} onLogout - 其他标签页注销时的回调
 */
export function setupCrossTabSync(onLogin, onLogout) {
  window.addEventListener('storage', (event) => {
    if (event.key !== USER_STORAGE_KEY) return

    if (event.newValue) {
      // 用户在其他标签页登录了
      try {
        const user = JSON.parse(event.newValue)
        if (user && user.id) {
          console.log('[iDrome Auth] 检测到跨标签页登录:', user.nickname || user.id)
          state.currentUser = user
          if (typeof onLogin === 'function') onLogin(user)
        }
      } catch (e) {
        console.warn('[iDrome Auth] 跨标签页用户数据解析失败:', e)
      }
    } else {
      // 用户在其他标签页注销了
      console.log('[iDrome Auth] 检测到跨标签页注销')
      state.currentUser = null
      if (typeof onLogout === 'function') onLogout()
    }
  })
}
