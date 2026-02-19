CREATE EXTENSION IF NOT EXISTS "pgcrypto";

INSERT INTO auth.users (
  id, instance_id, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data,
  is_super_admin, role, aud,
  confirmation_token, recovery_token,
  email_change, email_change_token_new, email_change_token_current,
  phone_change, phone_change_token, reauthentication_token
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'test@faith-app.local',
  crypt('password123', gen_salt('bf')),
  NOW(), NOW(), NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Test User"}'::jsonb,
  false, 'authenticated', 'authenticated',
  '', '', '', '', '', '', '', ''
);

INSERT INTO auth.identities (
  id, user_id, provider_id, identity_data, provider,
  last_sign_in_at, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  '{"sub":"11111111-1111-1111-1111-111111111111","email":"test@faith-app.local"}'::jsonb,
  'email',
  NOW(), NOW(), NOW()
);

INSERT INTO public.user_lesson_progress (
  user_id, lesson_id, module_id, completed, video_position_seconds, completed_at
) VALUES
  ('11111111-1111-1111-1111-111111111111', 'module-1-lesson-1', 'module-1', true, 0, NOW()),
  ('11111111-1111-1111-1111-111111111111', 'module-1-lesson-2', 'module-1', true, 0, NOW()),
  ('11111111-1111-1111-1111-111111111111', 'module-1-lesson-3', 'module-1', true, 0, NOW()),
  ('11111111-1111-1111-1111-111111111111', 'module-1-lesson-4', 'module-1', true, 0, NOW()),
  ('11111111-1111-1111-1111-111111111111', 'module-1-lesson-5', 'module-1', true, 0, NOW()),
  ('11111111-1111-1111-1111-111111111111', 'module-2-lesson-1', 'module-2', true, 0, NOW()),
  ('11111111-1111-1111-1111-111111111111', 'module-2-lesson-2', 'module-2', true, 0, NOW());

INSERT INTO public.user_module_progress (
  user_id, module_id, status, progress_percentage, completed_at
) VALUES
  ('11111111-1111-1111-1111-111111111111', 'module-1', 'completed', 100, NOW()),
  ('11111111-1111-1111-1111-111111111111', 'module-2', 'in_progress', 40, NULL);

INSERT INTO public.user_quiz_attempts (
  user_id, module_id, attempt_number, score_percentage, passed, answers, completed_at
) VALUES
  ('11111111-1111-1111-1111-111111111111', 'module-1', 1, 92, true, NULL, NOW()),
  ('11111111-1111-1111-1111-111111111111', 'module-2', 1, 85, true, NULL, NOW());
