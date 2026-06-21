<template>
  <div class="sub-page">
    <div class="page-header">
      <h2 class="sub-page-title">琳凯蒂亚新星历（田历）</h2>
      <p class="sub-page-desc">为了纪念光线使者们地球任务的开启，星帝倡导了历法改革，创立了结合地球公转的新星历</p>
    </div>

    <!-- 历法介绍 -->
    <div class="calendar-intro">
      <div class="calendar-description">
        <h3>历法由来</h3>
        <p>为了纪念光线使者们地球任务的开启，星帝倡导了历法改革，创立了结合地球公转的新星历。以公元2015年3月21日为华田元年1月1日，此日恰好是春分，象征着新的开始。</p>
        <div class="calendar-rules">
          <h4>历法规则</h4>
          <ul>
            <li><strong>月份设置：</strong>全年12个月，每月天数分别为：30、31、31、32、31、31、30、30、30、29、30、30</li>
            <li><strong>闰年规则：</strong>闰年时1月增加一个31号，即变31天</li>
            <li><strong>年始日：</strong>每年的第一天必须是春分（以北京时间为准）</li>
            <li><strong>纪元起点：</strong>2015年3月21日 = 华田元年1月1日</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 日历主体 -->
    <div class="calendar-container">
      <!-- 月份导航 -->
      <div class="calendar-header">
        <button class="calendar-nav prev" @click="prevMonth">◀</button>
        <div class="calendar-title">
          <h3>{{ calendarTitle }}</h3>
          <p class="calendar-subtitle">{{ calendarSubtitle }}</p>
        </div>
        <button class="calendar-nav next" @click="nextMonth">▶</button>
      </div>

      <!-- 控制栏 -->
      <div class="calendar-controls">
        <button class="control-btn" :class="{ flash: buttonFlash.prevYear }" @click="prevYear" title="上一年 (W)">◀ 年份</button>
        <button class="control-btn active" :class="{ flash: buttonFlash.today }" @click="goToToday" title="回到今天 (T)">📅 今天</button>
        <button class="control-btn" :class="{ flash: buttonFlash.nextYear }" @click="nextYear" title="下一年 (S)">年份 ▶</button>
        <span class="calendar-info">
          <strong>今天：</strong><span style="white-space: pre-line">{{ todayInfo }}</span>
        </span>
      </div>

      <!-- 键盘快捷键提示 -->
      <div class="keyboard-shortcuts">
        <span class="shortcut-key">W</span> 上一年 &nbsp;
        <span class="shortcut-key">S</span> 下一年 &nbsp;
        <span class="shortcut-key">A</span> 上个月 &nbsp;
        <span class="shortcut-key">D</span> 下个月 &nbsp;
        <span class="shortcut-key">T</span> 回到今天
      </div>

      <!-- 日历网格 -->
      <div class="calendar-grid">
        <div class="calendar-weekdays">
          <div class="weekday">日</div>
          <div class="weekday">一</div>
          <div class="weekday">二</div>
          <div class="weekday">三</div>
          <div class="weekday">四</div>
          <div class="weekday">五</div>
          <div class="weekday">六</div>
        </div>
        <div class="calendar-days">
          <div
            v-for="(cell, idx) in monthGrid"
            :key="idx"
            class="calendar-day"
            :class="{
              'empty-day': cell.day === null,
              'today': cell.isToday,
              'festival': cell.festival
            }"
            :title="cell.festival ? cell.festival.name + ': ' + cell.festival.desc : ''"
            @click="cell.day !== null && showDateDetails(cell)"
          >
            {{ cell.day || '' }}
          </div>
        </div>
      </div>

      <!-- 图例 -->
      <div class="calendar-legend">
        <div class="legend-item">
          <div class="legend-color today"></div>
          <span>今天</span>
        </div>
        <div class="legend-item">
          <div class="legend-color current-month"></div>
          <span>当月</span>
        </div>
        <div class="legend-item">
          <div class="legend-color other-month"></div>
          <span>空格</span>
        </div>
        <div class="legend-item">
          <div class="legend-color festival"></div>
          <span>田历节日</span>
        </div>
      </div>
    </div>

    <!-- 节日列表 -->
    <div class="calendar-container">
      <h3 style="color: #7b9fff; text-align: center; margin-bottom: 1.2rem;">田历特殊日期</h3>
      <div class="festivals-grid">
        <div class="festival-item" v-for="(fest, key) in festivals" :key="key">
          <div class="festival-date">{{ key.replace('-', '月') }}日</div>
          <div class="festival-name">{{ fest.name }}</div>
          <div class="festival-desc">{{ fest.desc }}</div>
        </div>
      </div>
    </div>

    <!-- 日期详情弹窗 -->
    <Teleport to="body">
      <div v-if="showModal" class="date-details-overlay" @click.self="showModal = false">
        <div class="date-details-panel">
          <div class="date-details-header">
            <h3>日期详情</h3>
            <button class="close-btn" @click="showModal = false">&times;</button>
          </div>
          <div class="date-info-grid">
            <div class="date-info-item">
              <div class="info-label">田历</div>
              <div class="info-value">{{ selectedDateInfo.tian }}</div>
            </div>
            <div class="date-info-item">
              <div class="info-label">公历</div>
              <div class="info-value">{{ selectedDateInfo.gregorian }}</div>
            </div>
            <div class="date-info-item">
              <div class="info-label">农历</div>
              <div class="info-value">
                <span v-if="selectedDateInfo.lunar">{{ selectedDateInfo.lunar.huangdiYear }}年{{ selectedDateInfo.lunar.isLeapMonth ? '闰' : '' }}{{ selectedDateInfo.lunar.lunarMonth }}月{{ selectedDateInfo.lunar.lunarDay }}日（{{ selectedDateInfo.lunar.lunarMonthName }}月{{ selectedDateInfo.lunar.lunarDayName }}）</span>
              </div>
            </div>
            <div class="date-info-item">
              <div class="info-label">干支生肖</div>
              <div class="info-value" v-if="selectedDateInfo.lunar">
                {{ selectedDateInfo.lunar.heavenlyStem }}{{ selectedDateInfo.lunar.earthlyBranch }}({{ selectedDateInfo.lunar.zodiac }})年 {{ selectedDateInfo.lunar.monthGanzhi }}月 {{ selectedDateInfo.lunar.dayGanzhi }}日
              </div>
            </div>
            <div class="date-info-item culture-info">
              <div class="info-label">琳凯蒂亚文化</div>
              <div class="info-value">
                <div class="rincatian-month">{{ selectedDateInfo.monthName }} {{ selectedDateInfo.weekday }}</div>
                <div class="rincatian-desc">{{ selectedDateInfo.monthDesc }}</div>
                <div v-if="selectedDateInfo.tianFestival" class="rincatian-festival">🎉 {{ selectedDateInfo.tianFestival.name }}：{{ selectedDateInfo.tianFestival.desc }}</div>
              </div>
            </div>
            <div v-if="selectedDateInfo.solarTerm" class="date-info-item">
              <div class="info-label">节气</div>
              <div class="info-value">{{ selectedDateInfo.solarTerm.name }}</div>
            </div>
            <div v-if="selectedDateInfo.solarFestival" class="date-info-item festival-info">
              <div class="info-label">公历节日</div>
              <div class="info-value">{{ selectedDateInfo.solarFestival.name }}</div>
            </div>
            <div v-if="selectedDateInfo.lunarFestival" class="date-info-item festival-info">
              <div class="info-label">农历节日</div>
              <div class="info-value">{{ selectedDateInfo.lunarFestival.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { TianCalendar } from '@/utils/tianCalendar.js'
import { LunarCalendar } from '@/utils/lunarCalendar.js'

const currentYear = ref(null)
const currentMonth = ref(null)
const showModal = ref(false)
const selectedDateInfo = ref({})
const shortcutHint = ref('')
const buttonFlash = ref({})

const festivals = TianCalendar.FESTIVALS

// 曜日名称
const WEEKDAYS = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日']

function getToday() {
  const now = new Date()
  return TianCalendar.fromSolar(now.getFullYear(), now.getMonth() + 1, now.getDate())
}

const todayInfo = computed(() => {
  const today = getToday()
  const now = new Date()
  const tianStr = TianCalendar.format(today)
  const gregStr = `公历：${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`
  return `${tianStr}\n${gregStr}`
})

const monthGrid = computed(() => {
  if (currentYear.value === null || currentMonth.value === null) return []
  return TianCalendar.getMonthGrid(currentYear.value, currentMonth.value)
})

const calendarTitle = computed(() => {
  if (currentYear.value === null || currentMonth.value === null) return ''
  const era = currentYear.value > 0 ? '华田' : '田元前'
  const yearStr = currentYear.value > 0
    ? (currentYear.value === 1 ? '元年' : currentYear.value + '年')
    : Math.abs(currentYear.value) + '年'
  const meta = TianCalendar.MONTH_METADATA[currentMonth.value - 1]
  return `${era}${yearStr} ${meta.meaning}（${meta.name}）`
})

const calendarSubtitle = computed(() => {
  if (currentYear.value === null || currentMonth.value === null) return ''
  const firstDay = TianCalendar.toSolar(currentYear.value, currentMonth.value, 1)
  const daysInMonth = TianCalendar.getDaysInMonth(currentYear.value, currentMonth.value)
  const lastDay = TianCalendar.toSolar(currentYear.value, currentMonth.value, daysInMonth)
  return `对应公历: ${firstDay.getFullYear()}.${firstDay.getMonth() + 1}.${firstDay.getDate()} - ${lastDay.getFullYear()}.${lastDay.getMonth() + 1}.${lastDay.getDate()}`
})

function prevMonth() {
  currentMonth.value--
  if (currentMonth.value < 1) {
    currentMonth.value = 12
    currentYear.value--
  }
}

function nextMonth() {
  currentMonth.value++
  if (currentMonth.value > 12) {
    currentMonth.value = 1
    currentYear.value++
  }
}

function prevYear() {
  currentYear.value--
}

function nextYear() {
  currentYear.value++
}

function goToToday() {
  const today = getToday()
  currentYear.value = today.year
  currentMonth.value = today.month
}

function flashButton(btn) {
  buttonFlash.value = { ...buttonFlash.value, [btn]: true }
  setTimeout(() => {
    buttonFlash.value = { ...buttonFlash.value, [btn]: false }
  }, 200)
}

function showDateDetails(cell) {
  const gregorianDate = TianCalendar.toSolar(currentYear.value, currentMonth.value, cell.day)
  const gYear = gregorianDate.getFullYear()
  const gMonth = gregorianDate.getMonth() + 1
  const gDay = gregorianDate.getDate()

  // 田历基础信息
  const era = currentYear.value > 0 ? '华田' : '田元前'
  const yearStr = currentYear.value > 0
    ? (currentYear.value === 1 ? '元年' : currentYear.value + '年')
    : Math.abs(currentYear.value) + '年'
  const meta = TianCalendar.MONTH_METADATA[currentMonth.value - 1]
  const weekday = WEEKDAYS[gregorianDate.getDay()]

  // 农历信息（使用 lunar-javascript 库，数据准确）
  const lunarInfo = LunarCalendar.solarToLunar(gYear, gMonth, gDay)
  const huangdiYear = LunarCalendar.getHuangdiYear(lunarInfo.lunarYear)
  lunarInfo.huangdiYear = huangdiYear
  lunarInfo.monthGanzhi = LunarCalendar.getMonthGanzhi(gYear, gMonth)
  lunarInfo.dayGanzhi = LunarCalendar.getDayGanzhi(gYear, gMonth, gDay)

  // 节气（使用 lunar-javascript 精确计算）
  const solarTerm = LunarCalendar.getSolarTerm(gYear, gMonth, gDay)

  // 田历节日
  const tianFestival = TianCalendar.getFestival(currentMonth.value, cell.day)

  // 公历和农历节日（使用 lunar-javascript 内置数据）
  const allFestivals = LunarCalendar.getAllFestivals(gYear, gMonth, gDay)
  const solarFestival = allFestivals.solar.length > 0 ? allFestivals.solar[0] : null
  const lunarFestival = allFestivals.lunar.length > 0 ? allFestivals.lunar[0] : null

  selectedDateInfo.value = {
    tian: `${era}${yearStr}${currentMonth.value}月${cell.day}日`,
    gregorian: `${gYear}年${gMonth}月${gDay}日`,
    lunar: lunarInfo,
    monthName: meta.name,
    weekday,
    monthDesc: meta.desc,
    tianFestival,
    solarTerm,
    solarFestival,
    lunarFestival
  }
  showModal.value = true
}

function handleKeydown(e) {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
  switch (e.key.toLowerCase()) {
    case 'w':
      e.preventDefault()
      prevYear()
      flashButton('prevYear')
      break
    case 's':
      e.preventDefault()
      nextYear()
      flashButton('nextYear')
      break
    case 'a':
      e.preventDefault()
      prevMonth()
      flashButton('prevMonth')
      break
    case 'd':
      e.preventDefault()
      nextMonth()
      flashButton('nextMonth')
      break
    case 'home':
    case 't':
      e.preventDefault()
      goToToday()
      flashButton('today')
      break
  }
}

onMounted(() => {
  const today = getToday()
  currentYear.value = today.year
  currentMonth.value = today.month
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>