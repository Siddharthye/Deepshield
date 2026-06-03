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
    function onDoc(e: PointerEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onDoc);
    return () => document.removeEventListener("pointerdown", onDoc);
  }, []);

  function pick(code: LanguageCode) {
    setLanguage(code);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative z-[80]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-secondary/25 bg-primary text-sm text-ink shadow-sm backdrop-blur hover:bg-secondary/10"
        aria-label={`Language: ${current.label}`}
        aria-expanded={open}
        aria-haspopup="listbox"
        title={current.label}
      >
        <span aria-hidden>🌐</span>
      </button>
      {open && (
        <ul
          role="listbox"
          className="glass-card absolute right-0 top-full z-[80] mt-2 w-40 py-1 shadow-lg"
          onPointerDown={(e) => e.stopPropagation()}
        >
          {LANGUAGES.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                role="option"
                aria-selected={language === l.code}
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  pick(l.code);
                }}
                className={`w-full px-3 py-2 text-left text-sm transition hover:bg-peach/50 ${
                  language === l.code ? "bg-pink/45 font-medium text-ink" : "text-ink-muted"
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
