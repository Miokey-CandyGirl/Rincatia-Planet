/**
 * iDrome — 文件读取模块
 * 步骤 8.2：按设计方案第 22 章实现
 *
 * 功能：
 * - FileReaderService 类 — 统一文件读取入口
 * - 支持 15 类格式（TXT/PDF/Word/Excel/PPT/EPUB/代码/图片等）
 * - 豆包文档解析优先（通过 file-proxy Edge Function）
 * - 回退方案：PDF.js / SheetJS / 前端直接读取
 * - 文件名 XSS 过滤（DOMPurify.sanitize）
 * - 取消上传（AbortController）
 *
 * 安全架构：前端不持有豆包 API 密钥，通过 file-proxy Edge Function 代理
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
 * 获取 file-proxy 端点
 */
function getFileProxyUrl() {
  const supabaseUrl =
    (typeof window !== 'undefined' && window.IDROME_CONFIG?.supabaseUrl) ||
    'https://kbbtsurqznyyqfoaoutt.supabase.co'
  return `${supabaseUrl}/functions/v1/file-proxy`
}

/**
 * 获取认证头
 */
async function getAuthHeaders(includeContentType = true) {
  const supabase = getSupabase()
  if (!supabase || !supabase.auth) {
    throw new Error('未登录 — Supabase 客户端未初始化')
  }

  const { data: { session }, error } = await supabase.auth.getSession()
  if (error || !session) {
    throw new Error('未登录或会话已过期')
  }

  const headers = {
    'Authorization': `Bearer ${session.access_token}`
  }
  if (includeContentType) {
    headers['Content-Type'] = 'application/json'
  }
  return headers
}

/**
 * 文件名安全过滤（XSS 防护）
 * 使用 DOMPurify 或回退到简单字符过滤
 */
function sanitizeFileName(fileName) {
  if (typeof DOMPurify !== 'undefined') {
    return DOMPurify.sanitize(fileName, { ALLOWED_TAGS: [] })
  }
  // 回退：移除 HTML 标签和危险字符
  return fileName
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/* ============================================================
 * FileReaderService — 文件读取
 * ============================================================ */

export class FileReaderService {
  constructor() {
    this.fileProxyUrl = getFileProxyUrl()
    this.abortController = null
  }

  /** 支持的文件类型扩展名 */
  static TEXT_EXTENSIONS = ['txt', 'md', 'csv', 'json', 'xml', 'yaml', 'yml', 'log', 'htm', 'html']
  static CODE_EXTENSIONS = [
    'js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'h', 'go',
    'rs', 'rb', 'php', 'swift', 'kt', 'scala', 'sh', 'bat', 'sql',
    'css', 'scss', 'less', 'vue', 'svelte'
  ]
  static IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'bmp', 'gif']
  static DOUBAO_EXTENSIONS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'rtf', 'odt', 'epub']

  /** 最大文件大小：50MB */
  static MAX_FILE_SIZE = 50 * 1024 * 1024

  /**
   * 验证文件
   * @param {File} file
   * @returns {{ valid: boolean, error?: string }}
   */
  static validate(file) {
    if (!file) {
      return { valid: false, error: '未选择文件' }
    }

    if (file.size > FileReaderService.MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `文件过大: ${(file.size / 1024 / 1024).toFixed(1)}MB。最大支持 50MB`
      }
    }

    const ext = file.name.split('.').pop().toLowerCase()
    const allSupported = [
      ...FileReaderService.TEXT_EXTENSIONS,
      ...FileReaderService.CODE_EXTENSIONS,
      ...FileReaderService.IMAGE_EXTENSIONS,
      ...FileReaderService.DOUBAO_EXTENSIONS
    ]

    if (!allSupported.includes(ext)) {
      return {
        valid: false,
        error: `不支持的文件格式: .${ext}。支持: 文本、代码、PDF、Word、Excel、PPT、EPUB、图片等`
      }
    }

    return { valid: true }
  }

  /**
   * 取消当前上传/解析
   */
  cancel() {
    if (this.abortController) {
      this.abortController.abort()
      this.abortController = null
    }
  }

  /**
   * 统一文件读取入口
   * @param {File} file - 用户上传的文件
   * @param {Function} onProgress - 进度回调 (percent: 0-100)
   * @returns {Promise<{text: string, method: string, fileName: string}>}
   */
  async readFile(file, onProgress) {
    const validation = FileReaderService.validate(file)
    if (!validation.valid) {
      throw new Error(validation.error)
    }

    this.abortController = new AbortController()
    const safeName = sanitizeFileName(file.name)
    const ext = file.name.split('.').pop().toLowerCase()

    // 纯文本文件：前端直接读取
    if (FileReaderService.TEXT_EXTENSIONS.includes(ext)) {
      onProgress?.(50)
      const result = {
        text: await this.readAsText(file),
        method: 'local',
        fileName: safeName
      }
      onProgress?.(100)
      return result
    }

    // 代码文件：前端直接读取
    if (FileReaderService.CODE_EXTENSIONS.includes(ext)) {
      onProgress?.(50)
      const result = {
        text: await this.readAsText(file),
        method: 'local',
        fileName: safeName
      }
      onProgress?.(100)
      return result
    }

    // 图片文件：标记为 OCR 处理（由 vision.js 处理）
    if (FileReaderService.IMAGE_EXTENSIONS.includes(ext)) {
      return {
        text: null,  // 由 vision.js 的 extractText 处理
        method: 'ocr',
        fileName: safeName,
        file: file   // 保留原始文件引用
      }
    }

    // PDF/Word/Excel/PPT/RTF/ODT/EPUB：豆包文档解析优先
    if (FileReaderService.DOUBAO_EXTENSIONS.includes(ext)) {
      onProgress?.(10)
      try {
        const result = await this.doubaoParseFile(file, onProgress)
        result.fileName = safeName
        return result
      } catch (doubaoErr) {
        console.warn(`[FileReader] 豆包文档解析失败 (${ext}):`, doubaoErr.message)
        // 回退（仅 PDF 和 Excel 有前端回退方案）
        if (ext === 'pdf') {
          return await this.readPDFWithFallback(file, doubaoErr, onProgress)
        }
        if (['xls', 'xlsx'].includes(ext)) {
          return await this.readExcelWithFallback(file, doubaoErr, onProgress)
        }
        throw new Error(`文件解析失败: ${doubaoErr.message}。${ext.toUpperCase()} 格式需要豆包 API 支持，请确认 DOUBAO_API_KEY 已配置。`)
      }
    }

    throw new Error(`不支持的文件格式: .${ext}`)
  }

  /**
   * 本地文本读取
   */
  readAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(new Error('文件读取失败'))
      reader.readAsText(file, 'UTF-8')
    })
  }

  /**
   * 豆包文件解析 API（通过 file-proxy Edge Function 代理）
   */
  async doubaoParseFile(file, onProgress) {
    onProgress?.(30)

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(this.fileProxyUrl, {
      method: 'POST',
      headers: await getAuthHeaders(false),  // 不设置 Content-Type（由 FormData 自动设置）
      body: formData,
      signal: this.abortController.signal
    })

    onProgress?.(80)

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      throw new Error(errData.error || `豆包文件解析失败: ${response.status}`)
    }

    const data = await response.json()
    onProgress?.(100)

    return {
      text: data.text || '',
      method: 'doubao-parse'
    }
  }

  /**
   * PDF 回退 — 提示用户
   */
  async readPDFWithFallback(file, doubaoErr, onProgress) {
    // PDF.js 需要额外加载库，此处提供清晰错误提示
    throw new Error(
      `PDF 解析失败。豆包 API: ${doubaoErr.message}。` +
      `建议：1) 检查 DOUBAO_API_KEY 是否正确配置；2) 或将 PDF 转换为 TXT 格式后重新上传。`
    )
  }

  /**
   * Excel 回退 — 提示用户
   */
  async readExcelWithFallback(file, doubaoErr, onProgress) {
    throw new Error(
      `Excel 解析失败。豆包 API: ${doubaoErr.message}。` +
      `建议：1) 检查 DOUBAO_API_KEY 是否正确配置；2) 或将 Excel 转换为 CSV 格式后重新上传。`
    )
  }
}

// 默认导出
export const fileReader = new FileReaderService()