import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { AiDifficulty, GameMode, Side } from '../types/janggi';

export interface GameSettings {
  gameMode: GameMode;
  userSideVsAi: Side;
  player1SideLocal: Side;
  aiDifficulty: AiDifficulty;
}

export const DEFAULT_GAME_SETTINGS: GameSettings = {
  gameMode: 'vsAi',
  userSideVsAi: 'cho',
  player1SideLocal: 'cho',
  aiDifficulty: 'medium',
};

export const GAME_SETTINGS_STORAGE_KEY = '@janggi/game-settings';

interface GameSettingsContextValue extends GameSettings {
  isReady: boolean;
  setGameMode: (mode: GameMode) => void;
  setUserSideVsAi: (side: Side) => void;
  setPlayer1SideLocal: (side: Side) => void;
  setAiDifficulty: (difficulty: AiDifficulty) => void;
}

const GameSettingsContext = createContext<GameSettingsContextValue | null>(null);

function parseAiDifficulty(value: unknown): AiDifficulty {
  if (value === 'easy' || value === 'medium' || value === 'hard') {
    return value;
  }

  return 'medium';
}

function parseGameMode(value: unknown): GameMode {
  return value === 'local' ? 'local' : 'vsAi';
}

function parseStoredSettings(raw: string | null): GameSettings {
  if (!raw) {
    return DEFAULT_GAME_SETTINGS;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<GameSettings>;
    return {
      gameMode: parseGameMode(parsed.gameMode),
      userSideVsAi: parsed.userSideVsAi === 'han' ? 'han' : 'cho',
      player1SideLocal: parsed.player1SideLocal === 'han' ? 'han' : 'cho',
      aiDifficulty: parseAiDifficulty(parsed.aiDifficulty),
    };
  } catch {
    return DEFAULT_GAME_SETTINGS;
  }
}

export function GameSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_GAME_SETTINGS);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      try {
        const stored = await AsyncStorage.getItem(GAME_SETTINGS_STORAGE_KEY);
        if (mounted) {
          setSettings(parseStoredSettings(stored));
        }
      } finally {
        if (mounted) {
          setIsReady(true);
        }
      }
    }

    void loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  const persistSettings = useCallback((next: GameSettings) => {
    void AsyncStorage.setItem(GAME_SETTINGS_STORAGE_KEY, JSON.stringify(next));
  }, []);

  const setGameMode = useCallback(
    (mode: GameMode) => {
      setSettings((current) => {
        const next = { ...current, gameMode: mode };
        persistSettings(next);
        return next;
      });
    },
    [persistSettings],
  );

  const setUserSideVsAi = useCallback(
    (side: Side) => {
      setSettings((current) => {
        const next = { ...current, userSideVsAi: side };
        persistSettings(next);
        return next;
      });
    },
    [persistSettings],
  );

  const setPlayer1SideLocal = useCallback(
    (side: Side) => {
      setSettings((current) => {
        const next = { ...current, player1SideLocal: side };
        persistSettings(next);
        return next;
      });
    },
    [persistSettings],
  );

  const setAiDifficulty = useCallback(
    (difficulty: AiDifficulty) => {
      setSettings((current) => {
        const next = { ...current, aiDifficulty: difficulty };
        persistSettings(next);
        return next;
      });
    },
    [persistSettings],
  );

  const value = useMemo(
    () => ({
      ...settings,
      isReady,
      setGameMode,
      setUserSideVsAi,
      setPlayer1SideLocal,
      setAiDifficulty,
    }),
    [isReady, setAiDifficulty, setGameMode, setPlayer1SideLocal, setUserSideVsAi, settings],
  );

  return (
    <GameSettingsContext.Provider value={value}>{children}</GameSettingsContext.Provider>
  );
}

export function useGameSettings() {
  const context = useContext(GameSettingsContext);

  if (!context) {
    throw new Error('useGameSettings must be used within GameSettingsProvider');
  }

  return context;
}
