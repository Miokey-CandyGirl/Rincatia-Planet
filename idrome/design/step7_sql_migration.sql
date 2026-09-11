-- ============================================================
-- iDrome Step 7: 思考文本存储修复 + 搜索功能准备 — 数据库迁移 SQL
--
-- 目的：
-- 1. 确保 messages 表包含 reasoning/version/expired/user_id 字段
--    （CREATE TABLE IF NOT EXISTS 不会为已存在的表添加新列，需用 ALTER TABLE）
-- 2. 创建/替换 update_message_with_version RPC 函数
-- 3. 确保 conversations 表包含 model_version 字段
--
-- 执行方式：在 Supabase Dashboard → SQL Editor 中执行
-- ============================================================

-- ============================================================
-- 1. messages 表 — 补充缺失字段（IF NOT EXISTS 确保幂等）
-- ============================================================
ALTER TABLE messages ADD COLUMN IF NOT EXISTS reasoning text;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS expired boolean DEFAULT false;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS version integer DEFAULT 1;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- user_id 索引（便于 RLS 查询）
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);

-- ============================================================
-- 2. conversations 表 — 补充 model_version 字段
-- ============================================================
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS model_version text;

-- ============================================================
-- 3. 消息乐观锁更新 RPC（version 自增 + reasoning 存储）
--    使用 COALESCE 确保 reasoning 为 NULL 时不覆盖已有值
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
-- 4. 验证
-- ============================================================
-- 执行后请在 Supabase Dashboard → Table Editor 中确认：
--   - messages 表含 reasoning/expired/version/user_id 字段
--   - conversations 表含 model_version 字段
--   - update_message_with_version 函数存在（Database → Functions）
--
-- 验证 RPC：
--   SELECT update_message_with_version(1, '测试内容', '测试思考过程');
