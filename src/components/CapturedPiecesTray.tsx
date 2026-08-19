import { StyleSheet, View } from 'react-native';
import { colors } from '../constants/colors';
import { getPieceGlyphSize, getPieceRadius } from '../constants/pieceSize';
import type { CapturedPiece } from '../types/janggi';
import { PieceGlyph } from './PieceGlyph';
import { PieceOctagon } from './PieceOctagon';

interface CapturedPiecesTrayProps {
  pieces: CapturedPiece[];
  align: 'top-left' | 'bottom-right';
  pieceRadius: number;
}

function CapturedPieceChip({
  piece,
  baseRadius,
}: {
  piece: CapturedPiece;
  baseRadius: number;
}) {
  const radius = getPieceRadius(baseRadius, piece.type);
  const textColor = piece.side === 'cho' ? colors.choPieceText : colors.hanPieceText;
  const glyphSize = getPieceGlyphSize(radius, piece.type);

  return (
    <PieceOctagon
      radius={radius}
      fill={colors.pieceBackground}
      stroke={colors.pieceBorder}
      strokeWidth={1}
    >
      <PieceGlyph
        side={piece.side}
        type={piece.type}
        size={glyphSize}
        color={textColor}
      />
    </PieceOctagon>
  );
}

export function CapturedPiecesTray({
  pieces,
  align,
  pieceRadius,
}: CapturedPiecesTrayProps) {
  const trayHeight = getPieceRadius(pieceRadius, 'general') * 2 + 8;

  return (
    <View
      style={[
        styles.tray,
        { minHeight: trayHeight },
        align === 'top-left' ? styles.topLeft : styles.bottomRight,
      ]}
    >
      {pieces.map((piece) => (
        <CapturedPieceChip key={piece.id} piece={piece} baseRadius={pieceRadius} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tray: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    paddingVertical: 4,
  },
  topLeft: {
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
  },
  bottomRight: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
});
