import Svg, { Path } from 'react-native-svg';
import { PIECE_GLYPHS, REFERENCE_GLYPH_VIEWBOX } from '../constants/pieceGlyphs';
import type { PieceType, Side } from '../types/janggi';

interface PieceGlyphProps {
  side: Side;
  type: PieceType;
  size: number;
  color: string;
}

function normalizeGlyphSize(size: number, viewBox: string): number {
  const viewBoxSize = Number(viewBox.split(/\s+/)[2]);
  return size * (REFERENCE_GLYPH_VIEWBOX / viewBoxSize);
}

function getGlyphPathProps(side: Side, type: PieceType, color: string) {
  const glyph = PIECE_GLYPHS[side][type];

  return {
    viewBox: glyph.viewBox,
    pathProps: {
      d: glyph.d,
      fill: color,
      stroke: color,
      strokeWidth: glyph.strokeWidth ?? 1,
      transform: glyph.transform,
    },
  };
}

export function PieceGlyph({ side, type, size, color }: PieceGlyphProps) {
  const { viewBox, pathProps } = getGlyphPathProps(side, type, color);
  const renderSize = normalizeGlyphSize(size, viewBox);

  return (
    <Svg width={renderSize} height={renderSize} viewBox={viewBox}>
      <Path {...pathProps} />
    </Svg>
  );
}

interface PieceGlyphInSvgProps extends PieceGlyphProps {
  x: number;
  y: number;
}

/** Renders a piece glyph centered at (x, y) inside a parent SVG. */
export function PieceGlyphInSvg({
  side,
  type,
  size,
  color,
  x,
  y,
}: PieceGlyphInSvgProps) {
  const { viewBox, pathProps } = getGlyphPathProps(side, type, color);
  const renderSize = normalizeGlyphSize(size, viewBox);

  return (
    <Svg
      x={x - renderSize / 2}
      y={y - renderSize / 2}
      width={renderSize}
      height={renderSize}
      viewBox={viewBox}
    >
      <Path {...pathProps} />
    </Svg>
  );
}
