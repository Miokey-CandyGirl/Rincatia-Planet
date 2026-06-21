/**
 * 格式化时间
 * @param {string} dateStr - ISO 时间字符串
 * @returns {string} 格式化后的时间字符串
 */
export function formatTime(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now - date

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < minute) return '刚刚'
  if (diff < hour) return `${Math.floor(diff / minute)} 分钟前`
  if (diff < day) return `${Math.floor(diff / hour)} 小时前`
  if (diff < 7 * day) return `${Math.floor(diff / day)} 天前`

  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * 校验手机号格式
 * @param {string} phone - 手机号
 * @returns {boolean}
 */
export function isValidPhone(phone) {
  return /^1[3-9]\d{9}$/.test(phone)
}

/**
 * 防抖
 * @param {Function} fn - 要防抖的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function}
 */
export function debounce(fn, delay = 300) {
  let timer = null
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

/**
 * 节流
 * @param {Function} fn - 要节流的函数
 * @param {number} interval - 间隔时间（毫秒）
 * @returns {Function}
 */
export function throttle(fn, interval = 300) {
  let lastTime = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastTime >= interval) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}