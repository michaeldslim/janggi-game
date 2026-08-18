import { applyMatchResult, DEFAULT_CAREER_STATE } from '../src/career/careerProgress';
import {
  getDifficultySuggestion,
  isCareerRankDeputyOrHigher,
} from '../src/career/careerDifficultySuggestion';
import type { CareerState } from '../src/types/career';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function win(
  state: CareerState,
  aiDifficulty: 'easy' | 'medium' | 'hard' = 'easy',
) {
  return applyMatchResult(state, { won: true, aiDifficulty }).nextState;
}

function lose(state: CareerState) {
  return applyMatchResult(state, { won: false, aiDifficulty: 'easy' });
}

let state = DEFAULT_CAREER_STATE;

for (let index = 0; index < 2; index += 1) {
  const result = applyMatchResult(state, { won: true, aiDifficulty: 'easy' });
  assert(result.promoted === null, '2 wins should not promote from intern');
  assert(result.nextState.promotionWins === index + 1, 'win count should increment');
  state = result.nextState;
}

const thirdWin = applyMatchResult(state, { won: true, aiDifficulty: 'easy' });
assert(thirdWin.promoted === 'staff', '3 wins should promote intern to staff');
assert(thirdWin.nextState.rank === 'staff', 'rank should be staff');
assert(thirdWin.nextState.promotionWins === 0, 'wins reset on promotion');
state = thirdWin.nextState;

const staffWin = applyMatchResult(state, { won: true, aiDifficulty: 'easy' });
assert(staffWin.nextState.promotionWins === 1, 'staff should start 1/5 wins');
state = staffWin.nextState;

const afterLoss = lose(state);
assert(afterLoss.lost, 'loss should set lost flag');
assert(afterLoss.nextState.promotionWins === 1, 'win count should stay after loss');
assert(afterLoss.nextState.rank === 'staff', 'rank should stay staff after loss');
state = afterLoss.nextState;

const draw = applyMatchResult(state, {
  won: false,
  aiDifficulty: 'easy',
  isDraw: true,
});
assert(draw.unchanged, 'draw should leave wins unchanged');
assert(draw.nextState.promotionWins === 1, 'draw should not change win count');

state = { rank: 'deputy', promotionWins: 0, highestRankAchieved: 'deputy' };
const lowDifficultyWin = applyMatchResult(state, { won: true, aiDifficulty: 'easy' });
assert(lowDifficultyWin.noProgressDifficulty, 'deputy win on easy should not count');
assert(lowDifficultyWin.nextState.promotionWins === 0, 'wins should stay 0 on difficulty gate');

let deputyState = state;
for (let index = 0; index < 4; index += 1) {
  deputyState = win(deputyState, 'medium');
}
assert(deputyState.rank === 'deputy', '4 medium wins should not promote yet');
assert(deputyState.promotionWins === 4, 'deputy wins should be 4/5');

deputyState = win(deputyState, 'medium');
assert(deputyState.rank === 'director', '5 medium wins should promote deputy to director');
assert(deputyState.promotionWins === 0, 'promotion should reset win count');

let staffState = DEFAULT_CAREER_STATE;
for (let index = 0; index < 3; index += 1) {
  staffState = win(staffState, 'easy');
}
assert(staffState.rank === 'staff', 'intern should reach staff after 3 wins');

for (let index = 0; index < 5; index += 1) {
  staffState = win(staffState, 'easy');
}
assert(staffState.rank === 'assistant', 'staff should reach assistant after 5 more wins');

let ceoState = { rank: 'ceo' as const, promotionWins: 0, highestRankAchieved: 'ceo' as const };
const ceoWin = applyMatchResult(ceoState, { won: true, aiDifficulty: 'hard' });
assert(ceoWin.promoted === null, 'ceo should not promote further');
assert(ceoWin.nextState.rank === 'ceo', 'ceo rank should remain');

assert(!isCareerRankDeputyOrHigher('manager'), 'manager should be below deputy gate');
assert(isCareerRankDeputyOrHigher('deputy'), 'deputy should trigger deputy+ gate');

const deputySuggestion = getDifficultySuggestion('deputy', 'easy');
assert(deputySuggestion?.recommended === 'medium', 'deputy should suggest medium');

const directorSuggestion = getDifficultySuggestion('director', 'medium');
assert(directorSuggestion?.recommended === 'hard', 'director should suggest hard');

const noSuggestion = getDifficultySuggestion('deputy', 'medium');
assert(noSuggestion === null, 'medium should not suggest bump at deputy');

console.log('All career progress checks passed.');
