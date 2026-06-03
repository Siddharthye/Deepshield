"use client";

import { useState } from "react";
import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { tryAddToVault } from "@/lib/vaultHelpers";
import { TraceResults } from "@/components/trace/TraceResults";
import { useLanguage } from "@/context/LanguageContext";
import type { I18nKey } from "@/lib/i18n";

const REPORT_LINKS: { nameKey: I18nKey; url: string }[] = [
  { nameKey: "tracePlatformMeta", url: "https://www.facebook.com/help/contact/571927962448785" },
  { nameKey: "tracePlatformX", url: "https://help.twitter.com/forms/privacy" },
  { nameKey: "tracePlatformTelegram", url: "https://telegram.org/support" },
];

export default function TracePage() {
  const { t } = useLanguage();
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [vaultSaved, setVaultSaved] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  function onImage(file: File) {
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <PageHeader
        badge={t("tracePageBadge")}
        title={t("tracePageTitle")}
        subtitle={t("tracePageSubtitle")}
      />

      <GlassCard className="mb-6 space-y-4">
        <label className="upload-zone py-8">
          <span className="text-sm font-medium text-ink">{t("traceUploadLabel")}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onImage(f);
            }}
          />
        </label>
        {preview && (
          <div className="relative mx-auto aspect-video max-h-48 w-full overflow-hidden rounded-xl">
            <Image
              src={preview}
              alt={t("tracePreviewAlt")}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        )}
        {preview && <p className="text-center text-xs text-ink/55">{t("traceLensHint")}</p>}
        <a
          href="https://lens.google.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-2xl bg-gradient-to-r from-pink/55 to-peach/60 py-3.5 text-center text-sm font-medium text-ink"
        >
          {t("traceOpenLens")}
        </a>
        <a
          href="https://tineye.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-2xl border border-sage/50 bg-blue/45 py-3.5 text-center text-sm font-medium text-ink"
        >
          {t("traceOpenTinEye")}
        </a>
        <textarea
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
            setSaved(false);
          }}
          placeholder={t("traceUrlPlaceholder")}
          rows={5}
          className="input-field"
        />
        <Button
          variant="dark"
          className="w-full"
          onClick={() => {
            if (!note.trim()) return;
            const existing = JSON.parse(
              localStorage.getItem("deepshield_trace_urls") || "[]",
            ) as string[];
            const added = note.split("\n").map((s) => s.trim()).filter(Boolean);
            const payload = added.join("\n");
            localStorage.setItem(
              "deepshield_trace_urls",
              JSON.stringify([...existing, ...added]),
            );
            setNote("");
            setSaved(true);
            const ok = tryAddToVault({
              name: `trace_urls_${Date.now()}.txt`,
              kind: "trace",
              sizeBytes: payload.length,
              payload,
            });
            setVaultSaved(ok);
          }}
        >
          {t("traceSaveUrls")}
        </Button>
        {saved && (
          <p className="text-center text-sm text-pink">
            {t("traceSavedLocal")}
            {vaultSaved ? t("traceSavedVault") : t("traceSavedVaultHint")}
          </p>
        )}
      </GlassCard>

      <TraceResults />

      <h2 className="font-display mb-4 mt-12 text-xl text-ink">{t("traceReportPlatforms")}</h2>
      <div className="space-y-3">
        {REPORT_LINKS.map((l) => (
          <GlassCard key={l.nameKey}>
            <a
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-pink underline underline-offset-4"
            >
              {t(l.nameKey)}
            </a>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
