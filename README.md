# Número Mágico

Jogo de adivinhação de número para iOS e Android, construído com React Native + Expo.

## Requisitos

- Node.js 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Para iOS: macOS + Xcode (ou Expo Go)
- Para Android: Android Studio + emulador (ou Expo Go)

## Rodando localmente

```bash
# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npx expo start
```

Após iniciar, escaneie o QR code com o app **Expo Go** (iOS/Android) ou pressione:
- `a` — abre no emulador Android
- `i` — abre no simulador iOS (macOS apenas)
- `w` — abre no navegador (web)

## Testes

```bash
npm test
```

## Build com EAS

### Configuração inicial (uma vez)

```bash
npm install -g eas-cli
eas login
eas build:configure
```

### Build de preview (APK/IPA sem loja)

```bash
# Android (APK)
eas build --platform android --profile preview

# iOS (simulador)
eas build --platform ios --profile preview
```

### Build de produção

```bash
# Android + iOS simultâneo
eas build --platform all --profile production
```

## Estrutura do projeto

```
app/           Rotas (Expo Router)
components/    Componentes reutilizáveis
context/       Providers (configurações)
hooks/         Hooks (useGame, useTheme)
i18n/          Strings em pt-BR
lib/           Lógica pura (game.ts, storage.ts)
theme/         Cores, tipografia, espaçamento
__tests__/     Testes unitários (Jest)
```

## Modos de jogo

| Modo | Intervalo | Tempo |
|------|-----------|-------|
| Fácil | 1 – 50 | Sem limite |
| Médio | 1 – 500 | Sem limite |
| Difícil | 1 – 10.000 | Sem limite |
| Time Rush (Fácil) | 1 – 10.000 | 60 segundos |
| Time Rush (Difícil) | 1 – 10.000 | 30 segundos |
