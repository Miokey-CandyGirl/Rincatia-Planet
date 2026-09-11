/**
 * iDrome — 知识库加载器
 *
 * 按设计方案第 28 章和分步执行步骤 6.1 实现：
 * - loadKnowledge(mode) — 加载模式知识库（system-prompt.md + 辅助文件）
 * - 占位符替换：[vocabulary] → vocabulary.md 内容，依次类推
 * - 版本号解析（# version: N）
 * - 版本化缓存（localStorage idrome_mode_${mode}_v${version}）
 * - 热更新检测（版本号变化时重新加载）
 * - refresh() — 手动刷新知识库
 * - clearCache() — 清除缓存
 *
 * 缓存策略：
 * - 首次加载：fetch system-prompt.md + 辅助文件 → 替换占位符 → 缓存到 localStorage
 * - 后续加载：检查 localStorage 缓存 → fetch system-prompt.md 首行版本号 → 版本一致则用缓存
 * - 热更新：版本号变化时清除旧缓存，重新加载所有文件
 */

'use strict'

/** 占位符 → 辅助文件路径映射 */
const PLACEHOLDER_MAP = {
  '[vocabulary]': 'vocabulary.md',
  '[grammar]': 'grammar.md',
  '[worldSetting]': 'world-setting.md',
  '[novel]': 'novel.md',
  '[characters]': 'characters.md'
}

/** 缓存键前缀 */
const CACHE_PREFIX = 'idrome_mode_'

/**
 * 解析版本号（首行 # version: N）
 * @param {string} content — 文件内容
 * @returns {number} 版本号，默认 1
 */
function parseVersion(content) {
  if (!content) return 1
  const match = content.match(/^#\s*version:\s*(\d+)/m)
  return match ? parseInt(match[1], 10) : 1
}

/**
 * 移除版本号行
 * @param {string} content — 文件内容
 * @returns {string} 移除版本号行后的内容
 */
function stripVersionLine(content) {
  if (!content) return ''
  return content.replace(/^#\s*version:\s*\d+\s*\n?/m, '')
}

/**
 * 获取缓存键
 * @param {string} mode — 模式名称
 * @param {number} version — 版本号
 * @returns {string} 缓存键
 */
function getCacheKey(mode, version) {
  return `${CACHE_PREFIX}${mode}_v${version}`
}

/**
 * 从 localStorage 读取缓存
 * @param {string} key — 缓存键
 * @returns {string|null} 缓存内容
 */
function getCache(key) {
  try {
    return localStorage.getItem(key)
  } catch (e) {
    return null
  }
}

/**
 * 写入 localStorage 缓存
 * @param {string} key — 缓存键
 * @param {string} content — 缓存内容
 */
function setCache(key, content) {
  try {
    localStorage.setItem(key, content)
  } catch (e) {
    console.warn('[iDrome Knowledge] 缓存写入失败:', e.message)
  }
}

/**
 * 清除指定模式的所有缓存
 * @param {string} mode — 模式名称
 */
function clearModeCache(mode) {
  try {
    const keysToRemove = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(`${CACHE_PREFIX}${mode}_`)) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k))
  } catch (e) {
    console.warn('[iDrome Knowledge] 清除缓存失败:', e.message)
  }
}

/**
 * fetch 文件内容（带错误处理）
 * @param {string} url — 文件 URL
 * @returns {Promise<string>} 文件文本内容
 */
async function fetchFile(url) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${url}`)
  }
  return response.text()
}

/**
 * 替换占位符 — 将 [placeholder] 替换为辅助文件内容
 * @param {string} promptContent — system-prompt.md 内容
 * @param {string} modeDir — 模式目录路径（如 'mode/tian-translation/'）
 * @returns {Promise<string>} 替换后的完整内容
 */
async function replacePlaceholders(promptContent, modeDir) {
  let result = promptContent

  for (const [placeholder, fileName] of Object.entries(PLACEHOLDER_MAP)) {
    if (!result.includes(placeholder)) continue

    try {
      const fileUrl = `${modeDir}${fileName}`
      const content = await fetchFile(fileUrl)
      // 移除辅助文件的版本号行
      const cleanContent = stripVersionLine(content).trim()
      result = result.split(placeholder).join(cleanContent)
    } catch (e) {
      console.warn(`[iDrome Knowledge] 加载辅助文件失败: ${fileName}`, e.message)
      // 加载失败时移除占位符，替换为空
      result = result.split(placeholder).join('')
    }
  }

  return result
}

/**
 * 加载模式知识库
 *
 * 流程：
 * 1. fetch system-prompt.md 首行获取版本号
 * 2. 检查 localStorage 是否有该版本缓存
 * 3. 有缓存 → 直接使用
 * 4. 无缓存 → fetch 完整 system-prompt.md + 辅助文件 → 替换占位符 → 缓存
 *
 * @param {string} mode — 模式名称 'general' | 'tian-translation' | 'novel-culture'
 * @param {string} [model] — 可选模型名称，用于加载模型专用提示词
 * @returns {Promise<string>} 完整的系统提示词（已替换占位符）
 */
export async function loadKnowledge(mode, model) {
  const modeDir = `./mode/${mode}/`
  // 当模型为 Doubao 时，使用 doubao-system-prompt.md
  const isDoubao = model && (model.toLowerCase().includes('doubao') || model.toLowerCase().includes('seed'))
  const promptFileName = isDoubao ? 'doubao-system-prompt.md' : 'system-prompt.md'
  const promptUrl = `${modeDir}${promptFileName}`

  try {
    // 1. 先 fetch system-prompt.md 获取当前版本号
    const rawPrompt = await fetchFile(promptUrl)
    const currentVersion = parseVersion(rawPrompt)

    // 2. 检查缓存（模型名称纳入缓存键）
    const cacheKey = getCacheKey(`${mode}_${isDoubao ? 'doubao' : 'deepseek'}`, currentVersion)
    const cached = getCache(cacheKey)
    if (cached) {
      console.log(`[iDrome Knowledge] 使用缓存: ${mode} v${currentVersion}`)
      return cached
    }

    // 3. 无缓存 — 清除旧版本缓存，重新加载
    clearModeCache(mode)

    // 4. 移除版本号行
    const promptContent = stripVersionLine(rawPrompt)

    // 5. 替换占位符
    const fullPrompt = await replacePlaceholders(promptContent, modeDir)

    // 6. 缓存
    setCache(cacheKey, fullPrompt)
    console.log(`[iDrome Knowledge] 知识库已加载并缓存: ${mode} v${currentVersion} (${fullPrompt.length} 字符)`)

    return fullPrompt
  } catch (e) {
    console.error(`[iDrome Knowledge] 加载知识库失败: ${mode}`, e)
    // 回退：返回通用提示词
    return getFallbackPrompt(mode)
  }
}

/**
 * 获取回退提示词（网络失败时使用）
 * @param {string} mode — 模式名称
 * @returns {string} 回退提示词
 */
function getFallbackPrompt(mode) {
  const basePrompt = '你是 iDrome AI 助手（DromAI），由华田中央大学蔚莱科技学院逐梦人工智能开发工作室开发。请使用简体中文回答用户的问题。'

  switch (mode) {
    case 'tian-translation':
      return basePrompt + '\n\n当前模式：田语翻译。你是琳凯蒂亚语（田语）翻译与解析专家。请尽你所知回答关于田语的问题。'
    case 'novel-culture':
      return basePrompt + '\n\n当前模式：小说文化。你是琳凯蒂亚文化小说《光线传奇》的深度解读专家。请尽你所知回答关于小说的问题。'
    default:
      return basePrompt
  }
}

/**
 * 刷新知识库 — 清除缓存并重新加载
 * 供设置面板"🔄 刷新知识库"按钮调用
 * @param {string} mode — 模式名称（可选，不传则刷新当前模式）
 * @returns {Promise<string>} 重新加载的知识库内容
 */
export async function refresh(mode) {
  if (mode) {
    clearModeCache(mode)
    return loadKnowledge(mode)
  }

  // 刷新所有模式
  const modes = ['general', 'tian-translation', 'novel-culture']
  const results = {}
  for (const m of modes) {
    clearModeCache(m)
    results[m] = await loadKnowledge(m)
  }
  console.log('[iDrome Knowledge] 所有模式知识库已刷新')
  return results
}

/**
 * 清除所有知识库缓存
 * 供知识库文件变更后调用（上传/删除文件后）
 */
export function clearCache() {
  try {
    const keysToRemove = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(CACHE_PREFIX)) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k))
    console.log(`[iDrome Knowledge] 已清除 ${keysToRemove.length} 个知识库缓存`)
  } catch (e) {
    console.warn('[iDrome Knowledge] 清除缓存失败:', e.message)
  }
}

/**
 * 获取个人知识库内容（从 Supabase 加载用户上传的文件文本）
 *
 * 按设计方案第 28.7 节：
 * - 从 knowledge_base_files 表加载用户知识库
 * - 拼接 extracted_text，截断到 knowledgeCharLimit
 * - 注入到系统提示词中
 *
 * @param {number} charLimit — 字符上限
 * @returns {Promise<string>} 拼接的知识库文本
 */
export async function loadUserKnowledgeBase(charLimit = 3000) {
  try {
    // 动态导入避免循环依赖
    const { loadKnowledgeBaseFiles } = await import('./conversations.js?v=step10')
    const files = await loadKnowledgeBaseFiles()

    if (!files || files.length === 0) return ''

    // 拼接所有文件的提取文本
    let combined = ''
    for (const file of files) {
      if (file.extracted_text) {
        // 兼容多字段：优先 file_name，回退 filename / original_name
        const displayName = file.file_name || file.filename || file.original_name || '未命名文件'
        combined += `--- ${displayName} ---\n${file.extracted_text}\n\n`
        if (combined.length >= charLimit) break
      }
    }

    // 截断到字符上限
    if (combined.length > charLimit) {
      combined = combined.slice(0, charLimit) + '\n...（内容已截断）'
    }

    console.log(`[iDrome Knowledge] 个人知识库已加载: ${files.length} 个文件, ${combined.length} 字符`)
    return combined
  } catch (e) {
    console.warn('[iDrome Knowledge] 加载个人知识库失败:', e.message)
    return ''
  }
}

export default {
  loadKnowledge,
  refresh,
  clearCache,
  loadUserKnowledgeBase,
  parseVersion,
  stripVersionLine
}
