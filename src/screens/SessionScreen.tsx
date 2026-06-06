import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Vibration,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import * as Haptics from 'expo-haptics';
import { BreathCanvas } from '../components/BreathCanvas';
import { useBreathStore } from '../store/breathStore';
import { getTotalSeconds } from '../utils/pathGeometry';
import { BreathSession } from '../types';

export default function SessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getTechniqueById, addSession } = useBreathStore();
  const technique = getTechniqueById(id!);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('');
  const [secsRemaining, setSecsRemaining] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStartRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying) activateKeepAwakeAsync();
    else deactivateKeepAwake();
    return () => deactivateKeepAwake();
  }, [isPlaying]);

  // tick: update phase label + seconds
  useEffect(() => {
    if (!isPlaying || !technique) return;
    if (!startTimeRef.current) startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const totalSecs = getTotalSeconds(technique.phases);
      const t = ((Date.now() - startTimeRef.current!) / 1000) % totalSecs;
      setElapsed(Math.floor((Date.now() - sessionStartRef.current!) / 1000));

      let elapsed2 = 0;
      for (const phase of technique.phases) {
        if (t <= elapsed2 + phase.seconds) {
          const rem = Math.ceil(elapsed2 + phase.seconds - t);
          setCurrentPhase(phase.label);
          setSecsRemaining(rem);
          break;
        }
        elapsed2 += phase.seconds;
      }
    }, 250);

    return () => clearInterval(intervalRef.current!);
  }, [isPlaying, technique]);

  const handleStart = useCallback(() => {
    sessionStartRef.current = Date.now();
    startTimeRef.current = Date.now();
    setIsPlaying(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const handleEnd = useCallback(() => {
    if (!technique || !sessionStartRef.current) return;
    setIsPlaying(false);
    const dur = Math.floor((Date.now() - sessionStartRef.current) / 1000);
    if (dur > 5) {
      const session: BreathSession = {
        id: `${Date.now()}`,
        techniqueId: technique.id,
        techniqueName: technique.name,
        startedAt: sessionStartRef.current,
        endedAt: Date.now(),
        durationSeconds: dur,
        roundsCompleted: rounds,
      };
      addSession(session);
    }
    router.back();
  }, [technique, rounds, addSession, router]);

  const handleRoundComplete = useCallback((r: number) => {
    setRounds((prev) => prev + 1);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  if (!technique) return null;

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleEnd} style={styles.backBtn}>
          <Text style={styles.backTxt}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{technique.name}</Text>
        <Text style={styles.timer}>{formatTime(elapsed)}</Text>
      </View>

      <View style={styles.canvasWrap}>
        <BreathCanvas
          technique={technique}
          isPlaying={isPlaying}
          onRoundComplete={handleRoundComplete}
        />
      </View>

      <View style={styles.phaseWrap}>
        <Text style={styles.phaseLabel}>{isPlaying ? currentPhase : technique.name}</Text>
        <Text style={styles.phaseSecs}>
          {isPlaying ? `${secsRemaining} Sek` : technique.description}
        </Text>
        {rounds > 0 && (
          <Text style={styles.rounds}>{rounds} {rounds === 1 ? 'Runde' : 'Runden'}</Text>
        )}
      </View>

      <View style={styles.controls}>
        {!isPlaying ? (
          <TouchableOpacity style={styles.playBtn} onPress={handleStart} activeOpacity={0.8}>
            <Text style={styles.playTxt}>▶  Start</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.pauseBtn} onPress={handlePause} activeOpacity={0.8}>
            <Text style={styles.pauseTxt}>⏸  Pause</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backTxt: { color: '#555', fontSize: 18 },
  title: { color: '#ddd', fontSize: 16, fontWeight: '500' },
  timer: { color: '#555', fontSize: 14, fontVariant: ['tabular-nums'] },
  canvasWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  phaseWrap: { alignItems: 'center', paddingHorizontal: 24, paddingBottom: 24, minHeight: 80 },
  phaseLabel: { color: '#fff', fontSize: 28, fontWeight: '300', letterSpacing: 1 },
  phaseSecs: { color: '#668', fontSize: 15, marginTop: 4, textAlign: 'center' },
  rounds: { color: '#446', fontSize: 13, marginTop: 8 },
  controls: { paddingHorizontal: 24, paddingBottom: 40 },
  playBtn: {
    backgroundColor: '#185FA5',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  playTxt: { color: '#fff', fontSize: 18, fontWeight: '500', letterSpacing: 0.5 },
  pauseBtn: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  pauseTxt: { color: '#aaa', fontSize: 18, fontWeight: '400' },
});
