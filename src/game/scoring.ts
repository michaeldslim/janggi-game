import type { BoardState, CapturedPiece, Piece, PieceType, Side } from '../types/janggi';

export const PIECE_POINT_VALUES: Record<PieceType, number> = {
  general: 0,
  chariot: 13,
  cannon: 7,
  horse: 5,
  elephant: 3,
  guard: 3,
  soldier: 2,
};

/** Han receives 1.5 deom (15 points) for playing second. */
export const HAN_KOMI_DEOM = 1.5;
export const POINTS_PER_DEOM = 10;
export const HAN_KOMI_POINTS = HAN_KOMI_DEOM * POINTS_PER_DEOM;

export interface SideScores {
  choPoints: number;
  hanPoints: number;
  choDeom: number;
  hanDeom: number;
  hanMaterialPoints: number;
  hanMaterialDeom: number;
}

function sumPieceValues(pieces: Array<Piece | CapturedPiece>): number {
  return pieces.reduce((total, piece) => total + PIECE_POINT_VALUES[piece.type], 0);
}

export function calculateScores(board: BoardState): SideScores {
  const choOnBoard = board.pieces.filter((piece) => piece.side === 'cho');
  const hanOnBoard = board.pieces.filter((piece) => piece.side === 'han');
  const choPoints = sumPieceValues(choOnBoard) + sumPieceValues(board.captured.cho);
  const hanMaterialPoints = sumPieceValues(hanOnBoard) + sumPieceValues(board.captured.han);
  const hanPoints = hanMaterialPoints + HAN_KOMI_POINTS;

  return {
    choPoints,
    hanPoints,
    choDeom: choPoints / POINTS_PER_DEOM,
    hanDeom: hanPoints / POINTS_PER_DEOM,
    hanMaterialPoints,
    hanMaterialDeom: hanMaterialPoints / POINTS_PER_DEOM,
  };
}

export function formatDeom(points: number): string {
  return (points / POINTS_PER_DEOM).toFixed(1);
}

export function compareScores(board: BoardState): { winner?: Side; draw: boolean } {
  const scores = calculateScores(board);

  if (scores.hanPoints > scores.choPoints) {
    return { winner: 'han', draw: false };
  }

  if (scores.choPoints > scores.hanPoints) {
    return { winner: 'cho', draw: false };
  }

  return { draw: true };
}
