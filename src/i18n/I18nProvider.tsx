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
import type { PieceType, Side } from '../types/janggi';
import {
  getDeviceLocale,
  getPieceLabel,
  getSideLabel,
  interpolate,
  LOCALE_STORAGE_KEY,
  type Locale,
  translations,
} from './index';
import type { TranslationSchema } from './translations/schema';

interface I18nContextValue {
  locale: Locale;
  messages: TranslationSchema;
  isReady: boolean;
  setLocale: (locale: Locale) => void;
  t: (key: string, values?: Record<string, string | number>) => string;
  sideLabel: (side: Side, full?: boolean) => string;
  pieceLabel: (type: PieceType) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function resolveMessage(messages: TranslationSchema, key: string): string | undefined {
  const parts = key.split('.');
  let current: unknown = messages;

  for (const part of parts) {
    if (typeof current !== 'object' || current === null || !(part in current)) {
      return undefined;
    }

    current = (current as Record<string, unknown>)[part];
  }

  return typeof current === 'string' ? current : undefined;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getDeviceLocale());
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadLocale() {
      try {
        const storedLocale = await AsyncStorage.getItem(LOCALE_STORAGE_KEY);
        if (mounted && (storedLocale === 'en' || storedLocale === 'ko')) {
          setLocaleState(storedLocale);
        }
      } finally {
        if (mounted) {
          setIsReady(true);
        }
      }
    }

    void loadLocale();

    return () => {
      mounted = false;
    };
  }, []);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
    void AsyncStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
  }, []);

  const messages = translations[locale];

  const t = useCallback(
    (key: string, values?: Record<string, string | number>) => {
      const message = resolveMessage(messages, key) ?? key;
      return values ? interpolate(message, values) : message;
    },
    [messages],
  );

  const sideLabel = useCallback(
    (side: Side, full = false) => getSideLabel(messages, side, full),
    [messages],
  );

  const pieceLabel = useCallback(
    (type: PieceType) => getPieceLabel(messages, type),
    [messages],
  );

  const value = useMemo(
    () => ({
      locale,
      messages,
      isReady,
      setLocale,
      t,
      sideLabel,
      pieceLabel,
    }),
    [isReady, locale, messages, pieceLabel, setLocale, sideLabel, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }

  return context;
}
