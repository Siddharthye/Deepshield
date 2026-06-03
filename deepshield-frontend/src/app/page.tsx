"use client";

import { HomeHero } from "@/components/home/HomeHero";
import { HeroParticles } from "@/components/hero/HeroParticles";
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
import { useLanguage } from "@/context/LanguageContext";

export default function HomePage() {
  const { language } = useLanguage();

  return (
    <div key={language} className="relative overflow-hidden pt-16">
      <HeroParticles />
      <HomeHero />
      <HomeCrisisStrip />
      <HomeProblem />
      <WaveDivider />
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
