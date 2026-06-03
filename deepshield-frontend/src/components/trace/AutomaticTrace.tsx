"use client";

import { useState } from "react";
import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";
import {
  copyImageToClipboard,
  openTraceSearchEngines,
  parseTraceUrlsFromText,
  publishTraceImage,
} from "@/lib/reverseTrace";
import { appendTraceHits } from "@/lib/traceStorage";
import { tryAddToVault } from "@/lib/vaultHelpers";

type Props = {
  preview: string;
  fileName?: string;
  onHitsImported?: () => void;
};

export function AutomaticTrace({ preview, fileName, onHitsImported }: Props) {
  const { t } = useLanguage();
  const [running, setRunning] = useState(false);
  const [paste, setPaste] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const [imported, setImported] = useState(0);

  async function runAutomaticTrace() {
    setRunning(true);
    setStatus(null);
    setImported(0);
    try {
      tryAddToVault({
        name: fileName ?? `trace_${Date.now()}.jpg`,
        kind: "trace",
        sizeBytes: preview.length,
        payload: preview,
      });

      const copied = await copyImageToClipboard(preview);
      setStatus(copied ? t("traceAutoCopied") : t("traceAutoCopyFailed"));

      const hosted = await publishTraceImage(preview);
      setPublicUrl(hosted);
      openTraceSearchEngines(hosted ?? undefined);

      if (hosted) {
        setStatus((s) => `${s ?? ""} ${t("traceAutoHosted")}`.trim());
      } else {
        setStatus((s) => `${s ?? ""} ${t("traceAutoManualUpload")}`.trim());
      }
    } finally {
      setRunning(false);
    }
  }

  function importFromPaste() {
    const hits = parseTraceUrlsFromText(paste);
    if (hits.length === 0) return;
    appendTraceHits(hits);
    setImported(hits.length);
    setPaste("");
    onHitsImported?.();
  }

  return (
    <GlassCard className="space-y-4">
      <div className="relative mx-auto aspect-video max-h-52 w-full overflow-hidden rounded-xl">
        <Image src={preview} alt={t("tracePreviewAlt")} fill className="object-contain" unoptimized />
      </div>

      <Button variant="primary" className="w-full" disabled={running} onClick={() => void runAutomaticTrace()}>
        {running ? t("traceAutoRunning") : t("traceAutoStart")}
      </Button>

      {status && <p className="text-center text-xs leading-relaxed text-ink-muted">{status}</p>}
      {publicUrl && (
        <p className="truncate text-center text-xs text-link">
          <a href={publicUrl} target="_blank" rel="noopener noreferrer">
            {publicUrl}
          </a>
        </p>
      )}

      <p className="text-xs text-ink-subtle">{t("traceAutoPasteHint")}</p>
      <textarea
        className="input-field"
        rows={4}
        value={paste}
        onChange={(e) => setPaste(e.target.value)}
        placeholder={t("traceUrlPlaceholder")}
      />
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" className="flex-1" onClick={importFromPaste} disabled={!paste.trim()}>
          {t("traceAutoImport")}
        </Button>
        <Button
          variant="ghost"
          onClick={async () => {
            try {
              const text = await navigator.clipboard.readText();
              setPaste(text);
            } catch {
              setStatus(t("traceAutoClipboardDenied"));
            }
          }}
        >
          {t("traceAutoPasteClipboard")}
        </Button>
      </div>
      {imported > 0 && (
        <p className="text-center text-sm text-accent">
          {t("traceAutoImported").replace("{n}", String(imported))}
        </p>
      )}
    </GlassCard>
  );
}
