"use client";

import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { HeroVisualPanel } from "@/components/home/HeroVisualPanel";
import { useLanguage } from "@/context/LanguageContext";
import type { I18nKey } from "@/lib/i18n";

const PRINCIPLES: { titleKey: I18nKey; bodyKey: I18nKey }[] = [
  { titleKey: "heroPrinciple1Title", bodyKey: "heroPrinciple1Body" },
  { titleKey: "heroPrinciple2Title", bodyKey: "heroPrinciple2Body" },
  { titleKey: "heroPrinciple3Title", bodyKey: "heroPrinciple3Body" },
];

const TRUST_KEYS = ["trust1", "trust2", "trust3"] as const;

const STORY_KEYS = ["heroStory1", "heroStory2", "heroStory3"] as const;

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="hero-apple relative mx-auto max-w-6xl px-5 pb-24 pt-10 md:px-8 md:pb-32 md:pt-14 lg:pt-20">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[min(85vh,640px)] bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(242,232,213,0.55),transparent_70%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-0 top-24 hidden h-72 w-72 rounded-full bg-pink/20 blur-3xl lg:block"
        aria-hidden
      />

      <div className="relative grid items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(300px,0.95fr)] lg:gap-12 xl:gap-16">
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="text-center lg:text-left"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ink-subtle">
            {t("tagline")}
          </p>

          <h1 className="font-display mt-5 text-[2.35rem] font-semibold leading-[1.06] tracking-[-0.03em] text-ink sm:text-5xl md:text-[3.5rem] md:leading-[1.05] lg:text-[3.75rem]">
            {t("heroTitle")}
          </h1>

          <p className="mt-5 max-w-xl text-lg font-normal leading-snug tracking-tight text-ink-muted md:text-xl md:leading-snug lg:mx-0 lg:max-w-none">
            {t("heroLead")}
          </p>

          <div className="mt-8 space-y-5 text-left text-[0.9375rem] leading-[1.7] text-ink-muted md:text-base md:leading-[1.75]">
            {STORY_KEYS.map((key) => (
              <p key={key}>{t(key)}</p>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <ButtonLink href="/scan" variant="primary" className="min-w-[11rem] px-7 py-3 text-[0.9375rem]">
              {t("heroCtaScan")}
            </ButtonLink>
            <ButtonLink href="/asha" variant="secondary" className="min-w-[11rem] px-7 py-3 text-[0.9375rem]">
              {t("heroCtaAsha")}
            </ButtonLink>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 lg:justify-start">
            {TRUST_KEYS.map((key) => (
              <span
                key={key}
                className="rounded-full bg-cream-deep/80 px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-ink-muted ring-1 ring-secondary/12"
              >
                {t(key)}
              </span>
            ))}
          </div>
        </motion.div>

        <HeroVisualPanel logoAlt={t("brandAlt")} caption={t("heroVisualCaption")} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative mt-20 md:mt-28"
      >
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-subtle">
          {t("heroPrinciplesLabel")}
        </p>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-ink-muted md:text-[0.9375rem]">
          {t("heroPrinciplesIntro")}
        </p>

        <ul className="mt-10 grid gap-5 md:grid-cols-3 md:gap-6">
          {PRINCIPLES.map(({ titleKey, bodyKey }, i) => (
            <motion.li
              key={titleKey}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 + i * 0.08, duration: 0.55 }}
              className="hero-apple-card rounded-3xl bg-cream-deep/75 px-6 py-7 text-center ring-1 ring-secondary/10 md:px-7 md:py-8 md:text-left"
            >
              <h2 className="text-[15px] font-semibold tracking-tight text-ink">
                {t(titleKey)}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{t(bodyKey)}</p>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="relative mt-16 text-center font-display text-lg tracking-tight text-ink md:mt-20 md:text-xl"
      >
        {t("heroClosing")}
      </motion.p>

      <p className="relative mt-4 text-center text-xs text-ink-subtle">{t("heroScrollCue")}</p>
    </section>
  );
}
