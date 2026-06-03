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

      <section className="relative mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_minmax(280px,380px)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-8 sm:flex-row sm:items-start"
          >
            <div className="relative shrink-0">
              <AnimatedShield className="absolute -right-2 -top-2 h-12 w-12 opacity-80" />
              <Image
                src="/images/ds-logo.jpeg"
                alt={t("brandAlt")}
                width={140}
                height={140}
                className="relative rounded-3xl object-contain shadow-lg ring-2 ring-secondary/35"
                priority
                unoptimized
              />
            </div>
            <div className="flex-1">
              <p className="page-badge">{t("tagline")}</p>
              <h1 className="font-display text-3xl leading-tight text-ink md:text-4xl lg:text-[2.75rem]">
                {t("heroTitle")}
              </h1>
              <TypewriterSubtitle />
              <p className="mt-4 text-base leading-relaxed text-ink-muted">{t("homeHero")}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{t("heroExtra")}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {TRUST_KEYS.map((key) => (
                  <li
                    key={key}
                    className="ui-nowrap rounded-full bg-cream-tan/80 px-3 py-1 text-xs font-medium text-ink-muted ring-1 ring-secondary/15"
                  >
                    {t(key)}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/scan">{t("scanNow")}</ButtonLink>
                <ButtonLink href="/asha" variant="secondary">
                  {t("talkToAsha")}
                </ButtonLink>
              </div>
            </div>
          </motion.div>
          <HeroPanel />
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
