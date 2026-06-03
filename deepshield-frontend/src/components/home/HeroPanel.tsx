"use client";

import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { useLanguage } from "@/context/LanguageContext";
import type { I18nKey } from "@/lib/i18n";

const ITEMS: { key: I18nKey; href?: string }[] = [
  { key: "heroPanelScan", href: "/scan" },
  { key: "heroPanelTrace", href: "/trace" },
  { key: "heroPanelReport", href: "/report" },
  { key: "heroPanelVault", href: "/vault" },
  { key: "heroPanelAsha", href: "/asha" },
  { key: "heroPanelLaw" },
];

export function HeroPanel() {
  const { t } = useLanguage();

  return (
    <GlassCard className="glass-card-tint-blue h-full p-6 md:p-8">
      <p className="font-display text-lg text-ink">{t("heroPanelTitle")}</p>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{t("heroPanelIntro")}</p>
      <ul className="mt-6 space-y-3">
        {ITEMS.map(({ key, href }) => (
          <li key={key}>
            {href ? (
              <Link
                href={href}
                className="flex items-start gap-2 rounded-xl bg-cream/70 px-3 py-2.5 text-sm text-ink-muted transition hover:bg-sage/35 hover:text-ink"
              >
                <span className="mt-0.5 text-sage">✓</span>
                <span>{t(key)}</span>
              </Link>
            ) : (
              <span className="flex items-start gap-2 rounded-xl bg-blue/25 px-3 py-2.5 text-sm text-ink-muted">
                <span className="mt-0.5 text-sage">§</span>
                <span>{t(key)}</span>
              </span>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-6 grid grid-cols-3 gap-2 border-t border-sage/30 pt-5 text-center">
        <div className="rounded-xl bg-sage/25 px-2 py-3">
          <p className="font-display text-2xl text-ink">11</p>
          <p className="text-[10px] text-ink-subtle">{t("statFeatures")}</p>
        </div>
        <div className="rounded-xl bg-blue/30 px-2 py-3">
          <p className="font-display text-2xl text-ink">3</p>
          <p className="text-[10px] text-ink-subtle">{t("statSignals")}</p>
        </div>
        <div className="rounded-xl bg-peach/25 px-2 py-3">
          <p className="font-display text-2xl text-ink">2</p>
          <p className="text-[10px] text-ink-subtle">{t("statLangs")}</p>
        </div>
      </div>
    </GlassCard>
  );
}
