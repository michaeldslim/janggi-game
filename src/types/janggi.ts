export type Side = 'cho' | 'han';

export type PieceType =
  | 'general'
  | 'guard'
  | 'chariot'
  | 'cannon'
  | 'horse'
  | 'elephant'
  | 'soldier';

export type GamePhase = 'setup' | 'playing' | 'finished';

export type FinishReason = 'capture' | 'checkmate' | 'stalemate' | 'bikjang' | 'score';

export type GameMode = 'local' | 'vsAi';

export type AiDifficulty = 'easy' | 'medium' | 'hard';

export type AiSpeed = 'slow' | 'medium' | 'fast';

export interface Position {
  file: number;
  rank: number;
}

export interface Piece {
  id: string;
  side: Side;
  type: PieceType;
  position: Position;
}

export type SwapWing = 'left' | 'right';

export interface SideSwapState {
  left: boolean;
  right: boolean;
}

export interface SwapState {
  han: SideSwapState;
  cho: SideSwapState;
}

export const DEFAULT_SIDE_SWAP_STATE: SideSwapState = {
  left: false,
  right: false,
};

export const DEFAULT_SWAP_STATE: SwapState = {
  han: { ...DEFAULT_SIDE_SWAP_STATE },
  cho: { ...DEFAULT_SIDE_SWAP_STATE },
};

export interface CapturedPiece {
  id: string;
  side: Side;
  type: PieceType;
}

export interface CapturedPieces {
  /** Pieces captured by Han (Cho pieces). */
  han: CapturedPiece[];
  /** Pieces captured by Cho (Han pieces). */
  cho: CapturedPiece[];
}

export interface LastMove {
  pieceId: string;
  pieceType: PieceType;
  side: Side;
  from: Position;
  to: Position;
}

export interface BoardState {
  pieces: Piece[];
  phase: GamePhase;
  turn: Side;
  swaps: SwapState;
  moveCount: number;
  captured: CapturedPieces;
  lastMove?: LastMove;
  winner?: Side;
  finishReason?: FinishReason;
  consecutivePasses?: number;
}
