import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  TextInput, ScrollView, Linking, Alert, Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSettingsStore, SoundType } from '../store/settingsStore';
import { useTheme, Colors } from '../theme';
import { useT } from '../i18n';
import { ensureNotificationPermissions, scheduleReminder, cancelReminder, ReminderSlot } from '../utils/notifications';

const SOUND_OPTIONS: SoundType[] = ['none', 'gong', 'bell', 'bowl'];
const KOFI_URL = 'https://ko-fi.com/brotimcbrot';
const LIBERAPAY_URL = 'https://liberapay.com/BrotiMcBrot/donate';
const GITHUB_URL = 'https://github.com/BrotiMcBrot/breathflow';

function Row({ label, children, c, last }: { label: string; children: React.ReactNode; c: Colors; last?: boolean }) {
  return (
    <View style={[rS.row, !last && { borderBottomWidth: 0.5, borderBottomColor: c.border }]}>
      <Text style={[rS.label, { color: c.textMuted }]}>{label}</Text>
      <View style={rS.right}>{children}</View>
    </View>
  );
}
const rS = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14 },
  label: { fontSize: 15, flex: 1, paddingRight: 12 },
  right: { alignItems: 'flex-end' },
});

export default function SettingsScreen() {
  const c = useTheme();
  const t = useT();
  const insets = useSafeAreaInsets();
  const {
    theme, setTheme, language, setLanguage, soundType, setSoundType,
    spotifyUri, setSpotifyUri, spotifyEnabled, setSpotifyEnabled,
    introOutroEnabled, setIntroOutroEnabled, hapticsEnabled, setHapticsEnabled,
    reminderMorning, reminderNoon, reminderEvening, setReminder,
  } = useSettingsStore();
  const [spotifyInput, setSpotifyInput] = useState(spotifyUri);
  const [spotifyOpen, setSpotifyOpen] = useState(false);
  const s = makeStyles(c);

  const soundLabels: Record<SoundType, string> = {
    none: t.soundNone, gong: t.soundGong, bell: t.soundBell, bowl: t.soundBowl,
  };

  const toggleReminder = async (slot: ReminderSlot, value: boolean) => {
    if (value) {
      const ok = await ensureNotificationPermissions();
      if (!ok) { Alert.alert(t.notifPermission, t.notifPermissionMsg); return; }
      await scheduleReminder(slot, t.reminderTitle, t.reminderBody);
    } else {
      await cancelReminder(slot);
    }
    setReminder(slot, value);
  };

  const openSpotify = () => {
    Linking.openURL(spotifyUri || 'spotify:').catch(() =>
      Alert.alert(t.spotifyNotFound, t.spotifyInstall)
    );
  };

  return (
    <View style={[s.container, { paddingTop: insets.top + 8 }]}>
      <View style={s.header}>
        <Text style={s.title}>{t.settings}</Text>
      </View>

      <ScrollView contentContainerStyle={[s.scroll, { paddingBottom: 32 }]} showsVerticalScrollIndicator={false}>

        {/* LANGUAGE */}
        <Text style={s.section}>{t.language}</Text>
        <View style={s.card}>
          <Row label={t.language} c={c} last>
            <View style={s.toggleRow}>
              <TouchableOpacity style={[s.toggleBtn, language === 'de' && s.toggleBtnActive]} onPress={() => setLanguage('de')}>
                <Text style={[s.toggleTxt, language === 'de' && s.toggleTxtActive]}>🇩🇪 Deutsch</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.toggleBtn, language === 'en' && s.toggleBtnActive]} onPress={() => setLanguage('en')}>
                <Text style={[s.toggleTxt, language === 'en' && s.toggleTxtActive]}>🇬🇧 English</Text>
              </TouchableOpacity>
            </View>
          </Row>
        </View>

        {/* SESSION */}
        <Text style={s.section}>{t.session}</Text>
        <View style={s.card}>
          <Row label={t.introOutro} c={c}>
            <Switch value={introOutroEnabled} onValueChange={setIntroOutroEnabled}
              trackColor={{ false: c.border, true: c.accent }} thumbColor={c.surface} />
          </Row>
          <Row label={t.haptics} c={c} last>
            <Switch value={hapticsEnabled} onValueChange={setHapticsEnabled}
              trackColor={{ false: c.border, true: c.accent }} thumbColor={c.surface} />
          </Row>
        </View>

        {/* REMINDERS */}
        <Text style={s.section}>{t.reminders}</Text>
        <View style={s.card}>
          <Row label={t.reminderMorning} c={c}>
            <Switch value={reminderMorning} onValueChange={(v) => toggleReminder('morning', v)}
              trackColor={{ false: c.border, true: c.accent }} thumbColor={c.surface} />
          </Row>
          <Row label={t.reminderNoon} c={c}>
            <Switch value={reminderNoon} onValueChange={(v) => toggleReminder('noon', v)}
              trackColor={{ false: c.border, true: c.accent }} thumbColor={c.surface} />
          </Row>
          <Row label={t.reminderEvening} c={c} last>
            <Switch value={reminderEvening} onValueChange={(v) => toggleReminder('evening', v)}
              trackColor={{ false: c.border, true: c.accent }} thumbColor={c.surface} />
          </Row>
        </View>

        {/* APPEARANCE */}
        <Text style={s.section}>{t.appearance}</Text>
        <View style={s.card}>
          <Row label={t.design} c={c} last>
            <View style={s.toggleRow}>
              <TouchableOpacity style={[s.toggleBtn, theme === 'dark' && s.toggleBtnActive]} onPress={() => setTheme('dark')}>
                <Text style={[s.toggleTxt, theme === 'dark' && s.toggleTxtActive]}>{t.dark}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.toggleBtn, theme === 'light' && s.toggleBtnActive]} onPress={() => setTheme('light')}>
                <Text style={[s.toggleTxt, theme === 'light' && s.toggleTxtActive]}>{t.light}</Text>
              </TouchableOpacity>
            </View>
          </Row>
        </View>

        {/* SOUND */}
        <Text style={s.section}>{t.sound}</Text>
        <View style={s.card}>
          {SOUND_OPTIONS.map((opt, i) => (
            <TouchableOpacity key={opt}
              style={[s.soundRow, i < SOUND_OPTIONS.length - 1 && { borderBottomWidth: 0.5, borderBottomColor: c.border }]}
              onPress={() => setSoundType(opt)}>
              <Text style={[s.soundLabel, { color: c.text }]}>{soundLabels[opt]}</Text>
              <View style={[s.radio, soundType === opt && { borderColor: c.accent }]}>
                {soundType === opt && <View style={[s.radioDot, { backgroundColor: c.accent }]} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* MUSIC (collapsed) */}
        <Text style={s.section}>{t.music}</Text>
        <View style={s.card}>
          <TouchableOpacity style={s.collapseHead} onPress={() => setSpotifyOpen((v) => !v)}>
            <Text style={[s.collapseTitle, { color: c.text }]}>🎵 Spotify</Text>
            <Text style={{ color: c.textFaint, fontSize: 16 }}>{spotifyOpen ? '▾' : '▸'}</Text>
          </TouchableOpacity>
          {spotifyOpen && (
            <>
              <Row label={t.spotifyOnStart} c={c}>
                <Switch value={spotifyEnabled} onValueChange={setSpotifyEnabled}
                  trackColor={{ false: c.border, true: c.accent }} thumbColor={c.surface} />
              </Row>
              <View style={[s.spotifyUriWrap, { borderBottomColor: c.border }]}>
                <Text style={[s.spotifyUriLabel, { color: c.textMuted }]}>Spotify URI</Text>
                <TextInput
                  style={[s.spotifyInput, { color: c.text, borderColor: c.border, backgroundColor: c.elevated }]}
                  value={spotifyInput} onChangeText={setSpotifyInput}
                  onBlur={() => setSpotifyUri(spotifyInput.trim())}
                  placeholder="spotify:playlist:..." placeholderTextColor={c.textFaint}
                  autoCapitalize="none" autoCorrect={false}
                />
                <Text style={[s.spotifyHint, { color: c.textFaint }]}>{t.spotifyHint}</Text>
              </View>
              <TouchableOpacity style={[s.spotifyBtn, { backgroundColor: '#1DB954' }]} onPress={openSpotify}>
                <Text style={s.spotifyBtnTxt}>{t.openSpotify}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* SUPPORT */}
        <Text style={s.section}>{t.support}</Text>
        <View style={s.supportCard}>
          <Text style={[s.supportTitle, { color: c.text }]}>{t.supportTitle}</Text>
          <Text style={[s.supportDesc, { color: c.textMuted }]}>{t.supportDesc}</Text>
          <TouchableOpacity style={s.kofiBtn} onPress={() => Linking.openURL(KOFI_URL)} activeOpacity={0.85}>
            <Text style={s.kofiBtnTxt}>{t.kofiBtn}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.liberapayBtn} onPress={() => Linking.openURL(LIBERAPAY_URL)} activeOpacity={0.85}>
            <Text style={s.liberapayBtnTxt}>{t.liberapayBtn}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.githubBtn, { backgroundColor: c.elevated, borderColor: c.border }]}
            onPress={() => Linking.openURL(GITHUB_URL)} activeOpacity={0.85}>
            <Text style={[s.githubBtnTxt, { color: c.textSec }]}>{t.githubBtn}</Text>
          </TouchableOpacity>
        </View>

        {/* APP */}
        <Text style={s.section}>{t.app}</Text>
        <View style={s.card}>
          <Row label={t.version} c={c}>
            <Text style={[rS.label, { color: c.textFaint }]}>1.3.0</Text>
          </Row>
          <Row label={t.openSource} c={c}>
            <TouchableOpacity onPress={() => Linking.openURL(GITHUB_URL)}>
              <Text style={[rS.label, { color: c.accent }]}>GitHub ↗</Text>
            </TouchableOpacity>
          </Row>
          <Row label={t.contribute} c={c} last>
            <TouchableOpacity onPress={() => Linking.openURL(`${GITHUB_URL}/blob/main/CONTRIBUTING.md`)}>
              <Text style={[rS.label, { color: c.accent }]}>{t.more}</Text>
            </TouchableOpacity>
          </Row>
        </View>
      </ScrollView>
    </View>
  );
}

function makeStyles(c: Colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    header: { paddingHorizontal: 20, paddingBottom: 14 },
    title: { color: c.text, fontSize: 22, fontWeight: '300', letterSpacing: 2 },
    scroll: { paddingHorizontal: 20 },
    section: { color: c.textFaint, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', marginTop: 24, marginBottom: 8 },
    card: { backgroundColor: c.surface, borderRadius: 16, paddingHorizontal: 16, borderWidth: 0.5, borderColor: c.border },
    toggleRow: { flexDirection: 'row', gap: 8 },
    toggleBtn: { paddingHorizontal: 13, paddingVertical: 8, borderRadius: 10, borderWidth: 0.5, borderColor: c.border, backgroundColor: c.elevated },
    toggleBtnActive: { backgroundColor: c.accentBg, borderColor: c.accentBorder },
    toggleTxt: { color: c.textMuted, fontSize: 14 },
    toggleTxtActive: { color: c.accent, fontWeight: '500' },
    soundRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14 },
    soundLabel: { fontSize: 15 },
    radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: c.border, alignItems: 'center', justifyContent: 'center' },
    radioDot: { width: 10, height: 10, borderRadius: 5 },
    spotifyUriWrap: { paddingVertical: 14, borderBottomWidth: 0.5 },
    spotifyUriLabel: { fontSize: 13, marginBottom: 8 },
    spotifyInput: { borderWidth: 0.5, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, marginBottom: 6 },
    spotifyHint: { fontSize: 11 },
    spotifyBtn: { borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginVertical: 14 },
    spotifyBtnTxt: { color: '#fff', fontSize: 16, fontWeight: '600' },
    supportCard: { backgroundColor: c.surface, borderRadius: 16, padding: 20, borderWidth: 0.5, borderColor: c.border },
    supportTitle: { fontSize: 16, fontWeight: '500', marginBottom: 6 },
    supportDesc: { fontSize: 14, lineHeight: 20, marginBottom: 18 },
    kofiBtn: { backgroundColor: '#FF5E5B', borderRadius: 14, paddingVertical: 15, alignItems: 'center', marginBottom: 10 },
    liberapayBtn: { backgroundColor: '#F6C915', borderRadius: 14, paddingVertical: 15, alignItems: 'center', marginBottom: 10 },
    liberapayBtnTxt: { color: '#1a1a1a', fontSize: 16, fontWeight: '600' },
    collapseHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 15 },
    collapseTitle: { fontSize: 15, fontWeight: '500' },
    kofiBtnTxt: { color: '#fff', fontSize: 16, fontWeight: '600' },
    githubBtn: { borderRadius: 14, paddingVertical: 15, alignItems: 'center', borderWidth: 0.5 },
    githubBtnTxt: { fontSize: 15, fontWeight: '500' },
  });
}
