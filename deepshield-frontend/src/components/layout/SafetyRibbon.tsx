"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { SAFETY } from "@/lib/safetyContacts";

export function SafetyRibbon() {
  const { t } = useLanguage();

  return (
    <div
      className="fixed bottom-14 left-0 right-0 z-[48] border-t border-cream-deep/20 bg-secondary shadow-[0_-4px_24px_rgba(43,27,23,0.2)] md:bottom-0"
      role="complementary"
      aria-label={t("safetyRibbonAria")}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-1 px-3 py-2 text-center text-xs text-cream-deep sm:text-sm">
        <span className="ui-nowrap font-semibold tracking-wide">{t("safetyRibbonLabel")}</span>
        <span className="hidden h-3 w-px bg-cream-deep/35 sm:inline" aria-hidden />
        <a
          href={SAFETY.cyberHelplineTel}
          className="ui-nowrap font-display text-base font-semibold text-cream-deep underline-offset-2 hover:underline sm:text-lg"
        >
          {t("safetyRibbonHelpline")} {SAFETY.cyberHelpline}
        </a>
        <span className="hidden h-3 w-px bg-cream-deep/35 sm:inline" aria-hidden />
        <a
          href={SAFETY.portalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ui-nowrap text-cream-deep/95 underline-offset-2 hover:text-cream-deep hover:underline"
        >
          {SAFETY.portalLabel}
        </a>
        <span className="hidden h-3 w-px bg-cream-deep/35 md:inline" aria-hidden />
        <a
          href={SAFETY.ncwHelplineTel}
          className="ui-nowrap hidden text-cream-deep/90 hover:text-cream-deep hover:underline md:inline"
        >
          {t("safetyRibbonNcw")} {SAFETY.ncwHelpline}
        </a>
        <Link
          href="/asha"
          className="ui-nowrap hidden text-cream-deep/90 hover:text-cream-deep hover:underline lg:inline"
        >
          {t("talkToAsha")} →
        </Link>
      </div>
    </div>
  );
}
