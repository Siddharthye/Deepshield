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
import { Testimonials } from "@/components/sections/Testimonials";
import { CtaStrip } from "@/components/sections/CtaStrip";
import { WaveDivider } from "@/components/sections/WaveDivider";
import { TypewriterSubtitle } from "@/components/home/TypewriterSubtitle";
import { OdometerNumber } from "@/components/ui/OdometerNumber";
import { useLanguage } from "@/context/LanguageContext";

const STATS = [
  { value: 11, label: "Core features" },
  { value: 3, label: "Detection signals" },
  { value: 8, label: "Languages" },
];

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
              Your armor against digital violence
            </h1>
            <TypewriterSubtitle />
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink/70">{t("homeHero")}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/scan">{t("scanNow")}</ButtonLink>
              <ButtonLink href="/asha" variant="secondary">
                {t("talkToAsha")}
              </ButtonLink>
            </div>
          </div>
        </motion.div>
      </section>

      <WaveDivider />

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="grid gap-4 sm:grid-cols-3">
          {STATS.map((s) => (
            <GlassCard key={s.label} className="py-8 text-center" tilt>
              <p className="font-display text-4xl text-pink">
                <OdometerNumber value={s.value} />
              </p>
              <p className="mt-1 text-sm text-ink/70">{s.label}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <FeatureOrbs />
      <WaveDivider />
      <HowItWorksPinned />
      <HorizontalFeatures />
      <Testimonials />
      <CtaStrip />
    </div>
  );
}
