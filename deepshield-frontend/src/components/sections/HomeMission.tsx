"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { useLanguage } from "@/context/LanguageContext";
import type { I18nKey } from "@/lib/i18n";

const PILLAR_KEYS = [
  { title: "missionPillar1Title" as I18nKey, body: "missionPillar1Body" as I18nKey },
  { title: "missionPillar2Title" as I18nKey, body: "missionPillar2Body" as I18nKey },
  { title: "missionPillar3Title" as I18nKey, body: "missionPillar3Body" as I18nKey },
];

export function HomeMission() {
  const { t } = useLanguage();

  return (
    <section className="section-pad section-alt-sage mx-auto max-w-6xl px-4">
      <p className="page-badge">{t("missionBadge")}</p>
      <h2 className="font-display max-w-3xl text-2xl leading-snug text-ink md:text-3xl">
        {t("missionTitle")}
      </h2>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-muted md:text-base">
        {t("missionIntro")}
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {PILLAR_KEYS.map((p) => (
          <GlassCard key={p.title} className="p-6" tilt>
            <h3 className="font-display text-lg text-ink">{t(p.title)}</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">{t(p.body)}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
