"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { AnimatedShield } from "@/components/ui/AnimatedShield";
import { TypewriterSubtitle } from "@/components/home/TypewriterSubtitle";
import { useLanguage } from "@/context/LanguageContext";
import type { I18nKey } from "@/lib/i18n";

const INFO: { titleKey: I18nKey; bodyKey: I18nKey }[] = [
  { titleKey: "heroInfoPrivateTitle", bodyKey: "heroInfoPrivateBody" },
  { titleKey: "heroInfoRemindTitle", bodyKey: "heroInfoRemindBody" },
  { titleKey: "heroInfoLawTitle", bodyKey: "heroInfoLawBody" },
  { titleKey: "heroInfoDocumentTitle", bodyKey: "heroInfoDocumentBody" },
  { titleKey: "heroInfoPaceTitle", bodyKey: "heroInfoPaceBody" },
];

const TRUST_KEYS = ["trust1", "trust2", "trust3"] as const;

export function HeroSection() {
  const { t } = useLanguage();

  const helplines = [
    { name: t("helplineCyber"), number: "1930" },
    { name: t("helplineNcw"), number: "181" },
    { name: t("helplineIcall"), number: "9152987821" },
  ];

  return (
    <section className="hero-apple relative mx-auto max-w-4xl px-6 pb-20 pt-12 md:pb-28 md:pt-16 lg:pt-20">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[min(70vh,520px)] bg-gradient-to-b from-parchment/30 via-transparent to-transparent"
        aria-hidden
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col items-center text-center"
      >
        <div className="relative mb-8">
          <AnimatedShield className="pointer-events-none absolute -right-2 -top-2 h-8 w-8 opacity-50" />
          <Image
            src="/images/ds-logo.jpeg"
            alt={t("brandAlt")}
            width={72}
            height={72}
            className="relative h-[4.25rem] w-[4.25rem] rounded-[1.25rem] object-contain shadow-sm ring-1 ring-secondary/15 md:h-[4.75rem] md:w-[4.75rem]"
            priority
            unoptimized
          />
        </div>

        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-subtle">
          {t("tagline")}
        </p>

        <h1 className="font-display mt-6 max-w-[16ch] text-[2.125rem] font-semibold leading-[1.08] tracking-tight text-ink sm:max-w-none sm:text-5xl md:text-[3.25rem]">
          {t("heroTitle")}
        </h1>

        <div className="mt-5 w-full max-w-xl">
          <TypewriterSubtitle phrases={["typewriter4", "typewriter1"]} />
        </div>

        <div className="mt-8 max-w-2xl space-y-4 text-base font-normal leading-relaxed text-ink-muted md:text-lg md:leading-relaxed">
          <p>{t("homeHero")}</p>
          <p className="text-[0.9375rem] md:text-base">{t("heroExtra")}</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative mt-16 md:mt-20"
      >
        <ul className="divide-y divide-secondary/10 border-y border-secondary/10">
          {INFO.map(({ titleKey, bodyKey }) => (
            <li key={titleKey} className="px-1 py-8 text-center md:py-9">
              <h2 className="text-[13px] font-semibold tracking-wide text-ink">
                {t(titleKey)}
              </h2>
              <p className="mx-auto mt-2.5 max-w-xl text-sm leading-relaxed text-ink-muted">
                {t(bodyKey)}
              </p>
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="relative mt-14 text-center md:mt-16"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-subtle">
          {t("heroHelplineBadge")}
        </p>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ink-muted">
          {t("heroHelplineIntro")}
        </p>
        <div className="mt-8 flex flex-wrap items-start justify-center gap-x-12 gap-y-6 md:gap-x-16">
          {helplines.map((line) => (
            <div key={line.number} className="min-w-[7rem]">
              <p className="font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                {line.number}
              </p>
              <p className="mt-1 text-xs text-ink-muted">{line.name}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="relative mt-14 space-y-4 text-center md:mt-16">
        <p className="text-xs text-ink-subtle">
          {TRUST_KEYS.map((key, i) => (
            <span key={key}>
              {i > 0 && <span className="mx-2 text-secondary/25">·</span>}
              {t(key)}
            </span>
          ))}
        </p>
        <p className="font-display text-lg tracking-tight text-ink md:text-xl">
          {t("footerLine1")}
        </p>
        <p className="mx-auto max-w-lg text-sm leading-relaxed text-ink-muted">
          {t("heroClosing")}
        </p>
        <p className="text-xs text-ink-subtle">{t("footerLine2")}</p>
      </div>
    </section>
  );
}
