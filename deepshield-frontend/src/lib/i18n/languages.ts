/** All languages shown in the UI (PRD: 8 Indian languages). */
export const LANGUAGE_OPTIONS = [
  { code: "en", label: "English", native: "English", content: "en" as const },
  { code: "hi", label: "हिंदी", native: "Hindi", content: "hi" as const },
  { code: "ta", label: "தமிழ்", native: "Tamil", content: "en" as const },
  { code: "te", label: "తెలుగు", native: "Telugu", content: "en" as const },
  { code: "bn", label: "বাংলা", native: "Bengali", content: "en" as const },
  { code: "mr", label: "मराठी", native: "Marathi", content: "en" as const },
  { code: "kn", label: "ಕನ್ನಡ", native: "Kannada", content: "en" as const },
  { code: "ml", label: "മലയാളം", native: "Malayalam", content: "en" as const },
] as const;

export type LanguageCode = (typeof LANGUAGE_OPTIONS)[number]["code"];

export type ContentLanguage = "en" | "hi";

export function isLanguageCode(value: string): value is LanguageCode {
  return LANGUAGE_OPTIONS.some((l) => l.code === value);
}

export function contentLanguage(code: LanguageCode): ContentLanguage {
  const row = LANGUAGE_OPTIONS.find((l) => l.code === code);
  return row?.content === "hi" ? "hi" : "en";
}

export function languageListLabel(): string {
  return "English, Hindi, Tamil, Telugu, Bengali, Marathi, Kannada, Malayalam";
}
