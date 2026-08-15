import { Pressable, StyleSheet, View } from 'react-native';
import Svg from 'react-native-svg';
import type { BoardState, LastMove, Piece, Position } from '../types/janggi';
import type { BoardLayout } from '../utils/coordinates';
import { getTouchTargetStyle } from '../utils/coordinates';
import { getPieceAt } from '../game/boardUtils';
import { BoardContent } from './Board';
import { LastMoveFromMarker } from './LastMoveMarker';
import { MoveIndicator } from './MoveIndicator';
import { AnimatedPieceView } from './AnimatedPieceView';

interface BoardWithPiecesProps {
  board: BoardState;
  layout: BoardLayout;
  onPiecePress?: (piece: Piece) => void;
  onMovePress?: (position: Position) => void;
  selectedPieceId?: string | null;
  legalMoves?: Position[];
  lastMove?: LastMove;
  emphasizeLastMove?: boolean;
}

export function BoardWithPieces({
  board,
  layout,
  onPiecePress,
  onMovePress,
  selectedPieceId,
  legalMoves = [],
  lastMove,
  emphasizeLastMove = false,
}: BoardWithPiecesProps) {
  const showLastMove = emphasizeLastMove && lastMove !== undefined;

  return (
    <View style={[styles.container, { width: layout.width, height: layout.height }]}>
      <Svg width={layout.width} height={layout.height}>
        <BoardContent layout={layout} />
        {showLastMove ? (
          <LastMoveFromMarker position={lastMove.from} layout={layout} />
        ) : null}
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
        <AnimatedPieceView
          key={piece.id}
          piece={piece}
          layout={layout}
          selected={piece.id === selectedPieceId}
          lastMoved={showLastMove && piece.id === lastMove.pieceId}
        />
      ))}

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
