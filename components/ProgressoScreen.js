import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import BottomNavigationBar from './BottomNavigationBar';

export default function ProgressoScreen({ navigation, themeMode }) {
  const isDarkMode = themeMode !== 'light';
  const theme = isDarkMode ? darkTheme : lightTheme;

  // Dados do gráfico de barras (S, T, Q, Q, S, S, D)
  const chartData = [
    { day: 'S', height: 50 },
    { day: 'T', height: 70 },
    { day: 'Q', height: 40 },
    { day: 'Q', height: 85 },
    { day: 'S', height: 60 },
    { day: 'S', height: 100 },
    { day: 'D', height: 75 },
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <View>
                <View style={styles.logoTitleRow}>
                  <Text style={[styles.appTitle, { color: theme.title }]}>
                    Progresso
                  </Text>
                  <Image
                    source={require('../assets/rabbit-face.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </View>
                <Text style={[styles.subtitleText, { color: theme.subtitle }]}>
                  Seu desempenho nos últimos 7 dias
                </Text>
              </View>

              {/* Avatar */}
              <TouchableOpacity
                style={[styles.avatarContainer, { backgroundColor: theme.avatarBg }]}
              >
                <Text style={[styles.avatarText, { color: theme.avatarText }]}>
                  M
                </Text>
              </TouchableOpacity>
            </View>

            {/* Card Sequência Atual */}
            <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
              <Text style={[styles.cardLabel, { color: theme.subtitle }]}>
                Sequência atual
              </Text>
              <View style={styles.streakRow}>
                <Text style={[styles.streakBigText, { color: theme.title }]}>
                  14 dias
                </Text>
                <Text style={[styles.streakBestText, { color: theme.subtitle }]}>
                  Melhor: 21 dias
                </Text>
              </View>
            </View>

            {/* Gráfico de Conclusão Semanal */}
            <Text style={[styles.sectionTitle, { color: theme.title }]}>
              Conclusão semanal
            </Text>

            <View style={[styles.chartCard, { backgroundColor: theme.cardBg }]}>
              <View style={styles.chartBarsContainer}>
                {chartData.map((item, index) => (
                  <View key={index} style={styles.barColumn}>
                    <View style={styles.barWrapper}>
                      <View
                        style={[
                          styles.barFill,
                          {
                            height: `${item.height}%`,
                            backgroundColor: theme.barColor,
                          },
                        ]}
                      />
                    </View>
                    <Text style={[styles.barDayText, { color: theme.subtitle }]}>
                      {item.day}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Resumo em Cards */}
            <Text style={[styles.sectionTitle, { color: theme.title }]}>
              Resumo
            </Text>

            <View style={styles.summaryRow}>
              {/* Card 1 */}
              <View style={[styles.summaryCard, { backgroundColor: theme.cardBg }]}>
                <Text style={[styles.summaryBigText, { color: theme.title }]}>
                  82%
                </Text>
                <Text style={[styles.summaryLabel, { color: theme.subtitle }]}>
                  Taxa semanal
                </Text>
              </View>

              {/* Card 2 */}
              <View style={[styles.summaryCard, { backgroundColor: theme.cardBg }]}>
                <Text style={[styles.summaryBigText, { color: theme.title }]}>
                  6
                </Text>
                <Text style={[styles.summaryLabel, { color: theme.subtitle }]}>
                  Hábitos ativos
                </Text>
              </View>

              {/* Card 3 */}
              <View style={[styles.summaryCard, { backgroundColor: theme.cardBg }]}>
                <Text style={[styles.summaryBigText, { color: theme.title }]}>
                  4
                </Text>
                <Text style={[styles.summaryLabel, { color: theme.subtitle }]}>
                  Concluídos hoje
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Barra de Navegação Inferior */}
          <BottomNavigationBar
            activeTab="Progresso"
            themeMode={themeMode}
            onTabPress={(tabName) => navigation?.navigate?.(tabName)}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const lightTheme = {
  bg: '#F4F7FC',
  title: '#0F141C',
  subtitle: '#6B7280',
  avatarBg: '#E5E7EB',
  avatarText: '#1F2937',
  cardBg: '#FFFFFF',
  barColor: '#0F141C',
};

const darkTheme = {
  bg: '#121212',
  title: '#FFFFFF',
  subtitle: '#9CA3AF',
  avatarBg: '#2E2E2E',
  avatarText: '#FFFFFF',
  cardBg: '#1E1E1E',
  barColor: '#FFFFFF',
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoTitleRow: { flexDirection: 'row', alignItems: 'center' },
  appTitle: { fontSize: 26, fontWeight: 'bold', marginRight: 8 },
  logoImage: { width: 32, height: 32 },
  subtitleText: { fontSize: 13, marginTop: 2 },
  avatarContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 16, fontWeight: 'bold' },
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  cardLabel: { fontSize: 13, marginBottom: 6 },
  streakRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  streakBigText: { fontSize: 28, fontWeight: 'bold' },
  streakBestText: { fontSize: 13 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 14 },
  chartCard: {
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  chartBarsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 140,
  },
  barColumn: { alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
  barWrapper: {
    width: 18,
    height: 110,
    justifyContent: 'flex-end',
    borderRadius: 9,
    overflow: 'hidden',
  },
  barFill: { width: '100%', borderRadius: 9 },
  barDayText: { fontSize: 12, fontWeight: 'bold', marginTop: 8 },
  summaryRow: { flexDirection: 'row', gap: 10 },
  summaryCard: {
    flex: 1,
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
  },
  summaryBigText: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  summaryLabel: { fontSize: 11, textAlign: 'center' },
});