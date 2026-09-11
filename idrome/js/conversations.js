/**
 * iDrome — 对话管理模块（数据持久化）
 *
 * 按设计方案第 13 章和分步执行步骤 5.2 实现：
 * - createConversation(mode) — 插入 conversations 表，返回新对话
 * - loadConversations(page=0) — 分页查询对话列表
 * - deleteConversation(id) — 删除对话（CASCADE 删除消息）
 * - renameConversation(id, title) — 更新标题
 * - togglePin(id, pinned) — 切换置顶
 * - toggleArchive(id, archived) — 切换归档
 * - generateTitle(firstMessage) — AI 自动生成标题
 * - loadMessages(conversationId) — 加载对话消息
 * - insertMessage(msg) — 插入消息
 * - updateMessageContent(id, content) — 更新消息内容
 * - markMessagesExpired(conversationId, afterCreatedAt) — 标记后续消息过期
 * - deleteMessage(id) — 删除单条消息
 * - searchMessageContent(query) — 消息内容搜索
 * - batchDeleteConversations(ids) — 批量删除对话
 *
 * 分页策略（设计方案第 13.4 节）：
 * - 对话列表：每页 20 条
 * - 消息列表：每页 100 条
 * - 超过 1000 行使用循环分批获取
 *
 * 安全架构：
 * - 通过 Supabase SDK 调用，RLS 自动过滤用户数据
 * - 不直接持有 service_role 密钥
 */

'use strict'

/** 每页对话数量 */
const CONVERSATIONS_PER_PAGE = 20

/** 每页消息数量 */
const MESSAGES_PER_PAGE = 100

/**
 * 获取 Supabase 客户端
 * @returns {Object|null}
 */
function getSupabase() {
  if (typeof window !== 'undefined' && window.supabase) {
    return window.supabase
  }
  return null
}

/**
 * 获取当前用户 ID（支持临时用户云同步）
 *
 * 优先级：
 * 1. localStorage 中的用户 ID（若为有效 UUID）
 * 2. Supabase session 中的用户 ID（匿名认证或正式登录）
 * 3. 返回 null
 *
 * 注意：temp- 开头的 ID 不是有效 UUID，不能直接用于 Supabase 写入，
 *       需通过匿名认证获取真实 UUID。
 *
 * @returns {Promise<string|null>}
 */
async function getCurrentUserId() {
  // 1. 从 localStorage 读取
  let localId = null
  try {
    const stored = localStorage.getItem('rincatia_user')
    if (stored) {
      const user = JSON.parse(stored)
      if (user && user.id) localId = user.id
    }
  } catch (e) {
    // 忽略
  }

  // 2. 若 localStorage ID 是有效 UUID（非 temp- 开头），直接返回
  if (localId && !localId.startsWith('temp-')) {
    return localId
  }

  // 3. 从 Supabase session 获取真实用户 ID
  const supabase = getSupabase()
  if (supabase?.auth) {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.id) {
        // 更新 localStorage 中的用户 ID（将 temp-xxx 替换为真实 UUID）
        if (localId && localId.startsWith('temp-')) {
          try {
            const stored = localStorage.getItem('rincatia_user')
            if (stored) {
              const user = JSON.parse(stored)
              user.id = session.user.id
              user.cloud_sync = true
              localStorage.setItem('rincatia_user', JSON.stringify(user))
              console.log('[iDrome Conv] 用户 ID 已更新为 Supabase UUID:', session.user.id)
            }
          } catch (_) {}
        }
        return session.user.id
      }
    } catch (e) {
      console.warn('[iDrome Conv] 获取 Supabase session 失败:', e.message)
    }
  }

  // 4. 返回 localId（可能是 temp-xxx，仅用于本地模式）
  return localId
}

/* ============================================================
 * 对话 CRUD
 * ============================================================ */

/**
 * 创建新对话
 * @param {string} mode - 对话模式 'general' | 'tian-translation' | 'novel-culture'
 * @param {string} model - 模型名称
 * @returns {Promise<Object|null>} 新对话对象
 */
export async function createConversation(mode = 'general', model = 'deepseek-v4-flash') {
  const supabase = getSupabase()
  if (!supabase) {
    console.warn('[iDrome Conv] Supabase 未初始化，无法创建对话')
    return null
  }

  const userId = await getCurrentUserId()
  if (!userId) {
    console.warn('[iDrome Conv] 无用户 ID，无法创建对话')
    return null
  }

  try {
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user_id: userId,
        title: '新对话',
        mode,
        model,
        pinned: false,
        archived: false
      })
      .select()
      .single()

    if (error) {
      console.error('[iDrome Conv] 创建对话失败:', error.message)
      return null
    }

    console.log('[iDrome Conv] 创建对话成功:', data.id)
    return data
  } catch (e) {
    console.error('[iDrome Conv] 创建对话异常:', e)
    return null
  }
}

/**
 * 分页加载对话列表
 * @param {number} page - 页码（从 0 开始）
 * @returns {Promise<Array>} 对话数组
 */
export async function loadConversations(page = 0) {
  const supabase = getSupabase()
  if (!supabase) return []

  const userId = await getCurrentUserId()
  if (!userId) return []

  try {
    const from = page * CONVERSATIONS_PER_PAGE
    const to = from + CONVERSATIONS_PER_PAGE - 1

    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .range(from, to)

    if (error) {
      console.error('[iDrome Conv] 加载对话列表失败:', error.message)
      return []
    }

    return data || []
  } catch (e) {
    console.error('[iDrome Conv] 加载对话列表异常:', e)
    return []
  }
}

/**
 * 加载全部对话（自动分页，用于初始化）
 * 处理超过 1000 行的情况
 * @returns {Promise<Array>}
 */
export async function loadAllConversations() {
  const supabase = getSupabase()
  if (!supabase) return []

  const userId = await getCurrentUserId()
  if (!userId) return []

  let allData = []
  let page = 0

  try {
    while (true) {
      const from = page * CONVERSATIONS_PER_PAGE
      const to = from + CONVERSATIONS_PER_PAGE - 1

      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .range(from, to)

      if (error) {
        console.error('[iDrome Conv] 加载全部对话失败:', error.message)
        break
      }

      if (!data || data.length === 0) break

      allData = allData.concat(data)

      // 不足一页，说明已到末尾
      if (data.length < CONVERSATIONS_PER_PAGE) break

      page++

      // 安全限制：最多加载 50 页（1000 条）
      if (page >= 50) break
    }

    return allData
  } catch (e) {
    console.error('[iDrome Conv] 加载全部对话异常:', e)
    return allData
  }
}

/**
 * 删除对话（CASCADE 删除消息）
 * @param {string} id - 对话 ID
 * @returns {Promise<boolean>}
 */
export async function deleteConversation(id) {
  const supabase = getSupabase()
  if (!supabase) return false

  try {
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[iDrome Conv] 删除对话失败:', error.message)
      return false
    }

    console.log('[iDrome Conv] 删除对话成功:', id)
    return true
  } catch (e) {
    console.error('[iDrome Conv] 删除对话异常:', e)
    return false
  }
}

/**
 * 重命名对话
 * @param {string} id - 对话 ID
 * @param {string} title - 新标题
 * @returns {Promise<boolean>}
 */
export async function renameConversation(id, title) {
  const supabase = getSupabase()
  if (!supabase) return false

  try {
    const { error } = await supabase
      .from('conversations')
      .update({ title })
      .eq('id', id)

    if (error) {
      console.error('[iDrome Conv] 重命名对话失败:', error.message)
      return false
    }
    return true
  } catch (e) {
    console.error('[iDrome Conv] 重命名对话异常:', e)
    return false
  }
}

/**
 * 切换置顶状态
 * @param {string} id - 对话 ID
 * @param {boolean} pinned - 是否置顶
 * @returns {Promise<boolean>}
 */
export async function togglePin(id, pinned) {
  const supabase = getSupabase()
  if (!supabase) return false

  try {
    const { error } = await supabase
      .from('conversations')
      .update({ pinned })
      .eq('id', id)

    if (error) {
      console.error('[iDrome Conv] 切换置顶失败:', error.message)
      return false
    }
    return true
  } catch (e) {
    console.error('[iDrome Conv] 切换置顶异常:', e)
    return false
  }
}

/**
 * 切换归档状态
 * @param {string} id - 对话 ID
 * @param {boolean} archived - 是否归档
 * @returns {Promise<boolean>}
 */
export async function toggleArchive(id, archived) {
  const supabase = getSupabase()
  if (!supabase) return false

  try {
    const { error } = await supabase
      .from('conversations')
      .update({ archived })
      .eq('id', id)

    if (error) {
      console.error('[iDrome Conv] 切换归档失败:', error.message)
      return false
    }
    return true
  } catch (e) {
    console.error('[iDrome Conv] 切换归档异常:', e)
    return false
  }
}

/**
 * 更新对话的 updated_at 时间戳（发送消息时调用）
 * @param {string} id - 对话 ID
 * @returns {Promise<void>}
 */
export async function touchConversation(id) {
  const supabase = getSupabase()
  if (!supabase || !id) return

  try {
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', id)
  } catch (e) {
    // 静默失败 — 不影响主流程
  }
}

/**
 * 更新对话模式
 * @param {string} id - 对话 ID
 * @param {string} mode - 模式
 * @returns {Promise<boolean>}
 */
export async function updateConversationMode(id, mode) {
  const supabase = getSupabase()
  if (!supabase) return false

  try {
    const { error } = await supabase
      .from('conversations')
      .update({ mode })
      .eq('id', id)

    if (error) {
      console.error('[iDrome Conv] 更新对话模式失败:', error.message)
      return false
    }
    return true
  } catch (e) {
    console.error('[iDrome Conv] 更新对话模式异常:', e)
    return false
  }
}

/**
 * 更新对话模型
 * @param {string} id - 对话 ID
 * @param {string} model - 模型名称
 * @returns {Promise<boolean>}
 */
export async function updateConversationModel(id, model) {
  const supabase = getSupabase()
  if (!supabase) return false

  try {
    const { error } = await supabase
      .from('conversations')
      .update({ model })
      .eq('id', id)

    if (error) {
      console.error('[iDrome Conv] 更新对话模型失败:', error.message)
      return false
    }
    return true
  } catch (e) {
    console.error('[iDrome Conv] 更新对话模型异常:', e)
    return false
  }
}

/* ============================================================
 * 消息 CRUD
 * ============================================================ */

/**
 * 加载对话的消息列表
 * @param {string} conversationId - 对话 ID
 * @param {number} page - 页码
 * @returns {Promise<Array>} 消息数组
 */
export async function loadMessages(conversationId, page = 0) {
  const supabase = getSupabase()
  if (!supabase || !conversationId) return []

  try {
    const from = page * MESSAGES_PER_PAGE
    const to = from + MESSAGES_PER_PAGE - 1

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .order('updated_at', { ascending: true })
      .order('id', { ascending: true })
      .range(from, to)

    if (error) {
      console.error('[iDrome Conv] 加载消息失败:', error.message)
      return []
    }

    return data || []
  } catch (e) {
    console.error('[iDrome Conv] 加载消息异常:', e)
    return []
  }
}

/**
 * 加载对话全部消息（自动分页）
 * @param {string} conversationId - 对话 ID
 * @returns {Promise<Array>}
 */
export async function loadAllMessages(conversationId) {
  const supabase = getSupabase()
  if (!supabase || !conversationId) return []

  let allData = []
  let page = 0

  try {
    while (true) {
      const from = page * MESSAGES_PER_PAGE
      const to = from + MESSAGES_PER_PAGE - 1

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .order('updated_at', { ascending: true })
        .order('id', { ascending: true })
        .range(from, to)

      if (error) {
        console.error('[iDrome Conv] 加载全部消息失败:', error.message)
        break
      }

      if (!data || data.length === 0) break

      allData = allData.concat(data)

      if (data.length < MESSAGES_PER_PAGE) break

      page++

      // 安全限制
      if (page >= 100) break
    }

    // 排序日志：记录数据库返回的原始顺序
    console.log('[iDrome Conv] loadAllMessages 返回', allData.length, '条消息，原始顺序:', allData.map(m => ({
      id: m.id,
      role: m.role,
      created_at: m.created_at,
      updated_at: m.updated_at
    })))

    return allData
  } catch (e) {
    console.error('[iDrome Conv] 加载全部消息异常:', e)
    return allData
  }
}

/**
 * 插入消息
 * @param {Object} msg - 消息对象 { conversation_id, role, content, reasoning?, expired?, version?, created_at? }
 *                       created_at 可选，未提供时使用当前时间。建议显式传入以确保消息顺序与客户端创建顺序一致。
 * @returns {Promise<Object|null>} 插入后的消息（含 id）
 */
export async function insertMessage(msg) {
  const supabase = getSupabase()
  if (!supabase) return null

  // 获取当前用户 ID（messages 表的 user_id 为 NOT NULL，必须传入）
  const userId = await getCurrentUserId()
  if (!userId) {
    console.error('[iDrome Conv] insertMessage 失败：无法获取用户 ID')
    return null
  }

  // 使用客户端时间戳 — 确保 user/AI 消息的 created_at 严格反映创建顺序
  // （dbInsertMessage 是 fire-and-forget，依赖数据库 DEFAULT now() 会因网络延迟导致顺序错乱）
  const clientTimestamp = msg.created_at || new Date().toISOString()

  // 尝试完整字段插入（含 reasoning/reasoning_time/version/expired/user_id/created_at/updated_at）
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: msg.conversation_id,
        user_id: userId,
        role: msg.role,
        content: msg.content || '',
        reasoning: msg.reasoning || null,
        reasoning_time: msg.reasoning_time || null,
        expired: msg.expired || false,
        version: msg.version || 1,
        created_at: clientTimestamp,
        updated_at: clientTimestamp
      })
      .select()
      .single()

    if (!error) return data

    // 完整字段失败 — 记录详细错误信息
    console.error('[iDrome Conv] insertMessage 完整字段失败:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
      conversation_id: msg.conversation_id
    })

    // 字段缺失时（error code 42703 = undefined_column）降级为基础字段（仍含 user_id）
    if (error.code === '42703' || error.message.includes('column') || error.message.includes('Could not find')) {
      console.warn('[iDrome Conv] 消息表缺少部分字段，降级为基础字段重试')
      const { data: data2, error: error2 } = await supabase
        .from('messages')
        .insert({
          conversation_id: msg.conversation_id,
          user_id: userId,
          role: msg.role,
          content: msg.content || '',
          created_at: clientTimestamp,
          updated_at: clientTimestamp
        })
        .select()
        .single()

      if (!error2) return data2
      console.error('[iDrome Conv] insertMessage 基础字段也失败:', {
        message: error2.message,
        code: error2.code,
        details: error2.details,
        hint: error2.hint
      })
    }
    return null
  } catch (e) {
    console.error('[iDrome Conv] insertMessage 异常:', e)
    return null
  }
}

/**
 * 诊断消息表状态（用于排查 messages 同步失败问题）
 * 检查：表是否存在、RLS 是否正确、INSERT 是否被允许
 *
 * @returns {Promise<Object>} 诊断结果
 */
export async function diagnoseMessagesTable() {
  const supabase = getSupabase()
  const result = {
    supabaseReady: !!supabase,
    authUser: null,
    tableExists: false,
    tableError: null,
    rlsCheck: null,
    insertTest: null,
    conversationId: null
  }

  if (!supabase) {
    result.tableError = 'Supabase 客户端未初始化'
    return result
  }

  // 1. 获取当前用户
  try {
    const { data: { session } } = await supabase.auth.getSession()
    result.authUser = session?.user ? {
      id: session.user.id,
      email: session.user.email
    } : null
  } catch (e) {
    result.tableError = '获取 session 失败: ' + e.message
  }

  // 2. 检查 messages 表是否存在（尝试 SELECT LIMIT 0）
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('id')
      .limit(1)

    if (error) {
      result.tableExists = false
      result.tableError = {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      }
    } else {
      result.tableExists = true
      result.rlsCheck = `SELECT 成功，返回 ${data.length} 条记录`
    }
  } catch (e) {
    result.tableError = 'SELECT 异常: ' + e.message
  }

  // 3. 获取最新对话 ID（用于测试 INSERT）
  if (result.authUser) {
    try {
      const { data: convs, error: convErr } = await supabase
        .from('conversations')
        .select('id, user_id, title')
        .eq('user_id', result.authUser.id)
        .order('updated_at', { ascending: false })
        .limit(1)

      if (!convErr && convs && convs.length > 0) {
        result.conversationId = convs[0].id
        result.conversationUserId = convs[0].user_id
        result.userIdMatch = convs[0].user_id === result.authUser.id

        // 4. 尝试 INSERT 测试消息（含 user_id，因 messages 表 user_id 为 NOT NULL）
        const { data: insData, error: insError } = await supabase
          .from('messages')
          .insert({
            conversation_id: convs[0].id,
            user_id: result.authUser.id,
            role: 'user',
            content: '__diagnostic_test__'
          })
          .select()
          .single()

        if (insError) {
          result.insertTest = {
            success: false,
            message: insError.message,
            code: insError.code,
            details: insError.details,
            hint: insError.hint
          }
        } else {
          result.insertTest = {
            success: true,
            insertedId: insData?.id
          }
          // 清理测试消息
          if (insData?.id) {
            await supabase.from('messages').delete().eq('id', insData.id)
          }
        }
      } else if (convErr) {
        result.conversationId = '查询对话失败: ' + convErr.message
      } else {
        result.conversationId = '无对话记录'
      }
    } catch (e) {
      result.conversationId = '查询异常: ' + e.message
    }
  }

  console.log('[iDrome Conv] ===== 消息表诊断结果 =====')
  console.log(JSON.stringify(result, null, 2))
  console.log('====================================')

  return result
}

// 将诊断函数挂载到 window，便于从控制台调用
if (typeof window !== 'undefined') {
  window.diagnoseMessagesTable = diagnoseMessagesTable
}

/**
 * 更新消息内容（AI 回复完成后调用）
 * @param {number} id - 消息 ID
 * @param {string} content - 完整内容
 * @param {string} [reasoning] - 思考过程
 * @param {string} [reasoningTime] - 思考耗时（如 "3.2s"）
 * @returns {Promise<boolean>}
 */
export async function updateMessageContent(id, content, reasoning, reasoningTime) {
  const supabase = getSupabase()
  if (!supabase) return false

  try {
    // 尝试 RPC 乐观锁更新（含 reasoning + reasoning_time + version 自增）
    const { error } = await supabase.rpc('update_message_with_version', {
      msg_id: id,
      new_content: content,
      new_reasoning: reasoning || null,
      new_reasoning_time: reasoningTime || null
    })

    if (!error) return true

    // RPC 失败 — 降级为普通更新（含 reasoning + reasoning_time）
    const { error: err2 } = await supabase
      .from('messages')
      .update({ content, reasoning: reasoning || null, reasoning_time: reasoningTime || null })
      .eq('id', id)

    if (!err2) return true

    // reasoning_time 字段不存在时降级为含 reasoning 的更新
    if (err2.code === '42703' || err2.message.includes('column') || err2.message.includes('Could not find')) {
      console.warn('[iDrome Conv] reasoning_time 字段缺失，降级更新:', err2.message)
      const { error: err3 } = await supabase
        .from('messages')
        .update({ content, reasoning: reasoning || null })
        .eq('id', id)

      if (!err3) return true

      // reasoning 字段也不存在时降级为仅更新 content
      if (err3.code === '42703' || err3.message.includes('column') || err3.message.includes('Could not find')) {
        console.warn('[iDrome Conv] reasoning 字段缺失，仅更新 content:', err3.message)
        const { error: err4 } = await supabase
          .from('messages')
          .update({ content })
          .eq('id', id)

        if (!err4) return true
        console.error('[iDrome Conv] 更新消息内容失败(仅content):', err4.message, '| code:', err4.code)
      } else {
        console.error('[iDrome Conv] 更新消息内容失败:', err3.message, '| code:', err3.code)
      }
    } else {
      console.error('[iDrome Conv] 更新消息内容失败:', err2.message, '| code:', err2.code)
    }
    return false
  } catch (e) {
    console.error('[iDrome Conv] 更新消息内容异常:', e)
    return false
  }
}

/**
 * 标记指定时间之后的消息为过期（编辑消息时调用）
 * @param {string} conversationId - 对话 ID
 * @param {string} afterCreatedAt - ISO 时间戳，该时间之后的消息标记过期
 * @returns {Promise<boolean>}
 */
export async function markMessagesExpired(conversationId, afterCreatedAt) {
  const supabase = getSupabase()
  if (!supabase) return false

  try {
    const { error } = await supabase
      .from('messages')
      .update({ expired: true })
      .eq('conversation_id', conversationId)
      .gt('created_at', afterCreatedAt)

    if (error) {
      console.error('[iDrome Conv] 标记消息过期失败:', error.message)
      return false
    }
    return true
  } catch (e) {
    console.error('[iDrome Conv] 标记消息过期异常:', e)
    return false
  }
}

/**
 * 删除单条消息
 * @param {number} id - 消息 ID
 * @returns {Promise<boolean>}
 */
export async function deleteMessage(id) {
  const supabase = getSupabase()
  if (!supabase) return false

  try {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[iDrome Conv] 删除消息失败:', error.message)
      return false
    }
    return true
  } catch (e) {
    console.error('[iDrome Conv] 删除消息异常:', e)
    return false
  }
}

/* ============================================================
 * 搜索
 * ============================================================ */

/**
 * 搜索消息内容
 * @param {string} query - 搜索关键词
 * @returns {Promise<Array>} 匹配的消息列表
 */
export async function searchMessageContent(query) {
  const supabase = getSupabase()
  if (!supabase || !query) return []

  const userId = await getCurrentUserId()
  if (!userId) return []

  try {
    const { data, error } = await supabase
      .from('messages')
      .select('id, conversation_id, content, role, created_at, conversations!inner(title, mode)')
      .ilike('content', `%${query}%`)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('[iDrome Conv] 搜索消息内容失败:', error.message)
      return []
    }

    return (data || []).map(msg => ({
      messageId: msg.id,
      conversationId: msg.conversation_id,
      conversationTitle: msg.conversations?.title || '未命名对话',
      mode: msg.conversations?.mode || 'general',
      snippet: extractSnippet(msg.content, query),
      role: msg.role,
      createdAt: msg.created_at
    }))
  } catch (e) {
    console.error('[iDrome Conv] 搜索消息内容异常:', e)
    return []
  }
}

/**
 * 提取匹配关键词前后各 50 字符的片段
 * @param {string} content - 原文
 * @param {string} query - 关键词
 * @returns {string}
 */
function extractSnippet(content, query) {
  if (!content) return ''
  const idx = content.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return content.slice(0, 100)
  const start = Math.max(0, idx - 50)
  const end = Math.min(content.length, idx + query.length + 50)
  return (start > 0 ? '...' : '') + content.slice(start, end) + (end < content.length ? '...' : '')
}

/* ============================================================
 * 批量操作
 * ============================================================ */

/**
 * 批量删除对话
 * @param {Array<string>} ids - 对话 ID 数组
 * @returns {Promise<boolean>}
 */
export async function batchDeleteConversations(ids) {
  const supabase = getSupabase()
  if (!supabase || !ids || ids.length === 0) return false

  try {
    const { error } = await supabase
      .from('conversations')
      .delete()
      .in('id', ids)

    if (error) {
      console.error('[iDrome Conv] 批量删除对话失败:', error.message)
      return false
    }

    console.log(`[iDrome Conv] 批量删除 ${ids.length} 个对话成功`)
    return true
  } catch (e) {
    console.error('[iDrome Conv] 批量删除对话异常:', e)
    return false
  }
}

/**
 * 批量归档对话
 * @param {Array<string>} ids - 对话 ID 数组
 * @param {boolean} archived - 归档状态
 * @returns {Promise<boolean>}
 */
export async function batchArchiveConversations(ids, archived) {
  const supabase = getSupabase()
  if (!supabase || !ids || ids.length === 0) return false

  try {
    const { error } = await supabase
      .from('conversations')
      .update({ archived })
      .in('id', ids)

    if (error) {
      console.error('[iDrome Conv] 批量归档对话失败:', error.message)
      return false
    }
    return true
  } catch (e) {
    console.error('[iDrome Conv] 批量归档对话异常:', e)
    return false
  }
}

/* ============================================================
 * AI 自动生成标题
 * ============================================================ */

/**
 * AI 自动生成对话标题
 * 通过 DeepSeek API 根据第一条消息生成简短标题
 * @param {string} firstMessage - 第一条用户消息
 * @returns {Promise<string>} 生成的标题
 */
export async function generateTitle(firstMessage) {
  if (!firstMessage) return '新对话'

  // 本地生成简短标题（作为快速回退，不依赖 API）
  // 截取前 20 个字符，超长加省略号
  const localTitle = firstMessage.slice(0, 20) + (firstMessage.length > 20 ? '...' : '')

  // 尝试通过 API 生成更精准的标题
  try {
    const { apiRouter } = await import('./apiRouter.js')

    const result = await apiRouter.chat([
      {
        role: 'system',
        content: '你是标题生成助手。根据用户的消息生成一个简短的对话标题（不超过15个字，不要加引号、书名号等符号）。只返回标题文本，不要任何额外内容。'
      },
      {
        role: 'user',
        content: firstMessage.slice(0, 500)
      }
    ], {
      stream: false,
      maxTokens: 50,
      temperature: 0.3
    })

    if (result && result.content) {
      const title = result.content.trim().replace(/^["""']|["""']$/g, '').slice(0, 30)
      if (title) return title
    }
  } catch (e) {
    console.warn('[iDrome Conv] AI 生成标题失败，使用本地标题:', e.message)
  }

  return localTitle
}

/**
 * 更新对话标题
 * @param {string} id - 对话 ID
 * @param {string} title - 新标题
 * @returns {Promise<boolean>}
 */
export async function updateConversationTitle(id, title) {
  return renameConversation(id, title)
}

/* ============================================================
 * 对话分组 CRUD（Step 9 新增）
 * ============================================================ */

/**
 * 加载用户的所有自定义分组
 * @returns {Promise<Array>} 分组数组
 */
export async function loadConversationGroups() {
  const supabase = getSupabase()
  if (!supabase) return []

  const userId = await getCurrentUserId()
  if (!userId) {
    console.warn('[iDrome Conv] 加载分组失败: 用户未登录')
    return []
  }
  if (userId.startsWith('temp-')) {
    console.warn('[iDrome Conv] 加载分组失败: 临时用户不支持分组同步')
    return []
  }

  try {
    const { data, error } = await supabase
      .from('conversation_groups')
      .select('*')
      .eq('user_id', userId)
      .order('sort_order', { ascending: true })

    if (error) {
      if (error.code === '42P01') {
        console.warn('[iDrome Conv] conversation_groups 表未创建，请执行 step9_groups_migration.sql')
      } else {
        console.warn('[iDrome Conv] 加载分组失败:', error.message, error.code)
      }
      return []
    }
    return data || []
  } catch (e) {
    console.warn('[iDrome Conv] 加载分组异常:', e)
    return []
  }
}

/**
 * 创建新分组
 * @param {string} name - 分组名称
 * @param {string} [color] - 分组颜色
 * @returns {Promise<{data: Object|null, error: string|null}>} 创建结果
 */
export async function createConversationGroup(name, color = '') {
  const supabase = getSupabase()
  if (!supabase) return { data: null, error: 'Supabase 客户端未初始化' }

  const userId = await getCurrentUserId()
  if (!userId) return { data: null, error: '用户未登录，无法同步分组数据' }
  if (userId.startsWith('temp-')) return { data: null, error: '临时用户不支持创建分组，请先登录' }

  try {
    const { data, error } = await supabase
      .from('conversation_groups')
      .insert({
        user_id: userId,
        name: name.trim(),
        color: color,
        sort_order: Date.now()
      })
      .select()
      .single()

    if (error) {
      console.error('[iDrome Conv] 创建分组失败:', error.message, error.code)
      // 提供更具体的错误信息
      if (error.code === '42P01') {
        return { data: null, error: '分组表未创建，请先执行数据库迁移 SQL' }
      }
      if (error.code === '42501' || error.message.includes('RLS')) {
        return { data: null, error: '权限不足，无法写入分组数据' }
      }
      return { data: null, error: `创建分组失败: ${error.message}` }
    }
    return { data, error: null }
  } catch (e) {
    console.error('[iDrome Conv] 创建分组异常:', e)
    return { data: null, error: `创建分组异常: ${e.message}` }
  }
}

/**
 * 重命名分组
 * @param {string} groupId - 分组 ID
 * @param {string} newName - 新名称
 * @returns {Promise<{success: boolean, error: string|null}>}
 */
export async function renameConversationGroup(groupId, newName) {
  const supabase = getSupabase()
  if (!supabase) return { success: false, error: 'Supabase 客户端未初始化' }

  try {
    const { error } = await supabase
      .from('conversation_groups')
      .update({ name: newName.trim(), updated_at: new Date().toISOString() })
      .eq('id', groupId)

    if (error) {
      console.error('[iDrome Conv] 重命名分组失败:', error.message, error.code)
      if (error.code === '42P01') {
        return { success: false, error: '分组表未创建，请先执行数据库迁移 SQL' }
      }
      return { success: false, error: `重命名失败: ${error.message}` }
    }
    return { success: true, error: null }
  } catch (e) {
    console.error('[iDrome Conv] 重命名分组异常:', e)
    return { success: false, error: `重命名异常: ${e.message}` }
  }
}

/**
 * 删除分组（对话的 custom_group_id 会自动设为 null）
 * @param {string} groupId - 分组 ID
 * @returns {Promise<{success: boolean, error: string|null}>}
 */
export async function deleteConversationGroup(groupId) {
  const supabase = getSupabase()
  if (!supabase) return { success: false, error: 'Supabase 客户端未初始化' }

  try {
    const { error } = await supabase
      .from('conversation_groups')
      .delete()
      .eq('id', groupId)

    if (error) {
      console.error('[iDrome Conv] 删除分组失败:', error.message, error.code)
      if (error.code === '42P01') {
        return { success: false, error: '分组表未创建，请先执行数据库迁移 SQL' }
      }
      return { success: false, error: `删除失败: ${error.message}` }
    }
    return { success: true, error: null }
  } catch (e) {
    console.error('[iDrome Conv] 删除分组异常:', e)
    return { success: false, error: `删除异常: ${e.message}` }
  }
}

/**
 * 将对话移至指定分组
 * @param {string} conversationId - 对话 ID
 * @param {string|null} groupId - 分组 ID（null 表示移出分组）
 * @returns {Promise<{success: boolean, error: string|null}>}
 */
export async function moveConversationToGroup(conversationId, groupId) {
  const supabase = getSupabase()
  if (!supabase) return { success: false, error: 'Supabase 客户端未初始化' }

  try {
    const { error } = await supabase
      .from('conversations')
      .update({ custom_group_id: groupId })
      .eq('id', conversationId)

    if (error) {
      console.warn('[iDrome Conv] 移至分组失败（字段可能不存在）:', error.message, error.code)
      if (error.code === '42703') {
        return { success: false, error: 'conversations 表缺少 custom_group_id 字段，请执行迁移 SQL' }
      }
      return { success: false, error: `移动失败: ${error.message}` }
    }
    return { success: true, error: null }
  } catch (e) {
    console.error('[iDrome Conv] 移至分组异常:', e)
    return { success: false, error: `移动异常: ${e.message}` }
  }
}

/* ============================================================
 * 搜索引用持久化（Step 11 新增）
 * ============================================================ */

/**
 * 保存消息的搜索引用到数据库
 * @param {number} messageId - 消息数据库 ID
 * @param {Array} searchResults - 搜索结果数组
 * @returns {Promise<boolean>}
 */
export async function saveSearchReferences(messageId, searchResults) {
  const supabase = getSupabase()
  if (!supabase || !messageId || !searchResults || searchResults.length === 0) return false

  const userId = await getCurrentUserId()
  if (!userId || userId.startsWith('temp-')) {
    console.warn('[iDrome Conv] 保存搜索引用跳过：用户未登录或临时用户')
    return false
  }

  try {
    // 方案1：upsert（需要 message_id 有 UNIQUE 约束）
    const { error } = await supabase
      .from('message_search_references')
      .upsert({
        message_id: messageId,
        user_id: userId,
        search_results: searchResults,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'message_id'
      })

    if (error) {
      // upsert 失败（可能缺少 UNIQUE 约束）— 回退到 delete + insert
      console.warn('[iDrome Conv] upsert 失败，尝试 delete + insert:', error.message)
      await supabase
        .from('message_search_references')
        .delete()
        .eq('message_id', messageId)

      const { error: insertError } = await supabase
        .from('message_search_references')
        .insert({
          message_id: messageId,
          user_id: userId,
          search_results: searchResults
        })

      if (insertError) {
        console.warn('[iDrome Conv] 保存搜索引用失败（表可能未创建）:', insertError.message)
        return false
      }
    }
    console.log('[iDrome Conv] 搜索引用保存成功，message_id:', messageId, '结果数:', searchResults.length)
    return true
  } catch (e) {
    console.warn('[iDrome Conv] 保存搜索引用异常:', e)
    return false
  }
}

/**
 * 加载消息的搜索引用
 * @param {number} messageId - 消息数据库 ID
 * @returns {Promise<Array>} 搜索结果数组
 */
export async function loadSearchReferences(messageId) {
  const supabase = getSupabase()
  if (!supabase || !messageId) return []

  try {
    const { data, error } = await supabase
      .from('message_search_references')
      .select('search_results')
      .eq('message_id', messageId)
      .maybeSingle()

    if (error) {
      console.warn('[iDrome Conv] 加载搜索引用失败:', error.message, '(code:', error.code + ')')
      return []
    }
    return data?.search_results || []
  } catch (e) {
    console.warn('[iDrome Conv] 加载搜索引用异常:', e)
    return []
  }
}

/**
 * 批量加载多个消息的搜索引用
 * @param {Array<number>} messageIds - 消息数据库 ID 数组
 * @returns {Promise<Object>} { messageId: searchResults[] } 映射
 */
export async function loadSearchReferencesBatch(messageIds) {
  const supabase = getSupabase()
  if (!supabase || !messageIds || messageIds.length === 0) return {}

  try {
    const { data, error } = await supabase
      .from('message_search_references')
      .select('message_id, search_results')
      .in('message_id', messageIds)

    if (error) {
      console.warn('[iDrome Conv] 批量加载搜索引用失败:', error.message, '(code:', error.code + ')')
      return {}
    }

    const map = {}
    if (data) {
      data.forEach(row => {
        map[row.message_id] = row.search_results || []
      })
    }
    console.log('[iDrome Conv] 批量加载搜索引用完成：请求', messageIds.length, '条，命中', Object.keys(map).length, '条')
    return map
  } catch (e) {
    console.warn('[iDrome Conv] 批量加载搜索引用异常:', e)
    return {}
  }
}

/**
 * 加载用户的知识库文件列表
 * @returns {Promise<Array>} 知识库文件数组
 */
export async function loadKnowledgeBaseFiles() {
  const supabase = getSupabase()
  if (!supabase) return []

  const userId = await getCurrentUserId()
  if (!userId) return []

  try {
    const { data, error } = await supabase
      .from('knowledge_base_files')
      .select('id, filename, file_name, original_name, file_size, file_path, file_type, extracted_text, created_at, updated_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.warn('[iDrome Conv] 加载知识库文件失败:', error.message)
      return []
    }
    return data || []
  } catch (e) {
    console.warn('[iDrome Conv] 加载知识库文件异常:', e)
    return []
  }
}

/**
 * 删除知识库文件（数据库记录 + Storage 文件）
 * @param {number} fileId — 文件 ID
 * @param {string} filePath — 文件在 Storage 中的路径
 * @returns {Promise<{success: boolean, error: string|null}>}
 */
export async function deleteKnowledgeBaseFile(fileId, filePath) {
  const supabase = getSupabase()
  if (!supabase || !fileId) return { success: false, error: '参数无效' }

  try {
    // 1. 删除 Storage 文件
    if (filePath) {
      const { error: storageError } = await supabase
        .storage
        .from('user_knowledge_base')
        .remove([filePath])

      if (storageError) {
        console.warn('[iDrome Conv] Storage 文件删除失败:', storageError.message)
      }
    }

    // 2. 删除数据库记录
    const { error } = await supabase
      .from('knowledge_base_files')
      .delete()
      .eq('id', fileId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (e) {
    return { success: false, error: e.message }
  }
}

/**
 * 上传知识库文件到 Storage
 * @param {File} file — 文件对象
 * @returns {Promise<{data: Object|null, error: string|null}>}
 */
export async function uploadKnowledgeBaseFile(file) {
  const supabase = getSupabase()
  if (!supabase || !file) return { data: null, error: '参数无效' }

  const userId = await getCurrentUserId()
  if (!userId || userId.startsWith('temp-')) {
    return { data: null, error: '用户未登录或临时用户不支持上传' }
  }

  try {
    // 生成安全文件名 — 使用时间戳 + 随机字符串 + 原始扩展名
    // 解决中文文件名在 Supabase Storage 中的路径编码问题
    const ext = file.name.split('.').pop() || 'txt'
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const safeFileName = `${timestamp}_${random}.${ext}`
    const filePath = `${userId}/${safeFileName}`

    // 1. 上传到 Storage（使用安全文件名）
    const { error: uploadError } = await supabase
      .storage
      .from('user_knowledge_base')
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type || 'application/octet-stream'
      })

    if (uploadError) {
      return { data: null, error: uploadError.message }
    }

    // 2. 尝试通过 file-proxy Edge Function 解析文件内容
    let extractedText = ''
    try {
      // 读取文件为 Base64
      const base64Content = await fileToBase64(file)

      // 使用完整的 Supabase Edge Function URL
      const supabaseUrl = window.IDROME_CONFIG?.supabaseUrl || ''
      const fileProxyUrl = `${supabaseUrl}/functions/v1/file-proxy`

      const session = await supabase.auth.getSession()
      const response = await fetch(fileProxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.data?.session?.access_token || ''}`
        },
        body: JSON.stringify({
          fileName: file.name,  // 保留原始文件名供解析参考
          fileSize: file.size,
          fileType: file.type,
          fileContent: base64Content
        })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          extractedText = result.extractedText || ''
        }
      }
    } catch (e) {
      console.warn('[iDrome Conv] 文件解析失败，仅存储文件:', e.message)
    }

    // 3. 写入数据库记录 — 同名文件覆盖时先删除旧 Storage 文件
    try {
      const { data: existing } = await supabase
        .from('knowledge_base_files')
        .select('file_path')
        .eq('user_id', userId)
        .eq('filename', file.name)
        .maybeSingle()
      if (existing?.file_path && existing.file_path !== filePath) {
        await supabase.storage.from('user_knowledge_base').remove([existing.file_path])
      }
    } catch (e) {
      console.warn('[iDrome Conv] 清理旧文件失败（非致命）:', e.message)
    }

    // 准备写入数据
    // 数据库表结构（20260711130000_create_knowledge_base_tables.sql）：
    //   filename      text NOT NULL          — 文件名（权威列）
    //   original_name text NOT NULL          — 原始文件名（必须赋值，否则违反 NOT NULL）
    //   file_type     text NOT NULL          — MIME 类型（必须赋值，空字符串亦违反 NOT NULL）
    //   file_size     bigint NOT NULL DEFAULT 0
    //   file_path     text NOT NULL          — Storage 路径
    //   extracted_text text                   — 解析后的文本（20260802 迁移补充，可为空）
    //   file_name     text                   — 兼容列（20260802 迁移补充，与 filename 同义）
    const insertPayload = {
      user_id: userId,
      filename: file.name,
      file_name: file.name,          // 兼容旧代码读取
      original_name: file.name,      // 必须赋值（NOT NULL 约束）
      file_size: file.size,
      file_path: filePath,
      file_type: file.type || 'application/octet-stream',  // NOT NULL，提供默认值防止空值
      extracted_text: extractedText
    }

    // 尝试 upsert（需要 UNIQUE(user_id, filename) 约束，由 20260802 迁移创建）
    let { data, error: dbError } = await supabase
      .from('knowledge_base_files')
      .upsert(insertPayload, {
        onConflict: 'user_id,filename'
      })
      .select()
      .single()

    // 如果 upsert 失败（数据库缺少 UNIQUE 约束或列未对齐），回退到 delete + insert
    if (dbError && (dbError.message.includes('unique or exclusion constraint') ||
                    dbError.message.includes('Could not find the column') ||
                    dbError.message.includes('column') && dbError.message.includes('does not exist'))) {
      console.warn('[iDrome Conv] upsert 失败，回退到 delete+insert:', dbError.message)
      // 先删除同名文件记录
      await supabase
        .from('knowledge_base_files')
        .delete()
        .eq('user_id', userId)
        .eq('filename', file.name)
      // 再插入新记录
      const { data: insertData, error: insertError } = await supabase
        .from('knowledge_base_files')
        .insert(insertPayload)
        .select()
        .single()
      if (insertError) {
        // 若 insert 仍失败（可能 original_name/file_type 列缺失），给出明确提示
        const hint = insertError.message.includes('original_name')
          ? '请执行 supabase/migrations/20260802100000_align_knowledge_base_files_schema.sql 迁移脚本'
          : ''
        return { data: null, error: `${insertError.message}${hint ? '（' + hint + '）' : ''}` }
      }
      data = insertData
      dbError = null
    }

    if (dbError) {
      // 对于 original_name 相关错误，提供迁移脚本提示
      if (dbError.message.includes('original_name')) {
        return {
          data: null,
          error: `${dbError.message}（请执行 20260802100000_align_knowledge_base_files_schema.sql 迁移脚本以补全 original_name 赋值）`
        }
      }
      return { data: null, error: dbError.message }
    }

    return { data, error: null }
  } catch (e) {
    return { data: null, error: e.message }
  }
}

/**
 * 文件转 Base64
 * @param {File} file
 * @returns {Promise<string>}
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      // 移除 data:...;base64, 前缀
      const base64 = typeof result === 'string' ? result.split(',')[1] : ''
      resolve(base64)
    }
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsDataURL(file)
  })
}

export default {
  createConversation,
  loadConversations,
  loadAllConversations,
  deleteConversation,
  renameConversation,
  togglePin,
  toggleArchive,
  touchConversation,
  updateConversationMode,
  updateConversationModel,
  updateConversationTitle,
  loadMessages,
  loadAllMessages,
  insertMessage,
  updateMessageContent,
  markMessagesExpired,
  deleteMessage,
  searchMessageContent,
  batchDeleteConversations,
  batchArchiveConversations,
  generateTitle,
  loadConversationGroups,
  createConversationGroup,
  renameConversationGroup,
  deleteConversationGroup,
  moveConversationToGroup,
  saveSearchReferences,
  loadSearchReferences,
  loadSearchReferencesBatch,
  loadKnowledgeBaseFiles,
  deleteKnowledgeBaseFile,
  uploadKnowledgeBaseFile
}
