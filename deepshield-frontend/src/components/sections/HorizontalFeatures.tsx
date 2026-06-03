"use client";

import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { useLanguage } from "@/context/LanguageContext";
import type { I18nKey } from "@/lib/i18n";

const PANEL_KEYS: {
  title: I18nKey;
  href: string;
  color: string;
  icon: string;
  desc: I18nKey;
  detail: I18nKey;
  cta: I18nKey;
}[] = [
  {
    title: "journeyDetectTitle",
    href: "/scan",
    color: "from-pink/50 to-peach/40",
    icon: "🔍",
    desc: "journeyDetectDesc",
    detail: "journeyDetectDetail",
    cta: "journeyDetectCta",
  },
  {
    title: "journeyTraceTitle",
    href: "/trace",
    color: "from-peach/50 to-cream",
    icon: "🌐",
    desc: "journeyTraceDesc",
    detail: "journeyTraceDetail",
    cta: "journeyTraceCta",
  },
  {
    title: "journeyReportTitle",
    href: "/report",
    color: "from-blue/50 to-sage/30",
    icon: "📄",
    desc: "journeyReportDesc",
    detail: "journeyReportDetail",
    cta: "journeyReportCta",
  },
  {
    title: "journeyVaultTitle",
    href: "/vault",
    color: "from-sage/40 to-blue/30",
    icon: "🔐",
    desc: "journeyVaultDesc",
    detail: "journeyVaultDetail",
    cta: "journeyVaultCta",
  },
  {
    title: "journeyAshaTitle",
    href: "/asha",
    color: "from-pink/35 to-blue/35",
    icon: "💬",
    desc: "journeyAshaDesc",
    detail: "journeyAshaDetail",
    cta: "journeyAshaCta",
  },
  {
    title: "journeyLearnTitle",
    href: "/learn",
    color: "from-peach/40 to-pink/25",
    icon: "📚",
    desc: "journeyLearnDesc",
    detail: "journeyLearnDetail",
    cta: "journeyLearnCta",
  },
];

export function HorizontalFeatures() {
  const { t } = useLanguage();

  return (
    <section className="section-pad section-alt-sage mx-auto max-w-6xl px-4">
      <p className="page-badge">{t("journeyBadge")}</p>
      <h2 className="font-display text-2xl text-ink md:text-3xl">{t("journeyTitle")}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-muted">{t("journeyIntro")}</p>

      <div className="mt-8 -mx-4 flex gap-5 overflow-x-auto px-4 pb-4 snap-x snap-mandatory scroll-smooth md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:snap-none lg:grid-cols-3">
        {PANEL_KEYS.map((p) => (
          <Link
            key={p.title}
            href={p.href}
            className={`flex min-h-[320px] w-[min(88vw,360px)] shrink-0 snap-center flex-col justify-between rounded-3xl bg-gradient-to-br p-8 shadow-lg ring-1 ring-white/40 transition hover:ring-2 hover:ring-pink/40 md:w-auto md:shrink ${p.color}`}
          >
            <div>
              <span className="text-4xl">{p.icon}</span>
              <h3 className="font-display mt-4 text-2xl text-ink">{t(p.title)}</h3>
              <p className="mt-2 text-sm font-medium text-ink-muted">{t(p.desc)}</p>
              <p className="mt-3 text-xs leading-relaxed text-ink-muted">{t(p.detail)}</p>
            </div>
            <span className="mt-6 inline-flex w-fit rounded-full bg-cream/90 px-4 py-2 text-sm font-medium text-ink shadow-sm">
              {t(p.cta)} {t("openFeatureArrow")}
            </span>
          </Link>
        ))}
      </div>

      <p className="mt-4 text-center text-xs text-ink-subtle md:hidden">{t("journeySwipe")}</p>

      <GlassCard className="mt-10 p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              {t("journeyHelpBadge")}
            </p>
            <p className="mt-1 font-display text-lg text-ink">{t("journeyHelpTitle")}</p>
            <p className="mt-2 text-sm text-ink-muted">{t("journeyHelpBody")}</p>
          </div>
          <ul className="flex flex-wrap gap-3 text-sm text-ink-muted">
            <li className="rounded-full bg-peach/40 px-3 py-1.5">
              {t("helplineCyber")}: 1930
            </li>
            <li className="rounded-full bg-peach/40 px-3 py-1.5">{t("helplineNcw")}: 181</li>
            <li className="rounded-full bg-peach/40 px-3 py-1.5">iCall: 9152987821</li>
          </ul>
        </div>
      </GlassCard>
    </section>
  );
}
