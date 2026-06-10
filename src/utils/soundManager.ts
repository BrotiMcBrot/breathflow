import { Audio } from 'expo-av';
import { SoundType } from '../store/settingsStore';

// Sound files go in src/assets/sounds/
// Add: gong.mp3, bell.mp3, bowl.mp3
// Free CC0 sources: freesound.org, pixabay.com/sound-effects/
const SOUND_FILES: Record<SoundType, any> = {
  none: null,
  gong: null,   // require('../assets/sounds/gong.mp3'),
  bell: null,   // require('../assets/sounds/bell.mp3'),
  bowl: null,   // require('../assets/sounds/bowl.mp3'),
};

export const SOUND_LABELS: Record<SoundType, string> = {
  none: 'Kein Sound',
  gong: 'Gong',
  bell: 'Glocke',
  bowl: 'Klangschale',
};

let currentSound: Audio.Sound | null = null;

export async function playPhaseSound(type: SoundType) {
  if (type === 'none') return;
  const file = SOUND_FILES[type];
  if (!file) return; // file not yet added

  try {
    if (currentSound) {
      await currentSound.unloadAsync();
      currentSound = null;
    }
    const { sound } = await Audio.Sound.createAsync(file, { shouldPlay: true, volume: 1.0 });
    currentSound = sound;
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
        if (currentSound === sound) currentSound = null;
      }
    });
  } catch (e) {
    // silently fail if file not found
  }
}

export async function setupAudio() {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      allowsRecordingIOS: false,
    });
  } catch (e) {}
}

export async function unloadSound() {
  if (currentSound) {
    await currentSound.unloadAsync();
    currentSound = null;
  }
}
