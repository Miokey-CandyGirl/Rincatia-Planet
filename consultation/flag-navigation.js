// 国旗导航菜单功能
// Flag Navigation Menu

/**
 * 国旗导航菜单系统
 */
class FlagNavigation {
    constructor() {
        this.isMenuOpen = false;
        this.menuContainer = null;
        this.init();
    }

    init() {
        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        console.log('🎌 初始化国旗导航菜单...');
        
        // 查找国旗元素
        const flagContainer = document.querySelector('.rincatian-flag');
        const flagIcon = document.querySelector('.flag-icon');
        
        if (!flagContainer || !flagIcon) {
            console.warn('未找到国旗元素，跳过导航菜单初始化');
            return;
        }

        // 为国旗容器添加点击事件
        flagContainer.style.cursor = 'pointer';
        flagContainer.style.position = 'relative';
        flagContainer.title = '点击展开导航菜单';
        
        // 添加悬停效果
        flagContainer.addEventListener('mouseenter', () => {
            flagIcon.style.transform = 'scale(1.1)';
            flagIcon.style.transition = 'transform 0.3s ease';
        });

        flagContainer.addEventListener('mouseleave', () => {
            if (!this.isMenuOpen) {
                flagIcon.style.transform = 'scale(1)';
            }
        });

        // 添加点击事件
        flagContainer.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        // 创建菜单容器
        this.createMenuContainer();

        // 点击页面其他地方关闭菜单
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && !flagContainer.contains(e.target)) {
                this.closeMenu();
            }
        });

        // ESC键关闭菜单
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });

        console.log('✅ 国旗导航菜单初始化完成');
    }

    createMenuContainer() {
        // 创建菜单容器
        this.menuContainer = document.createElement('div');
        this.menuContainer.className = 'flag-navigation-menu';
        this.menuContainer.innerHTML = this.generateMenuHTML();
        
        // 添加样式
        this.addMenuStyles();
        
        // 将菜单添加到国旗容器
        const flagContainer = document.querySelector('.rincatian-flag');
        flagContainer.appendChild(this.menuContainer);
        
        // 为菜单项添加点击事件
        this.addMenuEventListeners();
    }

    generateMenuHTML() {
        const currentPage = this.getCurrentPage();
        
        const menuItems = [
            { name: '首页', url: 'index.html', icon: '🏠', key: 'index' },
            { name: '语法', url: 'grammar.html', icon: '📝', key: 'grammar' },
            { name: '词典', url: 'dictionary.html', icon: '📚', key: 'dictionary' },
            { name: '文化', url: 'culture.html', icon: '🎨', key: 'culture' },
            { name: '社区', url: 'community.html', icon: '💬', key: 'community' }
        ];

        return `
            <div class="flag-menu-header">
                <div class="flag-menu-title">
                    <img src="rincatian-flag.png" alt="琳凯蒂亚国旗" class="menu-flag-icon">
                    <span>网站导航</span>
                </div>
            </div>
            <div class="flag-menu-items">
                ${menuItems.map(item => `
                    <a href="${item.url}" class="flag-menu-item ${currentPage === item.key ? 'active' : ''}" data-page="${item.key}">
                        <span class="menu-item-icon">${item.icon}</span>
                        <span class="menu-item-text">${item.name}</span>
                        ${currentPage === item.key ? '<span class="current-indicator">•</span>' : ''}
                    </a>
                `).join('')}
            </div>
            <div class="flag-menu-footer">
                <div class="menu-footer-text">琳凯蒂亚语社区</div>
                <div class="menu-footer-subtitle">Rincatian Community</div>
            </div>
        `;
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        
        if (filename === 'index.html' || filename === '') return 'index';
        if (filename === 'grammar.html') return 'grammar';
        if (filename === 'dictionary.html') return 'dictionary';
        if (filename === 'culture.html') return 'culture';
        if (filename === 'community.html') return 'community';
        
        return 'index'; // 默认
    }

    addMenuStyles() {
        const styleId = 'flag-navigation-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .flag-navigation-menu {
                position: absolute;
                top: 100%;
                left: 0;
                z-index: 1000;
                background: linear-gradient(135deg, 
                    rgba(26, 26, 46, 0.95) 0%, 
                    rgba(45, 45, 75, 0.95) 100%);
                border: 1px solid rgba(255, 215, 0, 0.3);
                border-radius: 12px;
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3),
                           0 5px 15px rgba(255, 215, 0, 0.1);
                backdrop-filter: blur(10px);
                min-width: 220px;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px) scale(0.95);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                margin-top: 8px;
            }

            .flag-navigation-menu.open {
                opacity: 1;
                visibility: visible;
                transform: translateY(0) scale(1);
            }

            .flag-menu-header {
                padding: 15px;
                border-bottom: 1px solid rgba(255, 215, 0, 0.2);
                background: linear-gradient(135deg, 
                    rgba(255, 215, 0, 0.1) 0%, 
                    rgba(0, 188, 212, 0.1) 100%);
            }

            .flag-menu-title {
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: 600;
                color: #ffd700;
                font-size: 14px;
            }

            .menu-flag-icon {
                width: 20px;
                height: auto;
                border-radius: 2px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }

            .flag-menu-items {
                padding: 8px 0;
            }

            .flag-menu-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 15px;
                color: #e0e0e8;
                text-decoration: none;
                transition: all 0.2s ease;
                position: relative;
                font-size: 14px;
            }

            .flag-menu-item:hover {
                background: linear-gradient(135deg, 
                    rgba(255, 215, 0, 0.1) 0%, 
                    rgba(0, 188, 212, 0.1) 100%);
                color: #ffd700;
                transform: translateX(4px);
            }

            .flag-menu-item.active {
                background: linear-gradient(135deg, 
                    rgba(255, 215, 0, 0.15) 0%, 
                    rgba(0, 188, 212, 0.15) 100%);
                color: #ffd700;
                border-left: 3px solid #ffd700;
            }

            .menu-item-icon {
                font-size: 16px;
                width: 20px;
                text-align: center;
            }

            .menu-item-text {
                flex: 1;
                font-weight: 500;
            }

            .current-indicator {
                color: #00bcd4;
                font-size: 18px;
                font-weight: bold;
            }

            .flag-menu-footer {
                padding: 12px 15px;
                border-top: 1px solid rgba(255, 215, 0, 0.2);
                text-align: center;
                background: linear-gradient(135deg, 
                    rgba(0, 0, 0, 0.1) 0%, 
                    rgba(255, 215, 0, 0.05) 100%);
            }

            .menu-footer-text {
                font-size: 12px;
                color: #ffd700;
                font-weight: 600;
                margin-bottom: 2px;
            }

            .menu-footer-subtitle {
                font-size: 10px;
                color: #00bcd4;
                opacity: 0.8;
            }

            /* 响应式设计 */
            @media (max-width: 768px) {
                .flag-navigation-menu {
                    min-width: 200px;
                    font-size: 13px;
                }
                
                .flag-menu-item {
                    padding: 10px 12px;
                }
            }

            /* 动画效果 */
            .flag-menu-item {
                animation: slideInLeft 0.3s ease forwards;
                opacity: 0;
            }

            .flag-navigation-menu.open .flag-menu-item:nth-child(1) { animation-delay: 0.1s; }
            .flag-navigation-menu.open .flag-menu-item:nth-child(2) { animation-delay: 0.15s; }
            .flag-navigation-menu.open .flag-menu-item:nth-child(3) { animation-delay: 0.2s; }
            .flag-navigation-menu.open .flag-menu-item:nth-child(4) { animation-delay: 0.25s; }
            .flag-navigation-menu.open .flag-menu-item:nth-child(5) { animation-delay: 0.3s; }

            @keyframes slideInLeft {
                from {
                    opacity: 0;
                    transform: translateX(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
        `;
        
        document.head.appendChild(style);
    }

    addMenuEventListeners() {
        const menuItems = this.menuContainer.querySelectorAll('.flag-menu-item');
        
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // 添加点击波纹效果
                this.createRippleEffect(item, e);
                
                // 延迟跳转，让动画完成
                setTimeout(() => {
                    window.location.href = item.href;
                }, 150);
                
                e.preventDefault();
            });
        });
    }

    createRippleEffect(element, event) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 215, 0, 0.4);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `;
        
        // 添加波纹动画样式
        if (!document.getElementById('ripple-animation')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    toggleMenu() {
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.isMenuOpen = true;
        this.menuContainer.classList.add('open');
        
        // 国旗保持放大状态
        const flagIcon = document.querySelector('.flag-icon');
        if (flagIcon) {
            flagIcon.style.transform = 'scale(1.1)';
        }
        
        console.log('🎌 国旗导航菜单已打开');
    }

    closeMenu() {
        this.isMenuOpen = false;
        this.menuContainer.classList.remove('open');
        
        // 国旗恢复正常大小
        const flagIcon = document.querySelector('.flag-icon');
        if (flagIcon) {
            flagIcon.style.transform = 'scale(1)';
        }
        
        console.log('🎌 国旗导航菜单已关闭');
    }
}

// 自动初始化
window.flagNavigation = new FlagNavigation();

// 导出到全局
if (typeof window !== 'undefined') {
    window.FlagNavigation = FlagNavigation;
}