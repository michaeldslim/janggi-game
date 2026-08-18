import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { AiDifficulty } from '../types/janggi';
import { colors } from '../constants/colors';

interface CareerDifficultyBannerProps {
  message: string;
  actionLabel: string;
  recommendedDifficulty: AiDifficulty;
  onApply: (difficulty: AiDifficulty) => void;
}

export function CareerDifficultyBanner({
  message,
  actionLabel,
  onApply,
  recommendedDifficulty,
}: CareerDifficultyBannerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      <Pressable
        accessibilityRole="button"
        style={styles.action}
        onPress={() => onApply(recommendedDifficulty)}
      >
        <Text style={styles.actionText}>{actionLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(201, 162, 39, 0.45)',
    backgroundColor: 'rgba(201, 162, 39, 0.08)',
  },
  message: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
  },
  action: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.gold,
  },
  actionText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '700',
  },
});
