import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';

import LoginScreen from './components/LoginScreen';
import CadastroScreen from './components/CadastroScreen';
import InicioScreen from './components/InicioScreen';
import HabitosScreen from './components/HabitosScreen';
import ProgressoScreen from './components/ProgressoScreen';
import EditarHabitoScreen from './components/EditarHabitoScreen';
import NovoHabitoScreen from './components/NovoHabitoScreen';
import PerfilScreen from './components/PerfilScreen';
import BlocoNotificacoes from './components/BlocoNotificacoes';
import BlocoHistorico from './components/BlocoHistorico';
import BlocoPrivacidade from './components/BlocoPrivacidade';
import CalendarioScreen from './components/CalendarioScreen';

import { supabase } from './services/supabase';
import { sairUsuario } from './services/auth';
import { carregarGamificacao, concluirHabitoNoBanco, desfazerConclusaoNoBanco } from './services/gamificacao';
import { carregarHistorico } from './services/historico';
import {
  listarHabitos,
  criarHabito,
  atualizarHabito as atualizarHabitoNoBanco,
  excluirHabito as excluirHabitoNoBanco,
  alternarConclusaoHabito,
} from './services/habitos';

const GAME_DATA_INICIAL = {
  xp: 0,
  totalCompletions: 0,
  completedHabitIds: [],
  unlockedAchievementIds: [],
};

export default function App() {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState(systemColorScheme === 'light' ? 'light' : 'dark');
  const [telaAtual, setTelaAtual] = useState('Login');
  const [historico, setHistorico] = useState([]);
  const [parametrosTela, setParametrosTela] = useState({});

  const [usuario, setUsuario] = useState(null);
  const [sessaoVerificada, setSessaoVerificada] = useState(false);
  const [carregandoHabitos, setCarregandoHabitos] = useState(false);
  const [habitos, setHabitos] = useState([]);
  const [gameData, setGameData] = useState(GAME_DATA_INICIAL);
  const [historyData, setHistoryData] = useState({ registros: [], totalConclusoes: 0, streakAtual: 0, maiorStreak: 0, conclusoesPorDia: [], diasComConclusao: 0 });
  const [nomeUsuario, setNomeUsuario] = useState('');

  // Recupera a sessão salva e acompanha login/logout feitos pelo Supabase Auth.
  useEffect(() => {
    let ativo = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_evento, session) => {
      if (!ativo) return;

      const usuarioAtual = session?.user || null;
      setUsuario(usuarioAtual);
      setHistorico([]);
      setParametrosTela({});
      setTelaAtual(usuarioAtual ? 'Início' : 'Login');

      if (!usuarioAtual) {
        setHabitos([]);
        setGameData(GAME_DATA_INICIAL);
        setHistoryData({ registros: [], totalConclusoes: 0, streakAtual: 0, maiorStreak: 0, conclusoesPorDia: [], diasComConclusao: 0 });
      }
    });

    supabase.auth.getSession()
      .then(({ data, error }) => {
        if (!ativo) return;
        if (error) throw error;

        const usuarioAtual = data.session?.user || null;
        setUsuario(usuarioAtual);
        setTelaAtual(usuarioAtual ? 'Início' : 'Login');
        setSessaoVerificada(true);
      })
      .catch((error) => {
        console.error('Erro ao recuperar sessão:', error);
        if (ativo) {
          setUsuario(null);
          setTelaAtual('Login');
          setSessaoVerificada(true);
        }
      });

    return () => {
      ativo = false;
      subscription.unsubscribe();
    };
  }, []);

  // Sempre que a conta muda, carrega somente os hábitos daquela conta.
  useEffect(() => {
    let ativo = true;

    if (!usuario?.id) {
      setHabitos([]);
      setCarregandoHabitos(false);
      return () => { ativo = false; };
    }

    async function carregar() {
      try {
        setCarregandoHabitos(true);
        const dados = await listarHabitos(usuario.id);
        if (ativo) setHabitos(dados);
      } catch (error) {
        console.error('Erro ao carregar hábitos:', error);
        if (ativo) {
          Alert.alert('Erro ao carregar hábitos', error.message || 'Verifique sua conexão com o Supabase.');
        }
      } finally {
        if (ativo) setCarregandoHabitos(false);
      }
    }

    carregar();
    return () => { ativo = false; };
  }, [usuario?.id]);

  // Carrega XP e conquistas persistidos para o usuário autenticado.
  useEffect(() => {
    let ativo = true;

    if (!usuario?.id) {
      setGameData(GAME_DATA_INICIAL);
      return () => { ativo = false; };
    }

    carregarGamificacao(usuario.id)
      .then((dados) => {
        if (ativo) setGameData(dados);
      })
      .catch((error) => {
        console.error('Erro ao carregar gamificação:', error);
        if (ativo) {
          Alert.alert('Erro ao carregar perfil', error.message || 'Não foi possível carregar XP e conquistas.');
        }
      });

    return () => { ativo = false; };
  }, [usuario?.id]);

  // Carrega o histórico real e calcula as sequências de dias com conclusão.
  useEffect(() => {
    let ativo = true;
    if (!usuario?.id) {
      setHistoryData({ registros: [], totalConclusoes: 0, streakAtual: 0, maiorStreak: 0, conclusoesPorDia: [], diasComConclusao: 0 });
      return () => { ativo = false; };
    }
    carregarHistorico(usuario.id)
      .then((dados) => { if (ativo) setHistoryData(dados); })
      .catch((error) => {
        console.error('Erro ao carregar histórico:', error);
        if (ativo) Alert.alert('Erro ao carregar histórico', error.message || 'Não foi possível consultar as conclusões.');
      });
    return () => { ativo = false; };
  }, [usuario?.id]);

  useEffect(() => {
    let ativo = true;
    if (!usuario?.id) {
      setNomeUsuario('');
      return () => { ativo = false; };
    }
    supabase.from('profiles').select('nome_usuario').eq('id', usuario.id).maybeSingle()
      .then(({ data, error }) => {
        if (error) throw error;
        if (ativo) setNomeUsuario(data?.nome_usuario || usuario.user_metadata?.name || usuario.email?.split('@')[0] || '');
      })
      .catch((error) => console.error('Erro ao carregar nome do perfil:', error));
    return () => { ativo = false; };
  }, [usuario?.id]);

  const salvarNomeUsuario = async (novoNome) => {
    if (!usuario?.id) return;
    const nome = novoNome.trim();
    if (!nome) throw new Error('Informe um nome de usuário.');
    const { error } = await supabase.from('profiles')
      .update({ nome_usuario: nome })
      .eq('id', usuario.id);
    if (error) throw error;
    setNomeUsuario(nome);
  };

  const atualizarHistorico = async () => {
    if (!usuario?.id) return;
    const dados = await carregarHistorico(usuario.id);
    setHistoryData(dados);
  };

  const atualizarGamificacao = async () => {
    if (!usuario?.id) return;
    const dados = await carregarGamificacao(usuario.id);
    setGameData(dados);
  };

  const adicionarHabito = async (dados) => {
    if (!usuario?.id) return;

    try {
      const novoHabito = await criarHabito(usuario.id, dados);
      setHabitos((lista) => [...lista, novoHabito]);
      setTelaAtual('Hábitos');
      setHistorico([]);
    } catch (error) {
      console.error('Erro ao cadastrar hábito:', error);
      Alert.alert('Não foi possível salvar', error.message || 'Tente novamente.');
    }
  };

  const atualizarHabito = async (id, dados) => {
    if (!usuario?.id) return;

    try {
      const atualizado = await atualizarHabitoNoBanco(usuario.id, id, dados);
      setHabitos((lista) => lista.map((item) => item.id === id ? { ...item, ...atualizado } : item));
      setTelaAtual('Hábitos');
      setHistorico([]);
    } catch (error) {
      console.error('Erro ao atualizar hábito:', error);
      Alert.alert('Não foi possível atualizar', error.message || 'Tente novamente.');
    }
  };

  const excluirHabito = async (id) => {
    if (!usuario?.id) return;

    try {
      await excluirHabitoNoBanco(usuario.id, id);
      setHabitos((lista) => lista.filter((item) => item.id !== id));
      setTelaAtual('Hábitos');
      setHistorico([]);
    } catch (error) {
      console.error('Erro ao excluir hábito:', error);
      Alert.alert('Não foi possível excluir', error.message || 'Tente novamente.');
    }
  };

  const alternarConclusao = async (id) => {
    if (!usuario?.id) return;

    const atual = habitos.find((item) => item.id === id);
    if (!atual) return;

    try {
      if (atual.concluido) {
        await desfazerConclusaoNoBanco(id);
      } else {
        await concluirHabitoNoBanco(id);
      }

      setHabitos((lista) =>
        lista.map((item) => item.id === id ? { ...item, concluido: !atual.concluido } : item)
      );

      await Promise.all([atualizarGamificacao(), atualizarHistorico()]);
    } catch (error) {
      console.error('Erro ao registrar conclusão/gamificação:', error);
      Alert.alert(
        'Não foi possível atualizar o hábito',
        error.message || 'Verifique a configuração de gamificação no Supabase.'
      );
    }
  };

  const handleLogout = async () => {
    try {
      await sairUsuario();
      // O listener de autenticação também redireciona para Login.
      setTelaAtual('Login');
    } catch (error) {
      console.error('Erro ao sair:', error);
      Alert.alert('Erro ao sair', error.message || 'Tente novamente.');
    }
  };

  const navigation = {
    navigate: (destino, params = {}) => {
      setParametrosTela(params);
      setHistorico((anterior) => [...anterior, telaAtual]);
      setTelaAtual(destino);
    },
    goBack: () => {
      if (historico.length === 0) {
        setTelaAtual(usuario ? 'Início' : 'Login');
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
    Calendario: CalendarioScreen,
    EditarHabito: EditarHabitoScreen,
    Notificacoes: BlocoNotificacoes,
    Historico: BlocoHistorico,
    Privacidade: BlocoPrivacidade,
  };

  if (!sessaoVerificada || (usuario && carregandoHabitos)) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16A34A" />
      </View>
    );
  }

  const TelaSelecionada = telas[telaAtual] || PerfilScreen;

  return (
    <TelaSelecionada
      navigation={navigation}
      themeMode={themeMode}
      setThemeMode={setThemeMode}
      gameData={gameData}
      historyData={historyData}
      onHabitCompleted={alternarConclusao}
      habitos={habitos}
      onAddHabit={adicionarHabito}
      onUpdateHabit={atualizarHabito}
      onDeleteHabit={excluirHabito}
      onToggleHabit={alternarConclusao}
      onLogout={handleLogout}
      selectedHabitId={parametrosTela.habitId}
      usuario={usuario}
      nomeUsuario={nomeUsuario}
      onSaveDisplayName={salvarNomeUsuario}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F7FC',
  },
});
