import type { Piece } from '../types/janggi';
import { findGeneral, getPieceAt } from './boardUtils';

export function isBikjang(pieces: Piece[]): boolean {
  const choGeneral = findGeneral(pieces, 'cho');
  const hanGeneral = findGeneral(pieces, 'han');

  if (!choGeneral || !hanGeneral) {
    return false;
  }

  const file = choGeneral.position.file;
  if (file !== hanGeneral.position.file) {
    return false;
  }

  const minRank = Math.min(choGeneral.position.rank, hanGeneral.position.rank);
  const maxRank = Math.max(choGeneral.position.rank, hanGeneral.position.rank);

  for (let rank = minRank + 1; rank < maxRank; rank += 1) {
    if (getPieceAt(pieces, { file, rank }) !== undefined) {
      return false;
    }
  }

  return true;
}

export function wouldCreateBikjang(
  pieces: Piece[],
  piece: Piece,
  destination: { file: number; rank: number },
): boolean {
  const capturedPiece = pieces.find(
    (candidate) =>
      candidate.position.file === destination.file &&
      candidate.position.rank === destination.rank &&
      candidate.id !== piece.id,
  );

  const nextPieces = pieces
    .filter((candidate) => candidate.id !== capturedPiece?.id)
    .map((candidate) =>
      candidate.id === piece.id
        ? { ...candidate, position: { ...destination } }
        : candidate,
    );

  return isBikjang(nextPieces);
}
