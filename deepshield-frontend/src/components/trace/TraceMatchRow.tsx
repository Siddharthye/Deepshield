"use client";

import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { useLanguage } from "@/context/LanguageContext";
import { traceThumbnailProxySrc } from "@/lib/traceImageProxy";
import type { TraceHit } from "@/lib/traceStorage";

type Props = {
  hit: TraceHit;
  queryPreview?: string | null;
};

export function TraceMatchRow({ hit, queryPreview }: Props) {
  const { t } = useLanguage();
  const thumbSrc = traceThumbnailProxySrc(hit.thumbnailUrl);

  return (
    <GlassCard className="space-y-3">
      <p className="text-xs font-medium text-accent">{hit.platform}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {queryPreview && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-ink-subtle">{t("traceYourImage")}</p>
            <div className="relative aspect-video overflow-hidden rounded-lg border border-secondary/15 bg-cream-tan/40">
              <Image
                src={queryPreview}
                alt={t("traceYourImage")}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
        )}
        <div className="space-y-1">
          <p className="text-xs font-medium text-ink-subtle">{t("traceMatchFound")}</p>
          <div className="relative aspect-video overflow-hidden rounded-lg border border-secondary/15 bg-cream-tan/40">
            {thumbSrc ? (
              <Image
                src={thumbSrc}
                alt={hit.title}
                fill
                className="object-contain"
                unoptimized
              />
            ) : (
              <div className="flex h-full min-h-[120px] items-center justify-center px-3 text-center text-xs text-ink-muted">
                {t("traceNoThumbnail")}
              </div>
            )}
          </div>
        </div>
      </div>
      <p className="font-medium text-ink">{hit.title}</p>
      <a
        href={hit.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block truncate text-sm text-link underline"
      >
        {hit.url}
      </a>
      <p className="text-xs text-ink-subtle">
        {t("traceFirstSeen")} {hit.firstSeen}
      </p>
    </GlassCard>
  );
}
