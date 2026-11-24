import { supabase } from './supabase';

// Retorna a data local no formato YYYY-MM-DD, compatível com a coluna DATE.
function obterDataLocal() {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function converterHabito(row, concluidosHoje) {
  return {
    id: row.id,
    titulo: row.titulo,
    frequencia: row.frequencia,
    horario: row.horario || '',
    metaDiaria: row.meta_diaria || '',
    categoria: row.categoria || 'Saúde',
    cor: row.cor || '#80BFFF',
    ativo: row.ativo,
    concluido: concluidosHoje.has(row.id),
    // A sequência será calculada a partir do histórico em uma etapa posterior.
    diasSequencia: 0,
  };
}

// Busca somente os hábitos pertencentes ao usuário autenticado e as conclusões de hoje.
export async function listarHabitos(userId) {
  const hoje = obterDataLocal();

  const { data: habitos, error: erroHabitos } = await supabase
    .from('habitos')
    .select('id, titulo, frequencia, horario, meta_diaria, categoria, cor, ativo, created_at')
    .eq('user_id', userId)
    .eq('ativo', true)
    .order('created_at', { ascending: true });

  if (erroHabitos) throw erroHabitos;

  const { data: conclusoes, error: erroConclusoes } = await supabase
    .from('conclusoes')
    .select('habit_id')
    .eq('user_id', userId)
    .eq('data_conclusao', hoje);

  if (erroConclusoes) throw erroConclusoes;

  const concluidosHoje = new Set((conclusoes || []).map((item) => item.habit_id));
  return (habitos || []).map((habito) => converterHabito(habito, concluidosHoje));
}

// Insere um hábito e devolve o objeto no formato usado pelas telas.
export async function criarHabito(userId, dados) {
  const { data, error } = await supabase
    .from('habitos')
    .insert({
      user_id: userId,
      titulo: dados.titulo.trim(),
      frequencia: dados.frequencia || 'Todos os dias',
      horario: dados.horario || null,
      meta_diaria: dados.metaDiaria || null,
      categoria: dados.categoria || 'Saúde',
      cor: dados.cor || '#80BFFF',
      ativo: true,
    })
    .select()
    .single();

  if (error) throw error;
  return converterHabito(data, new Set());
}

// Atualiza os campos editáveis do hábito, sempre restringindo pelo usuário.
export async function atualizarHabito(userId, habitId, dados) {
  const { data, error } = await supabase
    .from('habitos')
    .update({
      titulo: dados.titulo.trim(),
      frequencia: dados.frequencia,
      horario: dados.horario || null,
      meta_diaria: dados.metaDiaria || null,
      categoria: dados.categoria,
      cor: dados.cor || '#80BFFF',
      updated_at: new Date().toISOString(),
    })
    .eq('id', habitId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return converterHabito(data, new Set());
}

// Arquiva o hábito (remoção lógica), preservando as conclusões antigas
// para que o histórico continue exibindo as atividades já realizadas.
export async function excluirHabito(userId, habitId) {
  const { data, error } = await supabase
    .from('habitos')
    .update({
      ativo: false,
      updated_at: new Date().toISOString(),
    })
    .eq('id', habitId)
    .eq('user_id', userId)
    .select('id')
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    throw new Error('O hábito não foi encontrado ou não pertence a esta conta.');
  }
}

// Registra ou remove a conclusão do dia atual.
// Nesta etapa, xp_recebido fica em zero: a persistência da gamificação será integrada separadamente.
export async function alternarConclusaoHabito(userId, habitId, jaConcluido) {
  const hoje = obterDataLocal();

  if (jaConcluido) {
    const { error } = await supabase
      .from('conclusoes')
      .delete()
      .eq('user_id', userId)
      .eq('habit_id', habitId)
      .eq('data_conclusao', hoje);

    if (error) throw error;
    return false;
  }

  const { error } = await supabase
    .from('conclusoes')
    .insert({
      user_id: userId,
      habit_id: habitId,
      data_conclusao: hoje,
      xp_recebido: 0,
    });

  if (error) throw error;
  return true;
}
