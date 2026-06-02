import { useColorScheme } from 'react-native';
import { colors, Colors } from '../theme';
import { useSettings } from '../context/SettingsContext';

export function useTheme(): { colors: Colors; scheme: 'light' | 'dark' } {
  const { theme } = useSettings();
  const raw = useColorScheme();
  const system: 'light' | 'dark' = raw === 'dark' ? 'dark' : 'light';
  const scheme = theme === 'system' ? system : theme;
  return { colors: colors[scheme], scheme };
}
