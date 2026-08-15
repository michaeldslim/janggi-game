import { RANK_COUNT } from '../constants/board';
import type { BoardState, Piece, Position, Side } from '../types/janggi';
import {
  addPosition,
  canCapture,
  getPieceAt,
  isEnemy,
  isOnBoard,
} from './boardUtils';
import {
  getEnemyPalace,
  getPalaceStepMoves,
  isInEnemyPalace,
  isInOwnPalace,
} from './palace';

function filterDestinations(piece: Piece, pieces: Piece[], destinations: Position[]): Position[] {
  return destinations.filter((destination) => {
    if (!isOnBoard(destination)) {
      return false;
    }

    const occupant = getPieceAt(pieces, destination);
    return occupant === undefined || isEnemy(piece, occupant);
  });
}

function getGeneralMoves(piece: Piece, pieces: Piece[]): Position[] {
  if (!isInOwnPalace(piece.position, piece.side)) {
    return [];
  }

  return filterDestinations(piece, pieces, getPalaceStepMoves(piece.position, piece.side));
}

function getGuardMoves(piece: Piece, pieces: Piece[]): Position[] {
  return getGeneralMoves(piece, pieces);
}

function slideMoves(
  piece: Piece,
  pieces: Piece[],
  directions: Array<[number, number]>,
): Position[] {
  const moves: Position[] = [];

  for (const [deltaFile, deltaRank] of directions) {
    let current = addPosition(piece.position, deltaFile, deltaRank);

    while (isOnBoard(current)) {
      const occupant = getPieceAt(pieces, current);

      if (occupant === undefined) {
        moves.push(current);
      } else {
        if (canCapture(piece, occupant)) {
          moves.push(current);
        }
        break;
      }

      current = addPosition(current, deltaFile, deltaRank);
    }
  }

  return moves;
}

function getChariotMoves(piece: Piece, pieces: Piece[]): Position[] {
  return slideMoves(piece, pieces, [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]);
}

function getCannonMoves(piece: Piece, pieces: Piece[]): Position[] {
  const moves: Position[] = [];
  const directions: Array<[number, number]> = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  for (const [deltaFile, deltaRank] of directions) {
    let current = addPosition(piece.position, deltaFile, deltaRank);
    let screen: Piece | undefined;

    while (isOnBoard(current)) {
      const occupant = getPieceAt(pieces, current);

      if (screen === undefined) {
        if (occupant !== undefined) {
          if (occupant.type === 'cannon') {
            break;
          }
          screen = occupant;
        }
      } else if (occupant === undefined) {
        moves.push(current);
      } else {
        if (occupant.type !== 'cannon' && canCapture(piece, occupant)) {
          moves.push(current);
        }
        break;
      }

      current = addPosition(current, deltaFile, deltaRank);
    }
  }

  return moves;
}

const HORSE_MOVES: Array<{
  leg: [number, number];
  destinations: Array<[number, number]>;
}> = [
  { leg: [1, 0], destinations: [[2, 1], [2, -1]] },
  { leg: [-1, 0], destinations: [[-2, 1], [-2, -1]] },
  { leg: [0, 1], destinations: [[1, 2], [-1, 2]] },
  { leg: [0, -1], destinations: [[1, -2], [-1, -2]] },
];

function getHorseMoves(piece: Piece, pieces: Piece[]): Position[] {
  const moves: Position[] = [];

  for (const { leg, destinations } of HORSE_MOVES) {
    const legPosition = addPosition(piece.position, leg[0], leg[1]);
    if (!isOnBoard(legPosition) || getPieceAt(pieces, legPosition) !== undefined) {
      continue;
    }

    for (const [deltaFile, deltaRank] of destinations) {
      const destination = addPosition(piece.position, deltaFile, deltaRank);
      moves.push(destination);
    }
  }

  return filterDestinations(piece, pieces, moves);
}

const ELEPHANT_MOVES: Array<{
  leg: [number, number];
  paths: Array<{ mid: [number, number]; dest: [number, number] }>;
}> = [
  {
    leg: [1, 0],
    paths: [
      { mid: [2, 1], dest: [3, 2] },
      { mid: [2, -1], dest: [3, -2] },
    ],
  },
  {
    leg: [-1, 0],
    paths: [
      { mid: [-2, 1], dest: [-3, 2] },
      { mid: [-2, -1], dest: [-3, -2] },
    ],
  },
  {
    leg: [0, 1],
    paths: [
      { mid: [1, 2], dest: [2, 3] },
      { mid: [-1, 2], dest: [-2, 3] },
    ],
  },
  {
    leg: [0, -1],
    paths: [
      { mid: [1, -2], dest: [2, -3] },
      { mid: [-1, -2], dest: [-2, -3] },
    ],
  },
];

function getElephantMoves(piece: Piece, pieces: Piece[]): Position[] {
  const moves: Position[] = [];

  for (const { leg, paths } of ELEPHANT_MOVES) {
    const legPosition = addPosition(piece.position, leg[0], leg[1]);
    if (!isOnBoard(legPosition) || getPieceAt(pieces, legPosition) !== undefined) {
      continue;
    }

    for (const { mid, dest } of paths) {
      const midPosition = addPosition(piece.position, mid[0], mid[1]);
      const destination = addPosition(piece.position, dest[0], dest[1]);

      if (!isOnBoard(destination)) {
        continue;
      }

      if (getPieceAt(pieces, midPosition) !== undefined) {
        continue;
      }

      moves.push(destination);
    }
  }

  return filterDestinations(piece, pieces, moves);
}

function getSoldierMoves(piece: Piece, pieces: Piece[]): Position[] {
  const forwardRankDelta = piece.side === 'cho' ? -1 : 1;
  const farEdgeRank = piece.side === 'cho' ? 0 : RANK_COUNT - 1;
  const atFarEdge = piece.position.rank === farEdgeRank;
  const moves: Position[] = [];

  if (!atFarEdge) {
    moves.push(addPosition(piece.position, 0, forwardRankDelta));
  }

  moves.push(
    addPosition(piece.position, -1, 0),
    addPosition(piece.position, 1, 0),
  );

  if (isInEnemyPalace(piece.position, piece.side) && !atFarEdge) {
    moves.push(
      addPosition(piece.position, -1, forwardRankDelta),
      addPosition(piece.position, 1, forwardRankDelta),
    );
  }

  return filterDestinations(piece, pieces, moves);
}

export function getRawMovesForPiece(board: BoardState, piece: Piece): Position[] {
  switch (piece.type) {
    case 'general':
      return getGeneralMoves(piece, board.pieces);
    case 'guard':
      return getGuardMoves(piece, board.pieces);
    case 'chariot':
      return getChariotMoves(piece, board.pieces);
    case 'cannon':
      return getCannonMoves(piece, board.pieces);
    case 'horse':
      return getHorseMoves(piece, board.pieces);
    case 'elephant':
      return getElephantMoves(piece, board.pieces);
    case 'soldier':
      return getSoldierMoves(piece, board.pieces);
    default:
      return [];
  }
}

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

  return getRawMovesForPiece(board, piece);
}

export function isLegalMove(
  board: BoardState,
  piece: Piece,
  destination: Position,
): boolean {
  return getLegalMovesForPiece(board, piece).some((move) =>
    move.file === destination.file && move.rank === destination.rank,
  );
}
