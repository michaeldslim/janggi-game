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

/** Glyph size as a fraction of piece diameter. */
const PIECE_GLYPH_SCALES: Record<PieceType, number> = {
  soldier: 0.78,
  guard: 0.78,
  general: 0.78,
  chariot: 0.78,
  horse: 0.78,
  elephant: 0.78,
  cannon: 0.78,
};

export function getPieceGlyphSize(radius: number, type: PieceType): number {
  return radius * 2 * PIECE_GLYPH_SCALES[type];
}
