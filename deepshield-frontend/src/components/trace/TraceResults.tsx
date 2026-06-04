"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { tryAddToVault } from "@/lib/vaultHelpers";
import { parseTraceUrlsFromText } from "@/lib/reverseTrace";
import { useLanguage } from "@/context/LanguageContext";
import { appendTraceHits, loadTraceHits, saveTraceHits, type TraceHit } from "@/lib/traceStorage";
import { TraceMatchRow } from "@/components/trace/TraceMatchRow";

export function TraceResults({
  refreshKey = 0,
  queryPreview = null,
}: {
  refreshKey?: number;
  queryPreview?: string | null;
}) {
  const { t } = useLanguage();
  const [hits, setHits] = useState<TraceHit[]>([]);
  const [platform, setPlatform] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [firstSeen, setFirstSeen] = useState("");

  useEffect(() => {
    setHits(loadTraceHits());
  }, [refreshKey]);

  function persist(next: TraceHit[]) {
    setHits(next);
    saveTraceHits(next);
    tryAddToVault({
      name: `trace_results_${Date.now()}.json`,
      kind: "trace",
      sizeBytes: JSON.stringify(next).length,
      payload: JSON.stringify(next),
    });
  }

  function bulkImport() {
    const text = [platform, title, url].filter(Boolean).join("\n");
    const parsed = parseTraceUrlsFromText(text || url);
    if (parsed.length) {
      const merged = appendTraceHits(parsed);
      setHits(merged);
      setPlatform("");
      setTitle("");
      setUrl("");
      setFirstSeen("");
      return;
    }
    add();
  }

  function add() {
    if (!url.trim()) return;
    const hit: TraceHit = {
      id: crypto.randomUUID(),
      platform: platform || t("traceUnknownPlatform"),
      title: title || t("traceUntitled"),
      url: url.trim(),
      firstSeen: firstSeen || new Date().toISOString().slice(0, 10),
    };
    persist([hit, ...hits]);
    setPlatform("");
    setTitle("");
    setUrl("");
    setFirstSeen("");
  }

  return (
    <div className="space-y-6">
      <GlassCard className="space-y-3">
        <p className="text-sm font-medium text-ink">{t("traceLogTitle")}</p>
        <input
          className="input-field"
          placeholder={t("tracePlatformPh")}
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        />
        <input
          className="input-field"
          placeholder={t("tracePagePh")}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="input-field"
          placeholder={t("traceUrlPh")}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <input
          type="date"
          className="input-field"
          value={firstSeen}
          onChange={(e) => setFirstSeen(e.target.value)}
        />
        <Button variant="primary" className="w-full" onClick={bulkImport}>
          {t("traceAddResult")}
        </Button>
      </GlassCard>

      {hits.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-display text-lg text-ink">
            {t("traceResultsCount")} ({hits.length})
          </h3>
          {hits.map((h) => (
            <TraceMatchRow key={h.id} hit={h} queryPreview={queryPreview} />
          ))}
        </div>
      )}
    </div>
  );
}
