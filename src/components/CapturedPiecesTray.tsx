import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';
import { getPieceHanja } from '../constants/pieces';
import type { CapturedPiece } from '../types/janggi';
import { getPieceLabelStyle } from './pieceLabelStyle';

interface CapturedPiecesTrayProps {
  pieces: CapturedPiece[];
  align: 'top-left' | 'bottom-right';
  pieceRadius: number;
}

function CapturedPieceChip({
  piece,
  radius,
}: {
  piece: CapturedPiece;
  radius: number;
}) {
  const textColor = piece.side === 'cho' ? colors.choPieceText : colors.hanPieceText;
  const diameter = radius * 2;
  const fontSize = radius * 1.1;

  return (
    <View
      style={[
        styles.chip,
        {
          width: diameter,
          height: diameter,
          borderRadius: radius,
        },
      ]}
    >
      <Text style={getPieceLabelStyle(fontSize, textColor)}>
        {getPieceHanja(piece)}
      </Text>
    </View>
  );
}

export function CapturedPiecesTray({
  pieces,
  align,
  pieceRadius,
}: CapturedPiecesTrayProps) {
  const trayHeight = pieceRadius * 2 + 8;

  return (
    <View
      style={[
        styles.tray,
        { minHeight: trayHeight },
        align === 'top-left' ? styles.topLeft : styles.bottomRight,
      ]}
    >
      {pieces.map((piece) => (
        <CapturedPieceChip key={piece.id} piece={piece} radius={pieceRadius} />
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
  chip: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.pieceBackground,
    borderColor: colors.pieceBorder,
    borderWidth: 1,
  },
});
