import { Pressable, StyleSheet, View } from 'react-native';
import Svg from 'react-native-svg';
import type { BoardState, Piece, Position } from '../types/janggi';
import type { BoardLayout } from '../utils/coordinates';
import { getTouchTargetStyle } from '../utils/coordinates';
import { getPieceAt } from '../game/boardUtils';
import { BoardContent } from './Board';
import { MoveIndicator } from './MoveIndicator';
import { PieceView } from './Piece';

interface BoardWithPiecesProps {
  board: BoardState;
  layout: BoardLayout;
  onPiecePress?: (piece: Piece) => void;
  onMovePress?: (position: Position) => void;
  selectedPieceId?: string | null;
  legalMoves?: Position[];
}

export function BoardWithPieces({
  board,
  layout,
  onPiecePress,
  onMovePress,
  selectedPieceId,
  legalMoves = [],
}: BoardWithPiecesProps) {
  return (
    <View style={[styles.container, { width: layout.width, height: layout.height }]}>
      <Svg width={layout.width} height={layout.height}>
        <BoardContent layout={layout} />
        {board.pieces.map((piece) => (
          <PieceView
            key={piece.id}
            piece={piece}
            layout={layout}
            selected={piece.id === selectedPieceId}
          />
        ))}
        {legalMoves.map((position) => {
          const occupant = getPieceAt(board.pieces, position);
          const key = `${position.file},${position.rank}`;

          return (
            <MoveIndicator
              key={key}
              position={position}
              layout={layout}
              isCapture={occupant !== undefined}
            />
          );
        })}
      </Svg>

      {board.pieces.map((piece) => (
        <Pressable
          key={`touch-${piece.id}`}
          style={getTouchTargetStyle(piece.position.file, piece.position.rank, layout)}
          onPress={onPiecePress ? () => onPiecePress(piece) : undefined}
        />
      ))}

      {legalMoves.map((position) => {
        const key = `move-touch-${position.file},${position.rank}`;

        return (
          <Pressable
            key={key}
            style={[getTouchTargetStyle(position.file, position.rank, layout), styles.moveTarget]}
            onPress={onMovePress ? () => onMovePress(position) : undefined}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  moveTarget: {
    zIndex: 2,
  },
});
