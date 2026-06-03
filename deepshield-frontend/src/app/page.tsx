"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { ButtonLink } from "@/components/ui/Button";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Testimonials } from "@/components/sections/Testimonials";
import { CtaStrip } from "@/components/sections/CtaStrip";
import { TypewriterSubtitle } from "@/components/home/TypewriterSubtitle";
import { OdometerNumber } from "@/components/ui/OdometerNumber";
import { useLanguage } from "@/context/LanguageContext";

const FEATURES = [
  { title: "Scan", href: "/scan", desc: "Image & video deepfake detection with heatmap." },
  { title: "Trace", href: "/trace", desc: "Reverse search and platform takedown links." },
  { title: "Report", href: "/report", desc: "Branded PDF evidence and filing guide." },
  { title: "Vault", href: "/vault", desc: "AES-encrypted browser-only storage." },
  { title: "Asha", href: "/asha", desc: "Support chat and know-your-rights cards." },
  { title: "Community", href: "/community", desc: "Anonymous solidarity feed." },
];

const STATS = [
  { value: "11", label: "Core features" },
  { value: "3", label: "Detection signals" },
  { value: "8", label: "Languages" },
];

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="relative overflow-hidden">
      <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-10 md:flex-row"
        >
          <div className="relative shrink-0">
            <div className="absolute -inset-4 rounded-3xl bg-pink/30 blur-2xl" aria-hidden />
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

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="grid gap-4 sm:grid-cols-3">
          {STATS.map((s) => (
            <GlassCard key={s.label} className="text-center py-8">
              <p className="font-display text-4xl text-pink">
                <OdometerNumber value={s.value} />
              </p>
              <p className="mt-1 text-sm text-ink/70">{s.label}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="font-display mb-8 text-2xl text-ink md:text-3xl">Everything in one place</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <motion.a
              key={f.href}
              href={f.href}
              whileHover={{ y: -3 }}
              className="block"
            >
              <GlassCard className="h-full">
                <p className="text-xs font-semibold uppercase tracking-wide text-pink">{f.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink/80">{f.desc}</p>
              </GlassCard>
            </motion.a>
          ))}
        </div>
      </section>

      <HowItWorks />
      <Testimonials />
      <CtaStrip />
    </div>
  );
}
