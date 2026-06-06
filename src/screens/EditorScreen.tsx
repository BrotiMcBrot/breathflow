import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useBreathStore } from '../store/breathStore';
import { Phase, PhaseDirection } from '../types';

const DIRECTIONS: { label: string; value: PhaseDirection; color: string }[] = [
  { label: 'Einatmen ↑', value: 'up', color: '#378ADD' },
  { label: 'Halten →', value: 'right', color: '#EF9F27' },
  { label: 'Ausatmen ↓', value: 'down', color: '#1D9E75' },
];

function PhaseRow({
  phase,
  index,
  onChange,
  onDelete,
}: {
  phase: Phase;
  index: number;
  onChange: (i: number, p: Phase) => void;
  onDelete: (i: number) => void;
}) {
  const dir = DIRECTIONS.find((d) => d.value === phase.direction)!;

  return (
    <View style={styles.phaseRow}>
      <View style={styles.phaseIndex}>
        <Text style={styles.phaseIndexTxt}>{index + 1}</Text>
      </View>

      <View style={styles.dirBtns}>
        {DIRECTIONS.map((d) => (
          <TouchableOpacity
            key={d.value}
            style={[styles.dirBtn, phase.direction === d.value && { borderColor: d.color + '80', backgroundColor: d.color + '15' }]}
            onPress={() => onChange(index, { ...phase, direction: d.value, label: d.label.split(' ')[0] })}
          >
            <Text style={[styles.dirBtnTxt, phase.direction === d.value && { color: d.color }]}>
              {d.label.split(' ')[1]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.secsWrap}>
        <TouchableOpacity
          style={styles.secsBtn}
          onPress={() => onChange(index, { ...phase, seconds: Math.max(1, phase.seconds - 1) })}
        >
          <Text style={styles.secsBtnTxt}>−</Text>
        </TouchableOpacity>
        <Text style={styles.secsVal}>{phase.seconds}s</Text>
        <TouchableOpacity
          style={styles.secsBtn}
          onPress={() => onChange(index, { ...phase, seconds: Math.min(60, phase.seconds + 1) })}
        >
          <Text style={styles.secsBtnTxt}>+</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.phaseDirLbl, { color: dir.color }]}>{phase.label}</Text>

      <TouchableOpacity onPress={() => onDelete(index)} style={styles.deleteBtn}>
        <Text style={styles.deleteTxt}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function EditorScreen() {
  const router = useRouter();
  const { addCustomTechnique } = useBreathStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [phases, setPhases] = useState<Phase[]>([
    { label: 'Einatmen', seconds: 4, direction: 'up' },
    { label: 'Halten', seconds: 4, direction: 'right' },
    { label: 'Ausatmen', seconds: 4, direction: 'down' },
  ]);

  const handleChange = (i: number, p: Phase) => {
    setPhases((prev) => prev.map((x, idx) => (idx === i ? p : x)));
  };

  const handleDelete = (i: number) => {
    if (phases.length <= 1) return;
    setPhases((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleAdd = () => {
    setPhases((prev) => [...prev, { label: 'Einatmen', seconds: 4, direction: 'up' }]);
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Name fehlt', 'Gib der Technik einen Namen.');
      return;
    }
    if (phases.length < 1) {
      Alert.alert('Keine Phasen', 'Füge mindestens eine Phase hinzu.');
      return;
    }
    addCustomTechnique({
      id: `custom_${Date.now()}`,
      name: name.trim(),
      description: description.trim() || 'Eigene Technik',
      phases,
      isCustom: true,
    });
    router.back();
  };

  const totalSecs = phases.reduce((a, p) => a + p.seconds, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backTxt}>← Zurück</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Neue Technik</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
          <Text style={styles.saveTxt}>Speichern</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TextInput
          style={styles.nameInput}
          placeholder="Name der Technik"
          placeholderTextColor="#333"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.descInput}
          placeholder="Kurze Beschreibung (optional)"
          placeholderTextColor="#333"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Text style={styles.sectionLabel}>Phasen · {totalSecs}s / Runde</Text>

        {phases.map((p, i) => (
          <PhaseRow key={i} phase={p} index={i} onChange={handleChange} onDelete={handleDelete} />
        ))}

        <TouchableOpacity style={styles.addPhaseBtn} onPress={handleAdd}>
          <Text style={styles.addPhaseTxt}>+ Phase hinzufügen</Text>
        </TouchableOpacity>

        <View style={styles.preview}>
          <Text style={styles.previewLabel}>Vorschau</Text>
          <View style={styles.previewPills}>
            {phases.map((p, i) => {
              const dir = DIRECTIONS.find((d) => d.value === p.direction)!;
              return (
                <View key={i} style={[styles.previewPill, { backgroundColor: dir.color + '18', borderColor: dir.color + '40' }]}>
                  <Text style={[styles.previewPillTxt, { color: dir.color }]}>
                    {p.label} {p.seconds}s
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#1a1a2e',
  },
  backBtn: { padding: 4 },
  backTxt: { color: '#446', fontSize: 14 },
  headerTitle: { color: '#ddd', fontSize: 16, fontWeight: '500' },
  saveBtn: {
    backgroundColor: '#185FA520',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 0.5,
    borderColor: '#185FA550',
  },
  saveTxt: { color: '#378ADD', fontSize: 14, fontWeight: '500' },
  scroll: { padding: 24, paddingBottom: 60 },
  nameInput: {
    backgroundColor: '#0f0f1a',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 20,
    borderWidth: 0.5,
    borderColor: '#1a1a2e',
    marginBottom: 12,
  },
  descInput: {
    backgroundColor: '#0f0f1a',
    borderRadius: 12,
    padding: 16,
    color: '#aaa',
    fontSize: 15,
    borderWidth: 0.5,
    borderColor: '#1a1a2e',
    marginBottom: 24,
    minHeight: 60,
  },
  sectionLabel: { color: '#446', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 },
  phaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0f0f1a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 0.5,
    borderColor: '#1a1a2e',
  },
  phaseIndex: { width: 24, alignItems: 'center' },
  phaseIndexTxt: { color: '#333', fontSize: 13 },
  dirBtns: { flexDirection: 'row', gap: 4 },
  dirBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#1a1a2e',
  },
  dirBtnTxt: { fontSize: 16, color: '#334' },
  secsWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  secsBtn: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  secsBtnTxt: { color: '#446', fontSize: 20, lineHeight: 24 },
  secsVal: { color: '#ddd', fontSize: 15, fontWeight: '500', minWidth: 32, textAlign: 'center', fontVariant: ['tabular-nums'] },
  phaseDirLbl: { flex: 1, fontSize: 13 },
  deleteBtn: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  deleteTxt: { color: '#333', fontSize: 14 },
  addPhaseBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#1a1a2e',
    borderStyle: 'dashed',
    marginTop: 4,
    marginBottom: 32,
  },
  addPhaseTxt: { color: '#446', fontSize: 15 },
  preview: { backgroundColor: '#0f0f1a', borderRadius: 12, padding: 16, borderWidth: 0.5, borderColor: '#1a1a2e' },
  previewLabel: { color: '#334', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 },
  previewPills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  previewPill: { borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 0.5 },
  previewPillTxt: { fontSize: 12, fontWeight: '500' },
});
