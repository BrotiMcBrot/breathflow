import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  TextInput, ScrollView, Linking, Alert, Switch,
} from 'react-native';
import { useSettingsStore, SoundType } from '../store/settingsStore';
import { useTheme, Colors } from '../theme';
import { SOUND_LABELS } from '../utils/soundManager';

const SOUND_OPTIONS: SoundType[] = ['none', 'gong', 'bell', 'bowl'];
const KOFI_URL = 'https://ko-fi.com/brotimcbrot';
const GITHUB_URL = 'https://github.com/BrotiMcBrot/breathflow';

function Row({ label, children, c }: { label: string; children: React.ReactNode; c: Colors }) {
  return (
    <View style={[rowStyles.row, { borderBottomColor: c.border }]}>
      <Text style={[rowStyles.label, { color: c.textMuted }]}>{label}</Text>
      <View style={rowStyles.right}>{children}</View>
    </View>
  );
}
const rowStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 0.5 },
  label: { fontSize: 15 },
  right: { alignItems: 'flex-end' },
});

export default function SettingsScreen() {
  const c = useTheme();
  const { theme, setTheme, soundType, setSoundType, spotifyUri, setSpotifyUri, spotifyEnabled, setSpotifyEnabled } = useSettingsStore();
  const [spotifyInput, setSpotifyInput] = useState(spotifyUri);
  const s = makeStyles(c);

  const openSpotify = () => {
    Linking.openURL(spotifyUri || 'spotify:').catch(() =>
      Alert.alert('Spotify nicht gefunden', 'Installiere die Spotify App und versuche es erneut.')
    );
  };

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>Einstellungen</Text>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* DARSTELLUNG */}
        <Text style={s.section}>Darstellung</Text>
        <View style={s.card}>
          <Row label="Design" c={c}>
            <View style={s.toggleRow}>
              <TouchableOpacity style={[s.toggleBtn, theme === 'dark' && s.toggleBtnActive]} onPress={() => setTheme('dark')}>
                <Text style={[s.toggleTxt, theme === 'dark' && s.toggleTxtActive]}>🌙 Dunkel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.toggleBtn, theme === 'light' && s.toggleBtnActive]} onPress={() => setTheme('light')}>
                <Text style={[s.toggleTxt, theme === 'light' && s.toggleTxtActive]}>☀️ Hell</Text>
              </TouchableOpacity>
            </View>
          </Row>
        </View>

        {/* KLANG */}
        <Text style={s.section}>Klang</Text>
        <View style={s.card}>
          {SOUND_OPTIONS.map((opt) => (
            <TouchableOpacity key={opt} style={[s.soundRow, { borderBottomColor: c.border }]} onPress={() => setSoundType(opt)}>
              <Text style={[s.soundLabel, { color: c.text }]}>{SOUND_LABELS[opt]}</Text>
              <View style={[s.radio, soundType === opt && { borderColor: c.accent }]}>
                {soundType === opt && <View style={[s.radioDot, { backgroundColor: c.accent }]} />}
              </View>
            </TouchableOpacity>
          ))}
          <View style={s.soundNote}>
            <Text style={[s.soundNoteTxt, { color: c.textFaint }]}>
              💡 gong.mp3, bell.mp3, bowl.mp3 in src/assets/sounds/ ablegen.{'\n'}
              Kostenlose Sounds: freesound.org
            </Text>
          </View>
        </View>

        {/* MUSIK */}
        <Text style={s.section}>Musik</Text>
        <View style={s.card}>
          <Row label="Spotify beim Start öffnen" c={c}>
            <Switch value={spotifyEnabled} onValueChange={setSpotifyEnabled}
              trackColor={{ false: c.border, true: c.accent }} thumbColor={c.surface} />
          </Row>
          <View style={[s.spotifyUriWrap, { borderBottomColor: c.border }]}>
            <Text style={[s.spotifyUriLabel, { color: c.textMuted }]}>Spotify URI</Text>
            <TextInput
              style={[s.spotifyInput, { color: c.text, borderColor: c.border, backgroundColor: c.elevated }]}
              value={spotifyInput} onChangeText={setSpotifyInput}
              onBlur={() => setSpotifyUri(spotifyInput.trim())}
              placeholder="spotify:playlist:37i9dQZF1DX..."
              placeholderTextColor={c.textFaint} autoCapitalize="none" autoCorrect={false}
            />
            <Text style={[s.spotifyHint, { color: c.textFaint }]}>
              In Spotify: ··· → Teilen → Spotify-URI kopieren
            </Text>
          </View>
          <TouchableOpacity style={[s.spotifyBtn, { backgroundColor: '#1DB954' }]} onPress={openSpotify}>
            <Text style={s.spotifyBtnTxt}>▶  Spotify öffnen</Text>
          </TouchableOpacity>
        </View>

        {/* UNTERSTÜTZEN */}
        <Text style={s.section}>Projekt unterstützen</Text>
        <View style={s.supportCard}>
          <Text style={[s.supportTitle, { color: c.text }]}>BreathFlow ist kostenlos & open source</Text>
          <Text style={[s.supportDesc, { color: c.textMuted }]}>
            Wenn dir die App gefällt, freue ich mich über einen Kaffee ☕{'\n'}
            Das hilft mir, die App weiterzuentwickeln.
          </Text>
          <TouchableOpacity
            style={s.kofiBtn}
            onPress={() => Linking.openURL(KOFI_URL)}
            activeOpacity={0.85}
          >
            <Text style={s.kofiBtnTxt}>☕  Ko-fi — Kaffee spendieren</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.githubBtn, { backgroundColor: c.elevated, borderColor: c.border }]}
            onPress={() => Linking.openURL(GITHUB_URL)}
            activeOpacity={0.85}
          >
            <Text style={[s.githubBtnTxt, { color: c.textSec }]}>⭐  GitHub — Stern dalassen</Text>
          </TouchableOpacity>
        </View>

        {/* APP INFO */}
        <Text style={s.section}>App</Text>
        <View style={s.card}>
          <Row label="Version" c={c}>
            <Text style={[rowStyles.label, { color: c.textFaint }]}>0.1.0</Text>
          </Row>
          <Row label="Open Source (MIT)" c={c}>
            <TouchableOpacity onPress={() => Linking.openURL(GITHUB_URL)}>
              <Text style={[rowStyles.label, { color: c.accent }]}>GitHub ↗</Text>
            </TouchableOpacity>
          </Row>
          <Row label="Mitmachen / Übersetzen" c={c}>
            <TouchableOpacity onPress={() => Linking.openURL(`${GITHUB_URL}/blob/main/CONTRIBUTING.md`)}>
              <Text style={[rowStyles.label, { color: c.accent }]}>CONTRIBUTING ↗</Text>
            </TouchableOpacity>
          </Row>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(c: Colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    header: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16 },
    title: { color: c.text, fontSize: 22, fontWeight: '300', letterSpacing: 2 },
    scroll: { paddingHorizontal: 24 },
    section: { color: c.textFaint, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', marginTop: 28, marginBottom: 8 },
    card: { backgroundColor: c.surface, borderRadius: 16, paddingHorizontal: 16, borderWidth: 0.5, borderColor: c.border },
    toggleRow: { flexDirection: 'row', gap: 8 },
    toggleBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 0.5, borderColor: c.border, backgroundColor: c.elevated },
    toggleBtnActive: { backgroundColor: c.accentBg, borderColor: c.accentBorder },
    toggleTxt: { color: c.textMuted, fontSize: 14 },
    toggleTxtActive: { color: c.accent, fontWeight: '500' },
    soundRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 0.5 },
    soundLabel: { fontSize: 15 },
    radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: c.border, alignItems: 'center', justifyContent: 'center' },
    radioDot: { width: 10, height: 10, borderRadius: 5 },
    soundNote: { paddingVertical: 12 },
    soundNoteTxt: { fontSize: 12, lineHeight: 18 },
    spotifyUriWrap: { paddingVertical: 14, borderBottomWidth: 0.5 },
    spotifyUriLabel: { fontSize: 13, marginBottom: 8 },
    spotifyInput: { borderWidth: 0.5, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, marginBottom: 6 },
    spotifyHint: { fontSize: 11, lineHeight: 16 },
    spotifyBtn: { borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginVertical: 14 },
    spotifyBtnTxt: { color: '#fff', fontSize: 16, fontWeight: '600' },
    // support section
    supportCard: { backgroundColor: c.surface, borderRadius: 16, padding: 20, borderWidth: 0.5, borderColor: c.border },
    supportTitle: { fontSize: 16, fontWeight: '500', marginBottom: 8 },
    supportDesc: { fontSize: 14, lineHeight: 20, marginBottom: 20 },
    kofiBtn: {
      backgroundColor: '#FF5E5B',
      borderRadius: 14, paddingVertical: 15,
      alignItems: 'center', marginBottom: 10,
    },
    kofiBtnTxt: { color: '#fff', fontSize: 16, fontWeight: '600' },
    githubBtn: { borderRadius: 14, paddingVertical: 15, alignItems: 'center', borderWidth: 0.5 },
    githubBtnTxt: { fontSize: 15, fontWeight: '500' },
  });
}
