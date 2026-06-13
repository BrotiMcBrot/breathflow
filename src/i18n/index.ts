import { useSettingsStore } from '../store/settingsStore';
import { BreathTechnique, Effect } from '../types';

export type Lang = 'de' | 'en';

// ─── UI STRINGS ─────────────────────────────────────────────
export const STRINGS = {
  de: {
    // tabs
    tabHome: 'Übungen', tabStats: 'Statistik', tabSettings: 'Einstellung',
    // home
    newTechnique: '+ Neu', recentlyPracticed: 'Zuletzt geübt', techniques: 'Techniken',
    advanced: 'Fortgeschritten', expert: 'Profi', expertWarningTitle: 'Profi-Technik',
    understand: 'Ich verstehe — Fortfahren', cancel: 'Abbrechen', custom: 'Eigene',
    filterAll: 'Alle', filterCalming: 'Beruhigend', filterEnergy: 'Energie',
    filterLungs: 'Lungen', filterBalance: 'Balance',
    perRound: 's / Runde',
    // session settings modal
    howLong: 'Wie lange möchtest du atmen?', timeMode: '⏱ Zeit', roundsMode: '🔄 Zyklen',
    min: 'min', sec: 'sek', cycles: 'Zyklen', minTenSecs: 'Mindestens 10 Sekunden wählen', go: '▶  Los',
    // session
    pause: '⏸  Pause', start: '▶  Start', resume: '▶  Weiter', pauseLabel: 'Pause',
    endSession: 'Session beenden?', completed: '✓  Abgeschlossen', countsForStats: 'Zählt für Statistik',
    continueSession: '▶  Weitermachen', discard: 'Abbruch (nicht speichern)',
    cycle: 'Zyklus', cyclesWord: 'Zyklen', target: 'Ziel',
    skip: 'Überspringen ›', startNow: 'Direkt starten',
    introStep1: 'Finde eine bequeme Position', introStep2: 'Schultern locker, Rücken aufrecht',
    introStep3: 'Gleich geht es los...',
    wellDone: 'Gut gemacht', outroSub: 'Nimm dir einen Moment.\nSpüre, wie sich dein Atem jetzt anfühlt.',
    duration: 'Dauer', dayStreak: 'Tage Streak', done: 'Fertig',
    // stats
    statistics: 'Statistiken', clear: 'Löschen',
    clearTitle: 'Verlauf löschen', clearMsg: 'Alle Sessions werden gelöscht.',
    sessions: 'Sessions', minutes: 'Minuten', last7Days: 'LETZTE 7 TAGE',
    favTechnique: '⭐ Lieblings-Technik', longestSession: '⏱ Längste Session', avgSession: '📊 Ø Session-Länge',
    history: 'VERLAUF', today: 'Heute', yesterday: 'Gestern',
    noSessions: 'Noch keine Sessions', noSessionsSub: 'Schließe eine Übung ab, dann erscheint sie hier',
    activeDays: 'Aktive Tage', thisMonth: 'diesen Monat', bestStreak: 'Beste Streak', days: 'Tage',
    monthMinutes: 'Minuten', currentStreak: 'Aktuelle Streak',
    // settings
    settings: 'Einstellungen', session: 'Session',
    introOutro: 'Intro & Outro (Einstimmung vor/nach der Übung)',
    haptics: 'Vibration bei Phasenwechsel',
    appearance: 'Darstellung', design: 'Design', dark: '🌙 Dunkel', light: '☀️ Hell',
    language: 'Sprache', sound: 'Klang', music: 'Musik',
    spotifyOnStart: 'Spotify beim Start öffnen', spotifyHint: 'In Spotify: ··· → Teilen → URI kopieren',
    openSpotify: '▶  Spotify öffnen', spotifyNotFound: 'Spotify nicht gefunden',
    spotifyInstall: 'Installiere die Spotify App und versuche es erneut.',
    support: 'Projekt unterstützen', supportTitle: 'BreathFlow ist kostenlos & open source',
    supportDesc: 'Wenn dir die App gefällt, freue ich mich über einen Kaffee ☕',
    kofiBtn: '☕  Ko-fi — Kaffee spendieren', githubBtn: '⭐  GitHub — Stern dalassen',
    app: 'App', version: 'Version', openSource: 'Open Source (MIT)', contribute: 'Mitmachen / Übersetzen',
    more: 'Mehr ↗',
    soundNone: 'Kein Sound', soundGong: 'Gong', soundBell: 'Glocke', soundBowl: 'Klangschale',
    // breathing guidance
    throughNose: 'durch die Nase', throughMouth: 'durch den Mund', holdIt: 'Luft anhalten',
    next: 'Dann', 
    // reminders
    reminders: 'Erinnerungen', reminderMorning: '🌅 Morgens (8:00)', reminderNoon: '☀️ Mittags (13:00)',
    reminderEvening: '🌙 Abends (20:00)',
    reminderTitle: 'Zeit zum Atmen 🫁', reminderBody: 'Ein paar Minuten bewusstes Atmen warten auf dich.',
    notifPermission: 'Benachrichtigungen nicht erlaubt', notifPermissionMsg: 'Erlaube Benachrichtigungen in den Systemeinstellungen.',
    liberapayBtn: '💛 Liberapay — Dauerhaft unterstützen',
    // editor
    newTechniqueTitle: 'Neue Technik', back: '← Zurück', save: 'Speichern',
    techniqueName: 'Name der Technik', techniqueDesc: 'Kurze Beschreibung (optional)',
    phases: 'Phasen', perRoundLabel: 's / Runde', addPhase: '+ Phase hinzufügen', preview: 'Vorschau',
    nameMissing: 'Name fehlt', nameMissingMsg: 'Gib der Technik einen Namen.',
    inhale: 'Einatmen', exhale: 'Ausatmen', hold: 'Halten',
    customTechnique: 'Eigene Technik',
  },
  en: {
    tabHome: 'Exercises', tabStats: 'Statistics', tabSettings: 'Settings',
    newTechnique: '+ New', recentlyPracticed: 'Recently practiced', techniques: 'Techniques',
    advanced: 'Advanced', expert: 'Expert', expertWarningTitle: 'Expert technique',
    understand: 'I understand — Continue', cancel: 'Cancel', custom: 'Custom',
    filterAll: 'All', filterCalming: 'Calming', filterEnergy: 'Energy',
    filterLungs: 'Lungs', filterBalance: 'Balance',
    perRound: 's / round',
    howLong: 'How long do you want to breathe?', timeMode: '⏱ Time', roundsMode: '🔄 Cycles',
    min: 'min', sec: 'sec', cycles: 'Cycles', minTenSecs: 'Choose at least 10 seconds', go: '▶  Go',
    pause: '⏸  Pause', start: '▶  Start', resume: '▶  Resume', pauseLabel: 'Paused',
    endSession: 'End session?', completed: '✓  Completed', countsForStats: 'Counts toward stats',
    continueSession: '▶  Continue', discard: "Discard (don't save)",
    cycle: 'cycle', cyclesWord: 'cycles', target: 'Target',
    skip: 'Skip ›', startNow: 'Start now',
    introStep1: 'Find a comfortable position', introStep2: 'Relax your shoulders, sit upright',
    introStep3: 'Starting soon...',
    wellDone: 'Well done', outroSub: 'Take a moment.\nNotice how your breath feels now.',
    duration: 'Duration', dayStreak: 'Day streak', done: 'Done',
    statistics: 'Statistics', clear: 'Clear',
    clearTitle: 'Clear history', clearMsg: 'All sessions will be deleted.',
    sessions: 'Sessions', minutes: 'Minutes', last7Days: 'LAST 7 DAYS',
    favTechnique: '⭐ Favorite technique', longestSession: '⏱ Longest session', avgSession: '📊 Avg session',
    history: 'HISTORY', today: 'Today', yesterday: 'Yesterday',
    noSessions: 'No sessions yet', noSessionsSub: 'Complete an exercise and it will appear here',
    activeDays: 'Active days', thisMonth: 'this month', bestStreak: 'Best streak', days: 'days',
    monthMinutes: 'Minutes', currentStreak: 'Current streak',
    settings: 'Settings', session: 'Session',
    introOutro: 'Intro & outro (warm-up before/after exercise)',
    haptics: 'Vibration on phase change',
    appearance: 'Appearance', design: 'Theme', dark: '🌙 Dark', light: '☀️ Light',
    language: 'Language', sound: 'Sound', music: 'Music',
    spotifyOnStart: 'Open Spotify on start', spotifyHint: 'In Spotify: ··· → Share → Copy URI',
    openSpotify: '▶  Open Spotify', spotifyNotFound: 'Spotify not found',
    spotifyInstall: 'Install the Spotify app and try again.',
    support: 'Support the project', supportTitle: 'BreathFlow is free & open source',
    supportDesc: 'If you like the app, I appreciate a coffee ☕',
    kofiBtn: '☕  Ko-fi — Buy me a coffee', githubBtn: '⭐  GitHub — Leave a star',
    app: 'App', version: 'Version', openSource: 'Open source (MIT)', contribute: 'Contribute / Translate',
    more: 'More ↗',
    soundNone: 'No sound', soundGong: 'Gong', soundBell: 'Bell', soundBowl: 'Singing bowl',
    throughNose: 'through the nose', throughMouth: 'through the mouth', holdIt: 'hold your breath',
    next: 'Next',
    reminders: 'Reminders', reminderMorning: '🌅 Morning (8:00)', reminderNoon: '☀️ Noon (1:00 pm)',
    reminderEvening: '🌙 Evening (8:00 pm)',
    reminderTitle: 'Time to breathe 🫁', reminderBody: 'A few minutes of mindful breathing await you.',
    notifPermission: 'Notifications not allowed', notifPermissionMsg: 'Allow notifications in system settings.',
    liberapayBtn: '💛 Liberapay — Recurring support',
    newTechniqueTitle: 'New technique', back: '← Back', save: 'Save',
    techniqueName: 'Technique name', techniqueDesc: 'Short description (optional)',
    phases: 'Phases', perRoundLabel: 's / round', addPhase: '+ Add phase', preview: 'Preview',
    nameMissing: 'Name missing', nameMissingMsg: 'Give the technique a name.',
    inhale: 'Inhale', exhale: 'Exhale', hold: 'Hold',
    customTechnique: 'Custom technique',
  },
} as const;

export type Strings = typeof STRINGS.de;

export function useT(): Strings {
  const lang = useSettingsStore((s) => s.language);
  return STRINGS[lang] as Strings;
}

export function useLang(): Lang {
  return useSettingsStore((s) => s.language);
}

export function dateLocale(lang: Lang): string {
  return lang === 'de' ? 'de-DE' : 'en-US';
}

// ─── EFFECT LABELS ──────────────────────────────────────────
export const EFFECT_LABELS: Record<Lang, Record<Effect, string>> = {
  de: { calming: 'Beruhigend', energizing: 'Energie', lung_training: 'Lungen-Training', balancing: 'Ausgleichend' },
  en: { calming: 'Calming', energizing: 'Energizing', lung_training: 'Lung training', balancing: 'Balancing' },
};

// ─── PHASE LABELS ───────────────────────────────────────────
const PHASE_EN: Record<string, string> = {
  'Einatmen': 'Inhale', 'Ausatmen': 'Exhale', 'Halten': 'Hold',
  'Einatmen (Bauch)': 'Inhale (belly)', 'Ausatmen (Bauch)': 'Exhale (belly)',
  'Ausatmen (langsam)': 'Exhale (slowly)', 'Nachatmen': 'Second inhale', 'Lang ausatmen': 'Long exhale',
  'Halten (Kumbhaka)': 'Hold (Kumbhaka)', 'Einatmen (kräftig)': 'Inhale (forceful)',
  'Ausatmen (kräftig)': 'Exhale (forceful)', 'Tief einatmen': 'Deep inhale', 'Retention': 'Retention',
  'Einatmen links': 'Inhale left', 'Ausatmen rechts': 'Exhale right',
  'Einatmen rechts': 'Inhale right', 'Ausatmen links': 'Exhale left',
  'Langsam ein': 'Slow in', 'Langsam aus': 'Slow out', 'Mittel ein': 'Medium in', 'Mittel aus': 'Medium out',
  'Schnell ein': 'Fast in', 'Schnell aus': 'Fast out', 'Anhalten': 'Hold breath', 'Erholen': 'Recover',
  'Pumpe': 'Pump', 'Volle Retention': 'Full retention', 'Ausatmen (sofort)': 'Exhale (immediately)',
};

// ─── TECHNIQUE TRANSLATIONS ─────────────────────────────────
const TECH_EN: Record<string, { name: string; description: string; warning?: string }> = {
  box: { name: 'Box Breathing', description: 'The classic for focus and inner calm. Used by Navy SEALs in high-stress situations.' },
  diaphragmatic: { name: 'Diaphragmatic Breathing', description: 'The foundation of all breathwork. Deep belly breathing calms instantly and improves oxygen uptake.' },
  equal: { name: 'Equal Breathing', description: 'Sama Vritti from yoga. Brings body and mind into balance.' },
  triangle: { name: 'Triangle Breathing', description: 'Gentle introduction to breath retention. Calms without overwhelming.' },
  pursed_lip: { name: 'Pursed Lip Breathing', description: 'Strengthens the airways and relieves shortness of breath. From pulmonary rehabilitation.' },
  physiological_sigh: { name: 'Physiological Sigh', description: 'The scientifically fastest stress reset. Works in under a minute (Stanford 2023).' },
  relax: { name: 'Relaxation 1:2', description: 'Exhale twice as long as you inhale — the direct path to rest mode.' },
  '478': { name: '4-7-8 Breathing', description: "Dr. Andrew Weil's sleep technique. Reliably calms the nervous system." },
  koherent: { name: 'Coherent Breathing', description: 'Optimizes heart rate variability. The ideal daily practice according to James Nestor.' },
  soma_basic: { name: 'SOMA Basic', description: 'Gentle pranayama variation. Corrects breathing habits and builds resilience.' },
  energize: { name: 'Energy Boost', description: 'Fast rhythm for alertness and concentration. The espresso of breathing exercises.' },
  buteyko: { name: 'Buteyko Basic', description: 'Reduced breathing increases CO₂ tolerance. Proven for asthma and sleep issues.' },
  pranayama_ratio: { name: 'Pranayama 1:4:2', description: 'The classic yoga ratio with long breath retention. Deep relaxation and clarity.' },
  bhastrika: { name: 'Bhastrika (Bellows)', description: 'Powerful pump breathing with retention. Wakes up the whole body.' },
  nadi_shodhana: { name: 'Nadi Shodhana', description: 'Alternate nostril breathing from yoga. Balances both brain hemispheres and centers.' },
  sudarshan_kriya: { name: 'Sudarshan Kriya', description: 'Rhythm changes from slow to fast. Proven effective for stress and low mood in studies.' },
  co2_tolerance: { name: 'CO₂ Tolerance Training', description: 'Trains the chemoreceptors. Improves endurance, sleep and breathing economy.' },
  kapalabhati: { name: 'Kapalabhati', description: 'The skull-shining breath. Fast pump strokes cleanse and energize.' },
  breath_of_fire: { name: 'Breath of Fire', description: 'Continuous pump breathing from Kundalini yoga. Creates warmth and presence.' },
  wim_hof: {
    name: 'Wim Hof Method', description: 'Intense cycles with long retention. For energy, focus and cold tolerance.',
    warning: '⚠️ NEVER in water or while driving. Can cause fainting. Only lying down in a safe environment.',
  },
  tummo: {
    name: 'Tummo (Inner Fire)', description: 'Tibetan technique for body heat and deep meditation. The origin of the Wim Hof method.',
    warning: '⚠️ Only lying down in a warm, safe environment. Can cause dizziness. Not with heart conditions.',
  },
  holotropic_simplified: {
    name: 'Holotropic Breathing', description: 'Fast connected breathing after Grof. Can induce altered states of consciousness.',
    warning: '⚠️ Strong emotional reactions and fainting possible. ONLY with a companion. Not with heart conditions, epilepsy, pregnancy or mental illness.',
  },
  pranayama_extended: {
    name: 'Pranayama 1:8:4', description: 'Very long breath retention for experienced practitioners. Deepest stillness.',
    warning: '⚠️ Only after months of experience with shorter ratios. Not with high blood pressure or heart conditions.',
  },
  rebirthing: {
    name: 'Connected Breathing', description: 'Circular breathing without pauses after Leonard Orr. Deep emotional work.',
    warning: '⚠️ Can trigger intense emotions and tingling. Companion recommended. Not with mental illness.',
  },
};

export function localizeTechnique(t: BreathTechnique, lang: Lang): BreathTechnique {
  if (lang === 'de' || t.isCustom) return t;
  const tr = TECH_EN[t.id];
  return {
    ...t,
    name: tr?.name ?? t.name,
    description: tr?.description ?? t.description,
    warning: t.warning ? (tr?.warning ?? t.warning) : undefined,
    phases: t.phases.map((p) => ({ ...p, label: PHASE_EN[p.label] ?? p.label })),
  };
}
