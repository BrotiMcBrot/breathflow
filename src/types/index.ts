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
  phases: Phase[];
  rounds?: number; // undefined = infinite
  isCustom?: boolean;
  createdAt?: number;
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
