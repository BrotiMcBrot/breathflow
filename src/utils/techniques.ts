import { BreathTechnique } from '../types';

export const BUILTIN_TECHNIQUES: BreathTechnique[] = [
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Gleichmäßiger 4er-Rhythmus. Reduziert Stress, fördert Fokus.',
    phases: [
      { label: 'Einatmen', seconds: 4, direction: 'up' },
      { label: 'Halten', seconds: 4, direction: 'right' },
      { label: 'Ausatmen', seconds: 4, direction: 'down' },
      { label: 'Halten', seconds: 4, direction: 'right' },
    ],
  },
  {
    id: '478',
    name: '4-7-8',
    description: 'Aktiviert den Parasympathikus. Ideal zum Einschlafen.',
    phases: [
      { label: 'Einatmen', seconds: 4, direction: 'up' },
      { label: 'Halten', seconds: 7, direction: 'right' },
      { label: 'Ausatmen', seconds: 8, direction: 'down' },
    ],
  },
  {
    id: 'koherent',
    name: 'Kohärentes Atmen',
    description: '5 Atemzüge pro Minute. Optimiert Herzratenvariabilität.',
    phases: [
      { label: 'Einatmen', seconds: 5, direction: 'up' },
      { label: 'Ausatmen', seconds: 5, direction: 'down' },
    ],
  },
  {
    id: 'wim_hof',
    name: 'Wim Hof (1 Runde)',
    description: '30 schnelle Atemzüge + lange Retention. Energie & Fokus.',
    phases: [
      { label: 'Einatmen', seconds: 2, direction: 'up' },
      { label: 'Ausatmen', seconds: 1, direction: 'down' },
      { label: 'Einatmen', seconds: 2, direction: 'up' },
      { label: 'Ausatmen', seconds: 1, direction: 'down' },
      { label: 'Einatmen', seconds: 2, direction: 'up' },
      { label: 'Halten', seconds: 15, direction: 'right' },
    ],
    rounds: 3,
  },
  {
    id: 'relax',
    name: 'Entspannung',
    description: 'Verlängertes Ausatmen aktiviert sofort den Ruhemodus.',
    phases: [
      { label: 'Einatmen', seconds: 4, direction: 'up' },
      { label: 'Ausatmen', seconds: 8, direction: 'down' },
    ],
  },
  {
    id: 'energize',
    name: 'Energie-Boost',
    description: 'Schnelles Atmen aktiviert das Nervensystem.',
    phases: [
      { label: 'Einatmen', seconds: 2, direction: 'up' },
      { label: 'Ausatmen', seconds: 2, direction: 'down' },
    ],
  },
];
