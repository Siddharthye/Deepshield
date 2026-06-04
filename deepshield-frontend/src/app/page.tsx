"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { HowItWorksPinned } from "@/components/sections/HowItWorksPinned";
import { FeatureOrbs } from "@/components/sections/FeatureOrbs";
import { HomeCrisisStrip } from "@/components/sections/HomeCrisisStrip";
import { HomeWhySection } from "@/components/sections/HomeWhySection";
import { HomeProblem } from "@/components/sections/HomeProblem";
import { HomeMission } from "@/components/sections/HomeMission";
import { HomeFaq } from "@/components/sections/HomeFaq";
import { Testimonials } from "@/components/sections/Testimonials";
import { WaveDivider } from "@/components/sections/WaveDivider";
import { HeroSection } from "@/components/home/HeroSection";
import { OdometerNumber } from "@/components/ui/OdometerNumber";
import { useLanguage } from "@/context/LanguageContext";

export default function HomePage() {
  const { t, language } = useLanguage();

  return (
    <div key={language} className="relative overflow-x-hidden pt-16">
      <HeroSection />

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
