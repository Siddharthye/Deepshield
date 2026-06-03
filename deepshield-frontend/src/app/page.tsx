"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { useLanguage } from "@/context/LanguageContext";

const FEATURES = [
  "Image deepfake detection (3-signal risk score)",
  "Reverse image trace & platform report links",
  "Legal evidence report builder",
  "Encrypted evidence vault (browser-only)",
  "Asha — support & legal rights companion",
  "Anonymous community shield",
  "Multilingual UI (8 languages)",
];

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-rose/25 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-sage/20 blur-3xl"
        aria-hidden
      />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-start gap-8 md:flex-row md:items-center"
        >
          <Image
            src="/images/ds-logo.jpeg"
            alt="DeepShield logo"
            width={140}
            height={140}
            className="rounded-2xl object-contain shadow-sm"
            priority
            unoptimized
          />
          <div>
            <p className="mb-2 text-sm font-medium text-rose">{t("tagline")}</p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-espresso md:text-5xl">
              Your armor against digital violence
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-espresso/80">{t("homeHero")}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/scan"
                className="rounded-full bg-rose px-6 py-3 text-sm font-medium text-espresso shadow-md transition hover:bg-blush"
              >
                {t("scanNow")}
              </Link>
              <Link
                href="/asha"
                className="rounded-full border border-sage/50 bg-blush/60 px-6 py-3 text-sm font-medium text-espresso transition hover:bg-blush"
              >
                {t("talkToAsha")}
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="mb-6 text-2xl font-semibold text-espresso">
          What DeepShield does
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <GlassCard key={f}>
              <p className="text-sm leading-relaxed text-espresso/90">{f}</p>
            </GlassCard>
          ))}
        </div>
      </section>
    </div>
  );
}
