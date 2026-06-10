import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useBreathStore } from '../store/breathStore';
import { BreathSession } from '../types';
import { useTheme, Colors } from '../theme';

function formatDate(ts: number): string {
  const d = new Date(ts);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Heute';
  if (d.toDateString() === yesterday.toDateString()) return 'Gestern';
  return d.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' });
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

function formatDuration(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  if (m === 0) return `${s}s`;
  if (s === 0) return `${m} min`;
  return `${m}m ${s}s`;
}

type ListItem =
  | { type: 'header'; key: string; label: string }
  | { type: 'session'; key: string; session: BreathSession };

function buildList(sessions: BreathSession[]): ListItem[] {
  const items: ListItem[] = [];
  let lastDate = '';
  for (const session of sessions) {
    const label = formatDate(session.startedAt);
    if (label !== lastDate) {
      items.push({ type: 'header', key: `h_${session.startedAt}`, label });
      lastDate = label;
    }
    items.push({ type: 'session', key: session.id, session });
  }
  return items;
}

export default function StatsScreen() {
  const c = useTheme();
  const { sessions, getStats, clearSessions } = useBreathStore();
  const stats = getStats();
  const listData = buildList(sessions);

  const handleClear = () => {
    Alert.alert('Verlauf löschen', 'Alle Sessions werden gelöscht.', [
      { text: 'Abbrechen', style: 'cancel' },
      { text: 'Löschen', style: 'destructive', onPress: clearSessions },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: c.text }]}>Verlauf</Text>
        {sessions.length > 0 && (
          <TouchableOpacity onPress={handleClear}>
            <Text style={{ color: c.danger, fontSize: 13 }}>Löschen</Text>
          </TouchableOpacity>
        )}
      </View>

      {stats.totalSessions > 0 && (
        <View style={styles.statsGrid}>
          {[
            { val: stats.totalSessions, lbl: 'Sessions' },
            { val: stats.totalMinutes, lbl: 'Minuten' },
            { val: stats.streak, lbl: 'Tage Streak' },
          ].map(({ val, lbl }) => (
            <View key={lbl} style={[styles.statCard, { backgroundColor: c.surface, borderColor: c.border }]}>
              <Text style={[styles.statVal, { color: c.text }]}>{val}</Text>
              <Text style={[styles.statLbl, { color: c.textMuted }]}>{lbl}</Text>
            </View>
          ))}
        </View>
      )}

      {sessions.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🫁</Text>
          <Text style={[styles.emptyTxt, { color: c.textMuted }]}>Noch keine Sessions</Text>
          <Text style={[styles.emptySub, { color: c.textFaint }]}>Starte eine Übung und schließe sie ab</Text>
        </View>
      ) : (
        <FlatList
          data={listData}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            if (item.type === 'header') return (
              <View style={styles.dateHeader}>
                <Text style={[styles.dateHeaderTxt, { color: c.textFaint }]}>{item.label}</Text>
              </View>
            );
            const { session } = item;
            return (
              <View style={[styles.row, { borderBottomColor: c.surface }]}>
                <View style={styles.rowLeft}>
                  <View style={[styles.dot, { backgroundColor: c.accent }]} />
                  <View>
                    <Text style={[styles.rowName, { color: c.textSec }]}>{session.techniqueName}</Text>
                    <Text style={[styles.rowTime, { color: c.textMuted }]}>{formatTime(session.startedAt)}</Text>
                  </View>
                </View>
                <View style={styles.rowRight}>
                  <Text style={[styles.rowDur, { color: c.textMuted }]}>{formatDuration(session.durationSeconds)}</Text>
                  {session.roundsCompleted > 0 && (
                    <Text style={[styles.rowRounds, { color: c.textFaint }]}>{session.roundsCompleted} Zyklen</Text>
                  )}
                </View>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16 },
  title: { fontSize: 22, fontWeight: '300', letterSpacing: 2 },
  statsGrid: { flexDirection: 'row', paddingHorizontal: 24, gap: 10, marginBottom: 24 },
  statCard: { flex: 1, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 0.5 },
  statVal: { fontSize: 26, fontWeight: '300' },
  statLbl: { fontSize: 11, marginTop: 3 },
  list: { paddingHorizontal: 24, paddingBottom: 100 },
  dateHeader: { paddingTop: 20, paddingBottom: 8 },
  dateHeaderTxt: { fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 0.5 },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  rowName: { fontSize: 15 },
  rowTime: { fontSize: 12, marginTop: 2 },
  rowRight: { alignItems: 'flex-end' },
  rowDur: { fontSize: 14, fontVariant: ['tabular-nums'] },
  rowRounds: { fontSize: 11, marginTop: 2 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 100 },
  emptyEmoji: { fontSize: 48, marginBottom: 16, opacity: 0.3 },
  emptyTxt: { fontSize: 18 },
  emptySub: { fontSize: 14, marginTop: 8 },
});
