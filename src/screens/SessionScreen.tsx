import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { useT, useLang, localizeTechnique } from '../i18n';

type SessionState = 'idle' | 'intro' | 'running' | 'paused' | 'outro';

export default function SessionScreen() {
  const params = useLocalSearchParams<{
    id: string; mode?: string;
    targetMinutes?: string; targetSeconds?: string; targetRounds?: string;
  }>();
  const router = useRouter();
  const c = useTheme();
  const t = useT();
  const lang = useLang();
  const insets = useSafeAreaInsets();
  const { getTechniqueById, addSession, getStats } = useBreathStore();
  const { soundType, spotifyEnabled, spotifyUri, introOutroEnabled, hapticsEnabled } = useSettingsStore();

  const rawTechnique = getTechniqueById(params.id!);
  const technique = useMemo(
    () => (rawTechnique ? localizeTechnique(rawTechnique, lang) : undefined),
    [rawTechnique, lang]
  );

  const INTRO_STEPS = useMemo(() => [
    { text: t.introStep1, secs: 3 },
    { text: t.introStep2, secs: 3 },
    { text: t.introStep3, secs: 2 },
    { text: '3', secs: 1 },
    { text: '2', secs: 1 },
    { text: '1', secs: 1 },
  ], [t]);

  const mode = (params.mode as 'time' | 'rounds') ?? 'time';
  const targetTotalSecs = (parseInt(params.targetMinutes ?? '5') * 60) + parseInt(params.targetSeconds ?? '0');
  const targetRounds = parseInt(params.targetRounds ?? '5');

  const [state, setState] = useState<SessionState>('idle');
  const [introStep, setIntroStep] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('');
  const [secsRemaining, setSecsRemaining] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [showStopModal, setShowStopModal] = useState(false);
  const [finalStats, setFinalStats] = useState<{ dur: number; rounds: number } | null>(null);

  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionStartRef = useRef<number | null>(null);
  const roundsRef = useRef(0);
  const lastPhaseRef = useRef('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => { setupAudio(); return () => { unloadSound(); }; }, []);

  useEffect(() => {
    if (state === 'running') activateKeepAwakeAsync();
    else deactivateKeepAwake();
    return () => deactivateKeepAwake();
  }, [state]);

  useEffect(() => {
    if (state !== 'intro') return;
    if (introStep >= INTRO_STEPS.length) { startRunning(); return; }
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    if (hapticsEnabled && INTRO_STEPS[introStep].text.length <= 2) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const timer = setTimeout(() => setIntroStep((s) => s + 1), INTRO_STEPS[introStep].secs * 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, introStep]);

  useEffect(() => {
    if (state !== 'running' || !technique) return;
    if (!startTimeRef.current) startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const totalSecs = getTotalSeconds(technique.phases);
      const sessionElapsed = Math.floor((Date.now() - sessionStartRef.current!) / 1000);
      const tt = ((Date.now() - startTimeRef.current!) / 1000) % totalSecs;
      setElapsed(sessionElapsed);

      if (mode === 'time' && sessionElapsed >= targetTotalSecs) { finishSession(true); return; }

      let el = 0;
      for (const phase of technique.phases) {
        if (tt <= el + phase.seconds) {
          if (phase.label !== lastPhaseRef.current) {
            lastPhaseRef.current = phase.label;
            playPhaseSound(soundType);
            if (hapticsEnabled) {
              Haptics.impactAsync(phase.direction === 'up' ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light);
            }
          }
          setCurrentPhase(phase.label);
          setSecsRemaining(Math.ceil(el + phase.seconds - tt));
          break;
        }
        el += phase.seconds;
      }
    }, 250);

    return () => clearInterval(intervalRef.current!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, technique]);

  const startRunning = useCallback(() => {
    sessionStartRef.current = sessionStartRef.current ?? Date.now();
    startTimeRef.current = Date.now();
    setState('running');
    if (hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [hapticsEnabled]);

  const handleStart = useCallback(() => {
    if (spotifyEnabled && spotifyUri) Linking.openURL(spotifyUri).catch(() => {});
    if (introOutroEnabled && !sessionStartRef.current) {
      sessionStartRef.current = Date.now();
      setIntroStep(0);
      setState('intro');
    } else {
      startRunning();
    }
  }, [spotifyEnabled, spotifyUri, introOutroEnabled, startRunning]);

  const finishSession = useCallback((save: boolean) => {
    setState((prev) => {
      if (prev === 'outro') return prev;
      clearInterval(intervalRef.current!);
      const dur = sessionStartRef.current ? Math.floor((Date.now() - sessionStartRef.current) / 1000) : 0;

      if (save && dur > 5 && technique) {
        addSession({
          id: `${Date.now()}`, techniqueId: technique.id, techniqueName: technique.name,
          startedAt: sessionStartRef.current!, endedAt: Date.now(),
          durationSeconds: dur, roundsCompleted: roundsRef.current,
        } as BreathSession);
      }

      if (save && dur > 5 && introOutroEnabled) {
        setFinalStats({ dur, rounds: roundsRef.current });
        if (hapticsEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        return 'outro';
      }
      router.back();
      return prev;
    });
  }, [technique, addSession, router, introOutroEnabled, hapticsEnabled]);

  const handlePause = useCallback(() => { setState('paused'); setShowStopModal(true); }, []);
  const handleXPress = useCallback(() => {
    if (state === 'running' || state === 'paused') { setState('paused'); setShowStopModal(true); }
    else router.back();
  }, [state, router]);

  const handleRoundComplete = useCallback((r: number) => {
    roundsRef.current = r;
    setRounds(r);
    if (mode === 'rounds' && r >= targetRounds) setTimeout(() => finishSession(true), 400);
  }, [mode, targetRounds, finishSession]);

  if (!technique) return null;

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const progress = mode === 'time'
    ? Math.min(1, elapsed / Math.max(targetTotalSecs, 1))
    : Math.min(1, rounds / targetRounds);
  const isRunning = state === 'running';

  if (state === 'outro' && finalStats) {
    const stats = getStats();
    return (
      <View style={[styles.container, { backgroundColor: c.bg, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.outroWrap}>
          <Text style={styles.outroEmoji}>🌊</Text>
          <Text style={[styles.outroTitle, { color: c.text }]}>{t.wellDone}</Text>
          <Text style={[styles.outroSub, { color: c.textMuted }]}>{t.outroSub}</Text>
          <View style={[styles.outroStats, { backgroundColor: c.surface, borderColor: c.border }]}>
            <View style={styles.outroStatItem}>
              <Text style={[styles.outroStatVal, { color: c.text }]}>{formatTime(finalStats.dur)}</Text>
              <Text style={[styles.outroStatLbl, { color: c.textMuted }]}>{t.duration}</Text>
            </View>
            <View style={[styles.outroStatDivider, { backgroundColor: c.border }]} />
            <View style={styles.outroStatItem}>
              <Text style={[styles.outroStatVal, { color: c.text }]}>{finalStats.rounds}</Text>
              <Text style={[styles.outroStatLbl, { color: c.textMuted }]}>{t.cyclesWord}</Text>
            </View>
            <View style={[styles.outroStatDivider, { backgroundColor: c.border }]} />
            <View style={styles.outroStatItem}>
              <Text style={[styles.outroStatVal, { color: c.text }]}>🔥 {stats.streak}</Text>
              <Text style={[styles.outroStatLbl, { color: c.textMuted }]}>{t.dayStreak}</Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.outroBtn, { backgroundColor: c.accentDark }]} onPress={() => router.back()} activeOpacity={0.85}>
            <Text style={styles.outroBtnTxt}>{t.done}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (state === 'intro') {
    const step = INTRO_STEPS[Math.min(introStep, INTRO_STEPS.length - 1)];
    const isCountdown = step.text.length <= 2;
    return (
      <View style={[styles.container, { backgroundColor: c.bg, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.introSkip, { top: insets.top + 12 }]}>
          <Text style={{ color: c.textFaint, fontSize: 14 }}>{t.skip}</Text>
        </TouchableOpacity>
        <View style={styles.introWrap}>
          <Animated.Text style={[
            isCountdown ? styles.introCountdown : styles.introText,
            { color: isCountdown ? c.accent : c.text, opacity: fadeAnim },
          ]}>
            {step.text}
          </Animated.Text>
        </View>
        <TouchableOpacity onPress={startRunning} style={styles.introSkipBottom}>
          <Text style={{ color: c.textMuted, fontSize: 14 }}>{t.startNow}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: c.bg, paddingTop: insets.top + 8, paddingBottom: insets.bottom + 12 }]}>
      <Modal visible={showStopModal} transparent animationType="fade" onRequestClose={() => setShowStopModal(false)}>
        <View style={mS.overlay}>
          <View style={[mS.sheet, { backgroundColor: c.surface, borderColor: c.border, paddingBottom: insets.bottom + 28 }]}>
            <View style={[mS.handle, { backgroundColor: c.border }]} />
            <Text style={[mS.title, { color: c.text }]}>{t.endSession}</Text>
            <Text style={[mS.sub, { color: c.textMuted }]}>
              {formatTime(elapsed)} · {roundsRef.current} {roundsRef.current === 1 ? t.cycle : t.cyclesWord}
            </Text>
            <TouchableOpacity style={[mS.doneBtn, { backgroundColor: c.accentDark }]}
              onPress={() => { setShowStopModal(false); finishSession(true); }}>
              <Text style={mS.doneTxt}>{t.completed}</Text>
              <Text style={[mS.doneSub, { color: c.accent }]}>{t.countsForStats}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[mS.resumeBtn, { backgroundColor: c.elevated, borderColor: c.borderStrong }]}
              onPress={() => { setShowStopModal(false); startRunning(); }}>
              <Text style={[mS.resumeTxt, { color: c.textSec }]}>{t.continueSession}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={mS.cancelBtn} onPress={() => { setShowStopModal(false); finishSession(false); }}>
              <Text style={[mS.cancelTxt, { color: c.danger }]}>{t.discard}</Text>
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

      <View style={styles.canvasWrap}>
        <BreathCanvas technique={technique} isPlaying={isRunning} height={400} onRoundComplete={handleRoundComplete} />
      </View>

      <View style={styles.phaseWrap}>
        <Text style={[styles.phaseLabel, { color: c.text }]}>
          {isRunning ? currentPhase : (sessionStartRef.current ? t.pauseLabel : technique.name)}
        </Text>
        <Text style={[styles.phaseSecs, { color: c.textMuted }]} numberOfLines={2}>
          {isRunning ? `${secsRemaining}` : technique.description}
        </Text>
      </View>

      <View style={styles.controls}>
        {!isRunning ? (
          <TouchableOpacity style={[styles.playBtn, { backgroundColor: c.accentDark }]} onPress={handleStart} activeOpacity={0.85}>
            <Text style={styles.playTxt}>{sessionStartRef.current ? t.resume : t.start}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.pauseBtn, { backgroundColor: c.elevated, borderColor: c.borderStrong }]} onPress={handlePause} activeOpacity={0.85}>
            <Text style={[styles.pauseTxt, { color: c.textSec }]}>{t.pause}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 8 },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backTxt: { fontSize: 18 },
  title: { fontSize: 16, fontWeight: '500' },
  timer: { fontSize: 14, fontVariant: ['tabular-nums'], width: 44, textAlign: 'right' },
  progressBg: { height: 2, marginHorizontal: 20, borderRadius: 1 },
  progressFill: { height: 2, borderRadius: 1 },
  canvasWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  phaseWrap: { alignItems: 'center', paddingHorizontal: 24, minHeight: 86 },
  phaseLabel: { fontSize: 30, fontWeight: '300', letterSpacing: 1 },
  phaseSecs: { fontSize: 16, marginTop: 4, textAlign: 'center' },
  controls: { paddingHorizontal: 20, paddingTop: 8 },
  playBtn: { borderRadius: 16, paddingVertical: 17, alignItems: 'center' },
  playTxt: { color: '#fff', fontSize: 18, fontWeight: '500' },
  pauseBtn: { borderRadius: 16, paddingVertical: 17, alignItems: 'center', borderWidth: 1 },
  pauseTxt: { fontSize: 18 },
  introWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  introText: { fontSize: 24, fontWeight: '300', textAlign: 'center', lineHeight: 34 },
  introCountdown: { fontSize: 90, fontWeight: '200' },
  introSkip: { position: 'absolute', right: 20, zIndex: 10, padding: 8 },
  introSkipBottom: { alignItems: 'center', paddingVertical: 16 },
  outroWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  outroEmoji: { fontSize: 56, marginBottom: 20 },
  outroTitle: { fontSize: 30, fontWeight: '300', letterSpacing: 1, marginBottom: 12 },
  outroSub: { fontSize: 16, lineHeight: 24, textAlign: 'center', marginBottom: 36 },
  outroStats: { flexDirection: 'row', borderRadius: 16, borderWidth: 0.5, paddingVertical: 20, paddingHorizontal: 12, width: '100%', marginBottom: 36 },
  outroStatItem: { flex: 1, alignItems: 'center' },
  outroStatDivider: { width: 0.5 },
  outroStatVal: { fontSize: 22, fontWeight: '400' },
  outroStatLbl: { fontSize: 12, marginTop: 4 },
  outroBtn: { width: '100%', borderRadius: 16, paddingVertical: 17, alignItems: 'center' },
  outroBtnTxt: { color: '#fff', fontSize: 18, fontWeight: '500' },
});

const mS = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 28, alignItems: 'center', borderTopWidth: 0.5 },
  handle: { width: 40, height: 4, borderRadius: 2, marginBottom: 24 },
  title: { fontSize: 20, fontWeight: '500', marginBottom: 4 },
  sub: { fontSize: 14, marginBottom: 28 },
  doneBtn: { width: '100%', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 10 },
  doneTxt: { color: '#fff', fontSize: 17, fontWeight: '600' },
  doneSub: { fontSize: 12, marginTop: 2 },
  resumeBtn: { width: '100%', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 10, borderWidth: 0.5 },
  resumeTxt: { fontSize: 17 },
  cancelBtn: { paddingVertical: 14, alignItems: 'center' },
  cancelTxt: { fontSize: 14 },
});
