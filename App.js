import React, { useState } from 'react';
import { useColorScheme } from 'react-native';
import LoginScreen from './components/LoginScreen';
import CadastroScreen from './components/CadastroScreen';
import InicioScreen from './components/InicioScreen';
import HabitosScreen from './components/HabitosScreen';
import ProgressoScreen from './components/ProgressoScreen';
import EditarHabitoScreen from './components/EditarHabitoScreen';
import NovoHabitoScreen from './components/NovoHabitoScreen';
import PerfilScreen from './components/PerfilScreen';
import { ACHIEVEMENTS, XP_PER_HABIT } from './utils/gamification';
import BlocoNotificacoes from './components/BlocoNotificacoes';
import BlocoHistorico from './components/BlocoHistorico';
import BlocoPrivacidade from './components/BlocoPrivacidade';

// O App controla qual tela está visível e fornece navegação aos componentes.
export default function App() {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState(systemColorScheme === 'light' ? 'light' : 'dark');
  const [telaAtual, setTelaAtual] = useState('Login');
  const [historico, setHistorico] = useState([]);
  const [parametrosTela, setParametrosTela] = useState({});
  // Fonte única dos hábitos: todas as telas recebem os mesmos dados.
  const [habitos, setHabitos] = useState([
    { id: '1', titulo: 'Beber 2L de água', frequencia: 'Todos os dias', horario: '08:00 - 20:00', metaDiaria: '2L', categoria: 'Saúde', concluido: false, diasSequencia: 0 },
    { id: '2', titulo: 'Estudar programação', frequencia: 'Seg–Sex', horario: '13:00', metaDiaria: '1 vez', categoria: 'Estudos', concluido: false, diasSequencia: 0 },
    { id: '3', titulo: 'Exercício', frequencia: 'Seg, Qua, Sex', horario: '16:00', metaDiaria: '1 vez', categoria: 'Saúde', concluido: false, diasSequencia: 0 },
    { id: '4', titulo: 'Ler 20 páginas', frequencia: 'Todos os dias', horario: '21:00', metaDiaria: '20 páginas', categoria: 'Leitura', concluido: false, diasSequencia: 0 },
    { id: '5', titulo: 'Cozinhar', frequencia: 'Todos os dias', horario: '22:00', metaDiaria: '1 vez', categoria: 'Lazer', concluido: false, diasSequencia: 0 },
  ]);
  const [gameData, setGameData] = useState({
    xp: 0,
    totalCompletions: 0,
    completedHabitIds: [],
    unlockedAchievementIds: [],
  });

  // Concede XP somente na primeira conclusão registrada de cada hábito.
  // Isso impede ganhar experiência repetindo marcar/desmarcar o mesmo item.
  const registerHabitCompletion = (habitId) => {
    setGameData((previous) => {
      if (previous.completedHabitIds.includes(habitId)) {
        return previous;
      }

      const completedHabitIds = [...previous.completedHabitIds, habitId];
      const totalCompletions = previous.totalCompletions + 1;

      const newlyUnlocked = ACHIEVEMENTS.filter(
        (achievement) =>
          totalCompletions >= achievement.requirement &&
          !previous.unlockedAchievementIds.includes(achievement.id)
      );

      const bonusXp = newlyUnlocked.reduce(
        (total, achievement) => total + achievement.rewardXp,
        0
      );

      return {
        xp: previous.xp + XP_PER_HABIT + bonusXp,
        totalCompletions,
        completedHabitIds,
        unlockedAchievementIds: [
          ...previous.unlockedAchievementIds,
          ...newlyUnlocked.map((achievement) => achievement.id),
        ],
      };
    });
  };

  const adicionarHabito = (dados) => {
    setHabitos((lista) => [...lista, { ...dados, id: String(Date.now()), concluido: false, diasSequencia: 0 }]);
    setTelaAtual('Hábitos');
  };
  const atualizarHabito = (id, dados) => {
    setHabitos((lista) => lista.map((h) => h.id === id ? { ...h, ...dados } : h));
    setTelaAtual('Hábitos');
  };
  const excluirHabito = (id) => {
    setHabitos((lista) => lista.filter((h) => h.id !== id));
    setTelaAtual('Hábitos');
  };
  const alternarConclusao = (id) => {
    const atual = habitos.find((h) => h.id === id);
    if (!atual) return;
    if (!atual.concluido) registerHabitCompletion(id);
    setHabitos((lista) => lista.map((h) => h.id === id ? { ...h, concluido: !h.concluido } : h));
  };

  const navigation = {
    navigate: (destino, params = {}) => {
      setParametrosTela(params);
      setHistorico((anterior) => [...anterior, telaAtual]);
      setTelaAtual(destino);
    },
    goBack: () => {
      if (historico.length === 0) {
        setTelaAtual('Login');
        return;
      }
      const novoHistorico = [...historico];
      const telaAnterior = novoHistorico.pop();
      setHistorico(novoHistorico);
      setTelaAtual(telaAnterior);
    },
  };

  const telas = {
    Login: LoginScreen,
    Cadastro: CadastroScreen,
    Início: InicioScreen,
    Hábitos: HabitosScreen,
    Novo: NovoHabitoScreen,
    Progresso: ProgressoScreen,
    Perfil: PerfilScreen,
    EditarHabito: EditarHabitoScreen,
    Notificacoes: BlocoNotificacoes,
    Historico: BlocoHistorico,
    Privacidade: BlocoPrivacidade,
  };

  const TelaSelecionada = telas[telaAtual] || PerfilScreen;

  return (
    <TelaSelecionada
      navigation={navigation}
      themeMode={themeMode}
      setThemeMode={setThemeMode}
      gameData={gameData}
      onHabitCompleted={registerHabitCompletion}
      habitos={habitos}
      onAddHabit={adicionarHabito}
      onUpdateHabit={atualizarHabito}
      onDeleteHabit={excluirHabito}
      onToggleHabit={alternarConclusao}
      selectedHabitId={parametrosTela.habitId}
    />
  );
}
