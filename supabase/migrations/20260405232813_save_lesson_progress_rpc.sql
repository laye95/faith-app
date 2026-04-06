CREATE OR REPLACE FUNCTION public.save_lesson_progress(
  p_user_id UUID,
  p_lesson_id TEXT,
  p_module_id TEXT,
  p_video_position_seconds INT,
  p_lesson_count INT,
  p_completed BOOLEAN DEFAULT FALSE,
  p_completed_at TIMESTAMPTZ DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_mod_status TEXT;
  v_completed_count INT;
  v_progress_pct INT;
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'not allowed';
  END IF;

  IF p_lesson_count IS NULL THEN
    RAISE EXCEPTION 'p_lesson_count is required';
  END IF;

  INSERT INTO public.user_lesson_progress (
    user_id,
    lesson_id,
    module_id,
    video_position_seconds,
    completed,
    completed_at
  )
  VALUES (
    p_user_id,
    p_lesson_id,
    p_module_id,
    p_video_position_seconds,
    COALESCE(p_completed, FALSE),
    CASE WHEN COALESCE(p_completed, FALSE) THEN COALESCE(p_completed_at, NOW()) ELSE NULL END
  )
  ON CONFLICT (user_id, lesson_id) DO UPDATE SET
    module_id = EXCLUDED.module_id,
    video_position_seconds = CASE
      WHEN p_completed THEN GREATEST(EXCLUDED.video_position_seconds, user_lesson_progress.video_position_seconds)
      ELSE EXCLUDED.video_position_seconds
    END,
    completed = CASE WHEN p_completed THEN TRUE ELSE user_lesson_progress.completed END,
    completed_at = CASE
      WHEN p_completed THEN COALESCE(p_completed_at, NOW())
      ELSE user_lesson_progress.completed_at
    END,
    updated_at = NOW();

  IF p_completed THEN
    SELECT COUNT(*)::INT INTO v_completed_count
    FROM public.user_lesson_progress
    WHERE user_id = p_user_id AND module_id = p_module_id AND completed = TRUE;

    v_progress_pct := CASE
      WHEN p_lesson_count > 0 AND v_completed_count > 0 THEN
        ROUND((v_completed_count::NUMERIC / p_lesson_count) * 100)::INT
      ELSE 0
    END;

    INSERT INTO public.user_module_progress (user_id, module_id, status, progress_percentage, completed_at)
    VALUES (p_user_id, p_module_id, 'in_progress', v_progress_pct, NULL)
    ON CONFLICT (user_id, module_id) DO UPDATE SET
      status = 'in_progress',
      progress_percentage = EXCLUDED.progress_percentage,
      updated_at = NOW();
  ELSE
    SELECT status INTO v_mod_status
    FROM public.user_module_progress
    WHERE user_id = p_user_id AND module_id = p_module_id;

    IF v_mod_status IS NULL OR v_mod_status <> 'completed' THEN
      SELECT COUNT(*)::INT INTO v_completed_count
      FROM public.user_lesson_progress
      WHERE user_id = p_user_id AND module_id = p_module_id AND completed = TRUE;

      v_progress_pct := CASE
        WHEN p_lesson_count > 0 AND v_completed_count > 0 THEN
          ROUND((v_completed_count::NUMERIC / p_lesson_count) * 100)::INT
        ELSE 0
      END;

      INSERT INTO public.user_module_progress (user_id, module_id, status, progress_percentage, completed_at)
      VALUES (p_user_id, p_module_id, 'in_progress', v_progress_pct, NULL)
      ON CONFLICT (user_id, module_id) DO UPDATE SET
        status = CASE
          WHEN user_module_progress.status = 'completed' THEN user_module_progress.status
          ELSE 'in_progress'
        END,
        progress_percentage = CASE
          WHEN user_module_progress.status = 'completed' THEN user_module_progress.progress_percentage
          ELSE EXCLUDED.progress_percentage
        END,
        updated_at = NOW();
    END IF;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.save_lesson_progress(UUID, TEXT, TEXT, INT, INT, BOOLEAN, TIMESTAMPTZ) TO authenticated;
