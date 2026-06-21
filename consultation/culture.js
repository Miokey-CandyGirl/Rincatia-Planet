// 文化页面交互脚本

// 全局音效函数占位符（将在 initAudioSystem 中被覆盖）
window.playSound = function(type) {
    console.log(`🔊 音效系统未初始化，无法播放: ${type}`);
};

document.addEventListener('DOMContentLoaded', function() {
    // 新增：图片懒加载
    initLazyLoad();
    
    // 新增：移动端导航优化
    initMobileNavigation();
    
    // 第二阶段：搜索功能
    initCultureSearch();
    
    // 第二阶段：夜间模式
    initThemeToggle();
    
    // 第二阶段：阅读进度
    initReadingProgress();
    
    // 第二阶段：人物卡片增强
    initCharacterCards();
    
    // 第三阶段：音效系统（先初始化，供其他模块使用）
    initAudioSystem();
    
    // 第三阶段：时间线可视化
    initTimelineVisualization();
    
    // 第三阶段：魔法系统交互
    initMagicSystem();
    
    // 确保认证系统正确初始化
    if (typeof initializeAuthSystem === 'function') {
        initializeAuthSystem();
        setTimeout(() => {
            updateAuthenticationState();
        }, 100);
    }
    
    // 标签页切换功能
    const tabLinks = document.querySelectorAll('.tab-link');
    const sections = document.querySelectorAll('.culture-section');
    
    function switchTab(targetTab) {
        // 移除所有活动状态
        tabLinks.forEach(link => link.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active'));
        
        // 添加活动状态到目标元素
        const targetLink = document.querySelector(`[data-tab="${targetTab}"]`);
        const targetSection = document.getElementById(targetTab);
        
        if (targetLink && targetSection) {
            targetLink.classList.add('active');
            targetSection.classList.add('active');
            
            // 特殊处理：当切换到非传说故事标签时，隐藏"未完待续"内容
            if (targetTab !== 'legends') {
                const continuationHook = document.getElementById('continuation');
                if (continuationHook) {
                    continuationHook.style.display = 'none';
                }
                
                // 同时确保所有故事内容都隐藏
                storyContents.forEach(content => content.classList.remove('active'));
                
                // 移除所有故事标签的活动状态
                storyTabs.forEach(tab => tab.classList.remove('active'));
            }
        }
    }
    
    // 点击标签页切换
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetTab = this.getAttribute('data-tab');
            switchTab(targetTab);
            
            // 更新URL hash
            history.pushState(null, null, `#${targetTab}`);
            
            // 播放切换音效
            if (typeof window.playSound === 'function') {
                window.playSound('tab');
            }
        });
    });
    
    // 故事标签切换功能
    const storyTabs = document.querySelectorAll('.story-tab');
    const storyContents = document.querySelectorAll('.story-content');
    
    function switchStoryTab(targetStory) {
        // 移除所有活动状态
        storyTabs.forEach(tab => tab.classList.remove('active'));
        storyContents.forEach(content => content.classList.remove('active'));
        
        // 特殊处理"未完待续"标签
        if (targetStory === 'continuation') {
            // 移除所有故事内容的活动状态
            document.querySelectorAll('.story-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // 添加活动状态到目标标签
            const targetTab = document.querySelector(`[data-story="${targetStory}"]`);
            if (targetTab) {
                targetTab.classList.add('active');
            }
            
            // 显示继续阅读钩子
            const continuationHook = document.getElementById('continuation');
            if (continuationHook) {
                continuationHook.style.display = 'block';
                // 添加动画效果
                continuationHook.style.opacity = '0';
                continuationHook.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    continuationHook.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    continuationHook.style.opacity = '1';
                    continuationHook.style.transform = 'translateY(0)';
                }, 50);
            }
        } else {
            // 添加活动状态到目标元素
            const targetTab = document.querySelector(`[data-story="${targetStory}"]`);
            const targetContent = document.getElementById(targetStory);
            
            if (targetTab && targetContent) {
                targetTab.classList.add('active');
                targetContent.classList.add('active');
                
                // 添加动画效果
                targetContent.style.opacity = '0';
                targetContent.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    targetContent.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    targetContent.style.opacity = '1';
                    targetContent.style.transform = 'translateY(0)';
                }, 50);
            }
            
            // 隐藏继续阅读钩子
            const continuationHook = document.getElementById('continuation');
            if (continuationHook) {
                continuationHook.style.display = 'none';
            }
        }
    }
    
    // 点击故事标签切换
    storyTabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const targetStory = this.getAttribute('data-story');
            
            // 先切换到传说故事标签页（如果不在该页面）
            if (!document.getElementById('legends').classList.contains('active')) {
                switchTab('legends');
                // 等待标签页切换完成后再切换故事
                setTimeout(() => {
                    switchStoryTab(targetStory);
                    scrollToStorySection(targetStory);
                }, 100);
            } else {
                // 已经在传说故事页面，直接切换故事
                switchStoryTab(targetStory);
                scrollToStorySection(targetStory);
            }
        });
    });
    
    // 滚动到故事区域的函数
    function scrollToStorySection(targetStory) {
        setTimeout(() => {
            const targetElement = document.getElementById(targetStory);
            const legendsSection = document.getElementById('legends');
            
            if (targetElement && legendsSection) {
                // 计算偏移量（考虑固定导航栏高度）
                const navbar = document.querySelector('.navbar');
                const cultureNav = document.querySelector('.culture-nav');
                
                let totalOffset = 20; // 基础间距
                if (navbar) totalOffset += navbar.offsetHeight;
                if (cultureNav) totalOffset += cultureNav.offsetHeight;
                
                // 直接使用传说故事区域的位置
                const targetTop = legendsSection.offsetTop;
                
                // 平滑滚动到目标位置
                window.scrollTo({
                    top: Math.max(0, targetTop - totalOffset),
                    behavior: 'smooth'
                });
                
                // 更新URL hash（不触发页面跳转）
                history.replaceState(null, null, `#legends-${targetStory}`);
            }
        }, 200); // 等待动画完成
    }
    
    // 初始化故事标签（默认选中前传）
    if (document.querySelector('.story-tabs')) {
        switchStoryTab('prequel');
    }
    
    // 豆瓣阅读按钮交互
    const doubanBtn = document.getElementById('doubanReadingBtn');
    if (doubanBtn) {
        doubanBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 显示确认对话框
            const confirmed = confirm('📚 您即将进入豆瓣阅读查看《光线传奇之彩虹水晶》完整版小说。\n\n点击“确定”将在新窗口中打开豆瓣阅读网站。');
            
            if (confirmed) {
                // 这里可以替换为实际的豆瓣阅读链接
                const doubanUrl = 'https://read.douban.com/column/71054869/?dcs=search'; // 更换为实际链接
                window.open(doubanUrl, '_blank');
                
                // 添加点击动画效果
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
        });
        
        // 悬停效果增强
        doubanBtn.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 8px 25px rgba(255, 107, 107, 0.5), 0 0 20px rgba(76, 205, 196, 0.3)';
        });
        
        doubanBtn.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.3)';
        });
    }
    
    // 处理页面加载时的hash
    function handleHashChange() {
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) {
            switchTab(hash);
        }
    }
    
    // 监听hash变化
    window.addEventListener('hashchange', handleHashChange);
    
    // 页面加载时处理hash
    handleHashChange();
    
    // 彩虹水晶动画
    const crystals = document.querySelectorAll('.crystal');
    crystals.forEach((crystal, index) => {
        crystal.style.animationDelay = `${index * 0.2}s`;
    });
    
    // 卡片悬停效果增强
    const cards = document.querySelectorAll('.geography-card, .society-card, .magic-card, .character-profile');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // 星球背景动画
    function createStars() {
        const starsContainer = document.querySelector('.stars');
        if (!starsContainer) return;
        
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.cssText = `
                position: absolute;
                width: ${Math.random() * 3 + 1}px;
                height: ${Math.random() * 3 + 1}px;
                background: #fff;
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: twinkle ${Math.random() * 3 + 2}s infinite;
                opacity: ${Math.random() * 0.8 + 0.2};
            `;
            starsContainer.appendChild(star);
        }
    }
    
    // 添加星星闪烁动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes twinkle {
            0%, 100% { opacity: 0.2; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
        }
        
        .star {
            box-shadow: 0 0 10px currentColor;
        }
    `;
    document.head.appendChild(style);
    
    createStars();
    
    // 粒子效果
    function createParticles() {
        const particlesContainer = document.querySelector('.floating-particles');
        if (!particlesContainer) return;
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: rgba(255, 215, 0, ${Math.random() * 0.6 + 0.2});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 10 + 10}s infinite linear;
                pointer-events: none;
            `;
            particlesContainer.appendChild(particle);
        }
    }
    
    // 添加粒子漂浮动画
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        @keyframes float {
            0% { transform: translateY(100vh) translateX(0); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-100vh) translateX(${Math.random() * 200 - 100}px); opacity: 0; }
        }
    `;
    document.head.appendChild(particleStyle);
    
    createParticles();
    
    // 滚动视差效果
    function parallaxEffect() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.culture-hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    }
    
    window.addEventListener('scroll', parallaxEffect);
    
    // 水晶点击效果
    const crystalGems = document.querySelectorAll('.crystal-gem');
    crystalGems.forEach(gem => {
        gem.addEventListener('click', function() {
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'crystalPulse 0.6s ease-out';
            }, 10);
        });
    });
    
    // 添加水晶脉冲动画
    const crystalStyle = document.createElement('style');
    crystalStyle.textContent = `
        @keyframes crystalPulse {
            0% { transform: scale(1); box-shadow: 0 0 15px currentColor; }
            50% { transform: scale(1.5); box-shadow: 0 0 30px currentColor; }
            100% { transform: scale(1); box-shadow: 0 0 15px currentColor; }
        }
    `;
    document.head.appendChild(crystalStyle);
    
    // 角色卡片交互效果
    const characterProfiles = document.querySelectorAll('.character-profile');
    characterProfiles.forEach(profile => {
        profile.addEventListener('click', function() {
            // 添加点击波纹效果
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 215, 0, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
                left: 50%;
                top: 50%;
                width: 100px;
                height: 100px;
                margin-left: -50px;
                margin-top: -50px;
            `;
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // 添加波纹动画
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
    
    // 时间线项目滚动动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, observerOptions);
    
    // 观察时间线项目
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-50px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });
    
    // 观察传说项目
    const legendItems = document.querySelectorAll('.legend-item');
    legendItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        observer.observe(item);
    });
    
    // 快捷键支持
    document.addEventListener('keydown', function(e) {
        const tabs = ['geography', 'society', 'magic', 'legends', 'characters', 'timeline', 'calendar'];
        let currentIndex = tabs.findIndex(tab => document.getElementById(tab).classList.contains('active'));
        
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
            e.preventDefault();
            switchTab(tabs[currentIndex - 1]);
        } else if (e.key === 'ArrowRight' && currentIndex < tabs.length - 1) {
            e.preventDefault();
            switchTab(tabs[currentIndex + 1]);
        }
    });
    
    // 田历历法系统
    initTianCalendar();
    
    console.log('琳凯蒂亚文化页面加载完成！✨');
});

// 田历历法系统
function initTianCalendar() {
    let currentDisplayYear = null;
    let currentDisplayMonth = null;
    
    // 获取今天的田历日期
    function getTodayTianDate() {
        const today = new Date();
        return TianCalendar.fromSolar(today.getFullYear(), today.getMonth() + 1, today.getDate());
    }
    
    // 创建日期元素
    function createDayElement(day, isOtherMonth, isToday, year, month) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        if (day === null) {
            dayElement.classList.add('empty-day');
            return dayElement;
        }
        
        dayElement.textContent = day;
        
        if (isOtherMonth) {
            dayElement.classList.add('other-month');
        }
        
        if (isToday) {
            dayElement.classList.add('today');
        }
        
        // 检查是否为特殊日期
        const festival = TianCalendar.getFestival(month, day);
        if (festival) {
            dayElement.classList.add('festival');
            dayElement.title = festival.name + ': ' + festival.desc;
        }
        
        // 添加点击事件监听器
        dayElement.addEventListener('click', function() {
            showDateDetails(year, month, day, isOtherMonth);
        });
        
        return dayElement;
    }
    
    // 显示日期详细信息
    function showDateDetails(year, month, day, isOtherMonth) {
        try {
            // 获取公历日期
            const gregorianDate = TianCalendar.toSolar(year, month, day);
            const gregorianYear = gregorianDate.getFullYear();
            const gregorianMonth = gregorianDate.getMonth() + 1;
            const gregorianDay = gregorianDate.getDate();
            
            // 获取曜日信息（日本式星期）
            const weekDays = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'];
            const weekDay = weekDays[gregorianDate.getDay()];
            
            // 获取农历信息
            const lunarInfo = getLunarInfo(gregorianYear, gregorianMonth, gregorianDay);
            const solarTerm = getSolarTermInfo(gregorianYear, gregorianMonth, gregorianDay);
            const huangdiYear = LunarCalendarLib.getHuangdiYear(lunarInfo.lunarYear);
            
            // 获取田历月份信息
            const tianMonthMeta = TianCalendar.MONTH_METADATA[month - 1];
            
            // 获取干支信息（从 lunar-javascript 库中已经获取）
            const monthGanzhi = lunarInfo.monthGanzhi || '';
            const dayGanzhi = lunarInfo.dayGanzhi || '';
            
            // 获取公历节日
            const solarFestival = LunarCalendar.getSolarFestival(gregorianMonth, gregorianDay);
            
            // 构建详细信息 HTML
            let detailsHTML = '<div class="date-details-header">' +
                '<h3>日期详情</h3>' +
                '<button class="close-btn" id="closeDateDetails">&times;</button>' +
                '</div>' +
                '<div class="date-info-grid">' +
                // 田历日期（去除括号）
                '<div class="date-info-item">' +
                '<div class="info-label">田历</div>' +
                '<div class="info-value">' + 
                (year > 0 ? '华田' : '田元前') + Math.abs(year) + '年' + month + '月' + day + '日' +
                '</div>' +
                '</div>' +
                // 公历日期
                '<div class="date-info-item">' +
                '<div class="info-label">公历</div>' +
                '<div class="info-value">' + gregorianYear + '年' + gregorianMonth + '月' + gregorianDay + '日</div>' +
                '</div>' +
                // 农历日期（使用阿拉伯数字，换行显示汉字）
                '<div class="date-info-item">' +
                '<div class="info-label">农历</div>' +
                '<div class="info-value">' + 
                huangdiYear + '年' + 
                (lunarInfo.isLeapMonth ? '闰' : '') + 
                lunarInfo.lunarMonth + '月' + 
                lunarInfo.lunarDay + '日<br>' +
                lunarInfo.lunarMonthName + lunarInfo.lunarDayName +
                '</div>' +
                '</div>' +
                // 干支与生肖信息
                '<div class="date-info-item">' +
                '<div class="info-label">干支生肖</div>' +
                '<div class="info-value">' + 
                lunarInfo.heavenlyStem + lunarInfo.earthlyBranch + '(' + lunarInfo.zodiac + ')年<br>' + 
                monthGanzhi + '月 ' + 
                dayGanzhi + '日' +
                '</div>' +

                '</div>';
            
            // 文化板块（琳凯蒂亚文化月份名称、节日描述，占据两个模块宽度）
            detailsHTML += '<div class="date-info-item culture-info">' +
                '<div class="info-label">琳凯蒂亚文化</div>' +
                '<div class="info-value">' +
                '<div class="rincatian-month">' + tianMonthMeta.name + ' ' + weekDay + '</div>' +
                '<div class="rincatian-desc">' + tianMonthMeta.desc + '</div>';
            
            // 如果有田历节日，也显示在文化板块中
            const tianFestival = TianCalendar.getFestival(month, day);
            if (tianFestival) {
                detailsHTML += '<div class="rincatian-festival">🎉 ' + tianFestival.name + ': ' + tianFestival.desc + '</div>';
            }
            
            detailsHTML += '</div></div>';
            
            // 节气信息
            if (solarTerm) {
                detailsHTML += '<div class="date-info-item">' +
                    '<div class="info-label">节气</div>' +
                    '<div class="info-value">' + solarTerm.name + '</div>' +
                    '</div>';
            }
            
            // 公历节日信息
            if (solarFestival) {
                detailsHTML += '<div class="date-info-item festival-info">' +
                    '<div class="info-label">公历节日</div>' +
                    '<div class="info-value">' + solarFestival.name + '</div>' +
                    '<div class="info-desc">' + solarFestival.desc + '</div>' +
                    '</div>';
            }
            
            // 农历节日信息
            if (lunarInfo.festival) {
                detailsHTML += '<div class="date-info-item festival-info">' +
                    '<div class="info-label">农历节日</div>' +
                    '<div class="info-value">' + lunarInfo.festival.name + '</div>' +
                    '<div class="info-desc">' + lunarInfo.festival.desc + '</div>' +
                    '</div>';
            }
            
            detailsHTML += '</div>';
            showDateModal(detailsHTML);
        } catch (error) {
            console.error('显示日期详情时出错:', error);
        }
    }


    // 获取田历日期字符串
    function getTianDateString(year, month, day, isOtherMonth) {
        // 确保不存在0年
        if (year === 0) {
            year = -1;
        }
        
        let yearStr = '';
        if (year < 0) {
            yearStr = '田元前' + Math.abs(year) + '年';
        } else if (year === 1) {
            yearStr = '华田元年';
        } else {
            yearStr = '华田' + year + '年';
        }
        
        return yearStr + month + '月' + day + '日';
    }

    // 获取农历信息（使用真实的农历计算）
    function getLunarInfo(year, month, day) {
        try {
            console.log('计算农历信息:', year, month, day);
            
            // 使用LunarCalendarLib类计算真实的农历信息
            if (typeof LunarCalendarLib === 'undefined') {
                console.error('LunarCalendarLib未定义，请确保已引入 lunar-calendar-lib.js');
                throw new Error('LunarCalendarLib未定义');
            }
            
            if (typeof LunarCalendarLib.solarToLunar !== 'function') {
                console.error('LunarCalendarLib.solarToLunar不是函数');
                throw new Error('LunarCalendarLib.solarToLunar不是函数');
            }
            
            const lunarInfo = LunarCalendarLib.solarToLunar(year, month, day);
            
            console.log('LunarCalendar计算结果:', lunarInfo);
            
            // 获取农历节日信息
            const lunarFestival = LunarCalendar.getLunarFestival(lunarInfo.lunarMonth, lunarInfo.lunarDay);
            
            return {
                lunarYear: lunarInfo.lunarYear,
                lunarMonth: lunarInfo.lunarMonth,
                lunarDay: lunarInfo.lunarDay,
                lunarMonthName: lunarInfo.lunarMonthName,
                lunarDayName: lunarInfo.lunarDayName,
                zodiac: lunarInfo.zodiac,
                heavenlyStem: lunarInfo.heavenlyStem,
                earthlyBranch: lunarInfo.earthlyBranch,
                monthGanzhi: lunarInfo.monthGanzhi,
                dayGanzhi: lunarInfo.dayGanzhi,
                isLeapMonth: lunarInfo.isLeapMonth,
                festival: lunarFestival
            };
        } catch (error) {
            console.error('计算农历信息时出错:', error);
            // 返回默认值
            return {
                lunarYear: year,
                lunarMonth: month,
                lunarDay: day,
                lunarMonthName: '未知月',
                lunarDayName: '未知日',
                zodiac: '未知',
                heavenlyStem: '未知',
                earthlyBranch: '未知',
                isLeapMonth: false,
                festival: null
            };
        }
    }

    // 获取节气信息
    function getSolarTermInfo(year, month, day) {
        try {
            if (typeof LunarCalendarLib === 'undefined' || typeof LunarCalendarLib.getSolarTerm !== 'function') {
                console.error('LunarCalendarLib或getSolarTerm未定义');
                return null;
            }
            
            return LunarCalendarLib.getSolarTerm(year, month, day);
        } catch (error) {
            console.error('获取节气信息时出错:', error);
            return null;
        }
    }

    // 显示日期详情模态框
    function showDateModal(content) {
        // 创建模态框元素
        const modal = document.createElement('div');
        modal.className = 'date-details-modal';
        modal.innerHTML = '<div class="date-details-content">' + content + '</div>';
        
        // 添加到页面
        document.body.appendChild(modal);
        
        // 添加关闭事件
        const closeBtn = modal.querySelector('#closeDateDetails');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                document.body.removeChild(modal);
            });
        }
        
        // 点击模态框外部关闭
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        // ESC键关闭
        function handleEscKey(e) {
            if (e.key === 'Escape') {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', handleEscKey);
            }
        }
        
        document.addEventListener('keydown', handleEscKey);
    }
    
    // 初始化日历
    function initCalendar() {
        renderFestivalsGrid(); // 动态渲染节日列表
        
        const today = getTodayTianDate();
        currentDisplayYear = today.year;
        currentDisplayMonth = today.month;
        
        updateCalendarDisplay();
        updateTodayInfo();
        
        // 绑定事件
        const prevBtn = document.getElementById('prevMonth');
        const nextBtn = document.getElementById('nextMonth');
        const todayBtn = document.getElementById('todayBtn');
        const prevYearBtn = document.getElementById('prevYear');
        const nextYearBtn = document.getElementById('nextYear');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentDisplayMonth--;
                if (currentDisplayMonth < 1) {
                    currentDisplayMonth = 12;
                    currentDisplayYear--;
                }
                updateCalendarDisplay();
                updateCurrentYearDisplay();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentDisplayMonth++;
                if (currentDisplayMonth > 12) {
                    currentDisplayMonth = 1;
                    currentDisplayYear++;
                }
                updateCalendarDisplay();
                updateCurrentYearDisplay();
            });
        }
        
        if (todayBtn) {
            todayBtn.addEventListener('click', () => {
                const today = getTodayTianDate();
                currentDisplayYear = today.year;
                currentDisplayMonth = today.month;
                updateCalendarDisplay();
                updateCurrentYearDisplay();
            });
        }
        
        // 年份切换按钮事件
        if (prevYearBtn) {
            prevYearBtn.addEventListener('click', () => {
                currentDisplayYear--;
                updateCalendarDisplay();
                updateCurrentYearDisplay();
                
                // 添加点击动画效果
                prevYearBtn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    prevYearBtn.style.transform = '';
                }, 150);
            });
        }
        
        if (nextYearBtn) {
            nextYearBtn.addEventListener('click', () => {
                currentDisplayYear++;
                updateCalendarDisplay();
                updateCurrentYearDisplay();
                
                // 添加点击动画效果
                nextYearBtn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    nextYearBtn.style.transform = '';
                }, 150);
            });
        }
        
        // 初始化年份显示
        updateCurrentYearDisplay();
        
        // 添加键盘快捷键支持（仅在田历标签页激活时）
        document.addEventListener('keydown', function(e) {
            // 检查是否在田历标签页
            const calendarSection = document.getElementById('calendar');
            if (!calendarSection || !calendarSection.classList.contains('active')) {
                return;
            }
            
            // 检查是否在输入框中，如果是则不处理快捷键
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            switch(e.key.toLowerCase()) {
                case 'w':
                    e.preventDefault();
                    // 上一年
                    if (prevYearBtn) prevYearBtn.click();
                    break;
                case 's':
                    e.preventDefault();
                    // 下一年
                    if (nextYearBtn) nextYearBtn.click();
                    break;
                case 'a':
                    e.preventDefault();
                    // 上个月
                    if (prevBtn) prevBtn.click();
                    break;
                case 'd':
                    e.preventDefault();
                    // 下个月
                    if (nextBtn) nextBtn.click();
                    break;
                case 'Home':
                case 't':
                case 'T':
                    e.preventDefault();
                    // 回到今天
                    if (todayBtn) todayBtn.click();
                    break;
            }
        });
    }
    
    // 更新日历显示
    function updateCalendarDisplay() {
        updateCalendarTitle();
        updateCalendarDays();
    }
    
    // 更新日历标题
    function updateCalendarTitle() {
        const titleElement = document.getElementById('calendarTitle');
        const subtitleElement = document.getElementById('calendarSubtitle');
        
        if (titleElement && subtitleElement) {
            const era = currentDisplayYear > 0 ? '华田' : '田元前';
            const yearStr = currentDisplayYear > 0 ? (currentDisplayYear === 1 ? '元年' : currentDisplayYear + '年') : Math.abs(currentDisplayYear) + '年';
            const monthMeta = TianCalendar.MONTH_METADATA[currentDisplayMonth - 1];
            
            titleElement.textContent = `${era}${yearStr} ${monthMeta.meaning}（${monthMeta.name}）`;//返回顶部日期显示
            
            // 显示对应的公历日期范围
            const firstDay = TianCalendar.toSolar(currentDisplayYear, currentDisplayMonth, 1);
            const daysInMonth = TianCalendar.getDaysInMonth(currentDisplayYear, currentDisplayMonth);
            const lastDay = TianCalendar.toSolar(currentDisplayYear, currentDisplayMonth, daysInMonth);
            subtitleElement.textContent = `对应公历: ${firstDay.getFullYear()}.${firstDay.getMonth() + 1}.${firstDay.getDate()} - ${lastDay.getFullYear()}.${lastDay.getMonth() + 1}.${lastDay.getDate()}`;
        }
    }
    
    // 更新日历日期
    function updateCalendarDays() {
        const daysContainer = document.getElementById('calendarDays');
        if (!daysContainer) return;
        
        daysContainer.innerHTML = '';
        
        // 使用新实现的网格生成器
        const grid = TianCalendar.getMonthGrid(currentDisplayYear, currentDisplayMonth);
        
        grid.forEach(cell => {
            const dayElement = createDayElement(cell.day, cell.type !== 'current', cell.isToday, currentDisplayYear, currentDisplayMonth);
            daysContainer.appendChild(dayElement);
        });
    }
    
    // 更新今天信息
    function updateTodayInfo() {
        const todayInfoElement = document.getElementById('todayInfo');
        if (!todayInfoElement) return;
        
        const today = getTodayTianDate();
        const todayGregorian = new Date();
        
        todayInfoElement.innerHTML = '<strong>今天：</strong>' + TianCalendar.format(today) + '<br>' +
            '<strong>公历：</strong>' + todayGregorian.getFullYear() + '年' + (todayGregorian.getMonth() + 1) + '月' + todayGregorian.getDate() + '日';
    }
    
    // 更新当前年份显示
    function updateCurrentYearDisplay() {
        const currentYearElement = document.getElementById('currentYearValue');
        if (!currentYearElement) return;
        
        const era = currentDisplayYear > 0 ? '华田' : '田元前';
        const yearStr = currentDisplayYear > 0 ? (currentDisplayYear === 1 ? '元年' : currentDisplayYear + '年') : Math.abs(currentDisplayYear) + '年';
        
        currentYearElement.textContent = era + yearStr;
        
        // 添加年份更新动画效果
        currentYearElement.style.transform = 'scale(1.1)';
        currentYearElement.style.opacity = '0.8';
        
        setTimeout(function() {
            currentYearElement.style.transform = 'scale(1)';
            currentYearElement.style.opacity = '1';
        }, 200);
    }
    
    // 动态渲染节日列表
    function renderFestivalsGrid() {
        const grid = document.querySelector('.festivals-grid');
        if (!grid) return;
        
        grid.innerHTML = '';
        Object.entries(TianCalendar.FESTIVALS).forEach(([dateKey, fest]) => {
            const [m, d] = dateKey.split('-');
            const item = document.createElement('div');
            item.className = 'festival-item';
            item.innerHTML = `
                <div class="festival-date">${m}月${d}日</div>
                <div class="festival-name">${fest.name}</div>
                <div class="festival-desc">${fest.desc}</div>
            `;
            grid.appendChild(item);
        });
    }

    // 只在田历标签页存在时初始化
    if (document.getElementById('calendar')) {
        initCalendar();
    }
}

// =================== 第一阶段优化功能 ===================

// 图片懒加载功能
function initLazyLoad() {
    const lazyImages = document.querySelectorAll('.lazy-load');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.classList.add('loaded');
                        img.classList.remove('lazy-load');
                        
                        // 添加渐显动画
                        img.style.opacity = '0';
                        img.style.transition = 'opacity 0.5s ease';
                        setTimeout(() => {
                            img.style.opacity = '1';
                        }, 50);
                        
                        observer.unobserve(img);
                        console.log('✅ 图片懒加载完成:', src);
                    }
                }
            });
        }, {
            rootMargin: '50px 0px', // 提前50px开始加载
            threshold: 0.01
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
        console.log(`🖼️ 初始化懒加载: ${lazyImages.length} 张图片`);
    } else {
        // 备用方案：直接加载所有图片
        lazyImages.forEach(img => {
            const src = img.getAttribute('data-src');
            if (src) {
                img.src = src;
                img.classList.remove('lazy-load');
            }
        });
    }
}

// 移动端导航优化
function initMobileNavigation() {
    const cultureNav = document.querySelector('.culture-nav');
    const cultureTabs = document.querySelector('.culture-tabs');
    
    if (!cultureNav || !cultureTabs) return;
    
    // 检测是否为移动端
    function isMobile() {
        return window.innerWidth < 768;
    }
    
    // 添加水平滚动指示器
    function addScrollIndicator() {
        if (!isMobile()) return;
        
        // 检查是否已经添加指示器
        if (cultureNav.querySelector('.scroll-indicator')) return;
        
        const indicator = document.createElement('div');
        indicator.className = 'scroll-indicator';
        indicator.innerHTML = '← 滚动查看更多 →';
        indicator.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 0.75rem;
            color: rgba(255, 215, 0, 0.6);
            padding: 5px;
            background: linear-gradient(to top, rgba(26, 26, 46, 0.9), transparent);
            pointer-events: none;
            animation: fadeInOut 2s ease-in-out infinite;
        `;
        
        cultureNav.appendChild(indicator);
        
        // 滚动后隐藏指示器
        let scrollTimeout;
        cultureTabs.addEventListener('scroll', () => {
            indicator.style.opacity = '0';
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                indicator.style.opacity = '1';
            }, 1000);
        });
    }
    
    // 添加CSS动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.8; }
        }
        
        @media (max-width: 768px) {
            .culture-tabs {
                overflow-x: auto;
                scroll-snap-type: x mandatory;
                -webkit-overflow-scrolling: touch;
                scrollbar-width: thin;
                scrollbar-color: rgba(255, 215, 0, 0.3) transparent;
            }
            
            .culture-tabs::-webkit-scrollbar {
                height: 4px;
            }
            
            .culture-tabs::-webkit-scrollbar-track {
                background: transparent;
            }
            
            .culture-tabs::-webkit-scrollbar-thumb {
                background: rgba(255, 215, 0, 0.3);
                border-radius: 2px;
            }
            
            .culture-tabs li {
                scroll-snap-align: center;
                flex-shrink: 0;
            }
            
            .tab-link {
                white-space: nowrap;
                padding: 12px 16px;
                font-size: 0.9rem;
            }
        }
    `;
    document.head.appendChild(style);
    
    // 初始化
    addScrollIndicator();
    
    // 响应式更新
    window.addEventListener('resize', () => {
        if (isMobile()) {
            addScrollIndicator();
        } else {
            const indicator = cultureNav.querySelector('.scroll-indicator');
            if (indicator) {
                indicator.remove();
            }
        }
    });
    
    console.log('📱 移动端导航优化已启用');
}

// =================== 第二阶段优化功能 ===================

// 搜索功能
function initCultureSearch() {
    const searchInput = document.getElementById('cultureSearchInput');
    const searchResults = document.getElementById('cultureSearchResults');
    
    if (!searchInput || !searchResults) {
        console.warn('⚠️ 搜索框元素未找到');
        return;
    }
    
    // 搜索数据库（可扩展）
    const searchDatabase = [
        // 人物
        { title: '星帝', category: '人物', desc: '最高统治者，银胡子中藏着发光的小星', section: 'society' },
        { title: '星母', category: '人物', desc: '慈爱的统治者，裙摆绣有星系图案', section: 'society' },
        { title: '妙可公主', category: '人物', desc: '星帝和星母的独生女，光线使者领袖', section: 'characters' },
        { title: '娜卡丽', category: '人物', desc: '妙可公主的好友，来自蓝虹星球的公主', section: 'characters' },
        { title: '雪晨', category: '人物', desc: '星冰女神，掌管冰雪之力', section: 'characters' },
        { title: '琳娜', category: '人物', desc: '翱翼女神，掌管风之力', section: 'characters' },
        
        // 地点
        { title: '银蓝色铃铛树', category: '地点', desc: '神奇的树林，果实会唱出优美的歌声', section: 'geography' },
        { title: '星光河', category: '地点', desc: '蜂蜜色的河流，河中生长着发光的莲花', section: 'geography' },
        { title: '星晶山脉', category: '地点', desc: '半透明的山脉，山上生长着会发光的神奇蘑菇', section: 'geography' },
        { title: '迷雾森林', category: '地点', desc: '神秘的森林，有会走路的树木和会眨眼睛的古老巨木', section: 'geography' },
        { title: '回声花田', category: '地点', desc: '能够储存并重放声音的花田', section: 'geography' },
        { title: '悬浮草甸', category: '地点', desc: '漂浮在空中的草甸，长满能奏出童谣的叮哚草', section: 'geography' },
        
        // 魔法
        { title: '彩虹水晶', category: '魔法', desc: '七色神奇水晶，拥有强大的魔法力量', section: 'magic' },
        { title: '光线魔法', category: '魔法', desc: '用光线来施展魔法，是琳凯蒂亚星球的核心魔法体系', section: 'magic' },
        { title: '元素魔法', category: '魔法', desc: '掌控自然元素的魔法，包括冰、风、火、水等', section: 'magic' },
        { title: '光线使者', category: '魔法', desc: '掌握光线魔法的使者，守护星球和平', section: 'magic' },
        
        // 传说故事
        { title: '前传', category: '故事', desc: '光线传奇的开端，讲述彩虹水晶的起源', section: 'legends', story: 'prequel' },
        { title: '第一集', category: '故事', desc: '妙可公主与娜卡丽的首次相遇', section: 'legends', story: 'episode1' },
        { title: '第二集', category: '故事', desc: '彩虹水晶的秘密逐渐揭开', section: 'legends', story: 'episode2' },
        { title: '第三集', category: '故事', desc: '黑暗势力的出现', section: 'legends', story: 'episode3' },
        { title: '第四集', category: '故事', desc: '光线使者的集结', section: 'legends', story: 'episode4' },
        { title: '第五集', category: '故事', desc: '水晶守护者的试炼', section: 'legends', story: 'episode5' },
        { title: '第六集', category: '故事', desc: '光明与黑暗的最终决战', section: 'legends', story: 'episode6' },
        
        // 文化
        { title: '田历历法', category: '文化', desc: '琳凯蒂亚星球的独特历法系统', section: 'calendar' },
        { title: '双月奇观', category: '文化', desc: '银月和金月交叠形成的缤烂彩虹光环', section: 'geography' }
    ];
    
    // 搜索函数
    function performSearch(query) {
        if (!query || query.trim().length < 1) {
            searchResults.classList.remove('show');
            return;
        }
        
        const lowerQuery = query.toLowerCase().trim();
        const results = searchDatabase.filter(item => 
            item.title.toLowerCase().includes(lowerQuery) ||
            item.desc.toLowerCase().includes(lowerQuery) ||
            item.category.toLowerCase().includes(lowerQuery)
        );
        
        displaySearchResults(results);
    }
    
    // 显示搜索结果
    function displaySearchResults(results) {
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">🔍 未找到相关内容</div>';
            searchResults.classList.add('show');
            return;
        }
        
        const html = results.map(result => `
            <div class="search-result-item" data-section="${result.section}" data-story="${result.story || ''}">
                <div class="search-result-title">${result.title}</div>
                <div class="search-result-desc">${result.desc}</div>
                <span class="search-result-category">${result.category}</span>
            </div>
        `).join('');
        
        searchResults.innerHTML = html;
        searchResults.classList.add('show');
        
        // 绑定点击事件
        searchResults.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const section = item.dataset.section;
                const story = item.dataset.story;
                
                // 切换到对应标签页
                const tabLink = document.querySelector(`[data-tab="${section}"]`);
                if (tabLink) {
                    tabLink.click();
                }
                
                // 如果是故事，切换到对应故事标签
                if (story) {
                    setTimeout(() => {
                        const storyTab = document.querySelector(`[data-story="${story}"]`);
                        if (storyTab) {
                            storyTab.click();
                        }
                    }, 300);
                }
                
                // 隐藏搜索结果
                searchResults.classList.remove('show');
                searchInput.value = '';
                searchInput.blur();
            });
        });
    }
    
    // 监听输入
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(e.target.value);
        }, 300); // 防抖动
    });
    
    // 点击外部关闭搜索结果
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove('show');
        }
    });
    
    // ESC键关闭
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchResults.classList.remove('show');
            searchInput.blur();
        }
    });
    
    console.log('🔍 搜索功能已启用');
}

// 夜间模式切换
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle?.querySelector('.theme-icon');
    
    if (!themeToggle) {
        console.warn('⚠️ 主题切换按钮未找到');
        return;
    }
    
    // 从 localStorage 读取主题偏好
    const savedTheme = localStorage.getItem('cultureTheme') || 'day';
    applyTheme(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'day';
        const newTheme = currentTheme === 'day' ? 'night' : 'day';
        
        applyTheme(newTheme);
        localStorage.setItem('cultureTheme', newTheme);
        
        // 动画效果
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 300);
    });
    
    function applyTheme(theme) {
        if (theme === 'night') {
            document.documentElement.setAttribute('data-theme', 'night');
            if (themeIcon) themeIcon.textContent = '☀️'; // 太阳
        } else {
            document.documentElement.removeAttribute('data-theme');
            if (themeIcon) themeIcon.textContent = '🌙'; // 月亮
        }
    }
    
    console.log('🌙 夜间模式已启用');
}

// 阅读进度条
function initReadingProgress() {
    const progressBar = document.getElementById('readingProgressBar');
    
    if (!progressBar) {
        console.warn('⚠️ 阅读进度条元素未找到');
        return;
    }
    
    // 更新进度条
    function updateProgress() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;
        
        progressBar.style.width = Math.min(progress, 100) + '%';
    }
    
    // 监听滚动
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateProgress();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // 监听窗口大小变化
    window.addEventListener('resize', updateProgress);
    
    // 初始化
    updateProgress();
    
    // 故事阅读记录
    loadStoryReadingProgress();
    trackStoryReading();
    
    console.log('📊 阅读进度功能已启用');
}

// 加载故事阅读记录
function loadStoryReadingProgress() {
    const readStories = JSON.parse(localStorage.getItem('readStories') || '[]');
    
    readStories.forEach(storyId => {
        const storyTab = document.querySelector(`[data-story="${storyId}"]`);
        if (storyTab) {
            storyTab.classList.add('read');
        }
    });
}

// 跟踪故事阅读
function trackStoryReading() {
    const storyTabs = document.querySelectorAll('.story-tab');
    
    storyTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const storyId = tab.getAttribute('data-story');
            if (!storyId) return;
            
            // 标记为已读
            tab.classList.add('read');
            
            // 保存到 localStorage
            const readStories = JSON.parse(localStorage.getItem('readStories') || '[]');
            if (!readStories.includes(storyId)) {
                readStories.push(storyId);
                localStorage.setItem('readStories', JSON.stringify(readStories));
            }
        });
    });
}

// 人物卡片增强
function initCharacterCards() {
    const characterProfiles = document.querySelectorAll('.character-profile');
    
    characterProfiles.forEach(profile => {
        profile.addEventListener('click', function() {
            showCharacterModal(this);
        });
    });
    
    console.log('👥 人物卡片功能已启用');
}

// 显示人物详情模态框
function showCharacterModal(profileElement) {
    const name = profileElement.querySelector('h3')?.textContent || '未知人物';
    const title = profileElement.querySelector('.character-title')?.textContent || '';
    const desc = profileElement.querySelector('.character-desc')?.textContent || '暂无介绍';
    const icon = profileElement.querySelector('.character-icon')?.textContent || '👤';
    
    const modalHTML = `
        <div class="character-modal">
            <div class="character-modal-content">
                <div class="character-modal-header">
                    <div class="character-modal-icon">${icon}</div>
                    <h2>${name}</h2>
                    <button class="character-modal-close">&times;</button>
                </div>
                <div class="character-modal-body">
                    ${title ? `<div class="character-modal-title">${title}</div>` : ''}
                    <div class="character-modal-desc">${desc}</div>
                    <div class="character-modal-footer">
                        <p>📚 更多关于 ${name} 的故事请前往<a href="#legends" class="modal-link">《传说故事》</a>查看</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 防止 body 滚动
    document.body.style.overflow = 'hidden';
    
    // 创建模态框
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    const modal = modalContainer.firstElementChild;
    document.body.appendChild(modal);
    
    // 动画显示
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('.character-modal-content').style.transform = 'scale(1)';
    }, 10);
    
    // 关闭按钮
    const closeBtn = modal.querySelector('.character-modal-close');
    closeBtn.addEventListener('click', () => {
        closeModal(modal);
    });
    
    // 点击背景关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
    
    // ESC 关闭
    function handleEsc(e) {
        if (e.key === 'Escape') {
            closeModal(modal);
            document.removeEventListener('keydown', handleEsc);
        }
    }
    document.addEventListener('keydown', handleEsc);
    
    // 链接点击
    modal.querySelectorAll('.modal-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(modal);
            // 切换到传说故事标签
            const legendsTab = document.querySelector('[data-tab="legends"]');
            if (legendsTab) {
                legendsTab.click();
            }
        });
    });
}

// 关闭人物模态框
function closeModal(modal) {
    modal.style.opacity = '0';
    modal.querySelector('.character-modal-content').style.transform = 'scale(0.9)';
    setTimeout(() => {
        document.body.removeChild(modal);
        // 恢复 body 滚动
        document.body.style.overflow = '';
    }, 300);
}

// 添加人物模态框样式
const characterModalStyle = document.createElement('style');
characterModalStyle.textContent = `
    .character-modal {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
        overflow: hidden; /* 防止模态框背景产生滚动条 */
    }
    
    .character-modal-content {
        background: linear-gradient(145deg, rgba(26, 26, 46, 0.98), rgba(22, 33, 62, 0.98));
        border: 2px solid rgba(255, 215, 0, 0.3);
        border-radius: 20px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow: hidden; /* 防止内容溢出 */
        display: flex;
        flex-direction: column;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
        transform: scale(0.9);
        transition: transform 0.3s ease;
    }
    
    .character-modal-header {
        background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(76, 205, 196, 0.1));
        padding: 30px;
        text-align: center;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        position: relative;
        flex-shrink: 0; /* 防止header被压缩 */
    }
    
    .character-modal-icon {
        font-size: 4rem;
        margin-bottom: 15px;
        /* 移除 float 动画，避免图标飞出 */
        display: inline-block;
    }
    
    /* 移除可能导致图标溢出的 float 动画 */
    
    .character-modal-header h2 {
        color: #ffd700;
        font-size: 2rem;
        margin: 0;
    }
    
    .character-modal-close {
        position: absolute;
        top: 15px;
        right: 15px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #fff;
        width: 35px;
        height: 35px;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
    }
    
    .character-modal-close:hover {
        background: rgba(255, 107, 107, 0.3);
        transform: rotate(90deg);
    }
    
    .character-modal-body {
        padding: 30px;
        overflow-y: auto; /* 只让body部分滚动 */
        flex: 1;
    }
    
    .character-modal-title {
        color: #4ecdc4;
        font-size: 1.2rem;
        margin-bottom: 15px;
        font-style: italic;
    }
    
    .character-modal-desc {
        color: #e0e0e0;
        line-height: 1.8;
        font-size: 1rem;
        margin-bottom: 20px;
    }
    
    .character-modal-footer {
        background: rgba(76, 205, 196, 0.05);
        border: 1px solid rgba(76, 205, 196, 0.2);
        border-radius: 10px;
        padding: 15px;
        text-align: center;
    }
    
    .character-modal-footer p {
        color: #b0b0c8;
        margin: 0;
        font-size: 0.9rem;
    }
    
    .modal-link {
        color: #ffd700;
        text-decoration: none;
        font-weight: 600;
        transition: color 0.3s ease;
    }
    
    .modal-link:hover {
        color: #4ecdc4;
        text-decoration: underline;
    }
`;
document.head.appendChild(characterModalStyle);

// =================== 第三阶段优化功能 ===================

// 时间线可视化
function initTimelineVisualization() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if (timelineItems.length === 0) {
        console.warn('⚠️ 时间线元素未找到');
        return;
    }
    
    // 高亮时间线项
    function highlightTimelineItem(index) {
        timelineItems.forEach((item, i) => {
            if (i === index) {
                item.classList.add('highlight');
                // 滚动到视图
                item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // 播放时间线音效
                if (typeof window.playSound === 'function') {
                    window.playSound('timeline');
                }
                
                // 3秒后移除高亮
                setTimeout(() => {
                    item.classList.remove('highlight');
                }, 1800);
            }
        });
    }
    
    // 监听时间线项点击（手动高亮）
    timelineItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            highlightTimelineItem(index);
        });
    });
    
    console.log('📈 时间线可视化已启用');
}

// 魔法系统交互
function initMagicSystem() {
    const crystal3DItems = document.querySelectorAll('.crystal-3d-item');
    
    if (crystal3DItems.length === 0) {
        console.warn('⚠️ 3D水晶元素未找到');
        return;
    }
    
    // 水晶点击激活
    crystal3DItems.forEach((crystal, index) => {
        crystal.addEventListener('click', function() {
            // 激活动画
            this.classList.add('activated');
            
            // 创建粒子特效
            createParticleEffect(this);
            
            // 播放音效（如果启用）
            if (typeof window.playSound === 'function') {
                window.playSound('crystal');
            }
            
            // 1秒后移除激活状态
            setTimeout(() => {
                this.classList.remove('activated');
            }, 1000);
        });
        
        // 添加悬停提示
        crystal.title = `点击激活${getCrystalName(crystal.dataset.crystal)}水晶`;
    });
    
    // 创建粒子特效
    function createParticleEffect(crystal) {
        const particlesContainer = crystal.querySelector('.crystal-particles');
        if (!particlesContainer) return;
        
        particlesContainer.innerHTML = '';
        
        // 创建多个粒子
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 5px;
                height: 5px;
                background: currentColor;
                border-radius: 50%;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                animation: particleFly ${Math.random() * 0.5 + 0.5}s ease-out forwards;
                animation-delay: ${Math.random() * 0.2}s;
            `;
            
            // 随机方向
            const angle = (Math.PI * 2 * i) / 20;
            const distance = Math.random() * 50 + 30;
            particle.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
            particle.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
            
            particlesContainer.appendChild(particle);
        }
        
        // 添加粒子动画
        if (!document.getElementById('particleFlyAnimation')) {
            const style = document.createElement('style');
            style.id = 'particleFlyAnimation';
            style.textContent = `
                @keyframes particleFly {
                    0% {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(var(--tx, 0), var(--ty, 0)) scale(0);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // 获取水晶名称
    function getCrystalName(color) {
        const names = {
            red: '赤红',
            orange: '橙黄',
            yellow: '明黄',
            green: '翠绿',
            blue: '湛蓝',
            indigo: '靴蓝',
            purple: '紫晶'
        };
        return names[color] || '未知';
    }
    
    console.log('✨ 魔法系统交互已启用');
}

// 音效系统
function initAudioSystem() {
    const bgMusicToggle = document.getElementById('bgMusicToggle');
    const sfxToggle = document.getElementById('sfxToggle');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeValue = document.getElementById('volumeValue');
    
    // 初始化 Web Audio API
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
        console.warn('⚠️ 浏览器不支持 Web Audio API');
        return;
    }
    
    const audioContext = new AudioContext();
    const masterGain = audioContext.createGain();
    masterGain.connect(audioContext.destination);
    
    // 音效状态
    let audioState = {
        bgMusicEnabled: false,
        sfxEnabled: true,
        volume: 50,
        bgMusicOscillators: [] // 存储背景音乐振荡器
    };
    
    // 定义全局音效播放函数（覆盖占位符）
    window.playSound = function(type) {
        if (!audioState.sfxEnabled) return;
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        const now = audioContext.currentTime;
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        // 根据类型设置不同的音效
        switch(type) {
            case 'click':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, now);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.stop(now + 0.1);
                break;
                
            case 'crystal':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(1200, now + 0.3);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
                osc.stop(now + 0.4);
                break;
                
            case 'tab':
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(900, now + 0.15);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                osc.stop(now + 0.15);
                break;
                
            case 'modal':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(500, now);
                osc.frequency.setValueAtTime(700, now + 0.05);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                osc.stop(now + 0.2);
                break;
                
            case 'timeline':
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(200, now);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
                osc.stop(now + 0.25);
                break;
                
            default:
                osc.type = 'sine';
                osc.frequency.value = 440;
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.stop(now + 0.1);
        }
        
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        
        console.log(`🔊 播放音效: ${type}`);
    };
    
    // 如果没有控制元素，只定义音效函数后返回
    if (!bgMusicToggle || !sfxToggle || !volumeSlider || !volumeValue) {
        console.warn('⚠️ 音效控制元素未找到，仅启用基础音效功能');
        return;
    }
    
    // 从 localStorage 读取音效偏好
    const savedAudioState = localStorage.getItem('cultureAudioState');
    if (savedAudioState) {
        try {
            const saved = JSON.parse(savedAudioState);
            audioState.bgMusicEnabled = saved.bgMusicEnabled || false;
            audioState.sfxEnabled = saved.sfxEnabled !== false;
            audioState.volume = saved.volume || 50;
            applyAudioState();
        } catch (e) {
            console.error('音效状态解析错误:', e);
        }
    }
    
    // 设置初始音量
    masterGain.gain.value = audioState.volume / 100;
    
    // 应用音效状态
    function applyAudioState() {
        if (audioState.bgMusicEnabled) {
            bgMusicToggle.classList.add('active');
        } else {
            bgMusicToggle.classList.remove('active');
        }
        
        if (audioState.sfxEnabled) {
            sfxToggle.classList.add('active');
            sfxToggle.classList.remove('muted');
        } else {
            sfxToggle.classList.remove('active');
            sfxToggle.classList.add('muted');
        }
        
        volumeSlider.value = audioState.volume;
        volumeValue.textContent = audioState.volume + '%';
        masterGain.gain.value = audioState.volume / 100;
    }
    
    // 背景音乐切换
    bgMusicToggle.addEventListener('click', () => {
        // 恢复 AudioContext（用户交互后才能播放）
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        audioState.bgMusicEnabled = !audioState.bgMusicEnabled;
        applyAudioState();
        saveAudioState();
        
        if (audioState.bgMusicEnabled) {
            playBackgroundMusic();
        } else {
            stopBackgroundMusic();
        }
        
        playSound('click');
    });
    
    // 音效切换
    sfxToggle.addEventListener('click', () => {
        audioState.sfxEnabled = !audioState.sfxEnabled;
        applyAudioState();
        saveAudioState();
        
        if (audioState.sfxEnabled) {
            playSound('click');
        }
    });
    
    // 音量控制
    volumeSlider.addEventListener('input', (e) => {
        audioState.volume = parseInt(e.target.value);
        volumeValue.textContent = audioState.volume + '%';
        masterGain.gain.value = audioState.volume / 100;
    });
    
    volumeSlider.addEventListener('change', () => {
        saveAudioState();
        playSound('click');
    });
    
    // 保存音效状态
    function saveAudioState() {
        localStorage.setItem('cultureAudioState', JSON.stringify({
            bgMusicEnabled: audioState.bgMusicEnabled,
            sfxEnabled: audioState.sfxEnabled,
            volume: audioState.volume
        }));
    }
    
    // 播放背景音乐（合成魔法主题音乐）
    function playBackgroundMusic() {
        console.log('🎵 背景音乐开始播放');
        
        // 停止之前的音乐
        stopBackgroundMusic();
        
        // 创建魔法主题和弦进行：C - Am - F - G
        const chords = [
            [261.63, 329.63, 392.00], // C大三和弦 (C-E-G)
            [220.00, 261.63, 329.63], // Am小三和弦 (A-C-E)
            [174.61, 220.00, 261.63], // F大三和弦 (F-A-C)
            [196.00, 246.94, 293.66]  // G大三和弦 (G-B-D)
        ];
        
        let chordIndex = 0;
        
        function playChord() {
            if (!audioState.bgMusicEnabled) return;
            
            const chord = chords[chordIndex];
            const now = audioContext.currentTime;
            
            // 为每个音符创建振荡器
            chord.forEach((freq, i) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                
                // 使用柔和的波形
                osc.type = 'sine';
                osc.frequency.value = freq;
                
                // 音量包络（ADSR）
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.08, now + 0.1); // Attack
                gain.gain.linearRampToValueAtTime(0.05, now + 0.3); // Decay & Sustain
                gain.gain.linearRampToValueAtTime(0, now + 1.8); // Release
                
                osc.connect(gain);
                gain.connect(masterGain);
                
                osc.start(now);
                osc.stop(now + 2);
                
                audioState.bgMusicOscillators.push(osc);
            });
            
            chordIndex = (chordIndex + 1) % chords.length;
            
            // 每2秒播放下一个和弦
            if (audioState.bgMusicEnabled) {
                setTimeout(playChord, 2000);
            }
        }
        
        playChord();
    }
    
    // 停止背景音乐
    function stopBackgroundMusic() {
        console.log('🔇 背景音乐停止播放');
        audioState.bgMusicOscillators.forEach(osc => {
            try {
                osc.stop();
            } catch (e) {
                // 振荡器已停止
            }
        });
        audioState.bgMusicOscillators = [];
    }
    
    // 如果用户之前启用了背景音乐，自动播放（需要用户交互后才能播放）
    if (audioState.bgMusicEnabled) {
        // 等待用户第一次交互
        document.addEventListener('click', function resumeAudio() {
            if (audioContext.state === 'suspended') {
                audioContext.resume().then(() => {
                    if (audioState.bgMusicEnabled) {
                        playBackgroundMusic();
                    }
                });
            }
            document.removeEventListener('click', resumeAudio);
        }, { once: true });
    }
    
    console.log('🔊 音效系统已启用（Web Audio API）');
}

// 播放背景音乐（模拟）
function playBackgroundMusic() {
    console.log('🎵 背景音乐开始播放');
    // 实际应用中可以使用 Web Audio API 或 <audio> 标签
    // const audio = new Audio('path/to/music.mp3');
    // audio.loop = true;
    // audio.play();
}

// 停止背景音乐（模拟）
function stopBackgroundMusic() {
    console.log('🔇 背景音乐停止播放');
    // audio.pause();
}

// 播放音效（模拟）
function playSound(type) {
    const audioState = JSON.parse(localStorage.getItem('cultureAudioState') || '{}');
    if (audioState.sfxEnabled === false) return;
    
    console.log(`🔊 播放音效: ${type}`);
    // 实际应用中可以使用 Web Audio API
    // const sound = new Audio(`path/to/${type}.mp3`);
    // sound.volume = (audioState.volume || 50) / 100;
    // sound.play();
}

// 更新音量（模拟）
function updateVolume(volume) {
    console.log(`🔊 音量设置为: ${volume}%`);
    // 实际应用中更新所有音频元素的音量
    // if (window.backgroundMusic) {
    //     window.backgroundMusic.volume = volume / 100;
    // }
}
