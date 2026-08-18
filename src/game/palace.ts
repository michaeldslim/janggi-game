import { CHO_PALACE, HAN_PALACE } from '../constants/board';
import type { Position, Side } from '../types/janggi';
import { isOnBoard } from './boardUtils';

type PalaceBounds = {
  minFile: number;
  maxFile: number;
  minRank: number;
  maxRank: number;
};

const HAN_PALACE_MOVES: Record<string, Position[]> = {
  '3,0': [{ file: 4, rank: 0 }, { file: 4, rank: 1 }, { file: 3, rank: 1 }],
  '4,0': [{ file: 3, rank: 0 }, { file: 5, rank: 0 }, { file: 4, rank: 1 }],
  '5,0': [{ file: 4, rank: 0 }, { file: 4, rank: 1 }, { file: 5, rank: 1 }],
  '3,1': [{ file: 3, rank: 0 }, { file: 3, rank: 2 }, { file: 4, rank: 1 }],
  '4,1': [
    { file: 3, rank: 1 },
    { file: 5, rank: 1 },
    { file: 4, rank: 0 },
    { file: 4, rank: 2 },
    { file: 3, rank: 0 },
    { file: 5, rank: 0 },
    { file: 3, rank: 2 },
    { file: 5, rank: 2 },
  ],
  '5,1': [{ file: 5, rank: 0 }, { file: 5, rank: 2 }, { file: 4, rank: 1 }],
  '3,2': [{ file: 4, rank: 2 }, { file: 4, rank: 1 }, { file: 3, rank: 1 }],
  '4,2': [{ file: 3, rank: 2 }, { file: 5, rank: 2 }, { file: 4, rank: 1 }],
  '5,2': [{ file: 4, rank: 2 }, { file: 4, rank: 1 }, { file: 5, rank: 1 }],
};

function toChoPalaceMoves(): Record<string, Position[]> {
  const rankOffset = CHO_PALACE.minRank - HAN_PALACE.minRank;
  const moves: Record<string, Position[]> = {};

  for (const [key, targets] of Object.entries(HAN_PALACE_MOVES)) {
    const [file, rank] = key.split(',').map(Number);
    moves[`${file},${rank + rankOffset}`] = targets.map((target) => ({
      file: target.file,
      rank: target.rank + rankOffset,
    }));
  }

  return moves;
}

const CHO_PALACE_MOVES = toChoPalaceMoves();

export function getOwnPalace(side: Side) {
  return side === 'han' ? HAN_PALACE : CHO_PALACE;
}

export function getEnemyPalace(side: Side) {
  return side === 'han' ? CHO_PALACE : HAN_PALACE;
}

export function isInPalace(position: Position, palace: PalaceBounds): boolean {
  return (
    position.file >= palace.minFile &&
    position.file <= palace.maxFile &&
    position.rank >= palace.minRank &&
    position.rank <= palace.maxRank
  );
}

export function isInOwnPalace(position: Position, side: Side): boolean {
  return isInPalace(position, getOwnPalace(side));
}

export function isInEnemyPalace(position: Position, side: Side): boolean {
  return isInPalace(position, getEnemyPalace(side));
}

export function getPalaceStepMoves(position: Position, side: Side): Position[] {
  const key = `${position.file},${position.rank}`;
  const moves = side === 'han' ? HAN_PALACE_MOVES[key] : CHO_PALACE_MOVES[key];

  if (!moves) {
    return [];
  }

  return moves.filter(isOnBoard);
}
