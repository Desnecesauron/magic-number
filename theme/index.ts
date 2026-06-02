export const palette = {
  violet: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6',
    600: '#7C3AED',
    700: '#6D28D9',
    900: '#2D1B69',
  },
  amber: {
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
  },
  emerald: {
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    900: '#064E3B',
  },
  red: {
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    900: '#450A0A',
  },
  blue: {
    400: '#60A5FA',
    700: '#1D4ED8',
    900: '#1E3A5F',
  },
  navy: {
    900: '#0D0B1E',
    800: '#1A1730',
    700: '#241F42',
    600: '#2E2755',
  },
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
};

const lightColors = {
  background: '#F0EDFF',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  primary: palette.violet[600],
  primaryLight: palette.violet[100],
  primaryText: '#FFFFFF',
  accent: palette.amber[500],
  success: palette.emerald[500],
  successLight: '#D1FAE5',
  error: palette.red[500],
  errorLight: '#FEE2E2',
  text: palette.gray[900],
  textSecondary: palette.gray[500],
  textDisabled: palette.gray[300],
  border: palette.gray[200],
  timerTrack: palette.gray[200],
  guessAbove: '#FEE2E2',
  guessBelow: '#DBEAFE',
  guessAboveText: palette.red[600],
  guessBelowText: palette.blue[700],
  statusBar: 'dark' as 'light' | 'dark',
};

const darkColors = {
  background: palette.navy[900],
  surface: palette.navy[800],
  card: palette.navy[700],
  primary: palette.violet[400],
  primaryLight: palette.navy[700],
  primaryText: '#FFFFFF',
  accent: palette.amber[400],
  success: palette.emerald[400],
  successLight: palette.emerald[900],
  error: palette.red[400],
  errorLight: palette.red[900],
  text: palette.gray[50],
  textSecondary: palette.gray[400],
  textDisabled: palette.gray[700],
  border: palette.navy[600],
  timerTrack: palette.gray[700],
  guessAbove: palette.red[900],
  guessBelow: palette.blue[900],
  guessAboveText: palette.red[400],
  guessBelowText: palette.blue[400],
  statusBar: 'light' as 'light' | 'dark',
};

export type Colors = typeof lightColors;

export const colors = {
  light: lightColors,
  dark: darkColors,
};

export const typography = {
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 64,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
};
