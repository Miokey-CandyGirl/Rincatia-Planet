/**
 * 琳凯蒂亚语社区 - 田历 (Tian Calendar) 核心模块
 * 提供公历与田历的双向转换、文化元数据及节日系统支持
 */

class TianCalendar {
    // 纪元起点：2015年3月21日（公历） - 华田元年1月1日
    static EPOCH = {
        YEAR: 2015,
        MONTH: 3,
        DAY: 21
    };

    // 每月基础天数
    static DAYS_IN_MONTH = [30, 31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30];

    // 琳凯蒂亚语月份名称 (Rincatian - Chinese)
    static MONTH_METADATA = [
        { name: '白羊月', meaning: '1月', desc: '象征着万物新生新的朝气' },
        { name: '金牛月', meaning: '2月', desc: '展现星球最迷人的光影' },
        { name: '双子月', meaning: '3月', desc: '纪念星法塔神圣力量' },
        { name: '巨蟹月', meaning: '4月', desc: '流光云在天际舞动的季节' },
        { name: '狮子月', meaning: '5月', desc: '银蓝色铃铛树结果的时期' },
        { name: '处女月', meaning: '6月', desc: '蜂蜜色星光河最清澈的时节' },
        { name: '天秤月', meaning: '7月', desc: '双月交辉产生极光的季节' },
        { name: '天蝎月', meaning: '8月', desc: '丰收与感恩的回归' },
        { name: '射手月', meaning: '9月', desc: '纪念古代英雄的荣耀' },
        { name: '摩羯月', meaning: '10月', desc: '七颗彩虹水晶共鸣的季节' },
        { name: '水瓶月', meaning: '11月', desc: '冰蓝色星光覆盖大地的时期' },
        { name: '双鱼月', meaning: '12月', desc: '在宁静中等待新元复始' }
    ];

    // 星期周期 (7日制)
    static WEEK_DAYS = [
        { name: 'Sun-day', meaning: '太阳日', icon: '☀️' },
        { name: 'Moon-day', meaning: '月亮日', icon: '🌙' },
        { name: 'Star-day', meaning: '星辰日', icon: '⭐' },
        { name: 'Light-day', meaning: '光辉日', icon: '✨' },
        { name: 'Shadow-day', meaning: '幽影日', icon: '🌑' },
        { name: 'Life-day', meaning: '生命日', icon: '🌱' },
        { name: 'Soul-day', meaning: '灵魂日', icon: '💠' }
    ];

    // 节日系统
    static FESTIVALS = {
        '1-1': { name: '春元节', desc: '田历新年，象征万物新生' },
        '3-21': { name: '纪元启航日', desc: '纪念华田历法设立（2015-03-21）' },
        '4-32': { name: '星法祭', desc: '琳凯蒂亚最重要的活动，纪念星法塔的神圣力量' },
        '6-3': { name: '彩虹降临节', desc: '纪念光线使者开启地球任务' },
        '7-15': { name: '双月交辉节', desc: '金月与银月重叠产生彩虹光环的奇景' },
        '8-16': { name: '妙可诞辰', desc: '琳凯蒂亚公主生日，全球庆典' },
        '10-29': { name: '水晶共鸣节', desc: '纪念七颗彩虹水晶的守护力量' },
        '12-30': { name: '夜夕祭', desc: '年终祭祀，送别旧岁迎接新生' }
    };

    /**
     * 判断是否为田历闰年 (每4年一闰，1月增加1天)
     */
    static isLeapYear(year) {
        if (year === 0) return false;
        return Math.abs(year) % 4 === 0;
    }

    /**
     * 获取指定月份的天数
     */
    static getDaysInMonth(year, month) {
        if (month < 1 || month > 12) return 0;
        let days = this.DAYS_IN_MONTH[month - 1];
        if (month === 1 && this.isLeapYear(year)) {
            days += 1;
        }
        return days;
    }

    /**
     * 获取指定年份的总天数
     */
    static getDaysInYear(year) {
        return this.isLeapYear(year) ? 366 : 365;
    }

    /**
     * 公历转田历 (Solar to Tian)
     */
    static fromSolar(gregYear, gregMonth, gregDay) {
        const epochDate = new Date(this.EPOCH.YEAR, this.EPOCH.MONTH - 1, this.EPOCH.DAY);
        const targetDate = new Date(gregYear, gregMonth - 1, gregDay);
        
        // 计算相差天数
        const diffTime = targetDate.getTime() - epochDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays >= 0) {
            return this._calculateForward(diffDays);
        } else {
            return this._calculateBackward(Math.abs(diffDays));
        }
    }

    /**
     * 计算纪元后日期
     */
    static _calculateForward(totalDays) {
        let year = 1;
        let remainingDays = totalDays;

        while (remainingDays >= this.getDaysInYear(year)) {
            remainingDays -= this.getDaysInYear(year);
            year++;
        }

        let month = 1;
        while (remainingDays >= this.getDaysInMonth(year, month)) {
            remainingDays -= this.getDaysInMonth(year, month);
            month++;
        }

        return {
            year: year,
            month: month,
            day: remainingDays + 1,
            era: '华田',
            isLeap: this.isLeapYear(year)
        };
    }

    /**
     * 计算纪元前日期
     */
    static _calculateBackward(totalDays) {
        let year = -1; // 没有0年
        let remainingDays = totalDays - 1; // 偏移1天

        while (remainingDays >= this.getDaysInYear(year)) {
            remainingDays -= this.getDaysInYear(year);
            year--;
        }

        // 纪元前是从年底往回推
        let month = 12;
        let dayCountInMonth = this.getDaysInMonth(year, month);
        
        // 此处逻辑较复杂，简化处理：先找到该年剩余天数落在哪个自然月
        let daysFromYearStart = this.getDaysInYear(year) - remainingDays - 1;
        
        let targetMonth = 1;
        let targetDay = 1;
        let currentDays = 0;
        
        for(let m = 1; m <= 12; m++) {
            let mDays = this.getDaysInMonth(year, m);
            if (currentDays + mDays > daysFromYearStart) {
                targetMonth = m;
                targetDay = daysFromYearStart - currentDays + 1;
                break;
            }
            currentDays += mDays;
        }

        return {
            year: year,
            month: targetMonth,
            day: targetDay,
            era: '田元前',
            isLeap: this.isLeapYear(year)
        };
    }

    /**
     * 田历转公历 (Tian to Solar)
     */
    static toSolar(tianYear, tianMonth, tianDay) {
        if (tianYear === 0) tianYear = -1;
        
        const epochDate = new Date(this.EPOCH.YEAR, this.EPOCH.MONTH - 1, this.EPOCH.DAY);
        let totalDays = 0;

        if (tianYear > 0) {
            // 纪元后累加
            for (let y = 1; y < tianYear; y++) {
                totalDays += this.getDaysInYear(y);
            }
            for (let m = 1; m < tianMonth; m++) {
                totalDays += this.getDaysInMonth(tianYear, m);
            }
            totalDays += tianDay - 1;
        } else {
            // 纪元前累减
            for (let y = -1; y > tianYear; y--) {
                totalDays -= this.getDaysInYear(y);
            }
            // 计算当年偏移
            let daysInYear = 0;
            for (let m = 1; m < tianMonth; m++) {
                daysInYear += this.getDaysInMonth(tianYear, m);
            }
            daysInYear += tianDay - 1;
            
            totalDays -= (this.getDaysInYear(tianYear) - daysInYear);
        }

        return new Date(epochDate.getTime() + totalDays * 24 * 60 * 60 * 1000);
    }

    /**
     * 获取格式化日期字符串
     */
    static format(tianDate, formatStr = 'full') {
        const monthMeta = this.MONTH_METADATA[tianDate.month - 1];
        const yearStr = tianDate.year > 0 ? `${tianDate.year}` : `${Math.abs(tianDate.year)}`;
        
        if (formatStr === 'rincatian') {
            return `${tianDate.era} ${yearStr} ni, ${monthMeta.name} ${tianDate.day} ra`;
        }
        
        return `${tianDate.era}${yearStr}年${monthMeta.meaning}${tianDate.day}日`;//返回顶部日期显示
    }

    /**
     * 获取节日信息
     */
    static getFestival(month, day) {
        return this.FESTIVALS[`${month}-${day}`] || null;
    }

    /**
     * 生成月度日历网格数据
     */
    static getMonthGrid(year, month) {
        const daysInMonth = this.getDaysInMonth(year, month);
        const grid = [];
        
        // 获取该月1号对应的星期
        const solarFirstDay = this.toSolar(year, month, 1);
        const startDayOfWeek = solarFirstDay.getDay(); // 0 (Sun) to 6 (Sat)

        // 填充空白位
        for (let i = 0; i < startDayOfWeek; i++) {
            grid.push({ day: null, type: 'prev' });
        }

        // 填充日期
        for (let d = 1; d <= daysInMonth; d++) {
            const festival = this.getFestival(month, d);
            grid.push({
                day: d,
                type: 'current',
                festival: festival,
                isToday: this._isToday(year, month, d)
            });
        }

        return grid;
    }

    static _isToday(y, m, d) {
        const today = this.fromSolar(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());
        return today.year === y && today.month === m && today.day === d;
    }
}

// 导出模块或挂载到全局
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TianCalendar;
} else {
    window.TianCalendar = TianCalendar;
}
