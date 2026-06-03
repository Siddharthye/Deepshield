"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { useLanguage } from "@/context/LanguageContext";

const PILLARS = [
  {
    title: "Detect with confidence",
    body: "Deepfakes are no longer rare experiments — they are weapons used to humiliate, extort, and silence. DeepShield combines a production deepfake classifier with browser-side face and compression analysis so you get a number you can understand, not just a black-box label.",
  },
  {
    title: "Document for authorities",
    body: "Courts and cyber cells need more than a screenshot. We help you bundle the scan image, heatmap, risk breakdown, trace log, and plain-language legal summary into one PDF aligned with Indian reporting channels.",
  },
  {
    title: "Recover with dignity",
    body: "Asha is not a generic chatbot. She is scoped to emotional support and rights education — with crisis numbers visible, eight languages, and pre-written law cards so you never have to start from zero.",
  },
];

export function HomeMission() {
  const { t } = useLanguage();

  return (
    <section className="section-pad section-alt-sage mx-auto max-w-6xl px-4">
      <p className="page-badge">{t("missionBadge")}</p>
      <h2 className="font-display max-w-3xl text-2xl leading-snug text-ink md:text-3xl">
        {t("missionTitle")}
      </h2>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink/75 md:text-base">
        {t("missionIntro")}
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {PILLARS.map((p) => (
          <GlassCard key={p.title} className="p-6" tilt>
            <h3 className="font-display text-lg text-ink">{p.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink/75">{p.body}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
