"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { useLanguage } from "@/context/LanguageContext";
import type { I18nKey } from "@/lib/i18n";

const GUIDES: {
  icon: string;
  titleKey: I18nKey;
  descKey: I18nKey;
  ctaKey: I18nKey;
  href: string;
}[] = [
  {
    icon: "🖼️",
    titleKey: "heroGuideScanTitle",
    descKey: "heroGuideScanDesc",
    ctaKey: "heroGuideScanCta",
    href: "/scan",
  },
  {
    icon: "🔎",
    titleKey: "heroGuideTraceTitle",
    descKey: "heroGuideTraceDesc",
    ctaKey: "heroGuideTraceCta",
    href: "/trace",
  },
  {
    icon: "💜",
    titleKey: "heroGuideAshaTitle",
    descKey: "heroGuideAshaDesc",
    ctaKey: "heroGuideAshaCta",
    href: "/asha",
  },
];

const HELPLINES: { labelKey: I18nKey; noteKey: I18nKey; tel: string }[] = [
  { labelKey: "helplineCyber", noteKey: "helplineCyberNote", tel: "1930" },
  { labelKey: "helplineNcw", noteKey: "helplineNcwNote", tel: "181" },
  { labelKey: "helplineIcall", noteKey: "helplineIcallNote", tel: "9152987821" },
];

export function HeroGuidance() {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.4 }}
      className="mt-8 flex flex-1 flex-col gap-5 lg:mt-auto lg:pt-6"
    >
      <div>
        <p className="page-badge">{t("heroGuideBadge")}</p>
        <h2 className="mt-2 font-display text-xl text-ink md:text-2xl">
          {t("heroGuideTitle")}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{t("heroGuideIntro")}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {GUIDES.map((g) => (
          <Link key={g.href} href={g.href} className="group block h-full">
            <GlassCard className="flex h-full flex-col gap-3 p-5 transition group-hover:ring-2 group-hover:ring-pink/45">
              <span className="text-3xl" aria-hidden>
                {g.icon}
              </span>
              <p className="font-semibold text-ink">{t(g.titleKey)}</p>
              <p className="flex-1 text-sm leading-relaxed text-ink-muted">{t(g.descKey)}</p>
              <span className="text-sm font-medium text-accent group-hover:underline">
                {t(g.ctaKey)} →
              </span>
            </GlassCard>
          </Link>
        ))}
      </div>

      <GlassCard className="p-5">
        <p className="text-sm font-semibold text-ink">{t("heroGuideCrisisTitle")}</p>
        <p className="mt-1 text-xs text-ink-muted">{t("heroGuideCrisisIntro")}</p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-3">
          {HELPLINES.map((h) => (
            <li key={h.tel}>
              <a
                href={`tel:${h.tel}`}
                className="flex flex-col rounded-xl bg-peach/35 px-3 py-3 transition hover:bg-peach/55"
              >
                <span className="text-xs font-medium text-ink-muted">{t(h.labelKey)}</span>
                <span className="font-display text-xl text-ink">{h.tel}</span>
                <span className="mt-0.5 text-[10px] text-ink-subtle">{t(h.noteKey)}</span>
              </a>
            </li>
          ))}
        </ul>
      </GlassCard>

      <p className="text-center text-xs leading-relaxed text-ink-subtle sm:text-left">
        {t("heroGuideReassure")}
      </p>
    </motion.div>
  );
}
