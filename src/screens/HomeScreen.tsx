import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useBreathStore } from '../store/breathStore';
import { BreathTechnique } from '../types';
import { getTotalSeconds } from '../utils/pathGeometry';

const PHASE_COLORS: Record<string, string> = {
  up: '#378ADD',
  right: '#EF9F27',
  down: '#1D9E75',
};

function TechniqueCard({ item, onPress }: { item: BreathTechnique; onPress: () => void }) {
  const totalSecs = getTotalSeconds(item.phases);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.cardTop}>
        <Text style={styles.cardName}>{item.name}</Text>
        {item.isCustom && <View style={styles.customBadge}><Text style={styles.customBadgeTxt}>Eigene</Text></View>}
      </View>
      <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>

      <View style={styles.phasePills}>
        {item.phases.map((p, i) => (
          <View key={i} style={[styles.phasePill, { borderColor: PHASE_COLORS[p.direction] + '60', backgroundColor: PHASE_COLORS[p.direction] + '18' }]}>
            <Text style={[styles.pillTxt, { color: PHASE_COLORS[p.direction] }]}>{p.label} {p.seconds}s</Text>
          </View>
        ))}
      </View>

      <Text style={styles.cardSecs}>{totalSecs}s / Runde</Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { techniques, getStats } = useBreathStore();
  const stats = getStats();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>breathflow</Text>
        <TouchableOpacity onPress={() => router.push('/stats')} style={styles.statsBtn}>
          <Text style={styles.statsBtnTxt}>↗ Stats</Text>
        </TouchableOpacity>
      </View>

      {stats.totalSessions > 0 && (
        <View style={styles.statsRow}>
          <View style={styles.statChip}>
            <Text style={styles.statVal}>{stats.totalSessions}</Text>
            <Text style={styles.statLbl}>Sessions</Text>
          </View>
          <View style={styles.statChip}>
            <Text style={styles.statVal}>{stats.totalMinutes}</Text>
            <Text style={styles.statLbl}>Minuten</Text>
          </View>
          <View style={styles.statChip}>
            <Text style={styles.statVal}>{stats.streak}</Text>
            <Text style={styles.statLbl}>Tage Streak</Text>
          </View>
        </View>
      )}

      <FlatList
        data={techniques}
        keyExtractor={(t) => t.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.sectionTitle}>Techniken</Text>
            <TouchableOpacity onPress={() => router.push('/editor')} style={styles.addBtn}>
              <Text style={styles.addBtnTxt}>+ Neu</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <TechniqueCard item={item} onPress={() => router.push(`/session/${item.id}`)} />
        )}
      />
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
    paddingTop: 20,
    paddingBottom: 16,
  },
  logo: { color: '#fff', fontSize: 22, fontWeight: '300', letterSpacing: 2 },
  statsBtn: { padding: 8 },
  statsBtnTxt: { color: '#446', fontSize: 14 },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 16,
  },
  statChip: {
    flex: 1,
    backgroundColor: '#111120',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#1e1e3a',
  },
  statVal: { color: '#fff', fontSize: 20, fontWeight: '500' },
  statLbl: { color: '#446', fontSize: 11, marginTop: 2 },
  list: { paddingHorizontal: 24, paddingBottom: 40 },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: { color: '#556', fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' },
  addBtn: {
    backgroundColor: '#185FA510',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 0.5,
    borderColor: '#185FA540',
  },
  addBtnTxt: { color: '#378ADD', fontSize: 14 },
  card: {
    backgroundColor: '#0f0f1a',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: '#1a1a2e',
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  cardName: { color: '#ddd', fontSize: 18, fontWeight: '500', flex: 1 },
  customBadge: {
    backgroundColor: '#1D9E7520',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 0.5,
    borderColor: '#1D9E7550',
  },
  customBadgeTxt: { color: '#1D9E75', fontSize: 11 },
  cardDesc: { color: '#446', fontSize: 14, lineHeight: 20, marginBottom: 12 },
  phasePills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  phasePill: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 0.5,
  },
  pillTxt: { fontSize: 11, fontWeight: '500' },
  cardSecs: { color: '#333', fontSize: 12 },
});
