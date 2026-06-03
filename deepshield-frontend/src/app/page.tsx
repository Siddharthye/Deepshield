"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { ButtonLink } from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";

const FEATURES = [
  {
    title: "Scan",
    href: "/scan",
    desc: "Three-signal deepfake risk score with plain-language explanation.",
  },
  {
    title: "Trace",
    href: "/trace",
    desc: "Find where your image appears and save links for your case.",
  },
  {
    title: "Report",
    href: "/report",
    desc: "Build a legal evidence summary from your latest scan.",
  },
  {
    title: "Vault",
    href: "/vault",
    desc: "Private, browser-only evidence storage with PIN protection.",
  },
  {
    title: "Asha",
    href: "/asha",
    desc: "Emotional support and know-your-rights guidance in one place.",
  },
  {
    title: "Community",
    href: "/community",
    desc: "Anonymous solidarity — stored only on your device.",
  },
];

const STATS = [
  { value: "3", label: "Detection signals" },
  { value: "100%", label: "Browser-first privacy" },
  { value: "8", label: "Languages" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="relative overflow-hidden">
      <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="flex flex-col items-center gap-10 md:flex-row md:items-center"
        >
          <div className="relative shrink-0">
            <div
              className="absolute -inset-4 rounded-3xl bg-rose/25 blur-2xl"
              aria-hidden
            />
            <Image
              src="/images/ds-logo.jpeg"
              alt="DeepShield logo"
              width={160}
              height={160}
              className="relative rounded-3xl object-contain shadow-lg ring-2 ring-blush/60"
              priority
              unoptimized
            />
          </div>
          <div>
            <p className="page-badge">{t("tagline")}</p>
            <h1 className="font-display max-w-3xl text-4xl font-semibold leading-tight text-espresso md:text-5xl lg:text-6xl">
              Your armor against digital violence
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-espresso/80">
              {t("homeHero")}
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <ButtonLink href="/scan" variant="primary">
                {t("scanNow")}
              </ButtonLink>
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
            <GlassCard key={s.label} className="text-center">
              <p className="font-display text-4xl font-semibold text-rose">
                {s.value}
              </p>
              <p className="mt-1 text-sm text-espresso/75">{s.label}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24">
        <h2 className="font-display mb-8 text-2xl font-semibold text-espresso md:text-3xl">
          What DeepShield does
        </h2>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map((f) => (
            <motion.div key={f.title} variants={item}>
              <Link href={f.href} className="block h-full">
                <GlassCard className="h-full transition hover:-translate-y-0.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-rose">
                    {f.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-espresso/85">
                    {f.desc}
                  </p>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
