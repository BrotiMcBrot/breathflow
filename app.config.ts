import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'BreathFlow',
  slug: 'breathflow',
  version: '0.1.0',
  orientation: 'portrait',
  icon: './src/assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    backgroundColor: '#0a0a0f',
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.breathflow.app',
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#0a0a0f',
    },
    package: 'com.breathflow.app',
  },
  plugins: [
    'expo-router',
    'expo-font',
    [
      'react-native-reanimated',
      { globals: ['__scanCodes'] }
    ]
  ],
  experiments: {
    typedRoutes: true,
  },
});
