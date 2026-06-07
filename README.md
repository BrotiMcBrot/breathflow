# BreathFlow

Open-source Atem-App für iOS & Android. Geführte Atemübungen mit einer einzigartigen Kurven-Animation — der Punkt folgt dem Atemrhythmus entlang eines Pfades: hoch = einatmen, waagerecht = halten, runter = ausatmen.

## Features

- Kurven-Animation: visueller Atemleiter mit Punkt auf Linie
- 6 eingebaute Techniken (Box, 4-7-8, Wim Hof, Kohärent, Entspannung, Energie)
- Eigene Techniken erstellen mit beliebig vielen Phasen
- Sessions & Statistiken (Streak, Gesamtminuten, Verlauf)
- Offline-first, alle Daten lokal
- Dark Mode nativ

## Tech Stack

- [Expo](https://expo.dev) (SDK 52)
- [React Native Skia](https://shopify.github.io/react-native-skia/) — Canvas-Animation
- [Expo Router](https://expo.github.io/router) — File-based Navigation
- [Zustand](https://github.com/pmndrs/zustand) + AsyncStorage — State & Persistenz
- TypeScript

## Setup

```bash
# Abhängigkeiten installieren
npm install

# Dev-Server starten
npx expo start

# Auf Gerät testen: Expo Go App installieren, QR-Code scannen
# iOS Simulator: drücke i
# Android Emulator: drücke a
```

## Projektstruktur

```
breathflow/
├── app/                    # Expo Router Screens (Routes)
│   ├── _layout.tsx         # Root Layout
│   ├── index.tsx           # Home (Technik-Liste)
│   ├── session/[id].tsx    # Atem-Session
│   ├── editor.tsx          # Custom Technik Editor
│   └── stats.tsx           # Stats & Verlauf
├── src/
│   ├── components/
│   │   └── BreathCanvas.tsx  # Skia Canvas Animation
│   ├── screens/            # Screen-Komponenten
│   ├── store/
│   │   └── breathStore.ts  # Zustand Store
│   ├── types/              # TypeScript Types
│   └── utils/
│       ├── pathGeometry.ts # Kurven-Berechnung
│       └── techniques.ts   # Eingebaute Techniken
```

## Kurven-Logik

Jede Phase wird als Liniensegment gezeichnet:
- `direction: 'up'` → Linie nach oben (Einatmen)
- `direction: 'right'` → Linie nach rechts (Halten)
- `direction: 'down'` → Linie nach unten (Ausatmen)

Länge = `sekunden × PX_PER_SEC`, dann auf Canvas-Breite skaliert.

## Mitmachen

Issues und PRs willkommen. Lizenz: MIT.

## Unterstütze mich
https://ko-fi.com/brotimcbrot

