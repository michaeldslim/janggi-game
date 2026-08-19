import { Circle, G, Text as SvgText } from 'react-native-svg';
import { getPieceHanja } from '../constants/pieces';
import { getPieceLabelFontSize, getPieceRadius } from '../constants/pieceSize';
import { colors } from '../constants/colors';
import type { Piece } from '../types/janggi';
import type { BoardLayout } from '../utils/coordinates';
import { intersectionToPixel } from '../utils/coordinates';

interface PieceViewProps {
  piece: Piece;
  layout: BoardLayout;
  selected?: boolean;
  lastMoved?: boolean;
}

export function PieceView({ piece, layout, selected = false, lastMoved = false }: PieceViewProps) {
  const { x, y } = intersectionToPixel(piece.position.file, piece.position.rank, layout);
  const radius = getPieceRadius(layout.pieceRadius, piece.type);
  const textColor = piece.side === 'cho' ? colors.choPieceText : colors.hanPieceText;
  const fontSize = getPieceLabelFontSize(radius);

  return (
    <G>
      {lastMoved ? (
        <Circle
          cx={x}
          cy={y}
          r={radius + 5}
          fill="none"
          stroke={colors.lastMoveRing}
          strokeWidth={3}
        />
      ) : null}
      {selected ? (
        <Circle
          cx={x}
          cy={y}
          r={radius + 4}
          fill="none"
          stroke="#FACC15"
          strokeWidth={2.5}
        />
      ) : null}
      <Circle
        cx={x}
        cy={y}
        r={radius}
        fill={colors.pieceBackground}
        stroke={colors.pieceBorder}
        strokeWidth={1.5}
      />
      <SvgText
        x={x}
        y={y + fontSize * 0.35}
        fill={textColor}
        fontSize={fontSize}
        fontWeight="700"
        textAnchor="middle"
      >
        {getPieceHanja(piece)}
      </SvgText>
    </G>
  );
}
