"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { LANGUAGES, STRINGS_EN, type LanguageCode, t } from "@/lib/i18n";
import { translateStrings } from "@/lib/api";

type LanguageContextValue = {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const CACHE_PREFIX = "deepshield_i18n_";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");
  const [overrides, setOverrides] = useState<Record<string, string>>({});

  useEffect(() => {
    const saved = localStorage.getItem("deepshield_lang") as LanguageCode | null;
    if (saved && LANGUAGES.some((l) => l.code === saved)) {
      setLanguageState(saved);
      const cached = localStorage.getItem(CACHE_PREFIX + saved);
      if (cached) {
        try {
          setOverrides(JSON.parse(cached) as Record<string, string>);
        } catch {
          /* ignore */
        }
      }
    }
  }, []);

  const setLanguage = useCallback(async (code: LanguageCode) => {
    setLanguageState(code);
    localStorage.setItem("deepshield_lang", code);
    if (code === "en") {
      setOverrides({});
      return;
    }
    const cached = localStorage.getItem(CACHE_PREFIX + code);
    if (cached) {
      try {
        setOverrides(JSON.parse(cached) as Record<string, string>);
        return;
      } catch {
        /* fetch fresh */
      }
    }
    try {
      const translated = await translateStrings(code, STRINGS_EN);
      setOverrides(translated);
      localStorage.setItem(CACHE_PREFIX + code, JSON.stringify(translated));
    } catch {
      setOverrides({});
    }
  }, []);

  const translate = useCallback(
    (key: string) => overrides[key] ?? t(language, key),
    [language, overrides],
  );

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
