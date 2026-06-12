import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useBreathStore } from '../store/breathStore';
import { Phase, PhaseDirection } from '../types';
import { useTheme } from '../theme';
import { useT } from '../i18n';

export default function EditorScreen() {
  const router = useRouter();
  const c = useTheme();
  const t = useT();
  const insets = useSafeAreaInsets();
  const { addCustomTechnique } = useBreathStore();

  const DIRECTIONS: { label: string; arrow: string; value: PhaseDirection; color: string }[] = [
    { label: t.inhale, arrow: '↑', value: 'up', color: c.up },
    { label: t.hold, arrow: '→', value: 'right', color: c.hold },
    { label: t.exhale, arrow: '↓', value: 'down', color: c.down },
  ];

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [phases, setPhases] = useState<Phase[]>([
    { label: t.inhale, seconds: 4, direction: 'up' },
    { label: t.hold, seconds: 4, direction: 'right' },
    { label: t.exhale, seconds: 4, direction: 'down' },
  ]);

  const handleChange = (i: number, p: Phase) =>
    setPhases((prev) => prev.map((x, idx) => (idx === i ? p : x)));
  const handleDelete = (i: number) => {
    if (phases.length <= 1) return;
    setPhases((prev) => prev.filter((_, idx) => idx !== i));
  };
  const handleAdd = () =>
    setPhases((prev) => [...prev, { label: t.inhale, seconds: 4, direction: 'up' }]);

  const handleSave = () => {
    if (!name.trim()) { Alert.alert(t.nameMissing, t.nameMissingMsg); return; }
    addCustomTechnique({
      id: `custom_${Date.now()}`,
      name: name.trim(),
      description: description.trim() || t.customTechnique,
      phases,
      effects: [],
      isCustom: true,
    });
    router.back();
  };

  const totalSecs = phases.reduce((a, p) => a + p.seconds, 0);

  return (
    <View style={{ flex: 1, backgroundColor: c.bg, paddingTop: insets.top + 8 }}>
      <View style={[s.header, { borderBottomColor: c.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Text style={{ color: c.textMuted, fontSize: 14 }}>{t.back}</Text>
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: c.textSec }]}>{t.newTechniqueTitle}</Text>
        <TouchableOpacity onPress={handleSave}
          style={[s.saveBtn, { backgroundColor: c.accentBg, borderColor: c.accentBorder }]}>
          <Text style={{ color: c.accent, fontSize: 14, fontWeight: '500' }}>{t.save}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 40 }]} showsVerticalScrollIndicator={false}>
        <TextInput
          style={[s.nameInput, { backgroundColor: c.surface, borderColor: c.border, color: c.text }]}
          placeholder={t.techniqueName} placeholderTextColor={c.textFaint}
          value={name} onChangeText={setName}
        />
        <TextInput
          style={[s.descInput, { backgroundColor: c.surface, borderColor: c.border, color: c.textSec }]}
          placeholder={t.techniqueDesc} placeholderTextColor={c.textFaint}
          value={description} onChangeText={setDescription} multiline
        />

        <Text style={[s.sectionLabel, { color: c.textFaint }]}>{t.phases} · {totalSecs}{t.perRoundLabel}</Text>

        {phases.map((p, i) => {
          const dir = DIRECTIONS.find((d) => d.value === p.direction)!;
          return (
            <View key={i} style={[s.phaseRow, { backgroundColor: c.surface, borderColor: c.border }]}>
              <Text style={[s.phaseIdx, { color: c.textFaint }]}>{i + 1}</Text>
              <View style={s.dirBtns}>
                {DIRECTIONS.map((d) => (
                  <TouchableOpacity key={d.value}
                    style={[s.dirBtn, { borderColor: c.border },
                      p.direction === d.value && { borderColor: d.color + '80', backgroundColor: d.color + '15' }]}
                    onPress={() => handleChange(i, { ...p, direction: d.value, label: d.label })}>
                    <Text style={[s.dirBtnTxt, { color: p.direction === d.value ? d.color : c.textFaint }]}>{d.arrow}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={s.secsWrap}>
                <TouchableOpacity style={s.secsBtn} onPress={() => handleChange(i, { ...p, seconds: Math.max(1, p.seconds - 1) })}>
                  <Text style={[s.secsBtnTxt, { color: c.textMuted }]}>−</Text>
                </TouchableOpacity>
                <Text style={[s.secsVal, { color: c.text }]}>{p.seconds}s</Text>
                <TouchableOpacity style={s.secsBtn} onPress={() => handleChange(i, { ...p, seconds: Math.min(90, p.seconds + 1) })}>
                  <Text style={[s.secsBtnTxt, { color: c.textMuted }]}>+</Text>
                </TouchableOpacity>
              </View>
              <Text style={[s.phaseLbl, { color: dir.color }]} numberOfLines={1}>{p.label}</Text>
              <TouchableOpacity onPress={() => handleDelete(i)} style={s.delBtn}>
                <Text style={{ color: c.textFaint, fontSize: 14 }}>✕</Text>
              </TouchableOpacity>
            </View>
          );
        })}

        <TouchableOpacity style={[s.addBtn, { borderColor: c.border }]} onPress={handleAdd}>
          <Text style={{ color: c.textMuted, fontSize: 15 }}>{t.addPhase}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingBottom: 12, borderBottomWidth: 0.5,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 16, fontWeight: '500' },
  saveBtn: { borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 0.5 },
  scroll: { padding: 20 },
  nameInput: { borderRadius: 12, padding: 16, fontSize: 20, borderWidth: 0.5, marginBottom: 12 },
  descInput: { borderRadius: 12, padding: 16, fontSize: 15, borderWidth: 0.5, marginBottom: 24, minHeight: 60 },
  sectionLabel: { fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 },
  phaseRow: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 0.5 },
  phaseIdx: { width: 20, textAlign: 'center', fontSize: 13 },
  dirBtns: { flexDirection: 'row', gap: 4 },
  dirBtn: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 0.5 },
  dirBtnTxt: { fontSize: 16 },
  secsWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  secsBtn: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  secsBtnTxt: { fontSize: 20, lineHeight: 24 },
  secsVal: { fontSize: 15, fontWeight: '500', minWidth: 34, textAlign: 'center', fontVariant: ['tabular-nums'] },
  phaseLbl: { flex: 1, fontSize: 13 },
  delBtn: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  addBtn: { borderRadius: 12, paddingVertical: 14, alignItems: 'center', borderWidth: 0.5, borderStyle: 'dashed', marginTop: 4 },
});
