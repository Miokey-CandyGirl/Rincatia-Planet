/**
 * iDrome — 输入框交互模块
 *
 * 按设计方案第 4.5 节实现：
 * - 多行文本输入，自动调整高度（60px → 120px）
 * - Enter 插入换行，Ctrl+Enter 发送消息
 * - 字数统计（128 / 4000，超限红色）
 * - 发送按钮状态（空内容灰色 / 有内容蓝色）
 * - 工具按钮组（深度思考 / 联网搜索 / 附件 / 语音）开关交互
 */

'use strict'

import { state } from './state.js'
import { showToast } from './toast.js'
import { stopGenerating, continueGeneration } from './chat.js?v=step10'

/** 最大字符数 */
const MAX_CHARS = 4000

/**
 * 初始化输入框
 * @param {Function} onSend - 发送回调
 */
export function initInputArea(onSend) {
  const input = document.getElementById('messageInput')
  const sendBtn = document.getElementById('sendBtn')
  const charCount = document.getElementById('charCount')
  const deepThinkingBtn = document.getElementById('deepThinkingBtn')
  const webSearchBtn = document.getElementById('webSearchBtn')
  const attachBtn = document.getElementById('attachBtn')
  const voiceBtn = document.getElementById('voiceBtn')

  if (!input || !sendBtn) return

  // 发送回调存储
  let sendCallback = onSend

  // ==================== 移动端软键盘适配 ====================
  // 问题：键盘弹出时 iOS Safari 的布局视口（100dvh）不缩小，输入区被键盘遮住
  // 方案：
  //   - Android Chrome 108+ 由 dromai.html 的 interactive-widget=resizes-content 原生处理
  //   - iOS Safari / 旧浏览器：监听 visualViewport，把 body 高度同步为可见高度，
  //     并抵消 iOS 键盘弹出时 layout viewport 被整体上滚的偏移
  const vv = window.visualViewport
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  if (vv && isTouchDevice) {
    let rafPending = false
    const syncViewport = () => {
      if (rafPending) return
      rafPending = true
      requestAnimationFrame(() => {
        rafPending = false
        // 可见高度明显小于布局视口 → 键盘弹出（阈值 120px，避免边缘抖动）
        const keyboardOpen = vv.height < window.innerHeight - 120
        if (keyboardOpen) {
          document.body.style.height = vv.height + 'px'
          // 抵消 iOS 键盘弹出时页面整体上滚（body overflow:hidden 下窗口仍可能被滚动）
          if (window.scrollY !== 0) window.scrollTo(0, 0)
          // 键盘弹出时确保输入框完全可见
          input.scrollIntoView({ block: 'nearest' })
        } else if (document.body.style.height) {
          // 键盘收起 → 恢复 CSS 声明的 100dvh
          document.body.style.height = ''
        }
      })
    }
    vv.addEventListener('resize', syncViewport)
    vv.addEventListener('scroll', syncViewport)
  }

  /**
   * 更新输入框状态
   * 注意：生成中和暂停状态下不禁用发送按钮（此时它作为暂停/继续按钮使用）
   * 暂停状态下如果用户输入了内容，播放按钮自动切换为发送按钮
   */
  function updateInputState() {
    const len = input.value.length

    // 字数统计
    if (charCount) {
      charCount.textContent = String(len)
      const counter = charCount.parentElement
      if (counter) {
        counter.classList.toggle('exceeded', len > MAX_CHARS)
      }
    }

    // 发送按钮状态
    if (state.isGenerating) {
      // 生成中 — 按钮作为暂停按钮，始终启用
      sendBtn.disabled = false
    } else if (state.isPaused) {
      // 暂停状态下：有输入内容 → 切换为发送按钮；无内容 → 保持播放（继续）按钮
      if (len > 0 && len <= MAX_CHARS) {
        sendBtn.classList.remove('paused')
        sendBtn.disabled = false
        sendBtn.setAttribute('aria-label', '发送消息')
        sendBtn.title = '发送消息'
      } else {
        sendBtn.classList.add('paused')
        sendBtn.disabled = false
        sendBtn.setAttribute('aria-label', '继续生成')
        sendBtn.title = '继续生成'
      }
    } else {
      // 正常状态 — 根据内容启用/禁用
      sendBtn.disabled = len === 0 || len > MAX_CHARS
    }

    // 自动调整高度
    input.style.height = 'auto'
    input.style.height = Math.min(input.scrollHeight, 120) + 'px'

    // 同步到状态
    state.inputContent = input.value
  }

  // 输入事件
  input.addEventListener('input', updateInputState)

  // 键盘事件：Enter 插入换行，Ctrl+Enter（Mac: Cmd+Enter）发送消息
  // 跨浏览器兼容：同时检测 ctrlKey/metaKey + Enter
  input.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSendClick()
    }
    // 普通 Enter：默认行为（插入换行），不拦截
  })

  // 发送按钮点击 — 根据状态执行不同操作
  sendBtn.addEventListener('click', handleSendClick)

  /**
   * 处理发送按钮点击 — 三态切换
   * 1. 正常状态：发送消息
   * 2. 生成中：暂停生成
   * 3. 暂停状态 + 有输入内容：发送新消息（保留已生成的部分内容）
   * 4. 暂停状态 + 无输入内容：继续生成
   */
  function handleSendClick() {
    // 生成中 → 暂停
    if (state.isGenerating) {
      stopGenerating()
      return
    }

    // 暂停状态
    if (state.isPaused) {
      const content = input.value.trim()
      if (content && content.length <= MAX_CHARS) {
        // 有输入内容 → 发送新消息（清除暂停状态，保留部分 AI 回复）
        state.isPaused = false
        sendBtn.classList.remove('paused')
        if (typeof sendCallback === 'function') {
          sendCallback(content)
        }
        input.value = ''
        input.style.height = 'auto'
        updateInputState()
        input.blur()
      } else {
        // 无输入内容 → 继续生成
        continueGeneration()
      }
      return
    }

    // 正常状态 → 发送消息
    const content = input.value.trim()
    if (!content || content.length > MAX_CHARS) return

    if (typeof sendCallback === 'function') {
      sendCallback(content)
    }

    // 清空输入框
    input.value = ''
    input.style.height = 'auto'
    updateInputState()

    // 移动端发送后收起虚拟键盘
    input.blur()
  }

  // 工具按钮组 — 深度思考
  if (deepThinkingBtn) {
    deepThinkingBtn.addEventListener('click', () => {
      const pressed = deepThinkingBtn.getAttribute('aria-pressed') === 'true'
      deepThinkingBtn.setAttribute('aria-pressed', String(!pressed))
      deepThinkingBtn.classList.toggle('active', !pressed)
      state.deepThinkingEnabled = !pressed
      showToast(
        !pressed ? '深度思考已开启' : '深度思考已关闭',
        'info', 1000
      )
    })
  }

  // 工具按钮组 — 联网搜索
  // 注意：webSearchBtn 的点击事件由 search.js 的 initSearch() 统一绑定
  // 此处不再重复绑定，避免状态双重切换导致 state.webSearchEnabled 与 UI 不同步

  // 附件按钮（步骤 8 实现）
  if (attachBtn) {
    attachBtn.addEventListener('click', () => {
      handleAttachClick(input)
    })
  }

  // 语音按钮（步骤 8 实现）
  if (voiceBtn) {
    voiceBtn.addEventListener('click', () => {
      handleVoiceClick(voiceBtn, input)
    })
  }

  // 朗读按钮（步骤 8 实现）
  const readAloudBtn = document.getElementById('readAloudBtn')
  if (readAloudBtn) {
    readAloudBtn.addEventListener('click', () => {
      handleReadAloudClick(readAloudBtn)
    })
  }

  // 初始化状态
  updateInputState()

  console.log('[iDrome Input] 输入框已初始化')
}

/**
 * 设置发送回调
 * @param {Function} callback
 */
export function setSendCallback(callback) {
  // 重新绑定发送按钮（通过全局事件无法直接替换，需重新初始化）
  // 此函数供 chat.js 在初始化后设置回调
  const sendBtn = document.getElementById('sendBtn')
  if (sendBtn) {
    // 移除旧监听器并添加新的（通过 cloneNode）
    const newBtn = sendBtn.cloneNode(true)
    sendBtn.parentNode.replaceChild(newBtn, sendBtn)
    newBtn.addEventListener('click', () => {
      // 生成中 → 暂停
      if (state.isGenerating) {
        stopGenerating()
        return
      }

      // 暂停状态
      if (state.isPaused) {
        const input = document.getElementById('messageInput')
        const content = input ? input.value.trim() : ''
        if (content && content.length <= MAX_CHARS) {
          // 有输入内容 → 发送新消息（清除暂停状态，保留部分 AI 回复）
          state.isPaused = false
          newBtn.classList.remove('paused')
          if (typeof callback === 'function') callback(content)
          if (input) {
            input.value = ''
            input.style.height = 'auto'
            input.dispatchEvent(new Event('input'))
            input.blur()
          }
        } else {
          // 无输入内容 → 继续生成
          continueGeneration()
        }
        return
      }

      // 正常状态 → 发送消息
      const input = document.getElementById('messageInput')
      if (input) {
        const content = input.value.trim()
        if (content && content.length <= MAX_CHARS) {
          if (typeof callback === 'function') callback(content)
          input.value = ''
          input.style.height = 'auto'
          input.dispatchEvent(new Event('input'))
          // 移动端发送后收起虚拟键盘
          input.blur()
        }
      }
    })
  }
}

export default { initInputArea, setSendCallback }

/* ============================================================
 * 附件上传处理
 * ============================================================ */

/**
 * 处理附件按钮点击
 */
async function handleAttachClick(inputEl) {
  // 创建隐藏的文件选择器
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = 'image/*,.txt,.md,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.json,.xml,.yaml,.yml,.log,.html,.htm,.js,.ts,.py,.java,.cpp,.c,.go,.rs,.rb,.php,.swift,.kt,.css,.scss,.epub,.rtf,.odt'
  fileInput.multiple = false
  fileInput.style.display = 'none'
  document.body.appendChild(fileInput)

  fileInput.onchange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) {
      document.body.removeChild(fileInput)
      return
    }

    try {
      showToast(`正在处理: ${file.name}...`, 'info', 2000)

      // 判断文件类型
      const ext = file.name.split('.').pop().toLowerCase()
      const isImage = ['jpg', 'jpeg', 'png', 'webp', 'bmp', 'gif'].includes(ext)

      if (isImage) {
        // 图片：使用 vision.js 进行 OCR
        const { vision } = await import('./vision.js')
        const validation = vision.constructor.validate(file)
        if (!validation.valid) {
          showToast(validation.error, 'error')
          document.body.removeChild(fileInput)
          return
        }

        showToast('正在识别图片...', 'info', 3000)
        const result = await vision.extractText(file, null, (percent) => {
          // 进度回调可在此处扩展
        })

        // 将识别结果填入输入框
        if (inputEl && result.text) {
          const prefix = inputEl.value ? '\n\n' : ''
          inputEl.value += `${prefix}[图片识别结果]\n${result.text}`
          inputEl.dispatchEvent(new Event('input'))
          showToast('图片识别完成，结果已填入输入框', 'success')
        } else {
          showToast('图片未识别到文字内容', 'warning')
        }
      } else {
        // 文档：使用 fileReader.js 进行解析
        const { fileReader } = await import('./fileReader.js')
        const validation = fileReader.constructor.validate(file)
        if (!validation.valid) {
          showToast(validation.error, 'error')
          document.body.removeChild(fileInput)
          return
        }

        showToast('正在解析文件...', 'info', 3000)
        const result = await fileReader.readFile(file, (percent) => {
          // 进度回调可在此处扩展
        })

        // 将解析结果填入输入框
        if (inputEl && result.text) {
          const prefix = inputEl.value ? '\n\n' : ''
          const methodLabel = result.method === 'doubao-parse' ? '豆包解析' : '本地解析'
          inputEl.value += `${prefix}[文件解析结果 — ${result.fileName} (${methodLabel})]\n${result.text}`
          inputEl.dispatchEvent(new Event('input'))
          showToast(`文件解析完成: ${result.fileName}`, 'success')
        } else if (result.method === 'ocr') {
          // 图片文件走 OCR 流程
          const { vision } = await import('./vision.js')
          showToast('正在识别图片...', 'info', 3000)
          const visionResult = await vision.extractText(result.file)
          if (inputEl && visionResult.text) {
            const prefix = inputEl.value ? '\n\n' : ''
            inputEl.value += `${prefix}[图片识别结果]\n${visionResult.text}`
            inputEl.dispatchEvent(new Event('input'))
            showToast('图片识别完成', 'success')
          }
        } else {
          showToast('文件解析未返回文本内容', 'warning')
        }
      }
    } catch (err) {
      console.error('[iDrome Input] 文件处理失败:', err)
      showToast(`处理失败: ${err.message}`, 'error')
    } finally {
      document.body.removeChild(fileInput)
    }
  }

  fileInput.click()
}

/* ============================================================
 * 语音输入处理
 * ============================================================ */

let voiceRecognitionInstance = null

/**
 * 处理语音按钮点击
 */
async function handleVoiceClick(voiceBtn, inputEl) {
  try {
    // 动态导入 voice.js
    const { voiceRecognition } = await import('./voice.js')

    if (voiceRecognition.isRecording) {
      // 正在录音 → 停止并识别
      voiceBtn.classList.remove('recording')
      voiceBtn.setAttribute('aria-label', '语音输入')
      voiceBtn.title = '语音输入'

      showToast('正在识别语音...', 'info', 3000)
      try {
        const text = await voiceRecognition.stopAndRecognize()
        if (text && inputEl) {
          const prefix = inputEl.value ? ' ' : ''
          inputEl.value += prefix + text
          inputEl.dispatchEvent(new Event('input'))
          showToast('语音识别完成', 'success')
        }
      } catch (err) {
        console.error('[iDrome Input] 语音识别失败:', err)
        showToast(`语音识别失败: ${err.message}`, 'error')
      }
    } else {
      // 开始录音
      voiceRecognition.onStateChange = (isRecording) => {
        if (isRecording) {
          voiceBtn.classList.add('recording')
          voiceBtn.setAttribute('aria-label', '停止录音')
          voiceBtn.title = '停止录音'
        } else {
          voiceBtn.classList.remove('recording')
          voiceBtn.setAttribute('aria-label', '语音输入')
          voiceBtn.title = '语音输入'
        }
      }

      voiceRecognition.onError = (err) => {
        showToast(`录音错误: ${err.message}`, 'error')
        voiceBtn.classList.remove('recording')
        voiceBtn.setAttribute('aria-label', '语音输入')
        voiceBtn.title = '语音输入'
      }

      try {
        await voiceRecognition.startRecording()
        showToast('录音中...再次点击停止', 'info', 2000)
      } catch (err) {
        showToast(`录音启动失败: ${err.message}`, 'error')
      }
    }
  } catch (err) {
    console.error('[iDrome Input] 语音模块加载失败:', err)
    showToast('语音功能初始化失败，请检查网络连接', 'error')
  }
}

/* ============================================================
 * 朗读处理
 * ============================================================ */

let voiceSynthesisInstance = null

/**
 * 处理朗读按钮点击
 */
async function handleReadAloudClick(readAloudBtn) {
  try {
    const { voiceSynthesis } = await import('./voice.js')
    voiceSynthesisInstance = voiceSynthesis

    if (voiceSynthesis.isPlaying) {
      // 正在播放 → 暂停
      voiceSynthesis.pause()
      readAloudBtn.classList.remove('playing')
      readAloudBtn.classList.add('paused')
      readAloudBtn.setAttribute('aria-label', '继续朗读')
      readAloudBtn.title = '继续朗读'
      return
    }

    if (voiceSynthesis.isPaused) {
      // 暂停中 → 继续
      voiceSynthesis.resume()
      readAloudBtn.classList.remove('paused')
      readAloudBtn.classList.add('playing')
      readAloudBtn.setAttribute('aria-label', '暂停朗读')
      readAloudBtn.title = '暂停朗读'
      return
    }

    // 获取最后一条 AI 回复
    const { state } = await import('./state.js')
    const lastAssistantMsg = [...state.messages].reverse().find(m => m.role === 'assistant')
    if (!lastAssistantMsg || !lastAssistantMsg.content) {
      showToast('当前对话没有可朗读的 AI 回复', 'warning')
      return
    }

    // 朗读（去除 Markdown 标记，只读纯文本）
    const plainText = lastAssistantMsg.content
      .replace(/#{1,6}\s/g, '')          // 标题
      .replace(/\*\*(.+?)\*\*/g, '$1')    // 加粗
      .replace(/\*(.+?)\*/g, '$1')        // 斜体
      .replace(/`{1,3}[^`]*`{1,3}/g, '') // 代码
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 链接
      .replace(/!\[.*?\]\([^)]+\)/g, '')  // 图片
      .replace(/\|.*\|/g, '')             // 表格
      .replace(/[-*]\s/g, '')             // 列表
      .replace(/>\s/g, '')                // 引用
      .trim()

    if (!plainText) {
      showToast('AI 回复无可朗读的文本内容', 'warning')
      return
    }

    voiceSynthesis.onStateChange = (state) => {
      if (state === 'playing') {
        readAloudBtn.classList.add('playing')
        readAloudBtn.classList.remove('paused')
        readAloudBtn.setAttribute('aria-label', '暂停朗读')
        readAloudBtn.title = '暂停朗读'
      } else if (state === 'paused') {
        readAloudBtn.classList.remove('playing')
        readAloudBtn.classList.add('paused')
        readAloudBtn.setAttribute('aria-label', '继续朗读')
        readAloudBtn.title = '继续朗读'
      } else {
        readAloudBtn.classList.remove('playing', 'paused')
        readAloudBtn.setAttribute('aria-label', '朗读当前对话')
        readAloudBtn.title = '朗读当前对话'
      }
    }

    try {
      readAloudBtn.classList.add('playing')
      readAloudBtn.setAttribute('aria-label', '暂停朗读')
      readAloudBtn.title = '暂停朗读'
      await voiceSynthesis.speak(plainText)
      showToast('朗读完成', 'success', 1500)
    } catch (err) {
      console.error('[iDrome Input] 朗读失败:', err)
      readAloudBtn.classList.remove('playing', 'paused')
      showToast(`朗读失败: ${err.message}`, 'error')
    }
  } catch (err) {
    console.error('[iDrome Input] 语音模块加载失败:', err)
    showToast('朗读功能初始化失败，请检查网络连接', 'error')
  }
}
