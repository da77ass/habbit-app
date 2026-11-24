-- Habbit: corrigir divergência de data entre navegador (horário local) e PostgreSQL (UTC).
-- Execute este script no Supabase SQL Editor.
-- As funções passam a receber a data local calculada pelo aplicativo.

DROP FUNCTION IF EXISTS public.concluir_habito(UUID);
DROP FUNCTION IF EXISTS public.desfazer_conclusao_habito(UUID);

CREATE FUNCTION public.concluir_habito(
  p_habit_id UUID,
  p_data_conclusao DATE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_inserted UUID;
  v_total INTEGER;
  v_xp INTEGER;
  v_bonus INTEGER := 0;
  v_unlocked TEXT[] := ARRAY[]::TEXT[];
  v_achievement RECORD;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não autenticado';
  END IF;

  IF p_data_conclusao IS NULL THEN
    RAISE EXCEPTION 'A data da conclusão é obrigatória';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.habitos h
    WHERE h.id = p_habit_id
      AND h.user_id = v_user_id
      AND h.ativo = TRUE
  ) THEN
    RAISE EXCEPTION 'Hábito não encontrado ou não pertence ao usuário';
  END IF;

  INSERT INTO public.conclusoes (habit_id, user_id, data_conclusao, xp_recebido)
  VALUES (p_habit_id, v_user_id, p_data_conclusao, 10)
  ON CONFLICT (habit_id, data_conclusao) DO NOTHING
  RETURNING id INTO v_inserted;

  IF v_inserted IS NOT NULL THEN
    UPDATE public.profiles
    SET xp = xp + 10,
        total_completions = total_completions + 1
    WHERE id = v_user_id
    RETURNING xp, total_completions INTO v_xp, v_total;

    FOR v_achievement IN
      SELECT c.id, c.requisito, c.recompensa_xp
      FROM public.conquistas c
      WHERE c.requisito <= v_total
        AND NOT EXISTS (
          SELECT 1
          FROM public.conquistas_usuarios cu
          WHERE cu.user_id = v_user_id
            AND cu.conquista_id = c.id
        )
      ORDER BY c.requisito
    LOOP
      INSERT INTO public.conquistas_usuarios (user_id, conquista_id)
      VALUES (v_user_id, v_achievement.id)
      ON CONFLICT (user_id, conquista_id) DO NOTHING;

      v_bonus := v_bonus + v_achievement.recompensa_xp;
      v_unlocked := array_append(v_unlocked, v_achievement.id);
    END LOOP;

    IF v_bonus > 0 THEN
      UPDATE public.profiles
      SET xp = xp + v_bonus
      WHERE id = v_user_id
      RETURNING xp INTO v_xp;
    END IF;
  END IF;

  SELECT p.xp, p.total_completions
  INTO v_xp, v_total
  FROM public.profiles p
  WHERE p.id = v_user_id;

  RETURN jsonb_build_object(
    'completed', TRUE,
    'xp', COALESCE(v_xp, 0),
    'totalCompletions', COALESCE(v_total, 0),
    'bonusXp', v_bonus,
    'newAchievements', to_jsonb(v_unlocked)
  );
END;
$$;

CREATE FUNCTION public.desfazer_conclusao_habito(
  p_habit_id UUID,
  p_data_conclusao DATE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_xp_recebido INTEGER;
  v_xp INTEGER;
  v_total INTEGER;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não autenticado';
  END IF;

  IF p_data_conclusao IS NULL THEN
    RAISE EXCEPTION 'A data da conclusão é obrigatória';
  END IF;

  DELETE FROM public.conclusoes c
  WHERE c.habit_id = p_habit_id
    AND c.user_id = v_user_id
    AND c.data_conclusao = p_data_conclusao
  RETURNING c.xp_recebido INTO v_xp_recebido;

  IF v_xp_recebido IS NOT NULL THEN
    UPDATE public.profiles
    SET xp = GREATEST(0, xp - v_xp_recebido),
        total_completions = GREATEST(0, total_completions - 1)
    WHERE id = v_user_id;
  END IF;

  SELECT p.xp, p.total_completions
  INTO v_xp, v_total
  FROM public.profiles p
  WHERE p.id = v_user_id;

  RETURN jsonb_build_object(
    'completed', FALSE,
    'xp', COALESCE(v_xp, 0),
    'totalCompletions', COALESCE(v_total, 0)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.concluir_habito(UUID, DATE) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.desfazer_conclusao_habito(UUID, DATE) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.concluir_habito(UUID, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION public.desfazer_conclusao_habito(UUID, DATE) TO authenticated;
