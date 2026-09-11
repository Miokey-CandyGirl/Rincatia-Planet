# iDrome AI 应用 — 分步开发策略

> 基于设计方案第六版制定。本策略将原方案 6 阶段细化为 12 个开发步骤，每步含明确交付物、文件清单和验收标准。

---

## 总体策略说明

### 为什么第一步是 UI

原始方案第 29 章将 API 验证放在阶段 1。但实际开发中，**先搭 UI 骨架更高效**，原因：

1. **即时视觉反馈** — 纯静态页面可立即在浏览器预览，快速验证布局、配色、响应式
2. **Mock 数据先行** — UI 用假数据渲染，不依赖任何外部 API，零阻塞
3. **并行推进** — UI 开发期间可同步跑 API 验证脚本（设计方案第 30 章已提供），互不干扰
4. **降低风险** — 最难的部分（SSE 流式、Edge Function）推迟到 UI 稳定后，返工成本最低

### 步骤总览

| 步骤 | 名称 | 依赖 | 预估工时 | 核心交付 |
|------|------|------|---------|---------|
| 0 | API 验证（并行） | 无 | 0.5 天 | API 验证报告 |
| 1 | 项目脚手架与 UI 骨架 | 无 | 1.7 天 | 可预览静态页面 + 动效清单 + system-prompt 示例 |
| 2 | 状态管理与认证框架 | 步骤 1 | 1 天 | store.js + auth.js + 登录流程 |
| 3 | 对话核心 UI 与交互 | 步骤 2 | 2.2 天 | 完整对话界面（Mock 模式）+ Toast + 9 项快捷键 |
| 4 | DeepSeek API 对接 | 步骤 0, 3 | 2.3 天 | 真实 AI 对话 + 流式输出 + usage_logs + 熔断 + Token/网络检测 |
| 5 | 数据持久化 | 步骤 4 | 1.8 天 | 对话云端存储 + 导航面板 + 模型选择器 + 批量管理 |
| 6 | 模式切换与知识库 | 步骤 5 | 1.5 天 | 三模式 + 知识库注入 + 辅助知识库文件 |
| 7 | 深度思考与联网搜索 | 步骤 4 | 2 天 | Thinking 模式 + 百度搜索 |
| 8 | 多模态功能 | 步骤 4 | 2 天 | 图片/文件/语音 |
| 9 | PWA 与离线支持 | 步骤 5 | 1 天 | 可安装 + 离线回退 |
| 10 | 导出分享与体验优化 | 步骤 5 | 1.9 天 | 导出/分享/Onboarding/性能优化/设置面板二级功能 |
| 11 | 安全加固与测试收尾 | 全部 | 2.2 天 | 安全审查 + 37 项集成测试 + 发布 + Embedding（可选） |

> **并行说明**：步骤 7 和步骤 8 均只依赖步骤 4，可并行开发。步骤 0 与步骤 1 可并行。

**总预估：20.1 个工作日（约 4 周）**

> **工时说明**：相比初版 18.5 天的增加项 — 步骤 1（+0.2 动效清单）、步骤 3（+0.2 Toast + 快捷键扩展）、步骤 4（+0.3 熔断 + Token 警告 + 网络检测）、步骤 5（+0.3 模型选择器 + 批量管理）、步骤 10（+0.4 Onboarding/性能优化/设置面板补全）、步骤 11（+0.2 集成测试矩阵扩至 37 项）。增量来源于覆盖度分析报告中识别的 6 项部分覆盖 + 4 项未覆盖内容补充。

---

## 步骤 0：API 可行性验证（与步骤 1 并行）

**目标：** 在开发前确认所有外部 API 的实际行为，消除技术不确定性。

**执行方式：** 运行设计方案第 30 章提供的 `test/api-verification.mjs` 脚本，不阻塞 UI 开发。

### 验证清单

| 验证项 | 验证内容 | 预期结果 | 应对措施 |
|--------|---------|---------|---------|
| DeepSeek 基础对话 | `deepseek-v4-flash` 非 stream 调用 | 返回 choices[0].message.content | 若端点不同，修正 proxyUrl |
| DeepSeek 流式 SSE | `stream: true` 的 SSE 格式 | `data: {json}\n\n` 格式 | 若格式不同，修正 parseSSEChunk |
| DeepSeek Thinking | `thinking: { type: 'enabled' }` | 返回 reasoning_content + content | 若参数格式不同，修正请求体 |
| DeepSeek Vision | 发送 base64 图片 | 返回图片描述 | 若不可用，回退豆包 OCR only |
| DeepSeek Embedding | `/v1/embeddings` 端点 | 返回向量数组 | 若不可用，启用备选方案 B/C/D |
| 百度 AI 搜索 | web_search + chat/completions | 返回搜索结果 | 若不可用，回退纯 DeepSeek |
| 豆包 ASR/TTS | 语音识别与合成 | 返回文本/音频 | 确认火山引擎调用方式 |
| 豆包文档解析 | 文件解析 | 返回文本内容 | 确认支持的文件格式 |

### 交付物

- `test/api-verification.mjs` 执行结果日志
- API 验证报告（记录实际行为与文档差异，修正方案中对应代码）

### 验收标准

- [ ] 所有验证项有明确结论（通过/不通过/需调整）
- [ ] DeepSeek Embedding API 可用性已确认（决定知识库方案选型）
- [ ] 不通过的项有备选方案

---

## 步骤 1：项目脚手架与 UI 骨架

**目标：** 搭建完整的项目目录结构和静态 UI 页面，可在浏览器直接预览，所有内容用 Mock 数据。

### 1.1 创建项目目录结构

按设计方案第 10 章创建完整目录：

```
public/idrome/
├── dromai.html              # 主入口
├── css/
│   ├── main.css             # 布局/颜色/字体/CSS 变量
│   ├── chat.css             # 对话区域
│   ├── navpanel.css         # 导航面板
│   ├── settings.css         # 设置面板
│   ├── modes.css            # 模式选择卡片
│   └── print.css            # 打印样式（预留空文件）
├── js/
│   ├── app.js               # 入口（暂空 init 框架）
│   ├── store.js             # 预留
│   ├── state.js             # 预留
│   └── ...                  # 其他模块预留空文件
├── assets/
│   ├── vendor/              # 第三方库（此步先下载，详见设计方案第 22 章）
│   │   ├── supabase.min.js
│   │   ├── marked.min.js
│   │   ├── purify.min.js
│   │   ├── katex.min.js (+ katex.min.css)
│   │   └── html2canvas.min.js  # 图片导出（按需加载，详见第 32 章）
│   └── icons/               # PWA 图标（使用idrome/assets/images/idrome_logo.jpg）
├── mode/                    # 模式知识库（此步创建 system-prompt.md，辅助文件步骤 6 创建）
│   ├── general/system-prompt.md
│   ├── tian-translation/system-prompt.md
│   └── novel-culture/system-prompt.md
│   # 步骤 6 补充：tian-translation/vocabulary.md, grammar.md
│   # 步骤 6 补充：novel-culture/world-setting.md, novel.md, characters.md
└── test/
    └── mock/mockLayer.js    # Mock 层（此步创建基础框架）
```

### 1.2 编写 dromai.html 骨架

按设计方案第 4 章实现完整 HTML 结构：

- 顶部导航栏（56px）：Logo + 对话标题 + 模型选择器 + 功能按钮
- 导航面板（展开式，300px）：搜索框 + 新对话按钮 + 对话列表 + 用户区
- 主内容区：欢迎页（Logo + 欢迎语 + 模式选择卡片 + 建议问题卡片）/ 对话区
- 底部输入区（60px+）：工具按钮组 + 输入框 + 发送按钮 + 底部信息

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>iDrome — 琳凯蒂亚 AI 智能助手</title>
  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet" href="css/chat.css">
  <link rel="stylesheet" href="css/navpanel.css">
  <link rel="stylesheet" href="css/settings.css">
  <link rel="stylesheet" href="css/modes.css">
  <!-- 核心库本地优先 + CDN 回退（详见设计方案第 22 章）-->
  <link rel="stylesheet" href="assets/vendor/katex.min.css"
        onerror="this.href='https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css'">
  <script src="assets/vendor/marked.min.js"
          onerror="document.write('<script src=\'https://cdn.jsdelivr.net/npm/marked@12.0.0/marked.min.js\'><\/script>')"></script>
  <script src="assets/vendor/purify.min.js"
          onerror="document.write('<script src=\'https://cdn.jsdelivr.net/npm/dompurify@3.0.9/dist/purify.min.js\'><\/script>')"></script>
  <script src="assets/vendor/katex.min.js"
          onerror="document.write('<script src=\'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js\'><\/script>')"></script>
</head>
<body>
  <!-- 顶部导航栏 -->
  <header class="top-nav">...</header>
  <!-- 导航面板 -->
  <aside class="nav-panel">...</aside>
  <!-- 主内容区 -->
  <main class="main-content">...</main>
  <!-- 底部输入区 -->
  <footer class="input-area">...</footer>
  <script type="module" src="js/app.js"></script>
</body>
</html>
```

### 1.3 编写 CSS — 全部样式

按设计方案第 2-3 章色彩体系和第 4 章布局规格：

**main.css（核心）：**
- CSS 变量定义（设计方案第 2 章五色体系）
- 顶部导航栏样式（sticky, 56px, 白底, 底部边框）
- 主内容区 flex 布局
- 底部输入区样式
- 深色模式变量（`[data-theme="dark"]`）
- 响应式断点：`@media (max-width: 768px)` / `@media (min-width: 769px) and (max-width: 1199px)` / `@media (min-width: 1200px)`

**chat.css：**
- 消息气泡样式（用户右对齐淡蓝 / AI 左对齐浅灰）
- 代码块样式（语法高亮容器 + 复制按钮 + 语言标签）
- 思考过程折叠区域样式
- 停止生成按钮
- 消息操作按钮组（hover 显示）
- 加载动画（三个跳动点）
- 骨架屏

**navpanel.css：**
- 导航面板展开/收起动画（300ms ease-out）
- 搜索框 + 新对话按钮
- 对话列表项（时间分组、置顶、模式图标）
- 左滑操作菜单
- 用户区下拉菜单

**modes.css：**
- 模式选择卡片（三张横排，选中态高亮）

**settings.css：**
- 设置面板布局
- 主题切换、字体大小、语言选择控件
- 个人知识库上传区域

### 1.4 创建 Mock 数据与静态渲染

在 `js/app.js` 中用硬编码数据渲染 UI：

```javascript
// Mock 数据
const mockConversations = [
  { id: '1', title: '琳凯蒂亚语语法特点', mode: 'tian-translation', pinned: true, updated_at: '2026-07-10T10:00:00Z' },
  { id: '2', title: '华田历法计算方式', mode: 'general', pinned: false, updated_at: '2026-07-09T15:00:00Z' },
  { id: '3', title: '小说世界观设定讨论', mode: 'novel-culture', pinned: false, updated_at: '2026-07-01T09:00:00Z' }
]

const mockMessages = [
  { role: 'user', content: '什么是琳凯蒂亚语？' },
  { role: 'assistant', content: '琳凯蒂亚语（田语）是...' }
]
```

### 1.5 动效与微交互清单（设计方案第 8 章）

CSS 实现时需逐项覆盖以下动效和微交互，作为 CSS 验收检查清单：

**5 类过渡动效（8.1 节）：**

| 动效 | CSS 实现 | 时长 |
|------|---------|------|
| 导航面板展开/收起 | `transform: translateX` + `opacity`，从 Logo 下方展开 | 300ms ease-out |
| 消息出现 | 从下方滑入 + 淡入 | 200ms ease-out |
| 模态框/弹窗 | 缩放 + 淡入 | 200ms ease-out |
| 页面切换 | 淡入淡出 | 150ms |
| 下拉菜单 | 从上方滑入 + 淡入 | 150ms ease-out |

**8 个微交互（8.2 节）：**

| 元素 | hover | active | 其他 |
|------|-------|--------|------|
| Logo 图标 | 放大 105% | 缩小 95% | 面板展开时蓝色底部边框 |
| 发送按钮 | 放大 105% | 缩小 95% | 有内容蓝色背景+阴影，无内容灰色禁用 |
| 消息气泡 | 上浮 `translateY(-1px)` + 阴影增强 | — | — |
| 复制按钮 | — | — | 点击后 ✓ 图标，2 秒恢复 |
| 加载动画 | — | — | 三个点依次弹跳，间隔 150ms，颜色 `#2C5F8A` |
| 滚动到底部按钮 | — | — | 从底部弹入，弹性效果 |
| 功能开关按钮 | — | — | 关闭灰色 `#F5F5F5`，开启 `#E8F0FE` 边框+智慧蓝图标 |
| 语音录音按钮 | — | — | 录音时红色脉冲缩放呼吸，2s 循环 |

**4 类状态反馈（8.3 节，UI 框架在此步搭建，逻辑在步骤 3/4 完善）：**

| 反馈类型 | UI 样式 | 实现步骤 |
|---------|---------|---------|
| API 错误 | 消息气泡内错误信息 + 重试按钮 | 步骤 4.6 |
| 网络断开 | 顶部黄色横幅 `#FBBC04` + 输入框禁用 | 步骤 4（断网检测） |
| Token 耗尽 | 警告提示 + 引导切换模型 | 步骤 4 |
| 操作成功 | 底部 Toast 提示（2 秒消失，叶绿 `#5B8C5A`） | 步骤 3（Toast 组件） |

> 所有动画使用 `transform` 和 `opacity` 实现，避免触发 reflow。支持 `prefers-reduced-motion` 媒体查询减少动效。

### 1.6 创建模式知识库示例文件

按设计方案第 27.2 节提供三模式 system-prompt.md 示例：

**mode/general/system-prompt.md：**
```markdown
# version: 1

你是 iDrome AI 助手（DromAI），由华田中央大学蔚莱科技学院逐梦人工智能开发工作室开发，基于琳凯蒂亚文化体系构建。

## 你的身份
- 名称：iDrome（DromAI）
- 定位：琳凯蒂亚文化智能助手
- 开发者：华田中央大学蔚莱科技学院 逐梦人工智能开发工作室

## 你的能力
1. 日常对话：流畅、自然地回答用户各类问题
2. 知识问答：覆盖科学、文学、技术等多领域通用知识
3. 琳凯蒂亚文化：了解琳凯蒂亚语（田语）、历法、世界观等文化背景，可适度融入对话
4. 创意辅助：文案撰写、头脑风暴、内容创作
5. 个人知识库：可选择性读取用户上传的个人知识库内容，结合用户上下文回答问题

## 行为准则
- 使用简体中文回答，除非用户使用其他语言提问
- 回答准确、简洁、有条理，避免冗余
- 对不确定的信息明确说明，不编造事实
- 适度融入琳凯蒂亚文化元素，但不过度生硬
- 涉及敏感话题时保持中立、客观

请根据以上设定，友好、专业地与用户对话。
```

**mode/tian-translation/system-prompt.md：**
```markdown
# version: 1

你是琳凯蒂亚语（田语）翻译与解析专家。

## 你的能力
1. 中文 ↔ 田语双向翻译
2. 田语语法结构解析（词性、词根、时态）
3. 田语词源考据与词语演变说明
4. 田语文化背景补充

## 田语词库
[vocabulary]

## 田语语法规则
[grammar]

请根据以上知识库，准确、专业地回答用户关于田语的问题。
```

**mode/novel-culture/system-prompt.md：**
```markdown
# version: 1

你是琳凯蒂亚文化小说《光线传奇》的深度解读专家。

## 你的能力
1. 琳凯蒂亚世界观设定解析
2. 《光线传奇》小说情节、人物、主题分析
3. 琳凯蒂亚文化元素（历法、社会制度、信仰体系）解读
4. 小说创作背景与灵感来源说明

## 世界观设定
[worldSetting]

## 小说内容概要
[novel]

## 人物关系表
[characters]

请根据以上知识库，深入、专业地回答用户关于琳凯蒂亚小说文化的问题。
```

> **说明**：`# version: 1` 为版本号标签，`KnowledgeLoader.parseVersion()` 解析首行后缓存。田语模式含 `[vocabulary]`、`[grammar]` 占位符；小说模式含 `[worldSetting]`、`[novel]`、`[characters]` 占位符。普通模式不含占位符。占位符对应的辅助知识库文件（vocabulary.md 等）在步骤 6 创建。

### 交付物

- 完整目录结构
- `dromai.html` 完整 HTML 骨架
- 6 个 CSS 文件（全部样式，含响应式 + 深色模式）
- Mock 数据驱动的静态页面
- 3 个 system-prompt.md 示例文件（general/tian-translation/novel-culture）
- `assets/vendor/` 核心第三方库已下载（含 html2canvas）

### 验收标准

- [ ] 浏览器打开 `dromai.html` 可看到完整布局
- [ ] 桌面端三栏布局正确（导航栏 + 主内容 + 输入区）
- [ ] 移动端响应式布局正确（导航面板全屏覆盖）
- [ ] 深色模式切换正常（CSS 变量切换）
- [ ] 欢迎页显示 Logo + 欢迎语 + 模式卡片 + 建议问题
- [ ] 导航面板可展开/收起（点击 Logo 触发）
- [ ] 对话列表用 Mock 数据正确渲染（时间分组、模式图标）
- [ ] 输入框工具按钮组布局正确

---

## 步骤 2：状态管理与认证框架

**目标：** 实现 Proxy 响应式 Store 和 Supabase 认证对接，完成登录流程。

### 2.1 实现 store.js + state.js

按设计方案第 31 章实现：

**store.js：**
- `createStore(initialState)` 函数
- `makeReactive(obj)` 递归 Proxy（含 `__isReactive` 标记）
- `get` 拦截器：对象/数组递归代理
- `set` 拦截器：值变化时通知订阅者
- `subscribe(fn)` 订阅方法

> **数组操作注意事项**（设计方案第 31.3 节）：Proxy 的 `set` 拦截器可捕获 `push`/`splice` 等方法调用（因内部修改了 `length`），但为更可靠的响应式触发，**建议使用展开赋值模式**：`state.conversations = [...state.conversations, newConv]` 而非 `state.conversations.push(newConv)`。这确保所有订阅者收到明确的状态变更通知。

**state.js：**
- 导入 `createStore`
- 定义全部状态字段（按第 31.4 节）：
  - `currentUser`, `conversations`, `currentConversationId`, `messages`
  - `deepThinkingEnabled`, `webSearchEnabled`
  - `currentMode`, `modeLocked`
  - `knowledgeCharLimit`, `knowledgeBaseFiles`
  - `navPanelOpen`, `isGenerating`, `inputContent`
  - `theme`, `fontSize`

### 2.2 实现 auth.js

按设计方案第 14 章实现：

- `checkAuth()` — 从 localStorage 读取 `rincatia_user`，失败则尝试 Supabase `getSession()`
- `showLoginPage()` — 显示登录引导页（Logo + 说明 + 登录/注册按钮）
- `loginRedirect()` — 跳转主网站登录页
- 跨标签页同步：`window.addEventListener('storage', ...)` 监听 `rincatia_user` 变化
- `logout()` — 清除 localStorage + Supabase session + SW 缓存

### 2.3 实现 app.js 入口初始化

按设计方案第 31.5 节实现：

```javascript
import { state, subscribe } from './state.js'
import { checkAuth, showLoginPage } from './auth.js'

async function init() {
  // 1. 检查登录
  const user = await checkAuth()
  if (!user) { showLoginPage(); return }
  state.currentUser = user

  // 2. 初始化 UI（导航面板、输入框）
  initNavPanel()
  initInputArea()

  // 3. 订阅状态变化 → 更新 UI
  subscribe((target, key, newValue) => {
    if (key === 'navPanelOpen') toggleNavPanelUI(newValue)
    if (key === 'theme') applyTheme(newValue)
    if (key === 'isGenerating') updateSendButton(newValue)
  })
}

init()
```

### 2.4 实现 navpanel.js 基础交互

- Logo 点击 → `state.navPanelOpen = !state.navPanelOpen`
- 面板外点击 / Esc 键 → `state.navPanelOpen = false`
- 面板展开/收起动画（CSS transition + class 切换）
- 用户头像下拉菜单

> **禁用 hover 触发**（设计方案第 4.1 节）：导航面板**仅通过点击展开/收起，不使用 hover 触发**。避免对话过程中鼠标移到左上角时面板意外展开干扰阅读。确保 CSS 中不包含 `:hover` 展开样式，所有展开/收起状态完全由 `state.navPanelOpen` 控制。

### 2.5 实现 settings.js 基础框架

- 主题切换（浅色/深色/跟随系统）→ 写入 `state.theme` + `data-theme` 属性
- 字体大小调节
- 语言切换（预留 i18n 接口）

### 交付物

- `store.js` — Proxy 响应式 Store（可单元测试）
- `state.js` — 全局状态定义
- `auth.js` — 认证与会话管理
- `app.js` — 完整初始化流程
- `navpanel.js` — 导航面板交互
- `settings.js` — 设置面板基础

### 验收标准

- [ ] `store.js` 的 `subscribe` 能捕获 state 变更（含嵌套属性）
- [ ] 未登录时显示登录引导页
- [ ] 登录后显示用户信息（头像 + 昵称）
- [ ] 导航面板点击展开/收起正常
- [ ] 深色/浅色主题切换正常
- [ ] 跨标签页登录状态同步正常

---

## 步骤 3：对话核心 UI 与交互（Mock 模式）

**目标：** 完整的对话界面交互，使用 Mock 层模拟 AI 回复，不依赖真实 API。

### 3.1 实现 input.js — 输入框

- 多行文本输入，自动调整高度（60px → 120px）
- Enter 发送，Shift+Enter 换行
- 字数统计（`128 / 4000`，超限红色）
- 发送按钮状态（空内容灰色 / 有内容蓝色）
- 工具按钮组（🧠 深度思考 / 🌐 联网搜索 / 📎 附件 / 🎤 语音）开关交互

### 3.2 实现 chat.js — 对话渲染（Mock 模式）

- `sendMessage()` — 用户消息添加到 `state.messages`，触发 Mock AI 回复
- `renderMessages()` — 根据 `state.messages` 渲染消息气泡列表
- Markdown 渲染：`marked.parse()` + `DOMPurify.sanitize()`
- 代码块语法高亮 + 复制按钮
- LaTeX 公式渲染（KaTeX）
- 消息操作按钮组（hover 显示：复制 / 重新生成 / 点赞 / 踩 / 删除）
- 智能滚动控制（用户上滚暂停自动滚底，500ms 后恢复）
- "↓ 回到底部"浮动按钮

> **步骤 3 的 Mock 调用方式**：此步骤直接导入 `mockChat` 调用（步骤 4 将改为通过 `apiRouter.chat()` 统一入口，Mock 在 apiRouter 层注入）：

```javascript
// 步骤 3：直接调用 Mock（步骤 4.4 将改为 apiRouter.chat()）
import { mockChat } from '../test/mock/mockLayer.js'

async function sendMessage() {
  const content = state.inputContent.trim()
  if (!content) return
  state.messages = [...state.messages, { role: 'user', content }]
  state.inputContent = ''
  state.isLoading = true

  // 添加 AI 占位消息
  state.messages = [...state.messages, { role: 'assistant', content: '' }]

  await mockChat(state.messages, {
    onChunk: (delta, full) => {
      state.messages[state.messages.length - 1].content = full
    }
  })
  state.isLoading = false
}
```

### 3.3 实现 Mock 层

在 `test/mock/mockLayer.js` 中实现模拟 AI 回复（设计方案第 33.1 节，使用 `ReadableStream` 模拟 SSE 流）：

```javascript
// test/mock/mockLayer.js — API Mock 层
const isDev = location.hostname === 'localhost' || location.search.includes('mock=true')

// 预录制的 SSE 流响应
const MOCK_SSE_RESPONSES = {
  'normal': [
    'data: {"choices":[{"delta":{"content":"你好"}}]}\n\n',
    'data: {"choices":[{"delta":{"content":"！我"}}]}\n\n',
    'data: {"choices":[{"delta":{"content":"是 DromAI"}}]}\n\n',
    'data: {"choices":[{"delta":{"content":"助手"}}]}\n\n',
    'data: {"choices":[],"usage":{"prompt_tokens":50,"completion_tokens":20,"total_tokens":70}}\n\n',
    'data: [DONE]\n\n'
  ],
  'thinking': [
    'data: {"choices":[{"delta":{"reasoning_content":"用户在问"}}]}\n\n',
    'data: {"choices":[{"delta":{"reasoning_content":"基础问题"}}]}\n\n',
    'data: {"choices":[{"delta":{"content":"1+1=2"}}]}\n\n',
    'data: {"choices":[],"usage":{"prompt_tokens":50,"completion_tokens":30,"total_tokens":80}}\n\n',
    'data: [DONE]\n\n'
  ]
}

// 模拟 SSE 流式响应
export function mockSSEResponse(type = 'normal') {
  const chunks = MOCK_SSE_RESPONSES[type]
  return new ReadableStream({
    async start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(new TextEncoder().encode(chunk))
        await new Promise(r => setTimeout(r, 100))  // 模拟延迟
      }
      controller.close()
    }
  })
}

// Mock 对话调用：在 apiRouter.chat() 入口处调用
export async function mockChat(messages, options = {}) {
  const type = options.thinking?.type === 'enabled' ? 'thinking' : 'normal'
  const stream = mockSSEResponse(type)
  const reader = stream.getReader()
  const decoder = new TextDecoder()
  let fullContent = ''
  let fullReasoning = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const text = decoder.decode(value, { stream: true })
    for (const line of text.split('\n')) {
      if (!line.startsWith('data: ') || line === 'data: [DONE]') continue
      const data = JSON.parse(line.slice(6))
      if (data.choices?.[0]?.delta?.reasoning_content) {
        fullReasoning += data.choices[0].delta.reasoning_content
        options.onReasoningChunk?.(data.choices[0].delta.reasoning_content, fullReasoning)
      }
      if (data.choices?.[0]?.delta?.content) {
        fullContent += data.choices[0].delta.content
        options.onChunk?.(data.choices[0].delta.content, fullContent)
        options.onContentChunk?.(data.choices[0].delta.content, fullContent)
      }
    }
  }
  return { content: fullContent }
}

export { isDev }
```

> **说明**：此 Mock 层返回标准 SSE 格式数据（`data: {json}\n\n`），与真实 DeepSeek API 响应格式一致。步骤 4 接入真实 API 时，仅需在 `apiRouter.chat()` 方法开头添加 `if (isDev) return mockChat(messages, options)` 即可切换。

### 3.4 实现欢迎页交互

- 模式选择卡片点击切换（单选互斥）
- 建议问题卡片点击 → 填充输入框并发送
- 模式选定后发送首条消息 → 锁定模式

### 3.5 实现键盘快捷键

按设计方案第 4.7 节实现全部 9 个快捷键：

| 快捷键 | 功能 | 触发条件 |
|--------|------|---------|
| `Enter` | 发送消息 | 输入框聚焦时 |
| `Shift + Enter` | 换行 | 输入框内 |
| `Esc` | 关闭导航面板 / 弹窗 | 全局 |
| `Ctrl + K` | 聚焦搜索框 | 导航面板展开时 |
| `Ctrl + N` | 新建对话 | 全局 |
| `Ctrl + /` | 显示快捷键帮助弹窗 | 全局（弹窗内容读取下方配置） |
| `Ctrl + Shift + C` | 复制最后一条 AI 回复 | 全局 |
| `↑` / `↓` | 消息列表上下滚动 | 对话区聚焦时 |
| `Tab` | 在输入框按钮间切换焦点 | 输入框聚焦时 |

> `Ctrl + /` 的快捷键帮助弹窗在步骤 10.6 设置面板完善中实现，此步骤先注册快捷键并预留弹窗占位。

### 3.6 实现通用 Toast 组件（设计方案第 8.3 节）

实现 `showToast(message, type)` 通用组件，供复制成功、删除成功等操作调用：

```javascript
// js/toast.js — 通用 Toast 提示
export function showToast(message, type = 'success') {
  const toast = document.createElement('div')
  toast.className = `toast toast-${type}`
  toast.textContent = message
  document.body.appendChild(toast)

  // 触发动画
  requestAnimationFrame(() => toast.classList.add('toast-show'))

  // 2 秒后自动消失
  setTimeout(() => {
    toast.classList.remove('toast-show')
    setTimeout(() => toast.remove(), 300)
  }, 2000)
}
```

**Toast 样式（添加到 main.css）：**
- `toast-success`：底部弹出，叶绿 `#5B8C5A` 背景，白色文字
- `toast-error`：底部弹出，红色 `#EA4335` 背景
- `toast-warning`：底部弹出，黄色 `#FBBC04` 背景
- 动画：从底部滑入 + 淡入 300ms，消失时淡出 300ms

> 此组件在步骤 3 实现后，步骤 4-10 中的复制成功、删除成功、分享链接复制等操作均调用 `showToast()`。

### 交付物

- `input.js` — 输入框完整交互
- `chat.js` — 对话渲染（Mock 模式）
- `test/mock/mockLayer.js` — Mock 响应层
- 完整可交互的对话界面（Mock 驱动）

### 验收标准

- [ ] 输入消息发送后显示用户气泡
- [ ] Mock AI 回复以打字机效果流式显示
- [ ] Markdown / 代码块 / LaTeX 正确渲染
- [ ] 消息操作按钮组 hover 显示正常
- [ ] 模式选择卡片切换正常
- [ ] 建议问题卡片点击发送正常
- [ ] 键盘快捷键全部可用
- [ ] 智能滚动控制正常

---

## 步骤 4：DeepSeek API 对接

**目标：** 替换 Mock 层为真实 DeepSeek API，实现流式对话。

**前置条件：** 步骤 0 的 API 验证已完成，确认 DeepSeek API 实际行为。

### 4.0 创建 usage_logs 表（chat-proxy 依赖）

> chat-proxy Edge Function 需要 `usage_logs` 表记录用量（步骤 4.1 第 7 点），因此此表须在部署 Edge Function 之前创建。步骤 5 的 SQL 中不再重复创建。

```sql
-- usage_logs 表（设计方案第 13 章）
CREATE TABLE usage_logs (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_id uuid REFERENCES conversations(id) ON DELETE SET NULL,
  model text,
  prompt_tokens int,
  completion_tokens int,
  total_tokens int,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_usage_logs_user_month ON usage_logs(user_id, date_trunc('month', created_at));
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own usage logs" ON usage_logs FOR SELECT USING (auth.uid() = user_id);
-- INSERT 由 Edge Function（service_role）执行，不需要前端写入策略
```

### 4.1 部署 chat-proxy Edge Function

按设计方案第 23 章实现 Supabase Edge Function：

**核心逻辑：**
1. 从请求中提取 `messages` 和 `options`
2. 验证 JWT（`supabase.auth.getUser()`）
3. 检查月度预算（`getMonthlyUsage()` → 超限返回 429）
4. 注入检测（三层防护：正则匹配 → AI 预检 → 防护指令追加）
5. 代理请求到 DeepSeek API（使用环境变量 `DEEPSEEK_API_KEY`）
6. 流式透传 SSE 响应
7. 使用 `TransformStream` 拦截 usage 字段，记录到 `usage_logs` 表

**部署方式：**
```bash
supabase functions deploy chat-proxy --no-verify-jwt
```

**环境变量配置：**
```
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
DEEPSEEK_API_KEY=sk-xxxxx
DEEPSEEK_MODEL=deepseek-v4-flash
MONTHLY_BUDGET_DEFAULT=10.0
```

### 4.2 实现 deepseek.js — API 封装

按设计方案第 17 章实现：

- `DeepSeekAPI` 类
- `getAuthHeaders()` — 从 Supabase session 获取 JWT
- `chat(messages, options)` — 非流式对话
- `chatStream(messages, onChunk, onDone, onError, options)` — 流式对话（SSE 解析）
- `chatWithThinking(messages, onReasoningChunk, onContentChunk, onDone, onError, options)` — 深度思考模式
- `APIError` 错误类

**SSE 解析关键逻辑：**
- `TextDecoder` + `{ stream: true }` 处理 UTF-8 多字节字符
- buffer 分包：`buffer.split('\n')` + 保留最后一个不完整行
- 流结束时 flush 残留缓冲区
- 双参数回调：`(delta, fullContent)` 支持增量追加渲染

### 4.3 实现 apiRouter.js — 统一路由

- `APIRouter` 单例对象
- `chat(messages, callbacks, options)` — 统一入口，根据 options 选择 chat / chatStream / chatWithThinking
- 健康检查 + 自动回退（DeepSeek → 豆包）
- 开发环境 Mock 拦截：在 `chat()` 方法**入口处**注入，不覆盖 `window.fetch`（设计方案第 33.1 节）

```javascript
// apiRouter.js — chat 方法开头添加 Mock 拦截
import { isDev, mockChat } from '../test/mock/mockLayer.js'

class APIRouter {
  // ... 其他方法不变

  async chat(messages, options = {}) {
    // 开发环境：Mock 拦截（不调用真实 Edge Function，不影响 Supabase SDK）
    if (isDev) {
      return mockChat(messages, options)
    }

    if (!this.deepseek) {
      throw new Error('APIRouter 未初始化，请先调用 initialize()')
    }
    // ... 后续正常调用逻辑不变
  }
}
```

> **注入策略说明**（设计方案第 33.1 节）：Mock 在 **API Router 层**注入而非全局覆盖 `window.fetch`，避免拦截 Supabase SDK 内部的 fetch 调用（认证、数据操作），降低边界情况风险。步骤 3 的 `mockChatStream` 需改造为返回 `{ content }` 的 `mockChat()` 函数，内部使用 `ReadableStream` 模拟 SSE 流。

**健康检查与熔断机制（设计方案第 23 章）：**

- **首次健康检查**：`initialize()` 时对 DeepSeek 和豆包分别调用 `healthCheck(provider)`，标记可用状态
- **失败计数熔断**：每次 API 调用失败时 `failCount++`，连续 3 次失败标记该服务为不可用，自动切换到备用服务
- **定时恢复探测**：后台每 5 分钟 `setInterval` 重试不可用服务，成功后 `failCount = 0` 并恢复可用状态
- **能力检测**：`healthCheck()` 同时检测服务能力（支持流式？支持 Vision？支持 Thinking？），结果存入 `providerCapabilities`

### 4.4 改造 chat.js — 接入真实 API

将步骤 3 的 Mock 调用替换为 `apiRouter.chat()`：

```javascript
// 发送消息
async function sendMessage() {
  const content = state.inputContent.trim()
  if (!content) return

  // 添加用户消息
  state.messages = [...state.messages, { role: 'user', content }]
  state.inputContent = ''
  state.isGenerating = true

  // 添加 AI 消息占位
  const aiMessage = { role: 'assistant', content: '', reasoning: '' }
  state.messages = [...state.messages, aiMessage]

  // 调用 API
  await apiRouter.chat(
    state.messages.filter(m => !m.expired),
    {
      onChunk: (delta, full) => { /* 追加到 aiMessage.content */ },
      onReasoningChunk: (delta, full) => { /* 追加到 aiMessage.reasoning */ },
      onDone: (full) => { state.isGenerating = false },
      onError: (err) => { /* 错误处理 */ }
    },
    {
      stream: true,
      thinking: state.deepThinkingEnabled ? { type: 'enabled' } : undefined
    }
  )
}
```

### 4.5 实现停止生成

- 发送时创建 `AbortController`
- "停止生成"按钮 → `controller.abort()`
- 中断后保留已生成内容

### 4.6 实现 errorHandler.js

- `APIError` 统一错误分类（network / auth / budget / rate_limit / server）
- 指数退避重试（max 3 次，base 1s）
- 错误 UI 渲染（消息气泡内显示错误 + 重试按钮）

### 4.7 实现 usageTracker.js

- 前端 Token 估算（js-tiktoken cl100k_base）
- 上下文窗口管理（500K/800K/950K 三级阈值）
- 上下文进度条 UI
- **Token 耗尽警告**（设计方案第 8.3 节）：当上下文窗口使用超过 90% 时，显示警告提示并引导用户切换模型或清理上下文

### 4.8 实现网络状态检测（设计方案第 8.3 节）

```javascript
// js/network.js — 网络状态检测
export function initNetworkMonitor() {
  const banner = document.getElementById('network-banner')

  function updateStatus() {
    if (!navigator.onLine) {
      banner.style.display = 'block'
      banner.textContent = '⚠️ 网络已断开，请检查网络连接'
      document.querySelector('.input-area').classList.add('disabled')
    } else {
      banner.style.display = 'none'
      document.querySelector('.input-area').classList.remove('disabled')
    }
  }

  window.addEventListener('online', updateStatus)
  window.addEventListener('offline', updateStatus)
  updateStatus()  // 初始检查
}
```

- 监听 `online` / `offline` 事件
- 断网时顶部显示黄色横幅 `#FBBC04` + 输入框禁用
- 恢复网络时隐藏横幅 + 恢复输入框
- 步骤 9 的离线写入队列复用此组件的横幅 UI

### 交付物

- `supabase/functions/v1/chat-proxy/` — Edge Function
- `deepseek.js` — DeepSeek API 封装
- `apiRouter.js` — 统一路由
- `errorHandler.js` — 错误处理
- `usageTracker.js` — 用量追踪
- 真实 AI 对话功能

### 验收标准

- [ ] 发送消息能收到 DeepSeek 真实回复
- [ ] 流式打字机效果正常
- [ ] 停止生成按钮可中断流式响应
- [ ] 网络错误时显示错误信息 + 重试按钮
- [ ] 月度预算超限时返回 429 并提示
- [ ] Token 估算和上下文进度条显示正常
- [ ] 开发环境 Mock 层仍可切换使用

---

## 步骤 5：数据持久化

**目标：** 对话数据云端存储，导航面板显示真实对话列表。

### 5.1 创建数据库表

按设计方案第 8/13 章执行 SQL（全部 FK 统一为 `auth.users(id)`）：

```sql
-- conversations 表
CREATE TABLE conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text DEFAULT '新对话',
  model text DEFAULT 'deepseek-v4-flash',
  model_version text,
  mode text DEFAULT 'general',
  pinned boolean DEFAULT false,
  archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_updated_at ON conversations(updated_at DESC);
CREATE INDEX idx_conversations_archived ON conversations(user_id, archived);
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own conversations" ON conversations FOR ALL USING (auth.uid() = user_id);

-- messages 表
CREATE TABLE messages (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  role text,
  content text,
  expired boolean DEFAULT false,
  version integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id, created_at);
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own messages" ON messages FOR ALL USING (
  auth.uid() = (SELECT user_id FROM conversations WHERE id = messages.conversation_id)
);

-- usage_logs 表已在步骤 4.0 创建（chat-proxy 依赖），此处不再重复
-- 参见步骤 4.0 的 SQL 定义
```

### 5.2 实现 conversations.js — 对话管理

- `createConversation(mode)` — 插入 conversations 表，返回新对话
- `loadConversations(page=0)` — 查询用户对话列表，按 `updated_at DESC` 排序
- `deleteConversation(id)` — 删除对话（CASCADE 删除消息）
- `renameConversation(id, title)` — 更新标题
- `togglePin(id, pinned)` — 切换置顶
- `toggleArchive(id, archived)` — 切换归档
- `generateTitle(firstMessage)` — AI 自动生成标题

> **分页策略**（设计方案第 13.4 节）：Supabase `.select('*')` 默认 limit=1000 行，超出时数据会被静默截断。对话列表和消息列表必须使用 `.range(from, to)` 分页加载：
> - **对话列表**：首次加载前 20 条（`.range(0, 19)`），滚动到底部时加载下一页（`.range(20, 39)`），以此类推
> - **消息列表**：单次加载 100 条（`.range(0, 99)`），历史消息按需加载
> - **超过 1000 行的批量获取**：使用循环 `.range(from, from + 999)` 分批获取，直到返回数据少于 1000 条

### 5.3 改造 chat.js — 消息持久化

- 发送消息时先 `createConversation`（首次）
- 每条消息 INSERT 到 messages 表
- AI 回复完成后 UPDATE content
- 消息编辑 → UPDATE content + version+1 + 后续消息 expired=true

### 5.4 实现导航面板对话列表

- 从 Supabase 加载对话列表
- 时间分组（今天 / 昨天 / 本周 / 更早）
- 置顶对话单独分组
- 归档对话单独分组
- 模式图标显示（🌾 / 📖 / 📚）
- 左滑操作菜单（删除 / 重命名 / 归档）
- 点击切换对话 → 加载该对话的消息

### 5.5 实现对话搜索

- 搜索模式切换（🔍 搜标题 / 📝 搜消息内容）
- 消息内容搜索：Supabase `ilike` 查询 + 片段提取 + 高亮

### 5.6 实现消息编辑与重新生成

- 用户消息编辑 → 标记后续消息 expired → 重新发送
- AI 消息重新生成 → 删除原回复 → 重新调用 API
- 过期消息虚线边框 + "内容已过期"标记

### 5.7 实现批量管理（多选删除）（设计方案第 5.1 节）

- 导航面板增加"多选"模式按钮（checkbox 图标）
- 进入多选模式后对话列表项显示 checkbox
- 底部显示批量操作栏：全选 / 删除 / 归档 / 取消
- 批量删除需确认弹窗（显示选中数量）
- 批量操作通过 Supabase `in()` 查询一次性删除

### 5.8 实现模型选择器与参数面板（设计方案第 5.3 节）

**模型选择器（顶部导航栏）：**
- 下拉框从 `apiRouter.availableModels` 动态加载
- 支持模型：DeepSeek V4-Flash / DeepSeek V4 / DeepSeek R1
- 切换模型时更新 `state.currentModel` 并存入 `conversations.model` 字段

**参数面板（设置面板中）：**
- 温度参数滑块：0.0 ~ 2.0，步进 0.1
- 最大 Token 数输入框：256 ~ 8192
- 参数值存储到 `localStorage('idrome_model_params')`
- 系统提示词自定义（高级功能，可选）：文本域编辑，存储到 `localStorage`

**上下文窗口显示（设计方案第 5.3 节）：**
- 已用 / 总计 Token 数实时显示在输入框上方
- 调用 `usageTracker.estimateTokens()` 估算

### 交付物

- 数据库 3 张表 + RLS 策略
- `conversations.js` — 对话 CRUD
- 改造后的 `chat.js` — 消息持久化
- 导航面板真实数据（含批量管理）
- 对话搜索功能
- 模型选择器 + 参数面板

### 验收标准

- [ ] 新建对话写入 Supabase，导航面板显示
- [ ] 发送消息写入 messages 表
- [ ] 切换对话加载对应消息
- [ ] 对话重命名 / 删除 / 置顶 / 归档正常
- [ ] AI 自动生成对话标题
- [ ] 消息编辑 + 过期标记正常
- [ ] 消息搜索（标题 + 内容）正常
- [ ] 刷新页面后对话历史保留
- [ ] 批量多选删除正常
- [ ] 模型选择器可切换模型
- [ ] 温度/Token 参数调节生效

---

## 步骤 6：模式切换与知识库

**目标：** 三模式切换系统 + 个人知识库上传与注入。

### 6.1 创建辅助知识库文件 + 实现 knowledgeLoader.js

**创建辅助知识库文件**（步骤 1.5 已创建三个模式的 system-prompt.md，此处创建占位符对应的辅助文件）：

```
mode/
├── general/
│   └── system-prompt.md          # 步骤 1.5 已创建
├── tian-translation/
│   ├── system-prompt.md          # 步骤 1.5 已创建
│   ├── vocabulary.md             # 田语词库（占位符 [vocabulary] 替换内容）
│   └── grammar.md               # 田语语法规则（占位符 [grammar] 替换内容）
└── novel-culture/
    ├── system-prompt.md          # 步骤 1.5 已创建
    ├── world-setting.md          # 世界观设定（占位符 [worldSetting] 替换内容）
    ├── novel.md                  # 小说内容概要（占位符 [novel] 替换内容）
    └── characters.md             # 人物关系表（占位符 [characters] 替换内容）
```

> 辅助知识库文件内容从项目现有的琳凯蒂亚语以及世界观资料中整理提取。文件位置为consultation/现代琳凯蒂亚语 v26.5.docx以及consultation/Worldview.txt。

**实现 knowledgeLoader.js**（设计方案第 28 章）：

- `loadKnowledge(mode)` — 从 `mode/{mode}/` 加载 system-prompt.md + 辅助文件，替换占位符
- 占位符替换：`[vocabulary]` → `mode/tian-translation/vocabulary.md` 内容，依次类推
- 版本号解析（`# version: N`）
- 版本化缓存（localStorage `idrome_mode_${mode}_v${version}`）
- 热更新检测（版本号变化时重新加载）
- `refresh()` 方法 — 供设置面板"🔄 刷新知识库"按钮调用

### 6.2 实现模式切换完整逻辑

- 欢迎页模式卡片选择 → `state.currentMode = mode`
- 首次发送消息 → `state.modeLocked = true`
- 发送消息时加载对应 system-prompt.md + 知识库
- 系统提示词注入到 messages 数组开头

### 6.3 配置 Supabase Storage

- 创建 `user_knowledge_base` 存储桶
- Storage RLS 策略（用户只能访问 `/{user_id}/` 路径）

### 6.4 创建 knowledge_base_files 表

```sql
CREATE TABLE knowledge_base_files (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name text,
  file_size bigint,
  file_path text,
  file_type text,
  extracted_text text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, file_name)
);
CREATE INDEX idx_kb_files_user_id ON knowledge_base_files(user_id);
ALTER TABLE knowledge_base_files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own kb files" ON knowledge_base_files FOR ALL USING (auth.uid() = user_id);
-- file-proxy Edge Function 使用 service_role 写入 extracted_text 等字段（绕过 RLS）
```

> **RLS 说明**（设计方案第 13 章）：`FOR ALL` 策略允许用户管理自己的文件记录。file-proxy Edge Function 在解析文件后更新 `extracted_text` 字段时使用 service_role 密钥（绕过 RLS），因为解析发生在服务端、用户 JWT 可能已过期。`knowledge_base_chunks` 表的 INSERT/UPDATE 同样由 Edge Function service_role 执行（见步骤 11.7）。

### 6.5 部署 file-proxy Edge Function

- 接收上传文件 → 存储到 Storage
- 调用豆包文档解析 API → 提取文本
- INSERT 到 knowledge_base_files 表（service_role 绕过 RLS）
- MIME 类型校验 + PII 检测

### 6.6 实现知识库上传 UI

在设置面板中：
- 文件上传区域（拖拽 + 点击选择）
- 支持格式提示
- 上传进度条
- 已上传文件列表（文件名 + 大小 + 删除按钮）
- 知识库字符上限滑块（2000-10000，默认 3000）

### 6.7 实现知识库注入逻辑

- 普通模式对话时，从 knowledge_base_files 表加载用户知识库
- 拼接 extracted_text，截断到 `knowledgeCharLimit`
- 注入到系统提示词中

> **知识库更新与缓存**（设计方案第 28.7 节）：
> - 用户上传新文件后，自动调用 `KnowledgeLoader.clearCache()` 清除缓存
> - 下次发送消息时重新加载知识库内容（含新上传文件）
> - 系统设置面板中提供"🔄 刷新知识库"按钮，手动触发 `KnowledgeLoader.refresh()` 重新加载
> - 删除已上传文件后同样清除缓存，确保下次注入时不包含已删除文件内容

### 交付物

- `knowledgeLoader.js` — 模式知识库加载器
- `knowledge_base_files` 表 + Storage 配置
- `file-proxy` Edge Function
- 知识库上传 UI
- 三模式切换完整逻辑

### 验收标准

- [ ] 三种模式可正常切换，发送消息后锁定
- [ ] 模式知识库正确加载（版本缓存生效）
- [ ] 知识库文件可上传到 Supabase Storage
- [ ] 文件内容被解析并存储
- [ ] 普通模式对话时知识库内容被注入
- [ ] 知识库字符上限可调节
- [ ] 已上传文件可删除

---

## 步骤 7：深度思考与联网搜索

**目标：** Thinking 模式展示推理链 + 百度 AI 搜索集成。

### 7.1 完善深度思考 UI 与渲染

- 深度思考开关（🧠 按钮）切换 `state.deepThinkingEnabled`
- Thinking 模式时 AI 消息分两个区域：
  - 折叠的"思考过程"区域（`reasoning_content`，默认折叠，斜体灰色）
  - 主体回答区域（`content`）
- 增量追加渲染（`insertAdjacentText` 而非 `innerHTML` 替换）
- 基本功能在前几步已实现，本步骤对该功能进行检查。
- 确保思考文本准确存入messages表中，确保文本正确排序。

### 7.2 部署 search-proxy Edge Function

按设计方案第 19 章实现：

- `shouldSearch(text)` — 关键词触发判断
- 模式一：百度 AI 搜索 `/v2/ai_search/chat/completions`（搜索 + AI 一体化）
- 模式二：百度 web_search + DeepSeek 整合（默认）
- 搜索失败 → 降级为纯 DeepSeek 对话
- SSE 状态事件通知前端搜索结果

### 7.3 实现 search.js — 前端搜索

- 联网搜索开关（🌐 按钮）切换 `state.webSearchEnabled`
- 搜索状态 UI（"正在搜索..." → "搜索完成 N 条结果"）
- 搜索结果引用标注（AI 回答中标注来源链接）
- 搜索失败降级提示

### 7.4 改造 apiRouter.js

- 联网搜索开启时路由到 `search-proxy`
- 搜索 SSE 状态事件监听
- 搜索结果合并到对话上下文

### 交付物

- 深度思考完整 UI 与渲染
- `search-proxy` Edge Function
- `search.js` — 前端搜索模块
- 改造后的 `apiRouter.js`

### 验收标准

- [ ] 深度思考开关可切换
- [ ] Thinking 模式返回 reasoning_content + content
- [ ] 思考过程可折叠/展开
- [ ] 联网搜索开关可切换
- [ ] 搜索结果正确整合到 AI 回答
- [ ] 搜索失败时降级为普通对话
- [ ] 搜索状态 UI 提示正常

---

## 步骤 8：多模态功能（全面接入豆包服务）

**目标：** 接入Doubao-Seed-2.1模型，实现图片识别、文件解析、语音输入与合成。
参考资料如下：
能力模块	归属服务	官方文档地址
文本大模型对话	火山方舟 Ark	https://www.volcengine.com/docs/82379/1494384火山引擎
图片识图 / OCR 多模态	火山方舟 Ark	https://www.volcengine.com/docs/82379/1362931火山引擎
PDF/Word/TXT 文件解析	火山方舟 Ark	https://www.volcengine.com/docs/82379/1873424火山引擎
文字转语音 TTS 朗读	豆包语音 OpenSpeech	https://www.volcengine.com/docs/6561/1756902火山引擎
音频文件转文字 ASR	豆包语音 OpenSpeech	https://www.volcengine.com/docs/6561/1354869火山引擎

### 8.1 实现 vision.js — 图像识别

- 文件选择 → 图片压缩（Canvas 最长边 2048px）→ Base64 编码
- 发送到 chat-proxy Edge Function（豆包 OCR）
- 图片消息渲染（缩略图 + 点击放大）
- 上传进度条 + AbortController 取消

### 8.2 实现 fileReader.js — 文件解析

- 支持 15 类格式（TXT/PDF/Word/Excel/PPT/EPUB/代码/图片 等）
- 调用 file-proxy Edge Function（豆包文档解析优先）
- 回退：PDF.js（PDF）/ SheetJS（Excel）/ 前端读取（TXT/代码）
- 文件名 XSS 过滤（DOMPurify.sanitize）
- 解析后文本注入到用户消息中

### 8.3 实现 voice.js — 语音输入与合成

**ASR（语音识别）：**
- `startRecording()` — MediaRecorder 录音（16kHz, 单声道）
- MIME 检测（webm/opus → mp4 → ogg 兼容）
- `convertToPCM(blob)` — AudioContext + OfflineAudioContext 重采样
- 调用 voice-proxy Edge Function（豆包 ASR）
- 识别结果填充到输入框

**TTS（语音合成）：**
- 调用 voice-proxy Edge Function（豆包 TTS）
- 音频缓存（相同内容不重复请求）
- 播放控制（播放/暂停/停止）

### 8.4 部署 voice-proxy Edge Function

- ASR：接收 Base64 PCM → 调用豆包 ASR → 返回文本
- TTS：接收文本 → 调用豆包 TTS → 返回 Base64 音频

### 8.5 输入框工具按钮对接

- 附件按钮 → 文件选择器（图片/文档）
- 语音按钮 → 开始/停止录音
- 朗读按钮 → TTS 播放当前对话最后一条 AI 回复

### 8.6 实现接入豆包大模型对话API，完成系统设置中AI模型的Doubao-Seed-2.1的接入。

- 完成豆包对话大模型的接入
- 确保不影响已经接入的deepseek-v4-flash模型以及对话。
- 当用户在系统设置中将模型切换为Doubao-Seed-2.1时，确保正常对接豆包API且对话正常。
- 为该模型设立三个模式的独立提示词，与接入Deepseek-v4-flash区分开。

### 8.7 准确告知开发者需准备的详细操作步骤

### 交付物

- `vision.js` — 图像识别
- `fileReader.js` — 文件解析
- `voice.js` — 语音输入与合成
- `voice-proxy` Edge Function
- 完整多模态交互
- 接入豆包对话大模型Doubao-Seed-2.1
- 能够与Deepseek-v4-flash提示词区分，有专属的Doubao-Seed-2.1的三个模式提示词。

### 验收标准

- [ ] 图片上传后 AI 能识别并描述内容
- [ ] 文件上传后内容被解析并注入对话
- [ ] 语音录音 → 识别 → 填充输入框
- [ ] TTS 朗读 AI 回复正常
- [ ] 上传进度条 + 取消功能正常
- [ ] 录音时红色脉冲动画
- [ ] 不同浏览器音频格式兼容
- [ ] 系统设置中切换至Doubao-Seed-2.1模型后，确保对话正常对接Doubao-Seed-2.1模型运行，且不影响已经接入的Deepseek-v4-flash模型对话。当用户切回DromAI 2.0后，确保正常对接Deepseek-v4-flash模型运行。
- [ ] 系统设置中切换至Doubao-Seed-2.1模型后，确保能够使用该模型专有的三个模式的提示词。

---

## 步骤 9：PWA 与离线支持

**目标：** 可安装为 PWA，离线可浏览历史对话。

### 9.1 创建 manifest.json

按设计方案第 15.1 节：
- name / short_name / description
- start_url / scope / display: standalone
- icons（192x192 + 512x512，含 maskable）
- theme_color / background_color

### 9.2 实现 sw.js — Service Worker

**缓存策略：**
- 核心资源（HTML/CSS/JS/vendor）：缓存优先，后台更新
- 对话历史快照：`idrome-conversations-v1` 缓存，最近 50 条
- API 请求：不缓存（Supabase 请求不拦截）

**更新检测：**
- `updatefound` 事件 → 显示更新横幅
- `SKIP_WAITING` + `CLIENTS_CLAIM` 策略

### 9.3 创建 offline.html

- 离线回退页面
- 品牌 Logo + "当前离线"提示
- "查看最近对话"按钮（从 SW 缓存读取）

### 9.4 实现离线写入队列

- 网络断开时用户输入暂存到 localStorage
- 顶部横幅提示"当前离线，数据将在恢复网络后同步"
- 网络恢复后批量同步到 Supabase

### 交付物

- `manifest.json`
- `sw.js`
- `offline.html`
- 离线写入队列

### 验收标准

- [ ] 可安装为 PWA（地址栏出现安装按钮）
- [ ] 安装后独立窗口运行
- [ ] 离线时可打开应用并浏览最近对话
- [ ] 离线时输入消息暂存，联网后同步
- [ ] SW 更新时显示更新提示
- [ ] 注销时清除 SW 缓存

---

## 步骤 10：导出分享与体验优化

**目标：** 对话导出/分享、Onboarding、性能优化。

### 10.1 实现 export.js — 对话导出

**Markdown 导出：**
- 查询 messages 表 → 拼接为 Markdown 格式 → 下载

**PDF 导出：**
- 桌面端：打印 CSS + `window.print()`
- 移动端：隐藏 PDF 按钮（`matchMedia('(max-width: 768px)')`）

**图片导出：**
- 本地 html2canvas（`assets/vendor/html2canvas.min.js`）截图对话区域

### 10.2 实现对话分享

**shared_conversations 表（设计方案第 32.2.1 节）：**
```sql
CREATE TABLE shared_conversations (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  share_id uuid DEFAULT gen_random_uuid() UNIQUE,
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  password_hash text,
  expires_at timestamptz,
  view_count int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE shared_conversations ENABLE ROW LEVEL SECURITY;

-- 用户只能管理自己的分享链接（创建/删除/查看自己的分享）
CREATE POLICY "Users can manage own shares"
  ON shared_conversations FOR ALL
  USING (auth.uid() = user_id);

-- 注意：不设置公开 SELECT 策略，避免暴露 password_hash 等敏感字段
-- 分享对话的访问通过 Edge Function（service_role 绕过 RLS）处理：
-- 1. 用户访问分享链接时，前端调用 Edge Function 传入 share_id + password
-- 2. Edge Function 使用 service_role 查询 shared_conversations 表
-- 3. 验证密码（如有）和过期时间后，返回对话内容给前端
-- 这样 password_hash、user_id 等敏感字段完全不会暴露给前端
```

**share-proxy Edge Function：**
- 创建分享（生成 share_id + PBKDF2 密码哈希）
- 访问分享（验证 share_id + 密码 → 返回对话内容，绕过 RLS）

**前端：**
- 分享按钮 → 弹窗（密码保护选项 + 过期时间选项）
- 生成分享链接 → 复制到剪贴板
- 分享访问页面（未登录可查看）

### 10.3 实现 onboarding.js — 首次引导（设计方案第 7.1 节）

- **引导触发条件**：`localStorage.getItem('idrome_onboarding_completed')` 不为 `true` 时触发
- **4 步全屏覆盖式引导卡片**（每步可跳过，对应设计文档第 7.1 节）：
  1. **欢迎卡片**：iDrome 简介 + "开始使用"按钮
  2. **模式选择说明**：三模式介绍 + "不了解？点击查看说明"浮层按钮
  3. **功能介绍**：深度思考、联网搜索、文件上传、语音输入功能介绍
  4. **完成确认**：引导结束提示 + "开始体验"按钮 → 调用 `completeOnboarding()`
- **模式选择说明浮层**：点击"不了解？"弹出浮层解释三种模式：
  - 🌾 普通模式：通用 AI 对话，支持个人知识库
  - 📖 田语模式：琳凯蒂亚语翻译与文化解读
  - 📚 小说模式：基于琳凯蒂亚世界观的角色扮演与创作
- **功能 Tooltip**：首次开启深度思考或联网搜索时显示说明 Tooltip（"深度思考会展示 AI 的推理过程" / "联网搜索会获取最新网络信息"）
- **引导状态管理**：`completeOnboarding()` 写入 localStorage；`showFeatureTooltip(feature)` 首次显示后标记
- 可在设置中重新触发

### 10.4 性能优化（设计方案第 25 章）

**25.1 请求优化：**
- 请求去重：短时间内相同请求只发送一次（Map 缓存进行中请求）
- 请求合并：多个快速连续消息合并为一次请求
- 连接复用：HTTP Keep-Alive
- 超时控制：30 秒超时 + `AbortController`

**25.2 缓存策略：**
- 搜索结果缓存：5 分钟过期（`searchCache: new Map()`）
- TTS 音频缓存：30 分钟过期（基于文本 hash）
- OCR 结果缓存：10 分钟过期（基于图片 hash）

**25.3 渲染优化：**
- 虚拟滚动：消息 > 100 条时仅渲染可见区域 + 上下各 5 条
- Markdown 懒渲染：长篇 AI 回复分段渲染
- 代码块按需高亮：`Intersection Observer` 进入视口时高亮
- 图片懒加载：`loading="lazy"` + Intersection Observer
- `requestIdleCallback`：非关键 UI 更新（时间戳更新等）使用空闲回调

**25.4 内存管理：**
- 对话切换时清理上一个对话的音频资源
- 历史消息超 1000 条时只保留最近 500 条在内存中，其余从 Supabase 按需加载
- `FileReader` 使用后及时释放 blob URL（`URL.revokeObjectURL()`）

**其他：**
- 防抖处理（输入框字数统计、搜索）
- KaTeX / highlight.js 按需加载

### 10.5 i18n 国际化

- `data-i18n` 属性标记
- `js/locales/zh-CN.json` + `tian-RC.json` + `en.json`
- `I18N.init(locale)` + `applyTranslations()` + `updateSystemPrompt()`

### 10.6 设置面板完善（设计方案第 5.5 节）

**数据管理：**
- 清除本地缓存：清除 localStorage + SW 缓存（需确认弹窗）
- 删除云端对话数据：调用 Supabase 批量删除用户所有对话（需二次确认弹窗 + 输入"删除"验证）

**快捷键参考弹窗（`Ctrl + /` 触发）：**
- 读取步骤 3.5 的快捷键配置生成列表
- 模态框展示全部 9 个快捷键

**关于页面：**
- 应用版本号
- 开发者信息（华田中央大学蔚莱科技学院 逐梦人工智能开发工作室）
- 文明之树图标

**其他菜单项：**
- 进入官网（链接到 `rincatian.top`）
- 账户设置（头像、昵称、邮箱展示，与主网站一致）
- 退出登录

### 交付物

- `export.js` — 导出功能
- `shared_conversations` 表 + `share-proxy` Edge Function
- `onboarding.js` — 首次引导（3 步 + 浮层 + Tooltip）
- `js/locales/` 语言包
- 性能优化（请求/缓存/渲染/内存）
- 设置面板二级功能（数据管理 / 快捷键参考 / 关于页面）

### 验收标准

- [ ] Markdown 导出文件内容正确
- [ ] PDF 导出桌面端正常（移动端隐藏按钮）
- [ ] 图片导出截图清晰
- [ ] 分享链接可创建（含密码保护）
- [ ] 分享链接可访问（未登录可查看）
- [ ] 首次访问显示 Onboarding 引导（3 步 + 浮层 + Tooltip）
- [ ] 虚拟滚动在长对话中流畅
- [ ] 搜索/OCR 缓存命中时不重复请求
- [ ] 中英文切换正常
- [ ] 清除缓存 / 删除云端数据正常
- [ ] `Ctrl + /` 快捷键参考弹窗显示完整 9 项
- [ ] 关于页面显示版本和开发者信息

---

## 步骤 11：安全加固与测试收尾

**目标：** 安全审查、测试、可发布版本。

### 11.1 安全加固

- 提示词注入防护完善（三层检测 + 输出注入检测）
- 文件上传安全（MIME 服务端二次校验 + PII 检测）
- RLS 策略审查（所有表 + Storage）
- 注销时数据清除（localStorage + SW 缓存 + session）
- HTTPS 验证
- 请求级频率限制（Edge Function 滑动窗口）

### 11.2 无障碍完善

- ARIA 角色映射（按第 9.2 节表格）
- 键盘操作全覆盖
- `prefers-reduced-motion` 支持
- 屏幕阅读器测试（NVDA / VoiceOver / TalkBack）

### 11.3 单元测试

按设计方案第 33 章执行 `test/unit-tests.js`：

- SSE 解析测试（`parseSSEChunk`）
- Token 估算测试（`estimateTokens`）
- 知识库截断测试（`prepareKnowledgeForPrompt`）
- 注入检测测试（`detectInjection`）

**测试运行页面**（设计方案第 33.3 节）：创建 `test/runner.html`，浏览器访问即可运行全部单元测试并显示结果（通过 ✅ / 失败 ❌），无需 Node.js 环境。

**测试目录结构**（设计方案第 33.4 节）：
```
public/idrome/test/
├── runner.html              # 测试运行页面（浏览器访问）
├── unit-tests.js            # 单元测试主文件
├── api-verification.mjs     # API 可行性验证脚本（步骤 0，Node.js 执行）
├── integration.js           # 集成测试脚本（步骤 11.4）
└── mock/
    └── mockLayer.js         # Mock 响应层（步骤 3.3 创建）
```

### 11.4 集成测试

按设计方案第 26.1 节完整测试矩阵执行，覆盖 9 大模块共 31 项测试，另补充执行文档特有场景 6 项，合计 37 项：

**设计方案第 26.1 节测试矩阵（31 项）：**

| 测试模块 | 测试项 | 测试方法 | 通过标准 |
|---------|--------|---------|---------|
| **核心对话** | 基础对话 | 发送 10 条不同主题消息 | 全部正确回复 |
| | 流式输出 | 发送消息观察流式渲染 | 打字机效果正常，无卡顿 |
| | 上下文连贯 | 连续 5 轮对话 | 正确引用上文 |
| | 停止生成 | 点击停止按钮 | 1 秒内中断，已生成内容保留 |
| **深度思考** | 开关切换 | 切换深度思考 3 次 | 按钮状态正确切换 |
| | 推理过程 | 开启后发送复杂问题 | 展示思考过程，最终回答正确 |
| | 关闭状态 | 关闭后发送问题 | 不显示思考过程 |
| **联网搜索** | 搜索触发 | 发送"今天天气" | 触发搜索，返回实时信息 |
| | 非搜索问题 | 发送"1+1=?" | 不触发搜索 |
| | 来源展示 | 搜索类问题 | 回答末尾显示引用来源 |
| **语音识别** | 录音功能 | 点击麦克风说话 | 正常录音，PCM 转换正确 |
| | 识别准确率 | 朗读标准文本 10 句 | 准确率 ≥ 90% |
| | 静音超时 | 3 秒不说话 | 自动停止录音 |
| | 权限拒绝 | 拒绝麦克风权限 | 显示友好提示 |
| **语音合成** | 朗读功能 | 点击 AI 消息的喇叭 | 正常播放音频 |
| | 暂停/继续 | 朗读中点击暂停 | 暂停后可从当前位置继续 |
| | 音色切换 | 切换不同音色朗读 | 音色正确切换 |
| **图像识别** | JPEG OCR | 上传含文字的 JPEG | 文字完整提取 |
| | PNG 截图 | 上传 PNG 截图 | 文字准确提取 |
| | 多语言 | 上传中英混合图片 | 正确识别所有语言 |
| | 无文字图片 | 上传纯风景照 | 返回"未检测到文字" |
| | 图像 API 回退 | 模拟 DeepSeek Vision 不可用 | 自动切换到豆包 OCR |
| **文件读取** | TXT 读取 | 上传 TXT 文件 | 内容完整读取 |
| | PDF 读取 | 上传 PDF 文件 | 文字内容提取正确 |
| | DOCX 读取 | 上传 Word 文档 | 文字内容提取正确 |
| | 代码文件 | 上传 .js/.py 文件 | 代码内容完整保留 |
| | 超大文件 | 上传 30MB 文件 | 正确提示文件过大 |
| | 不支持格式 | 上传 .exe 文件 | 正确提示不支持 |
| **API 回退** | DeepSeek 故障 | 断开 DeepSeek 连接 | 自动切换到豆包 |
| | 豆包故障 | 断开豆包连接 | 提示功能不可用 |
| | 全部故障 | 断开所有 API | 显示全局错误提示 |
| **秘钥安全** | 前端检查 | 审查前端源码 | 无硬编码密钥 |
| | 动态获取 | 登录后检查网络请求 | 密钥通过 Edge Function 获取 |
| | 未登录拦截 | 未登录调用 API | 返回 401 |

**执行文档补充场景（6 项，对应各步骤特有逻辑）：**

| 测试模块 | 测试项 | 测试方法 | 通过标准 | 对应步骤 |
|---------|--------|---------|---------|---------|
| 离线 | 断网恢复 | 断网 → 离线模式 → 联网同步 | 离线消息在联网后同步 | 步骤 9 |
| 并发 | 多标签页 | 多标签页同时编辑消息 | 无数据冲突，storage 事件同步 | 步骤 5 |
| 预算 | 月度预算 | 超月度预算触发 429 | 阻断调用并显示升级提示 | 步骤 4 |
| 模式锁定 | 首条后锁定 | 首条消息后尝试切换模式 | 切换按钮禁用并提示 | 步骤 6 |
| 知识库 | 全链路 | 上传 → 注入 → 删除 | 上传后内容注入提示词，删除后不再注入 | 步骤 6 |
| 导出与分享 | 三格式导出 + 分享链 | Markdown / PDF / 图片导出 + 分享链创建访问过期 | 三种格式内容完整；分享链可访问、过期后失效 | 步骤 10 |

> **自动化测试脚本**：按设计方案第 26.2 节提供的 `test/integration.js` 框架实现，使用 `test(name, fn)` + `assert(condition, message)` 模式逐项执行并汇总结果。核心对话、流式输出、深度思考等可自动化的项优先脚本化；语音识别准确率、图像 OCR 等需人工参与的项以手动测试表记录。

### 11.5 性能验证

- 首屏加载 < 2 秒
- 交互响应 < 100ms
- 动画帧率 >= 60fps
- 消息渲染（1000 条）无卡顿

### 11.6 发布准备

- 跨浏览器测试（Chrome / Firefox / Safari / Edge）
- 移动端测试（iOS Safari / Android Chrome）
- PWA 安装测试
- Supabase 生产环境配置
- Edge Function 生产部署
- 域名配置（`rincatian.top/idrome/`）

**手动测试检查清单**（设计方案第 26.3 节，发布前逐项确认）：

```
□ 桌面端 Chrome：所有功能正常
□ 桌面端 Edge：所有功能正常
□ 桌面端 Firefox：所有功能正常
□ 移动端 Safari (iOS)：所有功能正常
□ 移动端 Chrome (Android)：所有功能正常
□ PWA 安装：可正常安装和启动
□ PWA 离线：离线页面正常显示
□ 深色/浅色主题：切换正常
□ 响应式布局：Mobile / Tablet / Desktop 断点正常
□ 登录态共享：主网站登录后 iDrome 自动识别
□ 跨标签页同步：一个标签页登录，另一个自动更新
```

### 11.7 Embedding 语义检索（可选，依赖步骤 0 验证结果）

> **依赖声明**（设计方案第 28.8 节）：此功能依赖步骤 0 的 API 验证结果。若 DeepSeek 不提供 Embedding API，按备选方案（OpenAI / Jina AI / 全量注入回退）调整。若所有外部 Embedding 服务均不可用，则回退为步骤 6 已实现的全量注入方案（保底策略）。

**若步骤 0 验证 DeepSeek Embedding API 可用：**

1. 创建 `knowledge_base_chunks` 表 + pgvector 扩展：

```sql
-- pgvector 扩展
CREATE EXTENSION IF NOT EXISTS vector;

-- 知识库分段表
CREATE TABLE knowledge_base_chunks (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  file_id bigint REFERENCES knowledge_base_files(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  chunk_index int,
  chunk_text text,
  embedding vector(1024),  -- 维度依赖步骤 0 验证结果
  created_at timestamptz DEFAULT now()
);

-- 向量相似度索引
CREATE INDEX idx_kb_chunks_embedding ON knowledge_base_chunks
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_kb_chunks_user_id ON knowledge_base_chunks(user_id);

-- RLS：用户只能访问自己的分段；INSERT/UPDATE 由 Edge Function service_role 执行
ALTER TABLE knowledge_base_chunks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own chunks" ON knowledge_base_chunks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own chunks" ON knowledge_base_chunks FOR DELETE USING (auth.uid() = user_id);
```

2. 创建相似度检索 RPC 函数：

```sql
CREATE OR REPLACE FUNCTION match_knowledge_chunks(
  query_embedding vector(1024),
  match_user_id uuid,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id bigint,
  chunk_text text,
  similarity float
)
LANGUAGE sql STABLE AS $$
  SELECT id, chunk_text, 1 - (embedding <=> query_embedding) AS similarity
  FROM knowledge_base_chunks
  WHERE user_id = match_user_id
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;
```

3. 修改 file-proxy Edge Function：文件上传后分段（约 500 字符/段）→ 调用 Embedding API 向量化 → 写入 `knowledge_base_chunks`（service_role）

4. 修改 `prepareKnowledgeForPrompt()`：普通模式下，将用户问题向量化 → 调用 `match_knowledge_chunks` RPC → 取 Top 5 相关分段注入提示词（替代全量注入）

**若步骤 0 验证 DeepSeek Embedding API 不可用：**

按设计方案第 28.8 节备选方案表选择替代服务（OpenAI text-embedding-3-small 1536 维 / Jina AI Embedding v2 768 维），仅需修改 `batchEmbed`/`embed` 函数端点与向量维度，业务逻辑不变。若替代服务也不可用，保持步骤 6 的全量注入方案作为保底。

### 交付物

- 安全审查报告
- 测试报告（单元 + 集成）
- 性能验证报告
- 可发布的生产版本

### 验收标准

- [ ] 所有安全检查通过
- [ ] 单元测试 100% 通过
- [ ] 集成测试矩阵全部通过
- [ ] 性能指标达标
- [ ] 跨浏览器兼容
- [ ] 移动端正常
- [ ] PWA 可安装
- [ ] 生产环境部署完成

---

## 附录 A：文件与模块对应关系

| 文件 | 实现步骤 | 依赖模块 |
|------|---------|---------|
| `dromai.html` | 步骤 1 | — |
| `css/*.css` | 步骤 1 | — |
| `js/app.js` | 步骤 2 | state, auth, navpanel, input |
| `js/store.js` | 步骤 2 | — |
| `js/state.js` | 步骤 2 | store |
| `js/auth.js` | 步骤 2 | supabase |
| `js/navpanel.js` | 步骤 2 | state |
| `js/settings.js` | 步骤 2 | state |
| `js/input.js` | 步骤 3 | state |
| `js/chat.js` | 步骤 3 → 4 → 5 | state, apiRouter, conversations |
| `js/apiRouter.js` | 步骤 4 | deepseek |
| `js/deepseek.js` | 步骤 4 | supabase |
| `js/errorHandler.js` | 步骤 4 | — |
| `js/usageTracker.js` | 步骤 4 | — |
| `js/conversations.js` | 步骤 5 | supabase |
| `js/knowledgeLoader.js` | 步骤 6 | — |
| `js/search.js` | 步骤 7 | apiRouter |
| `js/vision.js` | 步骤 8 | apiRouter |
| `js/fileReader.js` | 步骤 8 | supabase |
| `js/voice.js` | 步骤 8 | supabase |
| `js/export.js` | 步骤 10 | supabase |
| `js/onboarding.js` | 步骤 10 | state |

## 附录 B：Edge Function 部署清单

| Edge Function | 部署步骤 | 环境变量 |
|---------------|---------|---------|
| `chat-proxy` | 步骤 4 | `DEEPSEEK_API_URL`, `DEEPSEEK_API_KEY`, `DEEPSEEK_MODEL`, `MONTHLY_BUDGET_DEFAULT` |
| `file-proxy` | 步骤 6 | `DOUBAO_API_KEY`, `DOUBAO_DOC_PARSE_URL`（步骤 11.7 可选追加 `DEEPSEEK_API_KEY` 用于 Embedding） |
| `search-proxy` | 步骤 7 | `BAIDU_API_KEY`, `BAIDU_SEARCH_URL`, `DEEPSEEK_API_URL`, `DEEPSEEK_API_KEY` |
| `voice-proxy` | 步骤 8 | `DOUBAO_API_KEY`, `DOUBAO_ASR_URL`, `DOUBAO_TTS_URL` |
| `share-proxy` | 步骤 10 | — |

> **说明**：Vision 图片识别由 `chat-proxy` 统一处理（DeepSeek Vision 支持在 messages 中传入 base64 图片），不单独部署 vision-proxy。若 DeepSeek Vision 不可用，回退豆包 OCR（通过 file-proxy 处理）。

## 附录 C：数据库表创建顺序

1. `usage_logs`（步骤 4.0，chat-proxy Edge Function 依赖）
2. `conversations`（步骤 5）
3. `messages`（步骤 5）
4. `knowledge_base_files`（步骤 6）
5. `shared_conversations`（步骤 10.2）
6. `knowledge_base_chunks`（步骤 11.7，可选，依赖步骤 0 Embedding 验证结果）
7. pgvector 扩展（步骤 11.7，与 knowledge_base_chunks 同步创建）
8. Storage: `user_knowledge_base`（步骤 6.3）

---

> **开发原则：** 每步完成后在浏览器中验证，确保可预览可交互。遇到 API 行为与文档不符时，立即记录并调整对应模块，不要等到后续步骤才发现问题。
