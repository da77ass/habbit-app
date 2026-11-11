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

export default function NovoHabitoScreen({ navigation, themeMode, onAddHabit }) {
  const isDarkMode = themeMode !== 'light';
  const theme = isDarkMode ? darkTheme : lightTheme;

  const [nomeHabito, setNomeHabito] = useState('');
  const [frequencia, setFrequencia] = useState('Todos os dias');
  const [horario, setHorario] = useState('08:00');
  const [metaDiaria, setMetaDiaria] = useState('1 vez');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Saúde');

  const categorias = ['Estudos', 'Saúde', 'Leitura', 'Lazer'];

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

            {/* Frequência */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.label }]}>
                Frequência
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
                value={frequencia}
                onChangeText={setFrequencia}
              />
            </View>

            {/* Horário */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.label }]}>Horário</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: theme.inputBorder,
                    color: theme.inputText,
                    backgroundColor: theme.cardBg,
                  },
                ]}
                value={horario}
                onChangeText={setHorario}
              />
            </View>

            {/* Meta Diária */}
            <View style={styles.inputGroupSmall}>
              <Text style={[styles.label, { color: theme.label }]}>
                Meta diária
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
                value={metaDiaria}
                onChangeText={setMetaDiaria}
              />
            </View>

            {/* Categoria */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.label }]}>
                Categoria
              </Text>
              <View style={styles.categoriesContainer}>
                {categorias.map((cat) => {
                  const isSelected = categoriaSelecionada === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryChip,
                        {
                          backgroundColor: isSelected
                            ? theme.chipSelectedBg
                            : theme.chipUnselectedBg,
                          borderColor: isSelected
                            ? theme.chipSelectedBorder
                            : theme.chipUnselectedBorder,
                        },
                      ]}
                      onPress={() => setCategoriaSelecionada(cat)}
                    >
                      <Text
                        style={[
                          styles.categoryChipText,
                          {
                            color: isSelected
                              ? theme.chipSelectedText
                              : theme.chipUnselectedText,
                            fontWeight: isSelected ? 'bold' : 'normal',
                          },
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

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