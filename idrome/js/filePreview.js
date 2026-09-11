/**
 * iDrome — 知识库文件预览模块
 *
 * 功能：
 * - 支持 PDF / TXT / MD / JSON / CSV / DOC / DOCX / 图片等常见格式在线预览
 * - 文本类文件：缩放（字号调整）、搜索（关键词高亮 + 上/下一个导航）
 * - PDF 文件：通过浏览器内置 PDF Viewer 预览（原生支持缩放/翻页/搜索）
 * - 图片文件：居中展示 + 缩放
 * - 跨设备响应式（桌面/平板/移动端）
 *
 * 依赖：
 * - modal.js 的 showCustomModal（弹窗容器）
 * - Supabase Storage（获取文件签名 URL）
 */

'use strict'

import { showCustomModal } from './modal.js?v=step10'

/** 文件类型分类 */
const FILE_TYPE_CATEGORIES = {
  // 文本类 — 使用 extracted_text 预览，支持搜索与缩放
  text: ['txt', 'md', 'markdown', 'json', 'csv', 'tsv', 'log', 'xml', 'yaml', 'yml', 'ini', 'conf', 'js', 'ts', 'css', 'html', 'py', 'java', 'c', 'cpp', 'go', 'rs', 'rb', 'php', 'sh', 'sql'],
  // PDF — 使用 iframe + 浏览器原生 PDF Viewer
  pdf: ['pdf'],
  // 图片 — 使用 <img> 标签
  image: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg'],
  // Office 文档 — 优先 extracted_text，无则提示下载后查看
  office: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx']
}

/** 默认缩放配置 */
const ZOOM_CONFIG = {
  min: 0.6,
  max: 2.0,
  step: 0.1,
  default: 1.0
}

/**
 * 从文件名提取扩展名（小写）
 * @param {string} fileName
 * @returns {string}
 */
function getExtension(fileName) {
  if (!fileName) return ''
  const parts = fileName.split('.')
  return parts.length > 1 ? parts.pop().toLowerCase() : ''
}

/**
 * 根据扩展名判断文件类别
 * @param {string} ext
 * @returns {'text'|'pdf'|'image'|'office'|'unknown'}
 */
function categorizeFile(ext) {
  for (const [category, exts] of Object.entries(FILE_TYPE_CATEGORIES)) {
    if (exts.includes(ext)) return category
  }
  return 'unknown'
}

/**
 * 格式化文件大小
 * @param {number} bytes
 * @returns {string}
 */
function formatSize(bytes) {
  if (!bytes) return '未知'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

/**
 * 从 Supabase Storage 获取文件签名 URL（有效期 1 小时）
 * @param {string} filePath - Storage 中的文件路径
 * @returns {Promise<string|null>}
 */
async function getSignedUrl(filePath) {
  if (typeof window === 'undefined' || !window.supabase) return null
  try {
    const { data, error } = await window.supabase
      .storage
      .from('user_knowledge_base')
      .createSignedUrl(filePath, 3600)
    if (error) {
      console.warn('[iDrome Preview] 获取签名 URL 失败:', error.message)
      return null
    }
    return data?.signedUrl || null
  } catch (e) {
    console.warn('[iDrome Preview] 获取签名 URL 异常:', e.message)
    return null
  }
}

/**
 * HTML 转义
 * @param {string} text
 * @returns {string}
 */
function escapeHtml(text) {
  if (text === null || text === undefined) return ''
  const div = document.createElement('div')
  div.textContent = String(text)
  return div.innerHTML
}

/* ============================================================
 * 预览渲染器
 * ============================================================ */

/**
 * 渲染文本类文件预览（带搜索与缩放）
 * @param {HTMLElement} container - 预览内容容器
 * @param {Object} file - 文件记录
 */
function renderTextPreview(container, file) {
  const text = file.extracted_text || ''
  const displayName = file.file_name || file.filename || file.original_name || '未命名文件'

  let zoomLevel = ZOOM_CONFIG.default
  let searchQuery = ''
  let matchPositions = []
  let currentMatchIdx = -1

  container.innerHTML = `
    <div class="preview-toolbar">
      <button class="preview-tool-btn" data-action="zoom-out" title="缩小 (Ctrl+-)" aria-label="缩小">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
      </button>
      <span class="preview-zoom-display">${Math.round(zoomLevel * 100)}%</span>
      <button class="preview-tool-btn" data-action="zoom-in" title="放大 (Ctrl+=)" aria-label="放大">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
      </button>
      <button class="preview-tool-btn" data-action="zoom-reset" title="重置缩放">重置</button>
      <div class="preview-search-box">
        <input type="text" class="preview-search-input" placeholder="搜索内容..." aria-label="搜索文件内容" />
        <span class="preview-search-count" aria-live="polite"></span>
        <button class="preview-tool-btn" data-action="search-prev" title="上一个" aria-label="上一个匹配" disabled>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="18 15 12 9 6 15"/></svg>
        </button>
        <button class="preview-tool-btn" data-action="search-next" title="下一个" aria-label="下一个匹配" disabled>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
      </div>
    </div>
    <div class="preview-content-wrapper">
      <div class="preview-text-container" tabindex="0">${escapeHtml(text)}</div>
    </div>
  `

  const textContainer = container.querySelector('.preview-text-container')
  const zoomDisplay = container.querySelector('.preview-zoom-display')
  const searchInput = container.querySelector('.preview-search-input')
  const searchCount = container.querySelector('.preview-search-count')
  const prevBtn = container.querySelector('[data-action="search-prev"]')
  const nextBtn = container.querySelector('[data-action="search-next"]')

  /** 应用缩放 */
  function applyZoom() {
    const baseSize = 0.875 // 14px 基准
    textContainer.style.fontSize = (baseSize * zoomLevel).toFixed(3) + 'rem'
    zoomDisplay.textContent = Math.round(zoomLevel * 100) + '%'
  }

  /** 执行搜索 — 高亮所有匹配项并记录位置 */
  function doSearch() {
    searchQuery = searchInput.value.trim()
    matchPositions = []
    currentMatchIdx = -1

    if (!searchQuery) {
      // 清除高亮 — 恢复原始文本
      textContainer.textContent = text
      searchCount.textContent = ''
      prevBtn.disabled = true
      nextBtn.disabled = true
      return
    }

    // 构建高亮后的 HTML
    const lowerText = text.toLowerCase()
    const lowerQuery = searchQuery.toLowerCase()
    let html = ''
    let lastIdx = 0
    let pos = 0

    while (pos < text.length) {
      const found = lowerText.indexOf(lowerQuery, pos)
      if (found === -1) {
        html += escapeHtml(text.slice(lastIdx))
        break
      }
      html += escapeHtml(text.slice(lastIdx, found))
      matchPositions.push(found)
      html += `<mark class="preview-highlight" data-match-idx="${matchPositions.length - 1}">${escapeHtml(text.slice(found, found + searchQuery.length))}</mark>`
      lastIdx = found + searchQuery.length
      pos = lastIdx
    }

    textContainer.innerHTML = html

    if (matchPositions.length > 0) {
      searchCount.textContent = `1/${matchPositions.length}`
      currentMatchIdx = 0
      highlightCurrentMatch()
      prevBtn.disabled = false
      nextBtn.disabled = false
    } else {
      searchCount.textContent = '无匹配'
      prevBtn.disabled = true
      nextBtn.disabled = true
    }
  }

  /** 高亮当前匹配项并滚动到位置 */
  function highlightCurrentMatch() {
    const marks = textContainer.querySelectorAll('mark.preview-highlight')
    marks.forEach((m, i) => {
      m.classList.toggle('preview-highlight-current', i === currentMatchIdx)
    })
    if (currentMatchIdx >= 0 && marks[currentMatchIdx]) {
      marks[currentMatchIdx].scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    if (matchPositions.length > 0) {
      searchCount.textContent = `${currentMatchIdx + 1}/${matchPositions.length}`
    }
  }

  /** 上一个匹配 */
  function searchPrev() {
    if (matchPositions.length === 0) return
    currentMatchIdx = (currentMatchIdx - 1 + matchPositions.length) % matchPositions.length
    highlightCurrentMatch()
  }

  /** 下一个匹配 */
  function searchNext() {
    if (matchPositions.length === 0) return
    currentMatchIdx = (currentMatchIdx + 1) % matchPositions.length
    highlightCurrentMatch()
  }

  // 绑定工具栏事件
  container.querySelector('[data-action="zoom-out"]').addEventListener('click', () => {
    zoomLevel = Math.max(ZOOM_CONFIG.min, zoomLevel - ZOOM_CONFIG.step)
    applyZoom()
  })
  container.querySelector('[data-action="zoom-in"]').addEventListener('click', () => {
    zoomLevel = Math.min(ZOOM_CONFIG.max, zoomLevel + ZOOM_CONFIG.step)
    applyZoom()
  })
  container.querySelector('[data-action="zoom-reset"]').addEventListener('click', () => {
    zoomLevel = ZOOM_CONFIG.default
    applyZoom()
  })
  prevBtn.addEventListener('click', searchPrev)
  nextBtn.addEventListener('click', searchNext)

  // 搜索 — 防抖
  let searchTimer = null
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimer)
    searchTimer = setTimeout(doSearch, 300)
  })
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (e.shiftKey) searchPrev()
      else searchNext()
    } else if (e.key === 'Escape') {
      searchInput.value = ''
      doSearch()
    }
  })

  // 键盘快捷键 — Ctrl+= 放大, Ctrl+- 缩小
  container.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '+')) {
      e.preventDefault()
      zoomLevel = Math.min(ZOOM_CONFIG.max, zoomLevel + ZOOM_CONFIG.step)
      applyZoom()
    } else if ((e.ctrlKey || e.metaKey) && e.key === '-') {
      e.preventDefault()
      zoomLevel = Math.max(ZOOM_CONFIG.min, zoomLevel - ZOOM_CONFIG.step)
      applyZoom()
    }
  })

  applyZoom()

  // 无文本内容提示
  if (!text) {
    textContainer.innerHTML = `<div class="preview-empty">
      <p>该文件未提取到文本内容</p>
      <p class="preview-meta">可能是二进制文件或解析失败</p>
    </div>`
  }
}

/**
 * 渲染 PDF 文件预览（iframe + 浏览器原生 PDF Viewer）
 * @param {HTMLElement} container
 * @param {Object} file
 * @param {string} signedUrl
 */
function renderPdfPreview(container, file, signedUrl) {
  if (!signedUrl) {
    container.innerHTML = `<div class="preview-error">
      <p>无法获取 PDF 文件 URL</p>
      <p class="preview-meta">文件可能已被删除或存储权限不足</p>
    </div>`
    return
  }

  container.innerHTML = `
    <div class="preview-toolbar">
      <span class="preview-meta" style="margin-right: auto;">PDF 文档 · 浏览器内置查看器（支持缩放/翻页/搜索）</span>
    </div>
    <div class="preview-content-wrapper">
      <div class="preview-iframe-container">
        <iframe src="${signedUrl}#toolbar=1&navpanes=1&view=FitH" title="${escapeHtml(file.file_name || 'PDF 预览')}"></iframe>
      </div>
    </div>
  `
}

/**
 * 渲染图片预览
 * @param {HTMLElement} container
 * @param {Object} file
 * @param {string} signedUrl
 */
function renderImagePreview(container, file, signedUrl) {
  let zoomLevel = ZOOM_CONFIG.default

  if (!signedUrl) {
    container.innerHTML = `<div class="preview-error">
      <p>无法获取图片 URL</p>
      <p class="preview-meta">文件可能已被删除或存储权限不足</p>
    </div>`
    return
  }

  container.innerHTML = `
    <div class="preview-toolbar">
      <button class="preview-tool-btn" data-action="zoom-out" title="缩小" aria-label="缩小">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
      </button>
      <span class="preview-zoom-display">100%</span>
      <button class="preview-tool-btn" data-action="zoom-in" title="放大" aria-label="放大">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
      </button>
      <button class="preview-tool-btn" data-action="zoom-reset" title="重置缩放">重置</button>
    </div>
    <div class="preview-content-wrapper">
      <div class="preview-image-container">
        <img src="${signedUrl}" alt="${escapeHtml(file.file_name || '图片预览')}" />
      </div>
    </div>
  `

  const img = container.querySelector('img')
  const zoomDisplay = container.querySelector('.preview-zoom-display')

  function applyZoom() {
    img.style.transform = `scale(${zoomLevel})`
    zoomDisplay.textContent = Math.round(zoomLevel * 100) + '%'
  }

  container.querySelector('[data-action="zoom-out"]').addEventListener('click', () => {
    zoomLevel = Math.max(ZOOM_CONFIG.min, zoomLevel - ZOOM_CONFIG.step)
    applyZoom()
  })
  container.querySelector('[data-action="zoom-in"]').addEventListener('click', () => {
    zoomLevel = Math.min(ZOOM_CONFIG.max, zoomLevel + ZOOM_CONFIG.step)
    applyZoom()
  })
  container.querySelector('[data-action="zoom-reset"]').addEventListener('click', () => {
    zoomLevel = ZOOM_CONFIG.default
    applyZoom()
  })
}

/**
 * 渲染 Office 文档预览（回退到 extracted_text）
 * @param {HTMLElement} container
 * @param {Object} file
 */
function renderOfficePreview(container, file) {
  const text = file.extracted_text || ''
  const displayName = file.file_name || file.filename || file.original_name || '未命名文件'

  if (text) {
    // 有提取文本 — 复用文本预览器，但添加 Office 提示
    renderTextPreview(container, file)
    const toolbar = container.querySelector('.preview-toolbar')
    if (toolbar) {
      const hint = document.createElement('span')
      hint.className = 'preview-meta'
      hint.style.marginRight = 'auto'
      hint.textContent = 'Office 文档 · 显示提取文本（非原始排版）'
      toolbar.insertBefore(hint, toolbar.firstChild)
    }
  } else {
    container.innerHTML = `<div class="preview-empty">
      <p>该 Office 文档暂无法在线预览</p>
      <p class="preview-meta">文件名: ${escapeHtml(displayName)}</p>
      <p class="preview-meta">大小: ${formatSize(file.file_size)}</p>
      <p class="preview-meta" style="margin-top: 12px;">建议下载后使用对应软件查看</p>
    </div>`
  }
}

/* ============================================================
 * 公共 API
 * ============================================================ */

/**
 * 打开文件预览弹窗
 * @param {Object} file - 知识库文件记录（需含 file_name/file_path/file_type/extracted_text/file_size）
 */
export async function openFilePreview(file) {
  if (!file) return

  const displayName = file.file_name || file.filename || file.original_name || '未命名文件'
  const ext = getExtension(displayName)
  const category = categorizeFile(ext)
  const fileSize = formatSize(file.file_size)

  // 加载中状态
  await showCustomModal({
    title: displayName,
    size: 'large',
    bodyHtml: `<div class="preview-loading">
      <div class="spinner"></div>
      <p>正在加载文件预览...</p>
      <p class="preview-meta">${escapeHtml(displayName)} · ${fileSize}</p>
    </div>`,
    closeText: '关闭',
    onMount: async (dialog) => {
      const body = dialog.querySelector('.modal-custom-body')
      if (!body) return

      try {
        // PDF 和图片需要签名 URL
        if (category === 'pdf' || category === 'image') {
          const signedUrl = await getSignedUrl(file.file_path)
          if (category === 'pdf') {
            renderPdfPreview(body, file, signedUrl)
          } else {
            renderImagePreview(body, file, signedUrl)
          }
        } else if (category === 'text') {
          renderTextPreview(body, file)
        } else if (category === 'office') {
          renderOfficePreview(body, file)
        } else {
          // 未知类型 — 尝试 extracted_text 回退
          if (file.extracted_text) {
            renderTextPreview(body, file)
          } else {
            body.innerHTML = `<div class="preview-empty">
              <p>不支持在线预览此文件格式</p>
              <p class="preview-meta">文件名: ${escapeHtml(displayName)}</p>
              <p class="preview-meta">大小: ${fileSize}</p>
              <p class="preview-meta" style="margin-top: 12px;">格式: .${ext || '未知'}</p>
            </div>`
          }
        }
      } catch (e) {
        body.innerHTML = `<div class="preview-error">
          <p>预览加载失败</p>
          <p class="preview-meta">${escapeHtml(e.message || '未知错误')}</p>
        </div>`
      }
    }
  })
}

export default { openFilePreview }
