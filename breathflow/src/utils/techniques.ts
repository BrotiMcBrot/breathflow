import { BreathTechnique } from '../types';

export const BUILTIN_TECHNIQUES: BreathTechnique[] = [

  // ─── BEGINNER ──────────────────────────────────────────────────────────────

  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Gleichmäßiger 4er-Rhythmus. Stress reduzieren, Fokus fördern. Von Navy SEALs genutzt.',
    phases: [
      { label: 'Einatmen', seconds: 4, direction: 'up' },
      { label: 'Halten', seconds: 4, direction: 'right' },
      { label: 'Ausatmen', seconds: 4, direction: 'down' },
      { label: 'Halten', seconds: 4, direction: 'right' },
    ],
  },

  {
    id: 'diaphragmatic',
    name: 'Zwerchfellatmung',
    description: 'Tiefes Bauchatmen. Basis aller Atemübungen. Aktiviert das Zwerchfell, beruhigt sofort.',
    phases: [
      { label: 'Einatmen (Bauch)', seconds: 4, direction: 'up' },
      { label: 'Ausatmen (Bauch)', seconds: 6, direction: 'down' },
    ],
  },

  {
    id: 'equal',
    name: 'Gleichmäßiges Atmen',
    description: 'Gleich langes Ein- und Ausatmen (Sama Vritti). Nervensystem ausgleichen.',
    phases: [
      { label: 'Einatmen', seconds: 4, direction: 'up' },
      { label: 'Ausatmen', seconds: 4, direction: 'down' },
    ],
  },

  {
    id: 'triangle',
    name: 'Dreiecks-Atmung',
    description: 'Drei Phasen ohne Schluss-Pause. Sanfte Entspannung für Einsteiger.',
    phases: [
      { label: 'Einatmen', seconds: 4, direction: 'up' },
      { label: 'Halten', seconds: 4, direction: 'right' },
      { label: 'Ausatmen', seconds: 4, direction: 'down' },
    ],
  },

  {
    id: 'pursed_lip',
    name: 'Lippenbremsatmung',
    description: '2:4-Verhältnis mit gespitzten Lippen. Verbessert Lungenkapazität, lindert Kurzatmigkeit.',
    phases: [
      { label: 'Einatmen', seconds: 2, direction: 'up' },
      { label: 'Ausatmen (langsam)', seconds: 4, direction: 'down' },
    ],
  },

  {
    id: 'physiological_sigh',
    name: 'Physiologischer Seufzer',
    description: 'Doppel-Einatmung + langer Ausatem. Wissenschaftlich schnellster Stress-Reset (Stanford 2023).',
    phases: [
      { label: 'Einatmen', seconds: 4, direction: 'up' },
      { label: '2. Einatmen (schnüffeln)', seconds: 2, direction: 'up' },
      { label: 'Lang ausatmen', seconds: 8, direction: 'down' },
    ],
  },

  {
    id: 'relax',
    name: 'Entspannung 1:2',
    description: 'Verlängertes Ausatmen aktiviert sofort den Ruhemodus des Nervensystems.',
    phases: [
      { label: 'Einatmen', seconds: 4, direction: 'up' },
      { label: 'Ausatmen', seconds: 8, direction: 'down' },
    ],
  },

  {
    id: '478',
    name: '4-7-8 Atmung',
    description: 'Nach Dr. Andrew Weil. Aktiviert den Parasympathikus. Ideal zum Einschlafen.',
    phases: [
      { label: 'Einatmen', seconds: 4, direction: 'up' },
      { label: 'Halten', seconds: 7, direction: 'right' },
      { label: 'Ausatmen', seconds: 8, direction: 'down' },
    ],
  },

  {
    id: 'koherent',
    name: 'Kohärentes Atmen',
    description: '5 Atemzüge/Minute. Nach James Nestor: optimiert Herzratenvariabilität nachhaltig.',
    phases: [
      { label: 'Einatmen', seconds: 5, direction: 'up' },
      { label: 'Ausatmen', seconds: 5, direction: 'down' },
    ],
  },

  {
    id: 'soma_basic',
    name: 'SOMA Basis',
    description: 'Sanfte Pranayama-Variante (Niraj Naik). Korrigiert Atemgewohnheiten, stärkt Resilienz.',
    phases: [
      { label: 'Einatmen', seconds: 2, direction: 'up' },
      { label: 'Halten', seconds: 1, direction: 'right' },
      { label: 'Ausatmen', seconds: 4, direction: 'down' },
      { label: 'Halten', seconds: 1, direction: 'right' },
    ],
  },

  {
    id: 'energize',
    name: 'Energie-Boost',
    description: 'Schnelles Atmen aktiviert das Nervensystem. Wach und konzentriert werden.',
    phases: [
      { label: 'Einatmen', seconds: 2, direction: 'up' },
      { label: 'Ausatmen', seconds: 2, direction: 'down' },
    ],
  },

  {
    id: 'buteyko',
    name: 'Buteyko Basis',
    description: 'Reduziertes Atmen nach Dr. Konstantin Buteyko. Erhöht CO₂-Toleranz, hilft bei Asthma.',
    phases: [
      { label: 'Einatmen', seconds: 3, direction: 'up' },
      { label: 'Halten', seconds: 3, direction: 'right' },
      { label: 'Ausatmen', seconds: 6, direction: 'down' },
      { label: 'Halten', seconds: 3, direction: 'right' },
    ],
  },

  // ─── FORTGESCHRITTEN ───────────────────────────────────────────────────────

  {
    id: 'pranayama_ratio',
    name: 'Pranayama 1:4:2',
    description: 'Klassisches Yoga-Atemverhältnis. Tiefe Entspannung, geistige Klarheit.',
    isAdvanced: true,
    phases: [
      { label: 'Einatmen', seconds: 4, direction: 'up' },
      { label: 'Halten (Kumbhaka)', seconds: 16, direction: 'right' },
      { label: 'Ausatmen', seconds: 8, direction: 'down' },
    ],
  },

  {
    id: 'bhastrika',
    name: 'Bhastrika (Blasebalg)',
    description: 'Kraftvolle Pumpatmung aus dem Yoga. Stärker als Feueratmung. Reinigend und energetisierend.',
    isAdvanced: true,
    phases: [
      { label: 'Einatmen (kräftig)', seconds: 2, direction: 'up' },
      { label: 'Ausatmen (kräftig)', seconds: 2, direction: 'down' },
      { label: 'Einatmen (kräftig)', seconds: 2, direction: 'up' },
      { label: 'Ausatmen (kräftig)', seconds: 2, direction: 'down' },
      { label: 'Einatmen (kräftig)', seconds: 2, direction: 'up' },
      { label: 'Ausatmen (kräftig)', seconds: 2, direction: 'down' },
      { label: 'Tief einatmen', seconds: 3, direction: 'up' },
      { label: 'Retention', seconds: 15, direction: 'right' },
    ],
    rounds: 3,
  },

  {
    id: 'nadi_shodhana',
    name: 'Nadi Shodhana (vereinfacht)',
    description: 'Wechselatmung aus dem Yoga ohne Nasensteuerung. Balanciert beide Gehirnhälften.',
    isAdvanced: true,
    phases: [
      { label: 'Einatmen links', seconds: 4, direction: 'up' },
      { label: 'Halten', seconds: 4, direction: 'right' },
      { label: 'Ausatmen rechts', seconds: 4, direction: 'down' },
      { label: 'Einatmen rechts', seconds: 4, direction: 'up' },
      { label: 'Halten', seconds: 4, direction: 'right' },
      { label: 'Ausatmen links', seconds: 4, direction: 'down' },
    ],
  },

  {
    id: 'sudarshan_kriya',
    name: 'Sudarshan Kriya (Basis)',
    description: 'Sri Sri Ravi Shankar. Drei Geschwindigkeiten: langsam → mittel → schnell. Studiert bei Stress & Depression.',
    isAdvanced: true,
    phases: [
      { label: 'Langsam — Einatmen', seconds: 3, direction: 'up' },
      { label: 'Langsam — Ausatmen', seconds: 3, direction: 'down' },
      { label: 'Langsam — Einatmen', seconds: 3, direction: 'up' },
      { label: 'Langsam — Ausatmen', seconds: 3, direction: 'down' },
      { label: 'Mittel — Einatmen', seconds: 2, direction: 'up' },
      { label: 'Mittel — Ausatmen', seconds: 2, direction: 'down' },
      { label: 'Mittel — Einatmen', seconds: 2, direction: 'up' },
      { label: 'Mittel — Ausatmen', seconds: 2, direction: 'down' },
      { label: 'Schnell — Einatmen', seconds: 1, direction: 'up' },
      { label: 'Schnell — Ausatmen', seconds: 1, direction: 'down' },
      { label: 'Schnell — Einatmen', seconds: 1, direction: 'up' },
      { label: 'Schnell — Ausatmen', seconds: 1, direction: 'down' },
      { label: 'Schnell — Einatmen', seconds: 1, direction: 'up' },
      { label: 'Schnell — Ausatmen', seconds: 1, direction: 'down' },
      { label: 'Halten', seconds: 10, direction: 'right' },
    ],
    rounds: 3,
  },

  {
    id: 'co2_tolerance',
    name: 'CO₂-Toleranztraining',
    description: 'Nach Buteyko & Patrick McKeown. Trainiert Chemorezepto­ren. Verbessert Ausdauer & Schlaf.',
    isAdvanced: true,
    phases: [
      { label: 'Einatmen (nase)', seconds: 4, direction: 'up' },
      { label: 'Ausatmen (nase)', seconds: 4, direction: 'down' },
      { label: 'Einatmen (nase)', seconds: 4, direction: 'up' },
      { label: 'Ausatmen (nase)', seconds: 4, direction: 'down' },
      { label: 'Einatmen', seconds: 4, direction: 'up' },
      { label: 'Atem anhalten', seconds: 30, direction: 'right' },
      { label: 'Ausatmen', seconds: 6, direction: 'down' },
      { label: 'Normal atmen', seconds: 10, direction: 'up' },
    ],
    rounds: 5,
  },

  {
    id: 'kapalabhati',
    name: 'Kapalabhati',
    description: 'Schädelatmung aus dem Yoga. Schnelle Pumpatmung + Retention. Reinigend, energetisierend.',
    isAdvanced: true,
    phases: [
      { label: 'Einatmen', seconds: 1, direction: 'up' },
      { label: 'Ausatmen (Pumpe)', seconds: 1, direction: 'down' },
      { label: 'Einatmen', seconds: 1, direction: 'up' },
      { label: 'Ausatmen (Pumpe)', seconds: 1, direction: 'down' },
      { label: 'Einatmen', seconds: 1, direction: 'up' },
      { label: 'Ausatmen (Pumpe)', seconds: 1, direction: 'down' },
      { label: 'Einatmen', seconds: 1, direction: 'up' },
      { label: 'Ausatmen (Pumpe)', seconds: 1, direction: 'down' },
      { label: 'Einatmen', seconds: 1, direction: 'up' },
      { label: 'Retention', seconds: 20, direction: 'right' },
    ],
    rounds: 3,
  },

  {
    id: 'breath_of_fire',
    name: 'Feueratmung',
    description: 'Kundalini-Technik. Kontinuierliche Pumpatmung. Aktiviert Energie, wärmt den Körper.',
    isAdvanced: true,
    phases: [
      { label: 'Einatmen', seconds: 1, direction: 'up' },
      { label: 'Ausatmen', seconds: 1, direction: 'down' },
      { label: 'Einatmen', seconds: 1, direction: 'up' },
      { label: 'Ausatmen', seconds: 1, direction: 'down' },
      { label: 'Einatmen', seconds: 1, direction: 'up' },
      { label: 'Ausatmen', seconds: 1, direction: 'down' },
      { label: 'Einatmen', seconds: 1, direction: 'up' },
      { label: 'Ausatmen', seconds: 1, direction: 'down' },
    ],
  },

  // ─── PROFI ─────────────────────────────────────────────────────────────────

  {
    id: 'wim_hof',
    name: 'Wim Hof Methode',
    description: '30 schnelle Atemzüge + lange Retention. Immun­system, Energie, Fokus.',
    warning: '⚠️ NIEMALS im Wasser oder beim Fahren. Kann Ohnmacht verursachen. Nur in sicherer Umgebung im Liegen.',
    isProfi: true,
    phases: [
      { label: 'Einatmen', seconds: 2, direction: 'up' },
      { label: 'Ausatmen', seconds: 1, direction: 'down' },
      { label: 'Einatmen', seconds: 2, direction: 'up' },
      { label: 'Ausatmen', seconds: 1, direction: 'down' },
      { label: 'Einatmen', seconds: 2, direction: 'up' },
      { label: 'Ausatmen', seconds: 1, direction: 'down' },
      { label: 'Einatmen', seconds: 2, direction: 'up' },
      { label: 'Ausatmen', seconds: 1, direction: 'down' },
      { label: 'Einatmen', seconds: 2, direction: 'up' },
      { label: 'Retention', seconds: 30, direction: 'right' },
    ],
    rounds: 3,
  },

  {
    id: 'tummo',
    name: 'Tummo (Inneres Feuer)',
    description: 'Tibetisch-buddhistische Technik. Erzeugt Körperwärme, tiefe Meditation. Basis der Wim-Hof-Methode.',
    warning: '⚠️ Nur in sicherer, warmer Umgebung im Liegen. Kann Schwindel und Kribbeln verursachen. Nicht bei Herzproblemen.',
    isProfi: true,
    phases: [
      { label: 'Tief einatmen', seconds: 3, direction: 'up' },
      { label: 'Ausatmen', seconds: 2, direction: 'down' },
      { label: 'Tief einatmen', seconds: 3, direction: 'up' },
      { label: 'Ausatmen', seconds: 2, direction: 'down' },
      { label: 'Tief einatmen', seconds: 3, direction: 'up' },
      { label: 'Ausatmen', seconds: 2, direction: 'down' },
      { label: 'Tief einatmen', seconds: 3, direction: 'up' },
      { label: 'Ausatmen', seconds: 2, direction: 'down' },
      { label: 'Tief einatmen', seconds: 3, direction: 'up' },
      { label: 'Volle Retention', seconds: 45, direction: 'right' },
      { label: 'Ausatmen', seconds: 4, direction: 'down' },
    ],
    rounds: 4,
  },

  {
    id: 'holotropic_simplified',
    name: 'Holotropes Atmen (vereinfacht)',
    description: 'Nach Stanislav Grof. Schnelles verbundenes Atmen ohne Pausen. Veränderte Bewusstseinszustände möglich.',
    warning: '⚠️ Kann starke emotionale Reaktionen, Kribbeln (Tetanie) und Ohnmacht verursachen. NUR mit einer Begleitperson. Nicht bei Herzproblemen, Epilepsie, Schwangerschaft oder psychischen Erkrankungen.',
    isProfi: true,
    phases: [
      { label: 'Einatmen', seconds: 2, direction: 'up' },
      { label: 'Ausatmen', seconds: 2, direction: 'down' },
      { label: 'Einatmen', seconds: 2, direction: 'up' },
      { label: 'Ausatmen', seconds: 2, direction: 'down' },
      { label: 'Einatmen', seconds: 2, direction: 'up' },
      { label: 'Ausatmen', seconds: 2, direction: 'down' },
      { label: 'Einatmen', seconds: 2, direction: 'up' },
      { label: 'Ausatmen', seconds: 2, direction: 'down' },
      { label: 'Einatmen', seconds: 2, direction: 'up' },
      { label: 'Ausatmen', seconds: 2, direction: 'down' },
      { label: 'Einatmen', seconds: 2, direction: 'up' },
      { label: 'Ausatmen', seconds: 2, direction: 'down' },
    ],
    rounds: 5,
  },

  {
    id: 'pranayama_extended',
    name: 'Pranayama Erweitert (1:8:4)',
    description: 'Fortgeschrittenes Yoga-Verhältnis mit sehr langer Retention. Tiefste Entspannung und Bewusstseinserweiterung.',
    warning: '⚠️ Sehr lange Atemhaltung. Nur nach Wochen/Monaten Erfahrung mit kürzeren Verhältnissen. Nicht bei Bluthochdruck oder Herzproblemen.',
    isProfi: true,
    phases: [
      { label: 'Einatmen', seconds: 4, direction: 'up' },
      { label: 'Halten (Kumbhaka)', seconds: 32, direction: 'right' },
      { label: 'Ausatmen', seconds: 16, direction: 'down' },
    ],
  },

  {
    id: 'rebirthing',
    name: 'Verbundenes Atmen',
    description: 'Nach Leonard Orr (Rebirthing). Kontinuierliches Atmen ohne Pause zwischen Ein- und Ausatmen. Emotionale Befreiung.',
    warning: '⚠️ Kann intensive emotionale Erlebnisse, Kribbeln und Tetanie auslösen. Begleitperson empfohlen. Nicht bei psychischen Erkrankungen.',
    isProfi: true,
    phases: [
      { label: 'Einatmen', seconds: 3, direction: 'up' },
      { label: 'Ausatmen (sofort)', seconds: 3, direction: 'down' },
      { label: 'Einatmen', seconds: 3, direction: 'up' },
      { label: 'Ausatmen (sofort)', seconds: 3, direction: 'down' },
      { label: 'Einatmen', seconds: 3, direction: 'up' },
      { label: 'Ausatmen (sofort)', seconds: 3, direction: 'down' },
      { label: 'Einatmen', seconds: 3, direction: 'up' },
      { label: 'Ausatmen (sofort)', seconds: 3, direction: 'down' },
    ],
    rounds: 10,
  },

];
