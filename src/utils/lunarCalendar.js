/**
 * 农历工具类封装 - 基于 lunar-javascript 第三方库
 * 提供准确的干支、生肖、节气、农历日期及节日信息
 * 琳凯蒂亚文化网站 - 2026
 */
import { Solar } from 'lunar-javascript'

export class LunarCalendar {
  /**
   * 公历转农历（返回详细信息）
   */
  static solarToLunar(year, month, day) {
    const solar = Solar.fromYmd(year, month, day)
    const lunar = solar.getLunar()

    return {
      lunarYear: lunar.getYear(),
      lunarMonth: Math.abs(lunar.getMonth()),
      lunarDay: lunar.getDay(),
      lunarMonthName: lunar.getMonthInChinese(),
      lunarDayName: lunar.getDayInChinese(),
      zodiac: lunar.getYearShengXiao(),
      heavenlyStem: lunar.getYearInGanZhi()[0],
      earthlyBranch: lunar.getYearInGanZhi()[1],
      monthGanzhi: lunar.getMonthInGanZhi(),
      dayGanzhi: lunar.getDayInGanZhi(),
      isLeapMonth: lunar.getMonth() < 0,
      festival: null
    }
  }

  /**
   * 获取公历节日
   */
  static getSolarFestival(month, day, year = 2024) {
    const solar = Solar.fromYmd(year, month, day)
    const festivals = solar.getFestivals()
    if (festivals.length > 0) {
      return { name: festivals[0], desc: '' }
    }
    return null
  }

  /**
   * 获取农历节日
   */
  static getLunarFestival(lunarMonth, lunarDay) {
    // 使用 lunar-javascript 内置的 Lunar.getFestivals()
    // 需要先通过公历反查农历
    return null // 由调用方通过 lunar.getFestivals() 获取
  }

  /**
   * 获取节气
   */
  static getSolarTerm(year, month, day) {
    const solar = Solar.fromYmd(year, month, day)
    const lunar = solar.getLunar()
    const jieQi = lunar.getJieQi()
    if (jieQi) {
      return { name: jieQi }
    }
    return null
  }

  /**
   * 获取日期的所有节日（公历+农历）
   */
  static getAllFestivals(year, month, day) {
    const solar = Solar.fromYmd(year, month, day)
    const lunar = solar.getLunar()

    const solarFestivals = solar.getFestivals()
    const lunarFestivals = lunar.getFestivals()

    const result = {
      solar: solarFestivals.map(f => ({ name: f, desc: '' })),
      lunar: lunarFestivals.map(f => ({ name: f, desc: '' }))
    }

    return result
  }

  /**
   * 获取黄帝纪年
   */
  static getHuangdiYear(lunarYear) {
    return lunarYear + 2697
  }

  /**
   * 获取年干支
   */
  static getYearGanzhi(year) {
    const solar = Solar.fromYmd(year, 1, 1)
    return solar.getLunar().getYearInGanZhi()
  }

  /**
   * 获取生肖
   */
  static getZodiac(year) {
    const solar = Solar.fromYmd(year, 1, 1)
    return solar.getLunar().getYearShengXiao()
  }

  /**
   * 获取月干支
   */
  static getMonthGanzhi(year, month) {
    const solar = Solar.fromYmd(year, month, 1)
    return solar.getLunar().getMonthInGanZhi()
  }

  /**
   * 获取日干支
   */
  static getDayGanzhi(year, month, day) {
    const solar = Solar.fromYmd(year, month, day)
    return solar.getLunar().getDayInGanZhi()
  }
}