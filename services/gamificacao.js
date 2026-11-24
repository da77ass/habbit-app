import { supabase } from './supabase';

// Usa a mesma data local utilizada pela listagem de hábitos e pelo histórico.
function obterDataLocal() {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

// Recupera XP, total de conclusões e conquistas desbloqueadas da conta.
export async function carregarGamificacao(userId) {
  const { data: perfil, error: erroPerfil } = await supabase
    .from('profiles')
    .select('xp, total_completions')
    .eq('id', userId)
    .single();

  if (erroPerfil) throw erroPerfil;

  const { data: conquistas, error: erroConquistas } = await supabase
    .from('conquistas_usuarios')
    .select('conquista_id')
    .eq('user_id', userId);

  if (erroConquistas) throw erroConquistas;

  return {
    xp: perfil?.xp ?? 0,
    totalCompletions: perfil?.total_completions ?? 0,
    unlockedAchievementIds: (conquistas || []).map((item) => item.conquista_id),
  };
}

// Envia a data local explicitamente para evitar divergência com CURRENT_DATE do servidor (UTC).
export async function concluirHabitoNoBanco(habitId) {
  const { data, error } = await supabase.rpc('concluir_habito', {
    p_habit_id: habitId,
    p_data_conclusao: obterDataLocal(),
  });

  if (error) throw error;
  return data;
}

// Usa a mesma data local para desfazer a conclusão do dia correto.
export async function desfazerConclusaoNoBanco(habitId) {
  const { data, error } = await supabase.rpc('desfazer_conclusao_habito', {
    p_habit_id: habitId,
    p_data_conclusao: obterDataLocal(),
  });

  if (error) throw error;
  return data;
}
