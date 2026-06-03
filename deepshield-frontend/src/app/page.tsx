"use client";

import Image from "next/image";
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
import { OdometerNumber } from "@/components/ui/OdometerNumber";
import { useLanguage } from "@/context/LanguageContext";

const TRUST_KEYS = ["trust1", "trust2", "trust3"] as const;

export default function HomePage() {
  const { t, language } = useLanguage();

  return (
    <div key={language} className="relative overflow-x-hidden pt-16">
      <HeroParticles />

      <section className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-center sm:gap-5 md:mb-12"
        >
          <div className="relative shrink-0">
            <AnimatedShield className="pointer-events-none absolute -right-1 -top-1 h-9 w-9 opacity-70" />
            <Image
              src="/images/ds-logo.jpeg"
              alt={t("brandAlt")}
              width={96}
              height={96}
              className="relative h-20 w-20 rounded-2xl object-contain shadow-md ring-2 ring-secondary/30 sm:h-24 sm:w-24"
              priority
              unoptimized
            />
          </div>
          <p className="page-badge !mb-0 max-w-md leading-snug sm:max-w-none">
            {t("tagline")}
          </p>
        </motion.div>

        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(300px,380px)] lg:gap-x-14 lg:gap-y-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="flex min-w-0 flex-col gap-6 md:gap-7"
          >
            <div className="space-y-4">
              <h1 className="font-display max-w-xl text-3xl leading-[1.12] text-ink md:text-4xl lg:text-[2.65rem]">
                {t("heroTitle")}
              </h1>
              <TypewriterSubtitle />
            </div>

            <div className="max-w-xl space-y-3 text-ink-muted">
              <p className="text-base leading-relaxed">{t("homeHero")}</p>
              <p className="text-sm leading-relaxed">{t("heroExtra")}</p>
            </div>

            <ul className="flex max-w-xl flex-wrap gap-2">
              {TRUST_KEYS.map((key) => (
                <li
                  key={key}
                  className="rounded-full bg-cream-tan/80 px-3 py-1.5 text-xs font-medium text-ink-muted ring-1 ring-secondary/15"
                >
                  {t(key)}
                </li>
              ))}
            </ul>

            <div className="flex max-w-xl flex-wrap items-center gap-3">
              <ButtonLink href="/scan">{t("scanNow")}</ButtonLink>
              <ButtonLink href="/asha" variant="secondary">
                {t("talkToAsha")}
              </ButtonLink>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.45 }}
            className="min-w-0 w-full lg:justify-self-end"
          >
            <HeroPanel />
          </motion.div>
        </div>
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
