export interface TranslationSchema {
  common: {
    title: string;
    settings: string;
    back: string;
  };
  settings: {
    title: string;
    language: string;
    languageDescription: string;
    gameMode: string;
    gameModeDescription: string;
    aiSide: string;
    aiSideDescription: string;
    player1Side: string;
    player1SideDescription: string;
    aiDifficulty: string;
    aiDifficultyDescription: string;
    difficultyEasy: string;
    difficultyMedium: string;
    difficultyHard: string;
  };
  language: {
    en: string;
    ko: string;
  };
  game: {
    vsAi: string;
    twoPlayers: string;
    startGame: string;
    newGame: string;
    youWin: string;
    aiWins: string;
    sideWins: string;
    setupVsAi: string;
    setupVsAiChoFirst: string;
    setupLocal: string;
    aiThinking: string;
    opponentMoved: string;
    selectDestination: string;
    yourTurn: string;
    waitingForAi: string;
    sideToMove: string;
    playerToMove: string;
    moveCount: string;
    youAreSide: string;
    ai: string;
    check: string;
    checkBanner: string;
    meonggunBanner: string;
    passTurn: string;
    checkmate: string;
    stalemate: string;
    youWinCheckmate: string;
    aiWinsCheckmate: string;
    sideWinsCheckmate: string;
    bikjang: string;
    hanKomi: string;
    deom: string;
    youWinScore: string;
    aiWinsScore: string;
    sideWinsScore: string;
    drawByScore: string;
  };
  side: {
    cho: string;
    han: string;
    choFull: string;
    hanFull: string;
  };
  piece: {
    general: string;
    guard: string;
    chariot: string;
    cannon: string;
    horse: string;
    elephant: string;
    soldier: string;
  };
}
