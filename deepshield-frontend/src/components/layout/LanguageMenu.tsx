"use client";

import { useEffect, useRef, useState } from "react";
import { LANGUAGES, type LanguageCode } from "@/lib/i18n";
import { useLanguage } from "@/context/LanguageContext";

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export function LanguageMenu({
  scrolled = false,
  onDark = false,
}: {
  scrolled?: boolean;
  /** Burgundy/dark surfaces (footer, scrolled nav) */
  onDark?: boolean;
}) {
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

  const triggerClass =
    scrolled || onDark
      ? "border-cream-deep/35 bg-cream-deep/12 text-cream-deep hover:bg-cream-deep/22"
      : "border-secondary/35 bg-cream-tan/90 text-secondary hover:bg-secondary/10";

  return (
    <div ref={ref} className="relative z-[80] shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex h-9 w-9 items-center justify-center rounded-full border shadow-sm backdrop-blur transition-colors ${triggerClass}`}
        aria-label={`Language: ${current.label}`}
        aria-expanded={open}
        aria-haspopup="listbox"
        title={current.label}
      >
        <GlobeIcon className="h-[18px] w-[18px]" />
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
                className={`ui-nowrap w-full px-3 py-2 text-left text-sm transition hover:bg-peach/50 ${
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
