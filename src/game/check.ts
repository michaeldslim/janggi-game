import type { BoardState, Piece, Position, Side } from '../types/janggi';
import { DEFAULT_SWAP_STATE } from '../types/janggi';
import { positionsEqual } from '../utils/coordinates';
import { findGeneral, getOppositeSide, getPieceAt } from './boardUtils';
import { wouldCreateBikjang } from './bikjang';
import { getRawMovesForPiece } from './rawMoves';

export function isSquareAttackedBy(
  pieces: Piece[],
  position: Position,
  attackerSide: Side,
): boolean {
  const boardLike: BoardState = {
    pieces,
    phase: 'playing',
    turn: attackerSide,
    swaps: DEFAULT_SWAP_STATE,
    moveCount: 0,
    captured: { han: [], cho: [] },
  };

  for (const piece of pieces) {
    if (piece.side !== attackerSide) {
      continue;
    }

    const moves = getRawMovesForPiece(boardLike, piece);
    if (moves.some((move) => positionsEqual(move, position))) {
      return true;
    }
  }

  return false;
}

export function isInCheck(board: BoardState, side: Side): boolean {
  const general = findGeneral(board.pieces, side);
  if (!general) {
    return false;
  }

  return isSquareAttackedBy(board.pieces, general.position, getOppositeSide(side));
}

export function simulateMovePieces(
  pieces: Piece[],
  piece: Piece,
  destination: Position,
): Piece[] {
  const capturedPiece = pieces.find(
    (candidate) =>
      positionsEqual(candidate.position, destination) && candidate.id !== piece.id,
  );

  return pieces
    .filter((candidate) => candidate.id !== capturedPiece?.id)
    .map((candidate) =>
      candidate.id === piece.id
        ? { ...candidate, position: { ...destination } }
        : candidate,
    );
}

export function wouldLeaveGeneralInCheck(
  board: BoardState,
  piece: Piece,
  destination: Position,
): boolean {
  const nextPieces = simulateMovePieces(board.pieces, piece, destination);
  return isInCheck({ ...board, pieces: nextPieces }, piece.side);
}

export function isLegalDestination(board: BoardState, piece: Piece, destination: Position): boolean {
  const occupant = getPieceAt(board.pieces, destination);
  if (occupant?.type === 'general' && occupant.side !== piece.side) {
    return true;
  }

  if (wouldLeaveGeneralInCheck(board, piece, destination)) {
    return false;
  }

  return !wouldCreateBikjang(board.pieces, piece, destination);
}
