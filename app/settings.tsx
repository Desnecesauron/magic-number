import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { ThemePreference, useSettings } from '../context/SettingsContext';
import { strings } from '../i18n/pt';
import { radius, shadows, spacing, typography } from '../theme';

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: strings.settings.themeSystem },
  { value: 'light', label: strings.settings.themeLight },
  { value: 'dark', label: strings.settings.themeDark },
];

export default function SettingsScreen() {
  const { colors } = useTheme();
  const { sound, haptics, theme, setSound, setHaptics, setTheme } = useSettings();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel={strings.common.back}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{strings.settings.title}</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Toggles */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }, shadows.sm]}>
          <ToggleRow
            label={strings.settings.sound}
            description={strings.settings.soundDesc}
            value={sound}
            onToggle={setSound}
            colors={colors}
            icon="musical-notes-outline"
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <ToggleRow
            label={strings.settings.haptics}
            description={strings.settings.hapticsDesc}
            value={haptics}
            onToggle={setHaptics}
            colors={colors}
            icon="phone-portrait-outline"
          />
        </View>

        {/* Theme */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }, shadows.sm]}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
            {strings.settings.theme.toUpperCase()}
          </Text>
          {THEME_OPTIONS.map(({ value, label }, i) => (
            <React.Fragment key={value}>
              {i > 0 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
              <Pressable
                onPress={() => setTheme(value)}
                style={({ pressed }) => [styles.themeRow, pressed && { opacity: 0.7 }]}
                accessibilityRole="radio"
                accessibilityState={{ checked: theme === value }}
              >
                <Text style={[styles.themeLabel, { color: colors.text }]}>{label}</Text>
                {theme === value && (
                  <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                )}
              </Pressable>
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ToggleRow({
  label,
  description,
  value,
  onToggle,
  colors,
  icon,
}: {
  label: string;
  description: string;
  value: boolean;
  onToggle: (v: boolean) => void;
  colors: ReturnType<typeof useTheme>['colors'];
  icon: React.ComponentProps<typeof Ionicons>['name'];
}) {
  return (
    <View style={styles.toggleRow}>
      <Ionicons name={icon} size={22} color={colors.primary} />
      <View style={styles.toggleText}>
        <Text style={[styles.toggleLabel, { color: colors.text }]}>{label}</Text>
        <Text style={[styles.toggleDesc, { color: colors.textSecondary }]}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor="#FFFFFF"
        accessibilityLabel={label}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: spacing.sm,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    textAlign: 'center',
  },
  scroll: {
    padding: spacing.xl,
    gap: spacing.md,
    paddingBottom: spacing['5xl'],
  },
  section: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    paddingHorizontal: spacing.xl,
  },
  sectionLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    letterSpacing: 0.5,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  divider: {
    height: 1,
    marginLeft: spacing.xl,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.lg,
  },
  toggleText: {
    flex: 1,
    gap: 2,
  },
  toggleLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  toggleDesc: {
    fontSize: typography.sizes.sm,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
  },
  themeLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
});
