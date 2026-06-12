import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../src/theme';
import { useT } from '../../src/i18n';

function TabIcon({ label, emoji, focused }: { label: string; emoji: string; focused: boolean }) {
  const c = useTheme();
  return (
    <View style={styles.iconWrap}>
      <Text style={[styles.emoji, { opacity: focused ? 1 : 0.35 }]}>{emoji}</Text>
      <Text style={[styles.label, { color: focused ? c.accent : c.textFaint }]}>{label}</Text>
    </View>
  );
}

export default function TabsLayout() {
  const c = useTheme();
  const t = useT();
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: c.surface,
          borderTopColor: c.border,
          borderTopWidth: 0.5,
          height: 62 + insets.bottom,
          paddingBottom: insets.bottom + 6,
          paddingTop: 6,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen name="home"
        options={{ tabBarIcon: ({ focused }) => <TabIcon label={t.tabHome} emoji="🫁" focused={focused} /> }} />
      <Tabs.Screen name="stats"
        options={{ tabBarIcon: ({ focused }) => <TabIcon label={t.tabStats} emoji="📊" focused={focused} /> }} />
      <Tabs.Screen name="settings"
        options={{ tabBarIcon: ({ focused }) => <TabIcon label={t.tabSettings} emoji="⚙️" focused={focused} /> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: { alignItems: 'center', justifyContent: 'center', width: 80 },
  emoji: { fontSize: 21 },
  label: { fontSize: 10, marginTop: 2 },
});
