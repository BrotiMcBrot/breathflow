import React, { useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBreathStore } from '../store/breathStore';
import { BreathSession } from '../types';
import { useTheme, Colors } from '../theme';
import { useT, useLang, dateLocale } from '../i18n';
import { StatsCalendar } from '../components/StatsCalendar';

function formatDuration(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  if (m === 0) return `${s}s`;
  if (s === 0) return `${m} min`;
  return `${m}m ${s}s`;
}

function WeekChart({ sessions, c, title, locale }: { sessions: BreathSession[]; c: Colors; title: string; locale: string }) {
  const days = useMemo(() => {
    const result: { label: string; minutes: number; isToday: boolean }[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dayStr = d.toDateString();
      const mins = sessions
        .filter((s) => new Date(s.startedAt).toDateString() === dayStr)
        .reduce((a, s) => a + s.durationSeconds, 0) / 60;
      result.push({
        label: d.toLocaleDateString(locale, { weekday: 'short' }).slice(0, 2),
        minutes: Math.round(mins * 10) / 10,
        isToday: i === 0,
      });
    }
    return result;
  }, [sessions, locale]);

  const maxMins = Math.max(...days.map((d) => d.minutes), 1);

  return (
    <View style={[wc.card, { backgroundColor: c.surface, borderColor: c.border }]}>
      <Text style={[wc.title, { color: c.textFaint }]}>{title}</Text>
      <View style={wc.bars}>
        {days.map((d, i) => (
          <View key={i} style={wc.barCol}>
            <Text style={[wc.barVal, { color: d.minutes > 0 ? c.textMuted : 'transparent' }]}>
              {d.minutes >= 1 ? Math.round(d.minutes) : d.minutes > 0 ? '<1' : '0'}
            </Text>
            <View style={wc.barTrack}>
              <View style={[wc.barFill, {
                height: `${Math.max(4, (d.minutes / maxMins) * 100)}%`,
                backgroundColor: d.isToday ? c.accent : d.minutes > 0 ? c.accent + '70' : c.border,
              }]} />
            </View>
            <Text style={[wc.barLabel, { color: d.isToday ? c.accent : c.textFaint }]}>{d.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
const wc = StyleSheet.create({
  card: { borderRadius: 16, padding: 16, borderWidth: 0.5, marginBottom: 16 },
  title: { fontSize: 11, letterSpacing: 1, marginBottom: 12 },
  bars: { flexDirection: 'row', height: 110, gap: 8 },
  barCol: { flex: 1, alignItems: 'center' },
  barVal: { fontSize: 10, marginBottom: 4, fontVariant: ['tabular-nums'] },
  barTrack: { flex: 1, width: '100%', justifyContent: 'flex-end', borderRadius: 6, overflow: 'hidden' },
  barFill: { width: '100%', borderRadius: 6 },
  barLabel: { fontSize: 11, marginTop: 6 },
});

type ListItem =
  | { type: 'header'; key: string; label: string }
  | { type: 'session'; key: string; session: BreathSession };

export default function StatsScreen() {
  const c = useTheme();
  const t = useT();
  const lang = useLang();
  const locale = dateLocale(lang);
  const insets = useSafeAreaInsets();
  const { sessions, getStats, clearSessions } = useBreathStore();
  const stats = getStats();

  const formatDate = (ts: number): string => {
    const d = new Date(ts);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return t.today;
    if (d.toDateString() === yesterday.toDateString()) return t.yesterday;
    return d.toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short' });
  };
  const formatClock = (ts: number): string =>
    new Date(ts).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });

  // monthly + extended stats
  const extra = useMemo(() => {
    if (!sessions.length) return null;
    const now = new Date();
    const monthSessions = sessions.filter((s) => {
      const d = new Date(s.startedAt);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    });
    const monthActiveDays = new Set(monthSessions.map((s) => new Date(s.startedAt).getDate())).size;
    const monthMinutes = Math.round(monthSessions.reduce((a, s) => a + s.durationSeconds, 0) / 60);

    // best streak all-time
    const dayStrings = [...new Set(sessions.map((s) => {
      const d = new Date(s.startedAt);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    }))].map((str) => {
      const [y, m, dd] = str.split('-').map(Number);
      return new Date(y, m, dd).getTime();
    }).sort((a, b) => a - b);

    let bestStreak = 1, cur = 1;
    for (let i = 1; i < dayStrings.length; i++) {
      const diff = (dayStrings[i] - dayStrings[i - 1]) / 86400000;
      if (diff === 1) { cur++; bestStreak = Math.max(bestStreak, cur); }
      else cur = 1;
    }
    if (dayStrings.length === 0) bestStreak = 0;

    const longest = sessions.reduce((a, s) => (s.durationSeconds > a.durationSeconds ? s : a), sessions[0]);
    const counts: Record<string, { name: string; n: number }> = {};
    sessions.forEach((s) => {
      if (!counts[s.techniqueId]) counts[s.techniqueId] = { name: s.techniqueName, n: 0 };
      counts[s.techniqueId].n++;
    });
    const fav = Object.values(counts).sort((a, b) => b.n - a.n)[0];
    const avgSecs = Math.round(sessions.reduce((a, s) => a + s.durationSeconds, 0) / sessions.length);

    return { monthActiveDays, monthMinutes, bestStreak, longest, fav, avgSecs };
  }, [sessions]);

  const listData: ListItem[] = useMemo(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessions, lang]);

  const handleClear = () => {
    Alert.alert(t.clearTitle, t.clearMsg, [
      { text: t.cancel, style: 'cancel' },
      { text: t.clear, style: 'destructive', onPress: clearSessions },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.bg, paddingTop: insets.top + 8 }}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: c.text }]}>{t.statistics}</Text>
        {sessions.length > 0 && (
          <TouchableOpacity onPress={handleClear}>
            <Text style={{ color: c.danger, fontSize: 13 }}>{t.clear}</Text>
          </TouchableOpacity>
        )}
      </View>

      {sessions.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🫁</Text>
          <Text style={[styles.emptyTxt, { color: c.textMuted }]}>{t.noSessions}</Text>
          <Text style={[styles.emptySub, { color: c.textFaint }]}>{t.noSessionsSub}</Text>
        </View>
      ) : (
        <FlatList
          data={listData}
          keyExtractor={(item) => item.key}
          contentContainerStyle={[styles.list, { paddingBottom: 24 }]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              <View style={styles.statsGrid}>
                {[
                  { val: `🔥 ${stats.streak}`, lbl: t.dayStreak },
                  { val: stats.totalSessions, lbl: t.sessions },
                  { val: stats.totalMinutes, lbl: t.minutes },
                ].map(({ val, lbl }) => (
                  <View key={lbl} style={[styles.statCard, { backgroundColor: c.surface, borderColor: c.border }]}>
                    <Text style={[styles.statVal, { color: c.text }]}>{val}</Text>
                    <Text style={[styles.statLbl, { color: c.textMuted }]}>{lbl}</Text>
                  </View>
                ))}
              </View>

              {/* Calendar */}
              <StatsCalendar sessions={sessions} c={c} lang={lang} />

              {/* Monthly progress numbers */}
              {extra && (
                <View style={styles.monthGrid}>
                  <View style={[styles.monthCard, { backgroundColor: c.surface, borderColor: c.border }]}>
                    <Text style={[styles.monthVal, { color: c.accent }]}>{extra.monthActiveDays}</Text>
                    <Text style={[styles.monthLbl, { color: c.textMuted }]}>{t.activeDays}{'\n'}{t.thisMonth}</Text>
                  </View>
                  <View style={[styles.monthCard, { backgroundColor: c.surface, borderColor: c.border }]}>
                    <Text style={[styles.monthVal, { color: c.accent }]}>{extra.monthMinutes}</Text>
                    <Text style={[styles.monthLbl, { color: c.textMuted }]}>{t.monthMinutes}{'\n'}{t.thisMonth}</Text>
                  </View>
                  <View style={[styles.monthCard, { backgroundColor: c.surface, borderColor: c.border }]}>
                    <Text style={[styles.monthVal, { color: c.accent }]}>{extra.bestStreak}</Text>
                    <Text style={[styles.monthLbl, { color: c.textMuted }]}>{t.bestStreak}{'\n'}({t.days})</Text>
                  </View>
                </View>
              )}

              <WeekChart sessions={sessions} c={c} title={t.last7Days} locale={locale} />

              {extra && (
                <View style={[styles.extraCard, { backgroundColor: c.surface, borderColor: c.border }]}>
                  <View style={[styles.extraRow, { borderBottomColor: c.border }]}>
                    <Text style={[styles.extraLbl, { color: c.textMuted }]}>{t.favTechnique}</Text>
                    <Text style={[styles.extraVal, { color: c.textSec }]}>{extra.fav.name} ({extra.fav.n}×)</Text>
                  </View>
                  <View style={[styles.extraRow, { borderBottomColor: c.border }]}>
                    <Text style={[styles.extraLbl, { color: c.textMuted }]}>{t.longestSession}</Text>
                    <Text style={[styles.extraVal, { color: c.textSec }]}>{formatDuration(extra.longest.durationSeconds)}</Text>
                  </View>
                  <View style={styles.extraRowLast}>
                    <Text style={[styles.extraLbl, { color: c.textMuted }]}>{t.avgSession}</Text>
                    <Text style={[styles.extraVal, { color: c.textSec }]}>{formatDuration(extra.avgSecs)}</Text>
                  </View>
                </View>
              )}

              <Text style={[styles.historyTitle, { color: c.textFaint }]}>{t.history}</Text>
            </>
          }
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
                    <Text style={[styles.rowTime, { color: c.textMuted }]}>{formatClock(session.startedAt)}</Text>
                  </View>
                </View>
                <View style={styles.rowRight}>
                  <Text style={[styles.rowDur, { color: c.textMuted }]}>{formatDuration(session.durationSeconds)}</Text>
                  {session.roundsCompleted > 0 && (
                    <Text style={[styles.rowRounds, { color: c.textFaint }]}>{session.roundsCompleted} {t.cyclesWord}</Text>
                  )}
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 14 },
  title: { fontSize: 22, fontWeight: '300', letterSpacing: 2 },
  list: { paddingHorizontal: 20 },
  statsGrid: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: { flex: 1, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 0.5 },
  statVal: { fontSize: 22, fontWeight: '400' },
  statLbl: { fontSize: 11, marginTop: 3 },
  monthGrid: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  monthCard: { flex: 1, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 0.5 },
  monthVal: { fontSize: 24, fontWeight: '300' },
  monthLbl: { fontSize: 10.5, marginTop: 4, textAlign: 'center', lineHeight: 14 },
  extraCard: { borderRadius: 16, paddingHorizontal: 16, borderWidth: 0.5, marginBottom: 20 },
  extraRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 13, borderBottomWidth: 0.5 },
  extraRowLast: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 13 },
  extraLbl: { fontSize: 13.5 },
  extraVal: { fontSize: 13.5, fontWeight: '500' },
  historyTitle: { fontSize: 11, letterSpacing: 1, marginBottom: 4 },
  dateHeader: { paddingTop: 16, paddingBottom: 6 },
  dateHeaderTxt: { fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 13, borderBottomWidth: 0.5 },
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
  emptySub: { fontSize: 14, marginTop: 8, textAlign: 'center', paddingHorizontal: 40 },
});
