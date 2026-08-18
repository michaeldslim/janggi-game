import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';
import { calculateScores, formatDeom, HAN_KOMI_DEOM } from '../game/scoring';
import { useI18n } from '../i18n/I18nProvider';
import type { BoardState } from '../types/janggi';

interface ScoreDisplayProps {
  board: BoardState;
}

export function ScoreDisplay({ board }: ScoreDisplayProps) {
  const { t, sideLabel } = useI18n();
  const scores = calculateScores(board);

  return (
    <View style={styles.container}>
      <View style={styles.sideScore}>
        <Text style={[styles.sideLabel, styles.choLabel]}>
          {sideLabel('cho', true)}
        </Text>
        <Text style={styles.scoreValue}>{formatDeom(scores.choPoints)}</Text>
        <Text style={styles.unit}>{t('game.deom')}</Text>
      </View>

      <Text style={styles.separator}>·</Text>

      <View style={styles.sideScore}>
        <Text style={[styles.sideLabel, styles.hanLabel]}>
          {sideLabel('han', true)}
        </Text>
        <Text style={styles.scoreValue}>{formatDeom(scores.hanPoints)}</Text>
        <Text style={styles.unit}>{t('game.deom')}</Text>
        <Text style={styles.komi}>
          {t('game.hanKomi', { deom: HAN_KOMI_DEOM.toFixed(1) })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  sideScore: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  sideLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  choLabel: {
    color: colors.choPieceText,
  },
  hanLabel: {
    color: colors.hanPieceText,
  },
  scoreValue: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  unit: {
    color: colors.textMuted,
    fontSize: 12,
  },
  komi: {
    color: colors.textMuted,
    fontSize: 11,
  },
  separator: {
    color: colors.textMuted,
    fontSize: 14,
  },
});
