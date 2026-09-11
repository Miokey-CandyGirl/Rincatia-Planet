-- ============================================================
-- iDrome Step 5: 增量迁移 SQL — 补全缺失字段
-- 依据：用户反馈 conversations 缺失 model、messages 缺失 version
--
-- 执行方式：在 Supabase Dashboard → SQL Editor 中执行
-- 说明：使用 ADD COLUMN IF NOT EXISTS 确保可重复执行，不会报错
-- ============================================================

-- ============================================================
-- 1. conversations 表 — 补全缺失字段
-- ============================================================

-- model 字段（模型名称）
ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS model text DEFAULT 'deepseek-v4-flash';

-- model_version 字段（模型版本号）
ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS model_version text;

-- mode 字段（对话模式：general / tian-translation / novel-culture）
ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS mode text DEFAULT 'general';

-- pinned 字段（是否置顶）
ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS pinned boolean DEFAULT false;

-- archived 字段（是否归档）
ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS archived boolean DEFAULT false;

-- updated_at 字段（更新时间，若缺失则补上）
ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- ============================================================
-- 2. messages 表 — 补全缺失字段
-- ============================================================

-- version 字段（乐观锁版本号，每次更新 +1）
ALTER TABLE messages
  ADD COLUMN IF NOT EXISTS version integer DEFAULT 1;

-- reasoning 字段（AI 推理过程，深度思考模式）
ALTER TABLE messages
  ADD COLUMN IF NOT EXISTS reasoning text;

-- expired 字段（是否已过期 — 消息编辑后标记后续消息）
ALTER TABLE messages
  ADD COLUMN IF NOT EXISTS expired boolean DEFAULT false;

-- updated_at 字段（更新时间，若缺失则补上）
ALTER TABLE messages
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- ============================================================
-- 3. 补全索引（若不存在则创建）
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_archived ON conversations(user_id, archived);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id, created_at);

-- ============================================================
-- 4. 补全 RLS 策略（若表已存在但未启用 RLS）
-- ============================================================
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- conversations RLS 策略
DROP POLICY IF EXISTS "Users can manage own conversations" ON conversations;
CREATE POLICY "Users can manage own conversations"
  ON conversations FOR ALL
  USING (auth.uid() = user_id);

-- messages RLS 策略（通过子查询关联 conversations.user_id）
DROP POLICY IF EXISTS "Users can manage own messages" ON messages;
CREATE POLICY "Users can manage own messages"
  ON messages FOR ALL
  USING (
    auth.uid() = (
      SELECT user_id FROM conversations WHERE id = messages.conversation_id
    )
  );

-- ============================================================
-- 5. 补全 updated_at 自动更新触发器
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_conversations_updated_at ON conversations;
CREATE TRIGGER trigger_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_messages_updated_at ON messages;
CREATE TRIGGER trigger_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 6. 补全消息乐观锁更新 RPC（version 自增）
-- ============================================================
CREATE OR REPLACE FUNCTION update_message_with_version(
  msg_id bigint,
  new_content text,
  new_reasoning text DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  UPDATE messages
  SET content = new_content,
      reasoning = COALESCE(new_reasoning, reasoning),
      version = version + 1
  WHERE id = msg_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 7. 验证
-- ============================================================
-- 执行后请在 Supabase Dashboard → Table Editor 中确认：
--   conversations 表含：id / user_id / title / model / model_version / mode / pinned / archived / created_at / updated_at
--   messages 表含：id / conversation_id / role / content / reasoning / expired / version / created_at / updated_at
--   RLS 已启用（表格名称旁有盾牌图标）
--   索引已创建（Database → Indexes）
--
-- 提示：此脚本可安全重复执行，IF NOT EXISTS 语法确保不会报错。
