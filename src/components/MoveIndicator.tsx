import { Circle, G } from 'react-native-svg';
import { colors } from '../constants/colors';
import type { Position } from '../types/janggi';
import type { BoardLayout } from '../utils/coordinates';
import { intersectionToPixel } from '../utils/coordinates';

interface MoveIndicatorProps {
  position: Position;
  layout: BoardLayout;
}

export function MoveIndicator({
  position,
  layout,
}: MoveIndicatorProps) {
  const { x, y } = intersectionToPixel(position.file, position.rank, layout);
  const dotRadius = layout.pieceRadius * 0.32;

  return (
    <G>
      <Circle
        cx={x}
        cy={y}
        r={dotRadius}
        fill={colors.moveDot}
        opacity={0.9}
      />
    </G>
  );
}
