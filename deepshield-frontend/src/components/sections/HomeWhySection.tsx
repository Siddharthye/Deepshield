"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { useLanguage } from "@/context/LanguageContext";
import type { I18nKey } from "@/lib/i18n";

const FACT_KEYS = [
  { title: "whyFact1Title" as I18nKey, body: "whyFact1Body" as I18nKey },
  { title: "whyFact2Title" as I18nKey, body: "whyFact2Body" as I18nKey },
  { title: "whyFact3Title" as I18nKey, body: "whyFact3Body" as I18nKey },
];

const LAWS = ["IT Act §66E", "§67", "§67A", "IPC §354C", "POCSO (minors)"];

export function HomeWhySection() {
  const { t } = useLanguage();

  return (
    <section className="section-pad mx-auto max-w-6xl px-4">
      <p className="page-badge">{t("whyBadge")}</p>
      <h2 className="font-display text-2xl text-ink md:text-3xl">{t("whyTitle")}</h2>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {FACT_KEYS.map((f) => (
          <GlassCard key={f.title} className="p-6" tilt>
            <h3 className="font-display text-lg text-ink">{t(f.title)}</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink/75">{t(f.body)}</p>
          </GlassCard>
        ))}
      </div>
      <GlassCard className="mt-6 p-6">
        <p className="text-sm font-medium text-ink">{t("whyLawsTitle")}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {LAWS.map((law) => (
            <span
              key={law}
              className="rounded-full bg-blue/35 px-3 py-1 text-xs font-medium text-ink/85"
            >
              {law}
            </span>
          ))}
        </div>
        <p className="mt-4 text-xs text-ink/60">{t("whyLawDisclaimer")}</p>
      </GlassCard>
    </section>
  );
}
