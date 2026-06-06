import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BreathTechnique, BreathSession } from '../types';
import { BUILTIN_TECHNIQUES } from '../utils/techniques';

interface BreathStore {
  techniques: BreathTechnique[];
  sessions: BreathSession[];
  addCustomTechnique: (t: BreathTechnique) => void;
  updateCustomTechnique: (t: BreathTechnique) => void;
  deleteCustomTechnique: (id: string) => void;
  addSession: (s: BreathSession) => void;
  clearSessions: () => void;
  getTechniqueById: (id: string) => BreathTechnique | undefined;
  getStats: () => {
    totalSessions: number;
    totalMinutes: number;
    streak: number;
    favoriteId: string | null;
  };
}

export const useBreathStore = create<BreathStore>()(
  persist(
    (set, get) => ({
      techniques: BUILTIN_TECHNIQUES,
      sessions: [],

      addCustomTechnique: (t) =>
        set((s) => ({ techniques: [...s.techniques, { ...t, isCustom: true, createdAt: Date.now() }] })),

      updateCustomTechnique: (t) =>
        set((s) => ({ techniques: s.techniques.map((x) => (x.id === t.id ? t : x)) })),

      deleteCustomTechnique: (id) =>
        set((s) => ({ techniques: s.techniques.filter((x) => x.id !== id || !x.isCustom) })),

      addSession: (s) =>
        set((state) => ({ sessions: [s, ...state.sessions].slice(0, 500) })),

      clearSessions: () => set({ sessions: [] }),

      getTechniqueById: (id) => get().techniques.find((t) => t.id === id),

      getStats: () => {
        const { sessions } = get();
        if (!sessions.length) return { totalSessions: 0, totalMinutes: 0, streak: 0, favoriteId: null };

        const totalMinutes = Math.round(sessions.reduce((a, s) => a + s.durationSeconds, 0) / 60);

        // streak: consecutive days with at least one session
        const days = new Set(sessions.map((s) => new Date(s.startedAt).toDateString()));
        let streak = 0;
        const today = new Date();
        for (let i = 0; i < 365; i++) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          if (days.has(d.toDateString())) streak++;
          else if (i > 0) break;
        }

        // favorite: most used technique
        const counts: Record<string, number> = {};
        sessions.forEach((s) => { counts[s.techniqueId] = (counts[s.techniqueId] ?? 0) + 1; });
        const favoriteId = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

        return { totalSessions: sessions.length, totalMinutes, streak, favoriteId };
      },
    }),
    {
      name: 'breathflow-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        techniques: s.techniques.filter((t) => t.isCustom),
        sessions: s.sessions,
      }),
      merge: (persisted: any, current) => ({
        ...current,
        techniques: [
          ...BUILTIN_TECHNIQUES,
          ...(persisted.techniques ?? []),
        ],
        sessions: persisted.sessions ?? [],
      }),
    }
  )
);
