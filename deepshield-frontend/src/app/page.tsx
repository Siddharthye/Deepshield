"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
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
import { HeroInfoCards } from "@/components/home/HeroInfoCards";
import { HeroHelplines } from "@/components/home/HeroHelplines";
import { OdometerNumber } from "@/components/ui/OdometerNumber";
import { useLanguage } from "@/context/LanguageContext";

const TRUST_KEYS = ["trust1", "trust2", "trust3"] as const;

export default function HomePage() {
  const { t, language } = useLanguage();

  return (
    <div key={language} className="relative overflow-x-hidden pt-16">
      <HeroParticles />

      <section className="relative mx-auto max-w-5xl px-4 py-16 md:py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-10 md:gap-12"
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
            <div className="relative shrink-0">
              <AnimatedShield className="pointer-events-none absolute -right-1 -top-1 h-9 w-9 opacity-70 md:h-10 md:w-10" />
              <Image
                src="/images/ds-logo.jpeg"
                alt={t("brandAlt")}
                width={96}
                height={96}
                className="relative h-20 w-20 rounded-2xl object-contain shadow-md ring-2 ring-secondary/30 md:h-24 md:w-24"
                priority
                unoptimized
              />
            </div>
            <div className="min-w-0 space-y-4">
              <p className="page-badge !mb-0 w-fit">{t("tagline")}</p>
              <h1 className="font-display max-w-3xl text-3xl leading-[1.1] text-ink md:text-4xl lg:text-5xl">
                {t("heroTitle")}
              </h1>
              <TypewriterSubtitle />
            </div>
          </div>

          <div className="max-w-3xl space-y-4 text-ink-muted">
            <p className="text-lg leading-relaxed md:text-xl">{t("homeHero")}</p>
            <p className="text-base leading-relaxed">{t("heroExtra")}</p>
          </div>

          <HeroInfoCards />
          <HeroHelplines />

          <div className="space-y-5 border-t border-secondary/15 pt-8">
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
            <div className="max-w-3xl space-y-2">
              <p className="font-display text-lg text-ink">{t("footerLine1")}</p>
              <p className="text-sm text-ink-muted">{t("heroClosing")}</p>
              <p className="text-xs text-ink-subtle">{t("footerLine2")}</p>
            </div>
          </div>
        </motion.div>
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
