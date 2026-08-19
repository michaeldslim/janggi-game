import type { BoardState, FinishReason, Side } from '../types/janggi';
import { getOppositeSide } from './boardUtils';
import { isBikjang } from './bikjang';
import { isInCheck } from './check';
import { getAllLegalMovesForSide } from './moves';
import { compareScores } from './scoring';

export interface GameEndResult {
  finished: boolean;
  winner?: Side;
  finishReason?: FinishReason;
}

export function resolveByScore(board: BoardState): GameEndResult {
  const scoreResult = compareScores(board);

  if (scoreResult.draw) {
    return { finished: true, finishReason: 'score' };
  }

  return {
    finished: true,
    winner: scoreResult.winner,
    finishReason: 'score',
  };
}

export function evaluateGameEnd(board: BoardState): GameEndResult {
  if (board.phase !== 'playing') {
    return {
      finished: true,
      winner: board.winner,
      finishReason: board.finishReason,
    };
  }

  if (isBikjang(board.pieces)) {
    return {
      finished: true,
      finishReason: 'bikjang',
    };
  }

  const sideToMove = board.turn;
  const legalMoves = getAllLegalMovesForSide(board, sideToMove);

  if (legalMoves.length > 0) {
    return { finished: false };
  }

  if (isInCheck(board, sideToMove)) {
    return {
      finished: true,
      winner: getOppositeSide(sideToMove),
      finishReason: 'checkmate',
    };
  }

  return {
    finished: true,
    finishReason: 'stalemate',
  };
}
