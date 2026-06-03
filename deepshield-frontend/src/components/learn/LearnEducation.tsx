"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { useLanguage } from "@/context/LanguageContext";
import type { I18nKey } from "@/lib/i18n";

type Section = {
  id: string;
  titleKey: I18nKey;
  bodyKey: I18nKey;
  signKeys?: I18nKey[];
  timeline?: { titleKey: I18nKey; bodyKey: I18nKey }[];
};

const SECTIONS: Section[] = [
  {
    id: "how",
    titleKey: "learnCard1Title",
    bodyKey: "learnCard1Body",
  },
  {
    id: "signs",
    titleKey: "learnCard2Title",
    bodyKey: "learnCard2Intro",
    signKeys: [
      "learnSign1",
      "learnSign2",
      "learnSign3",
      "learnSign4",
      "learnSign5",
    ],
  },
  {
    id: "hours",
    titleKey: "learnCard3Title",
    bodyKey: "learnCard3Intro",
    timeline: [
      { titleKey: "learnTimeline1Title", bodyKey: "learnTimeline1Body" },
      { titleKey: "learnTimeline2Title", bodyKey: "learnTimeline2Body" },
      { titleKey: "learnTimeline3Title", bodyKey: "learnTimeline3Body" },
      { titleKey: "learnTimeline4Title", bodyKey: "learnTimeline4Body" },
    ],
  },
];

const MYTHS: { qKey: I18nKey; aKey: I18nKey }[] = [
  { qKey: "learnMyth1Q", aKey: "learnMyth1A" },
  { qKey: "learnMyth2Q", aKey: "learnMyth2A" },
  { qKey: "learnMyth3Q", aKey: "learnMyth3A" },
];

export function LearnEducation() {
  const { t } = useLanguage();
  const [openId, setOpenId] = useState<string>("how");

  return (
    <>
      <section id="guides">
        <h2 className="font-display mb-2 text-2xl text-ink">{t("learnEducationTitle")}</h2>
        <p className="mb-4 max-w-2xl text-sm text-ink-muted">{t("learnEducationIntro")}</p>

        <div className="space-y-3">
          {SECTIONS.map((section) => {
            const open = openId === section.id;
            return (
              <GlassCard key={section.id} className="!p-0 overflow-hidden" tilt={false}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                  onClick={() => setOpenId(open ? "" : section.id)}
                  aria-expanded={open}
                >
                  <h3 className="font-display text-lg text-ink">{t(section.titleKey)}</h3>
                  <span className="shrink-0 text-accent text-lg" aria-hidden>
                    {open ? "−" : "+"}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-secondary/15 px-5 pb-5 pt-2">
                        <p className="text-sm leading-relaxed text-ink-muted">
                          {t(section.bodyKey)}
                        </p>
                        {section.signKeys && (
                          <ul className="mt-4 space-y-2">
                            {section.signKeys.map((key) => (
                              <li
                                key={key}
                                className="flex gap-3 rounded-lg bg-cream-tan/50 px-3 py-2 text-sm text-ink"
                              >
                                <span className="text-accent" aria-hidden>
                                  ✓
                                </span>
                                {t(key)}
                              </li>
                            ))}
                          </ul>
                        )}
                        {section.timeline && (
                          <ol className="mt-4 space-y-4 border-l-2 border-accent/40 pl-4">
                            {section.timeline.map((step, i) => (
                              <li key={step.titleKey} className="relative">
                                <span
                                  className="absolute -left-[1.35rem] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-cream-deep"
                                  aria-hidden
                                >
                                  {i + 1}
                                </span>
                                <p className="font-medium text-ink">{t(step.titleKey)}</p>
                                <p className="mt-1 text-sm text-ink-muted">
                                  {t(step.bodyKey)}
                                </p>
                              </li>
                            ))}
                          </ol>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            );
          })}
        </div>

        <GlassCard className="mt-6" tilt={false}>
          <h3 className="font-display text-lg text-ink">{t("learnMythsTitle")}</h3>
          <p className="mt-1 text-sm text-ink-muted">{t("learnMythsIntro")}</p>
          <dl className="mt-4 space-y-4">
            {MYTHS.map((myth) => (
              <div
                key={myth.qKey}
                className="rounded-xl border border-secondary/15 bg-cream-tan/40 px-4 py-3"
              >
                <dt className="text-sm font-semibold text-ink">{t(myth.qKey)}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink-muted">{t(myth.aKey)}</dd>
              </div>
            ))}
          </dl>
        </GlassCard>
      </section>
    </>
  );
}
