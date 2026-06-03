import { EN, type I18nKey } from "./en";
import { HI } from "./hi";

export type LanguageCode = "en" | "hi";

export type { I18nKey };

export const LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
];

const STRINGS: Record<LanguageCode, Record<I18nKey, string>> = {
  en: EN,
  hi: HI,
};

export function t(lang: LanguageCode, key: I18nKey): string {
  return STRINGS[lang]?.[key] ?? EN[key] ?? key;
}

export { EN };
