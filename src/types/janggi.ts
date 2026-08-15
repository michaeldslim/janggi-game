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

export interface SwapState {
  han: boolean;
  cho: boolean;
}

export interface BoardState {
  pieces: Piece[];
  phase: GamePhase;
  turn: Side;
  swaps: SwapState;
}
