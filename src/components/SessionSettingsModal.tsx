import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SessionSettings } from '../types';
import { useTheme } from '../theme';
import { useT } from '../i18n';

interface Props {
  visible: boolean;
  techniqueName: string;
  onStart: (settings: SessionSettings) => void;
  onCancel: () => void;
}

export function SessionSettingsModal({ visible, techniqueName, onStart, onCancel }: Props) {
  const c = useTheme();
  const t = useT();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<'time' | 'rounds'>('time');
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [rounds, setRounds] = useState(5);

  const totalSecs = minutes * 60 + seconds;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <View style={s.overlay}>
        <View style={[s.sheet, { backgroundColor: c.surface, borderColor: c.border, paddingBottom: insets.bottom + 32 }]}>
          <View style={[s.handle, { backgroundColor: c.border }]} />
          <Text style={[s.techName, { color: c.text }]}>{techniqueName}</Text>
          <Text style={[s.subtitle, { color: c.textMuted }]}>{t.howLong}</Text>

          <View style={[s.modeRow, { backgroundColor: c.bg }]}>
            <TouchableOpacity style={[s.modeBtn, mode === 'time' && { backgroundColor: c.accentDark }]} onPress={() => setMode('time')}>
              <Text style={[s.modeBtnTxt, { color: mode === 'time' ? '#fff' : c.textMuted }]}>{t.timeMode}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.modeBtn, mode === 'rounds' && { backgroundColor: c.accentDark }]} onPress={() => setMode('rounds')}>
              <Text style={[s.modeBtnTxt, { color: mode === 'rounds' ? '#fff' : c.textMuted }]}>{t.roundsMode}</Text>
            </TouchableOpacity>
          </View>

          {mode === 'time' ? (
            <View style={s.pickerWrap}>
              <View style={s.pickerCol}>
                <TouchableOpacity style={[s.stepBtn, { backgroundColor: c.elevated }]} onPress={() => setMinutes((m) => Math.min(60, m + 1))}>
                  <Text style={[s.stepBtnTxt, { color: c.textSec }]}>+</Text>
                </TouchableOpacity>
                <Text style={[s.pickerVal, { color: c.text }]}>{String(minutes).padStart(2, '0')}</Text>
                <TouchableOpacity style={[s.stepBtn, { backgroundColor: c.elevated }]} onPress={() => setMinutes((m) => Math.max(0, m - 1))}>
                  <Text style={[s.stepBtnTxt, { color: c.textSec }]}>−</Text>
                </TouchableOpacity>
                <Text style={[s.pickerLbl, { color: c.textMuted }]}>{t.min}</Text>
              </View>
              <Text style={[s.pickerSep, { color: c.textMuted }]}>:</Text>
              <View style={s.pickerCol}>
                <TouchableOpacity style={[s.stepBtn, { backgroundColor: c.elevated }]} onPress={() => setSeconds((x) => x >= 50 ? 0 : x + 10)}>
                  <Text style={[s.stepBtnTxt, { color: c.textSec }]}>+</Text>
                </TouchableOpacity>
                <Text style={[s.pickerVal, { color: c.text }]}>{String(seconds).padStart(2, '0')}</Text>
                <TouchableOpacity style={[s.stepBtn, { backgroundColor: c.elevated }]} onPress={() => setSeconds((x) => x <= 0 ? 50 : x - 10)}>
                  <Text style={[s.stepBtnTxt, { color: c.textSec }]}>−</Text>
                </TouchableOpacity>
                <Text style={[s.pickerLbl, { color: c.textMuted }]}>{t.sec}</Text>
              </View>
            </View>
          ) : (
            <View style={s.pickerWrap}>
              <View style={s.pickerCol}>
                <TouchableOpacity style={[s.stepBtn, { backgroundColor: c.elevated }]} onPress={() => setRounds((r) => Math.min(100, r + 1))}>
                  <Text style={[s.stepBtnTxt, { color: c.textSec }]}>+</Text>
                </TouchableOpacity>
                <Text style={[s.pickerVal, { color: c.text }]}>{rounds}</Text>
                <TouchableOpacity style={[s.stepBtn, { backgroundColor: c.elevated }]} onPress={() => setRounds((r) => Math.max(1, r - 1))}>
                  <Text style={[s.stepBtnTxt, { color: c.textSec }]}>−</Text>
                </TouchableOpacity>
                <Text style={[s.pickerLbl, { color: c.textMuted }]}>{t.cycles}</Text>
              </View>
            </View>
          )}

          {mode === 'time' && totalSecs < 10 && (
            <Text style={[s.hint, { color: c.hold }]}>{t.minTenSecs}</Text>
          )}

          <View style={s.btnRow}>
            <TouchableOpacity style={[s.cancelBtn, { backgroundColor: c.elevated }]} onPress={onCancel}>
              <Text style={[s.cancelTxt, { color: c.textMuted }]}>{t.cancel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.startBtn, { backgroundColor: c.accentDark }, mode === 'time' && totalSecs < 10 && { opacity: 0.4 }]}
              onPress={() => onStart({ mode, targetMinutes: minutes, targetSeconds: seconds, targetRounds: rounds })}
              disabled={mode === 'time' && totalSecs < 10}
            >
              <Text style={s.startTxt}>{t.go}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 28, borderTopWidth: 0.5, alignItems: 'center' },
  handle: { width: 40, height: 4, borderRadius: 2, marginBottom: 24 },
  techName: { fontSize: 20, fontWeight: '500', marginBottom: 4 },
  subtitle: { fontSize: 14, marginBottom: 24 },
  modeRow: { flexDirection: 'row', gap: 4, marginBottom: 30, borderRadius: 12, padding: 4 },
  modeBtn: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 10 },
  modeBtnTxt: { fontSize: 15 },
  pickerWrap: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 28 },
  pickerCol: { alignItems: 'center', gap: 8 },
  stepBtn: { width: 52, height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  stepBtnTxt: { fontSize: 28, lineHeight: 32 },
  pickerVal: { fontSize: 48, fontWeight: '200', fontVariant: ['tabular-nums'], lineHeight: 56 },
  pickerLbl: { fontSize: 12 },
  pickerSep: { fontSize: 40, fontWeight: '200', marginBottom: 20 },
  hint: { fontSize: 13, marginBottom: 14, marginTop: -12 },
  btnRow: { flexDirection: 'row', gap: 12, width: '100%' },
  cancelBtn: { flex: 1, paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  cancelTxt: { fontSize: 16 },
  startBtn: { flex: 2, paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  startTxt: { color: '#fff', fontSize: 18, fontWeight: '500' },
});
