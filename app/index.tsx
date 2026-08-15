import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BoardWithPieces } from '../src/components/BoardWithPieces';
import { colors } from '../src/constants/colors';
import { SIDE_LABELS } from '../src/constants/pieces';
import { applyMove } from '../src/game/applyMove';
import { getLegalMovesForPiece } from '../src/game/moves';
import { useBoardLayout } from '../src/hooks/useBoardLayout';
import { useMoveSound } from '../src/hooks/useMoveSound';
import type { BoardState, Piece, Position } from '../src/types/janggi';
import { positionsEqual } from '../src/utils/coordinates';
import {
  createInitialBoard,
  isSwappablePiece,
  rebuildBoardFromSwaps,
  toggleSideSwap,
} from '../src/utils/setup';

export default function GameScreen() {
  const layout = useBoardLayout();
  const playMoveSound = useMoveSound();
  const [board, setBoard] = useState<BoardState>(() => createInitialBoard());
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);

  const selectedPiece = useMemo(
    () => board.pieces.find((piece) => piece.id === selectedPieceId) ?? null,
    [board.pieces, selectedPieceId],
  );

  const legalMoves = useMemo(() => {
    if (!selectedPiece) {
      return [];
    }

    return getLegalMovesForPiece(board, selectedPiece);
  }, [board, selectedPiece]);

  const handlePiecePress = useCallback(
    (piece: Piece) => {
      if (board.phase === 'setup') {
        if (!isSwappablePiece(piece)) {
          return;
        }

        const nextSwaps = toggleSideSwap(board.swaps, piece.side);
        setBoard((current) => rebuildBoardFromSwaps(current, nextSwaps));
        setSelectedPieceId(piece.id);
        return;
      }

      if (board.phase !== 'playing' || piece.side !== board.turn) {
        return;
      }

      if (selectedPieceId === piece.id) {
        setSelectedPieceId(null);
        return;
      }

      const destinationMove = legalMoves.find((move) =>
        positionsEqual(move, piece.position),
      );

      if (selectedPiece && destinationMove) {
        setBoard((current) => applyMove(current, selectedPiece, piece.position));
        setSelectedPieceId(null);
        playMoveSound();
        return;
      }

      setSelectedPieceId(piece.id);
    },
    [board.phase, board.swaps, board.turn, legalMoves, playMoveSound, selectedPiece, selectedPieceId],
  );

  const handleMovePress = useCallback(
    (destination: Position) => {
      if (!selectedPiece) {
        return;
      }

      setBoard((current) => applyMove(current, selectedPiece, destination));
      setSelectedPieceId(null);
      playMoveSound();
    },
    [playMoveSound, selectedPiece],
  );

  const handleStartGame = useCallback(() => {
    setBoard((current) => ({
      ...current,
      phase: 'playing',
    }));
    setSelectedPieceId(null);
  }, []);

  const phaseLabel =
    board.phase === 'setup'
      ? 'Tap a horse or elephant to swap positions, then start.'
      : selectedPiece
        ? `Select destination for ${SIDE_LABELS[selectedPiece.side]} ${selectedPiece.type}`
        : `${SIDE_LABELS[board.turn]} to move`;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Janggi</Text>
        <Text style={styles.subtitle}>한국 장기</Text>
      </View>

      <View style={styles.boardContainer}>
        <BoardWithPieces
          board={board}
          layout={layout}
          onPiecePress={handlePiecePress}
          onMovePress={handleMovePress}
          selectedPieceId={selectedPieceId}
          legalMoves={legalMoves}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.phaseText}>{phaseLabel}</Text>

        {board.phase === 'setup' ? (
          <View style={styles.swapRow}>
            <Text style={styles.swapLabel}>
              Han swap: {board.swaps.han ? '象馬' : '馬象'}
            </Text>
            <Text style={styles.swapLabel}>
              Cho swap: {board.swaps.cho ? '象馬' : '馬象'}
            </Text>
          </View>
        ) : (
          <Text style={styles.turnText}>
            Move {board.moveCount + 1} · {SIDE_LABELS[board.turn]}
          </Text>
        )}

        {board.phase === 'setup' ? (
          <Pressable style={styles.button} onPress={handleStartGame}>
            <Text style={styles.buttonText}>Start Game</Text>
          </Pressable>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 4,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 2,
  },
  boardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 10,
  },
  phaseText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
  swapRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  swapLabel: {
    color: colors.textPrimary,
    fontSize: 13,
  },
  button: {
    backgroundColor: colors.button,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: '600',
  },
  turnText: {
    color: colors.textPrimary,
    fontSize: 15,
    textAlign: 'center',
  },
});
