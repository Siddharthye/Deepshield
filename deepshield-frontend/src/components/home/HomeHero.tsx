"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { OdometerNumber } from "@/components/ui/OdometerNumber";
import { TypewriterSubtitle } from "@/components/home/TypewriterSubtitle";
import { useLanguage } from "@/context/LanguageContext";

const TRUST_KEYS = ["trust1", "trust2", "trust3"] as const;

const STATS = [
  { value: 11, labelKey: "statFeatures" as const, hintKey: "statFeaturesHint" as const },
  { value: 3, labelKey: "statSignals" as const, hintKey: "statSignalsHint" as const },
  { value: 2, labelKey: "statLangs" as const, hintKey: "statLangsHint" as const },
];

export function HomeHero() {
  const { t } = useLanguage();

  return (
    <section className="relative mx-auto max-w-4xl px-4 py-12 md:py-16 lg:max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="flex flex-col items-center text-center sm:items-start sm:text-left"
      >
        <BrandLogo size="lg" showWordmark={false} className="mb-5" />

        <p className="page-badge">{t("tagline")}</p>

        <h1 className="font-display mt-3 max-w-2xl text-[1.75rem] font-semibold leading-[1.2] tracking-[-0.03em] text-ink sm:text-[2rem] md:text-[2.25rem]">
          {t("heroTitle")}
        </h1>

        <div className="mt-3 w-full max-w-xl">
          <TypewriterSubtitle />
        </div>

        <p className="mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-ink-muted md:text-base">
          {t("homeHero")}
        </p>

        <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-subtle">
          {t("heroExtra")}
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
          <ButtonLink href="/scan">{t("scanNow")}</ButtonLink>
          <ButtonLink href="/asha" variant="secondary">
            {t("talkToAsha")}
          </ButtonLink>
          <Link
            href="#tools"
            className="text-sm font-medium text-[var(--color-koubai)] hover:text-ink"
          >
            {t("heroExploreTools")} →
          </Link>
        </div>

        <ul className="mt-6 flex flex-wrap justify-center gap-2 sm:justify-start">
          {TRUST_KEYS.map((key) => (
            <li
              key={key}
              className="rounded-full bg-white/75 px-3 py-1 text-xs font-medium text-ink-muted shadow-sm ring-1 ring-black/5"
            >
              {t(key)}
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="mt-12 grid gap-3 sm:grid-cols-3"
      >
        {STATS.map((s) => (
          <div
            key={s.labelKey}
            className="rounded-[var(--radius-card)] bg-white/70 px-5 py-5 text-center shadow-[var(--shadow-soft)] ring-1 ring-black/[0.05]"
          >
            <p className="font-display text-3xl tracking-tight text-ink">
              <OdometerNumber value={s.value} />
            </p>
            <p className="mt-1 text-sm font-medium text-ink">{t(s.labelKey)}</p>
            <p className="mt-0.5 text-xs text-ink-subtle">{t(s.hintKey)}</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
