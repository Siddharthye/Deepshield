"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { SAFETY } from "@/lib/safetyContacts";

export function SafetyRibbon({ variant = "app" }: { variant?: "app" | "login" }) {
  const { t } = useLanguage();
  const bottomClass =
    variant === "login" ? "bottom-0" : "bottom-12 md:bottom-0";

  return (
    <div
      className={`fixed left-0 right-0 z-[48] border-t border-cream-deep/15 bg-secondary/98 ${bottomClass}`}
      role="complementary"
      aria-label={t("safetyRibbonAria")}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-2.5 gap-y-0 px-2 py-1 text-[10px] leading-tight text-cream-deep sm:gap-x-3 sm:text-[11px]">
        <span className="ui-nowrap font-medium">{t("safetyRibbonLabel")}</span>
        <span className="hidden h-2.5 w-px bg-cream-deep/30 sm:inline" aria-hidden />
        <a
          href={SAFETY.cyberHelplineTel}
          className="ui-nowrap font-semibold text-cream-deep underline-offset-2 hover:underline"
        >
          {SAFETY.cyberHelpline}
        </a>
        <span className="hidden h-2.5 w-px bg-cream-deep/30 sm:inline" aria-hidden />
        <a
          href={SAFETY.portalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ui-nowrap text-cream-deep/95 underline-offset-2 hover:text-cream-deep hover:underline"
        >
          {SAFETY.portalLabel}
        </a>
        {variant === "app" && (
          <>
            <span className="hidden h-2.5 w-px bg-cream-deep/30 md:inline" aria-hidden />
            <a
              href={SAFETY.ncwHelplineTel}
              className="ui-nowrap hidden text-cream-deep/90 hover:text-cream-deep hover:underline md:inline"
            >
              NCW {SAFETY.ncwHelpline}
            </a>
            <span className="hidden h-2.5 w-px bg-cream-deep/30 lg:inline" aria-hidden />
            <Link
              href="/asha"
              className="ui-nowrap hidden text-cream-deep/90 hover:text-cream-deep hover:underline lg:inline"
            >
              {t("talkToAsha")} →
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
