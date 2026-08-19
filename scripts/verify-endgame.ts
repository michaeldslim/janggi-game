import { passTurn, resignGame } from '../src/game/applyMove';
import { evaluateGameEnd, resolveByScore } from '../src/game/endgame';
import { getLegalMovesForPiece } from '../src/game/moves';
import { getRawMovesForPiece } from '../src/game/rawMoves';
import { DEFAULT_SWAP_STATE } from '../src/types/janggi';
import type { BoardState, Piece } from '../src/types/janggi';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function board(pieces: Piece[], turn: 'cho' | 'han' = 'cho'): BoardState {
  return {
    pieces,
    phase: 'playing',
    turn,
    swaps: DEFAULT_SWAP_STATE,
    moveCount: 10,
    captured: { han: [], cho: [] },
  };
}

const kingOnlyHan = board([
  { id: 'cg', side: 'cho', type: 'general', position: { file: 4, rank: 8 } },
  { id: 'hg', side: 'han', type: 'general', position: { file: 5, rank: 1 } },
  { id: 'csa', side: 'cho', type: 'guard', position: { file: 3, rank: 7 } },
  { id: 'cma', side: 'cho', type: 'horse', position: { file: 2, rank: 6 } },
  { id: 'ccha', side: 'cho', type: 'chariot', position: { file: 0, rank: 9 } },
]);

const kingOnlyEnd = evaluateGameEnd(kingOnlyHan);
assert(kingOnlyEnd.finished === false, 'king-only endgame should keep playing until checkmate, pass, or resign');

const bikjangBoard = board([
  { id: 'cg', side: 'cho', type: 'general', position: { file: 4, rank: 8 } },
  { id: 'hg', side: 'han', type: 'general', position: { file: 4, rank: 1 } },
  { id: 'csa', side: 'cho', type: 'guard', position: { file: 3, rank: 7 } },
  { id: 'cma', side: 'cho', type: 'horse', position: { file: 1, rank: 6 } },
  { id: 'ccha', side: 'cho', type: 'chariot', position: { file: 0, rank: 9 } },
]);

const bikjangEnd = evaluateGameEnd(bikjangBoard);
assert(bikjangEnd.finished === true, 'bikjang should finish');
assert(bikjangEnd.finishReason === 'bikjang', 'bikjang should be a draw');
assert(bikjangEnd.winner === undefined, 'bikjang should not have a winner');

const scoreEnd = resolveByScore(bikjangBoard);
assert(scoreEnd.finishReason === 'score', 'score resolution should remain available for pass endings');
assert(scoreEnd.winner === 'cho', 'material leader should win score resolution');

const afterOnePass = passTurn({ ...kingOnlyHan, consecutivePasses: 0 });
assert(afterOnePass.phase === 'playing', 'first pass should keep the game going');

const afterTwoPasses = passTurn({ ...afterOnePass, turn: 'han', consecutivePasses: 1 });
assert(afterTwoPasses.phase === 'finished', 'double pass should finish');
assert(afterTwoPasses.finishReason === 'score', 'double pass outside bikjang should resolve by score');
assert(afterTwoPasses.winner === 'cho', 'cho should win score when han has only king');

const resigned = resignGame(kingOnlyHan, 'cho');
assert(resigned.phase === 'finished', 'resign should finish the game');
assert(resigned.finishReason === 'resign', 'resign should use resign finish reason');
assert(resigned.winner === 'han', 'resigning side should lose');

const horseOnCenterFile = board([
  { id: 'cg', side: 'cho', type: 'general', position: { file: 4, rank: 8 } },
  { id: 'hg', side: 'han', type: 'general', position: { file: 4, rank: 1 } },
  { id: 'csa', side: 'cho', type: 'guard', position: { file: 4, rank: 9 } },
  { id: 'cma', side: 'cho', type: 'horse', position: { file: 4, rank: 5 } },
  { id: 'ccha', side: 'cho', type: 'chariot', position: { file: 1, rank: 9 } },
]);

const horse = horseOnCenterFile.pieces.find((piece) => piece.id === 'cma')!;
const horseRaw = getRawMovesForPiece(horseOnCenterFile, horse);
const horseLegal = getLegalMovesForPiece(horseOnCenterFile, horse);
assert(horseRaw.length > 0, 'horse on file 4 should still have raw moves');
assert(horseLegal.length === 0, 'horse on file 4 should have no legal moves due to bikjang filter');
assert(evaluateGameEnd(horseOnCenterFile).finished === false, 'blocked horse alone should not end the game');

console.log('verify-endgame: all checks passed');
