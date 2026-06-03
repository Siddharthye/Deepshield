"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { useLanguage } from "@/context/LanguageContext";
import type { I18nKey } from "@/lib/i18n";

const SIGNALS: { icon: string; titleKey: I18nKey; descKey: I18nKey }[] = [
  { icon: "🧠", titleKey: "heroSignalModelTitle", descKey: "heroSignalModelDesc" },
  { icon: "🙂", titleKey: "heroSignalFaceTitle", descKey: "heroSignalFaceDesc" },
  { icon: "🔬", titleKey: "heroSignalArtifactTitle", descKey: "heroSignalArtifactDesc" },
];

const STEPS: { num: string; key: I18nKey }[] = [
  { num: "1", key: "heroStep1" },
  { num: "2", key: "heroStep2" },
  { num: "3", key: "heroStep3" },
];

export function HeroSignals() {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.4 }}
      className="mt-8 flex flex-1 flex-col gap-5 lg:mt-auto lg:pt-6"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">
          {t("heroSignalsBadge")}
        </p>
        <p className="mt-1 font-display text-lg text-ink">{t("heroSignalsTitle")}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {SIGNALS.map((s) => (
          <GlassCard
            key={s.titleKey}
            className="flex flex-col gap-2 p-4 ring-1 ring-sage/25"
          >
            <span className="text-2xl" aria-hidden>
              {s.icon}
            </span>
            <p className="text-sm font-semibold text-ink">{t(s.titleKey)}</p>
            <p className="text-xs leading-relaxed text-ink-muted">{t(s.descKey)}</p>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
          {STEPS.map((step, i) => (
            <li key={step.key} className="flex items-center gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pink/40 font-display text-sm text-ink">
                {step.num}
              </span>
              <span>{t(step.key)}</span>
              {i < STEPS.length - 1 && (
                <span className="hidden text-ink-subtle sm:inline" aria-hidden>
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
        <Link
          href="/learn"
          className="shrink-0 text-sm font-medium text-accent underline-offset-2 hover:underline"
        >
          {t("heroLearnLink")}
        </Link>
      </GlassCard>

      <p className="rounded-2xl border border-sage/35 bg-cream/60 px-4 py-3 text-xs leading-relaxed text-ink-muted">
        {t("heroPrivacyNote")}
      </p>
    </motion.div>
  );
}
