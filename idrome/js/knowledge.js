/**
 * iDrome — 知识库管理
 *
 * 步骤 6 实现：
 * - KnowledgeLoader 类：加载 mode/ 目录下 system-prompt.md
 * - parseVersion() 解析首行 # version: N
 * - 占位符替换：[vocabulary] [grammar] [worldSetting] [novel] [characters]
 * - 辅助知识库文件加载（vocabulary.md / grammar.md / world-setting.md 等）
 * - 知识库更新与缓存（clearCache on upload）
 * - 个人知识库：Supabase user_knowledge_base bucket
 * - 字符限制：knowledgeCharLimit
 *
 * Embedding API 备选方案（步骤 11 可选）：
 * - 方案 A：DeepSeek Embedding
 * - 方案 B：OpenAI Embedding
 * - 方案 C：Jina Embedding
 * - 方案 D：全量注入（不使用 Embedding）
 */

'use strict'

// TODO: 步骤 6 实现
