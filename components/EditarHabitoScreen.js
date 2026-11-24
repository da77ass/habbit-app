import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BottomNavigationBar from './BottomNavigationBar';
import DropdownField from './DropdownField';

export default function EditarHabitoScreen({ navigation, themeMode, habitos = [], selectedHabitId, onUpdateHabit, onDeleteHabit }) {
  const isDarkMode = themeMode !== 'light';
  const theme = isDarkMode ? darkTheme : lightTheme;

  const habit = habitos.find((item) => item.id === selectedHabitId);
  const [nomeHabito, setNomeHabito] = useState(habit?.titulo || '');
  const [frequencia, setFrequencia] = useState(habit?.frequencia || 'Todos os dias');
  const [horario, setHorario] = useState(habit?.horario || '08:00');
  const [metaDiaria, setMetaDiaria] = useState(habit?.metaDiaria || '1 vez');
  const [categoria, setCategoria] = useState(habit?.categoria || 'Saúde');
  const [corSelecionada, setCorSelecionada] = useState(habit?.cor || '#80BFFF');
  const frequencias = ['Todos os dias', 'Dias úteis (segunda a sexta)', 'Fins de semana', '3 vezes por semana', '2 vezes por semana', '1 vez por semana'];
  const horarios = ['05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'];
  const metas = ['1 vez', '2 vezes', '3 vezes', '4 vezes', '5 vezes', '10 vezes'];
  const categorias = ['Estudos', 'Saúde', 'Leitura', 'Lazer', 'Trabalho', 'Exercícios', 'Bem-estar', 'Finanças', 'Casa', 'Outros'];
  // Preserva opções legadas já gravadas no banco.
  if (!frequencias.includes(frequencia)) frequencias.unshift(frequencia);
  if (!horarios.includes(horario)) horarios.unshift(horario);
  if (!metas.includes(metaDiaria)) metas.unshift(metaDiaria);
  if (!categorias.includes(categoria)) categorias.unshift(categoria);


  const salvarAlteracoes = () => {
    if (!nomeHabito.trim() || !habit) return;
    onUpdateHabit?.(habit.id, { titulo: nomeHabito.trim(), frequencia, horario, metaDiaria, categoria, cor: corSelecionada });
  };
  const confirmarExclusao = () => {
    if (!habit) return;

    // Alert.alert não apresenta a caixa de confirmação corretamente no React Native Web.
    if (Platform.OS === 'web') {
      const confirmar = window.confirm(
        `Deseja realmente excluir o hábito "${habit.titulo}"? Ele sairá da sua lista, mas o histórico de conclusões será preservado.`
      );

      if (confirmar) {
        onDeleteHabit?.(habit.id);
      }
      return;
    }

    Alert.alert('Excluir hábito', 'Tem certeza de que deseja excluir este hábito?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => onDeleteHabit?.(habit.id) },
    ]);
  };

  const cores = [
    '#80BFFF', // Azul
    '#A3E635', // Verde
    '#D8B4FE', // Roxo
    '#FDE047', // Amarelo/Laranja
    '#FCA5A5', // Rosa
    '#CBD5E1', // Cinza
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Botão Voltar e Título */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => navigation?.goBack?.()}
                style={styles.backButton}
              >
                <Ionicons name="chevron-back" size={24} color={theme.title} />
              </TouchableOpacity>
              <View style={styles.headerTitles}>
                <Text style={[styles.title, { color: theme.title }]}>
                  Editar hábito
                </Text>
                <Text style={[styles.subtitle, { color: theme.subtitle }]}>
                  Altere as informações do seu hábito
                </Text>
              </View>
            </View>

            {/* Card Preview do Hábito */}
            <View style={[styles.previewCard, { backgroundColor: theme.cardBg }]}>
              <View
                style={[
                  styles.previewIconBox,
                  { backgroundColor: corSelecionada },
                ]}
              />
              <View style={styles.previewInfo}>
                <Text style={[styles.previewTitle, { color: theme.title }]}>
                  {nomeHabito || 'Nome do hábito'}
                </Text>
                <Text style={[styles.previewSubtitle, { color: theme.subtitle }]}>
                  {frequencia}
                </Text>
              </View>
            </View>

            {/* Form - Nome */}
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
                value={nomeHabito}
                onChangeText={setNomeHabito}
              />
            </View>

            <View style={styles.row}>
              <DropdownField compact label="Frequência" value={frequencia} options={frequencias} onChange={setFrequencia} theme={theme} />
              <DropdownField compact label="Horário" value={horario} options={horarios} onChange={setHorario} theme={theme} />
            </View>
            <View style={styles.row}>
              <DropdownField compact label="Meta diária" value={metaDiaria} options={metas} onChange={setMetaDiaria} theme={theme} />
              <DropdownField compact label="Categoria" value={categoria} options={categorias} onChange={setCategoria} theme={theme} />
            </View>

            {/* Seleção de Cores */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.label }]}>
                Cor do hábito
              </Text>
              <View style={styles.colorPalette}>
                {cores.map((cor) => {
                  const isSelected = corSelecionada === cor;
                  return (
                    <TouchableOpacity
                      key={cor}
                      style={[
                        styles.colorCircle,
                        { backgroundColor: cor },
                        isSelected && styles.colorCircleSelected,
                      ]}
                      onPress={() => setCorSelecionada(cor)}
                    />
                  );
                })}
              </View>
            </View>

            {/* Botão Salvar */}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.buttonBg }]}
              activeOpacity={0.8}
              onPress={salvarAlteracoes}
            >
              <Text style={[styles.buttonText, { color: theme.buttonText }]}>
                Salvar alterações
              </Text>
            </TouchableOpacity>

            {/* Botão Excluir */}
            <TouchableOpacity style={styles.deleteButton} activeOpacity={0.8} onPress={confirmarExclusao}>
              <Text style={styles.deleteButtonText}>Excluir hábito</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Barra de Navegação Inferior */}
          <BottomNavigationBar
            activeTab="Hábitos"
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
  buttonBg: '#0F141C',
  buttonText: '#FFFFFF',
};

const darkTheme = {
  bg: '#121212',
  title: '#FFFFFF',
  subtitle: '#9CA3AF',
  label: '#E5E7EB',
  cardBg: '#1E1E1E',
  inputBorder: '#2E2E2E',
  inputText: '#FFFFFF',
  buttonBg: '#FFFFFF',
  buttonText: '#121212',
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
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: { marginRight: 12 },
  headerTitles: { flex: 1, alignItems: 'center', marginRight: 24 },
  title: { fontSize: 22, fontWeight: 'bold' },
  subtitle: { fontSize: 13, marginTop: 2 },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginBottom: 20,
  },
  previewIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    marginRight: 14,
  },
  previewInfo: { flex: 1 },
  previewTitle: { fontSize: 16, fontWeight: 'bold' },
  previewSubtitle: { fontSize: 12, marginTop: 2 },
  inputGroup: { marginBottom: 16 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  flex1: { flex: 1 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  dropdownInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: { flex: 1, fontSize: 14 },
  colorPalette: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  colorCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  colorCircleSelected: {
    borderWidth: 3,
    borderColor: '#3B82F6',
  },
  button: {
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  buttonText: { fontSize: 16, fontWeight: 'bold' },
  deleteButton: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    backgroundColor: '#FFF5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  deleteButtonText: { color: '#EF4444', fontSize: 15, fontWeight: 'bold' },
});