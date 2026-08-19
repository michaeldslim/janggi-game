import { getOppositeSide } from './boardUtils';
import type { BoardState, GameMode, Side } from '../types/janggi';

export type GameEndVariant = 'win' | 'loss' | 'draw' | 'neutral';

type TranslateFn = (key: string, params?: Record<string, string | number>) => string;
type SideLabelFn = (side: Side, full?: boolean) => string;

export function isGameDraw(board: BoardState): boolean {
  if (board.finishReason === 'stalemate' || board.finishReason === 'bikjang') {
    return true;
  }

  return board.finishReason === 'score' && board.winner === undefined;
}

export function getGameEndVariant(
  board: BoardState,
  gameMode: GameMode,
  userSide: Side,
): GameEndVariant {
  if (isGameDraw(board)) {
    return 'draw';
  }

  if (!board.winner) {
    return 'draw';
  }

  if (gameMode === 'vsAi') {
    return board.winner === userSide ? 'win' : 'loss';
  }

  return 'neutral';
}

export function getGameEndMessage(
  board: BoardState,
  gameMode: GameMode,
  userSide: Side,
  t: TranslateFn,
  sideLabel: SideLabelFn,
): string {
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

  if (board.finishReason === 'resign') {
    if (gameMode === 'vsAi') {
      return t('game.youResigned');
    }

    const resigningSide = board.winner ? getOppositeSide(board.winner) : board.turn;
    return t('game.sideResigned', {
      side: sideLabel(resigningSide, true),
    });
  }

  if (board.finishReason === 'capture') {
    if (gameMode === 'vsAi') {
      return board.winner === userSide
        ? t('game.youWinCapture')
        : t('game.aiWinsCapture');
    }

    return t('game.sideWinsCapture', {
      side: sideLabel(board.winner ?? 'cho', true),
    });
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
