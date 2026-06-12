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

function TechniqueCard({ item, onPress, c }: { item: BreathTechnique; onPress: () => void; c: Colors }) {
  const totalSecs = getTotalSeconds(item.phases);
  const badgeColor = item.isProfi ? '#dc2626' : item.isAdvanced ? c.hold : c.down;
  const badgeLabel = item.isProfi ? 'Profi' : item.isCustom ? 'Eigene' : item.isAdvanced ? 'Fortgeschritten' : null;
  const curveColor = item.isProfi ? '#dc2626' : c.accent;

  return (
    <TouchableOpacity
      style={[cS.card, { backgroundColor: c.surface, borderColor: item.isProfi ? '#dc262630' : c.border }]}
      onPress={onPress} activeOpacity={0.75}
    >
      <View style={cS.row}>
        <View style={cS.left}>
          <View style={cS.top}>
            <Text style={[cS.name, { color: c.textSec }]} numberOfLines={1}>{item.name}</Text>
          </View>
          <Text style={[cS.desc, { color: c.textMuted }]} numberOfLines={2}>{item.description}</Text>
          <View style={cS.metaRow}>
            {badgeLabel && (
              <View style={[cS.badge, { backgroundColor: badgeColor + '18', borderColor: badgeColor + '45' }]}>
                <Text style={[cS.badgeTxt, { color: badgeColor }]}>{badgeLabel}</Text>
              </View>
            )}
            {item.effects.slice(0, 2).map((e) => (
              <View key={e} style={[cS.badge, { backgroundColor: EFFECT_META[e].color + '15', borderColor: EFFECT_META[e].color + '40' }]}>
                <Text style={[cS.badgeTxt, { color: EFFECT_META[e].color }]}>
                  {EFFECT_META[e].emoji} {EFFECT_META[e].label}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <View style={cS.right}>
          <TechniqueCurvePreview
            phases={item.phases}
            color={curveColor}
            ghostColor={c.trailGhost}
            width={92}
            height={52}
          />
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
  top: { marginBottom: 4 },
  name: { fontSize: 17, fontWeight: '500' },
  desc: { fontSize: 13, lineHeight: 18, marginBottom: 8 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  badge: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2.5, borderWidth: 0.5 },
  badgeTxt: { fontSize: 10.5, fontWeight: '500' },
  warning: { fontSize: 11.5, marginTop: 8, fontWeight: '500' },
  secs: { fontSize: 11 },
});

function ProfiWarningModal({ technique, onConfirm, onCancel, c, bottomInset }: {
  technique: BreathTechnique; onConfirm: () => void; onCancel: () => void; c: Colors; bottomInset: number;
}) {
  return (
    <Modal visible transparent animationType="fade" onRequestClose={onCancel}>
      <View style={wS.overlay}>
        <View style={[wS.sheet, { backgroundColor: c.surface, borderColor: '#dc262650' }]}>
          <Text style={wS.emoji}>⚠️</Text>
          <Text style={[wS.title, { color: c.text }]}>Profi-Technik</Text>
          <Text style={[wS.name, { color: '#dc2626' }]}>{technique.name}</Text>
          <Text style={[wS.warning, { color: c.textSec }]}>{technique.warning}</Text>
          <TouchableOpacity style={wS.confirmBtn} onPress={onConfirm}>
            <Text style={wS.confirmTxt}>Ich verstehe — Fortfahren</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[wS.cancelBtn, { backgroundColor: c.elevated, borderColor: c.border }]} onPress={onCancel}>
            <Text style={[wS.cancelTxt, { color: c.textMuted }]}>Abbrechen</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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

const FILTERS: { key: Effect | 'all'; label: string; emoji: string }[] = [
  { key: 'all', label: 'Alle', emoji: '✨' },
  { key: 'calming', label: 'Beruhigend', emoji: '🌙' },
  { key: 'energizing', label: 'Energie', emoji: '⚡' },
  { key: 'lung_training', label: 'Lungen', emoji: '🫁' },
  { key: 'balancing', label: 'Balance', emoji: '⚖️' },
];

export default function HomeScreen() {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { techniques, sessions } = useBreathStore();
  const [selected, setSelected] = useState<BreathTechnique | null>(null);
  const [showWarning, setShowWarning] = useState<BreathTechnique | null>(null);
  const [filter, setFilter] = useState<Effect | 'all'>('all');

  // last used technique
  const lastUsed = useMemo(() => {
    if (!sessions.length) return null;
    return techniques.find((t) => t.id === sessions[0].techniqueId) ?? null;
  }, [sessions, techniques]);

  const filtered = useMemo(() => {
    if (filter === 'all') return techniques;
    return techniques.filter((t) => t.effects?.includes(filter) || t.isCustom);
  }, [techniques, filter]);

  const beginner = filtered.filter((t) => !t.isAdvanced && !t.isProfi);
  const advanced = filtered.filter((t) => t.isAdvanced && !t.isProfi);
  const profi = filtered.filter((t) => t.isProfi);

  type Item =
    | { type: 'header'; key: string; title: string; color?: string }
    | { type: 'technique'; key: string; item: BreathTechnique };

  const listData: Item[] = [
    ...(lastUsed && filter === 'all' ? [
      { type: 'header' as const, key: 'h_last', title: 'Zuletzt geübt' },
      { type: 'technique' as const, key: `last_${lastUsed.id}`, item: lastUsed },
    ] : []),
    ...(beginner.length > 0 ? [
      { type: 'header' as const, key: 'h_beg', title: 'Techniken' },
      ...beginner.map((t) => ({ type: 'technique' as const, key: t.id, item: t })),
    ] : []),
    ...(advanced.length > 0 ? [
      { type: 'header' as const, key: 'h_adv', title: 'Fortgeschritten', color: c.hold },
      ...advanced.map((t) => ({ type: 'technique' as const, key: t.id, item: t })),
    ] : []),
    ...(profi.length > 0 ? [
      { type: 'header' as const, key: 'h_profi', title: '⚠️ Profi', color: '#dc2626' },
      ...profi.map((t) => ({ type: 'technique' as const, key: t.id, item: t })),
    ] : []),
  ];

  const handleCardPress = (t: BreathTechnique) => {
    if (t.isProfi) setShowWarning(t);
    else setSelected(t);
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
          <Text style={[styles.addBtnTxt, { color: c.accent }]}>+ Neu</Text>
        </TouchableOpacity>
      </View>

      {/* Effect filters */}
      <View style={styles.filterWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {FILTERS.map((f) => {
            const active = filter === f.key;
            const fColor = f.key === 'all' ? c.accent : EFFECT_META[f.key as Effect].color;
            return (
              <TouchableOpacity
                key={f.key}
                style={[
                  styles.filterChip,
                  { backgroundColor: active ? fColor + '20' : c.surface, borderColor: active ? fColor + '60' : c.border },
                ]}
                onPress={() => setFilter(f.key)}
              >
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
          return <TechniqueCard item={item.item} onPress={() => handleCardPress(item.item)} c={c} />;
        }}
      />

      {showWarning && (
        <ProfiWarningModal
          technique={showWarning} c={c} bottomInset={insets.bottom}
          onConfirm={() => { setSelected(showWarning); setShowWarning(null); }}
          onCancel={() => setShowWarning(null)}
        />
      )}
      {selected && (
        <SessionSettingsModal
          visible={true} techniqueName={selected.name}
          onStart={handleStart} onCancel={() => setSelected(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingBottom: 12,
  },
  logo: { fontSize: 22, fontWeight: '300', letterSpacing: 2 },
  addBtn: { borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 0.5 },
  addBtnTxt: { fontSize: 14 },
  filterWrap: { marginBottom: 4 },
  filterRow: { paddingHorizontal: 20, gap: 8 },
  filterChip: { borderRadius: 99, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 0.5 },
  filterTxt: { fontSize: 13, fontWeight: '500' },
  list: { paddingHorizontal: 20, paddingBottom: 24, paddingTop: 8 },
});
