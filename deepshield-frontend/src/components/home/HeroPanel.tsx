"use client";

import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { useLanguage } from "@/context/LanguageContext";
import type { I18nKey } from "@/lib/i18n";

const ITEMS: { key: I18nKey; href: string }[] = [
  { key: "heroPanelScan", href: "/scan" },
  { key: "heroPanelTrace", href: "/trace" },
  { key: "heroPanelReport", href: "/report" },
  { key: "heroPanelVault", href: "/vault" },
  { key: "heroPanelAsha", href: "/asha" },
];

export function HeroPanel() {
  const { t } = useLanguage();

  return (
    <GlassCard
      className="glass-card-tint-blue flex w-full flex-col p-5 sm:p-6 lg:p-7"
      tilt={false}
    >
      <header className="border-b border-secondary/15 pb-4">
        <p className="font-display text-lg leading-snug text-ink md:text-xl">
          {t("heroPanelTitle")}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{t("heroPanelIntro")}</p>
      </header>
      <ul className="mt-4 flex flex-col gap-2 sm:mt-5 sm:gap-2.5">
        {ITEMS.map(({ key, href }) => (
          <li key={key}>
            <Link
              href={href}
              className="flex min-h-[3rem] items-center gap-3 rounded-xl bg-parchment/90 px-3.5 py-2.5 text-sm leading-snug text-ink-muted transition hover:bg-cream-deep/50 hover:text-ink"
            >
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage/25 text-xs font-bold text-sage"
                aria-hidden
              >
                ✓
              </span>
              <span className="min-w-0 flex-1 text-left">{t(key)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
