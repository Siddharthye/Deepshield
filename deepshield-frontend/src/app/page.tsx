"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { ButtonLink } from "@/components/ui/Button";
import { HeroParticles } from "@/components/hero/HeroParticles";
import { AnimatedShield } from "@/components/ui/AnimatedShield";
import { HowItWorksPinned } from "@/components/sections/HowItWorksPinned";
import { FeatureOrbs } from "@/components/sections/FeatureOrbs";
import { HorizontalFeatures } from "@/components/sections/HorizontalFeatures";
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
  const { t } = useLanguage();

  return (
    <div className="relative overflow-hidden pt-16">
      <HeroParticles />

      <section className="relative mx-auto max-w-6xl px-4 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-10 md:flex-row"
        >
          <div className="relative shrink-0">
            <AnimatedShield className="absolute -right-2 -top-2 h-12 w-12 opacity-80" />
            <Image
              src="/images/ds-logo.jpeg"
              alt="DeepShield"
              width={150}
              height={150}
              className="relative rounded-3xl object-contain shadow-lg ring-2 ring-peach/70"
              priority
              unoptimized
            />
          </div>
          <div>
            <p className="page-badge">{t("tagline")}</p>
            <h1 className="font-display max-w-3xl text-4xl leading-tight text-ink md:text-5xl lg:text-[3.25rem]">
              {t("heroTitle")}
            </h1>
            <TypewriterSubtitle />
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink/70">{t("homeHero")}</p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/60">{t("heroExtra")}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {TRUST_KEYS.map((key) => (
                <li
                  key={key}
                  className="rounded-full bg-sage/40 px-3 py-1 text-xs font-medium text-ink/80"
                >
                  {t(key)}
                </li>
              ))}
            </ul>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/scan">{t("scanNow")}</ButtonLink>
              <ButtonLink href="/asha" variant="secondary">
                {t("talkToAsha")}
              </ButtonLink>
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
            <p className="mt-1 text-sm font-medium text-ink/80">{t("statFeatures")}</p>
            <p className="mt-1 text-xs text-ink/55">{t("statFeaturesHint")}</p>
          </GlassCard>
          <GlassCard className="py-8 text-center" tilt>
            <p className="font-display text-4xl text-ink">
              <OdometerNumber value={3} />
            </p>
            <p className="mt-1 text-sm font-medium text-ink/80">{t("statSignals")}</p>
            <p className="mt-1 text-xs text-ink/55">{t("statSignalsHint")}</p>
          </GlassCard>
          <GlassCard className="py-8 text-center" tilt>
            <p className="font-display text-4xl text-ink">
              <OdometerNumber value={8} />
            </p>
            <p className="mt-1 text-sm font-medium text-ink/80">{t("statLangs")}</p>
            <p className="mt-1 text-xs text-ink/55">{t("statLangsHint")}</p>
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
      <HorizontalFeatures />
      <Testimonials />
      <HomeFaq />
      <CtaStrip />
    </div>
  );
}
