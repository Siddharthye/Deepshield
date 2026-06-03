import { EN_ALL, type I18nKey } from "./keys";
import { HI } from "./hi";
import { HI_MORE } from "./hi-more";
import {
  LANGUAGE_OPTIONS,
  type LanguageCode,
  type ContentLanguage,
  isLanguageCode,
  contentLanguage,
  languageListLabel,
} from "./languages";

export type { LanguageCode, ContentLanguage, I18nKey };
export {
  LANGUAGE_OPTIONS as LANGUAGES,
  isLanguageCode,
  contentLanguage,
  languageListLabel,
};

const STRINGS: Record<ContentLanguage, Record<I18nKey, string>> = {
  en: EN_ALL as Record<I18nKey, string>,
  hi: { ...HI, ...HI_MORE } as Record<I18nKey, string>,
};

export function t(lang: LanguageCode, key: I18nKey): string {
  const content = contentLanguage(lang);
  return STRINGS[content]?.[key] ?? EN_ALL[key] ?? key;
}

/** Locale sent to APIs (full UI translation only for en + hi). */
export function apiLanguage(lang: LanguageCode): ContentLanguage {
  return contentLanguage(lang);
}

export { EN_ALL as EN };
