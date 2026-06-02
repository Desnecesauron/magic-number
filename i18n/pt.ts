export const strings = {
  app: {
    name: 'Número Mágico',
  },

  menu: {
    welcome: 'Bem-vindo ao\nNúmero Mágico!',
    subtitle: 'Adivinhe o número secreto',
    modes: {
      easy: 'Fácil',
      medium: 'Médio',
      hard: 'Difícil',
      timeRushEasy: 'Time Rush (Fácil)',
      timeRushHard: 'Time Rush (Difícil)',
    },
    modeDesc: {
      easy: 'Intervalo: 1 a 50',
      medium: 'Intervalo: 1 a 500',
      hard: 'Intervalo: 1 a 10.000',
      timeRushEasy: '1 a 10.000 · 60 segundos',
      timeRushHard: '1 a 10.000 · 30 segundos',
    },
    about: 'Sobre o Jogo',
    stats: 'Estatísticas',
    settings: 'Configurações',
  },

  game: {
    range: (max: number) => `Intervalo de sorteio: 1 a ${max.toLocaleString('pt-BR')}`,
    chosenNumber: 'Número escolhido',
    unknown: '?',
    inputPlaceholder: 'Digite seu palpite',
    shoot: 'Chutar',
    back: 'Voltar',
    discover: 'Descobrir',
    reset: 'Resetar',
    historyEmpty: 'Nenhum palpite ainda. Vamos lá!',
    guessAbove: 'acima do número',
    guessBelow: 'abaixo do número',
    guessCorrect: 'ACERTOU!',
    confirmDiscover: 'Descobrir número',
    confirmDiscoverMsg: 'Tem certeza? Isso revela a resposta antes de você acertar.',
    cancel: 'Cancelar',
    confirmDiscoverBtn: 'Descobrir mesmo assim',
    readyTitle: 'Pronto?',
    readyMsg: (seconds: number) =>
      `O cronômetro de ${seconds} segundos vai começar assim que você tocar em Jogar.`,
    play: 'Jogar!',
    timeUp: 'Tempo Esgotado!',
    timeUpReveal: 'O número era',
    playAgain: 'Jogar Novamente',
    won: 'Você Acertou!',
    wonAttempts: (n: number) => `${n} ${n === 1 ? 'tentativa' : 'tentativas'}`,
    wonTime: (s: number) => `${s.toFixed(1)}s`,
    newRecord: '🏆 Novo recorde!',
    invalidNumber: 'Digite um número válido',
    outOfRange: (min: number, max: number) =>
      `Número deve estar entre ${min} e ${max.toLocaleString('pt-BR')}`,
  },

  about: {
    title: 'Sobre o Jogo',
    sections: [
      {
        heading: 'Como jogar',
        body:
          'Um número secreto é sorteado dentro de um intervalo. Seu objetivo é adivinhar qual é, usando as dicas "acima" ou "abaixo" que aparecem a cada palpite.',
      },
      {
        heading: 'Modos de jogo',
        body:
          'Escolha entre Fácil (1–50), Médio (1–500) e Difícil (1–10.000) para jogar sem pressa. Quanto maior o intervalo, mais tentativas podem ser necessárias.',
      },
      {
        heading: 'Time Rush',
        body:
          'Nos modos Time Rush você tem um tempo limitado para acertar. No Time Rush (Fácil) são 60 segundos; no Time Rush (Difícil), apenas 30. O cronômetro começa depois do "Pronto?". Corra!',
      },
      {
        heading: 'Curiosidade',
        body:
          'Com a estratégia de busca binária (sempre chutando o meio do intervalo), você garante acertar qualquer número de 1 a 10.000 em no máximo 14 tentativas.',
      },
    ],
    credits: 'Créditos',
    creditsText:
      'Feito com ❤️ por Cesar S. Gomes. Testers: Marcela S. Evangelista & Manuela S. Evangelista.',
  },

  stats: {
    title: 'Estatísticas',
    gamesPlayed: 'Partidas jogadas',
    bestAttempts: 'Menor nº de tentativas',
    bestTime: 'Melhor tempo',
    noRecord: '—',
    clear: 'Zerar Estatísticas',
    clearConfirm: 'Zerar tudo?',
    clearConfirmMsg: 'Isso apagará todos os seus recordes permanentemente.',
    clearCancel: 'Cancelar',
    clearConfirmBtn: 'Zerar',
    attempts: (n: number) => `${n} tent.`,
    seconds: (s: number) => `${s.toFixed(1)}s`,
  },

  settings: {
    title: 'Configurações',
    sound: 'Som',
    soundDesc: 'Efeitos sonoros no jogo',
    haptics: 'Vibração',
    hapticsDesc: 'Feedback háptico ao chutar',
    theme: 'Tema',
    themeSystem: 'Sistema',
    themeLight: 'Claro',
    themeDark: 'Escuro',
  },

  common: {
    back: 'Voltar',
  },
};
