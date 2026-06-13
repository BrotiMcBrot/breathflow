# BreathFlow

Open-source Atem-App für iOS & Android. Geführte Atemübungen mit einer einzigartigen Kurven-Animation — der Punkt folgt dem Atemrhythmus entlang eines Pfades: hoch = einatmen, waagerecht = halten, runter = ausatmen.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/BrotiMcBrot/breathflow?style=social)](https://github.com/BrotiMcBrot/breathflow)

---

## ☕ Projekt unterstützen

BreathFlow ist komplett kostenlos und open source. Wenn dir die App gefällt:

<a href="https://ko-fi.com/brotimcbrot" target="_blank">
  <img src="https://ko-fi.com/img/githubbutton_sm.svg" alt="Ko-fi" />
</a>
<a href="https://liberapay.com/BrotiMcBrot/donate" target="_blank">
  <img alt="Donate using Liberapay" src="https://liberapay.com/assets/widgets/donate.svg" />
</a>

---

## Features

- Kurven-Animation: Punkt folgt dem Atemrhythmus auf einem Pfad
- 15 eingebaute Techniken (Beginner & Fortgeschritten)
- Eigene Techniken erstellen mit beliebig vielen Phasen
- Zeit- oder Zyklen-Ziel pro Session
- Sessions & Statistiken (Streak, Gesamtminuten, Verlauf)
- Dunkel- & Hellmodus
- Sound-Integration (Gong, Glocke, Klangschale)
- Spotify-Integration beim Session-Start
- Offline-first, alle Daten lokal

## Techniken

**Beginner:** Box Breathing · Gleichmäßiges Atmen · Dreiecks-Atmung · Lippenbremsatmung · Physiologischer Seufzer · Entspannung 1:2 · 4-7-8 · Kohärentes Atmen · SOMA Basis · Energie-Boost · Buteyko

**Fortgeschritten:** Pranayama 1:4:2 · Kapalabhati · Feueratmung · Wim Hof

## Tech Stack

- [Expo](https://expo.dev) (SDK 54) · React Native
- [react-native-svg](https://github.com/software-mansion/react-native-svg) — Kurven-Animation
- [Expo Router](https://expo.github.io/router) — Navigation
- [Zustand](https://github.com/pmndrs/zustand) + AsyncStorage — State & Persistenz
- TypeScript

## Setup

```bash
npm install --legacy-peer-deps
npx expo start
```

Auf Gerät testen: Expo Go App installieren → QR-Code scannen.

## Projektstruktur

```
breathflow/
├── app/
│   ├── (tabs)/         # Tab-Navigation (Übungen, Verlauf, Einstellungen)
│   └── session/[id].tsx
├── src/
│   ├── components/
│   │   ├── BreathCanvas.tsx       # SVG Kurven-Animation
│   │   └── SessionSettingsModal.tsx
│   ├── screens/
│   ├── store/
│   │   ├── breathStore.ts         # Techniken & Sessions
│   │   └── settingsStore.ts       # Theme, Sound, Spotify
│   ├── locales/                   # Übersetzungen
│   ├── theme.ts                   # Dark/Light Theme
│   └── utils/
│       ├── pathGeometry.ts        # Kurven-Berechnung
│       ├── techniques.ts          # Eingebaute Techniken
│       └── soundManager.ts        # expo-av Sound
```

## Mitmachen

→ [CONTRIBUTING.md](CONTRIBUTING.md) — Übersetzungen, neue Techniken, Bugs

→ [Discussions](https://github.com/BrotiMcBrot/breathflow/discussions) — Ideen & Feedback ohne Git

## Lizenz

MIT — siehe [LICENSE](LICENSE)

---

<sub>Made with 🫁 by <a href="https://nami-sailing.de">Denis @ Nami Sailing</a></sub>
