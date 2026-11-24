-- HABBIT: persistência segura de XP, níveis (derivados do XP) e conquistas.
-- Execute este arquivo UMA vez no Supabase > SQL Editor.
-- Não apaga hábitos, conclusões nem contas existentes.

-- 1. Estatísticas persistentes do perfil.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS xp INTEGER NOT NULL DEFAULT 0 CHECK (xp >= 0),
  ADD COLUMN IF NOT EXISTS total_completions INTEGER NOT NULL DEFAULT 0 CHECK (total_completions >= 0);

-- 2. A tabela conquistas já foi criada na etapa inicial.
-- Garante que o catálogo contenha as três conquistas utilizadas pelo aplicativo.
INSERT INTO public.conquistas
  (id, titulo, descricao, requisito, recompensa_xp, titulo_recompensa)
VALUES
  ('first_habit', 'Primeiros passos', 'Conclua seu primeiro hábito.', 1, 20, 'Iniciante'),
  ('three_habits', 'Criando consistência', 'Conclua 3 hábitos.', 3, 30, 'Disciplinado'),
  ('five_habits', 'Em evolução', 'Conclua 5 hábitos.', 5, 50, 'Mestre dos hábitos')
ON CONFLICT (id) DO UPDATE SET
  titulo = EXCLUDED.titulo,
  descricao = EXCLUDED.descricao,
  requisito = EXCLUDED.requisito,
  recompensa_xp = EXCLUDED.recompensa_xp,
  titulo_recompensa = EXCLUDED.titulo_recompensa;

-- 3. Garantir leitura do perfil e das conquistas próprias.
GRANT SELECT ON public.profiles TO authenticated;
GRANT SELECT, INSERT ON public.conquistas_usuarios TO authenticated;
GRANT SELECT ON public.conquistas TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.conclusoes TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Remover políticas de INSERT direto em conquistas_usuarios.
-- A concessão será feita somente pelas funções abaixo.
DROP POLICY IF EXISTS "Usuário pode desbloquear próprias conquistas"
ON public.conquistas_usuarios;

-- 4. RPC para concluir um hábito com cálculo de XP no banco.
CREATE OR REPLACE FUNCTION public.concluir_habito(p_habit_id UUID)
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

  IF NOT EXISTS (
    SELECT 1 FROM public.habitos h
    WHERE h.id = p_habit_id
      AND h.user_id = v_user_id
      AND h.ativo = TRUE
  ) THEN
    RAISE EXCEPTION 'Hábito não encontrado ou não pertence ao usuário';
  END IF;

  -- A restrição UNIQUE(habit_id, data_conclusao) impede duplicidade no mesmo dia.
  INSERT INTO public.conclusoes (habit_id, user_id, data_conclusao, xp_recebido)
  VALUES (p_habit_id, v_user_id, CURRENT_DATE, 10)
  ON CONFLICT (habit_id, data_conclusao) DO NOTHING
  RETURNING id INTO v_inserted;

  IF v_inserted IS NOT NULL THEN
    UPDATE public.profiles
    SET xp = xp + 10,
        total_completions = total_completions + 1
    WHERE id = v_user_id
    RETURNING xp, total_completions INTO v_xp, v_total;

    -- Conquistas são desbloqueadas uma única vez por usuário.
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
  ELSE
    SELECT p.xp, p.total_completions
    INTO v_xp, v_total
    FROM public.profiles p
    WHERE p.id = v_user_id;
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

-- 5. RPC para desfazer a conclusão do dia.
-- Estorna os 10 XP-base, mas mantém conquistas já desbloqueadas como marcos permanentes.
CREATE OR REPLACE FUNCTION public.desfazer_conclusao_habito(p_habit_id UUID)
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

  DELETE FROM public.conclusoes c
  WHERE c.habit_id = p_habit_id
    AND c.user_id = v_user_id
    AND c.data_conclusao = CURRENT_DATE
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

-- 6. Somente usuários autenticados podem executar as funções.
REVOKE ALL ON FUNCTION public.concluir_habito(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.desfazer_conclusao_habito(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.concluir_habito(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.desfazer_conclusao_habito(UUID) TO authenticated;
