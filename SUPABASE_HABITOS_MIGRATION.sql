-- Habbit: permitir que o usuário desmarque uma conclusão do próprio hábito.
-- Execute este script uma única vez no Supabase > SQL Editor.

DROP POLICY IF EXISTS "Usuário pode remover próprias conclusões"
ON public.conclusoes;

CREATE POLICY "Usuário pode remover próprias conclusões"
ON public.conclusoes
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
