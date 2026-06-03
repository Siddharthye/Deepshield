"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const HIGHLIGHTS = [
  {
    titleKey: "heroHighlight1Title" as const,
    descKey: "heroHighlight1Desc" as const,
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3" strokeLinecap="round" />
        <circle cx="12" cy="12" r="4" />
        <path d="M7 7l2 2M15 15l2 2M17 7l-2 2M9 15l-2 2" strokeLinecap="round" />
      </svg>
    ),
    tint: "from-secondary/15 to-sage/20",
  },
  {
    titleKey: "heroHighlight2Title" as const,
    descKey: "heroHighlight2Desc" as const,
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V8a4 4 0 018 0v3" strokeLinecap="round" />
      </svg>
    ),
    tint: "from-sage/20 to-peach/25",
  },
];

export function HeroHighlights() {
  const { t } = useLanguage();

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {HIGHLIGHTS.map((item, i) => (
        <motion.div
          key={item.titleKey}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.08 }}
          className={`rounded-2xl bg-gradient-to-br ${item.tint} p-4 ring-1 ring-secondary/12 backdrop-blur-sm`}
        >
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cream-deep/90 text-accent shadow-sm ring-1 ring-secondary/10">
              {item.icon}
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="text-sm font-semibold text-ink">{t(item.titleKey)}</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-muted">{t(item.descKey)}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
