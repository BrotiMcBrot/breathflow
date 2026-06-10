export type PhaseDirection = 'up' | 'down' | 'right';

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
