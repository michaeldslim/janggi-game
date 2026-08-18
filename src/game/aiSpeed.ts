import type { AiSpeed } from '../types/janggi';

export const AI_SPEED_DELAY_MS: Record<AiSpeed, number> = {
  slow: 2200,
  medium: 1200,
  fast: 550,
};

export function getAiThinkDelayMs(speed: AiSpeed): number {
  return AI_SPEED_DELAY_MS[speed];
}
