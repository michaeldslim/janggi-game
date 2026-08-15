import type { PieceType, Side } from '../types/janggi';

export const PIECE_LABELS: Record<PieceType, string> = {
  chariot: '車',
  horse: '馬',
  elephant: '象',
  guard: '士',
  general: '將',
  cannon: '包',
  soldier: '卒',
};

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
