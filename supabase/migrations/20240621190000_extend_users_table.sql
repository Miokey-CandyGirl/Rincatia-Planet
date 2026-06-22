-- 扩展 users 表，添加用户个人资料字段
-- 支持：地理位置、性别、生日、个性签名、封禁状态、更新时间

-- 注意：如果某些列已存在，ALTER TABLE ADD COLUMN 会报错，
-- 请根据实际情况调整。建议在 Supabase SQL Editor 中逐条执行。

-- 1. 添加新字段（如果 phone 列不存在也一并添加）
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS phone text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS email text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS bio text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS location text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS gender text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS birthday date DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS signature text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS is_banned boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- 2. 创建 updated_at 自动更新触发器
CREATE OR REPLACE FUNCTION public.update_users_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_users_updated_at ON public.users;
CREATE TRIGGER trigger_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_users_updated_at();

-- 3. 更新演示账号的扩展字段（用 id 匹配，因为 phone 列可能尚未创建）
UPDATE public.users
SET location = '琳凯蒂亚星球·青竹区',
    gender = '保密',
    signature = '欢迎来到琳凯蒂亚星球！',
    updated_at = now()
WHERE id = 'b0000000-0000-4000-8000-000000000001';

UPDATE public.users
SET location = '琳凯蒂亚星球·管理中心',
    gender = '保密',
    signature = '琳凯蒂亚星球管理员，守护这片星空。',
    updated_at = now()
WHERE id = 'b0000000-0000-4000-8000-000000000002';

-- 4. 创建 Storage Bucket 用于头像上传（在 Supabase 控制台 Storage 中操作，或通过 API）
-- Bucket 名称: avatars
-- 权限: 公开读取，登录用户可上传

-- 5. 确保 RLS 已启用并配置 users 表策略（允许用户更新自己的资料）
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 允许用户读取所有用户的基本信息（公开资料）
DROP POLICY IF EXISTS "Users are viewable by everyone" ON public.users;
CREATE POLICY "Users are viewable by everyone"
  ON public.users FOR SELECT
  USING (true);

-- 允许用户更新自己的资料
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 允许用户插入自己的记录（注册时）
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 6. 确保 posts 和 comments 表也有 RLS 策略
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Posts are viewable by everyone" ON public.posts;
CREATE POLICY "Posts are viewable by everyone"
  ON public.posts FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.posts;
CREATE POLICY "Authenticated users can create posts"
  ON public.posts FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own posts" ON public.posts;
CREATE POLICY "Users can update own posts"
  ON public.posts FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own posts" ON public.posts;
CREATE POLICY "Users can delete own posts"
  ON public.posts FOR DELETE
  USING (auth.uid() = user_id);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Comments are viewable by everyone" ON public.comments;
CREATE POLICY "Comments are viewable by everyone"
  ON public.comments FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can create comments" ON public.comments;
CREATE POLICY "Authenticated users can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own comments" ON public.comments;
CREATE POLICY "Users can delete own comments"
  ON public.comments FOR DELETE
  USING (auth.uid() = user_id);