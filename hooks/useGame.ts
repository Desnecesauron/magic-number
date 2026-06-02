import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createGame,
  GameMode,
  GameState,
  GuessResult,
  isTimedMode,
  makeGuess as libMakeGuess,
  resetGame,
  revealNumber,
  startGame,
  tickTimer,
} from '../lib/game';
import { saveGameResult } from '../lib/storage';

export interface UseGameReturn {
  state: GameState;
  start: () => void;
  guess: (value: number) => GuessResult;
  reveal: () => void;
  reset: () => void;
}

export function useGame(mode: GameMode): UseGameReturn {
  const [state, setState] = useState<GameState>(() => createGame(mode));

  // Stable ref for synchronous reads inside callbacks (avoids stale closures)
  const stateRef = useRef(state);
  stateRef.current = state;

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTickRef = useRef(0);
  const savedRef = useRef(false);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Persist result when game ends
  useEffect(() => {
    const s = state;
    if ((s.status === 'won' || s.status === 'lost') && !savedRef.current) {
      savedRef.current = true;
      stopTimer();
      saveGameResult(mode, s.guesses.length, s.elapsedSeconds, s.status === 'won');
    }
  }, [state, mode, stopTimer]);

  // Cleanup on unmount
  useEffect(() => () => stopTimer(), [stopTimer]);

  const start = useCallback(() => {
    setState((s) => startGame(s));

    if (isTimedMode(mode)) {
      lastTickRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const delta = (now - lastTickRef.current) / 1000;
        lastTickRef.current = now;
        setState((s) => tickTimer(s, delta));
      }, 100);
    }
  }, [mode]);

  const guess = useCallback((value: number): GuessResult => {
    const current = stateRef.current;
    const { state: next, result } = libMakeGuess(current, value);
    setState(next);
    return result;
  }, []);

  const reveal = useCallback(() => {
    setState((s) => revealNumber(s));
    stopTimer();
  }, [stopTimer]);

  const reset = useCallback(() => {
    stopTimer();
    savedRef.current = false;
    setState(resetGame(mode));
  }, [mode, stopTimer]);

  return { state, start, guess, reveal, reset };
}
