import { FILE_GAPS, RANK_GAPS } from '../constants/board';
import { MAX_PIECE_SIZE_MULTIPLIER } from '../constants/pieceSize';

const PIECE_RADIUS_RATIO = 0.38;
const LAYOUT_PIECE_RADIUS_RATIO = PIECE_RADIUS_RATIO * MAX_PIECE_SIZE_MULTIPLIER;
const SELECTION_RING_EXTRA = 4;
const EDGE_BUFFER = 6;

export interface BoardLayout {
  width: number;
  height: number;
  padding: number;
  cellWidth: number;
  cellHeight: number;
  pieceRadius: number;
}

function edgePaddingForCellSize(cellSize: number): number {
  const pieceRadius = cellSize * LAYOUT_PIECE_RADIUS_RATIO;
  return pieceRadius + SELECTION_RING_EXTRA + EDGE_BUFFER;
}

export function createBoardLayout(
  maxWidth: number,
  maxHeight: number,
): BoardLayout {
  const widthCoeff = FILE_GAPS + 2 * LAYOUT_PIECE_RADIUS_RATIO;
  const heightCoeff = RANK_GAPS + 2 * LAYOUT_PIECE_RADIUS_RATIO;
  const fixedEdge = 2 * (SELECTION_RING_EXTRA + EDGE_BUFFER);

  const cellSize = Math.min(
    (Math.max(maxWidth - fixedEdge, 1)) / widthCoeff,
    (Math.max(maxHeight - fixedEdge, 1)) / heightCoeff,
  );

  const padding = edgePaddingForCellSize(cellSize);
  const pieceRadius = cellSize * PIECE_RADIUS_RATIO;

  return {
    width: cellSize * FILE_GAPS + padding * 2,
    height: cellSize * RANK_GAPS + padding * 2,
    padding,
    cellWidth: cellSize,
    cellHeight: cellSize,
    pieceRadius,
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

const MIN_TOUCH_TARGET = 48;

export function getTouchTargetSize(layout: BoardLayout): number {
  const cellSize = Math.min(layout.cellWidth, layout.cellHeight);
  return Math.max(MIN_TOUCH_TARGET, cellSize * 0.92);
}

export function getTouchTargetStyle(
  file: number,
  rank: number,
  layout: BoardLayout,
) {
  const { x, y } = intersectionToPixel(file, rank, layout);
  const size = getTouchTargetSize(layout);

  return {
    position: 'absolute' as const,
    left: x - size / 2,
    top: y - size / 2,
    width: size,
    height: size,
  };
}
