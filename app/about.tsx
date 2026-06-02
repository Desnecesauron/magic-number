import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { strings } from '../i18n/pt';
import { radius, shadows, spacing, typography } from '../theme';

export default function AboutScreen() {
  const { colors } = useTheme();
  const { about } = strings;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel={strings.common.back}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{about.title}</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Icon */}
        <View style={styles.iconRow}>
          <Text style={styles.hat}>🎩</Text>
        </View>

        {/* Sections */}
        {about.sections.map((s) => (
          <View
            key={s.heading}
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, shadows.sm]}
          >
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>{s.heading}</Text>
            <Text style={[styles.sectionBody, { color: colors.text }]}>{s.body}</Text>
          </View>
        ))}

        {/* Credits */}
        <View
          style={[
            styles.card,
            styles.creditsCard,
            { backgroundColor: colors.primaryLight, borderColor: colors.primary + '33' },
            shadows.sm,
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>{about.credits}</Text>
          <Text style={[styles.creditsText, { color: colors.text }]}>{about.creditsText}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  iconRow: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  hat: {
    fontSize: 56,
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  creditsCard: {
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionBody: {
    fontSize: typography.sizes.md,
    lineHeight: 22,
  },
  creditsText: {
    fontSize: typography.sizes.md,
    lineHeight: 22,
    textAlign: 'center',
  },
});
