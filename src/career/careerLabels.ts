import type { AiDifficulty } from '../types/janggi';
import type { CareerRank, CareerState, PromotionResult } from '../types/career';
import {
  CAREER_RANK_ORDER,
  getPromotionTarget,
  getRequirementToReachRank,
  rankIndex,
} from './careerRules';

export const CAREER_RANK_KEYS: Record<CareerRank, string> = {
  intern: 'career.rank.intern',
  staff: 'career.rank.staff',
  assistant: 'career.rank.assistant',
  manager: 'career.rank.manager',
  deputy: 'career.rank.deputy',
  director: 'career.rank.director',
  executive: 'career.rank.executive',
  ceo: 'career.rank.ceo',
};

export function careerRankKey(rank: CareerRank): string {
  return CAREER_RANK_KEYS[rank];
}

export function isMaxCareerRank(state: CareerState): boolean {
  return getPromotionTarget(state.rank) === null;
}

type TranslateFn = (key: string, params?: Record<string, string | number>) => string;

const DIFFICULTY_LABEL_KEYS: Record<AiDifficulty, string> = {
  easy: 'settings.difficultyEasy',
  medium: 'settings.difficultyMedium',
  hard: 'settings.difficultyHard',
};

export function difficultyLabel(t: TranslateFn, difficulty: AiDifficulty): string {
  return t(DIFFICULTY_LABEL_KEYS[difficulty]);
}

export function getCareerProgressCopy(
  t: TranslateFn,
  state: CareerState,
): { primary: string; secondary?: string } {
  const rankLabel = t(careerRankKey(state.rank));
  const target = getPromotionTarget(state.rank);

  if (!target) {
    return { primary: t('career.maxRank', { rank: rankLabel }) };
  }

  return {
    primary: t('career.homeBadge', {
      rank: rankLabel,
      current: state.promotionWins,
      required: target.requiredWins,
    }),
    secondary: t('career.progressNext', {
      nextRank: t(careerRankKey(target.nextRank)),
      required: target.requiredWins,
    }),
  };
}

export function getCareerResultMessage(
  t: TranslateFn,
  result: PromotionResult,
  isDraw: boolean,
): string {
  const rankLabel = t(careerRankKey(result.nextState.rank));
  const target = getPromotionTarget(result.nextState.rank);

  if (result.unchanged || isDraw) {
    return getCareerProgressCopy(t, result.nextState).primary;
  }

  if (result.lost && target) {
    return t('career.lossKeepsProgress', {
      rank: rankLabel,
      current: result.nextState.promotionWins,
      required: target.requiredWins,
    });
  }

  if (result.noProgressDifficulty) {
    return t('career.noProgressDifficulty', {
      minDifficulty: difficultyLabel(t, target?.minAiDifficulty ?? 'medium'),
    });
  }

  return getCareerProgressCopy(t, result.nextState).primary;
}

export function getPromotionRequirementCopy(
  t: TranslateFn,
  rank: CareerRank,
): string | null {
  const requirement = getRequirementToReachRank(rank);
  if (!requirement) {
    return null;
  }

  if (requirement.minAiDifficulty) {
    return t('career.ladder.requirementDifficulty', {
      wins: requirement.requiredWins,
      difficulty: difficultyLabel(t, requirement.minAiDifficulty),
    });
  }

  return t('career.ladder.requirement', { wins: requirement.requiredWins });
}

export type CareerLadderStatus = 'achieved' | 'current' | 'locked';

export function getCareerLadderStatus(state: CareerState, rank: CareerRank): CareerLadderStatus {
  const currentIndex = rankIndex(state.rank);
  const rowIndex = rankIndex(rank);

  if (rowIndex < currentIndex) {
    return 'achieved';
  }

  if (rowIndex === currentIndex) {
    return 'current';
  }

  return 'locked';
}

export function getCareerLadderRows(): CareerRank[] {
  return [...CAREER_RANK_ORDER].reverse();
}
