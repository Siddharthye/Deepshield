"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { useLanguage } from "@/context/LanguageContext";

export function HomeCrisisStrip() {
  const { t } = useLanguage();

  const HELPLINES = [
    { name: t("helplineCyber"), number: "1930", note: t("helplineCyberNote") },
    { name: t("helplineNcw"), number: "181", note: t("helplineNcwNote") },
    { name: t("helplineIcall"), number: "9152987821", note: t("helplineIcallNote") },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-6">
      <GlassCard className="glass-card-tint-blue border-blue/30 p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink/70">
          {t("crisisBadge")}
        </p>
        <p className="mt-1 text-sm text-ink/80">{t("crisisIntro")}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {HELPLINES.map((h) => (
            <div
              key={h.number}
              className="rounded-2xl bg-cream/80 px-4 py-3 ring-1 ring-sage/35"
            >
              <p className="text-xs font-medium text-ink/65">{h.name}</p>
              <p className="font-display text-xl text-ink">{h.number}</p>
              <p className="text-[11px] text-ink/55">{h.note}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </section>
  );
}
