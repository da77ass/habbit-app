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
import BottomNavigationBar from './BottomNavigationBar';
import DropdownField from './DropdownField';

export default function NovoHabitoScreen({ navigation, themeMode, onAddHabit }) {
  const isDarkMode = themeMode !== 'light';
  const theme = isDarkMode ? darkTheme : lightTheme;

  const [nomeHabito, setNomeHabito] = useState('');
  const [frequencia, setFrequencia] = useState('Todos os dias');
  const [horario, setHorario] = useState('08:00');
  const [metaDiaria, setMetaDiaria] = useState('1 vez');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Saúde');

  const frequencias = ['Todos os dias', 'Dias úteis (segunda a sexta)', 'Fins de semana', '3 vezes por semana', '2 vezes por semana', '1 vez por semana'];
  const horarios = ['05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'];
  const metas = ['1 vez', '2 vezes', '3 vezes', '4 vezes', '5 vezes', '10 vezes'];
  const categorias = ['Estudos', 'Saúde', 'Leitura', 'Lazer', 'Trabalho', 'Exercícios', 'Bem-estar', 'Finanças', 'Casa', 'Outros'];

  const salvarHabito = () => {
    if (!nomeHabito.trim()) return;
    onAddHabit?.({ titulo: nomeHabito.trim(), frequencia, horario, metaDiaria, categoria: categoriaSelecionada });
  };

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
                  Novo hábito
                </Text>
                <Image
                  source={require('../assets/rabbit-face.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={[styles.subtitleText, { color: theme.subtitle }]}>
                Crie um hábito simples e fácil de acompanhar.
              </Text>
            </View>

            {/* Nome do Hábito */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.label }]}>
                Nome do hábito
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: theme.inputBorder,
                    color: theme.inputText,
                    backgroundColor: theme.cardBg,
                  },
                ]}
                placeholder="Ex.: Beber água"
                placeholderTextColor={theme.placeholder}
                value={nomeHabito}
                onChangeText={setNomeHabito}
              />
            </View>

            <DropdownField label="Frequência" value={frequencia} options={frequencias} onChange={setFrequencia} theme={theme} />
            <DropdownField label="Horário" value={horario} options={horarios} onChange={setHorario} theme={theme} />
            <DropdownField label="Meta diária" value={metaDiaria} options={metas} onChange={setMetaDiaria} theme={theme} />
            <DropdownField label="Categoria" value={categoriaSelecionada} options={categorias} onChange={setCategoriaSelecionada} theme={theme} />

            {/* Botão Salvar Hábito */}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.buttonBg }]}
              activeOpacity={0.8}
              onPress={salvarHabito}
            >
              <Text style={[styles.buttonText, { color: theme.buttonText }]}>
                Salvar hábito
              </Text>
            </TouchableOpacity>

            {/* Cancelar */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation?.goBack?.()}
            >
              <Text style={[styles.cancelText, { color: theme.cancelText }]}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Barra de Navegação Inferior */}
          <BottomNavigationBar
            activeTab="Novo"
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
  label: '#1F2937',
  cardBg: '#FFFFFF',
  inputBorder: '#E5E7EB',
  inputText: '#1F2937',
  placeholder: '#9CA3AF',
  chipSelectedBg: '#FFFFFF',
  chipSelectedBorder: '#0F141C',
  chipSelectedText: '#0F141C',
  chipUnselectedBg: '#FFFFFF',
  chipUnselectedBorder: '#E5E7EB',
  chipUnselectedText: '#4B5563',
  buttonBg: '#0F141C',
  buttonText: '#FFFFFF',
  cancelText: '#6B7280',
};

const darkTheme = {
  bg: '#121212',
  title: '#FFFFFF',
  subtitle: '#9CA3AF',
  label: '#E5E7EB',
  cardBg: '#1E1E1E',
  inputBorder: '#2E2E2E',
  inputText: '#FFFFFF',
  placeholder: '#6B7280',
  chipSelectedBg: '#2E2E2E',
  chipSelectedBorder: '#FFFFFF',
  chipSelectedText: '#FFFFFF',
  chipUnselectedBg: '#1E1E1E',
  chipUnselectedBorder: '#2E2E2E',
  chipUnselectedText: '#9CA3AF',
  buttonBg: '#FFFFFF',
  buttonText: '#121212',
  cancelText: '#9CA3AF',
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  header: { marginBottom: 20 },
  logoTitleRow: { flexDirection: 'row', alignItems: 'center' },
  appTitle: { fontSize: 26, fontWeight: 'bold', marginRight: 8 },
  logoImage: { width: 32, height: 32 },
  subtitleText: { fontSize: 13, marginTop: 4 },
  inputGroup: { marginBottom: 16 },
  inputGroupSmall: { marginBottom: 16, width: '50%' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  categoryChipText: { fontSize: 13 },
  button: {
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  buttonText: { fontSize: 16, fontWeight: 'bold' },
  cancelButton: { alignItems: 'center', paddingVertical: 14 },
  cancelText: { fontSize: 14, fontWeight: 'bold' },
});