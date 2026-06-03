"use client";

import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { useLanguage } from "@/context/LanguageContext";
import { LEARN_IMAGE_PAIRS } from "@/lib/learnImagePairs";

export function LearnImagePairs() {
  const { t } = useLanguage();

  return (
    <section id="examples" className="mb-10">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">
        {t("learnPairsBadge")}
      </p>
      <h2 className="font-display mt-1 text-2xl text-ink md:text-3xl">
        {t("learnPairsTitle")}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
        {t("learnPairsIntro")}
      </p>
      <p className="mt-2 text-xs text-ink-subtle">{t("learnPairsDisclaimer")}</p>

      <div className="mt-6 space-y-8">
        {LEARN_IMAGE_PAIRS.map((pair, index) => (
          <GlassCard key={pair.id} className="overflow-hidden" tilt={false}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                {t("learnPairExample").replace("{n}", String(index + 1))}
              </span>
              <span className="text-xs text-ink-muted">{t(pair.signKey)}</span>
            </div>
            <h3 className="font-display mt-3 text-xl text-ink">{t(pair.titleKey)}</h3>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <figure className="overflow-hidden rounded-xl border border-sage/35 bg-sage/10">
                <div className="relative aspect-[4/5] w-full bg-cream-tan/50">
                  <Image
                    src={pair.authenticSrc}
                    alt={t(pair.authenticCaptionKey)}
                    fill
                    sizes="(max-width: 640px) 100vw, 320px"
                    className="object-cover"
                  />
                </div>
                <figcaption className="border-t border-sage/25 px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-sage">
                    {t("learnAuthenticBadge")}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    {t(pair.authenticCaptionKey)}
                  </p>
                </figcaption>
              </figure>

              <figure className="overflow-hidden rounded-xl border border-secondary/35 bg-peach/20">
                <div className="relative aspect-[4/5] w-full bg-cream-tan/50">
                  <Image
                    src={pair.compareSrc}
                    alt={t(pair.compareCaptionKey)}
                    fill
                    sizes="(max-width: 640px) 100vw, 320px"
                    className="object-cover"
                  />
                </div>
                <figcaption className="border-t border-secondary/25 px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-accent">
                    {t("learnScrutinizeBadge")}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    {t(pair.compareCaptionKey)}
                  </p>
                </figcaption>
              </figure>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-ink-muted">{t(pair.bodyKey)}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
