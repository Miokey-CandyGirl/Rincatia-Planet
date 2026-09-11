-- ============================================================
-- iDrome Step 6: 知识库文件存储 — 数据库迁移 SQL
-- 依据：AI应用分步执行.md 步骤6 + AI应用设计方案.md 第14章
--
-- 目的：
-- 1. 创建 knowledge_base_files 表（用户知识库文件元数据）
-- 2. 启用 RLS 行级安全，限制用户只能访问自己的文件记录
-- 3. 创建 user_knowledge_base Storage Bucket（私有桶）
-- 4. 配置 Storage RLS 策略，限制用户只能访问 /{user_id}/ 路径下的文件
-- 5. 兼容已存在的表 — 使用 ALTER TABLE ADD COLUMN IF NOT EXISTS 补充缺失列
--
-- 执行方式：在 Supabase Dashboard → SQL Editor 中执行
-- 前置条件：auth.users 表存在（Supabase 项目默认存在）
--
-- 说明：
--   - file-proxy Edge Function 使用 service_role 密钥写入，绕过 RLS
--   - 前端直接访问 Storage 时受 RLS 限制，仅能操作自身路径
-- ============================================================

-- ============================================================
-- 1. knowledge_base_files 表（知识库文件元数据）
-- ============================================================
CREATE TABLE IF NOT EXISTS knowledge_base_files (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_size bigint,
  file_path text,
  file_type text,
  extracted_text text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, file_name)
);

-- 索引（便于按用户查询）
CREATE INDEX IF NOT EXISTS idx_kb_files_user_id ON knowledge_base_files(user_id);

-- 启用行级安全
ALTER TABLE knowledge_base_files ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 1.5 兼容已存在的表 — 补充缺失列（IF NOT EXISTS 确保幂等）
--     若 knowledge_base_files 在早期版本已创建但缺少列，此处补充
-- ============================================================
ALTER TABLE knowledge_base_files ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE knowledge_base_files ADD COLUMN IF NOT EXISTS file_name text NOT NULL DEFAULT '';
ALTER TABLE knowledge_base_files ADD COLUMN IF NOT EXISTS file_size bigint;
ALTER TABLE knowledge_base_files ADD COLUMN IF NOT EXISTS file_path text;
ALTER TABLE knowledge_base_files ADD COLUMN IF NOT EXISTS file_type text;
ALTER TABLE knowledge_base_files ADD COLUMN IF NOT EXISTS extracted_text text;
ALTER TABLE knowledge_base_files ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
ALTER TABLE knowledge_base_files ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- ============================================================
-- 2. RLS 策略 — knowledge_base_files 表
--    用户只能 SELECT/INSERT/UPDATE/DELETE 自己的知识库文件记录
--    注意：file-proxy Edge Function 使用 service_role 写入，绕过 RLS
-- ============================================================

-- SELECT — 用户可查询自己的文件
DROP POLICY IF EXISTS "Users can select own kb_files" ON knowledge_base_files;
CREATE POLICY "Users can select own kb_files"
  ON knowledge_base_files FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT — 用户可新增自己的文件记录
DROP POLICY IF EXISTS "Users can insert own kb_files" ON knowledge_base_files;
CREATE POLICY "Users can insert own kb_files"
  ON knowledge_base_files FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE — 用户可更新自己的文件记录
DROP POLICY IF EXISTS "Users can update own kb_files" ON knowledge_base_files;
CREATE POLICY "Users can update own kb_files"
  ON knowledge_base_files FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE — 用户可删除自己的文件记录
DROP POLICY IF EXISTS "Users can delete own kb_files" ON knowledge_base_files;
CREATE POLICY "Users can delete own kb_files"
  ON knowledge_base_files FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- 3. updated_at 自动更新触发器（复用 step5 中已定义的函数）
--    若 update_updated_at_column() 不存在则在此创建
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_kb_files_updated_at ON knowledge_base_files;
CREATE TRIGGER trigger_kb_files_updated_at
  BEFORE UPDATE ON knowledge_base_files
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 4. 创建 Storage Bucket — user_knowledge_base（私有桶）
--    public=false 表示文件不可公开访问，必须通过签名 URL 或 RLS 鉴权访问
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('user_knowledge_base', 'user_knowledge_base', false)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 5. Storage RLS 策略 — user_knowledge_base 桶
--    限制用户只能访问 /{user_id}/ 路径下的文件
--    存储路径约定：user_knowledge_base/{user_id}/{file_name}
-- ============================================================

-- SELECT — 用户可读取自己路径下的文件
DROP POLICY IF EXISTS "Users can read own kb storage" ON storage.objects;
CREATE POLICY "Users can read own kb storage"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'user_knowledge_base'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- INSERT — 用户可上传文件到自己的路径
DROP POLICY IF EXISTS "Users can upload to own kb storage" ON storage.objects;
CREATE POLICY "Users can upload to own kb storage"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'user_knowledge_base'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- UPDATE — 用户可修改自己路径下的文件
DROP POLICY IF EXISTS "Users can update own kb storage" ON storage.objects;
CREATE POLICY "Users can update own kb storage"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'user_knowledge_base'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'user_knowledge_base'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- DELETE — 用户可删除自己路径下的文件
DROP POLICY IF EXISTS "Users can delete own kb storage" ON storage.objects;
CREATE POLICY "Users can delete own kb storage"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'user_knowledge_base'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================================
-- 6. 验证
-- ============================================================
-- 执行后请在 Supabase Dashboard 中确认：
--
-- Table Editor:
--   - knowledge_base_files 表存在，含字段：
--     id / user_id / file_name / file_size / file_path / file_type /
--     extracted_text / created_at / updated_at
--   - RLS 已启用（表格名称旁有盾牌图标）
--   - UNIQUE(user_id, file_name) 约束存在
--
-- Database → Policies:
--   - knowledge_base_files 表有 4 条 RLS 策略
--     (select / insert / update / delete own kb_files)
--
-- Storage:
--   - user_knowledge_base 桶存在，public=false
--   - 该桶有 4 条 RLS 策略
--     (read / upload / update / delete own kb storage)
--
-- Database → Triggers:
--   - trigger_kb_files_updated_at 触发器存在
--
-- 验证查询：
--   SELECT * FROM knowledge_base_files WHERE user_id = auth.uid();
--   SELECT id, name, public FROM storage.buckets WHERE id = 'user_knowledge_base';
