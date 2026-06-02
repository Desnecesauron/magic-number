import { useAudioPlayer } from 'expo-audio';
import { useSettings } from '../context/SettingsContext';

// Each hook call creates one player bound to one source.
// seekTo(0) rewinds before play so rapid re-triggers work correctly.
export function useSound() {
  const { sound } = useSettings();

  const correctPlayer = useAudioPlayer(require('../assets/sounds/correct.wav'));
  const wrongPlayer   = useAudioPlayer(require('../assets/sounds/wrong.wav'));
  const winPlayer     = useAudioPlayer(require('../assets/sounds/win.wav'));
  const timeoutPlayer = useAudioPlayer(require('../assets/sounds/timeout.wav'));

  function play(player: ReturnType<typeof useAudioPlayer>) {
    if (!sound) return;
    player.seekTo(0).then(() => player.play());
  }

  return {
    playCorrect: () => play(correctPlayer),
    playWrong:   () => play(wrongPlayer),
    playWin:     () => play(winPlayer),
    playTimeout: () => play(timeoutPlayer),
  };
}
