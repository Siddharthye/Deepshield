"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { LANGUAGES, type LanguageCode, t } from "@/lib/i18n";

type LanguageContextValue = {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");

  useEffect(() => {
    const saved = localStorage.getItem("deepshield_lang") as LanguageCode | null;
    if (saved && LANGUAGES.some((l) => l.code === saved)) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = useCallback((code: LanguageCode) => {
    setLanguageState(code);
    localStorage.setItem("deepshield_lang", code);
  }, []);

  const translate = useCallback((key: string) => t(language, key), [language]);

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t: translate }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
