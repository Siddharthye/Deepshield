"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { useLanguage } from "@/context/LanguageContext";
const STAT_KEYS = [
  { val: "problemStat1Val", lbl: "problemStat1Lbl", txt: "problemStat1Txt" },
  { val: "problemStat2Val", lbl: "problemStat2Lbl", txt: "problemStat2Txt" },
  { val: "problemStat3Val", lbl: "problemStat3Lbl", txt: "problemStat3Txt" },
] as const;

const POINT_KEYS = [
  "problemPoint1",
  "problemPoint2",
  "problemPoint3",
  "problemPoint4",
] as const;

const WHAT_KEYS = ["problemWhat1", "problemWhat2", "problemWhat3"] as const;

export function HomeProblem() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <GlassCard className="bg-gradient-to-br from-blue/35 via-cream/40 to-sage/30 p-8 md:p-12">
        <p className="page-badge">{t("problemBadge")}</p>
        <h2 className="font-display max-w-2xl text-2xl text-ink md:text-3xl">{t("problemTitle")}</h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-muted md:text-base">
          {t("problemBody")}
        </p>

        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
          {POINT_KEYS.map((key) => (
            <li
              key={key}
              className="flex gap-2 rounded-xl bg-cream/65 px-3 py-2.5 text-sm text-ink-muted ring-1 ring-white/50"
            >
              <span className="shrink-0 text-sage">✓</span>
              {t(key)}
            </li>
          ))}
        </ul>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {STAT_KEYS.map(({ val, lbl, txt }) => (
            <div
              key={val}
              className="rounded-2xl bg-cream/75 p-6 ring-1 ring-sage/35 shadow-sm"
            >
              <p className="font-display text-4xl text-ink">{t(val)}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink-subtle">
                {t(lbl)}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{t(txt)}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-sage/40 bg-blue/20 p-6 md:p-8">
          <p className="font-display text-lg text-ink">{t("problemWhatTitle")}</p>
          <ul className="mt-4 space-y-3">
            {WHAT_KEYS.map((key) => (
              <li key={key} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage/50 text-xs font-bold text-ink">
                  {WHAT_KEYS.indexOf(key) + 1}
                </span>
                {t(key)}
              </li>
            ))}
          </ul>
        </div>
      </GlassCard>
    </section>
  );
}
