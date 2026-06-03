import { useSettings } from '../context/SettingsContext';
import { playSound } from '../lib/sounds';

export function useSound() {
  const { sound } = useSettings();

  function play(key: Parameters<typeof playSound>[0]) {
    if (!sound) return;
    playSound(key); // async, fire-and-forget
  }

  return {
    playCorrect: () => play('correct'),
    playWrong:   () => play('wrong'),
    playWin:     () => play('win'),
    playTimeout: () => play('timeout'),
  };
}
