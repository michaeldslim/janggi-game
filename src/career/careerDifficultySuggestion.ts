import type { AiDifficulty } from '../types/janggi';
import type { CareerRank } from '../types/career';
import { compareAiDifficulty, getPromotionTarget, rankIndex } from './careerRules';

const DEPUTY_RANK_INDEX = rankIndex('deputy');

export function isCareerRankDeputyOrHigher(rank: CareerRank): boolean {
  return rankIndex(rank) >= DEPUTY_RANK_INDEX;
}

export function getPromotionMinDifficulty(rank: CareerRank): AiDifficulty | null {
  return getPromotionTarget(rank)?.minAiDifficulty ?? null;
}

export interface DifficultySuggestion {
  recommended: AiDifficulty;
}

export function getDifficultySuggestion(
  rank: CareerRank,
  currentDifficulty: AiDifficulty,
): DifficultySuggestion | null {
  if (!isCareerRankDeputyOrHigher(rank)) {
    return null;
  }

  const minRequired = getPromotionMinDifficulty(rank);
  if (!minRequired || compareAiDifficulty(currentDifficulty, minRequired)) {
    return null;
  }

  return { recommended: minRequired };
}
