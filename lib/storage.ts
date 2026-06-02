import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameMode } from './game';

export interface ModeStats {
  gamesPlayed: number;
  bestAttempts: number | null; // fewest guesses to win (non-timed)
  bestTime: number | null;     // fastest win in seconds (timed modes only)
}

export type AllStats = Record<GameMode, ModeStats>;

const STATS_KEY = '@magic_number_stats_v1';

const emptyMode = (): ModeStats => ({
  gamesPlayed: 0,
  bestAttempts: null,
  bestTime: null,
});

const emptyAll = (): AllStats => ({
  easy: emptyMode(),
  medium: emptyMode(),
  hard: emptyMode(),
  'time-rush-easy': emptyMode(),
  'time-rush-hard': emptyMode(),
});

export async function loadStats(): Promise<AllStats> {
  try {
    const raw = await AsyncStorage.getItem(STATS_KEY);
    if (!raw) return emptyAll();
    const parsed = JSON.parse(raw) as Partial<AllStats>;
    const defaults = emptyAll();
    return (Object.keys(defaults) as GameMode[]).reduce<AllStats>((acc, mode) => {
      acc[mode] = { ...defaults[mode], ...(parsed[mode] ?? {}) };
      return acc;
    }, {} as AllStats);
  } catch {
    return emptyAll();
  }
}

export async function saveGameResult(
  mode: GameMode,
  attempts: number,
  elapsedSeconds: number,
  won: boolean,
): Promise<void> {
  const stats = await loadStats();
  const s = stats[mode];

  s.gamesPlayed += 1;

  if (won) {
    if (s.bestAttempts === null || attempts < s.bestAttempts) {
      s.bestAttempts = attempts;
    }
    if (mode.startsWith('time-rush')) {
      if (s.bestTime === null || elapsedSeconds < s.bestTime) {
        s.bestTime = elapsedSeconds;
      }
    }
  }

  await AsyncStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export async function clearStats(): Promise<void> {
  await AsyncStorage.setItem(STATS_KEY, JSON.stringify(emptyAll()));
}

// Feature-flag stub for future online ranking via Supabase.
// Not implemented; isolates ranking logic from the rest of the app.
export const rankingEnabled = false;
export async function submitToRanking(
  _mode: GameMode,
  _score: number,
): Promise<void> {
  if (!rankingEnabled) return;
  // TODO: implement Supabase ranking when ready
}
