import { supabase } from './supabase';

function dataLocalISO(data = new Date()) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function deslocarDia(dataISO, quantidade) {
  const [ano, mes, dia] = dataISO.split('-').map(Number);
  const data = new Date(Date.UTC(ano, mes - 1, dia + quantidade));
  return data.toISOString().slice(0, 10);
}

function calcularSequencias(datas) {
  const ordenadas = [...new Set(datas)].sort();
  if (!ordenadas.length) return { streakAtual: 0, maiorStreak: 0 };

  let maiorStreak = 1;
  let sequencia = 1;
  for (let i = 1; i < ordenadas.length; i += 1) {
    if (deslocarDia(ordenadas[i - 1], 1) === ordenadas[i]) {
      sequencia += 1;
      maiorStreak = Math.max(maiorStreak, sequencia);
    } else {
      sequencia = 1;
    }
  }

  const conjunto = new Set(ordenadas);
  const hoje = dataLocalISO();
  const ontem = deslocarDia(hoje, -1);
  let streakAtual = 0;
  let cursor = conjunto.has(hoje) ? hoje : (conjunto.has(ontem) ? ontem : null);

  while (cursor && conjunto.has(cursor)) {
    streakAtual += 1;
    cursor = deslocarDia(cursor, -1);
  }

  return { streakAtual, maiorStreak };
}

// Lê todas as conclusões preservadas no banco e calcula estatísticas por dia.
export async function carregarHistorico(userId) {
  const { data, error } = await supabase
    .from('conclusoes')
    .select('id, habit_id, data_conclusao, xp_recebido, habitos ( titulo )')
    .eq('user_id', userId)
    .order('data_conclusao', { ascending: false })
    .order('id', { ascending: false });

  if (error) throw error;

  const registros = (data || []).map((item) => ({
    id: item.id,
    habitId: item.habit_id,
    titulo: item.habitos?.titulo || 'Hábito removido',
    data: item.data_conclusao,
    xp: item.xp_recebido || 0,
  }));

  const datas = registros.map((item) => item.data);
  const { streakAtual, maiorStreak } = calcularSequencias(datas);
  const hoje = dataLocalISO();
  const semana = Array.from({ length: 7 }, (_, indice) => deslocarDia(hoje, indice - 6));
  const conclusoesPorDia = semana.map((dia) => ({
    data: dia,
    quantidade: registros.filter((item) => item.data === dia).length,
  }));

  return {
    registros,
    totalConclusoes: registros.length,
    streakAtual,
    maiorStreak,
    conclusoesPorDia,
    diasComConclusao: new Set(datas).size,
  };
}
