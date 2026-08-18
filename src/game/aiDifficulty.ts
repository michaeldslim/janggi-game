import type { AiDifficulty } from '../types/janggi';

export interface AiDifficultyConfig {
  topMoveCount: number;
  bestMoveProbability: number;
  scoreNoise: number;
}

export const AI_DIFFICULTY_CONFIG: Record<AiDifficulty, AiDifficultyConfig> = {
  easy: {
    topMoveCount: 8,
    bestMoveProbability: 0.25,
    scoreNoise: 4,
  },
  medium: {
    topMoveCount: 4,
    bestMoveProbability: 0.68,
    scoreNoise: 2.5,
  },
  hard: {
    topMoveCount: 2,
    bestMoveProbability: 0.92,
    scoreNoise: 0.5,
  },
};
