import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../src/theme';

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
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: c.surface,
          borderTopColor: c.border,
          borderTopWidth: 0.5,
          height: 72,
          paddingBottom: 8,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="Übungen" emoji="🫁" focused={focused} /> }}
      />
      <Tabs.Screen
        name="stats"
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="Verlauf" emoji="📊" focused={focused} /> }}
      />
      <Tabs.Screen
        name="settings"
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="Einstellung" emoji="⚙️" focused={focused} /> }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: { alignItems: 'center', paddingTop: 4 },
  emoji: { fontSize: 22 },
  label: { fontSize: 10, marginTop: 3 },
});
