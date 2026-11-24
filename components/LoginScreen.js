import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { entrarUsuario } from '../services/auth';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen({ navigation, themeMode }) {
  const isDarkMode = themeMode !== 'light';

  const theme = isDarkMode ? darkTheme : lightTheme;

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async () => {
    const emailLimpo = email.trim().toLowerCase();

    if (!emailLimpo || !senha) {
      Alert.alert('Atenção', 'Preencha seu e-mail e sua senha.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpo)) {
      Alert.alert('E-mail inválido', 'Informe um endereço de e-mail válido.');
      return;
    }

    try {
      setCarregando(true);
      const { session } = await entrarUsuario(emailLimpo, senha);

      if (session) {
        setSenha('');
        navigation?.navigate?.('Início');
      } else {
        Alert.alert('Falha no login', 'Não foi possível iniciar sua sessão.');
      }
    } catch (error) {
      console.error('Erro no login:', error);

      let mensagem = 'Não foi possível entrar. Tente novamente.';
      if (error.message?.includes('Invalid login credentials')) {
        mensagem = 'E-mail ou senha incorretos.';
      } else if (error.message?.includes('Email not confirmed')) {
        mensagem = 'Confirme seu e-mail antes de entrar.';
      }

      Alert.alert('Falha no login', mensagem);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Círculos decorativos de fundo */}
            <View style={[styles.circleTopRight, { backgroundColor: theme.circleTop }]} />
            <View style={[styles.circleBottomLeft, { backgroundColor: theme.circleBottom }]} />

            {/* Cabeçalho do App */}
            <View style={styles.headerContainer}>
              <View style={[styles.logoContainer, { backgroundColor: theme.logoBg }]}>
                <Image
                  source={require('../assets/rabbit-face.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={[styles.appTitle, { color: theme.title }]}>Habbit</Text>
              <Text style={[styles.appSubtitle, { color: theme.subtitle }]}>
                Organize seus hábitos. Evolua todos os dias.
              </Text>
            </View>

            {/* Card do Formulário */}
            <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
              <Text style={[styles.cardTitle, { color: theme.title }]}>Entrar</Text>
              <Text style={[styles.cardSubtitle, { color: theme.subtitle }]}>
                Acesse sua conta para continuar.
              </Text>

              {/* Campo E-mail */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.label }]}>E-mail</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: theme.inputBorder,
                      color: theme.inputText,
                      backgroundColor: theme.inputBg,
                    },
                  ]}
                  placeholder="seuemail@exemplo.com"
                  placeholderTextColor={theme.placeholder}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Campo Senha */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.label }]}>Senha</Text>
                <View
                  style={[
                    styles.inputPasswordContainer,
                    {
                      borderColor: theme.inputBorder,
                      backgroundColor: theme.inputBg,
                    },
                  ]}
                >
                  <TextInput
                    style={[styles.inputPassword, { color: theme.inputText }]}
                    placeholder="••••••••"
                    placeholderTextColor={theme.placeholder}
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry={!mostrarSenha}
                  />
                  <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
                    <Text style={[styles.toggleText, { color: theme.toggleText }]}>
                      {mostrarSenha ? 'Ocultar' : 'Mostrar'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Esqueceu a Senha */}
              <TouchableOpacity style={styles.forgotPasswordContainer}>
                <Text style={[styles.forgotPasswordText, { color: theme.primaryText }]}>
                  Esqueceu a senha?
                </Text>
              </TouchableOpacity>

              {/* Botão Entrar */}
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: theme.buttonBg },
                  carregando && { opacity: 0.6 },
                ]}
                activeOpacity={0.8}
                onPress={handleLogin}
                disabled={carregando}
              >
                {carregando ? (
                  <ActivityIndicator color={theme.buttonText} />
                ) : (
                  <Text style={[styles.buttonText, { color: theme.buttonText }]}>
                    Entrar
                  </Text>
                )}
              </TouchableOpacity>

              {/* Divisor 'ou' */}
              <View style={styles.dividerContainer}>
                <View style={[styles.dividerLine, { backgroundColor: theme.divider }]} />
                <Text style={[styles.dividerText, { color: theme.subtitle }]}>ou</Text>
                <View style={[styles.dividerLine, { backgroundColor: theme.divider }]} />
              </View>
            </View>

            {/* Chamada para Criar Conta */}
            <View style={styles.signUpContainer}>
              <Text style={[styles.signUpQuestion, { color: theme.subtitle }]}>
                Ainda não tem uma conta?
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation?.navigate?.('Cadastro')}
              >
                <Text style={[styles.signUpLink, { color: theme.primaryText }]}>
                  Criar conta
                </Text>
              </TouchableOpacity>
            </View>

            {/* Rodapé */}
            <Text style={[styles.footerText, { color: theme.footer }]}>@Habbit</Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

/* Paletas de Cores Light / Dark (Monocromático Minimalista) */
const lightTheme = {
  bg: '#F4F7FC',
  circleTop: '#E7ECF5',
  circleBottom: '#EBEFF8',
  logoBg: '#0F141C',
  title: '#0F141C',
  subtitle: '#6B7280',
  cardBg: '#FFFFFF',
  label: '#1F2937',
  inputBg: '#FFFFFF',
  inputBorder: '#E5E7EB',
  inputText: '#1F2937',
  placeholder: '#A0AEC0',
  toggleText: '#1F2937',
  buttonBg: '#0F141C',
  buttonText: '#FFFFFF',
  divider: '#F3F4F6',
  primaryText: '#0F141C',
  footer: '#9CA3AF',
};

const darkTheme = {
  bg: '#121212',          // Fundo escuro neutro e suave aos olhos
  circleTop: '#1E1E1E',    // Círculo decorativo em tom de cinza escuro
  circleBottom: '#181818', // Círculo decorativo secundário
  logoBg: '#FFFFFF',       // Fundo da bola da logo invertido para branco
  title: '#FFFFFF',        // Título em branco puro
  subtitle: '#9CA3AF',     // Subtítulo em cinza médio
  cardBg: '#1E1E1E',       // Card do formulário em cinza escuro
  label: '#E5E7EB',        // Textos dos campos em cinza claro
  inputBg: '#121212',      // Fundo dos campos de texto acompanhando a tela
  inputBorder: '#2E2E2E',  // Borda sutil dos campos
  inputText: '#FFFFFF',     // Texto que o usuário digita em branco
  placeholder: '#6B7280',  // Placeholder dos inputs em cinza
  toggleText: '#D1D5DB',   // Texto "Mostrar / Ocultar" em cinza claro
  buttonBg: '#FFFFFF',     // Botão principal em branco puro (alto contraste)
  buttonText: '#121212',   // Texto do botão em preto
  divider: '#2E2E2E',      // Linhas divisórias em cinza escuro
  primaryText: '#FFFFFF',  // Links e chamadas interativas em branco
  footer: '#6B7280',       // Rodapé em cinza
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Elementos Decorativos de Fundo */
  circleTopRight: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 260,
    height: 260,
    borderRadius: 130,
    zIndex: -1,
  },
  circleBottomLeft: {
    position: 'absolute',
    bottom: -60,
    left: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    zIndex: -1,
  },

  /* Header */
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoImage: {
    width: 50,
    height: 50,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  appSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },

  /* Card */
  card: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    marginBottom: 20,
  },

  /* Form Inputs */
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  inputPasswordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  inputPassword: {
    flex: 1,
    fontSize: 14,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 8,
  },

  /* Esqueceu a Senha */
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  forgotPasswordText: {
    fontSize: 13,
    fontWeight: 'bold',
  },

  /* Botão */
  button: {
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  /* Divisor 'ou' */
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
  },

  /* Chamada Criar Conta */
  signUpContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  signUpQuestion: {
    fontSize: 13,
    marginBottom: 4,
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  /* Rodapé */
  footerText: {
    marginTop: 20,
    fontSize: 12,
  },
});