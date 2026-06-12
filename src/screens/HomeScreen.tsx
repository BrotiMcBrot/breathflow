import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useBreathStore } from '../store/breathStore';
import { BreathTechnique, SessionSettings, Effect, EFFECT_META } from '../types';
import { getTotalSeconds } from '../utils/pathGeometry';
import { SessionSettingsModal } from '../components/SessionSettingsModal';
import { TechniqueCurvePreview } from '../components/TechniqueCurvePreview';
import { useTheme, Colors } from '../theme';
import { useT, useLang, localizeTechnique, EFFECT_LABELS, Strings } from '../i18n';

function SectionLabel({ title, color, c }: { title: string; color?: string; c: Colors }) {
  return (
    <View style={sS.row}>
      <Text style={[sS.title, { color: color ?? c.textFaint }]}>{title}</Text>
      <View style={[sS.line, { backgroundColor: color ? color + '30' : c.border }]} />
    </View>
  );
}
const sS = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10, marginBottom: 12 },
  title: { fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
  line: { flex: 1, height: 0.5 },
});

function TechniqueCard({ item, onPress, c, t, effectLabels }: {
  item: BreathTechnique; onPress: () => void; c: Colors; t: Strings; effectLabels: Record<Effect, string>;
}) {
  const totalSecs = getTotalSeconds(item.phases);
  const badgeColor = item.isProfi ? '#dc2626' : item.isAdvanced ? c.hold : c.down;
  const badgeLabel = item.isProfi ? t.expert : item.isCustom ? t.custom : item.isAdvanced ? t.advanced : null;
  const curveColor = item.isProfi ? '#dc2626' : c.accent;

  return (
    <TouchableOpacity
      style={[cS.card, { backgroundColor: c.surface, borderColor: item.isProfi ? '#dc262630' : c.border }]}
      onPress={onPress} activeOpacity={0.75}
    >
      <View style={cS.row}>
        <View style={cS.left}>
          <Text style={[cS.name, { color: c.textSec }]} numberOfLines={1}>{item.name}</Text>
          <Text style={[cS.desc, { color: c.textMuted }]} numberOfLines={2}>{item.description}</Text>
          <View style={cS.metaRow}>
            {badgeLabel && (
              <View style={[cS.badge, { backgroundColor: badgeColor + '18', borderColor: badgeColor + '45' }]}>
                <Text style={[cS.badgeTxt, { color: badgeColor }]}>{badgeLabel}</Text>
              </View>
            )}
            {(item.effects ?? []).slice(0, 2).map((e) => (
              <View key={e} style={[cS.badge, { backgroundColor: EFFECT_META[e].color + '15', borderColor: EFFECT_META[e].color + '40' }]}>
                <Text style={[cS.badgeTxt, { color: EFFECT_META[e].color }]}>
                  {EFFECT_META[e].emoji} {effectLabels[e]}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <View style={cS.right}>
          <TechniqueCurvePreview phases={item.phases} color={curveColor} ghostColor={c.trailGhost} width={92} height={52} />
          <Text style={[cS.secs, { color: c.textFaint }]}>{totalSecs}s</Text>
        </View>
      </View>
      {item.warning && (
        <Text style={[cS.warning, { color: '#dc2626' }]} numberOfLines={1}>{item.warning}</Text>
      )}
    </TouchableOpacity>
  );
}
const cS = StyleSheet.create({
  card: { borderRadius: 16, padding: 16, marginBottom: 10, borderWidth: 0.5 },
  row: { flexDirection: 'row', gap: 12 },
  left: { flex: 1 },
  right: { alignItems: 'center', justifyContent: 'center', gap: 2 },
  name: { fontSize: 17, fontWeight: '500', marginBottom: 4 },
  desc: { fontSize: 13, lineHeight: 18, marginBottom: 8 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  badge: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2.5, borderWidth: 0.5 },
  badgeTxt: { fontSize: 10.5, fontWeight: '500' },
  warning: { fontSize: 11.5, marginTop: 8, fontWeight: '500' },
  secs: { fontSize: 11 },
});

export default function HomeScreen() {
  const c = useTheme();
  const t = useT();
  const lang = useLang();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { techniques, sessions } = useBreathStore();
  const [selected, setSelected] = useState<BreathTechnique | null>(null);
  const [showWarning, setShowWarning] = useState<BreathTechnique | null>(null);
  const [filter, setFilter] = useState<Effect | 'all'>('all');

  const effectLabels = EFFECT_LABELS[lang];
  const localized = useMemo(() => techniques.map((x) => localizeTechnique(x, lang)), [techniques, lang]);

  const lastUsed = useMemo(() => {
    if (!sessions.length) return null;
    return localized.find((x) => x.id === sessions[0].techniqueId) ?? null;
  }, [sessions, localized]);

  const filtered = useMemo(() => {
    if (filter === 'all') return localized;
    return localized.filter((x) => x.effects?.includes(filter) || x.isCustom);
  }, [localized, filter]);

  const beginner = filtered.filter((x) => !x.isAdvanced && !x.isProfi);
  const advanced = filtered.filter((x) => x.isAdvanced && !x.isProfi);
  const profi = filtered.filter((x) => x.isProfi);

  const FILTERS: { key: Effect | 'all'; label: string; emoji: string }[] = [
    { key: 'all', label: t.filterAll, emoji: '✨' },
    { key: 'calming', label: t.filterCalming, emoji: '🌙' },
    { key: 'energizing', label: t.filterEnergy, emoji: '⚡' },
    { key: 'lung_training', label: t.filterLungs, emoji: '🫁' },
    { key: 'balancing', label: t.filterBalance, emoji: '⚖️' },
  ];

  type Item =
    | { type: 'header'; key: string; title: string; color?: string }
    | { type: 'technique'; key: string; item: BreathTechnique };

  const listData: Item[] = [
    ...(lastUsed && filter === 'all' ? [
      { type: 'header' as const, key: 'h_last', title: t.recentlyPracticed },
      { type: 'technique' as const, key: `last_${lastUsed.id}`, item: lastUsed },
    ] : []),
    ...(beginner.length > 0 ? [
      { type: 'header' as const, key: 'h_beg', title: t.techniques },
      ...beginner.map((x) => ({ type: 'technique' as const, key: x.id, item: x })),
    ] : []),
    ...(advanced.length > 0 ? [
      { type: 'header' as const, key: 'h_adv', title: t.advanced, color: c.hold },
      ...advanced.map((x) => ({ type: 'technique' as const, key: x.id, item: x })),
    ] : []),
    ...(profi.length > 0 ? [
      { type: 'header' as const, key: 'h_profi', title: `⚠️ ${t.expert}`, color: '#dc2626' },
      ...profi.map((x) => ({ type: 'technique' as const, key: x.id, item: x })),
    ] : []),
  ];

  const handleCardPress = (x: BreathTechnique) => {
    if (x.isProfi) setShowWarning(x);
    else setSelected(x);
  };

  const handleStart = (settings: SessionSettings) => {
    if (!selected) return;
    setSelected(null);
    const params = new URLSearchParams({
      mode: settings.mode,
      targetMinutes: String(settings.targetMinutes),
      targetSeconds: String(settings.targetSeconds),
      targetRounds: String(settings.targetRounds),
    });
    router.push(`/session/${selected.id}?${params.toString()}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.bg, paddingTop: insets.top + 8 }}>
      <View style={styles.header}>
        <Text style={[styles.logo, { color: c.text }]}>breathflow</Text>
        <TouchableOpacity onPress={() => router.push('/editor')}
          style={[styles.addBtn, { backgroundColor: c.accentBg, borderColor: c.accentBorder }]}>
          <Text style={[styles.addBtnTxt, { color: c.accent }]}>{t.newTechnique}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {FILTERS.map((f) => {
            const active = filter === f.key;
            const fColor = f.key === 'all' ? c.accent : EFFECT_META[f.key as Effect].color;
            return (
              <TouchableOpacity key={f.key}
                style={[styles.filterChip, {
                  backgroundColor: active ? fColor + '20' : c.surface,
                  borderColor: active ? fColor + '60' : c.border,
                }]}
                onPress={() => setFilter(f.key)}>
                <Text style={[styles.filterTxt, { color: active ? fColor : c.textMuted }]}>
                  {f.emoji} {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={listData}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          if (item.type === 'header') return <SectionLabel title={item.title} color={item.color} c={c} />;
          return <TechniqueCard item={item.item} onPress={() => handleCardPress(item.item)} c={c} t={t} effectLabels={effectLabels} />;
        }}
      />

      {showWarning && (
        <Modal visible transparent animationType="fade" onRequestClose={() => setShowWarning(null)}>
          <View style={wS.overlay}>
            <View style={[wS.sheet, { backgroundColor: c.surface, borderColor: '#dc262650' }]}>
              <Text style={wS.emoji}>⚠️</Text>
              <Text style={[wS.title, { color: c.text }]}>{t.expertWarningTitle}</Text>
              <Text style={[wS.name, { color: '#dc2626' }]}>{showWarning.name}</Text>
              <Text style={[wS.warning, { color: c.textSec }]}>{showWarning.warning}</Text>
              <TouchableOpacity style={wS.confirmBtn} onPress={() => { setSelected(showWarning); setShowWarning(null); }}>
                <Text style={wS.confirmTxt}>{t.understand}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[wS.cancelBtn, { backgroundColor: c.elevated, borderColor: c.border }]} onPress={() => setShowWarning(null)}>
                <Text style={[wS.cancelTxt, { color: c.textMuted }]}>{t.cancel}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {selected && (
        <SessionSettingsModal visible techniqueName={selected.name} onStart={handleStart} onCancel={() => setSelected(null)} />
      )}
    </View>
  );
}

const wS = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 24 },
  sheet: { borderRadius: 20, padding: 28, alignItems: 'center', borderWidth: 1 },
  emoji: { fontSize: 40, marginBottom: 12 },
  title: { fontSize: 13, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 },
  name: { fontSize: 20, fontWeight: '600', marginBottom: 16 },
  warning: { fontSize: 14, lineHeight: 20, textAlign: 'center', marginBottom: 24 },
  confirmBtn: { width: '100%', backgroundColor: '#dc2626', borderRadius: 12, paddingVertical: 15, alignItems: 'center', marginBottom: 10 },
  confirmTxt: { color: '#fff', fontSize: 15, fontWeight: '600' },
  cancelBtn: { width: '100%', borderRadius: 12, paddingVertical: 15, alignItems: 'center', borderWidth: 0.5 },
  cancelTxt: { fontSize: 15 },
});

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 12 },
  logo: { fontSize: 22, fontWeight: '300', letterSpacing: 2 },
  addBtn: { borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 0.5 },
  addBtnTxt: { fontSize: 14 },
  filterWrap: { marginBottom: 4 },
  filterRow: { paddingHorizontal: 20, gap: 8 },
  filterChip: { borderRadius: 99, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 0.5 },
  filterTxt: { fontSize: 13, fontWeight: '500' },
  list: { paddingHorizontal: 20, paddingBottom: 24, paddingTop: 8 },
});
