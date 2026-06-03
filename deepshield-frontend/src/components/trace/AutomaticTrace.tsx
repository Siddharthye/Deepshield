"use client";

import { useState } from "react";
import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";
import { fetchReverseTrace } from "@/lib/api";
import {
  openTraceSearchEngines,
  parseTraceUrlsFromText,
  publishTraceImage,
} from "@/lib/reverseTrace";
import { appendTraceHits, type TraceHit } from "@/lib/traceStorage";
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
  const [previewHits, setPreviewHits] = useState<TraceHit[]>([]);

  async function runAutomaticTrace() {
    setRunning(true);
    setStatus(t("traceAutoSearching"));
    setImported(0);
    setPreviewHits([]);
    try {
      tryAddToVault({
        name: fileName ?? `trace_${Date.now()}.jpg`,
        kind: "trace",
        sizeBytes: preview.length,
        payload: preview,
      });

      setStatus(t("traceAutoHosting"));
      let hosted: string;
      try {
        hosted = await publishTraceImage(preview);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "";
        setStatus(
          msg && msg.length < 140
            ? `${t("traceAutoPublishFailed")} (${msg})`
            : t("traceAutoPublishFailed"),
        );
        return;
      }
      setPublicUrl(hosted);

      const result = await fetchReverseTrace({ imageUrl: hosted });

      if (result.sources?.length) {
        setStatus(
          t("traceAutoSources").replace("{sources}", result.sources.join(", ")),
        );
      }

      if (result.hits.length > 0) {
        appendTraceHits(result.hits);
        setImported(result.hits.length);
        setPreviewHits(result.hits.slice(0, 6));
        onHitsImported?.();
        setStatus(t("traceAutoFound").replace("{n}", String(result.hits.length)));
      } else {
        openTraceSearchEngines(hosted);
        setStatus(t("traceAutoNoResultsOpened"));
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      setStatus(
        msg && msg.length < 120
          ? `${t("traceAutoFailed")} (${msg})`
          : t("traceAutoFailed"),
      );
    } finally {
      setRunning(false);
    }
  }

  function importFromPaste() {
    const hits = parseTraceUrlsFromText(paste);
    if (hits.length === 0) return;
    appendTraceHits(hits);
    setImported(hits.length);
    setPreviewHits(hits.slice(0, 6));
    setPaste("");
    onHitsImported?.();
    setStatus(t("traceAutoImported").replace("{n}", String(hits.length)));
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

      {previewHits.length > 0 && (
        <ul className="max-h-36 space-y-1 overflow-y-auto rounded-lg border border-secondary/15 bg-cream-tan/50 p-2 text-xs">
          {previewHits.map((h) => (
            <li key={h.id}>
              <span className="font-medium text-ink">{h.platform}</span>
              {" — "}
              <a href={h.url} target="_blank" rel="noopener noreferrer" className="text-link break-all">
                {h.title || h.url}
              </a>
            </li>
          ))}
        </ul>
      )}

      <Button
        variant="ghost"
        className="w-full text-sm"
        disabled={running}
        onClick={() => openTraceSearchEngines(publicUrl ?? undefined)}
      >
        {t("traceAutoManualFallback")}
      </Button>

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
    </GlassCard>
  );
}
