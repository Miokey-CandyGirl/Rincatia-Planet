/**
 * 田历（Tian Calendar）系统 - Vue 3 Composable
 * 公历与田历的双向转换、日期格式化和节日查询
 * 基于 consultation/tian-calendar.js 实现
 */

import { ref, computed, onMounted } from 'vue'

// 纪元起点：2015年3月21日（公历） - 华田元年1月1日
const EPOCH = { YEAR: 2015, MONTH: 3, DAY: 21 }

// 每月基础天数
const DAYS_IN_MONTH = [30, 31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30]

// 月份名称
const MONTH_NAMES = [
  '01月', '02月', '03月', '04月', '05月', '06月',
  '07月', '08月', '09月', '10月', '11月', '12月'
]

// 星座（白羊即1月，顺延）
const ZODIAC = [
  '白羊', '金牛', '双子', '巨蟹', '狮子', '处女',
  '天秤', '天蝎', '射手', '摩羯', '水瓶', '双鱼'
]

// 月份元数据
const MONTH_METADATA = [
  { meaning: '01月', season: '春', element: '光' },
  { meaning: '02月', season: '春', element: '光' },
  { meaning: '03月', season: '春', element: '木' },
  { meaning: '04月', season: '夏', element: '火' },
  { meaning: '05月', season: '夏', element: '火' },
  { meaning: '06月', season: '夏', element: '土' },
  { meaning: '07月', season: '秋', element: '金' },
  { meaning: '08月', season: '秋', element: '金' },
  { meaning: '09月', season: '秋', element: '水' },
  { meaning: '10月', season: '冬', element: '水' },
  { meaning: '11月', season: '冬', element: '木' },
  { meaning: '12月', season: '冬', element: '光' }
]

// 节日数据
const FESTIVALS = [
  { month: 1, day: 1, name: '春元节', description: '琳凯蒂亚新年，庆祝华田元年的到来' },
  { month: 1, day: 15, name: '光之节', description: '庆祝光线降临，星球上最重要的节日' },
  { month: 3, day: 1, name: '播种节', description: '春季播种，祈求丰收' },
  { month: 4, day: 10, name: '炎阳祭', description: '夏至庆典，祭祀太阳神' },
  { month: 4, day: 32, name: '星法祭', description: '琳凯蒂亚最重要的活动，纪念星法塔的神圣力量' },
  { month: 6, day: 15, name: '丰收祭', description: '庆祝秋季丰收' },
  { month: 7, day: 1, name: '霜降节', description: '纪念星球降温的历史时刻' },
  { month: 9, day: 1, name: '冰封祭', description: '冬季祭祀，祈求温暖' },
  { month: 10, day: 15, name: '回春节', description: '庆祝春天回归' },
  { month: 12, day: 1, name: '光耀节', description: '年终庆典，纪念光线使者' },
  { month: 12, day: 30, name: '夜夕', description: '年终祭祀，送别旧岁迎接新生' }
]

/**
 * 计算从纪元起点到目标日期的天数差
 */
function daysFromEpoch(year, month, day) {
  const epochDate = new Date(EPOCH.YEAR, EPOCH.MONTH - 1, EPOCH.DAY)
  const targetDate = new Date(year, month - 1, day)
  const diffTime = targetDate.getTime() - epochDate.getTime()
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * 闰年判断
 */
function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

/**
 * 公历转田历（正向计算）
 */
function calculateForward(diffDays) {
  let year = 1
  let month = 1
  let remaining = diffDays

  while (true) {
    const yearDays = isLeapYear(year + 2014)
      ? DAYS_IN_MONTH.reduce((a, b) => a + b, 0) + 1
      : DAYS_IN_MONTH.reduce((a, b) => a + b, 0)
    if (remaining < yearDays) break
    remaining -= yearDays
    year++
  }

  for (let m = 0; m < 12; m++) {
    let monthDays = DAYS_IN_MONTH[m]
    if (m === 1 && isLeapYear(year + 2014)) monthDays++
    if (remaining < monthDays) {
      month = m + 1
      break
    }
    remaining -= monthDays
  }

  const day = remaining + 1
  return {
    era: '华田',
    year,
    month,
    day,
    monthMeta: MONTH_METADATA[month - 1],
    monthName: MONTH_NAMES[month - 1]
  }
}

/**
 * 公历转田历（反向计算，纪元前）
 */
function calculateBackward(diffDays) {
  let year = 0
  let remaining = diffDays

  // 纪元前1年
  const year0Days = isLeapYear(2014)
    ? DAYS_IN_MONTH.reduce((a, b) => a + b, 0) + 1
    : DAYS_IN_MONTH.reduce((a, b) => a + b, 0)

  if (remaining <= year0Days) {
    year = 0
  } else {
    remaining -= year0Days
    year = -1
    while (true) {
      const yearDays = isLeapYear(2014 + year)
        ? DAYS_IN_MONTH.reduce((a, b) => a + b, 0) + 1
        : DAYS_IN_MONTH.reduce((a, b) => a + b, 0)
      if (remaining < yearDays) break
      remaining -= yearDays
      year--
    }
  }

  // 反向遍历月份
  for (let m = 11; m >= 0; m--) {
    let monthDays = DAYS_IN_MONTH[m]
    if (m === 1 && isLeapYear(2014 + year)) monthDays++
    if (remaining < monthDays) {
      const day = monthDays - remaining
      return {
        era: year >= 0 ? '华田前' : '华田前',
        year: year >= 0 ? 0 : Math.abs(year),
        month: m + 1,
        day,
        monthMeta: MONTH_METADATA[m],
        monthName: MONTH_NAMES[m]
      }
    }
    remaining -= monthDays
  }

  return null
}

/**
 * 公历转田历
 */
function fromSolar(gregYear, gregMonth, gregDay) {
  const diffDays = daysFromEpoch(gregYear, gregMonth, gregDay)

  if (diffDays >= 0) {
    return calculateForward(diffDays)
  } else {
    return calculateBackward(Math.abs(diffDays))
  }
}

/**
 * 格式化田历日期
 */
function format(tianDate, formatStr = 'full') {
  if (!tianDate) return ''

  const dayStr = String(tianDate.day).padStart(2, '0')
  const monthStr = String(tianDate.month).padStart(2, '0')
  const zodiac = ZODIAC[tianDate.month - 1] || ''

  switch (formatStr) {
    case 'full':
      return `${tianDate.era}${tianDate.year}年${tianDate.monthName}${dayStr}日（${zodiac}）`
    case 'short':
      return `${tianDate.era}${tianDate.year}.${monthStr}.${dayStr}`
    case 'monthDay':
      return `${tianDate.monthName}${dayStr}日（${zodiac}）`
    default:
      return `${tianDate.era}${tianDate.year}年${tianDate.monthName}${dayStr}日（${zodiac}）`
  }
}

/**
 * 获取今天的田历日期
 */
function getTodayTianDate() {
  const today = new Date()
  return fromSolar(today.getFullYear(), today.getMonth() + 1, today.getDate())
}

/**
 * 获取当前月份的节日
 */
function getFestivals(tianDate) {
  if (!tianDate) return []
  return FESTIVALS.filter(f => f.month === tianDate.month)
}

/**
 * Vue 3 Composable: useTianCalendar
 */
export function useTianCalendar() {
  const tianDate = ref(null)
  const formattedDate = ref('载入中...')

  // 更新田历日期
  function updateTianDate() {
    const today = new Date()
    tianDate.value = fromSolar(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate()
    )
    formattedDate.value = format(tianDate.value, 'full')
  }

  // 获取指定公历日期的田历日期
  function getTianDate(year, month, day) {
    return fromSolar(year, month, day)
  }

  // 获取当前节日
  const currentFestivals = computed(() => {
    return getFestivals(tianDate.value)
  })

  onMounted(() => {
    updateTianDate()
    // 每天更新一次
    const interval = setInterval(updateTianDate, 3600000)
    return () => clearInterval(interval)
  })

  return {
    tianDate,
    formattedDate,
    updateTianDate,
    getTianDate,
    currentFestivals,
    format,
    fromSolar
  }
}

export default useTianCalendar