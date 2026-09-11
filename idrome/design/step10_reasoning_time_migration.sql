-- ============================================================
-- iDrome Step 10 — messages 表新增 reasoning_time 字段
--
-- 存储 AI 思考过程所花费的时间（格式：X.Xs）
--
-- 执行方式：在 Supabase Dashboard → SQL Editor 中粘贴并执行
-- ============================================================

-- 1. 新增 reasoning_time 字段（TEXT 类型，存储如 "3.2s" 格式）
ALTER TABLE messages ADD COLUMN IF NOT EXISTS reasoning_time TEXT;

-- 2. 更新 update_message_with_version RPC 函数，支持 reasoning_time
CREATE OR REPLACE FUNCTION update_message_with_version(
  msg_id UUID,
  new_content TEXT,
  new_reasoning TEXT,
  new_reasoning_time TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  UPDATE messages
  SET content = new_content,
      reasoning = new_reasoning,
      reasoning_time = COALESCE(new_reasoning_time, reasoning_time),
      version = version + 1,
      updated_at = now()
  WHERE id = msg_id;
END;
$$ LANGUAGE plpgsql;

-- 3. 验证
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'reasoning_time';
