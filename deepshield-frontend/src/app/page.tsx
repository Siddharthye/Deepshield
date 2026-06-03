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

      <section className="relative mx-auto max-w-6xl px-4 py-16 md:py-20 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-stretch lg:gap-14 xl:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex min-w-0 flex-col justify-center gap-8 lg:gap-9"
          >
            <div className="flex flex-col gap-5 sm:gap-6">
              <div className="relative w-fit">
                <AnimatedShield className="pointer-events-none absolute -right-1 -top-1 h-8 w-8 opacity-70 md:h-9 md:w-9" />
                <Image
                  src="/images/ds-logo.jpeg"
                  alt={t("brandAlt")}
                  width={88}
                  height={88}
                  className="relative h-[4.5rem] w-[4.5rem] rounded-2xl object-contain shadow-md ring-2 ring-secondary/30 md:h-20 md:w-20"
                  priority
                  unoptimized
                />
              </div>
              <p className="page-badge !mb-0 w-fit">{t("tagline")}</p>
            </div>

            <div className="max-w-xl space-y-4">
              <h1 className="font-display text-3xl leading-[1.12] text-ink md:text-4xl lg:text-[2.65rem]">
                {t("heroTitle")}
              </h1>
              <TypewriterSubtitle />
            </div>

            <div className="max-w-xl space-y-3 border-l-2 border-accent/25 pl-4 text-ink-muted">
              <p className="text-base leading-relaxed">{t("homeHero")}</p>
              <p className="text-sm leading-relaxed">{t("heroExtra")}</p>
            </div>

            <div className="flex w-full max-w-xl flex-col gap-5">
              <ul className="flex flex-wrap gap-2">
                {TRUST_KEYS.map((key) => (
                  <li
                    key={key}
                    className="ui-nowrap rounded-full bg-cream-tan/80 px-3 py-1.5 text-xs font-medium text-ink-muted ring-1 ring-secondary/15"
                  >
                    {t(key)}
                  </li>
                ))}
              </ul>

              <div className="grid w-full grid-cols-1 gap-3 sm:max-w-md sm:grid-cols-2">
                <ButtonLink href="/scan" className="w-full justify-center">
                  {t("scanNow")}
                </ButtonLink>
                <ButtonLink href="/asha" variant="secondary" className="w-full justify-center">
                  {t("talkToAsha")}
                </ButtonLink>
              </div>
            </div>
          </motion.div>

          <div className="flex min-h-0 w-full min-w-0 lg:max-w-[420px] lg:justify-self-end">
            <HeroPanel />
          </div>
        </div>
      </section>

      <HomeCrisisStrip />
      <HomeProblem />
      <WaveDivider />

      <section className="mx-auto max-w-6xl px-4 pb-8">
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
