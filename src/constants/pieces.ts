import type { PieceType, Side } from '../types/janggi';

/** Shared labels for pieces that are identical on both sides. */
export const PIECE_LABELS: Record<Exclude<PieceType, 'general' | 'soldier'>, string> = {
  chariot: '車',
  horse: '馬',
  elephant: '象',
  guard: '士',
  cannon: '包',
};

export function getPieceHanja(piece: { side: Side; type: PieceType }): string {
  if (piece.type === 'general') {
    return piece.side === 'cho' ? '楚' : '漢';
  }

  if (piece.type === 'soldier') {
    return piece.side === 'cho' ? '卒' : '兵';
  }

  return PIECE_LABELS[piece.type];
}

export const SIDE_LABELS: Record<Side, string> = {
  cho: '楚 (Cho)',
  han: '漢 (Han)',
};

export const BACK_RANK_TYPES: PieceType[] = [
  'chariot',
  'horse',
  'elephant',
  'guard',
  'general',
  'guard',
  'elephant',
  'horse',
  'chariot',
];

export const SOLDIER_FILES = [0, 2, 4, 6, 8] as const;
export const CANNON_FILES = [1, 7] as const;
