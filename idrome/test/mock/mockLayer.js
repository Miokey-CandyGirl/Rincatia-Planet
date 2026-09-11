/**
 * iDrome Mock 层 — Mock Chat 实现（Step 3 升级版）
 *
 * 按设计方案第 33.1 节实现：
 * - 使用 ReadableStream 模拟 SSE 流式响应
 * - 返回标准 SSE 格式数据（data: {json}\n\n）
 * - 支持 thinking 模式（reasoning_content）
 * - 支持 usage 追踪（最后一帧包含 usage 数据）
 *
 * 项目约束：
 * - Mock 层通过 APIRouter.chat() 入口注入，使用 mockChat() 函数
 * - 禁止全局覆盖 window.fetch
 * - 仅在开发/测试环境启用，生产环境自动跳过
 *
 * 步骤 4 接入真实 API 后，仅需在 apiRouter.chat() 开头添加：
 *   if (isDev) return mockChat(messages, options)
 */

'use strict'

/**
 * Mock 是否启用
 * 通过 localStorage.idrome-mock=true 或 URL 参数 ?mock=true 启用
 * 注意：不再自动在 localhost 启用，确保桌面端和移动端均使用真实 API
 * @returns {boolean}
 */
export function isMockEnabled() {
  try {
    if (localStorage.getItem('idrome-mock') === 'true') return true
  } catch (e) {
    // 忽略
  }
  const params = new URLSearchParams(window.location.search)
  if (params.get('mock') === 'true') return true
  return false
}

/** 开发环境标识 */
export const isDev = typeof location !== 'undefined' &&
  (location.search.includes('mock=true'))

/* ============================================================
 * Mock 回复库 — 关键词匹配
 * ============================================================ */

const MOCK_REPLIES = [
  {
    keywords: ['你好', 'hello', 'hi', '嗨', '你是谁'],
    reply: '你好！我是 **iDrome AI 助手**（DromAI），由华田中央大学蔚莱科技学院逐梦人工智能开发工作室开发。\n\n我可以帮助你：\n\n1. 日常对话与知识问答\n2. 琳凯蒂亚语（田语）翻译与解析\n3. 《光线传奇》小说文化解读\n4. 创意辅助与内容创作\n\n有什么可以帮助你的吗？',
    thinking: '用户在打招呼，我应该介绍自己的身份和能力，同时保持友好的语气。',
    mode: 'general'
  },
  {
    keywords: ['琳凯蒂亚语', '田语', 'ketia', '语法'],
    reply: '琳凯蒂亚语（田语，Ketiá）是琳凯蒂亚文化体系中的主要语言。\n\n**主要特点：**\n\n1. **词根派生体系** — 通过核心词根组合生成派生词\n2. **语序灵活** — 主谓宾结构可通过词形变化调整\n3. **时态标记** — 使用前缀表示过去/现在/未来\n4. **敬语层级** — 根据场合使用不同敬体\n\n**示例词根：**\n\n| 词根 | 核心 | 派生词示例 |\n|------|------|------------|\n| lus- | 光 | lusín（光芒）、lusía（照亮）|\n| ket- | 语言 | ketiá（语言）、ketór（话语）|\n\n需要了解某个具体方面吗？',
    thinking: '用户询问琳凯蒂亚语，我需要介绍其基本特点和词根体系，可以用表格展示派生词示例。',
    mode: 'tian-translation'
  },
  {
    keywords: ['历法', '华田历', '年份', '0年'],
    reply: '华田历法是琳凯蒂亚文化体系的标准历法。\n\n**重要规则：** 华田历法**不存在 0 年**，年份计算从 -1 年直接过渡到 1 年。\n\n这一规则源于琳凯蒂亚文化对"起始"的哲学理解——时间不可中断。\n\n```text\n华田历法年份序列：\n... → -3 → -2 → -1 → 1 → 2 → 3 → ...\n（无 0 年）\n```\n\n进行历法计算时需特别注意此规则，避免将 0 年纳入计算。',
    thinking: '用户询问历法，关键点是华田历法不存在0年，这是硬约束，需要强调说明。',
    mode: 'general'
  },
  {
    keywords: ['光线传奇', '小说', '世界观', '人物'],
    reply: '《光线传奇》是琳凯蒂亚文化的核心小说作品，构建了完整的琳凯蒂亚世界观。\n\n**核心元素：**\n\n- 华田星芒信仰体系\n- 田语文化传承\n- 多元社会制度\n- 历法与时间哲学\n\n**主要人物：**\n\n小说围绕光与暗的永恒主题展开，探讨文明、信仰与人性的深层命题。\n\n需要我深入解读某个方面吗？',
    thinking: '用户询问小说相关内容，我需要介绍《光线传奇》的世界观核心元素和主题。',
    mode: 'novel-culture'
  },
  {
    keywords: ['代码', '编程', 'program', 'code'],
    reply: '这是一个代码示例：\n\n```javascript\n// 琳凯蒂亚历法计算 — 跳过 0 年\nfunction huaTianYearDiff(from, to) {\n  // 确保从小到大\n  const [start, end] = from <= to ? [from, to] : [to, from]\n  let diff = end - start\n  // 如果跨越 0 年点，减去 1（0 年不存在）\n  if (start < 0 && end > 0) diff -= 1\n  return from <= to ? diff : -diff\n}\n\nconsole.log(huaTianYearDiff(-5, 5))  // 9（而非 10）\n```\n\n这个函数正确处理了华田历法无 0 年的特殊规则。',
    thinking: '用户询问编程相关内容，我可以提供一个展示华田历法计算的代码示例，既展示代码能力又融入文化元素。',
    mode: 'general'
  },
  {
    keywords: ['公式', '数学', '计算', 'latex'],
    reply: 'LaTeX 公式渲染示例：\n\n行内公式：$E = mc^2$\n\n块级公式：\n\n$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$\n\n华田历法年份差公式（考虑无 0 年）：\n\n$$\\Delta y = |y_2 - y_1| - \\begin{cases} 1 & \\text{if } y_1 < 0 \\land y_2 > 0 \\\\ 0 & \\text{otherwise} \\end{cases}$$\n\nKaTeX 已集成到 Markdown 渲染中，支持大多数数学公式。',
    thinking: '用户询问公式或数学，我可以展示LaTeX渲染能力，同时融入华田历法的数学表达。',
    mode: 'general'
  }
]

const DEFAULT_REPLY = '收到你的问题。这是 **iDrome Mock 模式**的回复。\n\n当前 Mock 层支持：\n\n- 流式 SSE 输出（打字机效果）\n- Markdown 渲染\n- 代码块语法高亮\n- LaTeX 公式渲染\n- 深度思考模式\n\n试试输入「你好」「琳凯蒂亚语」「历法」「代码」等关键词获取预设回复。'

/**
 * 根据用户输入生成 Mock 回复
 * @param {string} userContent
 * @param {string} mode
 * @returns {{ reply: string, thinking: string }}
 */
function generateReply(userContent, mode) {
  const lowerContent = userContent.toLowerCase()
  for (const item of MOCK_REPLIES) {
    if (item.keywords.some(kw => lowerContent.includes(kw.toLowerCase()))) {
      return { reply: item.reply, thinking: item.thinking || '' }
    }
  }
  return { reply: DEFAULT_REPLY, thinking: '' }
}

/* ============================================================
 * SSE 流模拟（ReadableStream）
 * ============================================================ */

/**
 * 将文本拆分为 SSE chunk 数组
 * @param {string} text - 完整回复文本
 * @param {number} chunkSize - 每个 chunk 的字符数
 * @returns {Array<string>} SSE 格式的 chunk 数组
 */
function textToSSEChunks(text, reasoningText, usage) {
  const chunks = []
  const chunkSize = 3 // 每 3 个字符一个 chunk，模拟打字机效果

  // 思考过程（reasoning_content）
  if (reasoningText) {
    const reasoningChunks = reasoningText.match(new RegExp(`[\\s\\S]{1,${chunkSize}}`, 'g')) || []
    reasoningChunks.forEach(piece => {
      chunks.push(`data: ${JSON.stringify({
        choices: [{ delta: { reasoning_content: piece } }]
      })}\n\n`)
    })
  }

  // 正文内容（content）
  const contentChunks = text.match(new RegExp(`[\\s\\S]{1,${chunkSize}}`, 'g')) || []
  contentChunks.forEach(piece => {
    chunks.push(`data: ${JSON.stringify({
      choices: [{ delta: { content: piece } }]
    })}\n\n`)
  })

  // usage 帧（最后一帧）
  chunks.push(`data: ${JSON.stringify({
    choices: [],
    usage: usage
  })}\n\n`)

  // 结束标记
  chunks.push('data: [DONE]\n\n')

  return chunks
}

/**
 * 模拟 SSE 流式响应
 * @param {string} replyText - 完整回复文本
 * @param {string} reasoningText - 思考过程文本
 * @param {Object} usage - token 用量
 * @returns {ReadableStream} 模拟的 SSE 流
 */
function createMockSSEStream(replyText, reasoningText, usage) {
  const chunks = textToSSEChunks(replyText, reasoningText, usage)

  return new ReadableStream({
    async start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(new TextEncoder().encode(chunk))
        // 模拟网络延迟（30-50ms 每个 chunk）
        await new Promise(r => setTimeout(r, 30 + Math.random() * 20))
      }
      controller.close()
    }
  })
}

/* ============================================================
 * Mock Chat 主函数
 * ============================================================ */

/**
 * Mock 对话调用
 * 模拟 APIRouter.chat() 的接口，使用 ReadableStream 模拟 SSE 流
 *
 * @param {Array<{role: string, content: string}>} messages - 消息列表
 * @param {Object} options - 选项
 * @param {Function} [options.onChunk] - 正文 chunk 回调 (delta, fullContent)
 * @param {Function} [options.onContentChunk] - 同 onChunk（别名）
 * @param {Function} [options.onReasoningChunk] - 思考 chunk 回调 (delta, fullReasoning)
 * @param {Object} [options.thinking] - 思考模式配置 { type: 'enabled' | 'disabled' }
 * @param {AbortSignal} [options.signal] - 中断信号
 * @returns {Promise<{content: string, reasoning: string, usage: Object}>}
 */
export async function mockChat(messages, options = {}) {
  const {
    onChunk,
    onContentChunk,
    onReasoningChunk,
    thinking,
    signal
  } = options

  const isThinkingMode = thinking?.type === 'enabled'

  // 获取最后一条用户消息
  const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')
  const userContent = lastUserMsg ? lastUserMsg.content : ''

  // 生成回复
  const { reply, thinking: reasoningText } = generateReply(userContent)

  // 简单 token 统计（粗略估算）
  const promptTokens = messages.reduce((sum, m) => sum + Math.ceil(m.content.length / 2), 0)
  const completionTokens = Math.ceil(reply.length / 2) + Math.ceil((reasoningText || '').length / 2)
  const usage = {
    prompt_tokens: promptTokens,
    completion_tokens: completionTokens,
    total_tokens: promptTokens + completionTokens
  }

  // 模拟初始延迟（300-500ms）
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200))

  // 如果收到中断信号，直接返回空
  if (signal?.aborted) {
    return { content: '', reasoning: '', usage }
  }

  // 创建 SSE 流
  const stream = createMockSSEStream(reply, isThinkingMode ? reasoningText : '', usage)
  const reader = stream.getReader()
  const decoder = new TextDecoder()

  let fullContent = ''
  let fullReasoning = ''

  try {
    while (true) {
      // 检查中断信号
      if (signal?.aborted) {
        reader.cancel()
        break
      }

      const { done, value } = await reader.read()
      if (done) break

      const text = decoder.decode(value, { stream: true })

      // 解析 SSE 数据
      for (const line of text.split('\n')) {
        if (!line.startsWith('data: ') || line === 'data: [DONE]') continue

        try {
          const data = JSON.parse(line.slice(6))

          // 思考过程
          if (data.choices?.[0]?.delta?.reasoning_content) {
            const delta = data.choices[0].delta.reasoning_content
            fullReasoning += delta
            onReasoningChunk?.(delta, fullReasoning)
          }

          // 正文内容
          if (data.choices?.[0]?.delta?.content) {
            const delta = data.choices[0].delta.content
            fullContent += delta
            onChunk?.(delta, fullContent)
            onContentChunk?.(delta, fullContent)
          }
        } catch (e) {
          // 忽略解析错误
        }
      }
    }
  } catch (e) {
    if (e.name !== 'AbortError') {
      console.warn('[Mock] SSE 流读取异常：', e)
    }
  }

  return {
    content: fullContent,
    reasoning: fullReasoning,
    usage
  }
}

/* ============================================================
 * 导出
 * ============================================================ */

export const MockLayer = {
  name: 'iDrome Mock Layer',
  version: '2.0.0',
  isMockEnabled,
  mockChat
}

export default MockLayer
