import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Theme = 'dark' | 'light';
export type SoundType = 'none' | 'gong' | 'bell' | 'bowl';
export type Language = 'de' | 'en';

interface SettingsStore {
  theme: Theme;
  language: Language;
  soundType: SoundType;
  spotifyUri: string;
  spotifyEnabled: boolean;
  introOutroEnabled: boolean;
  hapticsEnabled: boolean;
  setTheme: (t: Theme) => void;
  setLanguage: (l: Language) => void;
  setSoundType: (s: SoundType) => void;
  setSpotifyUri: (uri: string) => void;
  setSpotifyEnabled: (v: boolean) => void;
  setIntroOutroEnabled: (v: boolean) => void;
  setHapticsEnabled: (v: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      language: 'de',
      soundType: 'none',
      spotifyUri: '',
      spotifyEnabled: false,
      introOutroEnabled: true,
      hapticsEnabled: true,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setSoundType: (soundType) => set({ soundType }),
      setSpotifyUri: (spotifyUri) => set({ spotifyUri }),
      setSpotifyEnabled: (spotifyEnabled) => set({ spotifyEnabled }),
      setIntroOutroEnabled: (introOutroEnabled) => set({ introOutroEnabled }),
      setHapticsEnabled: (hapticsEnabled) => set({ hapticsEnabled }),
    }),
    { name: 'breathflow-settings', storage: createJSONStorage(() => AsyncStorage) }
  )
);
