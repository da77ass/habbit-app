import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BottomNavigationBar from './BottomNavigationBar';

export default function HabitosScreen({ navigation, themeMode, habitos = [], nomeUsuario = '' }) {
  const isDarkMode = themeMode !== 'light';
  const theme = isDarkMode ? darkTheme : lightTheme;

  const [busca, setBusca] = useState('');
  const [activeTab, setActiveTab] = useState('Hábitos');

  // Filtra hábitos com base na busca
  const habitosFiltrados = habitos.filter((h) =>
    h.titulo.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header com Titulo "Meus hábitos", Coelho e Avatar */}
            <View style={styles.header}>
              <View>
                <View style={styles.titleRow}>
                  <Text style={[styles.appTitle, { color: theme.title }]}>
                    Meus hábitos
                  </Text>
                  <Image
                    source={require('../assets/rabbit-face.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </View>
                <Text style={[styles.subtitleText, { color: theme.subtitle }]}>
                  {habitos.length} hábitos ativos
                </Text>
              </View>

              {/* Avatar do Usuário */}
              <TouchableOpacity onPress={() => navigation?.navigate?.('Perfil')}
                style={[styles.avatarContainer, { backgroundColor: theme.avatarBg }]}
              >
                <Text style={[styles.avatarText, { color: theme.avatarText }]}>
                  {(nomeUsuario || 'U').trim().charAt(0).toUpperCase()}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Campo de Busca */}
            <View style={[styles.searchContainer, { backgroundColor: theme.cardBg }]}>
              <Ionicons
                name="search-outline"
                size={20}
                color={theme.searchIcon}
                style={styles.searchIcon}
              />
              <TextInput
                style={[styles.searchInput, { color: theme.inputText }]}
                placeholder="Buscar hábito"
                placeholderTextColor={theme.placeholder}
                value={busca}
                onChangeText={setBusca}
              />
            </View>

            {/* Lista de Hábitos */}
            <View style={styles.habitsList}>
              {habitosFiltrados.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.habitCard, { backgroundColor: theme.cardBg }]}
                  activeOpacity={0.8}
                  onPress={() => navigation?.navigate?.('EditarHabito', { habitId: item.id })}
                >
                  <View style={styles.leftContent}>
                    <View
                      style={[
                        styles.checkIconContainer,
                        { backgroundColor: item.cor || theme.checkBg },
                      ]}
                    >
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color="#FFFFFF"
                      />
                    </View>
                    <View style={styles.habitInfo}>
                      <Text style={[styles.habitTitle, { color: theme.title }]}>
                        {item.titulo}
                      </Text>
                      <Text style={[styles.habitFrequency, { color: theme.subtitle }]}>
                        {item.frequencia}
                      </Text>
                    </View>
                  </View>

                  {/* Contador de Dias de Sequência */}
                  <Text style={[styles.daysText, { color: theme.daysText }]}>
                    {item.diasSequencia || 0} dias
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Barra de Navegação Inferior */}
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

/* Paleta Monocromática Light / Dark */
const lightTheme = {
  bg: '#F4F7FC',
  title: '#0F141C',
  subtitle: '#6B7280',
  avatarBg: '#E5E7EB',
  avatarText: '#1F2937',
  cardBg: '#FFFFFF',
  searchIcon: '#9CA3AF',
  placeholder: '#9CA3AF',
  inputText: '#1F2937',
  checkBg: '#E5E7EB',
  checkIcon: '#6B7280',
  daysText: '#1F2937',
};

const darkTheme = {
  bg: '#121212',
  title: '#FFFFFF',
  subtitle: '#9CA3AF',
  avatarBg: '#2E2E2E',
  avatarText: '#FFFFFF',
  cardBg: '#1E1E1E',
  searchIcon: '#6B7280',
  placeholder: '#6B7280',
  inputText: '#FFFFFF',
  checkBg: '#2E2E2E',
  checkIcon: '#9CA3AF',
  daysText: '#E5E7EB',
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
  titleRow: {
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

  /* Campo de Busca */
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },

  /* Lista de Hábitos */
  habitsList: {
    gap: 12,
  },
  habitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  habitInfo: {
    flex: 1,
  },
  habitTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  habitFrequency: {
    fontSize: 12,
  },
  daysText: {
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});