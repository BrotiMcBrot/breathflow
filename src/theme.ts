import { useSettingsStore } from './store/settingsStore';

export interface Colors {
  bg: string;
  surface: string;
  elevated: string;
  border: string;
  borderStrong: string;
  text: string;
  textSec: string;
  textMuted: string;
  textFaint: string;
  accent: string;
  accentDark: string;
  accentBg: string;
  accentBorder: string;
  up: string;
  hold: string;
  down: string;
  advanced: string;
  danger: string;
  canvasBg: string;
  trailGhost: string;
  midLine: string;
}

export const DARK: Colors = {
  bg: '#0a0a0f',
  surface: '#0f0f1a',
  elevated: '#111120',
  border: '#1a1a2e',
  borderStrong: '#2a2a4a',
  text: '#ffffff',
  textSec: '#cccccc',
  textMuted: '#446688',
  textFaint: '#334455',
  accent: '#378ADD',
  accentDark: '#185FA5',
  accentBg: '#185FA510',
  accentBorder: '#185FA530',
  up: '#378ADD',
  hold: '#EF9F27',
  down: '#1D9E75',
  advanced: '#EF9F27',
  danger: '#664444',
  canvasBg: '#0a0a0f',
  trailGhost: '#1a2a3a',
  midLine: '#1e2e3e',
};

export const LIGHT: Colors = {
  bg: '#f0f4f8',
  surface: '#ffffff',
  elevated: '#f8fafc',
  border: '#e2e8f0',
  borderStrong: '#cbd5e0',
  text: '#0d1117',
  textSec: '#2d3748',
  textMuted: '#4a6080',
  textFaint: '#718096',
  accent: '#185FA5',
  accentDark: '#0d3d6e',
  accentBg: '#185FA512',
  accentBorder: '#185FA535',
  up: '#185FA5',
  hold: '#b45309',
  down: '#065f46',
  advanced: '#b45309',
  danger: '#991b1b',
  canvasBg: '#f0f4f8',
  trailGhost: '#c8d8e8',
  midLine: '#dde8f0',
};

export function useTheme(): Colors {
  const theme = useSettingsStore((s) => s.theme);
  return theme === 'dark' ? DARK : LIGHT;
}
