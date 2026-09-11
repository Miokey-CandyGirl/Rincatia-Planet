-- ============================================================
-- iDrome Step 9 — 对话分组数据表迁移
--
-- 创建 conversation_groups 表：存储用户自定义分组
-- 修改 conversations 表：添加 custom_group_id 字段
--
-- 执行方式：在 Supabase Dashboard → SQL Editor 中粘贴并执行
-- ============================================================

-- 1. 创建分组表
CREATE TABLE IF NOT EXISTS conversation_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 为 conversations 表添加 custom_group_id 字段
ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS custom_group_id UUID REFERENCES conversation_groups(id) ON DELETE SET NULL;

-- 3. 索引
CREATE INDEX IF NOT EXISTS idx_conversation_groups_user_id
  ON conversation_groups(user_id);

CREATE INDEX IF NOT EXISTS idx_conversations_custom_group_id
  ON conversations(custom_group_id);

-- 4. RLS 策略
ALTER TABLE conversation_groups ENABLE ROW LEVEL SECURITY;

-- 用户只能操作自己的分组
CREATE POLICY "用户可查看自己的分组"
  ON conversation_groups FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "用户可创建自己的分组"
  ON conversation_groups FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可更新自己的分组"
  ON conversation_groups FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "用户可删除自己的分组"
  ON conversation_groups FOR DELETE
  USING (auth.uid() = user_id);

-- 5. 更新 conversations 表的 RLS（确保用户只能将自己的对话分配到分组）
-- conversations 表已有 RLS 策略，无需重复创建

-- 6. 验证
-- SELECT 'conversation_groups 表创建成功' as status;
