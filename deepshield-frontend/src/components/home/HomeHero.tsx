"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { AnimatedShield } from "@/components/ui/AnimatedShield";
import { OdometerNumber } from "@/components/ui/OdometerNumber";
import { TypewriterSubtitle } from "@/components/home/TypewriterSubtitle";
import { useLanguage } from "@/context/LanguageContext";

const TRUST_KEYS = ["trust1", "trust2", "trust3"] as const;

const STATS = [
  { value: 11, labelKey: "statFeatures" as const, hintKey: "statFeaturesHint" as const },
  { value: 3, labelKey: "statSignals" as const, hintKey: "statSignalsHint" as const },
  { value: 2, labelKey: "statLangs" as const, hintKey: "statLangsHint" as const },
];

function HeatmapMock({ chip1, chip2 }: { chip1: string; chip2: string }) {
  return (
    <div
      className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-fog)] to-white ring-1 ring-black/6"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(185,125,123,0.35),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(145,142,93,0.28),transparent_50%)]" />
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(87,85,39,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(87,85,39,0.06)_1px,transparent_1px)] [background-size:18px_18px]" />
      <div className="absolute bottom-3 left-3 right-3 flex gap-2">
        <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium text-ink-muted shadow-sm ring-1 ring-black/5">
          {chip1}
        </span>
        <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium text-ink-muted shadow-sm ring-1 ring-black/5">
          {chip2}
        </span>
      </div>
    </div>
  );
}

export function HomeHero() {
  const { t } = useLanguage();

  return (
    <section className="relative mx-auto max-w-6xl px-4 pb-4 pt-6 md:pt-10 md:pb-8">
      <div
        className="pointer-events-none absolute -right-20 top-0 h-[420px] w-[420px] rounded-full bg-[var(--color-berry)]/30 blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-20 h-[280px] w-[280px] rounded-full bg-[var(--color-meadow)]/20 blur-[80px]"
        aria-hidden
      />

      <div className="relative grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(300px,1fr)] lg:gap-14 xl:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col"
        >
          <div className="mb-6 flex items-center gap-4">
            <div className="relative shrink-0">
              <AnimatedShield className="absolute -right-1 -top-1 h-9 w-9 opacity-75" />
              <Image
                src="/images/ds-logo.jpeg"
                alt={t("brandAlt")}
                width={56}
                height={56}
                className="relative rounded-2xl object-contain shadow-sm ring-1 ring-black/5"
                priority
                unoptimized
              />
            </div>
            <p className="page-badge mb-0">{t("tagline")}</p>
          </div>

          <h1 className="font-display max-w-[14ch] text-[2.35rem] font-semibold leading-[1.08] tracking-[-0.04em] text-ink sm:text-5xl lg:text-[3.35rem]">
            {t("heroTitle")}
          </h1>

          <div className="mt-4 max-w-xl">
            <TypewriterSubtitle className="text-xl sm:text-2xl" />
          </div>

          <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-muted sm:text-[1.125rem]">
            {t("homeHero")}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href="/scan" className="px-6 py-3 text-base">
              {t("scanNow")}
            </ButtonLink>
            <ButtonLink href="/asha" variant="secondary" className="px-6 py-3 text-base">
              {t("talkToAsha")}
            </ButtonLink>
            <Link
              href="#tools"
              className="px-2 py-2 text-sm font-medium text-[var(--color-koubai)] hover:text-ink"
            >
              {t("heroExploreTools")} →
            </Link>
          </div>

          <ul className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-x-6">
            {TRUST_KEYS.map((key) => (
              <li key={key} className="flex items-center gap-2 text-sm text-ink-muted">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-berry)]/70 text-[10px] text-[var(--color-soldier)]">
                  ✓
                </span>
                {t(key)}
              </li>
            ))}
          </ul>

          <p className="mt-6 hidden max-w-xl text-sm leading-relaxed text-ink-subtle lg:block">
            {t("heroExtra")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="relative mx-auto w-full max-w-md lg:max-w-none lg:justify-self-end"
        >
          <div className="hero-device relative rounded-[28px] bg-white/60 p-3 shadow-[0_24px_80px_rgba(87,85,39,0.12)] ring-1 ring-black/[0.06] backdrop-blur-xl sm:p-4">
            <div className="mb-3 flex items-center justify-between px-1">
              <span className="text-xs font-semibold tracking-tight text-ink">
                {t("heroShowcaseTitle")}
              </span>
              <span className="rounded-full bg-[var(--color-berry)]/60 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
                {t("heroShowcaseLive")}
              </span>
            </div>

            <HeatmapMock chip1={t("heroShowcaseFace")} chip2={t("heroShowcaseArtifacts")} />

            <div className="mt-4 grid grid-cols-[1fr_auto] items-end gap-3 rounded-2xl bg-[var(--color-fog)]/50 p-4 ring-1 ring-black/5">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-ink-subtle">
                  {t("heroShowcaseRiskLabel")}
                </p>
                <p className="font-display text-3xl tracking-tight text-[var(--color-koubai)]">
                  {t("heroShowcaseRiskValue")}
                </p>
                <p className="mt-0.5 text-xs text-ink-muted">{t("heroShowcaseRiskHint")}</p>
              </div>
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-inner ring-4 ring-[var(--color-berry)]/50"
                aria-hidden
              >
                <svg viewBox="0 0 36 36" className="h-14 w-14 -rotate-90">
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke="var(--color-fog)"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke="var(--color-koubai)"
                    strokeWidth="3"
                    strokeDasharray="72 100"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                { label: t("heroShowcaseChip1"), href: "/scan" },
                { label: t("heroShowcaseChip2"), href: "/trace" },
                { label: t("heroShowcaseChip3"), href: "/report" },
              ].map((chip) => (
                <Link
                  key={chip.href}
                  href={chip.href}
                  className="rounded-xl bg-white/80 px-2 py-2.5 text-center text-[11px] font-medium text-ink-muted ring-1 ring-black/5 transition hover:bg-white hover:text-ink"
                >
                  {chip.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="absolute -bottom-4 -left-4 hidden rounded-2xl bg-white/90 px-4 py-3 shadow-lg ring-1 ring-black/5 backdrop-blur-md sm:block">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-subtle">
              {t("heroShowcasePrivacy")}
            </p>
            <p className="mt-0.5 text-sm font-medium text-ink">{t("trust2")}</p>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mt-14 grid gap-3 sm:grid-cols-3"
      >
        {STATS.map((s) => (
          <div
            key={s.labelKey}
            className="rounded-[var(--radius-card)] bg-white/70 px-6 py-6 text-center shadow-[var(--shadow-soft)] ring-1 ring-black/[0.05] backdrop-blur-sm"
          >
            <p className="font-display text-4xl tracking-tight text-ink">
              <OdometerNumber value={s.value} />
            </p>
            <p className="mt-1 text-sm font-semibold text-ink">{t(s.labelKey)}</p>
            <p className="mt-0.5 text-xs text-ink-subtle">{t(s.hintKey)}</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
