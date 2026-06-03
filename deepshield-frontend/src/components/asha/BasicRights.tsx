"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Tooltip } from "@/components/ui/Tooltip";
import { useLanguage } from "@/context/LanguageContext";
import type { I18nKey } from "@/lib/i18n";

export const LAW_CARD_KEYS = [
  { title: "law1Title", subtitle: "law1Subtitle", tip: "law1Tip", body: "law1Body" },
  { title: "law2Title", subtitle: "law2Subtitle", tip: "law2Tip", body: "law2Body" },
  { title: "law3Title", subtitle: "law3Subtitle", tip: "law3Tip", body: "law3Body" },
  { title: "law4Title", subtitle: "law4Subtitle", tip: "law4Tip", body: "law4Body" },
  { title: "law5Title", subtitle: "law5Subtitle", tip: "law5Tip", body: "law5Body" },
] as const;

export const RIGHTS_PROMPT_KEYS = [
  "rightsPrompt1",
  "rightsPrompt2",
  "rightsPrompt3",
  "rightsPrompt4",
] as const;

/** @deprecated use RIGHTS_PROMPT_KEYS with t() */
export const RIGHTS_QUICK_PROMPTS = RIGHTS_PROMPT_KEYS;

export function BasicRights() {
  const { t } = useLanguage();

  return (
    <section aria-labelledby="basic-rights-heading">
      <h2
        id="basic-rights-heading"
        className="font-display mb-4 text-2xl font-semibold text-ink"
      >
        {t("rightsHeading")}
      </h2>
      <p className="mb-6 text-sm text-ink-muted">{t("rightsIntro")}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {LAW_CARD_KEYS.map((law) => (
          <GlassCard key={law.title}>
            <p className="text-xs font-medium uppercase tracking-wide text-accent">
              {t(law.subtitle as I18nKey)}
            </p>
            <h3 className="mt-1 font-semibold text-ink">
              <Tooltip label={t(law.tip as I18nKey)} learnMoreHref="/asha">
                {t(law.title as I18nKey)}
              </Tooltip>
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              {t(law.body as I18nKey)}
            </p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
