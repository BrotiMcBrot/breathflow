import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BreathSession } from '../types';
import { Colors } from '../theme';
import { Lang, dateLocale } from '../i18n';

interface Props {
  sessions: BreathSession[];
  c: Colors;
  lang: Lang;
}

export function StatsCalendar({ sessions, c, lang }: Props) {
  const [monthOffset, setMonthOffset] = useState(0);

  const { weeks, monthLabel, activeDaySet } = useMemo(() => {
    const now = new Date();
    const viewDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const active = new Set(
      sessions
        .filter((s) => {
          const d = new Date(s.startedAt);
          return d.getFullYear() === year && d.getMonth() === month;
        })
        .map((s) => new Date(s.startedAt).getDate())
    );

    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // Monday-first index
    const startIdx = (firstDay.getDay() + 6) % 7;

    const cells: (number | null)[] = [
      ...Array(startIdx).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];
    while (cells.length % 7 !== 0) cells.push(null);
    const wk: (number | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) wk.push(cells.slice(i, i + 7));

    return {
      weeks: wk,
      monthLabel: viewDate.toLocaleDateString(dateLocale(lang), { month: 'long', year: 'numeric' }),
      activeDaySet: active,
    };
  }, [sessions, monthOffset, lang]);

  const now = new Date();
  const isCurrentMonth = monthOffset === 0;
  const todayDate = now.getDate();

  const weekdays = useMemo(() => {
    // Monday-first short labels
    const base = new Date(2024, 0, 1); // a Monday
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return d.toLocaleDateString(dateLocale(lang), { weekday: 'short' }).slice(0, 2);
    });
  }, [lang]);

  return (
    <View style={[s.card, { backgroundColor: c.surface, borderColor: c.border }]}>
      <View style={s.head}>
        <TouchableOpacity onPress={() => setMonthOffset((m) => m - 1)} style={s.navBtn}>
          <Text style={[s.navTxt, { color: c.textMuted }]}>‹</Text>
        </TouchableOpacity>
        <Text style={[s.monthLabel, { color: c.textSec }]}>{monthLabel}</Text>
        <TouchableOpacity
          onPress={() => setMonthOffset((m) => Math.min(0, m + 1))}
          style={s.navBtn}
          disabled={isCurrentMonth}
        >
          <Text style={[s.navTxt, { color: isCurrentMonth ? c.border : c.textMuted }]}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={s.weekRow}>
        {weekdays.map((w, i) => (
          <Text key={i} style={[s.weekday, { color: c.textFaint }]}>{w}</Text>
        ))}
      </View>

      {weeks.map((week, wi) => (
        <View key={wi} style={s.weekRow}>
          {week.map((day, di) => {
            if (day === null) return <View key={di} style={s.dayCell} />;
            const isActive = activeDaySet.has(day);
            const isToday = isCurrentMonth && day === todayDate;
            return (
              <View key={di} style={s.dayCell}>
                <View style={[
                  s.dayDot,
                  isActive && { backgroundColor: c.accent },
                  isToday && !isActive && { borderWidth: 1.5, borderColor: c.accent },
                ]}>
                  <Text style={[
                    s.dayTxt,
                    { color: isActive ? '#fff' : isToday ? c.accent : c.textMuted },
                  ]}>{day}</Text>
                </View>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  card: { borderRadius: 16, padding: 14, borderWidth: 0.5, marginBottom: 16 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  navBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  navTxt: { fontSize: 24, lineHeight: 28 },
  monthLabel: { fontSize: 15, fontWeight: '500', textTransform: 'capitalize' },
  weekRow: { flexDirection: 'row', marginBottom: 2 },
  weekday: { flex: 1, textAlign: 'center', fontSize: 10.5, paddingBottom: 4, textTransform: 'uppercase' },
  dayCell: { flex: 1, alignItems: 'center', paddingVertical: 2.5 },
  dayDot: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  dayTxt: { fontSize: 12.5, fontVariant: ['tabular-nums'] },
});
