"use client";

import { useEffect, useRef, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { HeatmapOverlay } from "@/components/scan/HeatmapOverlay";
import { scanImage } from "@/lib/api";
import { buildArtifactHeatmap, type HeatmapCell } from "@/lib/clientAnalysis";
import { analyzeFaceSymmetryScore } from "@/lib/faceAnalysis";
import { analyzeOpenCvArtifactScore } from "@/lib/opencvAnalysis";
import { extractFramesFfmpeg } from "@/lib/ffmpegExtract";
import { extractVideoFrames } from "@/lib/videoFrames";
import { computeRisk } from "@/lib/riskScoring";

type ScoredFrame = {
  timeSec: number;
  dataUrl: string;
  finalRisk: number;
  heatmap: HeatmapCell[];
};

export function VideoScanner() {
  const [loading, setLoading] = useState(false);
  const [frames, setFrames] = useState<ScoredFrame[]>([]);
  const [selected, setSelected] = useState(0);
  const [overallRisk, setOverallRisk] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (frames.length < 2) return;
    const onScroll = () => {
      const el = resultsRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const progress = 1 - Math.min(1, Math.max(0, rect.top / (window.innerHeight * 0.85)));
      const idx = Math.min(frames.length - 1, Math.floor(progress * frames.length));
      setSelected(idx);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [frames.length]);

  async function onVideo(file: File) {
    if (file.size > 50 * 1024 * 1024) {
      setError("Video must be under 50MB");
      return;
    }
    setError(null);
    setLoading(true);
    setFrames([]);
    try {
      let extracted: { timeSec: number; dataUrl: string }[];
      try {
        extracted = await extractFramesFfmpeg(file, 1, 15);
      } catch {
        extracted = await extractVideoFrames(file, 1, 15);
      }

      const scored: ScoredFrame[] = [];
      for (const frame of extracted) {
        const [artifactScore, symmetryScore, heatmap] = await Promise.all([
          analyzeOpenCvArtifactScore(frame.dataUrl),
          analyzeFaceSymmetryScore(frame.dataUrl),
          buildArtifactHeatmap(frame.dataUrl),
        ]);
        const { modelScore } = await scanImage({
          imageBase64: frame.dataUrl,
          mimeType: "image/jpeg",
        });
        const risk = computeRisk({ modelScore, artifactScore, symmetryScore });
        scored.push({
          timeSec: frame.timeSec,
          dataUrl: frame.dataUrl,
          finalRisk: risk.finalRisk,
          heatmap,
        });
      }
      setFrames(scored);
      setSelected(0);
      const avg = scored.reduce((s, f) => s + f.finalRisk, 0) / (scored.length || 1);
      setOverallRisk(Math.round(avg));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Video scan failed");
    } finally {
      setLoading(false);
    }
  }

  const current = frames[selected];

  return (
    <div className="space-y-6">
      <GlassCard>
        <label className="upload-zone">
          <span className="font-display text-lg text-ink">Upload MP4 or MOV</span>
          <span className="mt-2 text-sm text-ink/60">FFmpeg.wasm keyframes · full pipeline per frame</span>
          <input
            type="file"
            accept="video/mp4,video/quicktime,video/webm"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void onVideo(f);
            }}
          />
        </label>
      </GlassCard>

      {loading && (
        <GlassCard>
          <p className="animate-pulse text-center text-sm text-ink">Extracting & analyzing frames…</p>
        </GlassCard>
      )}

      {error && (
        <GlassCard>
          <p className="text-sm text-ink">{error}</p>
        </GlassCard>
      )}

      {overallRisk !== null && frames.length > 0 && (
        <div ref={resultsRef} className="min-h-[120vh] space-y-6">
          <GlassCard>
            <p className="text-sm text-ink/70">Overall video risk</p>
            <p className="font-display text-4xl text-ink">{overallRisk}%</p>
            <p className="mt-1 text-xs text-ink/55">Scroll to scrub timeline · tap segments</p>
          </GlassCard>

          <div className="flex gap-1 rounded-full bg-cream/80 p-1">
            {frames.map((f, i) => (
              <button
                key={f.timeSec}
                type="button"
                onClick={() => setSelected(i)}
                className={`timeline-segment flex-1 ${
                  f.finalRisk >= 50 ? "bg-pink" : "bg-sage"
                } ${i === selected ? "ring-2 ring-ink/40" : ""}`}
                title={`${f.timeSec.toFixed(1)}s`}
              />
            ))}
          </div>

          {current && (
            <div className="grid gap-6 lg:grid-cols-2">
              <GlassCard>
                <div className="relative aspect-video overflow-hidden rounded-xl">
                  <HeatmapOverlay imageSrc={current.dataUrl} cells={current.heatmap} />
                </div>
                <p className="mt-2 text-center text-xs text-ink/60">
                  {current.timeSec.toFixed(1)}s · {current.finalRisk}% · scroll to change frame
                </p>
              </GlassCard>
              <GlassCard>
                <p className="text-sm font-medium text-ink">Per-frame scores</p>
                <ul className="mt-3 max-h-64 space-y-2 overflow-y-auto text-sm">
                  {frames.map((f, i) => (
                    <li
                      key={f.timeSec}
                      className={`flex justify-between rounded-lg px-3 py-2 ${
                        i === selected ? "bg-pink/40" : "bg-blue/25"
                      }`}
                    >
                      <span>{f.timeSec.toFixed(1)}s</span>
                      <span className="font-medium">{f.finalRisk}%</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
