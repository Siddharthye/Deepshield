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
    <GlassCard className="glass-card-tint-blue w-full self-start p-6 md:p-8">
      <p className="font-display text-lg text-ink">{t("heroPanelTitle")}</p>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{t("heroPanelIntro")}</p>
      <ul className="mt-6 space-y-3">
        {ITEMS.map(({ key, href }) => (
          <li key={key}>
            <Link
              href={href}
              className="flex items-start gap-2 rounded-xl bg-cream/70 px-3 py-2.5 text-sm text-ink-muted transition hover:bg-sage/35 hover:text-ink"
            >
              <span className="mt-0.5 text-sage">✓</span>
              <span>{t(key)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
