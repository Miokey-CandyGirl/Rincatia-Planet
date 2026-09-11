-- ============================================================
-- iDrome Step 5: 数据持久化 — 数据库表迁移 SQL
-- 依据：AI应用分步执行.md 步骤5.1 + AI应用设计方案.md 第13章
--
-- 执行方式：在 Supabase Dashboard → SQL Editor 中执行
-- 前置条件：usage_logs 表已在步骤 4.0 创建
-- ============================================================

-- ============================================================
-- 1. conversations 表（对话表）
-- ============================================================
CREATE TABLE IF NOT EXISTS conversations (
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

-- 索引
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_archived ON conversations(user_id, archived);

-- RLS 策略
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- 用户只能访问自己的对话
DROP POLICY IF EXISTS "Users can manage own conversations" ON conversations;
CREATE POLICY "Users can manage own conversations"
  ON conversations FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================
-- 2. messages 表（消息表）
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  role text,
  content text,
  reasoning text,
  expired boolean DEFAULT false,
  version integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id, created_at);

-- RLS 策略
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 用户只能访问自己对话中的消息
DROP POLICY IF EXISTS "Users can manage own messages" ON messages;
CREATE POLICY "Users can manage own messages"
  ON messages FOR ALL
  USING (
    auth.uid() = (
      SELECT user_id FROM conversations WHERE id = messages.conversation_id
    )
  );

-- ============================================================
-- 3. updated_at 自动更新触发器
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
-- 4. 消息乐观锁更新 RPC（version 自增）
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
-- 5. 验证
-- ============================================================
-- 执行后请在 Supabase Dashboard → Table Editor 中确认：
--   - conversations 表存在，含 id/user_id/title/model/model_version/mode/pinned/archived/created_at/updated_at 字段
--   - messages 表存在，含 id/conversation_id/role/content/reasoning/expired/version/created_at/updated_at 字段
--   - RLS 已启用（表格名称旁有盾牌图标）
--   - 索引已创建（Database → Indexes）
