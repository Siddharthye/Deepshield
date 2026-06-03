"use client";

import { ButtonLink } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { useLanguage } from "@/context/LanguageContext";

export function CtaStrip() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto max-w-6xl px-4 pb-20">
      <GlassCard className="glass-card-tint-sage flex flex-col items-center gap-6 py-12 text-center md:flex-row md:justify-between md:text-left">
        <div className="max-w-lg">
          <h2 className="font-display text-2xl text-ink">{t("ctaTitle")}</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">{t("ctaBody")}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <ButtonLink href="/scan" variant="primary">
            {t("ctaScan")}
          </ButtonLink>
          <ButtonLink href="/asha" variant="secondary">
            {t("talkToAsha")}
          </ButtonLink>
          <ButtonLink href="/report" variant="ghost">
            {t("ctaReport")}
          </ButtonLink>
        </div>
      </GlassCard>
    </section>
  );
}
