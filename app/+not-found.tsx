import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { spacing, typography } from '../theme';

export default function NotFoundScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🎩</Text>
        <Text style={[styles.title, { color: colors.text }]}>Página não encontrada</Text>
        <Pressable onPress={() => router.replace('/')} accessibilityRole="button">
          <Text style={[styles.link, { color: colors.primary }]}>Voltar ao início</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  emoji: { fontSize: 48 },
  title: { fontSize: typography.sizes.xl, fontWeight: '600' },
  link: { fontSize: typography.sizes.md, fontWeight: '500' },
});
