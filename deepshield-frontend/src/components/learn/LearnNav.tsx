"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { I18nKey } from "@/lib/i18n";

const LINKS: { id: string; key: I18nKey }[] = [
  { id: "examples", key: "learnNavExamples" },
  { id: "guides", key: "learnNavGuide" },
];

export function LearnNav() {
  const { t } = useLanguage();

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav
      aria-label="Learn sections"
      className="sticky top-20 z-20 -mx-1 mb-8 flex gap-2 overflow-x-auto pb-1 md:top-24"
    >
      {LINKS.map((link) => (
        <button
          key={link.id}
          type="button"
          onClick={() => scrollTo(link.id)}
          className="shrink-0 rounded-full border border-secondary/25 bg-cream-tan/80 px-4 py-2 text-sm font-medium text-ink shadow-sm backdrop-blur-sm transition hover:border-accent/40 hover:bg-pink/30"
        >
          {t(link.key)}
        </button>
      ))}
    </nav>
  );
}
