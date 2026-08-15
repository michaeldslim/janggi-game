import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';
import { PIECE_LABELS } from '../constants/pieces';
import { colors } from '../constants/colors';
import type { Piece } from '../types/janggi';
import type { BoardLayout } from '../utils/coordinates';
import { intersectionToPixel } from '../utils/coordinates';

interface PieceViewProps {
  piece: Piece;
  layout: BoardLayout;
  selected?: boolean;
  onPress?: (piece: Piece) => void;
}

export function PieceView({ piece, layout, selected = false, onPress }: PieceViewProps) {
  const { x, y } = intersectionToPixel(piece.position.file, piece.position.rank, layout);
  const fill = piece.side === 'cho' ? colors.choPiece : colors.hanPiece;
  const stroke = piece.side === 'cho' ? colors.choPieceBorder : colors.hanPieceBorder;
  const fontSize = layout.pieceRadius * 1.15;

  return (
    <G onPress={onPress ? () => onPress(piece) : undefined}>
      {selected ? (
        <Circle
          cx={x}
          cy={y}
          r={layout.pieceRadius + 4}
          fill="none"
          stroke="#FACC15"
          strokeWidth={2.5}
        />
      ) : null}
      <Circle
        cx={x}
        cy={y}
        r={layout.pieceRadius}
        fill={fill}
        stroke={stroke}
        strokeWidth={2}
      />
      <SvgText
        x={x}
        y={y + fontSize * 0.35}
        fill={colors.pieceText}
        fontSize={fontSize}
        fontWeight="700"
        textAnchor="middle"
      >
        {PIECE_LABELS[piece.type]}
      </SvgText>
    </G>
  );
}
