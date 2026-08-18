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
import {
  DEFAULT_AI_AVATAR_ID,
  DEFAULT_PLAYER_AVATAR_ID,
  resolveAvatarId,
  type AvatarId,
} from '../constants/avatars';
import type { AiDifficulty, GameMode, Side } from '../types/janggi';

export interface GameSettings {
  gameMode: GameMode;
  userSideVsAi: Side;
  player1SideLocal: Side;
  aiDifficulty: AiDifficulty;
  playerAvatarId: AvatarId;
  aiAvatarId: AvatarId;
  careerModeEnabled: boolean;
}

export const DEFAULT_GAME_SETTINGS: GameSettings = {
  gameMode: 'vsAi',
  userSideVsAi: 'cho',
  player1SideLocal: 'cho',
  aiDifficulty: 'medium',
  playerAvatarId: DEFAULT_PLAYER_AVATAR_ID,
  aiAvatarId: DEFAULT_AI_AVATAR_ID,
  careerModeEnabled: true,
};

export const GAME_SETTINGS_STORAGE_KEY = '@janggi/game-settings';

interface GameSettingsContextValue extends GameSettings {
  isReady: boolean;
  setGameMode: (mode: GameMode) => void;
  setUserSideVsAi: (side: Side) => void;
  setPlayer1SideLocal: (side: Side) => void;
  setAiDifficulty: (difficulty: AiDifficulty) => void;
  setPlayerAvatarId: (avatarId: AvatarId) => void;
  setAiAvatarId: (avatarId: AvatarId) => void;
  setCareerModeEnabled: (enabled: boolean) => void;
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
      playerAvatarId: resolveAvatarId(parsed.playerAvatarId, DEFAULT_PLAYER_AVATAR_ID),
      aiAvatarId: resolveAvatarId(parsed.aiAvatarId, DEFAULT_AI_AVATAR_ID),
      careerModeEnabled:
        typeof parsed.careerModeEnabled === 'boolean' ? parsed.careerModeEnabled : true,
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

  const updateSettings = useCallback(
    (patch: Partial<GameSettings>) => {
      setSettings((current) => {
        const next = { ...current, ...patch };
        persistSettings(next);
        return next;
      });
    },
    [persistSettings],
  );

  const setGameMode = useCallback(
    (mode: GameMode) => updateSettings({ gameMode: mode }),
    [updateSettings],
  );

  const setUserSideVsAi = useCallback(
    (side: Side) => updateSettings({ userSideVsAi: side }),
    [updateSettings],
  );

  const setPlayer1SideLocal = useCallback(
    (side: Side) => updateSettings({ player1SideLocal: side }),
    [updateSettings],
  );

  const setAiDifficulty = useCallback(
    (difficulty: AiDifficulty) => updateSettings({ aiDifficulty: difficulty }),
    [updateSettings],
  );

  const setPlayerAvatarId = useCallback(
    (avatarId: AvatarId) => updateSettings({ playerAvatarId: avatarId }),
    [updateSettings],
  );

  const setAiAvatarId = useCallback(
    (avatarId: AvatarId) => updateSettings({ aiAvatarId: avatarId }),
    [updateSettings],
  );

  const setCareerModeEnabled = useCallback(
    (enabled: boolean) => updateSettings({ careerModeEnabled: enabled }),
    [updateSettings],
  );

  const value = useMemo(
    () => ({
      ...settings,
      isReady,
      setGameMode,
      setUserSideVsAi,
      setPlayer1SideLocal,
      setAiDifficulty,
      setPlayerAvatarId,
      setAiAvatarId,
      setCareerModeEnabled,
    }),
    [
      isReady,
      setAiAvatarId,
      setAiDifficulty,
      setCareerModeEnabled,
      setGameMode,
      setPlayer1SideLocal,
      setPlayerAvatarId,
      setUserSideVsAi,
      settings,
    ],
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
