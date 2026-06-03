"use client";

import { useState } from "react";
import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { scanImage } from "@/lib/api";
import { computeRisk } from "@/lib/riskScoring";
import { analyzeArtifactScore, analyzeSymmetryScore } from "@/lib/clientAnalysis";
import { extractVideoFrames, type VideoFrameResult } from "@/lib/videoFrames";

export function VideoScanner() {
  const [loading, setLoading] = useState(false);
  const [frames, setFrames] = useState<VideoFrameResult[]>([]);
  const [selected, setSelected] = useState(0);
  const [overallRisk, setOverallRisk] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onVideo(file: File) {
    if (file.size > 50 * 1024 * 1024) {
      setError("Video must be under 50MB");
      return;
    }
    setError(null);
    setLoading(true);
    setFrames([]);
    try {
      const extracted = await extractVideoFrames(file, 1, 15);
      const scored: VideoFrameResult[] = [];
      for (const frame of extracted) {
        const artifactScore = await analyzeArtifactScore(frame.dataUrl);
        const symmetryScore = await analyzeSymmetryScore(frame.dataUrl);
        const { modelScore } = await scanImage({
          imageBase64: frame.dataUrl,
          mimeType: "image/jpeg",
        });
        const risk = computeRisk({ modelScore, artifactScore, symmetryScore });
        scored.push({
          ...frame,
          modelScore,
          finalRisk: risk.finalRisk,
        });
      }
      setFrames(scored);
      setSelected(0);
      const avg =
        scored.reduce((s, f) => s + (f.finalRisk ?? 0), 0) / (scored.length || 1);
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
          <span className="mt-2 text-sm text-ink/60">Up to 50MB · frames analyzed in browser</span>
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
          <p className="animate-pulse text-center text-sm text-ink">
            Extracting keyframes and running detection…
          </p>
        </GlassCard>
      )}

      {error && (
        <GlassCard>
          <p className="text-sm text-ink">{error}</p>
        </GlassCard>
      )}

      {overallRisk !== null && frames.length > 0 && (
        <>
          <GlassCard>
            <p className="text-sm text-ink/70">Overall video risk</p>
            <p className="font-display text-4xl text-ink">{overallRisk}%</p>
          </GlassCard>

          <div
            className="mb-2 flex gap-1 rounded-full bg-cream/80 p-1"
            role="tablist"
            aria-label="Frame timeline"
          >
            {frames.map((f, i) => {
              const risk = f.finalRisk ?? 0;
              const suspicious = risk >= 50;
              return (
                <button
                  key={f.timeSec}
                  type="button"
                  role="tab"
                  aria-selected={i === selected}
                  onClick={() => setSelected(i)}
                  className={`timeline-segment flex-1 ${
                    suspicious ? "bg-pink" : "bg-sage"
                  } ${i === selected ? "ring-2 ring-ink/30" : ""}`}
                  title={`${f.timeSec.toFixed(1)}s — ${risk}%`}
                />
              );
            })}
          </div>

          {current && (
            <div className="grid gap-6 lg:grid-cols-2">
              <GlassCard>
                <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                  <Image
                    src={current.dataUrl}
                    alt={`Frame at ${current.timeSec}s`}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <p className="mt-2 text-center text-xs text-ink/60">
                  {current.timeSec.toFixed(1)}s · {current.finalRisk}% risk
                </p>
              </GlassCard>
              <GlassCard>
                <p className="text-sm text-ink/70">Frame breakdown</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {frames.map((f) => (
                    <li
                      key={f.timeSec}
                      className="flex justify-between rounded-lg bg-blue/30 px-3 py-2"
                    >
                      <span>{f.timeSec.toFixed(1)}s</span>
                      <span className="font-medium">{f.finalRisk}%</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>
          )}
        </>
      )}
    </div>
  );
}
