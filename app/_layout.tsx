import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { SettingsProvider, useSettings } from '../context/SettingsContext';
import { colors } from '../theme';

function Layout() {
  const { theme } = useSettings();
  const raw = useColorScheme();
  const system: 'light' | 'dark' = raw === 'dark' ? 'dark' : 'light';
  const scheme = theme === 'system' ? system : theme;
  const c = colors[scheme];

  return (
    <>
      <StatusBar style={c.statusBar} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: c.background },
          animation: 'slide_from_right',
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <Layout />
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
