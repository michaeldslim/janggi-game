import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BoardWithPieces } from '../src/components/BoardWithPieces';
import { colors } from '../src/constants/colors';
import { SIDE_LABELS } from '../src/constants/pieces';
import { useBoardLayout } from '../src/hooks/useBoardLayout';
import type { BoardState, Piece } from '../src/types/janggi';
import {
  createInitialBoard,
  isSwappablePiece,
  rebuildBoardFromSwaps,
  toggleSideSwap,
} from '../src/utils/setup';

export default function GameScreen() {
  const layout = useBoardLayout();
  const [board, setBoard] = useState<BoardState>(() => createInitialBoard());
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);

  const handlePiecePress = useCallback(
    (piece: Piece) => {
      if (board.phase !== 'setup' || !isSwappablePiece(piece)) {
        return;
      }

      const nextSwaps = toggleSideSwap(board.swaps, piece.side);
      setBoard((current) => rebuildBoardFromSwaps(current, nextSwaps));
      setSelectedPieceId(piece.id);
    },
    [board.phase, board.swaps],
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
          selectedPieceId={selectedPieceId}
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
        ) : null}

        {board.phase === 'setup' ? (
          <Pressable style={styles.button} onPress={handleStartGame}>
            <Text style={styles.buttonText}>Start Game</Text>
          </Pressable>
        ) : (
          <Text style={styles.turnText}>{SIDE_LABELS[board.turn]} moves first</Text>
        )}
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
