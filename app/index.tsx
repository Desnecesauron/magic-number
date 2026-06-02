import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { strings } from '../i18n/pt';
import { radius, shadows, spacing, typography } from '../theme';
import { GameMode } from '../lib/game';

const MODES: { mode: GameMode; label: string; desc: string; timed: boolean }[] = [
  { mode: 'easy', label: strings.menu.modes.easy, desc: strings.menu.modeDesc.easy, timed: false },
  { mode: 'medium', label: strings.menu.modes.medium, desc: strings.menu.modeDesc.medium, timed: false },
  { mode: 'hard', label: strings.menu.modes.hard, desc: strings.menu.modeDesc.hard, timed: false },
  { mode: 'time-rush-easy', label: strings.menu.modes.timeRushEasy, desc: strings.menu.modeDesc.timeRushEasy, timed: true },
  { mode: 'time-rush-hard', label: strings.menu.modes.timeRushHard, desc: strings.menu.modeDesc.timeRushHard, timed: true },
];

export default function MenuScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.hat}>🎩</Text>
          <Text style={styles.sparkle}>✨</Text>
          <Text style={[styles.title, { color: colors.text }]}>
            {strings.menu.welcome}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {strings.menu.subtitle}
          </Text>
        </View>

        {/* Mode buttons */}
        <View style={styles.modes}>
          {MODES.map(({ mode, label, desc, timed }) => (
            <Pressable
              key={mode}
              onPress={() => router.push({ pathname: '/game', params: { mode } })}
              accessibilityLabel={`${label}: ${desc}`}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.modeCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: timed ? colors.accent + '66' : colors.border,
                },
                shadows.md,
                pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
              ]}
            >
              <View style={styles.modeLeft}>
                {timed && (
                  <Ionicons
                    name="timer-outline"
                    size={18}
                    color={colors.accent}
                    style={styles.modeIcon}
                  />
                )}
                <View>
                  <Text style={[styles.modeLabel, { color: colors.text }]}>{label}</Text>
                  <Text style={[styles.modeDesc, { color: colors.textSecondary }]}>{desc}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </Pressable>
          ))}
        </View>

        {/* Bottom nav */}
        <View style={styles.nav}>
          <NavButton
            icon="bar-chart-outline"
            label={strings.menu.stats}
            onPress={() => router.push('/stats')}
            colors={colors}
          />
          <NavButton
            icon="settings-outline"
            label={strings.menu.settings}
            onPress={() => router.push('/settings')}
            colors={colors}
          />
          <NavButton
            icon="information-circle-outline"
            label={strings.menu.about}
            onPress={() => router.push('/about')}
            colors={colors}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function NavButton({
  icon,
  label,
  onPress,
  colors,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.navBtn,
        { backgroundColor: colors.surface, borderColor: colors.border },
        shadows.sm,
        pressed && { opacity: 0.8 },
      ]}
    >
      <Ionicons name={icon} size={22} color={colors.primary} />
      <Text style={[styles.navLabel, { color: colors.textSecondary }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    padding: spacing.xl,
    paddingBottom: spacing['5xl'],
    gap: spacing['2xl'],
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing['2xl'],
    gap: spacing.xs,
  },
  hat: {
    fontSize: 64,
    lineHeight: 72,
  },
  sparkle: {
    fontSize: 24,
    position: 'absolute',
    top: 8,
    right: '30%',
  },
  title: {
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.weights.extrabold,
    textAlign: 'center',
    lineHeight: 38,
    marginTop: spacing.md,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    marginTop: spacing.xs,
  },
  modes: {
    gap: spacing.md,
  },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: 1.5,
  },
  modeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
  },
  modeIcon: {
    marginRight: spacing.xs,
  },
  modeLabel: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
  },
  modeDesc: {
    fontSize: typography.sizes.sm,
    marginTop: 2,
  },
  nav: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  navBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.xs,
    minHeight: 60,
  },
  navLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    textAlign: 'center',
  },
});
