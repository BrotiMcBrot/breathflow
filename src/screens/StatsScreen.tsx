import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { useBreathStore } from '../store/breathStore';
import { BreathSession } from '../types';

function SessionRow({ session }: { session: BreathSession }) {
  const mins = Math.floor(session.durationSeconds / 60);
  const secs = session.durationSeconds % 60;
  return (
    <View style={styles.sessionRow}>
      <View style={styles.sessionLeft}>
        <Text style={styles.sessionName}>{session.techniqueName}</Text>
        <Text style={styles.sessionDate}>
          {format(session.startedAt, 'EEE, dd. MMM · HH:mm', { locale: de })}
        </Text>
      </View>
      <View style={styles.sessionRight}>
        <Text style={styles.sessionDur}>
          {mins > 0 ? `${mins}m ` : ''}{secs}s
        </Text>
        {session.roundsCompleted > 0 && (
          <Text style={styles.sessionRounds}>{session.roundsCompleted} Runden</Text>
        )}
      </View>
    </View>
  );
}

export default function StatsScreen() {
  const router = useRouter();
  const { sessions, getStats, clearSessions } = useBreathStore();
  const stats = getStats();

  const handleClear = () => {
    Alert.alert(
      'Verlauf löschen',
      'Alle Sessions werden gelöscht. Fortfahren?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        { text: 'Löschen', style: 'destructive', onPress: clearSessions },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backTxt}>← Zurück</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Statistiken</Text>
        <TouchableOpacity onPress={handleClear}>
          <Text style={styles.clearTxt}>Löschen</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statVal}>{stats.totalSessions}</Text>
          <Text style={styles.statLbl}>Sessions</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statVal}>{stats.totalMinutes}</Text>
          <Text style={styles.statLbl}>Minuten</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statVal}>{stats.streak}</Text>
          <Text style={styles.statLbl}>Tage Streak</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Verlauf</Text>

      {sessions.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTxt}>Noch keine Sessions.</Text>
          <Text style={styles.emptySubTxt}>Los geht's!</Text>
        </View>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(s) => s.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <SessionRow session={item} />}
        />
      )}
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
  clearTxt: { color: '#663333', fontSize: 13 },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#1a1a2e',
  },
  statVal: { color: '#fff', fontSize: 28, fontWeight: '300' },
  statLbl: { color: '#446', fontSize: 11, marginTop: 4 },
  sectionLabel: { color: '#446', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', paddingHorizontal: 24, marginBottom: 12 },
  list: { paddingHorizontal: 24, paddingBottom: 40 },
  sessionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#0f0f1a',
  },
  sessionLeft: { flex: 1 },
  sessionName: { color: '#ccc', fontSize: 15 },
  sessionDate: { color: '#446', fontSize: 12, marginTop: 2 },
  sessionRight: { alignItems: 'flex-end' },
  sessionDur: { color: '#668', fontSize: 14, fontVariant: ['tabular-nums'] },
  sessionRounds: { color: '#334', fontSize: 11, marginTop: 2 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 80 },
  emptyTxt: { color: '#446', fontSize: 18 },
  emptySubTxt: { color: '#334', fontSize: 14, marginTop: 8 },
});
