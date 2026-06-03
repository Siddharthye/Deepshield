"use client";

import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { useLanguage } from "@/context/LanguageContext";
import type { I18nKey } from "@/lib/i18n";

const ACTIONS: { href: string; icon: string; titleKey: I18nKey; descKey: I18nKey }[] = [
  { href: "/scan", icon: "🔍", titleKey: "actionScanTitle", descKey: "actionScanDesc" },
  { href: "/trace", icon: "🌐", titleKey: "actionTraceTitle", descKey: "actionTraceDesc" },
  { href: "/report", icon: "📄", titleKey: "actionReportTitle", descKey: "actionReportDesc" },
  { href: "/asha", icon: "💬", titleKey: "actionAshaTitle", descKey: "actionAshaDesc" },
  { href: "/vault", icon: "🔐", titleKey: "actionVaultTitle", descKey: "actionVaultDesc" },
  { href: "/learn", icon: "📚", titleKey: "actionLearnTitle", descKey: "actionLearnDesc" },
];

export function HomeQuickActions() {
  const { t } = useLanguage();

  return (
    <section id="tools" className="mx-auto max-w-6xl px-4 pb-8 scroll-mt-24">
      <p className="page-badge">{t("quickStartBadge")}</p>
      <h2 className="font-display text-xl text-ink md:text-2xl">{t("quickStartTitle")}</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ACTIONS.map((a) => (
          <Link key={a.href} href={a.href}>
            <GlassCard className="flex h-full gap-4 p-5 transition hover:ring-2 hover:ring-[var(--color-berry)]/80">
              <span className="text-2xl">{a.icon}</span>
              <div>
                <p className="font-semibold text-ink">{t(a.titleKey)}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-muted">{t(a.descKey)}</p>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>
    </section>
  );
}
