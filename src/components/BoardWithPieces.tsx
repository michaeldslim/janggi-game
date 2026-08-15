import Svg from 'react-native-svg';
import type { BoardState, Piece } from '../types/janggi';
import type { BoardLayout } from '../utils/coordinates';
import { BoardContent } from './Board';
import { PieceView } from './Piece';

interface BoardWithPiecesProps {
  board: BoardState;
  layout: BoardLayout;
  onPiecePress?: (piece: Piece) => void;
  selectedPieceId?: string | null;
}

export function BoardWithPieces({
  board,
  layout,
  onPiecePress,
  selectedPieceId,
}: BoardWithPiecesProps) {
  return (
    <Svg width={layout.width} height={layout.height}>
      <BoardContent layout={layout} />
      {board.pieces.map((piece) => (
        <PieceView
          key={piece.id}
          piece={piece}
          layout={layout}
          selected={piece.id === selectedPieceId}
          onPress={onPiecePress}
        />
      ))}
    </Svg>
  );
}
