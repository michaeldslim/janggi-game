import type { PieceType } from '../types/janggi';

/** Visual disc scale relative to the board's standard piece radius. */
export const PIECE_SIZE_MULTIPLIERS: Record<PieceType, number> = {
  soldier: 0.76,
  guard: 0.76,
  general: 1.16,
  chariot: 1,
  horse: 1,
  elephant: 1,
  cannon: 1,
};

export const MAX_PIECE_SIZE_MULTIPLIER = Math.max(
  ...Object.values(PIECE_SIZE_MULTIPLIERS),
);

export function getPieceRadius(baseRadius: number, type: PieceType): number {
  return baseRadius * PIECE_SIZE_MULTIPLIERS[type];
}

export function getPieceLabelFontSize(radius: number, baseScale = 1.15): number {
  return Math.max(1, radius * baseScale - 1);
}
