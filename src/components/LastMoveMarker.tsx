import { Circle } from 'react-native-svg';
import { colors } from '../constants/colors';
import type { Position } from '../types/janggi';
import type { BoardLayout } from '../utils/coordinates';
import { intersectionToPixel } from '../utils/coordinates';

interface LastMoveMarkerProps {
  position: Position;
  layout: BoardLayout;
}

export function LastMoveFromMarker({ position, layout }: LastMoveMarkerProps) {
  const { x, y } = intersectionToPixel(position.file, position.rank, layout);

  return (
    <Circle
      cx={x}
      cy={y}
      r={layout.pieceRadius * 0.88}
      fill={colors.lastMoveFrom}
      stroke={colors.lastMoveRing}
      strokeWidth={1.5}
      strokeOpacity={0.55}
    />
  );
}
