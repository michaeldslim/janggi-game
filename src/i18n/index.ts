import * as Localization from 'expo-localization';
import type { PieceType, Side } from '../types/janggi';
import { en } from './translations/en';
import { ko } from './translations/ko';
import type { TranslationSchema } from './translations/schema';

export type Locale = 'en' | 'ko';

export const LOCALE_STORAGE_KEY = '@janggi/locale';

export const translations: Record<Locale, TranslationSchema> = {
  en,
  ko,
};

export const SUPPORTED_LOCALES: Locale[] = ['en', 'ko'];

export function getDeviceLocale(): Locale {
  const languageCode = Localization.getLocales()[0]?.languageCode;
  return languageCode === 'ko' ? 'ko' : 'en';
}

export function interpolate(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = values[key];
    return value === undefined ? '' : String(value);
  });
}

export function getSideLabel(
  messages: TranslationSchema,
  side: Side,
  full = false,
): string {
  if (full) {
    return side === 'cho' ? messages.side.choFull : messages.side.hanFull;
  }

  return side === 'cho' ? messages.side.cho : messages.side.han;
}

export function getPieceLabel(messages: TranslationSchema, type: PieceType): string {
  return messages.piece[type];
}
