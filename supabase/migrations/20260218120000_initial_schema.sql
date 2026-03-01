CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  birthdate DATE,
  country TEXT,
  city TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own record"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own record"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE TRIGGER set_updated_at_users
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_auth_user_updated()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.users
  SET email = COALESCE(NEW.email, ''),
      updated_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW
  WHEN (OLD.email IS DISTINCT FROM NEW.email)
  EXECUTE FUNCTION public.handle_auth_user_updated();

CREATE TABLE public.user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT false NOT NULL,
  video_position_seconds INTEGER DEFAULT 0 NOT NULL,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (user_id, lesson_id)
);

ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own lesson progress"
  ON public.user_lesson_progress FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER set_updated_at_user_lesson_progress
  BEFORE UPDATE ON public.user_lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE public.user_module_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'in_progress', 'completed')),
  progress_percentage INTEGER NOT NULL DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (user_id, module_id)
);

ALTER TABLE public.user_module_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own module progress"
  ON public.user_module_progress FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER set_updated_at_user_module_progress
  BEFORE UPDATE ON public.user_module_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE public.user_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  attempt_number INTEGER NOT NULL,
  score_percentage INTEGER NOT NULL CHECK (score_percentage >= 0 AND score_percentage <= 100),
  passed BOOLEAN NOT NULL,
  answers JSONB,
  correct_count INTEGER,
  total_count INTEGER,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.user_quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own quiz attempts"
  ON public.user_quiz_attempts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_user_settings_user_id ON public.user_settings(user_id);
CREATE INDEX idx_user_settings_settings_gin ON public.user_settings USING GIN (settings);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own settings"
  ON public.user_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
  ON public.user_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
  ON public.user_settings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER set_updated_at_user_settings
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE FUNCTION public.get_user_setting(p_user_id UUID, p_setting_key TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  setting_value JSONB;
BEGIN
  SELECT settings->p_setting_key INTO setting_value
  FROM public.user_settings
  WHERE user_id = p_user_id;

  RETURN setting_value;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_setting(UUID, TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION public.set_user_setting(p_user_id UUID, p_setting_key TEXT, p_setting_value JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_settings JSONB;
  user_exists BOOLEAN;
  retry_count INTEGER := 0;
BEGIN
  LOOP
    SELECT EXISTS(SELECT 1 FROM public.users WHERE id = p_user_id) INTO user_exists;

    IF user_exists THEN
      EXIT;
    END IF;

    IF retry_count >= 3 THEN
      RAISE EXCEPTION 'User record not found in public.users. Trigger may not have completed yet.';
    END IF;

    PERFORM pg_sleep(0.1);
    retry_count := retry_count + 1;
  END LOOP;

  INSERT INTO public.user_settings (user_id, settings)
  VALUES (p_user_id, jsonb_build_object(p_setting_key, p_setting_value))
  ON CONFLICT (user_id)
  DO UPDATE SET
    settings = user_settings.settings || jsonb_build_object(p_setting_key, p_setting_value),
    updated_at = NOW()
  RETURNING settings INTO updated_settings;

  RETURN updated_settings;
END;
$$;

GRANT EXECUTE ON FUNCTION public.set_user_setting(UUID, TEXT, JSONB) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_bibleschool_analytics(
  p_from TIMESTAMPTZ DEFAULT NULL,
  p_to TIMESTAMPTZ DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller_role TEXT;
  total_users BIGINT;
  module_stats JSONB;
BEGIN
  SELECT role INTO caller_role FROM public.users WHERE id = auth.uid();
  IF caller_role IS NULL OR caller_role != 'admin' THEN
    RAISE EXCEPTION 'Permission denied: admin role required';
  END IF;

  IF p_from IS NOT NULL AND p_to IS NOT NULL THEN
    SELECT COUNT(*)::BIGINT INTO total_users
    FROM public.users
    WHERE created_at >= p_from AND created_at <= p_to;

    SELECT COALESCE(jsonb_agg(
      jsonb_build_object(
        'moduleId', ump.module_id,
        'completedCount', ump.completed_count,
        'inProgressCount', ump.in_progress_count,
        'lockedCount', ump.locked_count
      ) ORDER BY ump.module_id
    ), '[]'::jsonb) INTO module_stats
    FROM (
      SELECT
        module_id,
        COUNT(*) FILTER (WHERE status = 'completed' AND completed_at IS NOT NULL AND completed_at >= p_from AND completed_at <= p_to)::INT AS completed_count,
        COUNT(*) FILTER (WHERE status = 'in_progress' AND updated_at >= p_from AND updated_at <= p_to)::INT AS in_progress_count,
        0::INT AS locked_count
      FROM public.user_module_progress
      GROUP BY module_id
    ) ump;
  ELSE
    SELECT COUNT(*)::BIGINT INTO total_users FROM public.users;

    SELECT COALESCE(jsonb_agg(
      jsonb_build_object(
        'moduleId', ump.module_id,
        'completedCount', ump.completed_count,
        'inProgressCount', ump.in_progress_count,
        'lockedCount', ump.locked_count
      ) ORDER BY ump.module_id
    ), '[]'::jsonb) INTO module_stats
    FROM (
      SELECT
        module_id,
        COUNT(*) FILTER (WHERE status = 'completed')::INT AS completed_count,
        COUNT(*) FILTER (WHERE status = 'in_progress')::INT AS in_progress_count,
        COUNT(*) FILTER (WHERE status = 'locked')::INT AS locked_count
      FROM public.user_module_progress
      GROUP BY module_id
    ) ump;
  END IF;

  RETURN jsonb_build_object(
    'totalUsers', COALESCE(total_users, 0),
    'moduleStats', COALESCE(module_stats, '[]'::jsonb)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_bibleschool_analytics(TIMESTAMPTZ, TIMESTAMPTZ) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_quiz_analytics(
  p_from TIMESTAMPTZ DEFAULT NULL,
  p_to TIMESTAMPTZ DEFAULT NULL
)

RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller_role TEXT;
  quiz_stats JSONB;
BEGIN
  SELECT role INTO caller_role FROM public.users WHERE id = auth.uid();
  IF caller_role IS NULL OR caller_role != 'admin' THEN
    RAISE EXCEPTION 'Permission denied: admin role required';
  END IF;

  IF p_from IS NOT NULL AND p_to IS NOT NULL THEN
    SELECT COALESCE(jsonb_agg(
      jsonb_build_object(
        'moduleId', q.module_id,
        'attemptCount', q.attempt_count,
        'passedCount', q.passed_count,
        'failedCount', q.failed_count,
        'avgScore', q.avg_score,
        'retryCount', q.retry_count
      ) ORDER BY q.module_id
    ), '[]'::jsonb) INTO quiz_stats
    FROM (
      SELECT
        module_id,
        COUNT(*)::INT AS attempt_count,
        COUNT(*) FILTER (WHERE passed = true)::INT AS passed_count,
        COUNT(*) FILTER (WHERE passed = false)::INT AS failed_count,
        COALESCE(ROUND(AVG(score_percentage)::numeric, 1)::int, 0) AS avg_score,
        COUNT(*) FILTER (WHERE attempt_number > 1)::INT AS retry_count
      FROM public.user_quiz_attempts
      WHERE completed_at >= p_from AND completed_at <= p_to
      GROUP BY module_id
    ) q;
  ELSE
    SELECT COALESCE(jsonb_agg(
      jsonb_build_object(
        'moduleId', q.module_id,
        'attemptCount', q.attempt_count,
        'passedCount', q.passed_count,
        'failedCount', q.failed_count,
        'avgScore', q.avg_score,
        'retryCount', q.retry_count
      ) ORDER BY q.module_id
    ), '[]'::jsonb) INTO quiz_stats
    FROM (
      SELECT
        module_id,
        COUNT(*)::INT AS attempt_count,
        COUNT(*) FILTER (WHERE passed = true)::INT AS passed_count,
        COUNT(*) FILTER (WHERE passed = false)::INT AS failed_count,
        COALESCE(ROUND(AVG(score_percentage)::numeric, 1)::int, 0) AS avg_score,
        COUNT(*) FILTER (WHERE attempt_number > 1)::INT AS retry_count
      FROM public.user_quiz_attempts
      GROUP BY module_id
    ) q;
  END IF;

  RETURN jsonb_build_object('moduleStats', COALESCE(quiz_stats, '[]'::jsonb));
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_quiz_analytics(TIMESTAMPTZ, TIMESTAMPTZ) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_admin_time_analytics(p_from TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days', p_to TIMESTAMPTZ DEFAULT NOW())
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller_role TEXT;
  new_users JSONB;
  lesson_completions JSONB;
  module_completions JSONB;
  active_users_7 INT;
  active_users_30 INT;
BEGIN
  SELECT role INTO caller_role FROM public.users WHERE id = auth.uid();
  IF caller_role IS NULL OR caller_role != 'admin' THEN
    RAISE EXCEPTION 'Permission denied: admin role required';
  END IF;

  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'date', d.date::text,
      'count', d.cnt
    ) ORDER BY d.date
  ), '[]'::jsonb) INTO new_users
  FROM (
    SELECT date_trunc('day', created_at)::date AS date, COUNT(*)::INT AS cnt
    FROM public.users
    WHERE created_at >= p_from AND created_at <= p_to
    GROUP BY date_trunc('day', created_at)
  ) d;

  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'date', d.date::text,
      'count', d.cnt
    ) ORDER BY d.date
  ), '[]'::jsonb) INTO lesson_completions
  FROM (
    SELECT date_trunc('day', completed_at)::date AS date, COUNT(*)::INT AS cnt
    FROM public.user_lesson_progress
    WHERE completed = true AND completed_at IS NOT NULL
      AND completed_at >= p_from AND completed_at <= p_to
    GROUP BY date_trunc('day', completed_at)
  ) d;

  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'date', d.date::text,
      'count', d.cnt
    ) ORDER BY d.date
  ), '[]'::jsonb) INTO module_completions
  FROM (
    SELECT date_trunc('day', completed_at)::date AS date, COUNT(*)::INT AS cnt
    FROM public.user_module_progress
    WHERE status = 'completed' AND completed_at IS NOT NULL
      AND completed_at >= p_from AND completed_at <= p_to
    GROUP BY date_trunc('day', completed_at)
  ) d;

  SELECT COUNT(DISTINCT user_id)::INT INTO active_users_7
  FROM (
    SELECT user_id FROM public.user_lesson_progress WHERE updated_at >= NOW() - INTERVAL '7 days'
    UNION
    SELECT user_id FROM public.user_module_progress WHERE updated_at >= NOW() - INTERVAL '7 days'
  ) u;

  SELECT COUNT(DISTINCT user_id)::INT INTO active_users_30
  FROM (
    SELECT user_id FROM public.user_lesson_progress WHERE updated_at >= NOW() - INTERVAL '30 days'
    UNION
    SELECT user_id FROM public.user_module_progress WHERE updated_at >= NOW() - INTERVAL '30 days'
  ) u;

  RETURN jsonb_build_object(
    'newUsersByDay', COALESCE(new_users, '[]'::jsonb),
    'lessonCompletionsByDay', COALESCE(lesson_completions, '[]'::jsonb),
    'moduleCompletionsByDay', COALESCE(module_completions, '[]'::jsonb),
    'activeUsersLast7Days', COALESCE(active_users_7, 0),
    'activeUsersLast30Days', COALESCE(active_users_30, 0)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_admin_time_analytics(TIMESTAMPTZ, TIMESTAMPTZ) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_admin_users(
  p_limit INT DEFAULT 50,
  p_offset INT DEFAULT 0,
  p_search TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller_role TEXT;
  users_json JSONB;
  total_count BIGINT;
BEGIN
  SELECT role INTO caller_role FROM public.users WHERE id = auth.uid();
  IF caller_role IS NULL OR caller_role != 'admin' THEN
    RAISE EXCEPTION 'Permission denied: admin role required';
  END IF;

  SELECT COUNT(*) INTO total_count
  FROM public.users u
  WHERE (p_search IS NULL OR p_search = '')
     OR (u.email ILIKE '%' || p_search || '%')
     OR (u.full_name ILIKE '%' || p_search || '%');

  SELECT COALESCE(jsonb_agg(row_data ORDER BY (row_data->>'createdAt') DESC), '[]'::jsonb) INTO users_json
  FROM (
    SELECT jsonb_build_object(
      'id', u.id,
      'email', u.email,
      'fullName', u.full_name,
      'role', u.role,
      'createdAt', u.created_at,
      'lastActivity', (
        SELECT GREATEST(
          (SELECT MAX(updated_at) FROM public.user_lesson_progress WHERE user_id = u.id),
          (SELECT MAX(updated_at) FROM public.user_module_progress WHERE user_id = u.id)
        )
      )
    ) AS row_data
    FROM public.users u
    WHERE (p_search IS NULL OR p_search = '')
       OR (u.email ILIKE '%' || p_search || '%')
       OR (u.full_name ILIKE '%' || p_search || '%')
    ORDER BY u.created_at DESC
    LIMIT p_limit
    OFFSET p_offset
  ) sub;

  RETURN jsonb_build_object(
    'users', COALESCE(users_json, '[]'::jsonb),
    'totalCount', COALESCE(total_count, 0)
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.get_admin_user_detail(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller_role TEXT;
  user_info JSONB;
  module_progress JSONB;
  lesson_completed_count INT;
  quiz_stats JSONB;
BEGIN
  SELECT role INTO caller_role FROM public.users WHERE id = auth.uid();
  IF caller_role IS NULL OR caller_role != 'admin' THEN
    RAISE EXCEPTION 'Permission denied: admin role required';
  END IF;

  SELECT jsonb_build_object(
    'id', u.id,
    'email', u.email,
    'fullName', u.full_name,
    'role', u.role,
    'createdAt', u.created_at,
    'updatedAt', u.updated_at
  ) INTO user_info
  FROM public.users u
  WHERE u.id = p_user_id;

  IF user_info IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT COUNT(*)::INT INTO lesson_completed_count
  FROM public.user_lesson_progress
  WHERE user_id = p_user_id AND completed = true;

  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'moduleId', mp.module_id,
      'status', mp.status,
      'progressPercentage', mp.progress_percentage,
      'completedAt', mp.completed_at
    ) ORDER BY mp.module_id
  ), '[]'::jsonb) INTO module_progress
  FROM public.user_module_progress mp
  WHERE mp.user_id = p_user_id;

  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'moduleId', q.module_id,
      'attemptNumber', q.attempt_number,
      'scorePercentage', q.score_percentage,
      'passed', q.passed,
      'completedAt', q.completed_at
    ) ORDER BY q.completed_at DESC
  ), '[]'::jsonb) INTO quiz_stats
  FROM public.user_quiz_attempts q
  WHERE q.user_id = p_user_id;

  RETURN jsonb_build_object(
    'user', user_info,
    'lessonCompletedCount', COALESCE(lesson_completed_count, 0),
    'moduleProgress', COALESCE(module_progress, '[]'::jsonb),
    'quizAttempts', COALESCE(quiz_stats, '[]'::jsonb)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_admin_users(INT, INT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_user_detail(UUID) TO authenticated;
