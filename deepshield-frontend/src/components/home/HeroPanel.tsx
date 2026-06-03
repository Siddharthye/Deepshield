"use client";

import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { ButtonLink } from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";
import type { I18nKey } from "@/lib/i18n";

const ITEMS: { key: I18nKey; href: string; ctaKey: I18nKey }[] = [
  { key: "heroPanelScan", href: "/scan", ctaKey: "heroPanelScanCta" },
  { key: "heroPanelTrace", href: "/trace", ctaKey: "heroPanelTraceCta" },
  { key: "heroPanelReport", href: "/report", ctaKey: "heroPanelReportCta" },
  { key: "heroPanelVault", href: "/vault", ctaKey: "heroPanelVaultCta" },
  { key: "heroPanelAsha", href: "/asha", ctaKey: "heroPanelAshaCta" },
];

export function HeroPanel() {
  const { t } = useLanguage();

  return (
    <GlassCard className="glass-card-tint-blue flex h-full flex-col p-6 md:p-8">
      <p className="font-display text-lg text-ink">{t("heroPanelTitle")}</p>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{t("heroPanelIntro")}</p>

      <ul className="mt-6 flex-1 space-y-3">
        {ITEMS.map(({ key, href, ctaKey }) => (
          <li key={key}>
            <Link
              href={href}
              className="block rounded-xl bg-cream/70 px-3 py-3 transition hover:bg-sage/35"
            >
              <p className="text-sm font-medium text-ink">{t(key)}</p>
              <span className="mt-1 inline-block text-xs font-medium text-accent">
                {t(ctaKey)} →
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-xl bg-blue/25 px-4 py-3 text-sm text-ink-muted">
        <p className="font-medium text-ink">{t("heroPanelLawTitle")}</p>
        <p className="mt-1 text-xs leading-relaxed">{t("heroPanelLaw")}</p>
      </div>

      <div className="mt-5 border-t border-sage/30 pt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">
          {t("heroPanelUrgentBadge")}
        </p>
        <p className="mt-1 text-sm text-ink-muted">{t("heroPanelUrgentIntro")}</p>
        <ButtonLink href="tel:1930" variant="secondary" className="mt-3 w-full justify-center">
          {t("heroPanelCall1930")}
        </ButtonLink>
      </div>
    </GlassCard>
  );
}
