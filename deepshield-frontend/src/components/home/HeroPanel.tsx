"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { useLanguage } from "@/context/LanguageContext";
import type { I18nKey } from "@/lib/i18n";

type PanelItem = {
  key: I18nKey;
  href: string;
  icon: ReactNode;
};

const ITEMS: PanelItem[] = [
  {
    key: "heroPanelScan",
    href: "/scan",
    icon: (
      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="9" cy="9" r="5.5" />
        <path d="M13.5 13.5L17 17" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "heroPanelTrace",
    href: "/trace",
    icon: (
      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M3 10h10M10 6l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 4v12" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "heroPanelReport",
    href: "/report",
    icon: (
      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M6 3h8l2 3v11H4V3h2z" strokeLinejoin="round" />
        <path d="M8 9h4M8 12h4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "heroPanelVault",
    href: "/vault",
    icon: (
      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="4" y="9" width="12" height="8" rx="1.5" />
        <path d="M7 9V6.5a3 3 0 016 0V9" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "heroPanelAsha",
    href: "/asha",
    icon: (
      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M4 6c2-2 10-2 12 0 1.5 6-1.5 8-4 1 2-3 4-6 4s-7-2-8-4c1.5-2.5 6.5-8 8-4z" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export function HeroPanel() {
  const { t } = useLanguage();

  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute -inset-3 rounded-[28px] bg-gradient-to-br from-secondary/20 via-transparent to-sage/15 blur-xl"
        aria-hidden
      />
      <GlassCard
        className="glass-card-tint-blue relative flex w-full flex-col overflow-hidden p-0 shadow-[var(--shadow-soft)] ring-1 ring-secondary/15"
        tilt={false}
      >
        <header className="border-b border-secondary/12 bg-gradient-to-r from-cream-deep/40 to-transparent px-5 py-4 sm:px-6 sm:py-5">
          <p className="font-display text-lg leading-snug text-ink md:text-xl">
            {t("heroPanelTitle")}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">{t("heroPanelIntro")}</p>
        </header>

        <ul className="flex flex-col gap-1.5 p-3 sm:gap-2 sm:p-4">
          {ITEMS.map(({ key, href, icon }, i) => (
            <motion.li
              key={key}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.18 + i * 0.06 }}
            >
              <Link
                href={href}
                className="group flex items-center gap-3 rounded-xl bg-parchment/85 px-3 py-3 transition-all hover:bg-cream-deep/70 hover:shadow-sm hover:ring-1 hover:ring-secondary/15 sm:px-3.5"
              >
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-[10px] font-bold tabular-nums text-accent group-hover:bg-secondary/15"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sage/20 text-accent">
                  {icon}
                </span>
                <span className="min-w-0 flex-1 text-left text-sm leading-snug text-ink-muted group-hover:text-ink">
                  {t(key)}
                </span>
                <span
                  className="shrink-0 text-accent opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                  aria-hidden
                >
                  →
                </span>
              </Link>
            </motion.li>
          ))}
        </ul>

        <footer className="border-t border-secondary/12 bg-cream-tan/40 px-5 py-3 sm:px-6">
          <p className="text-center text-[11px] font-medium leading-relaxed text-ink-subtle">
            {t("heroPanelLaw")}
          </p>
        </footer>
      </GlassCard>
    </div>
  );
}
