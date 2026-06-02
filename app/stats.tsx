import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useTheme } from '../hooks/useTheme';
import { strings } from '../i18n/pt';
import { AllStats, clearStats, loadStats } from '../lib/storage';
import { GameMode } from '../lib/game';
import { radius, shadows, spacing, typography } from '../theme';

const MODE_LABELS: Record<GameMode, string> = {
  easy: strings.menu.modes.easy,
  medium: strings.menu.modes.medium,
  hard: strings.menu.modes.hard,
  'time-rush-easy': strings.menu.modes.timeRushEasy,
  'time-rush-hard': strings.menu.modes.timeRushHard,
};

const MODE_ORDER: GameMode[] = [
  'easy',
  'medium',
  'hard',
  'time-rush-easy',
  'time-rush-hard',
];

export default function StatsScreen() {
  const { colors } = useTheme();
  const [stats, setStats] = useState<AllStats | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadStats().then(setStats);
    }, []),
  );

  function handleClear() {
    Alert.alert(
      strings.stats.clearConfirm,
      strings.stats.clearConfirmMsg,
      [
        { text: strings.stats.clearCancel, style: 'cancel' },
        {
          text: strings.stats.clearConfirmBtn,
          style: 'destructive',
          onPress: async () => {
            await clearStats();
            setStats(await loadStats());
          },
        },
      ],
    );
  }

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
        <Text style={[styles.headerTitle, { color: colors.text }]}>{strings.stats.title}</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {MODE_ORDER.map((mode) => {
          const s = stats?.[mode];
          const isTimed = mode.startsWith('time-rush');
          return (
            <View
              key={mode}
              style={[
                styles.card,
                { backgroundColor: colors.surface, borderColor: colors.border },
                shadows.sm,
              ]}
            >
              <Text style={[styles.modeName, { color: colors.text }]}>{MODE_LABELS[mode]}</Text>
              <View style={styles.row}>
                <StatItem
                  label={strings.stats.gamesPlayed}
                  value={s?.gamesPlayed ? String(s.gamesPlayed) : strings.stats.noRecord}
                  colors={colors}
                />
                <StatItem
                  label={strings.stats.bestAttempts}
                  value={
                    s?.bestAttempts != null
                      ? strings.stats.attempts(s.bestAttempts)
                      : strings.stats.noRecord
                  }
                  colors={colors}
                />
                {isTimed && (
                  <StatItem
                    label={strings.stats.bestTime}
                    value={
                      s?.bestTime != null
                        ? strings.stats.seconds(s.bestTime)
                        : strings.stats.noRecord
                    }
                    colors={colors}
                  />
                )}
              </View>
            </View>
          );
        })}

        <Pressable
          onPress={handleClear}
          style={({ pressed }) => [
            styles.clearBtn,
            { borderColor: colors.error },
            pressed && { opacity: 0.7 },
          ]}
          accessibilityRole="button"
          accessibilityLabel={strings.stats.clear}
        >
          <Ionicons name="trash-outline" size={18} color={colors.error} />
          <Text style={[styles.clearLabel, { color: colors.error }]}>{strings.stats.clear}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatItem({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <View style={styles.statItem}>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
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
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.xl,
    gap: spacing.md,
  },
  modeName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
  statItem: {
    flex: 1,
    gap: 2,
  },
  statValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    marginTop: spacing.md,
  },
  clearLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
});
