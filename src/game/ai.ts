import type { BoardState, Piece, PieceType, Position, Side } from '../types/janggi';
import { positionsEqual } from '../utils/coordinates';
import { applyMove } from './applyMove';
import { getPieceAt } from './boardUtils';
import { getAllLegalMovesForSide, getRawMovesForPiece, type Move } from './moves';

const PIECE_VALUES: Record<PieceType, number> = {
  general: 1000,
  chariot: 13,
  cannon: 7,
  horse: 5,
  elephant: 3,
  guard: 3,
  soldier: 2,
};

function isSquareAttackedBy(board: BoardState, position: Position, attackerSide: Side): boolean {
  for (const piece of board.pieces) {
    if (piece.side !== attackerSide) {
      continue;
    }

    const moves = getRawMovesForPiece(board, piece);
    if (moves.some((move) => positionsEqual(move, position))) {
      return true;
    }
  }

  return false;
}

function getEnemyGeneral(board: BoardState, side: Side): Piece | undefined {
  const enemySide: Side = side === 'cho' ? 'han' : 'cho';
  return board.pieces.find((piece) => piece.side === enemySide && piece.type === 'general');
}

function scoreMove(board: BoardState, move: Move): number {
  const { piece, destination } = move;
  const nextBoard = applyMove(board, piece, destination);
  const captured = getPieceAt(board.pieces, destination);
  let score = 0;

  if (captured) {
    score += PIECE_VALUES[captured.type] * 12;
  }

  const enemyGeneral = getEnemyGeneral(board, piece.side);
  if (
    enemyGeneral &&
    isSquareAttackedBy(nextBoard, enemyGeneral.position, piece.side)
  ) {
    score += 18;
  }

  if (piece.type === 'soldier') {
    const forwardBonus = piece.side === 'han' ? destination.rank : 9 - destination.rank;
    score += forwardBonus * 0.35;
  }

  const centerDistance = Math.abs(destination.file - 4);
  if (piece.type === 'chariot' || piece.type === 'cannon') {
    score += (4 - centerDistance) * 0.5;
  }

  const enemySide: Side = piece.side === 'cho' ? 'han' : 'cho';
  if (isSquareAttackedBy(nextBoard, destination, enemySide)) {
    score -= PIECE_VALUES[piece.type] * 2.5;
  }

  if (piece.type === 'general') {
    score -= 6;
  }

  score += Math.random() * 2.5;

  return score;
}

export function pickAiMove(board: BoardState, aiSide: Side): Move | null {
  const moves = getAllLegalMovesForSide(board, aiSide);
  if (moves.length === 0) {
    return null;
  }

  const scored = moves
    .map((move) => ({ move, score: scoreMove(board, move) }))
    .sort((left, right) => right.score - left.score);

  const topCount = Math.min(4, scored.length);
  const topMoves = scored.slice(0, topCount);

  if (Math.random() < 0.68) {
    return topMoves[0].move;
  }

  const randomIndex = Math.floor(Math.random() * topMoves.length);
  return topMoves[randomIndex].move;
}
