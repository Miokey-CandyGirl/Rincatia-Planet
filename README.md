# 琳凯蒂亚星球网站

基于 **Vue 3 + MemFire Cloud（后端数据） + 阿里云短信服务（登录） + GitHub Pages（前端代码）** 构建的 Web 应用，包含六个主题页面：首页（Home）、田语（Rincatian）、世界（World）、商务（Business）、社区（Community）、用户（User，登录后可见，含登录/注销）和一个错误 404 页面。采用手机验证码登录，仅**社区**和**用户**两个页面涉及后端数据交互。

---

## 技术栈

| 类别 | 选型 |
| --- | --- |
| 前端框架 | Vue 3 (Composition API + `<script setup>`) |
| 构建工具 | Vite 5 |
| 路由 | Vue Router 4 |
| 状态管理 | Pinia |
| BaaS 后端/数据库 | MemFire Cloud（兼容 Supabase，提供 PostgreSQL 及 REST API，仅用于社区和用户两个页面） |
| 登录服务 | 阿里云短信服务（验证码登录） |
| 无服务器函数 | MemFire Cloud Edge Functions（基于 Deno，处理短信发送与验证） |
| UI 样式 | 纯 CSS / 可选 Tailwind CSS |
| 托管 | GitHub Pages + GitHub Actions 自动部署 |
| 开发工具 | Trae（字节跳动 AI IDE） |

---

## 页面功能详述

### 1. 首页（Home）

网站入口与导航中枢，展示琳凯蒂亚星球文化概览。

| 功能模块 | 说明 |
| --- | --- |
| 网站介绍 | 琳凯蒂亚星球文化简介、核心理念展示 |
| 导航卡片 | 六大页面的入口卡片，配图 + 简要说明，点击跳转 |
| 登录入口 | 顶部导航栏/页面中部「登录/注册」按钮，点击弹出短信验证码登录弹窗 |
| 最新动态 | 展示社区最新帖子摘要（2-3 条） |
| 页脚 | 版权信息、联系方式 |

### 2. 田语（Rincatian）

展示琳凯蒂亚语（Rincatian）的语言学习内容，支持语法、词汇、发音等功能。

| 功能模块 | 说明 |
| --- | --- |
| 语法内容展示 | 分章节/分类展示田语语法知识，支持折叠展开 |
| 词汇表 | 按类别展示词汇，支持搜索和筛选 |
| 搜索 | 全文搜索语法条目和词汇 |
| 点赞 | 登录用户可对语法条目点赞（记录到用户数据） |
| 收藏 | 登录用户可收藏语法条目，在用户中心查看收藏列表 |
| 发音示例 | 内置音频播放器，提供发音示范 |
| 学习进度 | 登录用户可标记学习进度，记录在用户数据中 |
| 下载 | 链接到社区页面的资源下载区 |
| 登录入口 | 未登录状态下提示登录以使用点赞、收藏等功能 |

### 3. 世界（World）

展示琳凯蒂亚星球的世界观、地理、历史、种族等设定内容。

| 功能模块 | 说明 |
| --- | --- |
| 世界观介绍 | 分章节展示琳凯蒂亚星球的世界观设定 |
| 地理图鉴 | 展示星球地图、各地区介绍（图文结合） |
| 历史年表 | 时间线形式展示琳凯蒂亚星球历史 |
| 种族介绍 | 各智慧种族的详细信息 |
| 搜索 | 全文搜索世界观内容 |
| 登录入口 | 顶部导航栏统一入口 |

### 4. 商务（Business）

展示琳凯蒂亚星球相关的商业合作、周边产品、授权等信息。

| 功能模块 | 说明 |
| --- | --- |
| 合作介绍 | 商业合作模式与案例展示 |
| 周边产品 | 琳凯蒂亚主题周边产品展示（图片 + 描述） |
| 授权信息 | IP 授权说明与联系方式 |
| 联系我们 | 商务合作联系表单（静态展示，不涉及后端） |
| 登录入口 | 顶部导航栏统一入口 |

### 5. 社区（Community）

核心互动页面，涉及后端数据交互。用户可发布帖子、评论、点赞、收藏、上传下载文件。

| 功能模块 | 说明 |
| --- | --- |
| 帖子列表 | 分页展示所有帖子，支持按时间/热度排序 |
| 发布帖子 | 登录用户可发布新帖（标题 + 正文 + 可选附件） |
| 查看帖子 | 点击帖子进入详情页，展示完整内容和评论 |
| 发表评论 | 登录用户可对帖子发表评论，支持嵌套回复（二级） |
| 帖子点赞 | 登录用户可对帖子点赞/取消点赞 |
| 评论点赞 | 登录用户可对评论点赞/取消点赞 |
| 收藏帖子 | 登录用户可收藏帖子，在用户中心查看 |
| 文件上传 | 登录用户可在发帖时上传附件（图片、文档等） |
| 文件下载 | 用户可下载帖子中的附件 |
| 删除/编辑 | 用户可编辑或删除自己的帖子和评论 |
| 搜索 | 按关键词搜索帖子标题和内容 |
| 登录入口 | 未登录状态下可浏览，但发布/互动需登录 |

### 6. 用户中心（User）

登录后可见，个人数据管理中枢。涉及后端数据交互。

| 功能模块 | 说明 |
| --- | --- |
| 登录/注册 | 手机号 + 短信验证码登录，首次自动注册 |
| 注销 | 清除登录状态，返回首页 |
| 个人信息 | 查看和编辑昵称、头像、简介等个人资料 |
| 我的帖子 | 查看自己发布的所有帖子，支持编辑和删除 |
| 我的评论 | 查看自己发表的所有评论，支持删除 |
| 我的收藏 | 查看收藏的帖子列表，支持取消收藏 |
| 学习记录 | 查看田语学习进度记录（学习过的章节、掌握的词汇等） |
| 点赞记录 | 查看点赞过的帖子列表 |

### 7. 404 页面

| 功能模块 | 说明 |
| --- | --- |
| 错误提示 | 友好的 404 提示文案和插图 |
| 返回首页 | 引导用户返回首页的按钮 |

---

## 数据库设计

MemFire Cloud 提供 PostgreSQL 数据库，以下为数据表设计：

### users 表（用户）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid (PK) | 用户唯一标识，由 Supabase Auth 自动生成 |
| phone | text (unique) | 手机号 |
| nickname | text | 昵称，默认「琳凯蒂亚居民」 |
| avatar_url | text | 头像 URL |
| bio | text | 个人简介 |
| created_at | timestamptz | 注册时间 |
| updated_at | timestamptz | 最后更新时间 |

### posts 表（社区帖子）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid (PK) | 帖子 ID |
| user_id | uuid (FK → users.id) | 发帖用户 ID |
| title | text | 帖子标题 |
| content | text | 帖子正文（支持 Markdown） |
| like_count | integer | 点赞数（冗余字段，便于排序） |
| comment_count | integer | 评论数（冗余字段） |
| is_pinned | boolean | 是否置顶 |
| created_at | timestamptz | 发帖时间 |
| updated_at | timestamptz | 最后编辑时间 |

### comments 表（评论）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid (PK) | 评论 ID |
| post_id | uuid (FK → posts.id) | 所属帖子 ID |
| user_id | uuid (FK → users.id) | 评论用户 ID |
| parent_id | uuid (FK → comments.id, nullable) | 父评论 ID（用于嵌套回复，null 表示一级评论） |
| content | text | 评论内容 |
| like_count | integer | 点赞数 |
| created_at | timestamptz | 评论时间 |

### likes 表（点赞）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid (PK) | 点赞 ID |
| user_id | uuid (FK → users.id) | 点赞用户 ID |
| target_type | text | 点赞目标类型：`post` / `comment` / `tianyu` |
| target_id | uuid | 点赞目标 ID |
| created_at | timestamptz | 点赞时间 |

> 唯一约束：(user_id, target_type, target_id) 防止重复点赞

### favorites 表（收藏）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid (PK) | 收藏 ID |
| user_id | uuid (FK → users.id) | 收藏用户 ID |
| target_type | text | 收藏目标类型：`post` / `tianyu` |
| target_id | uuid | 收藏目标 ID |
| created_at | timestamptz | 收藏时间 |

> 唯一约束：(user_id, target_type, target_id) 防止重复收藏

### learning_records 表（学习记录）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid (PK) | 记录 ID |
| user_id | uuid (FK → users.id) | 用户 ID |
| content_type | text | 内容类型：`grammar` / `vocabulary` |
| content_id | text | 内容标识（章节/词汇 ID） |
| progress | integer | 学习进度（0-100） |
| completed_at | timestamptz | 完成时间 |
| created_at | timestamptz | 开始学习时间 |
| updated_at | timestamptz | 最后更新时间 |

> 唯一约束：(user_id, content_type, content_id) 每用户每内容一条记录

### files 表（上传文件）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid (PK) | 文件 ID |
| user_id | uuid (FK → users.id) | 上传用户 ID |
| post_id | uuid (FK → posts.id) | 关联帖子 ID |
| file_name | text | 原始文件名 |
| file_path | text | 存储路径（MemFire Cloud Storage） |
| file_size | integer | 文件大小（字节） |
| mime_type | text | 文件 MIME 类型 |
| created_at | timestamptz | 上传时间 |

### ER 关系图（文字描述）

```
users ──1:N──> posts
users ──1:N──> comments
users ──1:N──> likes
users ──1:N──> favorites
users ──1:N──> learning_records
users ──1:N──> files
posts ──1:N──> comments
posts ──1:N──> files
comments ──1:N──> comments (parent_id 自引用)
```

---

## API 设计

以下为前端需要调用的 API 端点设计，通过 MemFire Cloud Edge Functions 或直接使用 Supabase Client SDK 调用。

### 认证相关（Edge Functions + 阿里云短信）

| 方法 | 端点 | 说明 | 是否需要登录 |
| --- | --- | --- | --- |
| POST | `/functions/v1/send-sms` | 发送短信验证码到指定手机号 | 否 |
| POST | `/functions/v1/verify-sms` | 校验验证码，完成登录/注册，返回 JWT | 否 |
| POST | `/auth/v1/logout` | 注销登录 | 是 |

### 用户相关

| 方法 | 端点 | 说明 | 是否需要登录 |
| --- | --- | --- | --- |
| GET | `/rest/v1/users?id=eq.{user_id}` | 获取用户信息 | 是 |
| PATCH | `/rest/v1/users?id=eq.{user_id}` | 更新用户资料（昵称、头像、简介） | 是 |
| GET | `/rest/v1/users?id=eq.{user_id}&select=*` | 获取当前用户完整信息 | 是 |

### 帖子相关

| 方法 | 端点 | 说明 | 是否需要登录 |
| --- | --- | --- | --- |
| GET | `/rest/v1/posts?select=*,users(nickname,avatar_url)` | 获取帖子列表（分页、排序） | 否 |
| GET | `/rest/v1/posts?id=eq.{id}&select=*,users(nickname,avatar_url)` | 获取帖子详情 | 否 |
| POST | `/rest/v1/posts` | 创建帖子 | 是 |
| PATCH | `/rest/v1/posts?id=eq.{id}` | 编辑帖子（仅作者） | 是 |
| DELETE | `/rest/v1/posts?id=eq.{id}` | 删除帖子（仅作者） | 是 |

### 评论相关

| 方法 | 端点 | 说明 | 是否需要登录 |
| --- | --- | --- | --- |
| GET | `/rest/v1/comments?post_id=eq.{post_id}&select=*,users(nickname,avatar_url)` | 获取帖子的评论列表 | 否 |
| POST | `/rest/v1/comments` | 发表评论/回复 | 是 |
| DELETE | `/rest/v1/comments?id=eq.{id}` | 删除评论（仅作者） | 是 |

### 点赞相关

| 方法 | 端点 | 说明 | 是否需要登录 |
| --- | --- | --- | --- |
| POST | `/rest/v1/likes` | 点赞（存在则取消，不存在则创建） | 是 |
| DELETE | `/rest/v1/likes?id=eq.{id}` | 取消点赞 | 是 |
| GET | `/rest/v1/likes?user_id=eq.{user_id}&target_type=eq.{type}` | 获取用户某类点赞列表 | 是 |

### 收藏相关

| 方法 | 端点 | 说明 | 是否需要登录 |
| --- | --- | --- | --- |
| POST | `/rest/v1/favorites` | 收藏 | 是 |
| DELETE | `/rest/v1/favorites?id=eq.{id}` | 取消收藏 | 是 |
| GET | `/rest/v1/favorites?user_id=eq.{user_id}` | 获取用户收藏列表 | 是 |

### 学习记录相关

| 方法 | 端点 | 说明 | 是否需要登录 |
| --- | --- | --- | --- |
| POST | `/rest/v1/learning_records` | 创建/更新学习记录（upsert） | 是 |
| GET | `/rest/v1/learning_records?user_id=eq.{user_id}` | 获取用户学习记录 | 是 |

### 文件相关

| 方法 | 端点 | 说明 | 是否需要登录 |
| --- | --- | --- | --- |
| POST | `/storage/v1/object/{bucket}/{path}` | 上传文件到 Storage | 是 |
| GET | `/storage/v1/object/{bucket}/{path}` | 下载文件 | 否 |
| POST | `/rest/v1/files` | 记录文件元数据到数据库 | 是 |

---

## 组件树

```
App.vue
├── AppHeader.vue                    # 顶部导航栏
│   ├── Logo.vue                     # 网站 Logo
│   ├── NavLinks.vue                 # 导航链接（首页/田语/世界/商务/社区）
│   ├── LoginButton.vue              # 进入星球按钮（未登录时显示）
│   └── UserMenu.vue                 # 用户下拉菜单（登录后显示）
│       ├── 用户中心入口（含注销功能）
│       └── 退出登录按钮
│
├── <router-view />                  # 页面内容区
│   ├── Home.vue                     # 首页
│   │   ├── HeroBanner.vue           # 主视觉横幅
│   │   ├── NavCardGrid.vue          # 导航卡片网格
│   │   │   └── NavCard.vue          # 单个导航卡片
│   │   └── LatestPosts.vue          # 最新帖子摘要
│   │
│   ├── Rincatian.vue                # 田语
│   │   ├── SearchBar.vue            # 搜索栏
│   │   ├── GrammarSection.vue       # 语法章节
│   │   │   └── GrammarItem.vue      # 单条语法条目
│   │   ├── VocabularyList.vue       # 词汇表
│   │   │   └── VocabularyItem.vue   # 单个词汇
│   │   └── LikeButton.vue           # 通用点赞按钮
│   │
│   ├── World.vue                    # 世界
│   │   ├── WorldNav.vue             # 世界页面子导航
│   │   ├── Timeline.vue             # 历史年表
│   │   ├── MapViewer.vue            # 地图展示
│   │   └── RaceCard.vue             # 种族卡片
│   │
│   ├── Business.vue                 # 商务
│   │   ├── ProductCard.vue          # 产品卡片
│   │   └── ContactForm.vue          # 联系表单（静态展示）
│   │
│   ├── Community.vue                # 社区
│   │   ├── PostList.vue             # 帖子列表
│   │   │   └── PostCard.vue         # 单个帖子卡片
│   │   │       └── LikeButton.vue
│   │   ├── PostDetail.vue           # 帖子详情（子路由）
│   │   │   ├── CommentList.vue      # 评论列表
│   │   │   │   └── CommentItem.vue  # 单条评论（含点赞）
│   │   │   │       └── LikeButton.vue
│   │   │   └── CommentForm.vue      # 评论输入框
│   │   ├── PostEditor.vue           # 发帖/编辑帖子
│   │   │   └── FileUploader.vue     # 文件上传组件
│   │   └── SearchBar.vue            # 搜索栏
│   │
│   ├── User.vue                     # 用户中心
│   │   ├── ProfileEditor.vue        # 个人信息编辑
│   │   ├── MyPosts.vue              # 我的帖子列表
│   │   │   └── PostCard.vue
│   │   ├── MyComments.vue           # 我的评论列表
│   │   │   └── CommentItem.vue
│   │   ├── MyFavorites.vue          # 我的收藏列表
│   │   ├── LearningRecords.vue      # 学习记录
│   │   └── LoginModal.vue           # 登录弹窗（短信验证码）
│   │
│   └── NotFound.vue                 # 404 页面
│
├── AppFooter.vue                    # 页脚
│
└── DefaultLayout.vue                # 默认布局容器
```

---

## 路由设计

| 路径 | 页面组件 | 是否需要登录 | 说明 |
| --- | --- | --- | --- |
| `/` | Home.vue | 否| 首页 |
| `/rincatian` | Rincatian.vue | 否 | 田语页面 |
| `/world` | World.vue | 否 | 世界页面 |
| `/business` | Business.vue | 否 | 商务页面 |
| `/community` | Community.vue | 否 | 社区帖子列表 |
| `/community/post/:id` | PostDetail.vue | 否 | 帖子详情页 |
| `/community/new` | PostEditor.vue | 是 | 发布新帖 |
| `/community/edit/:id` | PostEditor.vue | 是 | 编辑帖子 |
| `/user` | User.vue | 是 | 用户中心 |
| `/:pathMatch(.*)*` | NotFound.vue | 否 | 404 页面 |

> 路由守卫：`/user`、`/community/new`、`/community/edit/:id` 需登录，未登录自动跳转首页并弹出登录弹窗。
> 首页、田语、世界、商务、社区页面无需登录即可访问，它们都显示“进入星球”按钮（未登录时显示），登陆成功后显示为”个人中心”按钮，点击后打开user页面。
> 设计数据的操作

---

## 数据流设计

### 1. 认证流程

```
用户输入手机号 → 点击「获取验证码」
  → 前端调用 send-sms Edge Function
    → Edge Function 调用阿里云短信 API 发送验证码
    → 返回发送结果
  → 用户输入验证码 → 点击「登录」
  → 前端调用 verify-sms Edge Function
    → Edge Function 校验验证码
    → 调用 Supabase Auth Admin API 创建/登录用户
    → 返回 JWT Token
  → 前端存储 Token 到 Pinia store + localStorage
  → 更新导航栏为登录状态
```

### 2. 社区帖子数据流

```
[帖子列表页]
  组件挂载 → 调用 supabaseClient.from('posts').select() → 渲染帖子列表
  用户点赞 → 调用 likes 表 upsert → 更新 posts.like_count → 响应式更新 UI

[发布帖子]
  用户填写表单 → 点击发布 → 调用 supabaseClient.from('posts').insert()
  → 成功后跳转到帖子详情页

[帖子详情]
  组件挂载 → 并行请求帖子详情 + 评论列表 → 渲染页面
  发表评论 → 调用 comments 表 insert → 更新 posts.comment_count → 刷新评论列表
```

### 3. 用户中心数据流

```
[用户中心页面]
  组件挂载 → 从 Pinia store 获取当前用户 ID
  → 并行请求用户信息、我的帖子、我的评论、我的收藏、学习记录
  → 渲染各 Tab 内容

[编辑个人信息]
  修改表单 → 提交 → 调用 supabaseClient.from('users').update()
  → 更新 Pinia store → 响应式更新导航栏头像/昵称
```

### 4. 状态管理（Pinia Store）

```
userStore:
  - user: { id, phone, nickname, avatar_url } | null
  - isLoggedIn: boolean
  - login(phone, code) → 调用 verify-sms → 设置 user
  - logout() → 清除 user 和 localStorage
  - fetchProfile() → 从数据库获取最新用户信息
  - updateProfile(data) → 更新数据库 + 本地状态
```

---

## Edge Functions 设计

### send-sms（发送短信验证码）

```typescript
// supabase/functions/send-sms/index.ts
// 输入: { phone: string }
// 逻辑:
//   1. 校验手机号格式
//   2. 生成 6 位随机验证码
//   3. 将验证码存入 Redis/数据库（5 分钟过期）
//   4. 调用阿里云短信 API 发送验证码
//   5. 返回 { success: true }
// 输出: { success: boolean, message: string }
```

### verify-sms（校验验证码并登录）

```typescript
// supabase/functions/verify-sms/index.ts
// 输入: { phone: string, code: string }
// 逻辑:
//   1. 校验手机号和验证码
//   2. 从 Redis/数据库取出验证码比对
//   3. 验证通过 → 调用 Supabase Auth Admin API:
//      - 用户不存在 → 创建用户（自动注册）
//      - 用户已存在 → 直接登录
//   4. 删除已使用的验证码
//   5. 返回 JWT Token + 用户信息
// 输出: { access_token: string, user: { id, phone, ... } }
```

---

## 安全设计

| 安全措施 | 说明 |
| --- | --- |
| RLS 策略 | MemFire Cloud 数据库启用 Row Level Security，确保用户只能操作自己的数据 |
| JWT 认证 | 所有需登录的 API 请求携带 JWT Token，由 Supabase 自动验证 |
| 验证码频率限制 | 同一手机号 60 秒内只能发送一次验证码，同一 IP 每日有上限 |
| XSS 防护 | 帖子/评论内容渲染前进行 HTML 转义，防止 XSS 攻击 |
| 文件上传限制 | 限制文件类型（图片、PDF、文档）和大小（最大 10MB） |
| HTTPS | GitHub Pages 默认启用 HTTPS，所有 API 请求加密传输 |
| 环境变量 | 敏感信息（API Key、短信模板 ID 等）存储在 .env 文件和 Edge Function 环境变量中，不提交 Git |

---

## 响应式设计

| 断点 | 宽度 | 适配策略 |
| --- | --- | --- |
| 移动端 | < 768px | 单列布局，导航折叠为汉堡菜单，帖子卡片全宽 |
| 平板端 | 768px - 1024px | 双列布局，导航完整显示 |
| 桌面端 | > 1024px | 多列布局，侧边栏 + 主内容区，最大宽度 1200px 居中 |

---

## 实施阶段

### 第一阶段：基础框架搭建

- [ ] 初始化 Vite + Vue 3 项目
- [ ] 配置 Vue Router、Pinia
- [ ] 创建基础目录结构
- [ ] 搭建 AppHeader、AppFooter、DefaultLayout 组件
- [ ] 配置 GitHub Actions 自动部署到 GitHub Pages
- [ ] 创建六个页面占位组件 + 404 页面
- [ ] 配置路由和导航守卫

### 第二阶段：静态页面开发

- [ ] 首页：导航卡片、最新动态、网站介绍
- [ ] 田语：语法内容展示、词汇表、搜索
- [ ] 世界：世界观、历史年表、地图、种族介绍
- [ ] 商务：产品展示、联系表单
- [ ] 响应式适配

### 第三阶段：后端集成

- [ ] 配置 MemFire Cloud 项目
- [ ] 创建数据库表并设置 RLS 策略
- [ ] 开发 Edge Functions（send-sms、verify-sms）
- [ ] 配置阿里云短信服务
- [ ] 初始化 Supabase Client

### 第四阶段：社区功能开发

- [ ] 社区帖子列表、详情、发布、编辑、删除
- [ ] 评论系统（含嵌套回复）
- [ ] 点赞功能（帖子 + 评论）
- [ ] 收藏功能
- [ ] 文件上传/下载
- [ ] 社区搜索

### 第五阶段：用户中心开发

- [ ] 短信验证码登录/注册
- [ ] 用户信息查看和编辑
- [ ] 我的帖子、评论、收藏管理
- [ ] 学习记录管理
- [ ] 注销功能

### 第六阶段：优化与测试

- [ ] 全站响应式测试
- [ ] 性能优化（图片懒加载、代码分割）
- [ ] SEO 优化（meta 标签、sitemap）
- [ ] 错误处理与边界情况测试
- [ ] 浏览器兼容性测试

---

## 目录结构

```
Rincatia-Planet/
│
├── .env                          # 本地环境变量（不提交 Git）
├── .env.example                  # 环境变量模板
├── .gitignore                    # 忽略 node_modules, .env, dist 等
├── index.html                    # 入口 HTML
├── package.json                  # 依赖与脚本
├── vite.config.js                # Vite 配置
├── README.md                     # 本文件
│
├── .github/
│   └── workflows/
│       └── deploy.yml            # 自动部署到 GitHub Pages
│
├── public/
│   └── favicon.ico               # 网站图标
│
├── supabase/                     # MemFire Cloud 本地开发（兼容 Supabase CLI）
│   └── functions/                # Edge Functions 目录
│       ├── send-sms/             # 发送短信验证码
│       │   └── index.ts
│       └── verify-sms/           # 校验验证码并完成登录/注册
│           └── index.ts
│
└── src/
    ├── main.js                   # 应用入口
    ├── App.vue                   # 根组件
    │
    ├── assets/
    │   ├── styles/
    │   │   ├── main.css          # 全局样式
    │   │   └── variables.css     # CSS 变量（颜色、间距、断点等）
    │   └── images/               # 静态图片资源
    │
    ├── components/               # 全局可复用组件
    │   ├── AppHeader.vue         # 顶部导航栏（根据登录状态动态显示）
    │   ├── AppFooter.vue         # 页脚
    │   ├── DefaultLayout.vue     # 默认布局容器
    │   ├── LikeButton.vue        # 通用点赞按钮
    │   ├── SearchBar.vue         # 通用搜索栏
    │   ├── LoginModal.vue        # 短信验证码登录弹窗
    │   ├── CommentItem.vue       # 单条评论（含点赞、嵌套回复）
    │   ├── CommentForm.vue       # 评论输入框
    │   ├── PostCard.vue          # 帖子卡片（列表用）
    │   ├── FileUploader.vue      # 文件上传组件
    │   └── Pagination.vue        # 分页组件
    │
    ├── views/                    # 页面组件
    │   ├── Home.vue              # 首页
    │   ├── TianYu.vue            # 田语
    │   ├── World.vue             # 世界
    │   ├── Business.vue          # 商务
    │   ├── Community.vue         # 社区（帖子列表）
    │   ├── PostDetail.vue        # 帖子详情（子路由）
    │   ├── PostEditor.vue        # 发帖/编辑帖子（子路由）
    │   ├── User.vue              # 用户中心
    │   └── NotFound.vue          # 404 页面
    │
    ├── router/
    │   └── index.js              # 路由配置 + 导航守卫
    │
    ├── store/
    │   └── user.js               # 用户状态管理（Pinia）
    │
    ├── api/
    │   ├── supabaseClient.js     # MemFire Cloud 客户端初始化
    │   └── index.js              # 前端 API 封装（帖子、评论、点赞、收藏、用户、文件）
    │
    └── utils/
        └── index.js              # 工具函数（时间格式化、手机号校验、防抖、节流等）
```

---

## 开发约定

| 约定项 | 说明 |
| --- | --- |
| 命名规范 | 组件文件使用 PascalCase，其他文件使用 camelCase/kebab-case |
| 代码风格 | 使用 ESLint + Prettier 统一代码风格 |
| 提交规范 | 遵循 Conventional Commits（`feat:`, `fix:`, `docs:`, `style:`, `refactor:` 等） |
| 分支策略 | `main` 分支保护，功能开发在 `feature/*` 分支，完成后 PR 合并 |
| 文件编码 | 统一使用 UTF-8 |
| 缩进 | 2 空格缩进 |