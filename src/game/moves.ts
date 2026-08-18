import type { BoardState, Piece, Position, Side } from '../types/janggi';
import { positionsEqual } from '../utils/coordinates';
import { isLegalDestination } from './check';
import { getRawMovesForPiece } from './rawMoves';

export interface Move {
  piece: Piece;
  destination: Position;
}

export function getAllLegalMovesForSide(board: BoardState, side: Side): Move[] {
  if (board.phase !== 'playing') {
    return [];
  }

  const moves: Move[] = [];

  for (const piece of board.pieces) {
    if (piece.side !== side) {
      continue;
    }

    for (const destination of getLegalMovesForPiece(board, piece)) {
      moves.push({ piece, destination });
    }
  }

  return moves;
}

export function getLegalMovesForPiece(board: BoardState, piece: Piece): Position[] {
  if (board.phase !== 'playing' || piece.side !== board.turn) {
    return [];
  }

  return getRawMovesForPiece(board, piece).filter((destination) =>
    isLegalDestination(board, piece, destination),
  );
}

export function isLegalMove(
  board: BoardState,
  piece: Piece,
  destination: Position,
): boolean {
  return getLegalMovesForPiece(board, piece).some((move) =>
    positionsEqual(move, destination),
  );
}
