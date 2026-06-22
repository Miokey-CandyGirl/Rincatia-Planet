-- 种子数据：为演示测试账号创建 Supabase Auth 用户和 public.users 记录
-- 普通用户：19908162025，验证码 150808
-- 管理员用户：19708162025，验证码 150808
-- 这两个账号被视为已成功注册的正式用户，与正常接收验证码的用户体验无异

-- ============================================================
-- 1. 创建 auth.users 记录（使用固定 UUID 确保一致性）
-- ============================================================

-- 普通用户
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  phone,
  phone_confirmed_at,
  last_sign_in_at,
  raw_user_meta_data,
  raw_app_meta_data,
  created_at,
  updated_at,
  is_super_admin,
  is_sso_user,
  deleted_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'b0000000-0000-4000-8000-000000000001',
  'authenticated',
  'authenticated',
  '19908162025@phone.rincatia.local',
  crypt('150808', gen_salt('bf')),
  now(),
  '19908162025',
  now(),
  now(),
  '{"nickname": "琳凯蒂亚居民", "phone": "19908162025"}',
  '{"provider": "sms", "demo": true}',
  now(),
  now(),
  false,
  false,
  null
)
ON CONFLICT (id) DO UPDATE SET encrypted_password = crypt('150808', gen_salt('bf'));

-- 管理员用户
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  phone,
  phone_confirmed_at,
  last_sign_in_at,
  raw_user_meta_data,
  raw_app_meta_data,
  created_at,
  updated_at,
  is_super_admin,
  is_sso_user,
  deleted_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'b0000000-0000-4000-8000-000000000002',
  'authenticated',
  'authenticated',
  '19708162025@phone.rincatia.local',
  crypt('150808', gen_salt('bf')),
  now(),
  '19708162025',
  now(),
  now(),
  '{"nickname": "琳凯蒂亚管理员", "phone": "19708162025"}',
  '{"provider": "sms", "demo": true}',
  now(),
  now(),
  false,
  false,
  null
)
ON CONFLICT (id) DO UPDATE SET encrypted_password = crypt('150808', gen_salt('bf'));

-- ============================================================
-- 2. 创建 public.users 记录（关联 auth.users）
-- ============================================================

-- 普通用户
INSERT INTO public.users (
  id,
  phone,
  email,
  nickname,
  role,
  avatar_url,
  post_count,
  is_banned,
  created_at,
  bio,
  location,
  gender,
  signature
) VALUES (
  'b0000000-0000-4000-8000-000000000001',
  '19908162025',
  '19908162025@phone.rincatia.local',
  '琳凯蒂亚居民',
  'user',
  '',
  0,
  false,
  now(),
  '这个人很懒，什么都没写...',
  '琳凯蒂亚星球·青竹区',
  '保密',
  '欢迎来到琳凯蒂亚星球！'
)
ON CONFLICT (id) DO NOTHING;

-- 管理员用户
INSERT INTO public.users (
  id,
  phone,
  email,
  nickname,
  role,
  avatar_url,
  post_count,
  is_banned,
  created_at,
  bio,
  location,
  gender,
  signature
) VALUES (
  'b0000000-0000-4000-8000-000000000002',
  '19708162025',
  '19708162025@phone.rincatia.local',
  '琳凯蒂亚管理员',
  'admin',
  '',
  0,
  false,
  now(),
  '琳凯蒂亚星球管理员，守护这片星空。',
  '琳凯蒂亚星球·管理中心',
  '保密',
  '琳凯蒂亚星球管理员，守护这片星空。'
)
ON CONFLICT (id) DO NOTHING;