import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useBreathStore } from '../store/breathStore';
import { BreathTechnique, SessionSettings } from '../types';
import { getTotalSeconds } from '../utils/pathGeometry';
import { SessionSettingsModal } from '../components/SessionSettingsModal';
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
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8, marginBottom: 12 },
  title: { fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
  line: { flex: 1, height: 0.5 },
});

function TechniqueCard({ item, onPress, c }: { item: BreathTechnique; onPress: () => void; c: Colors }) {
  const totalSecs = getTotalSeconds(item.phases);
  const badgeColor = item.isProfi ? '#dc2626' : item.isAdvanced ? c.hold : c.down;
  const badgeLabel = item.isProfi ? 'Profi' : item.isCustom ? 'Eigene' : item.isAdvanced ? 'Fortgeschritten' : null;

  return (
    <TouchableOpacity
      style={[cS.card, { backgroundColor: c.surface, borderColor: item.isProfi ? '#dc262630' : c.border }]}
      onPress={onPress} activeOpacity={0.75}
    >
      <View style={cS.top}>
        <Text style={[cS.name, { color: c.textSec }]}>{item.name}</Text>
        {badgeLabel && (
          <View style={[cS.badge, { backgroundColor: badgeColor + '20', borderColor: badgeColor + '50' }]}>
            <Text style={[cS.badgeTxt, { color: badgeColor }]}>{badgeLabel}</Text>
          </View>
        )}
      </View>
      <Text style={[cS.desc, { color: c.textMuted }]} numberOfLines={2}>{item.description}</Text>
      {item.warning && (
        <Text style={[cS.warning, { color: '#dc2626' }]} numberOfLines={2}>{item.warning}</Text>
      )}
      <View style={cS.pills}>
        {item.phases.slice(0, 5).map((p, i) => {
          const col = p.direction === 'up' ? c.up : p.direction === 'right' ? c.hold : c.down;
          return (
            <View key={i} style={[cS.pill, { borderColor: col + '60', backgroundColor: col + '18' }]}>
              <Text style={[cS.pillTxt, { color: col }]}>{p.label} {p.seconds}s</Text>
            </View>
          );
        })}
        {item.phases.length > 5 && (
          <View style={[cS.morePill, { borderColor: c.border }]}>
            <Text style={[cS.moreTxt, { color: c.textFaint }]}>+{item.phases.length - 5}</Text>
          </View>
        )}
      </View>
      <Text style={[cS.secs, { color: c.textFaint }]}>{totalSecs}s / Runde</Text>
    </TouchableOpacity>
  );
}
const cS = StyleSheet.create({
  card: { borderRadius: 16, padding: 18, marginBottom: 12, borderWidth: 0.5 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' },
  name: { fontSize: 18, fontWeight: '500', flex: 1 },
  badge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, borderWidth: 0.5 },
  badgeTxt: { fontSize: 11, fontWeight: '500' },
  desc: { fontSize: 14, lineHeight: 20, marginBottom: 8 },
  warning: { fontSize: 12, lineHeight: 16, marginBottom: 8, fontWeight: '500' },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  pill: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 0.5 },
  pillTxt: { fontSize: 11, fontWeight: '500' },
  morePill: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 0.5 },
  moreTxt: { fontSize: 11 },
  secs: { fontSize: 12 },
});

// Warning confirm modal for Profi techniques
function ProfiWarningModal({ technique, onConfirm, onCancel, c }: {
  technique: BreathTechnique; onConfirm: () => void; onCancel: () => void; c: Colors;
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

export default function HomeScreen() {
  const c = useTheme();
  const router = useRouter();
  const { techniques } = useBreathStore();
  const [selected, setSelected] = useState<BreathTechnique | null>(null);
  const [showWarning, setShowWarning] = useState<BreathTechnique | null>(null);

  const beginner = techniques.filter((t) => !t.isAdvanced && !t.isProfi);
  const advanced = techniques.filter((t) => t.isAdvanced && !t.isProfi);
  const profi = techniques.filter((t) => t.isProfi);

  type Item =
    | { type: 'header'; key: string; title: string; color?: string }
    | { type: 'technique'; key: string; item: BreathTechnique };

  const listData: Item[] = [
    ...beginner.map((t) => ({ type: 'technique' as const, key: t.id, item: t })),
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
    if (t.isProfi) {
      setShowWarning(t);
    } else {
      setSelected(t);
    }
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
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={[styles.header]}>
        <Text style={[styles.logo, { color: c.text }]}>breathflow</Text>
        <TouchableOpacity onPress={() => router.push('/editor')}
          style={[styles.addBtn, { backgroundColor: c.accentBg, borderColor: c.accentBorder }]}>
          <Text style={[styles.addBtnTxt, { color: c.accent }]}>+ Neue Technik</Text>
        </TouchableOpacity>
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
          technique={showWarning}
          c={c}
          onConfirm={() => { setSelected(showWarning); setShowWarning(null); }}
          onCancel={() => setShowWarning(null)}
        />
      )}

      {selected && (
        <SessionSettingsModal
          visible={true}
          techniqueName={selected.name}
          onStart={handleStart}
          onCancel={() => setSelected(null)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16 },
  logo: { fontSize: 22, fontWeight: '300', letterSpacing: 2 },
  addBtn: { borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 0.5 },
  addBtnTxt: { fontSize: 14 },
  list: { paddingHorizontal: 24, paddingBottom: 40, paddingTop: 12 },
});
