import {
  createGame,
  startGame,
  makeGuess,
  revealNumber,
  resetGame,
  tickTimer,
  isTimedMode,
  validateGuess,
  GAME_MODES,
  GameMode,
} from '../lib/game';

// ─── createGame ───────────────────────────────────────────────────────────────

describe('createGame', () => {
  const modes: GameMode[] = [
    'easy',
    'medium',
    'hard',
    'time-rush-easy',
    'time-rush-hard',
  ];

  test.each(modes)('%s: secretNumber dentro do intervalo', (mode) => {
    for (let i = 0; i < 50; i++) {
      const state = createGame(mode);
      const { min, max } = GAME_MODES[mode];
      expect(state.secretNumber).toBeGreaterThanOrEqual(min);
      expect(state.secretNumber).toBeLessThanOrEqual(max);
    }
  });

  test.each(modes)('%s: começa com status idle', (mode) => {
    expect(createGame(mode).status).toBe('idle');
  });

  test('easy: timeRemaining é null', () => {
    expect(createGame('easy').timeRemaining).toBeNull();
  });

  test('time-rush-easy: timeRemaining = 60', () => {
    expect(createGame('time-rush-easy').timeRemaining).toBe(60);
  });

  test('time-rush-hard: timeRemaining = 30', () => {
    expect(createGame('time-rush-hard').timeRemaining).toBe(30);
  });

  test('guesses vazio ao criar', () => {
    expect(createGame('easy').guesses).toHaveLength(0);
  });
});

// ─── startGame ────────────────────────────────────────────────────────────────

describe('startGame', () => {
  test('muda status para playing', () => {
    const state = startGame(createGame('easy'));
    expect(state.status).toBe('playing');
  });
});

// ─── makeGuess ────────────────────────────────────────────────────────────────

describe('makeGuess', () => {
  function playingGame(mode: GameMode = 'easy', secret?: number) {
    const state = startGame(createGame(mode));
    // Inject known secret for deterministic tests
    return { ...state, secretNumber: secret ?? 25 };
  }

  test('devolve "above" quando palpite > número', () => {
    const state = playingGame('easy', 25);
    const { result } = makeGuess(state, 30);
    expect(result).toBe('above');
  });

  test('devolve "below" quando palpite < número', () => {
    const state = playingGame('easy', 25);
    const { result } = makeGuess(state, 10);
    expect(result).toBe('below');
  });

  test('devolve "correct" quando palpite = número', () => {
    const state = playingGame('easy', 25);
    const { result } = makeGuess(state, 25);
    expect(result).toBe('correct');
  });

  test('status vira "won" ao acertar', () => {
    const state = playingGame('easy', 25);
    const { state: next } = makeGuess(state, 25);
    expect(next.status).toBe('won');
  });

  test('status permanece "playing" enquanto errar', () => {
    const state = playingGame('easy', 25);
    const { state: next } = makeGuess(state, 10);
    expect(next.status).toBe('playing');
  });

  test('contagem de tentativas incrementa corretamente', () => {
    let state = playingGame('easy', 25);
    ({ state } = makeGuess(state, 10));
    expect(state.guesses).toHaveLength(1);
    ({ state } = makeGuess(state, 20));
    expect(state.guesses).toHaveLength(2);
    ({ state } = makeGuess(state, 25));
    expect(state.guesses).toHaveLength(3);
  });

  test('cada guess tem value e result corretos', () => {
    let state = playingGame('easy', 25);
    ({ state } = makeGuess(state, 10));
    expect(state.guesses[0]).toEqual({ value: 10, result: 'below' });
  });

  test('não faz nada se status != playing', () => {
    const idle = createGame('easy');
    const { state: unchanged } = makeGuess(idle, 25);
    expect(unchanged).toBe(idle);
  });
});

// ─── revealNumber ─────────────────────────────────────────────────────────────

describe('revealNumber', () => {
  test('muda status para revealed', () => {
    const state = startGame(createGame('easy'));
    expect(revealNumber(state).status).toBe('revealed');
  });
});

// ─── resetGame ────────────────────────────────────────────────────────────────

describe('resetGame', () => {
  test('retorna estado fresh com guesses vazio', () => {
    const fresh = resetGame('medium');
    expect(fresh.guesses).toHaveLength(0);
    expect(fresh.status).toBe('idle');
  });
});

// ─── tickTimer ────────────────────────────────────────────────────────────────

describe('tickTimer', () => {
  function timedPlaying(mode: GameMode = 'time-rush-easy') {
    return startGame(createGame(mode));
  }

  test('decrementa timeRemaining', () => {
    const state = timedPlaying();
    const next = tickTimer(state, 5);
    expect(next.timeRemaining).toBeCloseTo(55);
  });

  test('não vai abaixo de zero', () => {
    const state = timedPlaying('time-rush-hard');
    const next = tickTimer(state, 100);
    expect(next.timeRemaining).toBe(0);
  });

  test('status vira "lost" quando tempo acaba', () => {
    const state = timedPlaying('time-rush-hard');
    const next = tickTimer(state, 100);
    expect(next.status).toBe('lost');
  });

  test('status permanece "playing" enquanto há tempo', () => {
    const state = timedPlaying();
    const next = tickTimer(state, 5);
    expect(next.status).toBe('playing');
  });

  test('acumula elapsedSeconds', () => {
    let state = timedPlaying();
    state = tickTimer(state, 3);
    state = tickTimer(state, 4);
    expect(state.elapsedSeconds).toBeCloseTo(7);
  });

  test('não faz nada em modo sem timer', () => {
    const state = startGame(createGame('easy'));
    const next = tickTimer(state, 10);
    expect(next).toBe(state);
  });

  test('não faz nada se status != playing', () => {
    const state = createGame('time-rush-easy'); // idle
    const next = tickTimer(state, 5);
    expect(next).toBe(state);
  });
});

// ─── isTimedMode ──────────────────────────────────────────────────────────────

describe('isTimedMode', () => {
  test('easy/medium/hard são false', () => {
    expect(isTimedMode('easy')).toBe(false);
    expect(isTimedMode('medium')).toBe(false);
    expect(isTimedMode('hard')).toBe(false);
  });

  test('time-rush-* são true', () => {
    expect(isTimedMode('time-rush-easy')).toBe(true);
    expect(isTimedMode('time-rush-hard')).toBe(true);
  });
});

// ─── validateGuess ────────────────────────────────────────────────────────────

describe('validateGuess', () => {
  const config = GAME_MODES['easy'];

  test('retorna null para valor válido', () => {
    expect(validateGuess(25, config)).toBeNull();
  });

  test('erro para valor acima do max', () => {
    expect(validateGuess(51, config)).not.toBeNull();
  });

  test('erro para valor abaixo do min', () => {
    expect(validateGuess(0, config)).not.toBeNull();
  });

  test('erro para NaN', () => {
    expect(validateGuess(NaN, config)).not.toBeNull();
  });

  test('erro para número não-inteiro', () => {
    expect(validateGuess(2.5, config)).not.toBeNull();
  });

  test('aceita os limites exatos (1 e 50)', () => {
    expect(validateGuess(1, config)).toBeNull();
    expect(validateGuess(50, config)).toBeNull();
  });
});
