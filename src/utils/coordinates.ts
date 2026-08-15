import { FILE_GAPS, RANK_GAPS } from '../constants/board';

export interface BoardLayout {
  width: number;
  height: number;
  padding: number;
  cellWidth: number;
  cellHeight: number;
  pieceRadius: number;
}

export function createBoardLayout(
  maxWidth: number,
  maxHeight: number,
  padding = 12,
): BoardLayout {
  const innerMaxWidth = Math.max(maxWidth - padding * 2, 1);
  const innerMaxHeight = Math.max(maxHeight - padding * 2, 1);

  let cellWidth = innerMaxWidth / FILE_GAPS;
  let cellHeight = innerMaxHeight / RANK_GAPS;

  const cellSize = Math.min(cellWidth, cellHeight);
  cellWidth = cellSize;
  cellHeight = cellSize;

  const width = cellWidth * FILE_GAPS + padding * 2;
  const height = cellHeight * RANK_GAPS + padding * 2;

  return {
    width,
    height,
    padding,
    cellWidth,
    cellHeight,
    pieceRadius: cellSize * 0.38,
  };
}

export function intersectionToPixel(
  file: number,
  rank: number,
  layout: BoardLayout,
): { x: number; y: number } {
  return {
    x: layout.padding + file * layout.cellWidth,
    y: layout.padding + rank * layout.cellHeight,
  };
}

export function positionsEqual(
  a: { file: number; rank: number },
  b: { file: number; rank: number },
): boolean {
  return a.file === b.file && a.rank === b.rank;
}
