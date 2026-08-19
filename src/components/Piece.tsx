import { G, Polygon } from 'react-native-svg';
import { getPieceGlyphSize, getPieceRadius } from '../constants/pieceSize';
import { colors } from '../constants/colors';
import { getOctagonPoints } from '../utils/octagon';
import type { Piece } from '../types/janggi';
import type { BoardLayout } from '../utils/coordinates';
import { intersectionToPixel } from '../utils/coordinates';
import { PieceGlyphInSvg } from './PieceGlyph';

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
  const glyphSize = getPieceGlyphSize(radius, piece.type);

  return (
    <G>
      {lastMoved ? (
        <Polygon
          points={getOctagonPoints(x, y, radius + 5)}
          fill="none"
          stroke={colors.lastMoveRing}
          strokeWidth={3}
        />
      ) : null}
      {selected ? (
        <Polygon
          points={getOctagonPoints(x, y, radius + 4)}
          fill="none"
          stroke="#FACC15"
          strokeWidth={2.5}
        />
      ) : null}
      <Polygon
        points={getOctagonPoints(x, y, radius)}
        fill={colors.pieceBackground}
        stroke={colors.pieceBorder}
        strokeWidth={1.5}
      />
      <PieceGlyphInSvg
        side={piece.side}
        type={piece.type}
        size={glyphSize}
        color={textColor}
        x={x}
        y={y}
      />
    </G>
  );
}
