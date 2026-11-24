import React from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, ScrollView, Image,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BottomNavigationBar from './BottomNavigationBar';

const nomesDias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function formatarDia(dataISO) {
  if (!dataISO) return '';
  const [ano, mes, dia] = dataISO.split('-').map(Number);
  return `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}`;
}

export default function ProgressoScreen({
  navigation, themeMode, historyData, habitos = [], nomeUsuario = '',
}) {
  const isDarkMode = themeMode !== 'light';
  const theme = isDarkMode ? darkTheme : lightTheme;
  const semana = historyData?.conclusoesPorDia || [];
  const maximo = Math.max(1, ...semana.map((item) => Number(item.quantidade) || 0));
  const totalSemana = semana.reduce((soma, item) => soma + (Number(item.quantidade) || 0), 0);
  const concluidosHoje = habitos.filter((item) => item.concluido).length;
  const totalHabitos = habitos.length;
  const taxaSemanal = totalHabitos
    ? Math.min(100, Math.round((totalSemana / (totalHabitos * 7)) * 100))
    : 0;
  const nome = nomeUsuario || 'Usuário';
  const inicial = nome.trim().charAt(0).toUpperCase() || 'U';

  const dadosGrafico = semana.map((item) => {
    const [ano, mes, dia] = item.data.split('-').map(Number);
    const data = new Date(ano, mes - 1, dia);
    return {
      ...item,
      quantidade: Number(item.quantidade) || 0,
      dia: nomesDias[data.getDay()],
      dataCurta: formatarDia(item.data),
    };
  });

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <View>
                <View style={styles.logoTitleRow}>
                  <Text style={[styles.appTitle, { color: theme.title }]}>Progresso</Text>
                  <Image source={require('../assets/rabbit-face.png')} style={styles.logoImage} resizeMode="contain" />
                </View>
                <Text style={[styles.subtitleText, { color: theme.subtitle }]}>Seu desempenho nos últimos 7 dias</Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation?.navigate?.('Perfil')}
                style={[styles.avatarContainer, { backgroundColor: theme.avatarBg }]}
                accessibilityRole="button"
                accessibilityLabel="Abrir perfil"
              >
                <Text style={[styles.avatarText, { color: theme.avatarText }]}>{inicial}</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.streakCard, { backgroundColor: theme.cardBg }]}>
              <View style={styles.streakIcon}>
                <Ionicons name="flame" size={23} color="#F59E0B" />
              </View>
              <View style={styles.streakContent}>
                <Text style={[styles.cardLabel, { color: theme.subtitle }]}>Sequência atual</Text>
                <View style={styles.streakRow}>
                  <Text style={[styles.streakBigText, { color: theme.title }]}>
                    {historyData?.streakAtual || 0} {(historyData?.streakAtual || 0) === 1 ? 'dia' : 'dias'}
                  </Text>
                  <Text style={[styles.streakBestText, { color: theme.subtitle }]}>
                    Recorde: {historyData?.maiorStreak || 0} dias
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <View>
                <Text style={[styles.sectionTitle, { color: theme.title }]}>Conclusões semanais</Text>
                <Text style={[styles.sectionSubtitle, { color: theme.subtitle }]}>Quantidade de hábitos concluídos por dia</Text>
              </View>
              <View style={[styles.weekTotalBadge, { backgroundColor: theme.cardBg }]}>
                <Text style={[styles.weekTotalValue, { color: theme.accent }]}>{totalSemana}</Text>
                <Text style={[styles.weekTotalLabel, { color: theme.subtitle }]}>total</Text>
              </View>
            </View>

            <View style={[styles.chartCard, { backgroundColor: theme.cardBg }]}>
              {dadosGrafico.length === 0 || totalSemana === 0 ? (
                <View style={styles.emptyChart}>
                  <Ionicons name="bar-chart-outline" size={34} color={theme.subtitle} />
                  <Text style={[styles.emptyTitle, { color: theme.title }]}>Ainda sem conclusões</Text>
                  <Text style={[styles.emptyText, { color: theme.subtitle }]}>Conclua um hábito para começar a acompanhar sua semana.</Text>
                </View>
              ) : (
                <>
                  <View style={styles.chartLegendRow}>
                    <View style={[styles.legendDot, { backgroundColor: theme.accent }]} />
                    <Text style={[styles.legendText, { color: theme.subtitle }]}>Hábitos concluídos</Text>
                    <Text style={[styles.scaleText, { color: theme.subtitle }]}>Máximo: {maximo}/dia</Text>
                  </View>
                  <View style={styles.chartBarsContainer}>
                    {dadosGrafico.map((item, index) => {
                      const altura = item.quantidade === 0 ? 0 : Math.max(7, (item.quantidade / maximo) * 112);
                      return (
                        <View key={item.data || index} style={styles.barColumn}>
                          <Text style={[styles.barValue, { color: item.quantidade ? theme.title : theme.subtitle }]}>
                            {item.quantidade}
                          </Text>
                          <View style={[styles.barTrack, { backgroundColor: theme.track }]}>
                            <View style={[styles.barFill, {
                              height: altura,
                              backgroundColor: item.quantidade ? theme.accent : 'transparent',
                            }]} />
                          </View>
                          <Text style={[styles.barDayText, { color: theme.title }]}>{item.dia}</Text>
                          <Text style={[styles.barDateText, { color: theme.subtitle }]}>{item.dataCurta}</Text>
                        </View>
                      );
                    })}
                  </View>
                </>
              )}
            </View>

            <Text style={[styles.sectionTitle, { color: theme.title, marginTop: 4 }]}>Resumo da semana</Text>
            <View style={styles.summaryRow}>
              <View style={[styles.summaryCard, { backgroundColor: theme.cardBg }]}>
                <Ionicons name="trending-up" size={19} color={theme.accent} />
                <Text style={[styles.summaryBigText, { color: theme.title }]}>{taxaSemanal}%</Text>
                <Text style={[styles.summaryLabel, { color: theme.subtitle }]}>Taxa semanal*</Text>
              </View>
              <View style={[styles.summaryCard, { backgroundColor: theme.cardBg }]}>
                <Ionicons name="list" size={19} color={theme.accent} />
                <Text style={[styles.summaryBigText, { color: theme.title }]}>{totalHabitos}</Text>
                <Text style={[styles.summaryLabel, { color: theme.subtitle }]}>Hábitos ativos</Text>
              </View>
              <View style={[styles.summaryCard, { backgroundColor: theme.cardBg }]}>
                <Ionicons name="checkmark-circle" size={19} color={theme.accent} />
                <Text style={[styles.summaryBigText, { color: theme.title }]}>{concluidosHoje}</Text>
                <Text style={[styles.summaryLabel, { color: theme.subtitle }]}>Concluídos hoje</Text>
              </View>
            </View>
            <Text style={[styles.footnote, { color: theme.subtitle }]}>
              *Estimativa de conclusões na semana em relação a 7 dias de hábitos ativos.
            </Text>
          </ScrollView>

          <BottomNavigationBar activeTab="Progresso" themeMode={themeMode}
            onTabPress={(tabName) => navigation?.navigate?.(tabName)} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const lightTheme = {
  bg: '#F4F7FC', title: '#0F141C', subtitle: '#6B7280',
  avatarBg: '#E5E7EB', avatarText: '#1F2937', cardBg: '#FFFFFF',
  accent: '#0D9488', track: '#E5E7EB',
};
const darkTheme = {
  bg: '#121212', title: '#FFFFFF', subtitle: '#9CA3AF',
  avatarBg: '#2E2E2E', avatarText: '#FFFFFF', cardBg: '#1E1E1E',
  accent: '#19C6A5', track: '#343434',
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 },
  logoTitleRow: { flexDirection: 'row', alignItems: 'center' },
  appTitle: { fontSize: 26, fontWeight: 'bold', marginRight: 8 },
  logoImage: { width: 32, height: 32 },
  subtitleText: { fontSize: 13, marginTop: 2 },
  avatarContainer: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 16, fontWeight: 'bold' },
  streakCard: { borderRadius: 19, padding: 17, marginBottom: 25, flexDirection: 'row', alignItems: 'center', gap: 12 },
  streakIcon: { width: 43, height: 43, borderRadius: 14, backgroundColor: '#F59E0B18', alignItems: 'center', justifyContent: 'center' },
  streakContent: { flex: 1 },
  cardLabel: { fontSize: 13, marginBottom: 5 },
  streakRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 6 },
  streakBigText: { fontSize: 27, fontWeight: 'bold' },
  streakBestText: { fontSize: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  sectionSubtitle: { fontSize: 11 },
  weekTotalBadge: { minWidth: 54, paddingVertical: 6, paddingHorizontal: 9, borderRadius: 12, alignItems: 'center' },
  weekTotalValue: { fontSize: 17, fontWeight: 'bold' },
  weekTotalLabel: { fontSize: 9 },
  chartCard: { borderRadius: 19, padding: 15, marginBottom: 23, minHeight: 205 },
  chartLegendRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 10, flex: 1 },
  scaleText: { fontSize: 10 },
  chartBarsContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 150 },
  barColumn: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: 3 },
  barValue: { fontSize: 11, fontWeight: '700', height: 15 },
  barTrack: { width: 22, height: 112, borderRadius: 8, justifyContent: 'flex-end', overflow: 'hidden' },
  barFill: { width: '100%', borderRadius: 8 },
  barDayText: { fontSize: 10, fontWeight: '700', marginTop: 3 },
  barDateText: { fontSize: 9 },
  emptyChart: { flex: 1, minHeight: 170, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  emptyTitle: { fontSize: 14, fontWeight: '700', marginTop: 9 },
  emptyText: { fontSize: 11, textAlign: 'center', marginTop: 5, lineHeight: 16 },
  summaryRow: { flexDirection: 'row', gap: 9 },
  summaryCard: { flex: 1, borderRadius: 16, paddingVertical: 13, paddingHorizontal: 6, alignItems: 'center', gap: 4 },
  summaryBigText: { fontSize: 21, fontWeight: 'bold', marginTop: 2 },
  summaryLabel: { fontSize: 10, textAlign: 'center' },
  footnote: { fontSize: 10, marginTop: 9, lineHeight: 14 },
});
