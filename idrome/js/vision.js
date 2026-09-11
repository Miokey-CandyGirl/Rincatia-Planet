/**
 * iDrome — 图像识别模块
 * 步骤 8.1：按设计方案第 21 章实现
 *
 * 功能：
 * - VisionRecognition 类 — 图片 OCR / 图片理解
 * - 图片压缩（Canvas 最长边 2048px）
 * - Base64 编码
 * - DeepSeek Vision 优先，豆包 OCR 回退
 * - 上传进度 + AbortController 取消
 * - 图片消息渲染（缩略图 + 点击放大）
 *
 * 安全架构：前端不持有任何 API 密钥，通过 chat-proxy Edge Function 代理
 */

'use strict'

/**
 * 获取 Supabase 客户端
 */
function getSupabase() {
  if (typeof window !== 'undefined' && window.supabase) {
    return window.supabase
  }
  return null
}

/**
 * 获取 chat-proxy 端点
 */
function getChatProxyUrl() {
  const supabaseUrl =
    (typeof window !== 'undefined' && window.IDROME_CONFIG?.supabaseUrl) ||
    'https://kbbtsurqznyyqfoaoutt.supabase.co'
  return `${supabaseUrl}/functions/v1/chat-proxy`
}

/**
 * 获取认证头
 */
async function getAuthHeaders() {
  const supabase = getSupabase()
  if (!supabase || !supabase.auth) {
    throw new Error('未登录 — Supabase 客户端未初始化')
  }

  const { data: { session }, error } = await supabase.auth.getSession()
  if (error || !session) {
    throw new Error('未登录或会话已过期')
  }

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`
  }
}

/* ============================================================
 * VisionRecognition — 图像识别
 * ============================================================ */

export class VisionRecognition {
  constructor() {
    this.proxyUrl = getChatProxyUrl()
    this.abortController = null
  }

  /** 支持的图片格式 */
  static SUPPORTED_FORMATS = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/bmp'
  ]

  /** 支持的扩展名 */
  static SUPPORTED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'bmp', 'gif']

  /** 图片大小限制：20MB */
  static MAX_FILE_SIZE = 20 * 1024 * 1024

  /** 图片压缩参数 */
  static COMPRESS_MAX_EDGE = 2048  // 最长边像素
  static COMPRESS_QUALITY = 0.85   // JPEG 压缩质量

  /**
   * 取消当前操作
   */
  cancel() {
    if (this.abortController) {
      this.abortController.abort()
      this.abortController = null
    }
  }

  /**
   * 验证图片文件
   * @param {File} file
   * @returns {{ valid: boolean, error?: string }}
   */
  static validate(file) {
    if (!file) {
      return { valid: false, error: '未选择文件' }
    }

    if (!VisionRecognition.SUPPORTED_FORMATS.includes(file.type)) {
      // 也检查扩展名
      const ext = file.name.split('.').pop().toLowerCase()
      if (!VisionRecognition.SUPPORTED_EXTENSIONS.includes(ext)) {
        return {
          valid: false,
          error: `不支持的图片格式: ${file.type || ext}。支持: JPG, PNG, WebP, GIF, BMP`
        }
      }
    }

    if (file.size > VisionRecognition.MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `图片过大: ${(file.size / 1024 / 1024).toFixed(1)}MB。最大支持 20MB`
      }
    }

    return { valid: true }
  }

  /**
   * 图片 OCR / 文字提取
   * @param {File} imageFile - 图片文件
   * @param {string} prompt - 可选的识别指令
   * @param {Function} onProgress - 进度回调 (percent: 0-100)
   * @returns {Promise<{text: string, base64: string, mimeType: string}>}
   */
  async extractText(imageFile, prompt, onProgress) {
    const validation = VisionRecognition.validate(imageFile)
    if (!validation.valid) {
      throw new Error(validation.error)
    }

    onProgress?.(20)

    // 图片压缩 + Base64 编码
    const { base64, mimeType } = await this.compressAndEncode(imageFile)

    onProgress?.(60)

    // 发送到 chat-proxy（DeepSeek Vision 优先）
    const result = await this.callVisionAPI(base64, mimeType, prompt || '请提取并输出图片中的所有文字内容，保持原有格式和排版。')

    onProgress?.(100)

    return {
      text: result,
      base64,
      mimeType
    }
  }

  /**
   * 图片理解（通用描述）
   * @param {File} imageFile - 图片文件
   * @param {Function} onProgress - 进度回调
   * @returns {Promise<{text: string, base64: string, mimeType: string}>}
   */
  async describeImage(imageFile, onProgress) {
    return this.extractText(
      imageFile,
      '请详细描述这张图片的内容，包括场景、人物、物体、文字、颜色等所有可见元素。',
      onProgress
    )
  }

  /**
   * 图片压缩 + Base64 编码
   * 使用 Canvas 压缩：最长边不超过 COMPRESS_MAX_EDGE
   */
  compressAndEncode(file) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const reader = new FileReader()

      reader.onload = () => {
        img.src = reader.result
      }

      img.onload = () => {
        let { width, height } = img
        const maxEdge = VisionRecognition.COMPRESS_MAX_EDGE

        // 等比缩放
        if (width > maxEdge || height > maxEdge) {
          const ratio = Math.min(maxEdge / width, maxEdge / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        // 输出为 JPEG（WebP 兼容性问题较多，统一用 JPEG）
        const mimeType = 'image/jpeg'
        const dataUrl = canvas.toDataURL(mimeType, VisionRecognition.COMPRESS_QUALITY)
        const base64 = dataUrl.split(',')[1]

        console.log(`[Vision] 图片压缩: ${file.name} ${file.size / 1024}KB → ${(base64.length * 0.75 / 1024).toFixed(1)}KB (${width}x${height})`)

        resolve({ base64, mimeType, width, height })
      }

      img.onerror = () => reject(new Error('图片加载失败，请确认文件完整'))

      reader.onerror = () => reject(new Error('图片读取失败'))

      reader.readAsDataURL(file)
    })
  }

  /**
   * 调用 Vision API（通过 chat-proxy Edge Function 代理）
   * 策略：先尝试豆包视觉模型（原生支持图片理解），失败则回退 DeepSeek
   * 豆包视觉模型通过 chat-proxy 内部路由（isDoubao 判断）
   */
  async callVisionAPI(base64, mimeType, prompt) {
    this.abortController = new AbortController()

    const messages = [{
      role: 'user',
      content: [
        {
          type: 'image_url',
          image_url: {
            url: `data:${mimeType};base64,${base64}`,
            detail: 'high'
          }
        },
        {
          type: 'text',
          text: prompt
        }
      ]
    }]

    // 优先使用豆包视觉模型（原生支持图片理解/OCR）
    // chat-proxy 会根据 model 名称中的 'doubao'/'seed' 关键字路由到豆包 API
    const visionModel = (typeof window !== 'undefined' && window.IDROME_CONFIG?.doubaoVisionModel) || 'doubao-vision-pro-32k'

    try {
      const response = await fetch(this.proxyUrl, {
        method: 'POST',
        headers: await getAuthHeaders(),
        body: JSON.stringify({
          messages: messages,
          options: {
            model: visionModel,
            stream: false,
            maxTokens: 4096,
            temperature: 0.1  // 低温度确保 OCR 准确性
          }
        }),
        signal: this.abortController.signal
      })

      if (response.ok) {
        const data = await response.json()
        const content = data.choices?.[0]?.message?.content || ''
        if (content) return content
      }

      // 豆包视觉模型失败，记录错误并尝试 DeepSeek 回退
      const errText = await response.text().catch(() => '')
      console.warn(`[Vision] 豆包视觉模型失败 (${response.status}): ${errText}，尝试 DeepSeek 回退`)
    } catch (e) {
      if (e.name === 'AbortError') throw e
      console.warn('[Vision] 豆包视觉模型异常:', e.message, '，尝试 DeepSeek 回退')
    }

    // DeepSeek 回退
    try {
      const response = await fetch(this.proxyUrl, {
        method: 'POST',
        headers: await getAuthHeaders(),
        body: JSON.stringify({
          messages: messages,
          options: {
            model: 'deepseek-v4-flash',
            stream: false,
            maxTokens: 4096,
            temperature: 0.1
          }
        }),
        signal: this.abortController.signal
      })

      if (!response.ok) {
        const errText = await response.text().catch(() => '')
        throw new Error(`图片识别失败 (${response.status}): ${errText}`)
      }

      const data = await response.json()
      return data.choices?.[0]?.message?.content || ''
    } catch (e) {
      if (e.name === 'AbortError') throw e
      throw new Error(`图片识别失败: 豆包和 DeepSeek 视觉模型均不可用。${e.message}`)
    }
  }

  /**
   * 文件转 Base64（不压缩）
   */
  static fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const base64 = reader.result.split(',')[1]
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  /**
   * 生成图片缩略图 HTML
   */
  static renderThumbnail(base64, mimeType, width, height) {
    const dataUrl = `data:${mimeType || 'image/jpeg'};base64,${base64}`
    const dims = width && height ? `(${width}x${height})` : ''

    return `
      <div class="image-thumbnail" data-full-src="${dataUrl}" onclick="this.querySelector('img').requestFullscreen?.() || window.open('${dataUrl}')">
        <img src="${dataUrl}" alt="上传的图片 ${dims}" loading="lazy" style="max-width:240px;max-height:240px;border-radius:8px;cursor:pointer;" />
        <div class="image-thumbnail-hint" style="font-size:11px;color:#999;margin-top:4px;">点击放大</div>
      </div>
    `
  }
}

// 默认导出
export const vision = new VisionRecognition()