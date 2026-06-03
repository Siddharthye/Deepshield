"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import { type LanguageCode, t as translate, type I18nKey } from "@/lib/i18n";

function readStoredLanguage(): LanguageCode {
  if (typeof window === "undefined") return "en";
  const saved = localStorage.getItem("deepshield_lang");
  return saved === "hi" ? "hi" : "en";
}

type LanguageContextValue = {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  t: (key: I18nKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const saved = readStoredLanguage();
    setLanguageState(saved);
    document.documentElement.lang = saved;
    setReady(true);
  }, []);

  const setLanguage = useCallback((code: LanguageCode) => {
    const next = code === "hi" ? "hi" : "en";
    setLanguageState(next);
    localStorage.setItem("deepshield_lang", next);
    document.documentElement.lang = next;
  }, []);

  const t = useCallback((key: I18nKey) => translate(language, key), [language]);

  if (!ready) {
    return <div className="min-h-screen bg-cream/30" aria-busy="true" />;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
