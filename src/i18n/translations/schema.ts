export interface TranslationSchema {
  common: {
    title: string;
    settings: string;
    back: string;
    player: string;
    ai: string;
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
    avatars: string;
    playerAvatar: string;
    playerAvatarDescription: string;
    aiAvatar: string;
    aiAvatarDescription: string;
    career: string;
  };
  language: {
    en: string;
    ko: string;
  };
  career: {
    rank: {
      intern: string;
      staff: string;
      assistant: string;
      manager: string;
      deputy: string;
      director: string;
      executive: string;
      ceo: string;
    };
    promoted: {
      title: string;
      subtitle: string;
    };
    ceoReached: {
      title: string;
      subtitle: string;
    };
    progressNext: string;
    lossKeepsProgress: string;
    noProgressDifficulty: string;
    homeBadge: string;
    maxRank: string;
    modeLabel: string;
    modeDesc: string;
    rulesSnippet: string;
    screen: {
      title: string;
      currentRank: string;
      highestRank: string;
      ladderTitle: string;
      disabledTitle: string;
      disabledBody: string;
      enableInSettings: string;
    };
    ladder: {
      achieved: string;
      current: string;
      locked: string;
      startingRank: string;
      requirement: string;
      requirementDifficulty: string;
      progressToNext: string;
    };
    difficultySuggest: {
      body: string;
      action: string;
    };
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
