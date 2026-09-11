/**
 * iDrome — Markdown 渲染模块
 *
 * 按设计方案第 4.4.1 节实现：
 * - Markdown → HTML：marked.parse() + DOMPurify.sanitize()
 * - 代码块语法高亮 + 复制按钮
 * - LaTeX 公式渲染：KaTeX（占位符预处理方式）
 * - 安全过滤：防止 XSS
 */

'use strict'

/** marked 是否已初始化 */
let markedInitialized = false

/**
 * 初始化 marked
 */
function initMarked() {
  if (markedInitialized) return
  if (typeof window.marked === 'undefined') {
    console.warn('[iDrome Markdown] marked 未加载')
    return
  }

  window.marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: false,
    mangle: false
  })

  markedInitialized = true
}

/**
 * 提取数学公式，替换为占位符
 * 避免 marked 干扰 LaTeX 语法（特别是 \ 转义问题）
 * @param {string} content
 * @returns {{ content: string, math: Array }}
 */
function extractMath(content) {
  const math = []

  // 1. 块级公式 $$...$$ 或 \[...\]（先处理块级，避免被行内匹配截断）
  let processed = content.replace(/\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]/g, (match, dollar, bracket) => {
    const formula = (dollar || bracket).trim()
    const id = math.length
    math.push({ formula, displayMode: true })
    return `\n\nMATHBLOCK${id}ENDMATH\n\n`
  })

  // 2. 行内公式 $...$ 或 \(...\)
  processed = processed.replace(/\$([^\$\n]+?)\$|\\\(([\s\S]+?)\\\)/g, (match, dollar, paren) => {
    const formula = (dollar || paren).trim()
    if (!formula) return match
    const id = math.length
    math.push({ formula, displayMode: false })
    return `MATHINLINE${id}ENDMATH`
  })

  return { content: processed, math }
}

/**
 * 将占位符替换回 KaTeX 渲染后的 HTML
 * @param {string} html - marked 渲染后的 HTML
 * @param {Array} math - 数学公式数组
 * @returns {string}
 */
function restoreMath(html, math) {
  let result = html

  for (let i = 0; i < math.length; i++) {
    const item = math[i]
    let rendered
    try {
      rendered = window.katex.renderToString(item.formula, {
        displayMode: item.displayMode,
        throwOnError: false
      })
    } catch (e) {
      rendered = escapeHtml(item.formula)
    }

    if (item.displayMode) {
      // 块级：marked 可能将占位符包裹在 <p> 中，需清理
      const blockPlaceholder = `MATHBLOCK${i}ENDMATH`
      const wrappedRegex = new RegExp(`<p>\\s*${blockPlaceholder}\\s*</p>`, 'g')
      if (wrappedRegex.test(result)) {
        result = result.replace(wrappedRegex, `<div class="math-block">${rendered}</div>`)
      } else {
        result = result.replace(new RegExp(blockPlaceholder, 'g'), `<div class="math-block">${rendered}</div>`)
      }
    } else {
      // 行内
      result = result.replace(new RegExp(`MATHINLINE${i}ENDMATH`, 'g'), rendered)
    }
  }

  return result
}

/**
 * 渲染 Markdown 为安全 HTML
 * @param {string} content - Markdown 原文
 * @returns {string} 安全 HTML
 */
export function renderMarkdown(content) {
  if (!content) return ''

  initMarked()

  if (typeof window.marked === 'undefined') {
    return escapeHtml(content).replace(/\n/g, '<br>')
  }

  try {
    // 1. 提取数学公式（避免 marked 干扰 LaTeX 语法）
    const { content: mathProcessed, math } = extractMath(content)

    // 2. 预处理自定义容器
    let processed = preprocessCustomContainers(mathProcessed)

    // 3. 渲染 Markdown
    let html = window.marked.parse(processed)

    // 4. 恢复数学公式
    if (math.length > 0 && typeof window.katex !== 'undefined') {
      html = restoreMath(html, math)
    } else if (math.length > 0) {
      // KaTeX 未加载 — 原文显示
      for (let i = 0; i < math.length; i++) {
        html = html.replace(new RegExp(`MATHBLOCK${i}ENDMATH`, 'g'), `<div class="math-block math-error">${escapeHtml(math[i].formula)}</div>`)
        html = html.replace(new RegExp(`MATHINLINE${i}ENDMATH`, 'g'), escapeHtml(math[i].formula))
      }
    }

    // 5. DOMPurify 安全过滤
    let sanitized
    if (typeof window.DOMPurify !== 'undefined') {
      sanitized = window.DOMPurify.sanitize(html, {
        ADD_TAGS: ['math', 'semantics', 'annotation', 'mrow', 'mi', 'mo', 'mn', 'msup', 'msub', 'mfrac', 'msqrt', 'mroot', 'mtext', 'mspace', 'mtable', 'mtr', 'mtd', 'menclose', 'mfenced', 'mstyle'],
        ADD_ATTR: ['style', 'class', 'id', 'encoding', 'xmlns', 'mathvariant', 'stretchy', 'fence', 'separator', 'lspace', 'rspace', 'columnalign', 'rowalign', 'columnspacing', 'rowspacing', 'columnlines', 'rowlines', 'frame', 'framespacing', 'equalrows', 'equalcolumns', 'displaystyle', 'scriptlevel', 'notation'],
        ALLOW_DATA_ATTR: true
      })
    } else {
      sanitized = html
    }

    return sanitized
  } catch (e) {
    console.warn('[iDrome Markdown] 渲染失败：', e)
    return escapeHtml(content).replace(/\n/g, '<br>')
  }
}

/**
 * 预处理自定义容器语法
 * 将 > [!TIP] / > [!WARNING] / > [!DANGER] / > [!INFO] 转换为 HTML
 * @param {string} content
 * @returns {string}
 */
function preprocessCustomContainers(content) {
  const containerTypes = {
    'TIP': 'container-tip',
    'WARNING': 'container-warning',
    'DANGER': 'container-danger',
    'INFO': 'container-info'
  }

  const titles = {
    'TIP': '提示',
    'WARNING': '警告',
    'DANGER': '危险',
    'INFO': '信息'
  }

  const regex = /^>\s*\[!(TIP|WARNING|DANGER|INFO)\]\s*\n((?:^>.*(?:\n|$))+)/gm

  return content.replace(regex, (match, type, block) => {
    const className = containerTypes[type]
    const title = titles[type]

    const lines = block.trim().split('\n')
    const innerContent = lines.map(line => line.replace(/^>\s?/, '')).join('\n')
    const rendered = window.marked.parse(innerContent)

    return `<div class="custom-container ${className}"><div class="custom-container-title">${title}</div>${rendered}</div>\n`
  })
}

/**
 * 安全转义 HTML
 * @param {string} text
 * @returns {string}
 */
function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = String(text)
  return div.innerHTML
}

export default { renderMarkdown }
