-- ============================================================
-- iDrome Step 11 — 搜索引用持久化表迁移
--
-- 创建 message_search_references 表：存储 AI 回复中引用的搜索结果
-- 重新进入对话后可恢复引用链接和参考来源列表
--
-- 执行方式：在 Supabase Dashboard → SQL Editor 中粘贴并执行
-- ============================================================

-- 1. 创建搜索引用表
CREATE TABLE IF NOT EXISTS message_search_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id BIGINT NOT NULL UNIQUE REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  search_results JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 1.1 如果表已存在但缺少 UNIQUE 约束，补充添加
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'message_search_references_message_id_key'
      AND conrelid = 'message_search_references'::regclass
  ) THEN
    ALTER TABLE message_search_references ADD CONSTRAINT message_search_references_message_id_key UNIQUE (message_id);
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE '添加 UNIQUE 约束时出现异常（可能已存在）: %', SQLERRM;
END $$;

-- 1.2 如果表已存在但缺少 updated_at 列，补充添加
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'message_search_references' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE message_search_references ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE '添加 updated_at 列时出现异常: %', SQLERRM;
END $$;

-- 2. 索引
CREATE INDEX IF NOT EXISTS idx_message_search_references_message_id
  ON message_search_references(message_id);

CREATE INDEX IF NOT EXISTS idx_message_search_references_user_id
  ON message_search_references(user_id);

-- 3. RLS 策略
ALTER TABLE message_search_references ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的搜索引用
CREATE POLICY "用户可查看自己的搜索引用"
  ON message_search_references FOR SELECT
  USING (auth.uid() = user_id);

-- 用户只能创建自己的搜索引用
CREATE POLICY "用户可创建自己的搜索引用"
  ON message_search_references FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 用户只能更新自己的搜索引用
CREATE POLICY "用户可更新自己的搜索引用"
  ON message_search_references FOR UPDATE
  USING (auth.uid() = user_id);

-- 用户只能删除自己的搜索引用
CREATE POLICY "用户可删除自己的搜索引用"
  ON message_search_references FOR DELETE
  USING (auth.uid() = user_id);

-- 4. 验证
-- SELECT 'message_search_references 表创建成功' as status;
