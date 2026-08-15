import Svg, { Line, Rect } from 'react-native-svg';
import { CHO_PALACE, FILE_COUNT, HAN_PALACE, RANK_COUNT } from '../constants/board';
import { colors } from '../constants/colors';
import type { BoardLayout } from '../utils/coordinates';
import { intersectionToPixel } from '../utils/coordinates';

interface PalaceProps {
  layout: BoardLayout;
  palace: typeof HAN_PALACE | typeof CHO_PALACE;
}

function Palace({ layout, palace }: PalaceProps) {
  const topLeft = intersectionToPixel(palace.minFile, palace.minRank, layout);
  const bottomRight = intersectionToPixel(palace.maxFile, palace.maxRank, layout);
  const topRight = intersectionToPixel(palace.maxFile, palace.minRank, layout);
  const bottomLeft = intersectionToPixel(palace.minFile, palace.maxRank, layout);

  const width = bottomRight.x - topLeft.x;
  const height = bottomRight.y - topLeft.y;

  return (
    <>
      <Rect
        x={topLeft.x}
        y={topLeft.y}
        width={width}
        height={height}
        stroke={colors.palaceLine}
        strokeWidth={1.5}
        fill="none"
      />
      <Line
        x1={topLeft.x}
        y1={topLeft.y}
        x2={bottomRight.x}
        y2={bottomRight.y}
        stroke={colors.palaceLine}
        strokeWidth={1.5}
      />
      <Line
        x1={topRight.x}
        y1={topRight.y}
        x2={bottomLeft.x}
        y2={bottomLeft.y}
        stroke={colors.palaceLine}
        strokeWidth={1.5}
      />
    </>
  );
}

interface BoardProps {
  layout: BoardLayout;
}

export function BoardContent({ layout }: BoardProps) {
  const start = intersectionToPixel(0, 0, layout);
  const end = intersectionToPixel(FILE_COUNT - 1, RANK_COUNT - 1, layout);

  const verticalLines = Array.from({ length: FILE_COUNT }, (_, file) => {
    const top = intersectionToPixel(file, 0, layout);
    const bottom = intersectionToPixel(file, RANK_COUNT - 1, layout);
    return (
      <Line
        key={`v-${file}`}
        x1={top.x}
        y1={top.y}
        x2={bottom.x}
        y2={bottom.y}
        stroke={colors.gridLine}
        strokeWidth={1.5}
      />
    );
  });

  const horizontalLines = Array.from({ length: RANK_COUNT }, (_, rank) => {
    const left = intersectionToPixel(0, rank, layout);
    const right = intersectionToPixel(FILE_COUNT - 1, rank, layout);
    return (
      <Line
        key={`h-${rank}`}
        x1={left.x}
        y1={left.y}
        x2={right.x}
        y2={right.y}
        stroke={colors.gridLine}
        strokeWidth={1.5}
      />
    );
  });

  return (
    <>
      <Rect
        x={start.x}
        y={start.y}
        width={end.x - start.x}
        height={end.y - start.y}
        fill={colors.boardWood}
        stroke={colors.boardBorder}
        strokeWidth={3}
      />
      {verticalLines}
      {horizontalLines}
      <Palace layout={layout} palace={HAN_PALACE} />
      <Palace layout={layout} palace={CHO_PALACE} />
    </>
  );
}

export function Board({ layout }: BoardProps) {
  return (
    <Svg width={layout.width} height={layout.height}>
      <BoardContent layout={layout} />
    </Svg>
  );
}
