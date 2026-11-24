import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BottomNavigationBar from './BottomNavigationBar';

export default function InicioScreen({ navigation, themeMode, habitos = [], onToggleHabit, nomeUsuario = '' }) {
  const isDarkMode = themeMode !== 'light';
  const theme = isDarkMode ? darkTheme : lightTheme;

  const [activeTab, setActiveTab] = useState('Início');
  const hoje = new Date();
  const dataFormatada = hoje.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const nomeExibicao = nomeUsuario || 'Usuário';
  const inicial = nomeExibicao.trim().charAt(0).toUpperCase() || 'U';

  const toggleHabito = (id) => onToggleHabit?.(id);

  const concluidosCount = habitos.filter((h) => h.concluido).length;
  const totalCount = habitos.length;
  const porcentagem = totalCount > 0 ? Math.round((concluidosCount / totalCount) * 100) : 0;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header com Logo, Data e Avatar */}
            <View style={styles.header}>
              <View>
                <View style={styles.logoTitleRow}>
                  <Text style={[styles.appTitle, { color: theme.title }]}>Habbit</Text>
                  <Image
                    source={require('../assets/rabbit-face.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </View>
                <Text style={[styles.dateText, { color: theme.subtitle }]}>
                  {dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1)}
                </Text>
              </View>

              {/* Avatar do Usuário */}
              <TouchableOpacity onPress={() => navigation?.navigate?.('Perfil')} style={[styles.avatarContainer, { backgroundColor: theme.avatarBg }]}>
                <Text style={[styles.avatarText, { color: theme.avatarText }]}>{inicial}</Text>
              </TouchableOpacity>
            </View>

            {/* Saudação */}
            <View style={styles.greetingContainer}>
              <Text style={[styles.greetingTitle, { color: theme.title }]}>
                {`${hoje.getHours() < 12 ? 'Bom dia' : hoje.getHours() < 18 ? 'Boa tarde' : 'Boa noite'}, ${nomeExibicao}!`}
              </Text>
              <Text style={[styles.greetingSubtitle, { color: theme.subtitle }]}>
                Tente manter sua sequência de Hábitos!
              </Text>
            </View>

            {/* Card de Progresso */}
            <View style={[styles.progressCard, { backgroundColor: theme.cardBg }]}>
              <View style={styles.progressHeaderRow}>
                <Text style={[styles.progressTag, { color: theme.cardTag }]}>
                  PROGRESSO DE HOJE
                </Text>
                {/* Barra Visual de Progresso */}
                <View style={[styles.progressBarBackground, { backgroundColor: theme.progressBarBg }]}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${porcentagem}%`, backgroundColor: theme.progressBarFill },
                    ]}
                  />
                </View>
              </View>

              <Text style={[styles.progressMainText, { color: theme.cardTitle }]}>
                {concluidosCount} de {totalCount} hábitos
              </Text>
              <Text style={[styles.progressPercentageText, { color: theme.cardSubtitle }]}>
                {porcentagem}% concluído
              </Text>
            </View>

            {/* Seção de Hábitos de Hoje */}
            <Text style={[styles.sectionTitle, { color: theme.title }]}>
              Hábitos de hoje
            </Text>

            <View style={styles.habitsList}>
              {habitos.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.habitCard, { backgroundColor: theme.habitCardBg }]}
                  activeOpacity={0.7}
                  onPress={() => toggleHabito(item.id)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      item.concluido
                        ? [styles.checkboxChecked, { backgroundColor: item.cor || '#16A34A', borderColor: item.cor || '#16A34A' }]
                        : [styles.checkboxUnchecked, { borderColor: theme.checkboxBorder }],
                    ]}
                  >
                    {item.concluido && (
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    )}
                  </View>

                  <View style={styles.habitInfo}>
                    <Text style={[styles.habitTitle, { color: theme.habitTitle }]}>
                      {item.titulo}
                    </Text>
                    <Text style={[styles.habitTime, { color: theme.subtitle }]}>
                      {item.horario}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Componente Reutilizável da Barra Inferior */}
          <BottomNavigationBar
            activeTab={activeTab}
            themeMode={themeMode}
            onTabPress={(tabName) => navigation?.navigate?.(tabName)}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

/* Paletas Monocromáticas Light / Dark */
const lightTheme = {
  bg: '#F4F7FC',
  title: '#0F141C',
  subtitle: '#6B7280',
  avatarBg: '#E5E7EB',
  avatarText: '#1F2937',
  cardBg: '#0F141C',
  cardTag: '#9CA3AF',
  cardTitle: '#FFFFFF',
  cardSubtitle: '#9CA3AF',
  progressBarBg: '#1F2937',
  progressBarFill: '#FFFFFF',
  habitCardBg: '#FFFFFF',
  habitTitle: '#0F141C',
  checkboxBorder: '#D1D5DB',
};

const darkTheme = {
  bg: '#121212',
  title: '#FFFFFF',
  subtitle: '#9CA3AF',
  avatarBg: '#2E2E2E',
  avatarText: '#FFFFFF',
  cardBg: '#1E1E1E',
  cardTag: '#9CA3AF',
  cardTitle: '#FFFFFF',
  cardSubtitle: '#9CA3AF',
  progressBarBg: '#2E2E2E',
  progressBarFill: '#FFFFFF',
  habitCardBg: '#1E1E1E',
  habitTitle: '#FFFFFF',
  checkboxBorder: '#4B5563',
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginRight: 8,
  },
  logoImage: {
    width: 32,
    height: 32,
  },
  dateText: {
    fontSize: 13,
    marginTop: 2,
  },
  avatarContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  /* Saudação */
  greetingContainer: {
    marginBottom: 10,
  },
  greetingTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 0,
  },
  greetingSubtitle: {
    fontSize: 14,
  },

  /* Card de Progresso */
  progressCard: {
    borderRadius: 20,
    padding: 13,
    marginBottom: 28,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTag: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  progressBarBackground: {
    width: 100,
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressMainText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  progressPercentageText: {
    fontSize: 13,
  },

  /* Lista de Hábitos */
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  habitsList: {
    gap: 12,
  },
  habitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 9,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  checkboxChecked: {
    backgroundColor: '#10B981', // Verde de confirmação
  },
  checkboxUnchecked: {
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  habitInfo: {
    flex: 1,
  },
  habitTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  habitTime: {
    fontSize: 12,
  },
});