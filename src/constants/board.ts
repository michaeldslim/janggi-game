export const FILE_COUNT = 9;
export const RANK_COUNT = 10;
export const FILE_GAPS = FILE_COUNT - 1;
export const RANK_GAPS = RANK_COUNT - 1;

export const HAN_PALACE = {
  minFile: 3,
  maxFile: 5,
  minRank: 0,
  maxRank: 2,
} as const;

export const CHO_PALACE = {
  minFile: 3,
  maxFile: 5,
  minRank: 7,
  maxRank: 9,
} as const;

export const HAN_BACK_RANK = 0;
export const HAN_CANNON_RANK = 1;
export const HAN_SOLDIER_RANK = 2;

export const CHO_SOLDIER_RANK = 7;
export const CHO_CANNON_RANK = 8;
export const CHO_BACK_RANK = 9;

export const SWAP_FILE_PAIRS: [number, number][] = [
  [1, 2],
  [6, 7],
];
