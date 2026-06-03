"use client";

import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { ButtonLink } from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";
import type { I18nKey } from "@/lib/i18n";

const STEPS: {
  title: I18nKey;
  icon: string;
  body: I18nKey;
  checklist: I18nKey[];
  href: string;
  cta: I18nKey;
}[] = [
  {
    title: "how1Title",
    icon: "🔍",
    body: "how1Body",
    checklist: ["how1C1", "how1C2", "how1C3"],
    href: "/scan",
    cta: "how1Cta",
  },
  {
    title: "how2Title",
    icon: "📁",
    body: "how2Body",
    checklist: ["how2C1", "how2C2", "how2C3"],
    href: "/trace",
    cta: "how2Cta",
  },
  {
    title: "how3Title",
    icon: "⚖️",
    body: "how3Body",
    checklist: ["how3C1", "how3C2", "how3C3"],
    href: "/asha",
    cta: "how3Cta",
  },
];

export function HowItWorksPinned() {
  const { t } = useLanguage();

  return (
    <section className="section-pad mx-auto max-w-6xl px-4">
      <p className="page-badge">{t("howBadge")}</p>
      <h2 className="font-display text-2xl text-ink md:text-3xl">{t("howTitle")}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">{t("howIntro")}</p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <GlassCard key={s.title} className="flex h-full flex-col p-6" tilt>
            <span className="text-xs font-bold text-accent">
              {t("howStep")} {i + 1}
            </span>
            <span className="mt-3 text-3xl">{s.icon}</span>
            <h3 className="font-display mt-3 text-xl text-ink">{t(s.title)}</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">{t(s.body)}</p>
            <ul className="mt-4 space-y-2 border-t border-white/30 pt-4">
              {s.checklist.map((item) => (
                <li key={item} className="flex gap-2 text-xs text-ink-muted">
                  <span className="text-accent">✓</span>
                  {t(item)}
                </li>
              ))}
            </ul>
            <ButtonLink href={s.href} variant="secondary" className="mt-6 w-full justify-center">
              {t(s.cta)}
            </ButtonLink>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="mt-8 flex flex-col items-start gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-ink-muted">{t("howPrivacyNote")}</p>
        <Link href="/vault" className="text-sm font-medium text-link underline">
          {t("howVaultLink")}
        </Link>
      </GlassCard>
    </section>
  );
}
