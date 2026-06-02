import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Colors, radius, shadows, spacing, typography } from '../theme';
import { strings } from '../i18n/pt';

interface Props {
  value: number | null; // null = hidden
  revealed: boolean;
  won: boolean;
  colors: Colors;
  rangeMax: number;
}

export function MagicDisplay({ value, revealed, won, colors, rangeMax }: Props) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (won || revealed) {
      // Reveal pop animation
      scale.value = withSequence(
        withSpring(1.15, { damping: 8, stiffness: 300 }),
        withSpring(1, { damping: 10, stiffness: 200 }),
      );
    }
  }, [won, revealed, scale]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const displayText =
    won || revealed ? (value ?? strings.game.unknown).toLocaleString('pt-BR') : strings.game.unknown;

  const borderColor = won
    ? colors.success
    : revealed
      ? colors.error
      : colors.border;

  const numberColor = won
    ? colors.success
    : revealed
      ? colors.error
      : colors.textSecondary;

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        {strings.game.chosenNumber}
      </Text>
      <Animated.View
        style={[
          styles.box,
          animStyle,
          { backgroundColor: colors.surface, borderColor },
          shadows.md,
        ]}
      >
        <Text
          style={[styles.number, { color: numberColor }]}
          accessibilityLabel={
            won || revealed ? `Número: ${displayText}` : 'Número oculto'
          }
        >
          {displayText}
        </Text>
      </Animated.View>
      <Text style={[styles.range, { color: colors.textSecondary }]}>
        {strings.game.range(rangeMax)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  box: {
    width: 160,
    height: 100,
    borderRadius: radius.xl,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    fontSize: typography.sizes['4xl'],
    fontWeight: typography.weights.extrabold,
    letterSpacing: -1,
  },
  range: {
    fontSize: typography.sizes.sm,
  },
});
