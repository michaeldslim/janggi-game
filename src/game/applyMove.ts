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

  const capturedPiece = board.pieces.find(
    (candidate) =>
      candidate.position.file === destination.file &&
      candidate.position.rank === destination.rank &&
      candidate.id !== piece.id,
  );

  const pieces = board.pieces
    .filter((candidate) => candidate.id !== capturedPiece?.id)
    .map((candidate) =>
      candidate.id === piece.id
        ? { ...candidate, position: destination }
        : candidate,
    );

  const capturedGeneral = capturedPiece?.type === 'general';
  const currentCaptured = board.captured ?? { han: [], cho: [] };
  const captured = capturedPiece
    ? {
        ...currentCaptured,
        [piece.side]: [
          ...currentCaptured[piece.side],
          {
            id: capturedPiece.id,
            side: capturedPiece.side,
            type: capturedPiece.type,
          },
        ],
      }
    : currentCaptured;

  return {
    ...board,
    pieces,
    captured,
    lastMove: {
      pieceId: piece.id,
      pieceType: piece.type,
      side: piece.side,
      from: { ...piece.position },
      to: { ...destination },
    },
    turn: capturedGeneral ? board.turn : getOppositeSide(board.turn),
    moveCount: board.moveCount + 1,
    phase: capturedGeneral ? 'finished' : board.phase,
    winner: capturedGeneral ? piece.side : board.winner,
  };
}
