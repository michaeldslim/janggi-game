import { FILE_COUNT, RANK_COUNT } from '../constants/board';
import type { Piece, Position, Side } from '../types/janggi';
import { positionsEqual } from '../utils/coordinates';

export function isOnBoard({ file, rank }: Position): boolean {
  return file >= 0 && file < FILE_COUNT && rank >= 0 && rank < RANK_COUNT;
}

export function positionKey({ file, rank }: Position): string {
  return `${file},${rank}`;
}

export function getPieceAt(pieces: Piece[], position: Position): Piece | undefined {
  return pieces.find((piece) => positionsEqual(piece.position, position));
}

export function getOppositeSide(side: Side): Side {
  return side === 'cho' ? 'han' : 'cho';
}

export function isEnemy(piece: Piece, other: Piece): boolean {
  return piece.side !== other.side;
}

export function isFriendly(piece: Piece, other: Piece): boolean {
  return piece.side === other.side;
}

export function canCapture(movingPiece: Piece, target: Piece | undefined): boolean {
  return target !== undefined && isEnemy(movingPiece, target);
}

export function addPosition(position: Position, deltaFile: number, deltaRank: number): Position {
  return { file: position.file + deltaFile, rank: position.rank + deltaRank };
}

export function findGeneral(pieces: Piece[], side: Side): Piece | undefined {
  return pieces.find((piece) => piece.side === side && piece.type === 'general');
}
