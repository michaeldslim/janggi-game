import type { BoardState, Piece, Position } from '../types/janggi';
import { getOppositeSide } from './boardUtils';
import { isLegalMove } from './moves';

export function applyMove(
  board: BoardState,
  piece: Piece,
  destination: Position,
): BoardState {
  if (!isLegalMove(board, piece, destination)) {
    return board;
  }

  const capturedId = board.pieces.find(
    (candidate) =>
      candidate.position.file === destination.file &&
      candidate.position.rank === destination.rank &&
      candidate.id !== piece.id,
  )?.id;

  const pieces = board.pieces
    .filter((candidate) => candidate.id !== capturedId)
    .map((candidate) =>
      candidate.id === piece.id
        ? { ...candidate, position: destination }
        : candidate,
    );

  return {
    ...board,
    pieces,
    turn: getOppositeSide(board.turn),
    moveCount: board.moveCount + 1,
  };
}
