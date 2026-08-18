import type { AiDifficulty, BoardState, Piece, PieceType, Side } from '../types/janggi';
import { applyMove } from './applyMove';
import { AI_DIFFICULTY_CONFIG } from './aiDifficulty';
import { getPieceAt } from './boardUtils';
import { isSquareAttackedBy } from './check';
import { getAllLegalMovesForSide, type Move } from './moves';

const PIECE_VALUES: Record<PieceType, number> = {
  general: 1000,
  chariot: 13,
  cannon: 7,
  horse: 5,
  elephant: 3,
  guard: 3,
  soldier: 2,
};

function getEnemyGeneral(board: BoardState, side: Side): Piece | undefined {
  const enemySide: Side = side === 'cho' ? 'han' : 'cho';
  return board.pieces.find((piece) => piece.side === enemySide && piece.type === 'general');
}

function scoreMove(board: BoardState, move: Move, scoreNoise: number): number {
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
    isSquareAttackedBy(nextBoard.pieces, enemyGeneral.position, piece.side)
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
  if (isSquareAttackedBy(nextBoard.pieces, destination, enemySide)) {
    score -= PIECE_VALUES[piece.type] * 2.5;
  }

  if (piece.type === 'general') {
    score -= 6;
  }

  score += Math.random() * scoreNoise;

  return score;
}

export function pickAiMove(
  board: BoardState,
  aiSide: Side,
  difficulty: AiDifficulty = 'medium',
): Move | null {
  const moves = getAllLegalMovesForSide(board, aiSide);
  if (moves.length === 0) {
    return null;
  }

  const config = AI_DIFFICULTY_CONFIG[difficulty];
  const scored = moves
    .map((move) => ({ move, score: scoreMove(board, move, config.scoreNoise) }))
    .sort((left, right) => right.score - left.score);

  const topCount = Math.min(config.topMoveCount, scored.length);
  const topMoves = scored.slice(0, topCount);

  if (Math.random() < config.bestMoveProbability) {
    return topMoves[0].move;
  }

  const randomIndex = Math.floor(Math.random() * topMoves.length);
  return topMoves[randomIndex].move;
}
