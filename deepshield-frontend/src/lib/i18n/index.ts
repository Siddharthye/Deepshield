import { EN_ALL, type I18nKey } from "./keys";
import { HI } from "./hi";
import { HI_MORE } from "./hi-more";

export type LanguageCode = "en" | "hi";
export type { I18nKey };

export const LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
];

const STRINGS: Record<LanguageCode, Record<I18nKey, string>> = {
  en: EN_ALL as Record<I18nKey, string>,
  hi: { ...HI, ...HI_MORE } as Record<I18nKey, string>,
};

export function t(lang: LanguageCode, key: I18nKey): string {
  return STRINGS[lang]?.[key] ?? EN_ALL[key] ?? key;
}

export { EN_ALL as EN };
