export type GameMode =
  | 'easy'
  | 'medium'
  | 'hard'
  | 'time-rush-easy'
  | 'time-rush-hard';

export interface GameModeConfig {
  id: GameMode;
  min: number;
  max: number;
  timeLimit: number | null; // seconds; null = no limit
}

export const GAME_MODES: Record<GameMode, GameModeConfig> = {
  easy: { id: 'easy', min: 1, max: 50, timeLimit: null },
  medium: { id: 'medium', min: 1, max: 500, timeLimit: null },
  hard: { id: 'hard', min: 1, max: 10000, timeLimit: null },
  'time-rush-easy': { id: 'time-rush-easy', min: 1, max: 10000, timeLimit: 60 },
  'time-rush-hard': { id: 'time-rush-hard', min: 1, max: 10000, timeLimit: 30 },
};

export type GuessResult = 'above' | 'below' | 'correct';

export interface Guess {
  value: number;
  result: GuessResult;
}

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost' | 'revealed';

export interface GameState {
  mode: GameMode;
  config: GameModeConfig;
  secretNumber: number;
  guesses: Guess[];
  status: GameStatus;
  timeRemaining: number | null; // seconds remaining; null = no timer
  elapsedSeconds: number;
}

export function createGame(mode: GameMode): GameState {
  const config = GAME_MODES[mode];
  const secretNumber =
    Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
  return {
    mode,
    config,
    secretNumber,
    guesses: [],
    status: 'idle',
    timeRemaining: config.timeLimit,
    elapsedSeconds: 0,
  };
}

export function startGame(state: GameState): GameState {
  return { ...state, status: 'playing' };
}

export function makeGuess(
  state: GameState,
  value: number,
): { state: GameState; result: GuessResult } {
  if (state.status !== 'playing') {
    return { state, result: 'above' };
  }

  let result: GuessResult;
  if (value === state.secretNumber) {
    result = 'correct';
  } else if (value > state.secretNumber) {
    result = 'above';
  } else {
    result = 'below';
  }

  const newStatus: GameStatus = result === 'correct' ? 'won' : 'playing';

  return {
    state: {
      ...state,
      guesses: [...state.guesses, { value, result }],
      status: newStatus,
    },
    result,
  };
}

export function revealNumber(state: GameState): GameState {
  return { ...state, status: 'revealed' };
}

export function resetGame(mode: GameMode): GameState {
  return createGame(mode);
}

export function tickTimer(state: GameState, deltaSec: number): GameState {
  if (state.status !== 'playing' || state.timeRemaining === null) {
    return state;
  }

  const newTime = Math.max(0, state.timeRemaining - deltaSec);
  const newStatus: GameStatus = newTime <= 0 ? 'lost' : 'playing';

  return {
    ...state,
    timeRemaining: newTime,
    status: newStatus,
    elapsedSeconds: state.elapsedSeconds + deltaSec,
  };
}

export function isTimedMode(mode: GameMode): boolean {
  return GAME_MODES[mode].timeLimit !== null;
}

export function validateGuess(
  value: number,
  config: GameModeConfig,
): string | null {
  if (!Number.isInteger(value) || Number.isNaN(value)) {
    return 'Digite um número válido';
  }
  if (value < config.min || value > config.max) {
    return `Número deve estar entre ${config.min.toLocaleString('pt-BR')} e ${config.max.toLocaleString('pt-BR')}`;
  }
  return null;
}
