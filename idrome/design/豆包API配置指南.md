# 豆包（火山方舟）API 正确获取与配置指南

> **版本**：v1.0 | **更新日期**：2026-08-02
> **适用范围**：iDrome 项目 — 对话模型切换、图片识别（OCR）、语音识别（ASR）、语音合成（TTS）

---

## 目录

1. [火山方舟账号注册与 API Key 申请](#1-火山方舟账号注册与-api-key-申请)
2. [模型开通与推理接入点创建](#2-模型开通与推理接入点创建)
3. [iDrome 环境变量配置](#3-idrome-环境变量配置)
4. [Supabase Edge Function 部署](#4-supabase-edge-function-部署)
5. [功能验证清单](#5-功能验证清单)
6. [常见问题排查](#6-常见问题排查)

---

## 1. 火山方舟账号注册与 API Key 申请

### 1.1 注册火山引擎账号

1. 访问 [火山引擎官网](https://www.volcengine.com/)
2. 点击右上角"注册"，使用手机号完成账号注册
3. 完成企业认证或个人认证（推荐企业认证，可获得更多免费额度）

### 1.2 开通方舟大模型平台

1. 登录后访问 [火山方舟控制台](https://console.volcengine.com/ark)
2. 首次进入会提示开通服务，点击"开通服务"
3. 同意服务协议，开通方舟平台

### 1.3 创建 API Key

1. 进入方舟控制台 → 左侧菜单"API Key 管理"
2. 点击"创建 API Key"
3. 填写名称（如 `idrome-doubao`），选择归属团队
4. 创建后**立即复制 API Key**（格式类似 `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`）
   > ⚠️ **重要**：API Key 仅在创建时显示一次，请妥善保存。丢失后只能重新创建。

---

## 2. 模型开通与推理接入点创建

火山方舟采用"推理接入点"（Endpoint）机制：你需要为每个模型创建一个接入点，使用接入点 ID 调用 API。

### 2.1 开通所需模型

进入方舟控制台 → 左侧"模型广场"，搜索并开通以下模型：

| 用途 | 模型名称 | 说明 |
|------|----------|------|
| **对话** | Doubao-Seed-2.1（或 doubao-pro-32k） | 通用对话模型 |
| **图片识别/OCR** | doubao-vision-pro-32k | 视觉理解模型，支持图片输入 |
| **语音识别 (ASR)** | Doubao-Seed-ASR-2.0 | 语音转文字 |
| **语音合成 (TTS)** | doubao-tts | 文字转语音 |

> 💡 开通模型时部分模型需要审核，通常几分钟到几小时不等。

### 2.2 创建推理接入点（重要！）

对每个模型创建推理接入点：

1. 进入方舟控制台 → 左侧"推理接入点"
2. 点击"创建推理接入点"
3. 选择模型（如 Doubao-Seed-2.1）
4. 填写接入点名称（如 `idrome-chat`）
5. 选择地区（推荐 `cn-beijing`）
6. 创建后会得到一个**接入点 ID**（格式类似 `ep-20260802100000-xxxx`）

> ⚠️ **关键**：调用 API 时，`model` 参数应使用**接入点 ID**（`ep-xxxx`）或**模型名称**（如 `doubao-pro-32k`），而非显示名。

为以下功能分别创建接入点：
- 对话模型接入点 → `ep-xxxx`（用于 `DOUBAO_MODEL`）
- 视觉模型接入点 → `ep-xxxx`（用于 `DOUBAO_VISION_MODEL`）
- ASR 模型接入点 → `ep-xxxx`（用于 `DOUBAO_ASR_MODEL`）
- TTS 模型接入点 → `ep-xxxx`（用于 `DOUBAO_TTS_MODEL`）

### 2.3 TTS 音色选择

TTS 模型需要指定音色（Voice Type）。常用中文音色：

| 音色 ID | 特点 |
|---------|------|
| `zh_female_vv_jupiter_bigtts` | 女声，温柔大方（默认） |
| `zh_male_M392_conversation_wvae` | 男声，自然对话 |
| `zh_female_shaoerguaihao_moon_bigtts` | 女声，少女感 |
| `zh_male_wennuaneng_moon_bigtts` | 男声，温暖 |

> 完整音色列表见 [火山引擎 TTS 音色文档](https://www.volcengine.com/docs/6561/1257544)

---

## 3. iDrome 环境变量配置

### 3.1 环境变量清单

在 Supabase Edge Function 中需要配置以下环境变量：

| 变量名 | 必填 | 示例值 | 说明 |
|--------|------|--------|------|
| `DOUBAO_API_KEY` | ✅ | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` | 火山方舟 API Key |
| `DOUBAO_API_URL` | ❌ | `https://ark.cn-beijing.volces.com/api/v3/chat/completions` | 对话 API 端点（默认值已正确） |
| `DOUBAO_MODEL` | ❌ | `ep-20260802100000-xxxx` 或 `doubao-pro-32k` | 对话模型 ID |
| `DOUBAO_ASR_URL` | ❌ | `https://ark.cn-beijing.volces.com/api/v3/audio/transcriptions` | ASR 端点（默认值已正确） |
| `DOUBAO_TTS_URL` | ❌ | `https://ark.cn-beijing.volces.com/api/v3/audio/speech` | TTS 端点（默认值已正确） |
| `DOUBAO_ASR_MODEL` | ❌ | `Doubao-Seed-ASR-2.0` 或接入点 ID | 语音识别模型 |
| `DOUBAO_TTS_MODEL` | ❌ | `doubao-tts` 或接入点 ID | 语音合成模型 |
| `DOUBAO_TTS_VOICE` | ❌ | `zh_female_vv_jupiter_bigtts` | 默认 TTS 音色 |

### 3.2 前端可选配置

在 `public/idrome/` 的 HTML 配置中，可通过 `window.IDROME_CONFIG` 指定视觉模型：

```javascript
window.IDROME_CONFIG = {
  supabaseUrl: 'https://your-project.supabase.co',
  doubaoVisionModel: 'doubao-vision-pro-32k'  // 或你的视觉模型接入点 ID
}
```

---

## 4. Supabase Edge Function 部署

### 4.1 设置环境变量

通过 Supabase CLI 或 Dashboard 设置 Edge Function 环境变量：

```bash
# 对话代理（chat-proxy）
supabase secrets set DOUBAO_API_KEY=你的APIKey
supabase secrets set DOUBAO_MODEL=ep-20260802100000-xxxx

# 语音代理（voice-proxy）— DOUBAO_API_KEY 已设置，无需重复
supabase secrets set DOUBAO_ASR_MODEL=Doubao-Seed-ASR-2.0
supabase secrets set DOUBAO_TTS_MODEL=doubao-tts
supabase secrets set DOUBAO_TTS_VOICE=zh_female_vv_jupiter_bigtts
```

或通过 Supabase Dashboard：
1. 进入项目 → Edge Functions → Secrets
2. 逐个添加上述环境变量

### 4.2 部署 Edge Functions

```bash
# 部署对话代理
supabase functions deploy chat-proxy --no-verify-jwt

# 部署语音代理
supabase functions deploy voice-proxy --no-verify-jwt
```

### 4.3 验证部署

部署后验证 Edge Function 是否正常工作：

```bash
# 验证 chat-proxy 健康检查
curl -X POST https://你的项目.supabase.co/functions/v1/chat-proxy \
  -H "Content-Type: application/json" \
  -d '{"action":"healthcheck"}'

# 预期返回（doubao.apiConfigured 应为 true）：
# {"status":"ok","providers":{"deepseek":{"apiConfigured":true},"doubao":{"apiConfigured":true}}}

# 验证 voice-proxy 健康检查
curl -X POST https://你的项目.supabase.co/functions/v1/voice-proxy \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 你的JWT" \
  -d '{"action":"healthcheck"}'

# 预期返回：
# {"status":"ok","provider":"doubao","asrModel":"...","ttsModel":"...","apiConfigured":true}
```

---

## 5. 功能验证清单

部署后逐项验证：

### 5.1 对话模型切换

- [ ] 打开 iDrome，进入设置面板
- [ ] 在模型选择器中选择 `Doubao-Seed-2.1`
- [ ] 发送一条测试消息（如"你好"）
- [ ] 确认 AI 正常回复（不再出现"服务器不可用"）
- [ ] 浏览器控制台无 503 错误

### 5.2 图片识别（OCR）

- [ ] 点击附件按钮（📎）
- [ ] 选择一张包含文字的图片
- [ ] 确认提示"正在识别图片..."
- [ ] 确认识别结果填入输入框
- [ ] 测试不同格式：JPG、PNG、WebP

### 5.3 语音输入（ASR）

- [ ] 点击语音按钮（🎤）
- [ ] 确认按钮变红色脉冲动画
- [ ] 对麦克风说话
- [ ] 再次点击停止录音
- [ ] 确认提示"正在识别语音..."
- [ ] 确认识别文本填入输入框

### 5.4 语音朗读（TTS）

- [ ] 发送一条 AI 消息
- [ ] 点击朗读按钮（🔊）
- [ ] 确认开始播放语音
- [ ] 测试暂停/继续功能
- [ ] 确认播放结束后按钮恢复

---

## 6. 常见问题排查

### 6.1 "豆包 服务暂时不可用"

**原因**：前端 healthCheck 检测到 `DOUBAO_API_KEY` 未配置

**排查步骤**：
1. 检查 Supabase Edge Function 环境变量 `DOUBAO_API_KEY` 是否已设置
   ```bash
   supabase secrets list
   ```
2. 调用 healthcheck 端点确认 `doubao.apiConfigured` 为 `true`
3. 若为 `false`，重新设置 API Key 并重新部署 Edge Function

### 6.2 "豆包 API 错误: 401"

**原因**：API Key 无效或已过期

**排查步骤**：
1. 登录 [火山方舟控制台](https://console.volcengine.com/ark) → API Key 管理
2. 确认 API Key 仍然有效
3. 重新创建 API Key 并更新 Supabase secrets

### 6.3 "豆包 API 错误: 404"

**原因**：模型 ID 或接入点 ID 不正确

**排查步骤**：
1. 进入方舟控制台 → 推理接入点
2. 复制正确的接入点 ID（`ep-xxxx` 格式）
3. 更新 `DOUBAO_MODEL` 环境变量
4. 重新部署 Edge Function

### 6.4 "豆包 API 错误: 403"

**原因**：模型未开通或账号欠费

**排查步骤**：
1. 进入方舟控制台 → 模型广场
2. 确认所需模型已开通
3. 检查账户余额是否充足
4. 确认 API Key 有对应模型的调用权限

### 6.5 语音识别返回空结果

**原因**：音频格式不兼容或录音时间过短

**排查步骤**：
1. 确保录音时长 > 0.5 秒
2. 检查浏览器麦克风权限
3. 查看浏览器控制台是否有 `convertToPCM` 相关错误
4. 确认 `DOUBAO_ASR_MODEL` 设置正确
5. 检查 Edge Function 日志：
   ```bash
   supabase functions logs voice-proxy
   ```

### 6.6 语音合成播放失败

**原因**：TTS 模型 ID 或音色 ID 不正确

**排查步骤**：
1. 确认 `DOUBAO_TTS_MODEL` 设置为 `doubao-tts` 或你的 TTS 接入点 ID
2. 确认 `DOUBAO_TTS_VOICE` 设置为有效的音色 ID
3. 检查 TTS 返回是否为空（Edge Function 日志中搜索 `tts_success`）
4. 确认文本长度未超过 1024 字符

### 6.7 图片识别失败

**原因**：视觉模型未开通或模型 ID 错误

**排查步骤**：
1. 确认 `doubao-vision-pro-32k` 模型已在方舟控制台开通
2. 检查 `window.IDROME_CONFIG.doubaoVisionModel` 是否设置
3. 查看浏览器控制台 `[Vision]` 日志
4. 确认 chat-proxy 正确路由到豆包 API（日志中搜索 `路由到 豆包`）

### 6.8 对话回复有乱码

**原因**：豆包 API 返回的编码问题

**排查步骤**：
1. 确认 chat-proxy 请求头包含 `Content-Type: application/json`
2. 检查 Edge Function 日志中是否有编码相关错误
3. 确认 `stream: false` 模式下 JSON 解析正常

---

## 附录：API 端点对照表

| 功能 | 火山方舟 API 端点 | 请求格式 | 响应格式 |
|------|-------------------|----------|----------|
| 对话 | `POST /api/v3/chat/completions` | OpenAI 兼容 | JSON（非流式）或 SSE（流式） |
| 图片识别 | 同对话端点，messages 含 image_url | OpenAI Vision 格式 | JSON |
| 语音识别 | `POST /api/v3/audio/transcriptions` | multipart/form-data | JSON `{text: "..."}` |
| 语音合成 | `POST /api/v3/audio/speech` | JSON | 二进制音频（MP3） |

> **API Base URL**：`https://ark.cn-beijing.volces.com`
> **认证方式**：`Authorization: Bearer {API_KEY}`
> **文档地址**：[火山方舟 API 文档](https://www.volcengine.com/docs/82379)

---

## 附录：与 DeepSeek 的对比

| 特性 | DeepSeek | 豆包（火山方舟） |
|------|----------|------------------|
| 对话 API | `api.deepseek.com/v1/chat/completions` | `ark.cn-beijing.volces.com/api/v3/chat/completions` |
| 深度思考 | 支持 `thinking` 参数 | 不支持 `thinking` 参数 |
| 图片识别 | 需 VL 模型 | 原生支持（doubao-vision-pro） |
| 语音 ASR | 不支持 | 支持（Doubao-Seed-ASR） |
| 语音 TTS | 不支持 | 支持（doubao-tts） |
| stream_options | 支持 | 不完全兼容（已从豆包请求中移除） |
