import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BlocoHistorico({ theme, habitos = [], gameData, isOpen, onToggle }) {
  // 1. Dados Calculados e Mockados Dinamicamente
  const totalHabitos = habitos.length; // Retorna a quantidade de hábitos no array (ex: 5)
  const concluidosHoje = habitos.filter((h) => h.concluido).length;

  // Mock de dados calculados para os últimos 7 dias baseado na gamificação/habitos
  const execucoesUltimosSeteDias = (gameData?.totalCompletions || 0) + 25; 

  // Mês e Ano mockados dinamicamente com base na data do sistema (ex: "Nov 2026")
  const dataAtual = new Date();
  const mesAnoAtual = dataAtual.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
  const mesAnoInicio = 'Fev 2026'; // Data mockada do início do histórico

  // Maior sequência e constância
  const maiorSequencia = habitos.reduce(
    (max, h) => Math.max(max, Number(h.diasSequencia || 0)),
    0
  );
  const diasConstancia = habitos.reduce(
    (acc, h) => acc + (Number(h.diasSequencia) > 0 ? 1 : 0),
    0
  );

  return (
    <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
      <TouchableOpacity
        style={styles.headerTouch}
        activeOpacity={0.7}
        onPress={onToggle}
      >
        <Text style={[styles.title, { color: theme.title }]}>Meta semanal / Histórico</Text>
        <Ionicons
          name={isOpen ? 'chevron-down' : 'chevron-forward'}
          size={18}
          color={theme.arrowColor}
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.content}>
          {/* Card Resumo Adicionado (igual ao da imagem) */}
          <View style={[styles.resumoCard, { backgroundColor: theme.subOptionBg }]}>
            <Text style={[styles.resumoTitle, { color: theme.title }]}>Resumo</Text>
            <Text style={[styles.resumoItemText, { color: theme.subtitle }]}>
              {totalHabitos} hábitos cadastrados
            </Text>
            <Text style={[styles.resumoItemText, { color: theme.subtitle }]}>
              {execucoesUltimosSeteDias} execuções nos últimos sete dias
            </Text>
          </View>

          {/* Gráfico do Histórico */}
          <View style={styles.miniChartBox}>
            <Text style={styles.miniChartTitle}>Hábitos Cumpridos (Total)</Text>
            <View style={styles.chartAreaMock}>
              <View style={styles.chartLineMock} />
            </View>
            <View style={styles.chartDatesRow}>
              <Text style={styles.dateLabel}>{mesAnoInicio}</Text>
              <Text style={styles.dateLabel}>{mesAnoAtual}</Text>
            </View>
          </View>

          {/* Três Cards de Estatísticas com Dados Dinâmicos */}
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: theme.subOptionBg }]}>
              <Text style={[styles.statLabel, { color: theme.subtitle }]}>Concluídos hoje</Text>
              <Text style={[styles.statValue, { color: theme.title }]}>
                {concluidosHoje}/{totalHabitos}
              </Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: theme.subOptionBg }]}>
              <Text style={[styles.statLabel, { color: theme.subtitle }]}>Constância</Text>
              <Text style={[styles.statValue, { color: theme.title }]}>
                {diasConstancia} hábitos
              </Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: theme.subOptionBg }]}>
              <Text style={[styles.statLabel, { color: theme.subtitle }]}>Maior Sequência</Text>
              <Text style={[styles.statValue, { color: theme.title }]}>
                {maiorSequencia} dias
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  headerTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },

  /* Card Resumo */
  resumoCard: {
    borderRadius: 14,
    padding: 14,
  },
  resumoTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  resumoItemText: {
    fontSize: 13,
    marginBottom: 4,
  },

  /* Gráfico */
  miniChartBox: {
    backgroundColor: '#1C2321',
    padding: 12,
    borderRadius: 14,
  },
  miniChartTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  chartAreaMock: {
    height: 50,
    borderBottomWidth: 1,
    borderColor: '#3B4843',
    justifyContent: 'center',
  },
  chartLineMock: {
    height: 2,
    backgroundColor: '#00A896',
    width: '100%',
    transform: [{ rotate: '-3deg' }],
  },
  chartDatesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  dateLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    textTransform: 'capitalize',
  },

  /* Estatísticas */
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statCard: {
    flex: 1,
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
});