"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { useLanguage } from "@/context/LanguageContext";

export function HeroHelplines() {
  const { t } = useLanguage();

  const lines = [
    { name: t("helplineCyber"), number: "1930", note: t("helplineCyberNote") },
    { name: t("helplineNcw"), number: "181", note: t("helplineNcwNote") },
    { name: t("helplineIcall"), number: "9152987821", note: t("helplineIcallNote") },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.22, duration: 0.4 }}
    >
      <GlassCard className="glass-card-tint-blue p-5 md:p-6" tilt={false}>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
          {t("heroHelplineBadge")}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-ink-muted">{t("heroHelplineIntro")}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {lines.map((line) => (
            <div
              key={line.number}
              className="rounded-xl bg-cream/80 px-4 py-3 ring-1 ring-sage/30"
            >
              <p className="text-xs font-medium text-ink-muted">{line.name}</p>
              <p className="font-display mt-0.5 text-xl text-ink">{line.number}</p>
              <p className="text-[11px] text-ink-subtle">{line.note}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}
