import {
  BACK_RANK_TYPES,
  CANNON_FILES,
  SOLDIER_FILES,
} from '../constants/pieces';
import {
  CHO_BACK_RANK,
  CHO_CANNON_RANK,
  CHO_SOLDIER_RANK,
  HAN_BACK_RANK,
  HAN_CANNON_RANK,
  HAN_SOLDIER_RANK,
  SWAP_FILE_PAIRS,
} from '../constants/board';
import type { BoardState, Piece, PieceType, Side, SwapState } from '../types/janggi';

function getBackRankType(file: number, swapped: boolean): PieceType {
  const baseType = BACK_RANK_TYPES[file];

  if (!swapped) {
    return baseType;
  }

  for (const [horseFile, elephantFile] of SWAP_FILE_PAIRS) {
    if (file === horseFile) {
      return 'elephant';
    }
    if (file === elephantFile) {
      return 'horse';
    }
  }

  return baseType;
}

function createSidePieces(side: Side, swapped: boolean): Piece[] {
  const isHan = side === 'han';
  const backRank = isHan ? HAN_BACK_RANK : CHO_BACK_RANK;
  const cannonRank = isHan ? HAN_CANNON_RANK : CHO_CANNON_RANK;
  const soldierRank = isHan ? HAN_SOLDIER_RANK : CHO_SOLDIER_RANK;
  const pieces: Piece[] = [];

  for (let file = 0; file < BACK_RANK_TYPES.length; file += 1) {
    const type = getBackRankType(file, swapped);
    pieces.push({
      id: `${side}-back-${backRank}-${file}`,
      side,
      type,
      position: { file, rank: backRank },
    });
  }

  for (const file of CANNON_FILES) {
    pieces.push({
      id: `${side}-cannon-${cannonRank}-${file}`,
      side,
      type: 'cannon',
      position: { file, rank: cannonRank },
    });
  }

  for (const file of SOLDIER_FILES) {
    pieces.push({
      id: `${side}-soldier-${soldierRank}-${file}`,
      side,
      type: 'soldier',
      position: { file, rank: soldierRank },
    });
  }

  return pieces;
}

export function createInitialBoard(swaps: SwapState = { han: false, cho: false }): BoardState {
  return {
    pieces: [
      ...createSidePieces('han', swaps.han),
      ...createSidePieces('cho', swaps.cho),
    ],
    phase: 'setup',
    turn: 'cho',
    swaps,
    moveCount: 0,
    captured: { han: [], cho: [] },
  };
}

export function toggleSideSwap(swaps: SwapState, side: Side): SwapState {
  return {
    ...swaps,
    [side]: !swaps[side],
  };
}

export function isSwappablePiece(piece: Piece): boolean {
  const backRank = piece.side === 'han' ? HAN_BACK_RANK : CHO_BACK_RANK;
  return (
    piece.position.rank === backRank &&
    (piece.type === 'horse' || piece.type === 'elephant')
  );
}

export function rebuildBoardFromSwaps(
  board: BoardState,
  swaps: SwapState,
): BoardState {
  return {
    ...board,
    swaps,
    pieces: createInitialBoard(swaps).pieces,
  };
}
