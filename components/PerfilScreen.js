import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
  ScrollView,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BottomNavigationBar from './BottomNavigationBar';
import { ACHIEVEMENTS, getLevelInfo } from '../utils/gamification';

// Importação dos blocos modulares isolados
import BlocoNotificacoes from './BlocoNotificacoes';
import BlocoHistorico from './BlocoHistorico';
import BlocoPrivacidade from './BlocoPrivacidade';

export default function PerfilScreen({ navigation, themeMode, setThemeMode, gameData, habitos = [], historyData, onLogout, nomeUsuario = '', onSaveDisplayName }) {
  const isDarkMode = themeMode !== 'light';
  const theme = isDarkMode ? darkTheme : lightTheme;

  // Estado que controla qual bloco está aberto ('notificacoes', 'historico', 'privacidade' ou null)
  const [blocoAberto, setBlocoAberto] = useState(null);
  const [nomeEditado, setNomeEditado] = useState(nomeUsuario);
  const [salvandoNome, setSalvandoNome] = useState(false);
  React.useEffect(() => setNomeEditado(nomeUsuario), [nomeUsuario]);
  const salvarNome = async () => {
    try {
      setSalvandoNome(true);
      await onSaveDisplayName?.(nomeEditado);
      Alert.alert('Perfil atualizado', 'Seu nome foi salvo com sucesso.');
    } catch (error) {
      Alert.alert('Não foi possível salvar', error.message || 'Tente novamente.');
    } finally {
      setSalvandoNome(false);
    }
  };

  const toggleBloco = (id) => {
    setBlocoAberto((atual) => (atual === id ? null : id));
  };

  // Gamificação
  const xp = gameData?.xp ?? 0;
  const unlockedIds = gameData?.unlockedAchievementIds ?? [];
  const { level, xpInLevel, xpForNextLevel, progress } = getLevelInfo(xp);
  const unlockedAchievements = ACHIEVEMENTS.filter((item) => unlockedIds.includes(item.id));
  const currentTitle = unlockedAchievements.length
    ? unlockedAchievements[unlockedAchievements.length - 1].rewardTitle
    : 'Explorador';

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
              <View style={styles.logoTitleRow}>
                <Text style={[styles.appTitle, { color: theme.title }]}>
                  Perfil
                </Text>
                <Image
                  source={require('../assets/rabbit-face.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={[styles.subtitleText, { color: theme.subtitle }]}>
                Personalize sua experiência
              </Text>
            </View>

            {/* Perfil do Usuário */}
            <View style={styles.userSection}>
              <View
                style={[
                  styles.avatarContainer,
                  { backgroundColor: theme.avatarBg },
                ]}
              >
                <Text style={[styles.avatarText, { color: theme.avatarText }]}>
                  M
                </Text>
              </View>
              <Text style={[styles.userName, { color: theme.title }]}>
                {nomeUsuario || 'Usuário'}
              </Text>
              <Text style={[styles.userStats, { color: theme.subtitle }]}>
                {currentTitle}
              </Text>
              <View style={styles.nameEditRow}>
                <TextInput value={nomeEditado} onChangeText={setNomeEditado} placeholder="Seu nome"
                  placeholderTextColor={theme.subtitle} maxLength={40}
                  style={[styles.nameInput, { color: theme.title, borderColor: theme.inputBorder, backgroundColor: theme.cardBg }]} />
                <TouchableOpacity onPress={salvarNome} disabled={salvandoNome || !nomeEditado.trim()}
                  style={[styles.nameSaveButton, { backgroundColor: theme.xpColor, opacity: salvandoNome ? 0.6 : 1 }]}>
                  <Text style={styles.nameSaveText}>{salvandoNome ? '...' : 'Salvar'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Cartão de Nível e Experiência */}
            <View style={[styles.gamificationCard, { backgroundColor: theme.cardBg }]}>
              <View style={styles.levelHeader}>
                <View>
                  <Text style={[styles.levelLabel, { color: theme.subtitle }]}>
                    NÍVEL ATUAL
                  </Text>
                  <Text style={[styles.levelValue, { color: theme.title }]}>
                    Nível {level}
                  </Text>
                </View>
                <View style={[styles.xpPill, { backgroundColor: theme.xpPillBg }]}>
                  <Ionicons name="flash" size={15} color={theme.xpColor} />
                  <Text style={[styles.xpPillText, { color: theme.xpColor }]}>
                    {xp} XP
                  </Text>
                </View>
              </View>

              <View style={[styles.xpTrack, { backgroundColor: theme.xpTrack }]}>
                <View
                  style={[
                    styles.xpFill,
                    { width: `${progress * 100}%`, backgroundColor: theme.xpColor },
                  ]}
                />
              </View>
              <Text style={[styles.xpCaption, { color: theme.subtitle }]}>
                {xpInLevel} / {xpForNextLevel} XP para o próximo nível
              </Text>
            </View>

            {/* Conquistas */}
            <View style={styles.achievementsSection}>
              <View style={styles.achievementsHeader}>
                <Text style={[styles.sectionHeading, { color: theme.title }]}>
                  Conquistas
                </Text>
                <Text style={[styles.achievementCount, { color: theme.subtitle }]}>
                  {unlockedAchievements.length}/{ACHIEVEMENTS.length} desbloqueadas
                </Text>
              </View>

              {ACHIEVEMENTS.map((achievement) => {
                const unlocked = unlockedIds.includes(achievement.id);
                return (
                  <View
                    key={achievement.id}
                    style={[
                      styles.achievementCard,
                      { backgroundColor: theme.cardBg, opacity: unlocked ? 1 : 0.58 },
                    ]}
                  >
                    <View
                      style={[
                        styles.achievementIcon,
                        { backgroundColor: unlocked ? theme.xpPillBg : theme.lockedBg },
                      ]}
                    >
                      <Ionicons
                        name={unlocked ? achievement.icon : 'lock-closed-outline'}
                        size={22}
                        color={unlocked ? theme.xpColor : theme.subtitle}
                      />
                    </View>
                    <View style={styles.achievementInfo}>
                      <Text style={[styles.achievementTitle, { color: theme.title }]}>
                        {achievement.title}
                      </Text>
                      <Text style={[styles.achievementDescription, { color: theme.subtitle }]}>
                        {achievement.description}
                      </Text>
                      <Text style={[styles.achievementReward, { color: theme.xpColor }]}>
                        +{achievement.rewardXp} XP • Título: {achievement.rewardTitle}
                      </Text>
                    </View>
                    {unlocked && (
                      <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
                    )}
                  </View>
                );
              })}
            </View>

            {/* LISTA DE BLOCOS EXPANDÍVEIS */}
            <View style={styles.menuContainer}>
              <TouchableOpacity style={[styles.menuCard, { backgroundColor: theme.cardBg }]} onPress={() => navigation?.navigate?.('Calendario')}>
                <Text style={[styles.menuTitle, { color: theme.title }]}>Calendário de hábitos</Text>
                <Ionicons name="calendar-outline" size={20} color={theme.subtitle} />
              </TouchableOpacity>
              <BlocoNotificacoes
                theme={theme}
                isOpen={blocoAberto === 'notificacoes'}
                onToggle={() => toggleBloco('notificacoes')}
              />

              {/* Botão simples do Modo Claro/Escuro */}
              <View style={[styles.menuCard, { backgroundColor: theme.cardBg }]}>
                <Text style={[styles.menuTitle, { color: theme.title }]}>
                  {themeMode === 'light' ? 'Modo claro ativado' : 'Modo claro'}
                </Text>
                <Switch
                  value={themeMode === 'light'}
                  onValueChange={(enabled) => setThemeMode?.(enabled ? 'light' : 'dark')}
                  trackColor={{ false: '#6B7280', true: '#86C7A5' }}
                  thumbColor={themeMode === 'light' ? '#FFFFFF' : '#E5E7EB'}
                />
              </View>

              <BlocoHistorico
                theme={theme}
                habitos={habitos}
                historyData={historyData}
                isOpen={blocoAberto === 'historico'}
                onToggle={() => toggleBloco('historico')}
              />

              <BlocoPrivacidade
                theme={theme}
                isOpen={blocoAberto === 'privacidade'}
                onToggle={() => toggleBloco('privacidade')}
                onLogout={onLogout}
              />
            </View>

            {/* Botão Sair */}
            <TouchableOpacity
              style={[styles.logoutCard, { backgroundColor: theme.cardBg }]}
              activeOpacity={0.8}
              onPress={onLogout}
            >
              <Text style={styles.logoutText}>Sair da conta</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Barra Inferior */}
          <BottomNavigationBar
            activeTab="Perfil"
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
  subOptionBg: '#F3F4F6',
  arrowColor: '#9CA3AF',
  xpPillBg: '#E8F5EC',
  xpColor: '#16803D',
  xpTrack: '#E5E7EB',
  inputBorder: '#D1D5DB',
  lockedBg: '#F3F4F6',
};

const darkTheme = {
  bg: '#121212',
  title: '#FFFFFF',
  subtitle: '#9CA3AF',
  avatarBg: '#2E2E2E',
  avatarText: '#FFFFFF',
  cardBg: '#1E1E1E',
  subOptionBg: '#2A2A2A',
  arrowColor: '#6B7280',
  xpPillBg: '#263B2E',
  xpColor: '#86C7A5',
  xpTrack: '#374151',
  inputBorder: '#374151',
  lockedBg: '#2A2A2A',
};

const styles = StyleSheet.create({
  nameEditRow: { flexDirection: 'row', width: '100%', maxWidth: 360, gap: 8, marginTop: 12 },
  nameInput: { flex: 1, height: 42, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12 },
  nameSaveButton: { paddingHorizontal: 16, borderRadius: 10, justifyContent: 'center' },
  nameSaveText: { color: '#FFFFFF', fontWeight: 'bold' },
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
  subtitleText: {
    fontSize: 13,
    marginTop: 2,
  },

  /* Seção do Usuário */
  userSection: {
    alignItems: 'center',
    marginVertical: 12,
    marginBottom: 28,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userStats: {
    fontSize: 13,
  },

  /* Gamificação: nível, XP e conquistas */
  gamificationCard: {
    padding: 18,
    borderRadius: 18,
    marginBottom: 22,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  levelLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.7,
  },
  levelValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 3,
  },
  xpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  xpPillText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  xpTrack: {
    height: 9,
    borderRadius: 5,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    borderRadius: 5,
  },
  xpCaption: {
    fontSize: 11,
    marginTop: 8,
  },
  achievementsSection: {
    marginBottom: 24,
  },
  achievementsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  achievementCount: {
    fontSize: 11,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
    gap: 12,
  },
  achievementIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  achievementDescription: {
    fontSize: 11,
    marginBottom: 4,
  },
  achievementReward: {
    fontSize: 10,
    fontWeight: '600',
  },

  /* Lista de Menus */
  menuContainer: {
    gap: 12,
    marginBottom: 24,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 18,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },

  /* Botão Sair */
  logoutCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 18,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#EF4444',
  },
});