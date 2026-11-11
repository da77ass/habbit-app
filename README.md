# Habbit Tracking

Projeto atualizado para Expo SDK 58.

## Requisitos

- Node.js 22.13 ou superior (linha 22), ou 24.3 ou superior (linha 24).
- npm.

## Instalação

Na pasta do projeto, execute:

```bash
npm install
npx expo install expo-font expo-splash-screen
npx expo install --fix
npx expo-doctor
```

O `expo install --fix` alinha as dependências Expo com o SDK instalado. O `expo-doctor` verifica a configuração e possíveis incompatibilidades.

## Executar

```bash
npx expo start
```

Para abrir no navegador, pressione `w` no terminal ou execute `npm run web`.

## Observações

- O projeto usa Expo SDK 58, React Native 0.88 e React 19.3.
- A navegação, as telas e a alternância entre modo claro e escuro foram preservadas.
- A instalação das dependências requer acesso à internet.


## Gamificação (protótipo)

A gamificação é controlada centralmente pelo `App.js` e suas regras ficam em
`utils/gamification.js`.

- Cada hábito diferente concluído pela primeira vez concede 10 XP.
- Conquistas são desbloqueadas ao concluir 1, 3 e 5 hábitos diferentes.
- As conquistas concedem bônus de 20, 30 e 50 XP, respectivamente.
- Cada 100 XP aumenta um nível.
- O título exibido no Perfil acompanha a conquista mais alta desbloqueada.

O controle central impede que marcar e desmarcar repetidamente o mesmo hábito
gere XP infinito. Como o projeto ainda utiliza dados locais de demonstração e
não possui banco de dados nem armazenamento persistente, o progresso de
gamificação é mantido enquanto o aplicativo está aberto e reinicia ao recarregar
o app. A persistência poderá ser integrada em uma próxima etapa.
