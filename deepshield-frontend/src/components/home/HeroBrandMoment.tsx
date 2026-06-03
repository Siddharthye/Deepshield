"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export function HeroBrandMoment() {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.08 }}
      className="relative mx-auto w-full max-w-[380px] lg:max-w-none lg:justify-self-end"
      aria-hidden={false}
    >
      <div
        className="pointer-events-none absolute -right-6 top-8 h-48 w-48 rounded-full bg-[var(--color-berry)]/45 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-4 bottom-16 h-36 w-36 rounded-full bg-[var(--color-meadow)]/30 blur-3xl"
        aria-hidden
      />

      <div className="relative overflow-hidden rounded-[28px] bg-white/55 p-5 shadow-[0_24px_64px_rgba(87,85,39,0.1)] ring-1 ring-black/[0.06] backdrop-blur-2xl sm:p-6">
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[22px] bg-gradient-to-br from-[var(--color-fog)] via-white to-[color-mix(in_srgb,var(--color-berry)_35%,white)]">
          <div
            className="absolute inset-0 opacity-50 [background-image:radial-gradient(circle_at_50%_42%,rgba(185,125,123,0.22),transparent_58%)]"
            aria-hidden
          />
          <div
            className="absolute inset-6 rounded-full border border-[var(--color-berry)]/40"
            aria-hidden
          />
          <div
            className="absolute inset-12 rounded-full border border-[var(--color-meadow)]/25"
            aria-hidden
          />
          <Image
            src="/images/ds-logo.jpeg"
            alt=""
            width={200}
            height={200}
            className="relative z-10 h-[min(52%,200px)] w-[min(52%,200px)] rounded-[20px] object-contain shadow-[var(--shadow-soft)] ring-1 ring-black/5"
            priority
            unoptimized
          />
        </div>

        <div className="mt-5 rounded-2xl bg-[var(--color-fog)]/55 px-4 py-4 ring-1 ring-black/[0.05]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-subtle">
            {t("heroMomentBadge")}
          </p>
          <p className="mt-2 text-[0.9375rem] font-medium leading-snug text-ink">
            {t("heroMomentQuote")}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-ink-muted">{t("heroMomentCaption")}</p>
        </div>
      </div>

      <div className="absolute -bottom-3 -left-2 hidden rounded-2xl bg-white/92 px-4 py-3 shadow-lg ring-1 ring-black/5 backdrop-blur-md sm:block">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-subtle">
          {t("heroMomentFootnote")}
        </p>
        <p className="mt-0.5 text-sm font-medium text-ink">{t("trust2")}</p>
      </div>
    </motion.div>
  );
}
