"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { tryAddToVault } from "@/lib/vaultHelpers";
import type { TraceHit } from "@/lib/traceStorage";

const STORAGE = "deepshield_trace_results";

export function TraceResults() {
  const [hits, setHits] = useState<TraceHit[]>([]);
  const [platform, setPlatform] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [firstSeen, setFirstSeen] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE);
    if (raw) setHits(JSON.parse(raw) as TraceHit[]);
  }, []);

  function persist(next: TraceHit[]) {
    setHits(next);
    localStorage.setItem(STORAGE, JSON.stringify(next));
    const urls = next.map((h) => h.url);
    localStorage.setItem("deepshield_trace_urls", JSON.stringify(urls));
    tryAddToVault({
      name: `trace_results_${Date.now()}.json`,
      kind: "trace",
      sizeBytes: JSON.stringify(next).length,
      payload: JSON.stringify(next),
    });
  }

  function add() {
    if (!url.trim()) return;
    const hit: TraceHit = {
      id: crypto.randomUUID(),
      platform: platform || "Unknown platform",
      title: title || "Untitled page",
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
        <p className="text-sm font-medium text-ink">Log a search result</p>
        <input
          className="input-field"
          placeholder="Platform (e.g. Instagram)"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        />
        <input
          className="input-field"
          placeholder="Page title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="input-field"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <input
          type="date"
          className="input-field"
          value={firstSeen}
          onChange={(e) => setFirstSeen(e.target.value)}
        />
        <Button variant="primary" className="w-full" onClick={add}>
          Add to results
        </Button>
      </GlassCard>

      {hits.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-display text-lg text-ink">Results ({hits.length})</h3>
          {hits.map((h) => (
            <GlassCard key={h.id}>
              <p className="text-xs font-medium text-pink">{h.platform}</p>
              <p className="font-medium text-ink">{h.title}</p>
              <a
                href={h.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block truncate text-sm text-pink underline"
              >
                {h.url}
              </a>
              <p className="mt-2 text-xs text-ink/55">First seen: {h.firstSeen}</p>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
