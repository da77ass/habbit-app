import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BlocoHistorico({ theme, habitos = [], historyData, isOpen, onToggle }) {
  const totalHabitos = habitos.length;
  const concluidosHoje = habitos.filter((h) => h.concluido).length;
  const registros = historyData?.registros || [];
  const semana = historyData?.conclusoesPorDia || [];
  const execucoesUltimosSeteDias = semana.reduce((soma, item) => soma + (item.quantidade || 0), 0);
  const maiorSequencia = historyData?.maiorStreak || 0;
  const diasConstancia = historyData?.diasComConclusao || 0;
  const maxSemana = Math.max(1, ...semana.map((item) => item.quantidade || 0));

  const formatarData = (valor) => {
    if (!valor) return '';
    const [ano, mes, dia] = valor.split('-');
    return `${dia}/${mes}`;
  };

  const chartText = theme.subtitle || '#9CA3AF';
  const chartAccent = theme.accent || '#00BFA6';

  return (
    <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
      <TouchableOpacity style={styles.headerTouch} activeOpacity={0.7} onPress={onToggle}>
        <Text style={[styles.title, { color: theme.title }]}>Meta semanal / Histórico</Text>
        <Ionicons name={isOpen ? 'chevron-down' : 'chevron-forward'} size={18} color={theme.arrowColor} />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.content}>
          <View style={[styles.resumoCard, { backgroundColor: theme.subOptionBg }]}>
            <Text style={[styles.resumoTitle, { color: theme.title }]}>Resumo</Text>
            <Text style={[styles.resumoItemText, { color: theme.subtitle }]}>{totalHabitos} hábitos ativos</Text>
            <Text style={[styles.resumoItemText, { color: theme.subtitle }]}>
              {execucoesUltimosSeteDias} conclusões nos últimos sete dias
            </Text>
          </View>

          <View style={[styles.chartCard, { backgroundColor: theme.subOptionBg }]}>
            <View style={styles.chartHeading}>
              <View>
                <Text style={[styles.chartTitle, { color: theme.title }]}>Conclusões por dia</Text>
                <Text style={[styles.chartSubtitle, { color: theme.subtitle }]}>Últimos 7 dias</Text>
              </View>
              <View style={styles.totalPill}>
                <Text style={[styles.totalPillText, { color: chartAccent }]}>{execucoesUltimosSeteDias} no total</Text>
              </View>
            </View>

            {semana.length === 0 || execucoesUltimosSeteDias === 0 ? (
              <View style={styles.emptyChart}>
                <Ionicons name="bar-chart-outline" size={25} color={theme.subtitle} />
                <Text style={[styles.emptyText, { color: theme.subtitle }]}>As conclusões dos próximos dias aparecerão aqui.</Text>
              </View>
            ) : (
              <View style={styles.chartRows}>
                {semana.map((item) => {
                  const quantidade = item.quantidade || 0;
                  const largura = quantidade === 0 ? 0 : Math.max(5, (quantidade / maxSemana) * 100);
                  return (
                    <View key={item.data} style={styles.chartRow}>
                      <Text style={[styles.chartDate, { color: theme.subtitle }]}>{formatarData(item.data)}</Text>
                      <View style={[styles.track, { backgroundColor: theme.cardBg }]}>
                        <View style={[styles.fill, { width: `${largura}%`, backgroundColor: chartAccent }]} />
                      </View>
                      <Text style={[styles.chartCount, { color: theme.title }]}>{quantidade}</Text>
                    </View>
                  );
                })}
              </View>
            )}
            <Text style={[styles.chartLegend, { color: theme.subtitle }]}>Cada barra representa a quantidade de hábitos concluídos naquele dia.</Text>
          </View>

          <View style={[styles.resumoCard, { backgroundColor: theme.subOptionBg }]}>
            <Text style={[styles.resumoTitle, { color: theme.title }]}>Atividades recentes</Text>
            {registros.length === 0 ? (
              <Text style={[styles.resumoItemText, { color: theme.subtitle }]}>Suas conclusões aparecerão aqui.</Text>
            ) : registros.slice(0, 8).map((item) => (
              <View key={item.id} style={styles.historyRow}>
                <View style={styles.historyTextGroup}>
                  <Text style={[styles.historyHabit, { color: theme.title }]}>{item.titulo}</Text>
                  <Text style={[styles.resumoItemText, { color: theme.subtitle }]}>{formatarData(item.data)}</Text>
                </View>
                <Text style={[styles.historyXp, { color: theme.title }]}>+{item.xp} XP</Text>
              </View>
            ))}
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: theme.subOptionBg }]}>
              <Text style={[styles.statLabel, { color: theme.subtitle }]}>Concluídos hoje</Text>
              <Text style={[styles.statValue, { color: theme.title }]}>{concluidosHoje}/{totalHabitos}</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.subOptionBg }]}>
              <Text style={[styles.statLabel, { color: theme.subtitle }]}>Dias ativos</Text>
              <Text style={[styles.statValue, { color: theme.title }]}>{diasConstancia}</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.subOptionBg }]}>
              <Text style={[styles.statLabel, { color: theme.subtitle }]}>Maior sequência</Text>
              <Text style={[styles.statValue, { color: theme.title }]}>{maiorSequencia} dias</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 18, overflow: 'hidden' },
  headerTouch: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 18, paddingHorizontal: 20 },
  title: { fontSize: 15, fontWeight: 'bold' },
  content: { paddingHorizontal: 16, paddingBottom: 16, gap: 12 },
  resumoCard: { borderRadius: 14, padding: 14 },
  resumoTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 6 },
  resumoItemText: { fontSize: 13, marginBottom: 4 },
  chartCard: { borderRadius: 14, padding: 14 },
  chartHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  chartTitle: { fontSize: 14, fontWeight: 'bold' },
  chartSubtitle: { fontSize: 11, marginTop: 3 },
  totalPill: { backgroundColor: '#00BFA61A', paddingHorizontal: 9, paddingVertical: 6, borderRadius: 20 },
  totalPillText: { fontSize: 11, fontWeight: '700' },
  chartRows: { gap: 10 },
  chartRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  chartDate: { width: 43, fontSize: 10, fontWeight: '600' },
  track: { flex: 1, height: 12, borderRadius: 8, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 8 },
  chartCount: { width: 18, textAlign: 'right', fontSize: 11, fontWeight: '700' },
  chartLegend: { fontSize: 10, marginTop: 12, lineHeight: 14 },
  emptyChart: { minHeight: 90, alignItems: 'center', justifyContent: 'center', gap: 7 },
  emptyText: { fontSize: 11, textAlign: 'center' },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 7, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#9CA3AF55' },
  historyTextGroup: { flex: 1 },
  historyHabit: { fontSize: 13, fontWeight: '600' },
  historyXp: { fontSize: 12, fontWeight: '700' },
  statsRow: { flexDirection: 'row', gap: 8 },
  statCard: { flex: 1, padding: 10, borderRadius: 12, alignItems: 'center' },
  statLabel: { fontSize: 10, textAlign: 'center' },
  statValue: { fontSize: 14, fontWeight: 'bold', marginTop: 4 },
});
