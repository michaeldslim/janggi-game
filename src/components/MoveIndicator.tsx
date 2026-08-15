import { Circle, G } from 'react-native-svg';
import { colors } from '../constants/colors';
import type { Position } from '../types/janggi';
import type { BoardLayout } from '../utils/coordinates';
import { intersectionToPixel } from '../utils/coordinates';

interface MoveIndicatorProps {
  position: Position;
  layout: BoardLayout;
  isCapture?: boolean;
}

export function MoveIndicator({
  position,
  layout,
  isCapture = false,
}: MoveIndicatorProps) {
  const { x, y } = intersectionToPixel(position.file, position.rank, layout);
  const dotRadius = layout.pieceRadius * 0.32;

  return (
    <G>
      {isCapture ? (
        <Circle
          cx={x}
          cy={y}
          r={layout.pieceRadius * 0.85}
          fill="none"
          stroke={colors.moveCapture}
          strokeWidth={2.5}
          strokeDasharray="6 4"
        />
      ) : null}
      <Circle
        cx={x}
        cy={y}
        r={dotRadius}
        fill={isCapture ? 'rgba(34, 197, 94, 0.25)' : colors.moveDot}
        opacity={0.9}
      />
    </G>
  );
}
