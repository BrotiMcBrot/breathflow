import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';
import { BreathCanvas } from '../components/BreathCanvas';
import { useBreathStore } from '../store/breathStore';
import { useSettingsStore } from '../store/settingsStore';
import { getTotalSeconds } from '../utils/pathGeometry';
import { playPhaseSound, setupAudio, unloadSound } from '../utils/soundManager';
import { BreathSession } from '../types';
import { useTheme } from '../theme';

export default function SessionScreen() {
  const params = useLocalSearchParams<{ id: string; mode?: string; targetMinutes?: string; targetSeconds?: string; targetRounds?: string; }>();
  const router = useRouter();
  const c = useTheme();
  const { getTechniqueById, addSession } = useBreathStore();
  const { soundType, spotifyEnabled, spotifyUri } = useSettingsStore();
  const technique = getTechniqueById(params.id!);

  const mode = (params.mode as 'time' | 'rounds') ?? 'time';
  const targetTotalSecs = (parseInt(params.targetMinutes ?? '5') * 60) + parseInt(params.targetSeconds ?? '0');
  const targetRounds = parseInt(params.targetRounds ?? '5');

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('');
  const [secsRemaining, setSecsRemaining] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [showStopModal, setShowStopModal] = useState(false);

  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionStartRef = useRef<number | null>(null);
  const roundsRef = useRef(0);
  const lastPhaseRef = useRef('');

  useEffect(() => { setupAudio(); return () => { unloadSound(); }; }, []);

  useEffect(() => {
    if (isPlaying) activateKeepAwakeAsync();
    else deactivateKeepAwake();
    return () => deactivateKeepAwake();
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying || !technique) return;
    if (!startTimeRef.current) startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const totalSecs = getTotalSeconds(technique.phases);
      const sessionElapsed = Math.floor((Date.now() - sessionStartRef.current!) / 1000);
      const t = ((Date.now() - startTimeRef.current!) / 1000) % totalSecs;
      setElapsed(sessionElapsed);
      if (mode === 'time' && sessionElapsed >= targetTotalSecs) { setIsPlaying(false); saveAndExit(true); return; }
      let el = 0;
      for (const phase of technique.phases) {
        if (t <= el + phase.seconds) {
          if (phase.label !== lastPhaseRef.current) {
            lastPhaseRef.current = phase.label;
            playPhaseSound(soundType);
          }
          setCurrentPhase(phase.label);
          setSecsRemaining(Math.ceil(el + phase.seconds - t));
          break;
        }
        el += phase.seconds;
      }
    }, 250);
    return () => clearInterval(intervalRef.current!);
  }, [isPlaying, technique]);

  const saveAndExit = useCallback((save = true) => {
    if (!technique || !sessionStartRef.current) { router.back(); return; }
    setIsPlaying(false);
    clearInterval(intervalRef.current!);
    const dur = Math.floor((Date.now() - sessionStartRef.current) / 1000);
    if (save && dur > 5) {
      addSession({
        id: `${Date.now()}`, techniqueId: technique.id, techniqueName: technique.name,
        startedAt: sessionStartRef.current, endedAt: Date.now(),
        durationSeconds: dur, roundsCompleted: roundsRef.current,
      } as BreathSession);
    }
    router.back();
  }, [technique, addSession, router]);

  const handleStart = useCallback(() => {
    sessionStartRef.current = Date.now();
    startTimeRef.current = Date.now();
    if (spotifyEnabled && spotifyUri) {
      Linking.openURL(spotifyUri).catch(() => {});
    }
    setIsPlaying(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [spotifyEnabled, spotifyUri]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    setShowStopModal(true);
  }, []);

  const handleXPress = useCallback(() => {
    if (sessionStartRef.current) { setIsPlaying(false); setShowStopModal(true); }
    else router.back();
  }, [router]);

  const handleRoundComplete = useCallback((r: number) => {
    roundsRef.current = r;
    setRounds(r);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (mode === 'rounds' && r >= targetRounds) setTimeout(() => saveAndExit(true), 500);
  }, [mode, targetRounds, saveAndExit]);

  if (!technique) return null;

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const progress = mode === 'time' ? Math.min(1, elapsed / Math.max(targetTotalSecs, 1)) : Math.min(1, rounds / targetRounds);
  const targetLabel = mode === 'time' ? formatTime(targetTotalSecs) : `${rounds} / ${targetRounds} Zyklen`;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
      {/* Stop modal */}
      <Modal visible={showStopModal} transparent animationType="fade" onRequestClose={() => setShowStopModal(false)}>
        <View style={[mStyles.overlay]}>
          <View style={[mStyles.sheet, { backgroundColor: c.surface, borderColor: c.border }]}>
            <View style={[mStyles.handle, { backgroundColor: c.border }]} />
            <Text style={[mStyles.mTitle, { color: c.text }]}>Session beenden?</Text>
            <Text style={[mStyles.mSub, { color: c.textMuted }]}>{formatTime(elapsed)} · {roundsRef.current} {roundsRef.current === 1 ? 'Zyklus' : 'Zyklen'}</Text>
            <TouchableOpacity style={[mStyles.doneBtn, { backgroundColor: c.accentDark }]} onPress={() => { setShowStopModal(false); saveAndExit(true); }}>
              <Text style={mStyles.doneTxt}>✓  Abgeschlossen</Text>
              <Text style={[mStyles.doneSubTxt, { color: c.accent }]}>Zählt für Statistik</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[mStyles.resumeBtn, { backgroundColor: c.elevated, borderColor: c.borderStrong }]} onPress={() => { setShowStopModal(false); setIsPlaying(true); }}>
              <Text style={[mStyles.resumeTxt, { color: c.textSec }]}>▶  Weitermachen</Text>
            </TouchableOpacity>
            <TouchableOpacity style={mStyles.cancelBtn} onPress={() => { setShowStopModal(false); saveAndExit(false); }}>
              <Text style={[mStyles.cancelTxt, { color: c.danger }]}>Abbruch (nicht speichern)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <TouchableOpacity onPress={handleXPress} style={styles.backBtn}>
          <Text style={[styles.backTxt, { color: c.textFaint }]}>✕</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: c.textSec }]}>{technique.name}</Text>
        <Text style={[styles.timer, { color: c.textFaint }]}>{formatTime(elapsed)}</Text>
      </View>

      <View style={[styles.progressBg, { backgroundColor: c.border }]}>
        <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: c.accent }]} />
      </View>
      <Text style={[styles.progressLbl, { color: c.textFaint }]}>
        {mode === 'time' ? `Ziel: ${targetLabel}` : `Zyklen: ${targetLabel}`}
      </Text>

      <View style={styles.canvasWrap}>
        <BreathCanvas technique={technique} isPlaying={isPlaying} onRoundComplete={handleRoundComplete} />
      </View>

      <View style={styles.phaseWrap}>
        <Text style={[styles.phaseLabel, { color: c.text }]}>{isPlaying ? currentPhase : (sessionStartRef.current ? 'Pause' : technique.name)}</Text>
        <Text style={[styles.phaseSecs, { color: c.textMuted }]}>{isPlaying ? `${secsRemaining} Sek` : technique.description}</Text>
      </View>

      <View style={styles.controls}>
        {!isPlaying ? (
          <TouchableOpacity style={[styles.playBtn, { backgroundColor: c.accentDark }]} onPress={handleStart} activeOpacity={0.8}>
            <Text style={styles.playTxt}>▶  {sessionStartRef.current ? 'Weiter' : 'Start'}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.pauseBtn, { backgroundColor: c.elevated, borderColor: c.borderStrong }]} onPress={handlePause} activeOpacity={0.8}>
            <Text style={[styles.pauseTxt, { color: c.textSec }]}>⏸  Pause</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backTxt: { fontSize: 18 },
  title: { fontSize: 16, fontWeight: '500' },
  timer: { fontSize: 14, fontVariant: ['tabular-nums'] },
  progressBg: { height: 2, marginHorizontal: 24, borderRadius: 1 },
  progressFill: { height: 2, borderRadius: 1 },
  progressLbl: { fontSize: 11, textAlign: 'center', marginTop: 4, marginBottom: 4 },
  canvasWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  phaseWrap: { alignItems: 'center', paddingHorizontal: 24, paddingBottom: 24, minHeight: 80 },
  phaseLabel: { fontSize: 28, fontWeight: '300', letterSpacing: 1 },
  phaseSecs: { fontSize: 15, marginTop: 4, textAlign: 'center' },
  controls: { paddingHorizontal: 24, paddingBottom: 40 },
  playBtn: { borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  playTxt: { color: '#fff', fontSize: 18, fontWeight: '500' },
  pauseBtn: { borderRadius: 16, paddingVertical: 18, alignItems: 'center', borderWidth: 1 },
  pauseTxt: { fontSize: 18 },
});

const mStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 28, paddingBottom: 48, alignItems: 'center', borderTopWidth: 0.5 },
  handle: { width: 40, height: 4, borderRadius: 2, marginBottom: 24 },
  mTitle: { fontSize: 20, fontWeight: '500', marginBottom: 4 },
  mSub: { fontSize: 14, marginBottom: 28 },
  doneBtn: { width: '100%', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 10 },
  doneTxt: { color: '#fff', fontSize: 17, fontWeight: '600' },
  doneSubTxt: { fontSize: 12, marginTop: 2 },
  resumeBtn: { width: '100%', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 10, borderWidth: 0.5 },
  resumeTxt: { fontSize: 17 },
  cancelBtn: { paddingVertical: 14, alignItems: 'center' },
  cancelTxt: { fontSize: 14 },
});
