/**
 * iDrome — 全局状态定义
 *
 * 按设计方案第 31.4 节定义全部状态字段：
 * - currentUser, conversations, currentConversationId, messages
 * - deepThinkingEnabled, webSearchEnabled
 * - currentMode, modeLocked
 * - knowledgeCharLimit, knowledgeBaseFiles
 * - navPanelOpen, isGenerating, inputContent
 * - theme, fontSize
 */

'use strict'

import { createStore } from './store.js'

export const { state, subscribe } = createStore({
  // 用户状态
  currentUser: null,

  // 对话状态
  conversations: [],
  currentConversationId: null,
  messages: [],

  // 功能开关
  deepThinkingEnabled: false,
  webSearchEnabled: false,

  // 模式
  currentMode: 'general',
  modeLocked: false,

  // 模型与参数（Step 5 新增）
  currentModel: 'deepseek-v4-flash',
  modelParams: {
    temperature: 0.7,
    maxTokens: 4096
  },

  // 个人知识库
  knowledgeCharLimit: 3000,
  knowledgeBaseFiles: [],

  // UI 状态
  navPanelOpen: false,
  isGenerating: false,
  isPaused: false,
  inputContent: '',

  // 设置
  theme: 'light',
  fontSize: 15
})
