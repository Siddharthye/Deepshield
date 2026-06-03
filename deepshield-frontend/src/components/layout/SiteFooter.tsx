"use client";

import { LanguageMenu } from "@/components/layout/LanguageMenu";
import { useLanguage } from "@/context/LanguageContext";

export function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="site-footer relative z-10 py-8 text-center">
      <p className="text-sm font-medium text-ink-muted">{t("footerLine1")}</p>
      <p className="mt-2 text-xs text-ink-subtle">{t("footerLine2")}</p>
      <div className="mt-4 flex justify-center md:hidden">
        <LanguageMenu />
      </div>
    </footer>
  );
}
