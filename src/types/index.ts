export type PhaseDirection = 'up' | 'down' | 'right';

export type Effect = 'calming' | 'energizing' | 'lung_training' | 'balancing';

export interface Phase {
  label: string;
  seconds: number;
  direction: PhaseDirection;
}

export interface BreathTechnique {
  id: string;
  name: string;
  description: string;
  warning?: string;
  phases: Phase[];
  effects: Effect[];
  rounds?: number;
  isCustom?: boolean;
  isAdvanced?: boolean;
  isProfi?: boolean;
  createdAt?: number;
}

export interface SessionSettings {
  mode: 'time' | 'rounds';
  targetMinutes: number;
  targetSeconds: number;
  targetRounds: number;
}

export interface BreathSession {
  id: string;
  techniqueId: string;
  techniqueName: string;
  startedAt: number;
  endedAt: number;
  durationSeconds: number;
  roundsCompleted: number;
}

export interface PathPoint {
  x: number;
  y: number;
  phase?: Phase;
}

export const EFFECT_META: Record<Effect, { label: string; emoji: string; color: string }> = {
  calming: { label: 'Beruhigend', emoji: '🌙', color: '#7C6FDD' },
  energizing: { label: 'Energie', emoji: '⚡', color: '#EF9F27' },
  lung_training: { label: 'Lungen-Training', emoji: '🫁', color: '#1D9E75' },
  balancing: { label: 'Ausgleichend', emoji: '⚖️', color: '#378ADD' },
};
