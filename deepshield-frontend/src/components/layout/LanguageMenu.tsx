"use client";

import { useEffect, useRef, useState } from "react";
import { LANGUAGES, type LanguageCode } from "@/lib/i18n";
import { useLanguage } from "@/context/LanguageContext";

export function LanguageMenu() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-sage/50 bg-cream/80 text-sm text-ink shadow-sm backdrop-blur hover:bg-blue/40"
        aria-label={`Language: ${current.label}`}
        aria-expanded={open}
        title={current.label}
      >
        <span aria-hidden>🌐</span>
      </button>
      {open && (
        <ul
          role="listbox"
          className="glass-card absolute right-0 top-full z-[60] mt-2 max-h-64 w-40 overflow-y-auto py-1 shadow-lg"
        >
          {LANGUAGES.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                role="option"
                aria-selected={language === l.code}
                onClick={() => {
                  setLanguage(l.code as LanguageCode);
                  setOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-sm transition hover:bg-peach/40 ${
                  language === l.code ? "bg-pink/35 font-medium text-ink" : "text-ink-muted"
                }`}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
