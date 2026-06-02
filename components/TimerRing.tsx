import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  progress: number;     // 1.0 = full (start), 0.0 = empty (time up)
  timeRemaining: number; // seconds, displayed in center
  size?: number;
  strokeWidth?: number;
}

export function TimerRing({
  progress,
  timeRemaining,
  size = 120,
  strokeWidth = 8,
}: Props) {
  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  // Animated stroke-dashoffset
  const animatedOffset = useDerivedValue(() =>
    withTiming(circumference * (1 - progress), { duration: 120 }),
  );

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: animatedOffset.value,
  }));

  // Color: green → amber → red
  const ringColor =
    progress > 0.5 ? '#10B981' : progress > 0.25 ? '#F59E0B' : '#EF4444';

  const secs = Math.ceil(timeRemaining);

  return (
    <View
      style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}
      accessibilityLabel={`Tempo restante: ${secs} segundos`}
    >
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        {/* Track */}
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#D1D5DB"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc — starts at top (−90°) */}
        <AnimatedCircle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          rotation={-90}
          originX={cx}
          originY={cy}
        />
      </Svg>

      {/* Center text */}
      <Text style={[styles.seconds, { color: ringColor }]}>{secs}</Text>
      <Text style={styles.label}>seg</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  seconds: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -1,
    lineHeight: 34,
  },
  label: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});
