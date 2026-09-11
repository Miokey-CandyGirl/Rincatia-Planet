/**
 * iDrome — 设置面板
 *
 * 步骤 2 实现基础框架：
 * - 主题切换（浅色/深色/跟随系统）→ 写入 state.theme + data-theme 属性
 * - 字体大小调节 → 写入 state.fontSize
 * - 语言切换（预留 i18n 接口）
 *
 * 步骤 10 补充二级功能：
 * - 个人知识库上传区域
 * - 缓存管理
 * - 数据导出
 */

'use strict'

import { state } from './state.js'
import { showToast } from './toast.js'
import { showModalConfirm } from './modal.js?v=step10'
import {
  loadKnowledgeBaseFiles,
  uploadKnowledgeBaseFile,
  deleteKnowledgeBaseFile
} from './conversations.js?v=step10'
import { clearCache as clearKnowledgeCache, refresh as refreshKnowledge } from './knowledgeLoader.js?v=step10'
import { openFilePreview } from './filePreview.js?v=step10'

/** localStorage 键名 */
const THEME_KEY = 'idrome-theme'
const FONT_SIZE_KEY = 'idrome-font-size'
const MODEL_KEY = 'idrome-current-model'

/** 可用模型列表 */
const AVAILABLE_MODELS = [
  { id: 'deepseek-v4-flash', name: 'DromAI 2.0', desc: '快速响应，日常对话' },
  { id: 'deepseek-v4-pro', name: 'DeepSeek-V4（待接入）', desc: '更强能力，复杂任务' },
  { id: 'Doubao-Seed-2.1', name: 'Doubao-Seed-2.1', desc: '多模态分析，工具调用' },
  { id: 'ERNIE 5.1', name: '文心 ERNIE 5.1（待接入）', desc: '检索增强，文献引用' }
]

/**
 * 初始化设置面板
 * - 主题切换
 * - 字体大小调节
 * - 设置面板打开/关闭
 * - 语言切换预留
 */
export function initSettings() {
  initTheme()
  initFontSize()
  initSettingsPanel()
  initLanguageSwitch()
  initModelParams()
  initModelSelector()
  initKnowledgeBase()

  console.log('[iDrome Settings] 设置面板已初始化')
}

/* ============================================================
 * 主题切换
 * ============================================================ */

/**
 * 应用主题
 * @param {'light'|'dark'|'auto'} theme
 */
export function applyTheme(theme) {
  // 写入响应式状态
  state.theme = theme

  const root = document.documentElement

  if (theme === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
  } else {
    root.setAttribute('data-theme', theme)
  }

  // 更新主题选项选中态
  document.querySelectorAll('.theme-option').forEach(opt => {
    opt.classList.toggle('selected', opt.dataset.theme === theme)
  })

  // 保存到 localStorage
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch (e) {
    console.warn('[iDrome Settings] 主题保存失败：', e)
  }
}

/**
 * 初始化主题
 * 从 localStorage 读取保存的主题，绑定主题选项点击事件
 */
function initTheme() {
  let savedTheme = 'light'
  try {
    savedTheme = localStorage.getItem(THEME_KEY) || 'light'
  } catch (e) {
    // 忽略
  }
  applyTheme(savedTheme)

  // 主题选项点击
  document.querySelectorAll('.theme-option').forEach(opt => {
    opt.addEventListener('click', () => {
      applyTheme(opt.dataset.theme)
    })
  })

  // 跟随系统主题变化（当设置为 auto 时）
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (state.theme === 'auto') applyTheme('auto')
  })
}

/* ============================================================
 * 字体大小
 * ============================================================ */

/**
 * 应用字体大小
 * @param {number} size - 字体大小（px）
 */
export function applyFontSize(size) {
  // 写入响应式状态
  state.fontSize = size

  document.documentElement.style.fontSize = `${size}px`

  const valueEl = document.getElementById('fontSizeValue')
  if (valueEl) valueEl.textContent = `${size}px`

  try {
    localStorage.setItem(FONT_SIZE_KEY, String(size))
  } catch (e) {
    console.warn('[iDrome Settings] 字体大小保存失败：', e)
  }
}

/**
 * 初始化字体大小
 */
function initFontSize() {
  let savedSize = 15
  try {
    savedSize = parseInt(localStorage.getItem(FONT_SIZE_KEY)) || 15
  } catch (e) {
    // 忽略
  }

  const slider = document.getElementById('fontSizeSlider')
  if (slider) {
    slider.value = savedSize
    slider.addEventListener('input', () => {
      applyFontSize(parseInt(slider.value))
    })
  }
  applyFontSize(savedSize)
}

/* ============================================================
 * 语言切换（预留 i18n 接口）
 * ============================================================ */

/**
 * 初始化语言切换
 * 步骤 2 仅预留接口，步骤 10 完善
 */
function initLanguageSwitch() {
  const langSelect = document.getElementById('languageSelect')
  if (langSelect) {
    langSelect.addEventListener('change', () => {
      console.log('[iDrome Settings] 语言切换（步骤 10 实现）：', langSelect.value)
      // TODO: 步骤 10 实现 i18n
    })
  }
}

/* ============================================================
 * 设置面板打开/关闭
 * ============================================================ */

/**
 * 打开设置面板
 */
export function openSettings() {
  const modal = document.getElementById('settingsModal')
  if (modal) {
    modal.style.display = 'flex'
    modal.setAttribute('aria-hidden', 'false')
    requestAnimationFrame(() => {
      modal.classList.add('open')
    })
  }
}

/**
 * 关闭设置面板
 */
export function closeSettings() {
  const modal = document.getElementById('settingsModal')
  if (modal) {
    modal.classList.remove('open')
    modal.setAttribute('aria-hidden', 'true')
    setTimeout(() => {
      modal.style.display = 'none'
    }, 200)
  }
}

/**
 * 初始化设置面板交互
 */
function initSettingsPanel() {
  const closeBtn = document.getElementById('settingsCloseBtn')
  const overlay = document.getElementById('settingsOverlay')

  if (closeBtn) closeBtn.addEventListener('click', closeSettings)
  if (overlay) overlay.addEventListener('click', closeSettings)
}

/* ============================================================
 * 模型参数（Step 5.8 新增）
 * ============================================================ */

/**
 * 初始化模型参数面板
 * - 温度滑块
 * - 最大 Token 数输入
 * - 保存按钮
 */
function initModelParams() {
  const tempSlider = document.getElementById('temperatureSlider')
  const tempValue = document.getElementById('temperatureValue')
  const maxTokensInput = document.getElementById('maxTokensInput')
  const saveBtn = document.getElementById('saveParamsBtn')

  // 从 state 加载当前值
  if (tempSlider) {
    tempSlider.value = state.modelParams?.temperature ?? 0.7
  }
  if (tempValue) {
    tempValue.textContent = state.modelParams?.temperature ?? 0.7
  }
  if (maxTokensInput) {
    maxTokensInput.value = state.modelParams?.maxTokens ?? 4096
  }

  // 温度滑块实时更新显示
  if (tempSlider && tempValue) {
    tempSlider.addEventListener('input', () => {
      tempValue.textContent = parseFloat(tempSlider.value).toFixed(1)
    })
  }

  // 保存按钮
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const temperature = parseFloat(tempSlider?.value || 0.7)
      const maxTokens = parseInt(maxTokensInput?.value || 4096)

      // 验证范围
      if (temperature < 0 || temperature > 2) {
        showToast('温度参数应在 0.0 ~ 2.0 之间', 'warning')
        return
      }
      if (maxTokens < 256 || maxTokens > 8192) {
        showToast('最大 Token 数应在 256 ~ 8192 之间', 'warning')
        return
      }

      // 保存到 state 和 localStorage
      state.modelParams = { temperature, maxTokens }
      try {
        localStorage.setItem('idrome_model_params', JSON.stringify({ temperature, maxTokens }))
        showToast('参数已保存', 'success', 1500)
      } catch (e) {
        showToast('保存失败', 'error')
      }
    })
  }
}

/* ============================================================
 * 模型选择（从工具栏迁移至系统设置）
 * ============================================================ */

/**
 * 从 localStorage 加载已保存的模型 ID
 * @returns {string} 模型 ID
 */
export function loadSavedModel() {
  try {
    const saved = localStorage.getItem(MODEL_KEY)
    if (saved && AVAILABLE_MODELS.find(m => m.id === saved)) {
      return saved
    }
  } catch (e) {
    console.warn('[iDrome Settings] 加载模型选择失败:', e)
  }
  return 'deepseek-v4-flash'
}

/**
 * 初始化模型选择器（设置面板内）
 * - 从 localStorage 加载已保存的模型
 * - 渲染模型选项列表
 * - 绑定点击切换事件
 */
function initModelSelector() {
  // 从 localStorage 加载已保存的模型
  const savedModel = loadSavedModel()
  state.currentModel = savedModel

  const container = document.getElementById('modelSelectorSettings')
  if (!container) return

  // 渲染模型选项列表
  container.innerHTML = AVAILABLE_MODELS.map(m => `
    <div class="model-option-settings ${m.id === savedModel ? 'selected' : ''}" data-model="${m.id}" role="button" tabindex="0">
      <div class="model-option-name">${m.name}</div>
      <div class="model-option-desc">${m.desc}</div>
      <svg class="model-check-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
    </div>
  `).join('')

  // 绑定点击选择
  container.querySelectorAll('.model-option-settings').forEach(opt => {
    opt.addEventListener('click', async () => {
      const modelId = opt.dataset.model
      await handleModelSwitch(modelId)
    })

    // 键盘支持
    opt.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        opt.click()
      }
    })
  })

  console.log('[iDrome Settings] 模型选择器已初始化，当前模型:', savedModel)
}

/**
 * 处理模型切换
 * @param {string} modelId - 模型 ID
 */
async function handleModelSwitch(modelId) {
  if (state.currentModel === modelId) return

  state.currentModel = modelId

  // 持久化到 localStorage — 确保会话间保持
  try {
    localStorage.setItem(MODEL_KEY, modelId)
  } catch (e) {
    console.warn('[iDrome Settings] 保存模型选择失败:', e)
  }

  // 更新 UI 选中态
  document.querySelectorAll('.model-option-settings').forEach(opt => {
    opt.classList.toggle('selected', opt.dataset.model === modelId)
  })

  // 如果有当前对话，更新数据库中的 model 字段
  if (state.currentConversationId) {
    try {
      const { updateConversationModel } = await import('./conversations.js?v=step10')
      await updateConversationModel(state.currentConversationId, modelId)
    } catch (e) {
      console.warn('[iDrome Settings] 更新对话模型失败:', e)
    }
  }

  const model = AVAILABLE_MODELS.find(m => m.id === modelId)
  showToast(`已切换到 ${model?.name || modelId}`, 'success', 1500)
}

/* ============================================================
 * 个人知识库（Step 6 新增）
 * ============================================================ */

/** 知识库字符上限 localStorage 键名 */
const KB_CHAR_LIMIT_KEY = 'idrome_kb_char_limit'

/**
 * 格式化文件大小
 * @param {number} bytes
 * @returns {string}
 */
function formatFileSize(bytes) {
  if (!bytes) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * 初始化知识库上传 UI
 */
function initKnowledgeBase() {
  // 1. 字符上限滑块
  const slider = document.getElementById('knowledgeCharLimitSlider')
  const valueLabel = document.getElementById('knowledgeCharLimitValue')
  if (slider && valueLabel) {
    // 从 localStorage 加载
    const savedLimit = parseInt(localStorage.getItem(KB_CHAR_LIMIT_KEY) || '3000', 10)
    slider.value = savedLimit
    valueLabel.textContent = savedLimit
    state.knowledgeCharLimit = savedLimit

    slider.addEventListener('input', () => {
      valueLabel.textContent = slider.value
      state.knowledgeCharLimit = parseInt(slider.value, 10)
    })
    slider.addEventListener('change', () => {
      localStorage.setItem(KB_CHAR_LIMIT_KEY, slider.value)
      showToast(`字符上限已设为 ${slider.value}`, 'info', 1500)
    })
  }

  // 2. 文件上传区域
  const uploadArea = document.getElementById('kbUploadArea')
  const fileInput = document.getElementById('kbFileInput')

  if (uploadArea && fileInput) {
    // 点击上传
    uploadArea.addEventListener('click', () => {
      fileInput.click()
    })

    // 拖拽上传
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault()
      uploadArea.classList.add('drag-over')
    })
    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('drag-over')
    })
    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault()
      uploadArea.classList.remove('drag-over')
      const files = e.dataTransfer.files
      if (files && files.length > 0) {
        handleFileUpload(files[0])
      }
    })

    // 文件选择
    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files.length > 0) {
        handleFileUpload(fileInput.files[0])
        fileInput.value = '' // 重置 input 允许重复选择同一文件
      }
    })
  }

  // 3. 刷新知识库按钮
  const refreshBtn = document.getElementById('kbRefreshBtn')
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      refreshBtn.disabled = true
      refreshBtn.classList.add('loading')
      try {
        clearKnowledgeCache()
        await refreshKnowledge()
        showToast('知识库已刷新', 'success', 1500)
      } catch (e) {
        showToast('刷新失败: ' + e.message, 'error', 2000)
      } finally {
        refreshBtn.disabled = false
        refreshBtn.classList.remove('loading')
      }
    })
  }

  // 4. 加载已上传文件列表
  loadKnowledgeBaseFileList()
}

/**
 * 处理文件上传
 * @param {File} file
 */
async function handleFileUpload(file) {
  // 文件大小检查（10MB）
  if (file.size > 10 * 1024 * 1024) {
    showToast('文件大小不能超过 10MB', 'error', 3000)
    return
  }

  // 文件类型检查
  const allowedTypes = ['.txt', '.md', '.markdown', '.pdf', '.doc', '.docx']
  const ext = '.' + (file.name.split('.').pop() || '').toLowerCase()
  if (!allowedTypes.includes(ext)) {
    showToast('不支持的文件格式，请上传 TXT/MD/PDF/DOC/DOCX', 'error', 3000)
    return
  }

  // 显示上传进度
  const progressEl = document.getElementById('kbUploadProgress')
  const progressFill = document.getElementById('kbProgressFill')
  const progressText = document.getElementById('kbProgressText')
  if (progressEl) progressEl.style.display = 'flex'
  if (progressFill) progressFill.style.width = '30%'
  if (progressText) progressText.textContent = '上传中...'

  try {
    if (progressFill) progressFill.style.width = '60%'
    if (progressText) progressText.textContent = '解析中...'

    const { data, error } = await uploadKnowledgeBaseFile(file)

    if (error) {
      throw new Error(error)
    }

    if (progressFill) progressFill.style.width = '100%'
    if (progressText) progressText.textContent = '完成'

    showToast(`文件 "${file.name}" 上传成功`, 'success', 2000)

    // 刷新文件列表
    await loadKnowledgeBaseFileList()

    // 清除知识库缓存（下次对话时重新加载）
    clearKnowledgeCache()
  } catch (e) {
    showToast('上传失败: ' + e.message, 'error', 3000)
  } finally {
    setTimeout(() => {
      if (progressEl) progressEl.style.display = 'none'
      if (progressFill) progressFill.style.width = '0%'
    }, 1000)
  }
}

/**
 * 加载已上传文件列表
 */
async function loadKnowledgeBaseFileList() {
  const listEl = document.getElementById('kbFileList')
  if (!listEl) return

  try {
    const files = await loadKnowledgeBaseFiles()

    // 更新 state
    state.knowledgeBaseFiles = files || []

    if (!files || files.length === 0) {
      listEl.innerHTML = '<p class="kb-empty-hint">暂无知识库文件</p>'
      return
    }

    listEl.innerHTML = files.map(f => {
      // 兼容多字段：优先 file_name，回退 filename / original_name
      const displayName = f.file_name || f.filename || f.original_name || '未命名文件'
      return `
      <div class="kb-file-item" data-file-id="${f.id}" data-file-path="${f.file_path || ''}" role="button" tabindex="0" aria-label="预览文件 ${displayName}" title="点击预览文件">
        <div class="kb-file-info">
          <span class="kb-file-name" title="${displayName}">${displayName}</span>
          <span class="kb-file-meta">${formatFileSize(f.file_size)}</span>
        </div>
        <button class="kb-file-preview-btn" data-action="preview" aria-label="预览文件" title="预览">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
        <button class="kb-file-delete" data-action="delete" aria-label="删除文件" title="删除">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </div>
    `}).join('')

    // 绑定文件项点击 / 键盘事件 — 打开预览
    listEl.querySelectorAll('.kb-file-item').forEach(item => {
      const openPreview = async (e) => {
        // 点击预览按钮或文件项本身（非删除按钮）时触发
        if (e.target.closest('[data-action="delete"]')) return
        e.stopPropagation()
        const fileId = parseInt(item.dataset.fileId, 10)
        const fileRecord = files.find(f => f.id === fileId)
        if (!fileRecord) {
          showToast('文件信息未找到', 'error', 1500)
          return
        }
        await openFilePreview(fileRecord)
      }

      // 点击文件项（含预览按钮）打开预览
      item.addEventListener('click', openPreview)
      // 键盘支持 — Enter / Space 触发预览
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          openPreview(e)
        }
      })
    })

    // 绑定删除按钮
    listEl.querySelectorAll('.kb-file-delete').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation()
        const item = btn.closest('.kb-file-item')
        if (!item) return
        const fileId = parseInt(item.dataset.fileId, 10)
        const filePath = item.dataset.filePath

        const confirmed = await showModalConfirm('确定删除此文件？', {
          title: '删除知识库文件',
          confirmText: '删除',
          danger: true
        })
        if (!confirmed) return

        const { success, error } = await deleteKnowledgeBaseFile(fileId, filePath)
        if (success) {
          showToast('文件已删除', 'success', 1500)
          await loadKnowledgeBaseFileList()
          clearKnowledgeCache()
        } else {
          showToast('删除失败: ' + (error || '未知错误'), 'error', 2000)
        }
      })
    })
  } catch (e) {
    listEl.innerHTML = '<p class="kb-empty-hint">加载失败</p>'
  }
}
