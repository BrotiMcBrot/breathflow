import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Theme = 'dark' | 'light';
export type SoundType = 'none' | 'gong' | 'bell' | 'bowl';

interface SettingsStore {
  theme: Theme;
  soundType: SoundType;
  spotifyUri: string;
  spotifyEnabled: boolean;
  introOutroEnabled: boolean;
  hapticsEnabled: boolean;
  setTheme: (t: Theme) => void;
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
      soundType: 'none',
      spotifyUri: '',
      spotifyEnabled: false,
      introOutroEnabled: true,
      hapticsEnabled: true,
      setTheme: (theme) => set({ theme }),
      setSoundType: (soundType) => set({ soundType }),
      setSpotifyUri: (spotifyUri) => set({ spotifyUri }),
      setSpotifyEnabled: (spotifyEnabled) => set({ spotifyEnabled }),
      setIntroOutroEnabled: (introOutroEnabled) => set({ introOutroEnabled }),
      setHapticsEnabled: (hapticsEnabled) => set({ hapticsEnabled }),
    }),
    {
      name: 'breathflow-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
