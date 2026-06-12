import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useSettingsStore } from '../src/store/settingsStore';

export default function RootLayout() {
  const theme = useSettingsStore((s) => s.theme);
  return (
    <SafeAreaProvider>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme === 'dark' ? '#0a0a0f' : '#f0f4f8' },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="session/[id]" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="editor" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
