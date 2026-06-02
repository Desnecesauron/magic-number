import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useGame } from '../hooks/useGame';
import { useTheme } from '../hooks/useTheme';
import { useSettings } from '../context/SettingsContext';
import { GuessCard } from '../components/GuessCard';
import { MagicDisplay } from '../components/MagicDisplay';
import { TimerRing } from '../components/TimerRing';
import { PrimaryButton } from '../components/PrimaryButton';
import { strings } from '../i18n/pt';
import { radius, shadows, spacing, typography } from '../theme';
import { GameMode, GAME_MODES, isTimedMode, validateGuess } from '../lib/game';

const MODE_LABELS: Record<GameMode, string> = {
  easy: strings.menu.modes.easy,
  medium: strings.menu.modes.medium,
  hard: strings.menu.modes.hard,
  'time-rush-easy': strings.menu.modes.timeRushEasy,
  'time-rush-hard': strings.menu.modes.timeRushHard,
};

export default function GameScreen() {
  const { mode: modeParam } = useLocalSearchParams<{ mode: string }>();
  const mode = (modeParam ?? 'easy') as GameMode;
  const config = GAME_MODES[mode];
  const timed = isTimedMode(mode);

  const { colors } = useTheme();
  const { haptics } = useSettings();

  const { state, start, guess, reveal, reset } = useGame(mode);

  const [input, setInput] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);
  const [showReady, setShowReady] = useState(timed); // "Pronto?" dialog for Time Rush
  const [showConfetti, setShowConfetti] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Trigger confetti on win
  useEffect(() => {
    if (state.status === 'won') {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  }, [state.status]);

  // Start non-timed game immediately
  useEffect(() => {
    if (!timed && state.status === 'idle') {
      start();
    }
  }, [timed, state.status, start]);

  function handleGuess() {
    const raw = input.trim();
    const value = parseInt(raw, 10);
    const error = validateGuess(value, config);
    if (error) {
      setInputError(error);
      return;
    }
    setInputError(null);
    setInput('');

    const result = guess(value);
    if (haptics) {
      if (result === 'correct') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }

    // Keep focus on input for quick re-guessing
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function handleDiscover() {
    Alert.alert(
      strings.game.confirmDiscover,
      strings.game.confirmDiscoverMsg,
      [
        { text: strings.game.cancel, style: 'cancel' },
        {
          text: strings.game.confirmDiscoverBtn,
          style: 'destructive',
          onPress: reveal,
        },
      ],
    );
  }

  function handleReset() {
    reset();
    setInput('');
    setInputError(null);
    if (timed) setShowReady(true);
    else start();
  }

  const isPlaying = state.status === 'playing';
  const isWon = state.status === 'won';
  const isLost = state.status === 'lost';
  const isRevealed = state.status === 'revealed';
  const gameOver = isWon || isLost || isRevealed;

  const progress =
    timed && state.timeRemaining !== null && config.timeLimit !== null
      ? state.timeRemaining / config.timeLimit
      : 1;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable
          onPress={() => router.back()}
          style={styles.headerBtn}
          accessibilityLabel={strings.game.back}
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>

        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          {MODE_LABELS[mode] ?? 'Jogo'}
        </Text>

        <View style={styles.headerActions}>
          {!gameOver && (
            <Pressable
              onPress={handleDiscover}
              style={styles.headerBtn}
              accessibilityLabel={strings.game.discover}
              accessibilityRole="button"
            >
              <Ionicons name="eye-outline" size={22} color={colors.textSecondary} />
            </Pressable>
          )}
          <Pressable
            onPress={handleReset}
            style={styles.headerBtn}
            accessibilityLabel={strings.game.reset}
            accessibilityRole="button"
          >
            <Ionicons name="refresh-outline" size={22} color={colors.textSecondary} />
          </Pressable>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Timer ring for Time Rush */}
        {timed && isPlaying && state.timeRemaining !== null && (
          <View style={styles.timerRow}>
            <TimerRing
              progress={progress}
              timeRemaining={state.timeRemaining}
              size={100}
              strokeWidth={7}
            />
          </View>
        )}

        {/* Number display */}
        <MagicDisplay
          value={state.secretNumber}
          revealed={isRevealed}
          won={isWon}
          colors={colors}
          rangeMax={config.max}
        />

        {/* Guess list */}
        <FlatList
          data={[...state.guesses].reverse()}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item }) => <GuessCard guess={item} colors={colors} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {strings.game.historyEmpty}
            </Text>
          }
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />

        {/* Input bar */}
        {!gameOver && (
          <View
            style={[
              styles.inputBar,
              { backgroundColor: colors.surface, borderTopColor: colors.border },
              shadows.md,
            ]}
          >
            {inputError && (
              <Text style={[styles.inputError, { color: colors.error }]}>{inputError}</Text>
            )}
            <View style={styles.inputRow}>
              <TextInput
                ref={inputRef}
                value={input}
                onChangeText={(t) => {
                  setInput(t.replace(/[^0-9]/g, ''));
                  if (inputError) setInputError(null);
                }}
                onSubmitEditing={handleGuess}
                placeholder={strings.game.inputPlaceholder}
                placeholderTextColor={colors.textSecondary}
                keyboardType="number-pad"
                returnKeyType="done"
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.background,
                    color: colors.text,
                    borderColor: inputError ? colors.error : colors.border,
                  },
                ]}
                accessibilityLabel={strings.game.inputPlaceholder}
                editable={isPlaying}
                maxLength={6}
              />
              <PrimaryButton
                label={strings.game.shoot}
                onPress={handleGuess}
                colors={colors}
                disabled={!isPlaying || input.trim() === ''}
                style={styles.shootBtn}
              />
            </View>
          </View>
        )}
      </KeyboardAvoidingView>

      {/* Victory overlay */}
      {isWon && (
        <View style={[styles.overlay, { backgroundColor: colors.background + 'EE' }]}>
          {showConfetti && (
            <ConfettiCannon
              count={180}
              origin={{ x: 200, y: -10 }}
              autoStart
              fadeOut
            />
          )}
          <Text style={styles.overlayEmoji}>🎉</Text>
          <Text style={[styles.overlayTitle, { color: colors.success }]}>
            {strings.game.won}
          </Text>
          <Text style={[styles.overlayNumber, { color: colors.text }]}>
            {state.secretNumber.toLocaleString('pt-BR')}
          </Text>
          <Text style={[styles.overlayStat, { color: colors.textSecondary }]}>
            {strings.game.wonAttempts(state.guesses.length)}
          </Text>
          {timed && (
            <Text style={[styles.overlayStat, { color: colors.textSecondary }]}>
              {strings.game.wonTime(state.elapsedSeconds)}
            </Text>
          )}
          <View style={styles.overlayActions}>
            <PrimaryButton
              label={strings.game.playAgain}
              onPress={handleReset}
              colors={colors}
              style={styles.overlayBtn}
            />
            <PrimaryButton
              label={strings.game.back}
              onPress={() => router.back()}
              colors={colors}
              variant="secondary"
              style={styles.overlayBtn}
            />
          </View>
        </View>
      )}

      {/* Time's up overlay */}
      {isLost && (
        <View style={[styles.overlay, { backgroundColor: colors.background + 'EE' }]}>
          <Text style={styles.overlayEmoji}>⏰</Text>
          <Text style={[styles.overlayTitle, { color: colors.error }]}>
            {strings.game.timeUp}
          </Text>
          <Text style={[styles.overlaySubtitle, { color: colors.textSecondary }]}>
            {strings.game.timeUpReveal}
          </Text>
          <Text style={[styles.overlayNumber, { color: colors.text }]}>
            {state.secretNumber.toLocaleString('pt-BR')}
          </Text>
          <View style={styles.overlayActions}>
            <PrimaryButton
              label={strings.game.playAgain}
              onPress={handleReset}
              colors={colors}
              style={styles.overlayBtn}
            />
            <PrimaryButton
              label={strings.game.back}
              onPress={() => router.back()}
              colors={colors}
              variant="secondary"
              style={styles.overlayBtn}
            />
          </View>
        </View>
      )}

      {/* "Pronto?" modal for Time Rush */}
      <Modal
        visible={showReady}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: colors.surface },
              shadows.lg,
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {strings.game.readyTitle}
            </Text>
            <Text style={[styles.modalBody, { color: colors.textSecondary }]}>
              {strings.game.readyMsg(config.timeLimit ?? 60)}
            </Text>
            <PrimaryButton
              label={strings.game.play}
              onPress={() => {
                setShowReady(false);
                start();
              }}
              colors={colors}
              fullWidth
            />
            <PrimaryButton
              label={strings.game.back}
              onPress={() => router.back()}
              colors={colors}
              variant="ghost"
              fullWidth
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  headerBtn: {
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
  headerActions: {
    flexDirection: 'row',
  },
  timerRow: {
    alignItems: 'center',
    paddingTop: spacing.lg,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: typography.sizes.sm,
    marginTop: spacing['2xl'],
  },
  inputBar: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    borderTopWidth: 1,
  },
  inputError: {
    fontSize: typography.sizes.sm,
    marginBottom: spacing.sm,
    fontWeight: typography.weights.medium,
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    height: 48,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    paddingHorizontal: spacing.lg,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
  },
  shootBtn: {
    minWidth: 100,
  },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing['3xl'],
    gap: spacing.md,
  },
  overlayEmoji: {
    fontSize: 56,
    lineHeight: 64,
  },
  overlayTitle: {
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.weights.extrabold,
    textAlign: 'center',
  },
  overlaySubtitle: {
    fontSize: typography.sizes.md,
  },
  overlayNumber: {
    fontSize: typography.sizes['5xl'],
    fontWeight: typography.weights.extrabold,
    letterSpacing: -2,
  },
  overlayStat: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
  },
  overlayActions: {
    width: '100%',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  overlayBtn: {
    width: '100%',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#00000066',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing['3xl'],
  },
  modalCard: {
    width: '100%',
    borderRadius: radius.xl,
    padding: spacing['3xl'],
    gap: spacing.lg,
    maxWidth: 380,
  },
  modalTitle: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    textAlign: 'center',
  },
  modalBody: {
    fontSize: typography.sizes.md,
    textAlign: 'center',
    lineHeight: 22,
  },
});
