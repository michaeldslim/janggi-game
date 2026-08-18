import type { BoardState, Piece, Position } from '../types/janggi';
import { getOppositeSide } from './boardUtils';
import { isInCheck } from './check';
import { evaluateGameEnd } from './endgame';
import { isLegalMove } from './moves';
import { compareScores } from './scoring';

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

  if (capturedGeneral) {
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
      turn: board.turn,
      moveCount: board.moveCount + 1,
      consecutivePasses: 0,
      phase: 'finished',
      winner: piece.side,
      finishReason: 'capture',
    };
  }

  const nextBoard: BoardState = {
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
    turn: getOppositeSide(board.turn),
    moveCount: board.moveCount + 1,
    consecutivePasses: 0,
  };

  const endResult = evaluateGameEnd(nextBoard);
  if (endResult.finished) {
    return {
      ...nextBoard,
      phase: 'finished',
      winner: endResult.winner,
      finishReason: endResult.finishReason,
    };
  }

  return nextBoard;
}

export function passTurn(board: BoardState): BoardState {
  if (board.phase !== 'playing' || isInCheck(board, board.turn)) {
    return board;
  }

  const consecutivePasses = (board.consecutivePasses ?? 0) + 1;
  const nextBoard: BoardState = {
    ...board,
    turn: getOppositeSide(board.turn),
    moveCount: board.moveCount + 1,
    lastMove: undefined,
    consecutivePasses,
  };

  if (consecutivePasses >= 2) {
    const scoreResult = compareScores(nextBoard);

    if (scoreResult.draw) {
      return {
        ...nextBoard,
        phase: 'finished',
        finishReason: 'score',
      };
    }

    return {
      ...nextBoard,
      phase: 'finished',
      winner: scoreResult.winner,
      finishReason: 'score',
    };
  }

  const endResult = evaluateGameEnd(nextBoard);
  if (endResult.finished) {
    return {
      ...nextBoard,
      phase: 'finished',
      winner: endResult.winner,
      finishReason: endResult.finishReason,
    };
  }

  return nextBoard;
}
