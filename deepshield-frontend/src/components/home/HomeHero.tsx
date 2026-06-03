"use client";

import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { OdometerNumber } from "@/components/ui/OdometerNumber";
import { TypewriterSubtitle } from "@/components/home/TypewriterSubtitle";
import { HeroBrandMoment } from "@/components/home/HeroBrandMoment";
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
    <section className="relative mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div
        className="pointer-events-none absolute -right-24 top-0 h-[380px] w-[380px] rounded-full bg-[var(--color-berry)]/25 blur-[100px]"
        aria-hidden
      />

      <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,400px)] lg:gap-14 xl:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex flex-col"
        >
          <BrandLogo size="lg" showWordmark={false} className="mb-5" />

          <p className="page-badge">{t("tagline")}</p>

          <h1 className="font-display mt-3 max-w-[16ch] text-[1.75rem] font-semibold leading-[1.18] tracking-[-0.03em] text-ink sm:text-[2rem] md:text-[2.25rem] lg:max-w-none lg:text-[2.5rem]">
            {t("heroTitle")}
          </h1>

          <div className="mt-3 max-w-xl">
            <TypewriterSubtitle className="min-h-[1.5rem] text-base text-ink-muted md:text-[1.0625rem]" />
          </div>

          <p className="mt-4 max-w-lg text-[0.9375rem] leading-relaxed text-ink-muted md:text-base">
            {t("homeHero")}
          </p>

          <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-subtle lg:hidden">
            {t("heroExtra")}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <ButtonLink href="/scan">{t("scanNow")}</ButtonLink>
            <ButtonLink href="/asha" variant="secondary">
              {t("talkToAsha")}
            </ButtonLink>
          </div>

          <ul className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-5">
            {TRUST_KEYS.map((key) => (
              <li key={key} className="flex items-center gap-2 text-sm text-ink-muted">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-berry)]/75 text-[10px] font-semibold text-[var(--color-soldier)]">
                  ✓
                </span>
                {t(key)}
              </li>
            ))}
          </ul>

          <p className="mt-5 hidden max-w-lg text-sm leading-relaxed text-ink-subtle lg:block">
            {t("heroExtra")}
          </p>
        </motion.div>

        <HeroBrandMoment />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.12 }}
        className="mt-12 grid gap-3 sm:grid-cols-3"
      >
        {STATS.map((s) => (
          <div
            key={s.labelKey}
            className="rounded-[var(--radius-card)] bg-white/70 px-5 py-5 text-center shadow-[var(--shadow-soft)] ring-1 ring-black/[0.05] backdrop-blur-sm md:py-6"
          >
            <p className="font-display text-3xl tracking-tight text-ink md:text-[2rem]">
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
