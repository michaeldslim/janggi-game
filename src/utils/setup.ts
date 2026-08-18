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
import type {
  BoardState,
  Piece,
  PieceType,
  Side,
  SideSwapState,
  SwapState,
  SwapWing,
} from '../types/janggi';
import { DEFAULT_SWAP_STATE } from '../types/janggi';

function getWingForFile(file: number): SwapWing | null {
  if (file === SWAP_FILE_PAIRS[0][0] || file === SWAP_FILE_PAIRS[0][1]) {
    return 'left';
  }

  if (file === SWAP_FILE_PAIRS[1][0] || file === SWAP_FILE_PAIRS[1][1]) {
    return 'right';
  }

  return null;
}

function getBackRankType(file: number, sideSwaps: SideSwapState): PieceType {
  const baseType = BACK_RANK_TYPES[file];
  const wing = getWingForFile(file);

  if (!wing) {
    return baseType;
  }

  if (!sideSwaps[wing]) {
    return baseType;
  }

  const [fileA, fileB] = SWAP_FILE_PAIRS[wing === 'left' ? 0 : 1];
  return file === fileA ? BACK_RANK_TYPES[fileB] : BACK_RANK_TYPES[fileA];
}

function createSidePieces(side: Side, sideSwaps: SideSwapState): Piece[] {
  const isHan = side === 'han';
  const backRank = isHan ? HAN_BACK_RANK : CHO_BACK_RANK;
  const cannonRank = isHan ? HAN_CANNON_RANK : CHO_CANNON_RANK;
  const soldierRank = isHan ? HAN_SOLDIER_RANK : CHO_SOLDIER_RANK;
  const pieces: Piece[] = [];

  for (let file = 0; file < BACK_RANK_TYPES.length; file += 1) {
    const type = getBackRankType(file, sideSwaps);
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

export function createInitialBoard(swaps: SwapState = DEFAULT_SWAP_STATE): BoardState {
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

export function getSwapWingForPiece(piece: Piece): SwapWing | null {
  const backRank = piece.side === 'han' ? HAN_BACK_RANK : CHO_BACK_RANK;

  if (piece.position.rank !== backRank) {
    return null;
  }

  return getWingForFile(piece.position.file);
}

export function toggleWingSwap(
  swaps: SwapState,
  side: Side,
  wing: SwapWing,
): SwapState {
  return {
    ...swaps,
    [side]: {
      ...swaps[side],
      [wing]: !swaps[side][wing],
    },
  };
}

export function isSwappablePiece(piece: Piece): boolean {
  return getSwapWingForPiece(piece) !== null;
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
