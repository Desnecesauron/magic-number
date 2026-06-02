import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Guess } from '../lib/game';
import { Colors, radius, shadows, spacing, typography } from '../theme';

interface Props {
  guess: Guess;
  colors: Colors;
}

export function GuessCard({ guess, colors }: Props) {
  const translateY = useSharedValue(-16);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.92);

  useEffect(() => {
    translateY.value = withSpring(0, { damping: 16, stiffness: 220 });
    opacity.value = withTiming(1, { duration: 180 });
    scale.value = withSpring(1, { damping: 14, stiffness: 220 });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  const isCorrect = guess.result === 'correct';
  const isAbove = guess.result === 'above';

  const bgColor = isCorrect
    ? colors.successLight
    : isAbove
      ? colors.guessAbove
      : colors.guessBelow;

  const textColor = isCorrect
    ? colors.success
    : isAbove
      ? colors.guessAboveText
      : colors.guessBelowText;

  const iconName: React.ComponentProps<typeof Ionicons>['name'] = isCorrect
    ? 'checkmark-circle'
    : isAbove
      ? 'arrow-up-circle'
      : 'arrow-down-circle';

  const hintText = isCorrect
    ? 'acertou!'
    : isAbove
      ? 'acima do número'
      : 'abaixo do número';

  return (
    <Animated.View
      style={[
        styles.card,
        animStyle,
        { backgroundColor: bgColor, borderColor: textColor + '44' },
        shadows.sm,
      ]}
      accessibilityLabel={`${guess.value.toLocaleString('pt-BR')} — ${hintText}`}
    >
      <Text style={[styles.value, { color: textColor }]}>
        {guess.value.toLocaleString('pt-BR')}
      </Text>
      <Text style={[styles.hint, { color: textColor }]}>— {hintText}</Text>
      <Ionicons name={iconName} size={20} color={textColor} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  value: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    minWidth: 72,
  },
  hint: {
    flex: 1,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
});
