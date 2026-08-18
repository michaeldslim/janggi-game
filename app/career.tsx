import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CareerDifficultyBanner } from '../src/components/CareerDifficultyBanner';
import { PlayerAvatar } from '../src/components/PlayerAvatar';
import { getDifficultySuggestion } from '../src/career/careerDifficultySuggestion';
import {
  careerRankKey,
  difficultyLabel,
  getCareerLadderRows,
  getCareerLadderStatus,
  getCareerProgressCopy,
  getPromotionRequirementCopy,
  isMaxCareerRank,
  type CareerLadderStatus,
} from '../src/career/careerLabels';
import { getPromotionTarget } from '../src/career/careerRules';
import { useCareer } from '../src/career/CareerProvider';
import type { AvatarId } from '../src/constants/avatars';
import { colors } from '../src/constants/colors';
import { useI18n } from '../src/i18n/I18nProvider';
import { useGameSettings } from '../src/settings/GameSettingsProvider';
import type { CareerRank, CareerState } from '../src/types/career';

function ladderStatusLabel(t: (key: string) => string, status: CareerLadderStatus): string {
  switch (status) {
    case 'achieved':
      return t('career.ladder.achieved');
    case 'current':
      return t('career.ladder.current');
    default:
      return t('career.ladder.locked');
  }
}

function ladderDetailCopy(
  t: (key: string, params?: Record<string, string | number>) => string,
  state: CareerState,
  rank: CareerRank,
  status: CareerLadderStatus,
): string {
  if (status === 'current') {
    const target = getPromotionTarget(state.rank);
    if (!target) {
      return t('career.maxRank', { rank: t(careerRankKey(rank)) });
    }

    return t('career.ladder.progressToNext', {
      current: state.promotionWins,
      required: target.requiredWins,
      nextRank: t(careerRankKey(target.nextRank)),
    });
  }

  if (rank === 'intern') {
    return t('career.ladder.startingRank');
  }

  return getPromotionRequirementCopy(t, rank) ?? '';
}

function CareerDisabledState({ onOpenSettings }: { onOpenSettings: () => void }) {
  const { t } = useI18n();

  return (
    <View style={styles.disabledCard}>
      <Text style={styles.disabledTitle}>{t('career.screen.disabledTitle')}</Text>
      <Text style={styles.disabledBody}>{t('career.screen.disabledBody')}</Text>
      <Pressable style={styles.linkButton} onPress={onOpenSettings}>
        <Text style={styles.linkButtonText}>{t('career.screen.enableInSettings')}</Text>
      </Pressable>
    </View>
  );
}

function CareerSummary({
  state,
  playerAvatarId,
}: {
  state: CareerState;
  playerAvatarId: AvatarId;
}) {
  const { t } = useI18n();
  const progress = getCareerProgressCopy(t, state);
  const highestLabel = t(careerRankKey(state.highestRankAchieved));
  const showHighest = state.highestRankAchieved !== state.rank || isMaxCareerRank(state);

  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryHeader}>
        <PlayerAvatar avatarId={playerAvatarId} size="lg" />
        <View style={styles.summaryText}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('career.screen.currentRank')}</Text>
            <Text style={styles.summaryValue}>{progress.primary}</Text>
          </View>
          {progress.secondary ? <Text style={styles.summaryHint}>{progress.secondary}</Text> : null}
        </View>
      </View>
      {showHighest ? (
        <View style={[styles.summaryRow, styles.summaryRowSpaced]}>
          <Text style={styles.summaryLabel}>{t('career.screen.highestRank')}</Text>
          <Text style={styles.summaryValue}>{highestLabel}</Text>
        </View>
      ) : null}
    </View>
  );
}

function LadderRow({
  rank,
  state,
  isLast,
}: {
  rank: CareerRank;
  state: CareerState;
  isLast: boolean;
}) {
  const { t } = useI18n();
  const status = getCareerLadderStatus(state, rank);
  const detail = ladderDetailCopy(t, state, rank, status);
  const isHighlighted = status === 'current' || rank === state.highestRankAchieved;

  return (
    <View style={styles.ladderRow}>
      <View style={styles.ladderRail}>
        <View
          style={[
            styles.ladderDot,
            status === 'achieved' && styles.ladderDotAchieved,
            status === 'current' && styles.ladderDotCurrent,
            status === 'locked' && styles.ladderDotLocked,
          ]}
        />
        {!isLast ? <View style={styles.ladderLine} /> : null}
      </View>

      <View
        style={[
          styles.ladderCard,
          isHighlighted && styles.ladderCardHighlighted,
          status === 'locked' && styles.ladderCardLocked,
        ]}
      >
        <View style={styles.ladderHeader}>
          <Text
            style={[
              styles.ladderRank,
              status === 'current' && styles.ladderRankCurrent,
              status === 'locked' && styles.ladderRankLocked,
            ]}
          >
            {t(careerRankKey(rank))}
          </Text>
          <Text
            style={[
              styles.ladderStatus,
              status === 'achieved' && styles.ladderStatusAchieved,
              status === 'current' && styles.ladderStatusCurrent,
            ]}
          >
            {ladderStatusLabel(t, status)}
          </Text>
        </View>
        {detail ? <Text style={styles.ladderDetail}>{detail}</Text> : null}
      </View>
    </View>
  );
}

export default function CareerScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { aiDifficulty, playerAvatarId, careerModeEnabled, setAiDifficulty } = useGameSettings();
  const { careerState, loaded } = useCareer();
  const ladderRows = getCareerLadderRows();
  const difficultySuggestion = careerModeEnabled
    ? getDifficultySuggestion(careerState.rank, aiDifficulty)
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>{t('common.back')}</Text>
        </Pressable>
        <Text style={styles.title}>{t('career.screen.title')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {!careerModeEnabled ? (
          <CareerDisabledState onOpenSettings={() => router.push('/settings')} />
        ) : !loaded ? null : (
          <>
            <CareerSummary state={careerState} playerAvatarId={playerAvatarId} />

            {difficultySuggestion ? (
              <CareerDifficultyBanner
                message={t('career.difficultySuggest.body', {
                  rank: t(careerRankKey(careerState.rank)),
                  difficulty: difficultyLabel(t, difficultySuggestion.recommended),
                })}
                actionLabel={t('career.difficultySuggest.action', {
                  difficulty: difficultyLabel(t, difficultySuggestion.recommended),
                })}
                recommendedDifficulty={difficultySuggestion.recommended}
                onApply={setAiDifficulty}
              />
            ) : null}

            <Text style={styles.rulesText}>{t('career.rulesSnippet')}</Text>

            <View style={styles.ladderSection}>
              <Text style={styles.sectionTitle}>{t('career.screen.ladderTitle')}</Text>
              {ladderRows.map((rank, index) => (
                <LadderRow
                  key={rank}
                  rank={rank}
                  state={careerState}
                  isLast={index === ladderRows.length - 1}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    minWidth: 64,
    paddingVertical: 6,
  },
  backButtonText: {
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: '600',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  headerSpacer: {
    minWidth: 64,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 20,
  },
  summaryCard: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 12,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(201, 162, 39, 0.35)',
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  summaryText: {
    flex: 1,
    gap: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  summaryRowSpaced: {
    marginTop: 4,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(245, 230, 200, 0.2)',
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  summaryValue: {
    color: colors.gold,
    fontSize: 16,
    fontWeight: '700',
    flexShrink: 1,
    textAlign: 'right',
  },
  summaryHint: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  rulesText: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
  },
  ladderSection: {
    gap: 0,
  },
  sectionTitle: {
    color: colors.gold,
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  ladderRow: {
    flexDirection: 'row',
    gap: 12,
  },
  ladderRail: {
    width: 18,
    alignItems: 'center',
  },
  ladderDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 18,
    backgroundColor: colors.textPrimary,
    opacity: 0.35,
  },
  ladderDotAchieved: {
    backgroundColor: colors.gold,
    opacity: 1,
  },
  ladderDotCurrent: {
    backgroundColor: colors.gold,
    opacity: 1,
    width: 14,
    height: 14,
    borderRadius: 7,
    marginTop: 17,
  },
  ladderDotLocked: {
    backgroundColor: colors.textPrimary,
    opacity: 0.2,
  },
  ladderLine: {
    flex: 1,
    width: 2,
    backgroundColor: 'rgba(245, 230, 200, 0.18)',
    marginVertical: 4,
  },
  ladderCard: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.22)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
    gap: 4,
  },
  ladderCardHighlighted: {
    borderWidth: 1,
    borderColor: 'rgba(201, 162, 39, 0.45)',
    backgroundColor: 'rgba(0,0,0,0.32)',
  },
  ladderCardLocked: {
    opacity: 0.72,
  },
  ladderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  ladderRank: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  ladderRankCurrent: {
    color: colors.gold,
  },
  ladderRankLocked: {
    opacity: 0.75,
  },
  ladderStatus: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  ladderStatusAchieved: {
    color: colors.gold,
    opacity: 0.9,
  },
  ladderStatusCurrent: {
    color: colors.gold,
    opacity: 1,
  },
  ladderDetail: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  disabledCard: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 12,
    padding: 20,
    gap: 12,
  },
  disabledTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  disabledBody: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  linkButton: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  linkButtonText: {
    color: colors.gold,
    fontSize: 15,
    fontWeight: '600',
  },
});
