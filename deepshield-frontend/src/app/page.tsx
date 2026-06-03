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
import { CtaStrip } from "@/components/sections/CtaStrip";
import { WaveDivider } from "@/components/sections/WaveDivider";
import { TypewriterSubtitle } from "@/components/home/TypewriterSubtitle";
import { OdometerNumber } from "@/components/ui/OdometerNumber";
import { useLanguage } from "@/context/LanguageContext";

const TRUST_KEYS = ["trust1", "trust2", "trust3"] as const;

export default function HomePage() {
  const { t, language } = useLanguage();

  return (
    <div key={language} className="relative overflow-hidden pt-16">
      <HeroParticles />

      <section className="relative mx-auto max-w-3xl px-4 py-14 md:py-20 lg:max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center sm:items-start sm:text-left"
        >
          <div className="relative mb-8 shrink-0">
            <AnimatedShield className="absolute -right-2 -top-2 h-11 w-11 opacity-70" />
            <Image
              src="/images/ds-logo.jpeg"
              alt={t("brandAlt")}
              width={120}
              height={120}
              className="relative rounded-[22px] object-contain shadow-[var(--shadow-soft)] ring-1 ring-black/5"
              priority
              unoptimized
            />
          </div>
          <p className="page-badge">{t("tagline")}</p>
          <h1 className="font-display text-3xl leading-[1.15] tracking-tight text-ink md:text-[2.65rem]">
            {t("heroTitle")}
          </h1>
          <div className="mt-3 w-full max-w-xl">
            <TypewriterSubtitle />
          </div>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">
            {t("homeHero")}
          </p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-subtle">
            {t("heroExtra")}
          </p>
          <ul className="mt-6 flex flex-wrap justify-center gap-2 sm:justify-start">
            {TRUST_KEYS.map((key) => (
              <li
                key={key}
                className="rounded-full bg-white/70 px-3.5 py-1.5 text-xs font-medium text-ink-muted shadow-sm ring-1 ring-black/5"
              >
                {t(key)}
              </li>
            ))}
          </ul>
          <div className="mt-9 flex flex-wrap justify-center gap-3 sm:justify-start">
            <ButtonLink href="/scan">{t("scanNow")}</ButtonLink>
            <ButtonLink href="/asha" variant="secondary">
              {t("talkToAsha")}
            </ButtonLink>
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
              <OdometerNumber value={2} />
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
      <CtaStrip />
    </div>
  );
}
