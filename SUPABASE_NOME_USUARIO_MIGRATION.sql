-- Habbit: coluna de nome de exibição e permissão para o próprio usuário alterá-la.
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS nome_usuario TEXT;

GRANT UPDATE (nome_usuario) ON public.profiles TO authenticated;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'profiles'
      AND policyname = 'Usuário pode atualizar o próprio nome'
  ) THEN
    CREATE POLICY "Usuário pode atualizar o próprio nome"
      ON public.profiles
      FOR UPDATE
      TO authenticated
      USING (id = auth.uid())
      WITH CHECK (id = auth.uid());
  END IF;
END
$$;
