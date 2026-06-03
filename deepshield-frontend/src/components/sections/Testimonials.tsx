"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { useLanguage } from "@/context/LanguageContext";
import type { I18nKey } from "@/lib/i18n";

const QUOTE_KEYS = [
  { text: "quote1Text" as I18nKey, label: "quote1Label" as I18nKey },
  { text: "quote2Text" as I18nKey, label: "quote2Label" as I18nKey },
  { text: "quote3Text" as I18nKey, label: "quote3Label" as I18nKey },
];

const PRINCIPLE_KEYS = [
  { title: "principle1Title" as I18nKey, desc: "principle1Desc" as I18nKey },
  { title: "principle2Title" as I18nKey, desc: "principle2Desc" as I18nKey },
  { title: "principle3Title" as I18nKey, desc: "principle3Desc" as I18nKey },
];

export function Testimonials() {
  const { t } = useLanguage();

  return (
    <section className="section-pad section-alt-blue mx-auto max-w-6xl px-4">
      <p className="page-badge">{t("voicesBadge")}</p>
      <h2 className="font-display text-2xl text-ink md:text-3xl">{t("voicesTitle")}</h2>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {PRINCIPLE_KEYS.map((p) => (
          <GlassCard key={p.title} className="p-5 text-center md:text-left">
            <p className="font-display text-lg text-ink">{t(p.title)}</p>
            <p className="mt-2 text-xs leading-relaxed text-ink/75">{t(p.desc)}</p>
          </GlassCard>
        ))}
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {QUOTE_KEYS.map((q) => (
          <GlassCard key={q.label}>
            <p className="text-sm leading-relaxed text-ink/85">&ldquo;{t(q.text)}&rdquo;</p>
            <p className="mt-4 text-xs font-medium text-pink">{t(q.label)}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
