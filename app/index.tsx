import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BoardWithPieces } from '../src/components/BoardWithPieces';
import { CapturedPiecesTray } from '../src/components/CapturedPiecesTray';
import { CheckMessageOverlay } from '../src/components/CheckMessageOverlay';
import { MeonggunMessageOverlay } from '../src/components/MeonggunMessageOverlay';
import { ScoreDisplay } from '../src/components/ScoreDisplay';
import { SettingsIcon } from '../src/components/SettingsIcon';
import { colors } from '../src/constants/colors';
import { getPieceHanja } from '../src/constants/pieces';
import { pickAiMove } from '../src/game/ai';
import { applyMove, passTurn } from '../src/game/applyMove';
import { getOppositeSide } from '../src/game/boardUtils';
import { isInCheck } from '../src/game/check';
import { getLegalMovesForPiece } from '../src/game/moves';
import { useBoardLayout } from '../src/hooks/useBoardLayout';
import { useMoveSound } from '../src/hooks/useMoveSound';
import { useI18n } from '../src/i18n/I18nProvider';
import { useGameSettings } from '../src/settings/GameSettingsProvider';
import type { BoardState, Piece, Position, Side } from '../src/types/janggi';
import { positionsEqual } from '../src/utils/coordinates';
import {
  createInitialBoard,
  getSwapWingForPiece,
  isSwappablePiece,
  rebuildBoardFromSwaps,
  toggleWingSwap,
} from '../src/utils/setup';

const AI_THINK_DELAY_MS = 550;

export default function GameScreen() {
  const router = useRouter();
  const { t, sideLabel, pieceLabel } = useI18n();
  const { gameMode, userSideVsAi, player1SideLocal, aiDifficulty } = useGameSettings();
  const layout = useBoardLayout();
  const playMoveSound = useMoveSound();
  const [board, setBoard] = useState<BoardState>(() => createInitialBoard());
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [checkMessageKey, setCheckMessageKey] = useState(0);
  const [meonggunMessageKey, setMeonggunMessageKey] = useState(0);
  const boardRef = useRef(board);
  const previousBoardRef = useRef(board);
  const lastProcessedCheckMove = useRef(0);
  const lastProcessedMeonggunMove = useRef(0);
  const previousGameModeRef = useRef(gameMode);

  const userSide: Side = gameMode === 'vsAi' ? userSideVsAi : player1SideLocal;
  const aiSide: Side = getOppositeSide(userSide);
  const player1Side: Side = player1SideLocal;

  useEffect(() => {
    boardRef.current = board;
  }, [board]);

  useEffect(() => {
    if (previousGameModeRef.current === gameMode) {
      return;
    }

    previousGameModeRef.current = gameMode;
    setBoard(createInitialBoard());
    setSelectedPieceId(null);
    setIsAiThinking(false);
  }, [gameMode]);

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

  const isUserTurn =
    gameMode === 'local' ||
    (board.phase === 'playing' && board.turn === userSide && !isAiThinking);

  const inCheckSide = useMemo(() => {
    if (board.phase !== 'playing') {
      return null;
    }

    return isInCheck(board, board.turn) ? board.turn : null;
  }, [board]);

  useEffect(() => {
    if (board.phase !== 'playing' || board.moveCount === 0) {
      lastProcessedCheckMove.current = 0;
      return;
    }

    if (!inCheckSide || board.moveCount <= lastProcessedCheckMove.current) {
      return;
    }

    lastProcessedCheckMove.current = board.moveCount;
    setCheckMessageKey((key) => key + 1);
  }, [board.moveCount, board.phase, inCheckSide]);

  useEffect(() => {
    const previous = previousBoardRef.current;
    previousBoardRef.current = board;

    if (board.moveCount === 0) {
      lastProcessedMeonggunMove.current = 0;
      return;
    }

    if (board.moveCount <= previous.moveCount || previous.phase !== 'playing') {
      return;
    }

    const mover = previous.turn;
    if (
      isInCheck(previous, mover) &&
      board.moveCount > lastProcessedMeonggunMove.current
    ) {
      lastProcessedMeonggunMove.current = board.moveCount;
      setMeonggunMessageKey((key) => key + 1);
    }
  }, [board]);

  const canPassTurn = useMemo(() => {
    return board.phase === 'playing' && isUserTurn && inCheckSide === null;
  }, [board.phase, inCheckSide, isUserTurn]);

  const handlePiecePress = useCallback(
    (piece: Piece) => {
      if (board.phase === 'setup') {
        if (!isSwappablePiece(piece)) {
          return;
        }

        if (gameMode === 'vsAi' && piece.side !== userSide) {
          return;
        }

        const wing = getSwapWingForPiece(piece);
        if (!wing) {
          return;
        }

        const nextSwaps = toggleWingSwap(board.swaps, piece.side, wing);
        setBoard((current) => rebuildBoardFromSwaps(current, nextSwaps));
        setSelectedPieceId(piece.id);
        return;
      }

      if (board.phase !== 'playing' || !isUserTurn || piece.side !== board.turn) {
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
    [
      board.phase,
      board.swaps,
      board.turn,
      gameMode,
      isUserTurn,
      legalMoves,
      playMoveSound,
      selectedPiece,
      selectedPieceId,
      userSide,
    ],
  );

  const handleMovePress = useCallback(
    (destination: Position) => {
      if (!selectedPiece || !isUserTurn) {
        return;
      }

      setBoard((current) => applyMove(current, selectedPiece, destination));
      setSelectedPieceId(null);
      playMoveSound();
    },
    [isUserTurn, playMoveSound, selectedPiece],
  );

  const handleStartGame = useCallback(() => {
    setBoard((current) => ({
      ...current,
      phase: 'playing',
      turn: 'cho',
    }));
    setSelectedPieceId(null);
    setIsAiThinking(false);
  }, []);

  const handleNewGame = useCallback(() => {
    setBoard(createInitialBoard());
    setSelectedPieceId(null);
    setIsAiThinking(false);
  }, []);

  const handlePassTurn = useCallback(() => {
    if (!canPassTurn) {
      return;
    }

    setBoard((current) => passTurn(current));
    setSelectedPieceId(null);
  }, [canPassTurn]);

  useEffect(() => {
    if (
      gameMode !== 'vsAi' ||
      board.phase !== 'playing' ||
      board.turn !== aiSide
    ) {
      setIsAiThinking(false);
      return;
    }

    let cancelled = false;
    setIsAiThinking(true);

    const timeoutId = setTimeout(() => {
      if (cancelled) {
        return;
      }

      const currentBoard = boardRef.current;
      const aiMove = pickAiMove(currentBoard, aiSide, aiDifficulty);

      if (aiMove) {
        setBoard((previous) => applyMove(previous, aiMove.piece, aiMove.destination));
        playMoveSound();
      }

      setIsAiThinking(false);
    }, AI_THINK_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [aiDifficulty, aiSide, board.moveCount, board.phase, board.turn, gameMode, playMoveSound]);

  const emphasizeLastMove = useMemo(() => {
    if (!board.lastMove || board.phase !== 'playing') {
      return false;
    }

    if (gameMode === 'vsAi') {
      return board.lastMove.side === aiSide && board.turn === userSide;
    }

    return board.lastMove.side !== board.turn;
  }, [aiSide, board.lastMove, board.phase, board.turn, gameMode, userSide]);

  const phaseLabel = useMemo(() => {
    if (board.phase === 'finished') {
      if (board.finishReason === 'bikjang') {
        return t('game.bikjang');
      }

      if (board.finishReason === 'score') {
        if (!board.winner) {
          return t('game.drawByScore');
        }

        if (gameMode === 'vsAi') {
          return board.winner === userSide
            ? t('game.youWinScore')
            : t('game.aiWinsScore');
        }

        return t('game.sideWinsScore', {
          side: sideLabel(board.winner, true),
        });
      }

      if (board.finishReason === 'stalemate') {
        return t('game.stalemate');
      }

      if (board.finishReason === 'checkmate') {
        if (gameMode === 'vsAi') {
          return board.winner === userSide
            ? t('game.youWinCheckmate')
            : t('game.aiWinsCheckmate');
        }

        return t('game.sideWinsCheckmate', {
          side: sideLabel(board.winner ?? 'cho', true),
        });
      }

      if (gameMode === 'vsAi') {
        return board.winner === userSide ? t('game.youWin') : t('game.aiWins');
      }

      return t('game.sideWins', {
        side: sideLabel(board.winner ?? 'cho', true),
      });
    }

    if (board.phase === 'setup') {
      if (gameMode === 'vsAi') {
        const setupText = t('game.setupVsAi', { side: sideLabel(userSide, true) });
        return userSide === 'han' ? `${setupText} ${t('game.setupVsAiChoFirst')}` : setupText;
      }

      return t('game.setupLocal');
    }

    if (gameMode === 'vsAi' && isAiThinking) {
      return t('game.aiThinking');
    }

    if (emphasizeLastMove && board.lastMove) {
      const mover =
        gameMode === 'vsAi'
          ? t('game.ai')
          : sideLabel(board.lastMove.side, true);

      return t('game.opponentMoved', {
        mover,
        piece: getPieceHanja({
          side: board.lastMove.side,
          type: board.lastMove.pieceType,
        }),
      });
    }

    if (selectedPiece) {
      return t('game.selectDestination', {
        side: sideLabel(selectedPiece.side, true),
        piece: pieceLabel(selectedPiece.type),
      });
    }

    if (gameMode === 'vsAi') {
      return board.turn === userSide
        ? t('game.yourTurn', { side: sideLabel(userSide, true) })
        : t('game.waitingForAi');
    }

    const activePlayer = board.turn === player1Side ? 1 : 2;
    return t('game.playerToMove', {
      player: activePlayer,
      side: sideLabel(board.turn, true),
    });
  }, [
    board.lastMove,
    board.phase,
    board.finishReason,
    board.turn,
    board.winner,
    emphasizeLastMove,
    gameMode,
    isAiThinking,
    pieceLabel,
    player1Side,
    selectedPiece,
    sideLabel,
    t,
    userSide,
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <View style={styles.headerSpacer} />
          <View style={styles.headerTitles}>
            <Text style={styles.title}>{t('common.title')}</Text>
          </View>
          <Pressable
            style={styles.settingsButton}
            onPress={() => router.push('/settings')}
            accessibilityLabel={t('common.settings')}
            accessibilityRole="button"
          >
            <SettingsIcon size={24} color={colors.textMuted} />
          </Pressable>
        </View>
        {board.phase !== 'setup' ? <ScoreDisplay board={board} /> : null}
      </View>

      <View style={styles.boardContainer}>
        <View style={[styles.gameArea, { width: layout.width }]}>
          {board.phase !== 'setup' ? (
            <CapturedPiecesTray
              pieces={board.captured.han}
              align="top-left"
              pieceRadius={layout.pieceRadius * 0.52}
            />
          ) : null}

          <BoardWithPieces
            board={board}
            layout={layout}
            onPiecePress={handlePiecePress}
            onMovePress={handleMovePress}
            selectedPieceId={selectedPieceId}
            legalMoves={isUserTurn ? legalMoves : []}
            lastMove={board.lastMove}
            emphasizeLastMove={emphasizeLastMove}
            inCheckSide={inCheckSide}
          />

          <CheckMessageOverlay
            triggerKey={checkMessageKey}
            message={t('game.checkBanner')}
            boardWidth={layout.width}
            boardHeight={layout.height}
          />

          <MeonggunMessageOverlay
            triggerKey={meonggunMessageKey}
            message={t('game.meonggunBanner')}
            boardWidth={layout.width}
            boardHeight={layout.height}
          />

          {board.phase !== 'setup' ? (
            <CapturedPiecesTray
              pieces={board.captured.cho}
              align="bottom-right"
              pieceRadius={layout.pieceRadius * 0.52}
            />
          ) : null}
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.phaseText}>{phaseLabel}</Text>

        {board.phase === 'setup' ? null : (
          <Text style={styles.turnText}>
            {t('game.moveCount', { count: board.moveCount + 1 })}
            {gameMode === 'vsAi'
              ? ` · ${t('game.youAreSide', { side: sideLabel(userSide, true) })}`
              : ` · ${t('game.playerToMove', {
                  player: board.turn === player1Side ? 1 : 2,
                  side: sideLabel(board.turn, true),
                })}`}
          </Text>
        )}

        {board.phase === 'setup' ? (
          <Pressable style={styles.button} onPress={handleStartGame}>
            <Text style={styles.buttonText}>{t('game.startGame')}</Text>
          </Pressable>
        ) : null}

        {canPassTurn ? (
          <Pressable style={styles.passButton} onPress={handlePassTurn}>
            <Text style={styles.passButtonText}>{t('game.passTurn')}</Text>
          </Pressable>
        ) : null}

        {board.phase === 'finished' ? (
          <Pressable style={styles.button} onPress={handleNewGame}>
            <Text style={styles.buttonText}>{t('game.newGame')}</Text>
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
    paddingTop: 8,
    paddingBottom: 4,
    paddingHorizontal: 12,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerTitles: {
    flex: 1,
    alignItems: 'center',
  },
  headerSpacer: {
    width: 44,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '700',
  },
  settingsButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameArea: {
    alignItems: 'stretch',
    justifyContent: 'center',
    position: 'relative',
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
  passButton: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.textMuted,
    paddingVertical: 12,
    alignItems: 'center',
  },
  passButtonText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  turnText: {
    color: colors.textPrimary,
    fontSize: 15,
    textAlign: 'center',
  },
});
