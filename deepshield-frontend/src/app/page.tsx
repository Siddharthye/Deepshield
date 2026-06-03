"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { ButtonLink } from "@/components/ui/Button";
import { HeroParticles } from "@/components/hero/HeroParticles";
import { AnimatedShield } from "@/components/ui/AnimatedShield";
import { HowItWorksPinned } from "@/components/sections/HowItWorksPinned";
import { FeatureOrbs } from "@/components/sections/FeatureOrbs";
import { HomeCrisisStrip } from "@/components/sections/HomeCrisisStrip";
import { HomeWhySection } from "@/components/sections/HomeWhySection";
import { HomeQuickActions } from "@/components/sections/HomeQuickActions";
import { HomeProblem } from "@/components/sections/HomeProblem";
import { HomeMission } from "@/components/sections/HomeMission";
import { HomeFaq } from "@/components/sections/HomeFaq";
import { Testimonials } from "@/components/sections/Testimonials";
import { WaveDivider } from "@/components/sections/WaveDivider";
import { TypewriterSubtitle } from "@/components/home/TypewriterSubtitle";
import { HeroPanel } from "@/components/home/HeroPanel";
import { HeroHighlights } from "@/components/home/HeroHighlights";
import { HeroScrollCue } from "@/components/home/HeroScrollCue";
import { OdometerNumber } from "@/components/ui/OdometerNumber";
import { useLanguage } from "@/context/LanguageContext";

const TRUST_KEYS = ["trust1", "trust2", "trust3"] as const;

const HERO_STATS = [
  { value: 11, labelKey: "statFeatures" as const },
  { value: 3, labelKey: "statSignals" as const },
  { value: 8, labelKey: "statLangs" as const },
];

export default function HomePage() {
  const { t, language } = useLanguage();

  return (
    <div key={language} className="relative overflow-x-hidden pt-16">
      <HeroParticles />

      <section className="hero-section relative isolate mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16 lg:py-24">
        <div className="hero-glow pointer-events-none absolute inset-0 -z-10" aria-hidden />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col gap-4 border-b border-secondary/10 pb-8 sm:mb-10 sm:flex-row sm:items-center sm:gap-6 md:mb-12"
        >
          <div className="relative shrink-0">
            <AnimatedShield className="pointer-events-none absolute -right-1 -top-1 h-9 w-9 opacity-70" />
            <div className="relative rounded-2xl bg-cream-deep/60 p-1 shadow-[var(--shadow-soft)] ring-1 ring-secondary/20">
              <Image
                src="/images/ds-logo.jpeg"
                alt={t("brandAlt")}
                width={96}
                height={96}
                className="relative h-20 w-20 rounded-[14px] object-contain sm:h-24 sm:w-24"
                priority
                unoptimized
              />
            </div>
          </div>
          <div className="min-w-0 space-y-2">
            <p className="page-badge !mb-0">{t("tagline")}</p>
            <p className="text-xs text-ink-subtle">{t("heroTaglineSub")}</p>
          </div>
        </motion.div>

        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)] lg:gap-x-12 xl:gap-x-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="flex min-w-0 flex-col gap-6 md:gap-7"
          >
            <div className="space-y-4">
              <h1 className="hero-title font-display max-w-xl text-3xl leading-[1.1] text-ink md:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
                {t("heroTitle")}
              </h1>
              <TypewriterSubtitle />
            </div>

            <div className="max-w-xl space-y-3 rounded-2xl border border-secondary/10 bg-cream-deep/25 px-4 py-4 text-ink-muted backdrop-blur-sm md:px-5">
              <p className="text-base leading-relaxed">{t("homeHero")}</p>
              <p className="text-sm leading-relaxed">{t("heroExtra")}</p>
            </div>

            <HeroHighlights />

            <div className="flex flex-wrap gap-2 sm:gap-3">
              {HERO_STATS.map((stat, i) => (
                <motion.div
                  key={stat.labelKey}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.28 + i * 0.05 }}
                  className="flex items-baseline gap-2 rounded-full bg-cream-tan/90 px-3.5 py-2 ring-1 ring-secondary/12"
                >
                  <span className="font-display text-lg leading-none text-accent">
                    <OdometerNumber value={stat.value} />
                  </span>
                  <span className="text-[11px] font-medium text-ink-muted">{t(stat.labelKey)}</span>
                </motion.div>
              ))}
            </div>

            <ul className="flex max-w-xl flex-wrap gap-2">
              {TRUST_KEYS.map((key) => (
                <li
                  key={key}
                  className="rounded-full bg-parchment/90 px-3 py-1.5 text-xs font-medium text-ink-muted ring-1 ring-sage/25"
                >
                  {t(key)}
                </li>
              ))}
            </ul>

            <div className="flex max-w-xl flex-wrap items-center gap-3">
              <ButtonLink href="/scan" className="shadow-[var(--shadow-glow)]">
                {t("scanNow")}
              </ButtonLink>
              <ButtonLink href="/asha" variant="secondary">
                {t("talkToAsha")}
              </ButtonLink>
              <Link
                href="/learn"
                className="text-sm font-medium text-link underline-offset-4 hover:underline"
              >
                {t("heroLearnLink")}
              </Link>
            </div>
          </motion.div>

          <div className="min-w-0 w-full lg:sticky lg:top-24 lg:self-start">
            <HeroPanel />
          </div>
        </div>

        <HeroScrollCue />
      </section>

      <HomeCrisisStrip />
      <HomeProblem />
      <WaveDivider />

      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <GlassCard className="py-8 text-center" tilt>
            <p className="font-display text-4xl text-ink">
              <OdometerNumber value={11} />
            </p>
            <p className="mt-1 text-sm font-medium text-ink-muted">{t("statFeatures")}</p>
            <p className="mt-1 text-xs text-ink-subtle">{t("statFeaturesHint")}</p>
          </GlassCard>
          <GlassCard className="py-8 text-center" tilt>
            <p className="font-display text-4xl text-ink">
              <OdometerNumber value={3} />
            </p>
            <p className="mt-1 text-sm font-medium text-ink-muted">{t("statSignals")}</p>
            <p className="mt-1 text-xs text-ink-subtle">{t("statSignalsHint")}</p>
          </GlassCard>
          <GlassCard className="py-8 text-center" tilt>
            <p className="font-display text-4xl text-ink">
              <OdometerNumber value={8} />
            </p>
            <p className="mt-1 text-sm font-medium text-ink-muted">{t("statLangs")}</p>
            <p className="mt-1 text-xs text-ink-subtle">{t("statLangsHint")}</p>
          </GlassCard>
        </div>
      </section>

      <HomeQuickActions />
      <WaveDivider />
      <HomeMission />
      <WaveDivider />
      <FeatureOrbs />
      <WaveDivider />
      <HomeWhySection />
      <WaveDivider />
      <HowItWorksPinned />
      <Testimonials />
      <HomeFaq />
    </div>
  );
}
