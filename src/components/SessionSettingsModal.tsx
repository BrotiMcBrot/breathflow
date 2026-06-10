import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { SessionSettings } from '../types';

interface Props {
  visible: boolean;
  techniqueName: string;
  onStart: (settings: SessionSettings) => void;
  onCancel: () => void;
}

export function SessionSettingsModal({ visible, techniqueName, onStart, onCancel }: Props) {
  const [mode, setMode] = useState<'time' | 'rounds'>('time');
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [rounds, setRounds] = useState(5);

  const handleStart = () => {
    onStart({ mode, targetMinutes: minutes, targetSeconds: seconds, targetRounds: rounds });
  };

  const totalSecs = minutes * 60 + seconds;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>

          <View style={styles.handle} />

          <Text style={styles.techName}>{techniqueName}</Text>
          <Text style={styles.subtitle}>Wie lange möchtest du atmen?</Text>

          {/* Mode toggle */}
          <View style={styles.modeRow}>
            <TouchableOpacity
              style={[styles.modeBtn, mode === 'time' && styles.modeBtnActive]}
              onPress={() => setMode('time')}
            >
              <Text style={[styles.modeBtnTxt, mode === 'time' && styles.modeBtnTxtActive]}>
                ⏱ Zeit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeBtn, mode === 'rounds' && styles.modeBtnActive]}
              onPress={() => setMode('rounds')}
            >
              <Text style={[styles.modeBtnTxt, mode === 'rounds' && styles.modeBtnTxtActive]}>
                🔄 Zyklen
              </Text>
            </TouchableOpacity>
          </View>

          {mode === 'time' ? (
            <View style={styles.pickerWrap}>
              {/* Minutes */}
              <View style={styles.pickerCol}>
                <TouchableOpacity style={styles.stepBtn} onPress={() => setMinutes((m) => Math.min(60, m + 1))}>
                  <Text style={styles.stepBtnTxt}>+</Text>
                </TouchableOpacity>
                <Text style={styles.pickerVal}>{String(minutes).padStart(2, '0')}</Text>
                <TouchableOpacity style={styles.stepBtn} onPress={() => setMinutes((m) => Math.max(0, m - 1))}>
                  <Text style={styles.stepBtnTxt}>−</Text>
                </TouchableOpacity>
                <Text style={styles.pickerLbl}>min</Text>
              </View>

              <Text style={styles.pickerSep}>:</Text>

              {/* Seconds */}
              <View style={styles.pickerCol}>
                <TouchableOpacity style={styles.stepBtn} onPress={() => setSeconds((s) => s >= 50 ? 0 : s + 10)}>
                  <Text style={styles.stepBtnTxt}>+</Text>
                </TouchableOpacity>
                <Text style={styles.pickerVal}>{String(seconds).padStart(2, '0')}</Text>
                <TouchableOpacity style={styles.stepBtn} onPress={() => setSeconds((s) => s <= 0 ? 50 : s - 10)}>
                  <Text style={styles.stepBtnTxt}>−</Text>
                </TouchableOpacity>
                <Text style={styles.pickerLbl}>sek</Text>
              </View>
            </View>
          ) : (
            <View style={styles.pickerWrap}>
              <View style={styles.pickerCol}>
                <TouchableOpacity style={styles.stepBtn} onPress={() => setRounds((r) => Math.min(100, r + 1))}>
                  <Text style={styles.stepBtnTxt}>+</Text>
                </TouchableOpacity>
                <Text style={styles.pickerVal}>{rounds}</Text>
                <TouchableOpacity style={styles.stepBtn} onPress={() => setRounds((r) => Math.max(1, r - 1))}>
                  <Text style={styles.stepBtnTxt}>−</Text>
                </TouchableOpacity>
                <Text style={styles.pickerLbl}>Zyklen</Text>
              </View>
            </View>
          )}

          {mode === 'time' && totalSecs === 0 && (
            <Text style={styles.hint}>Mindestens 10 Sekunden wählen</Text>
          )}

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelTxt}>Abbrechen</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.startBtn, mode === 'time' && totalSecs < 10 && styles.startBtnDisabled]}
              onPress={handleStart}
              disabled={mode === 'time' && totalSecs < 10}
            >
              <Text style={styles.startTxt}>▶  Los</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#0f0f1a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 28,
    paddingBottom: 48,
    borderTopWidth: 0.5,
    borderColor: '#1a1a2e',
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#2a2a3a',
    borderRadius: 2,
    marginBottom: 24,
  },
  techName: { color: '#fff', fontSize: 20, fontWeight: '500', marginBottom: 4 },
  subtitle: { color: '#446', fontSize: 14, marginBottom: 24 },
  modeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 32,
    backgroundColor: '#0a0a0f',
    borderRadius: 12,
    padding: 4,
  },
  modeBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  modeBtnActive: { backgroundColor: '#185FA5' },
  modeBtnTxt: { color: '#446', fontSize: 15 },
  modeBtnTxtActive: { color: '#fff', fontWeight: '500' },
  pickerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 32,
  },
  pickerCol: { alignItems: 'center', gap: 8 },
  stepBtn: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnTxt: { color: '#aaa', fontSize: 28, lineHeight: 32 },
  pickerVal: { color: '#fff', fontSize: 48, fontWeight: '200', fontVariant: ['tabular-nums'], lineHeight: 56 },
  pickerLbl: { color: '#446', fontSize: 12 },
  pickerSep: { color: '#446', fontSize: 40, fontWeight: '200', marginBottom: 20 },
  hint: { color: '#663', fontSize: 13, marginBottom: 16, marginTop: -16 },
  btnRow: { flexDirection: 'row', gap: 12, width: '100%' },
  cancelBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  cancelTxt: { color: '#446', fontSize: 16 },
  startBtn: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: '#185FA5',
  },
  startBtnDisabled: { backgroundColor: '#185FA540' },
  startTxt: { color: '#fff', fontSize: 18, fontWeight: '500' },
});
