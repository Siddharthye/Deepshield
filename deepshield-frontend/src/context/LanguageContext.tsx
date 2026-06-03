"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import {
  type LanguageCode,
  t as translate,
  type I18nKey,
  isLanguageCode,
  apiLanguage,
} from "@/lib/i18n";

function readStoredLanguage(): LanguageCode {
  if (typeof window === "undefined") return "en";
  const saved = localStorage.getItem("deepshield_lang");
  return saved && isLanguageCode(saved) ? saved : "en";
}

type LanguageContextValue = {
  language: LanguageCode;
  apiLanguage: ReturnType<typeof apiLanguage>;
  setLanguage: (code: LanguageCode) => void;
  t: (key: I18nKey) => string;
  ready: boolean;
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
    setLanguageState(code);
    localStorage.setItem("deepshield_lang", code);
    document.documentElement.lang = code;
  }, []);

  const t = useCallback((key: I18nKey) => translate(language, key), [language]);
  const apiLang = apiLanguage(language);

  return (
    <LanguageContext.Provider
      value={{ language, apiLanguage: apiLang, setLanguage, t, ready }}
    >
      {!ready ? (
        <div className="min-h-screen bg-primary" aria-busy="true" />
      ) : (
        children
      )}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
