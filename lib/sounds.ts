import { Audio } from 'expo-av';

type SoundKey = 'correct' | 'wrong' | 'win' | 'timeout';

const sounds: Partial<Record<SoundKey, Audio.Sound>> = {};

let onReady: () => void;
const ready = new Promise<void>(resolve => { onReady = resolve; });

(async () => {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: false,
    });
    const sources: [SoundKey, number][] = [
      ['correct', require('../assets/sounds/correct.wav')],
      ['wrong',   require('../assets/sounds/wrong.wav')],
      ['win',     require('../assets/sounds/win.wav')],
      ['timeout', require('../assets/sounds/timeout.wav')],
    ];
    await Promise.all(
      sources.map(async ([key, src]) => {
        const { sound } = await Audio.Sound.createAsync(src);
        // Warmup: play silently, wait for Android MediaPlayer to reach
        // STARTED state, then pause. Without this delay the first real
        // play is swallowed by the initialization cycle.
        await sound.setStatusAsync({ shouldPlay: true, positionMillis: 0, volume: 0 });
        await new Promise(r => setTimeout(r, 150));
        await sound.setStatusAsync({ shouldPlay: false, positionMillis: 0, volume: 1.0 });
        sounds[key] = sound;
        console.log(`[sound] loaded: ${key}`);
      }),
    );
    console.log('[sound] all ready');
  } catch (e) {
    console.warn('[sound] failed to load:', e);
  } finally {
    onReady();
  }
})();

export async function playSound(key: SoundKey): Promise<void> {
  await ready;
  const s = sounds[key];
  if (!s) { console.warn(`[sound] not loaded: ${key}`); return; }
  try {
    await s.setStatusAsync({ shouldPlay: true, positionMillis: 0, volume: 1.0 });
    console.log(`som executado: ${key}`);
  } catch (e) {
    console.warn(`[sound] play error (${key}):`, e);
  }
}
