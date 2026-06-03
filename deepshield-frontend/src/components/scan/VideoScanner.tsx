"use client";

import { useEffect, useRef, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { HeatmapOverlay } from "@/components/scan/HeatmapOverlay";
import { CompareSlider } from "@/components/ui/CompareSlider";
import { scanImage } from "@/lib/api";
import { buildArtifactHeatmap, type HeatmapCell } from "@/lib/clientAnalysis";
import { buildModelGuidedHeatmap } from "@/lib/modelGuidedHeatmap";
import { analyzeFaceOnce } from "@/lib/faceAnalysis";
import { analyzeOpenCvArtifactScore } from "@/lib/opencvAnalysis";
import { yieldToMain } from "@/lib/yieldToMain";
import { extractFramesFfmpeg } from "@/lib/ffmpegExtract";
import { extractVideoFrames } from "@/lib/videoFrames";
import { computeRisk, verdictLabelKey } from "@/lib/riskScoring";
import { saveVideoScanSession } from "@/lib/videoScanSession";
import { tryAddToVault } from "@/lib/vaultHelpers";
import { useLanguage } from "@/context/LanguageContext";
import type { Verdict } from "@/lib/types";

type ScoredFrame = {
  timeSec: number;
  dataUrl: string;
  finalRisk: number;
  verdict: Verdict;
  heatmap: HeatmapCell[];
};

export function VideoScanner() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [frames, setFrames] = useState<ScoredFrame[]>([]);
  const [selected, setSelected] = useState(0);
  const [overallRisk, setOverallRisk] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

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

  useEffect(() => {
    const frame = frames[selected];
    const video = videoRef.current;
    if (!frame || !video || !videoUrl) return;
    const seek = () => {
      if (Math.abs(video.currentTime - frame.timeSec) > 0.15) {
        video.currentTime = frame.timeSec;
      }
    };
    if (video.readyState >= 1) seek();
    else video.addEventListener("loadedmetadata", seek, { once: true });
  }, [selected, frames, videoUrl]);

  async function onVideo(file: File) {
    if (file.size > 50 * 1024 * 1024) {
      setError(t("videoTooLarge"));
      return;
    }
    setError(null);
    setLoading(true);
    setFrames([]);
    setOverallRisk(null);
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);

    try {
      let extracted: { timeSec: number; dataUrl: string }[];
      try {
        extracted = await extractFramesFfmpeg(file, 1, 15);
      } catch {
        extracted = await extractVideoFrames(file, 1, 15);
      }

      const scored: ScoredFrame[] = [];
      for (let i = 0; i < extracted.length; i++) {
        const frame = extracted[i];
        setProgress(t("videoFrameProgress").replace("{n}", String(i + 1)).replace("{total}", String(extracted.length)));

        const [{ symmetryScore, faceBox }, artifactScore, { modelScore }] =
          await Promise.all([
            analyzeFaceOnce(frame.dataUrl),
            analyzeOpenCvArtifactScore(frame.dataUrl),
            scanImage({
              imageBase64: frame.dataUrl,
              mimeType: "image/jpeg",
            }),
          ]);
        await yieldToMain();
        let heatmap: HeatmapCell[] = [];
        try {
          heatmap = await buildModelGuidedHeatmap(
            frame.dataUrl,
            modelScore,
            8,
            faceBox,
          );
        } catch {
          heatmap = await buildArtifactHeatmap(frame.dataUrl);
        }
        await yieldToMain();
        const risk = computeRisk({ modelScore, artifactScore, symmetryScore });
        scored.push({
          timeSec: frame.timeSec,
          dataUrl: frame.dataUrl,
          finalRisk: risk.finalRisk,
          verdict: risk.verdict,
          heatmap,
        });
      }
      setFrames(scored);
      setSelected(0);
      const avg = scored.reduce((s, f) => s + f.finalRisk, 0) / (scored.length || 1);
      const overall = Math.round(avg);
      setOverallRisk(overall);

      saveVideoScanSession({
        fileName: file.name,
        overallRisk: overall,
        frames: scored.map((f) => ({
          timeSec: f.timeSec,
          dataUrl: f.dataUrl,
          finalRisk: f.finalRisk,
          verdict: f.verdict,
        })),
        scannedAt: new Date().toISOString(),
      });

      tryAddToVault({
        name: `video_scan_${Date.now()}.json`,
        kind: "scan",
        sizeBytes: JSON.stringify(scored).length,
        payload: JSON.stringify({ overall, frames: scored.length }),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : t("videoScanFailed"));
    } finally {
      setLoading(false);
      setProgress("");
    }
  }

  const current = frames[selected];

  return (
    <div className="space-y-6">
      <GlassCard>
        <label className="upload-zone">
          <span className="font-display text-lg text-ink">{t("videoUploadTitle")}</span>
          <span className="mt-2 text-sm text-ink-subtle">{t("videoUploadHint")}</span>
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
            {progress || t("videoAnalyzing")}
          </p>
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
            <p className="text-sm text-ink-muted">{t("videoOverallRisk")}</p>
            <p className="font-display text-4xl text-ink">{overallRisk}%</p>
            <p className="mt-1 text-xs text-ink-subtle">{t("videoScrollHint")}</p>
          </GlassCard>

          {videoUrl && (
            <GlassCard>
              <video
                ref={videoRef}
                src={videoUrl}
                className="aspect-video w-full rounded-xl object-contain"
                muted
                playsInline
                preload="metadata"
              />
            </GlassCard>
          )}

          <div className="flex gap-1 rounded-full bg-cream/80 p-1">
            {frames.map((f, i) => (
              <button
                key={f.timeSec}
                type="button"
                onClick={() => setSelected(i)}
                className={`timeline-segment flex-1 ${
                  f.finalRisk >= 50 ? "bg-pink" : "bg-sage"
                } ${i === selected ? "ring-2 ring-ink/40" : ""}`}
                title={`${f.timeSec.toFixed(1)}s · ${f.finalRisk}%`}
              />
            ))}
          </div>

          {current && (
            <div className="grid gap-6 lg:grid-cols-2">
              <GlassCard className="space-y-3">
                <p className="text-sm font-medium text-ink">{t("compareTitle")}</p>
                <CompareSlider
                  originalSrc={current.dataUrl}
                  overlay={
                    <HeatmapOverlay
                      imageSrc={current.dataUrl}
                      cells={current.heatmap}
                      showBaseImage
                      animateReveal
                    />
                  }
                  originalLabel={t("originalLabel")}
                  overlayLabel={t("heatmapLabel")}
                />
                <p className="text-center text-xs text-ink-subtle">
                  {t("videoFrameLine")
                    .replace("{time}", current.timeSec.toFixed(1))
                    .replace("{risk}", String(current.finalRisk))}{" "}
                  · {t(verdictLabelKey(current.verdict))}
                </p>
              </GlassCard>
              <GlassCard>
                <p className="text-sm font-medium text-ink">{t("videoPerFrame")}</p>
                <ul className="mt-3 max-h-64 space-y-2 overflow-y-auto text-sm">
                  {frames.map((f, i) => (
                    <li key={f.timeSec}>
                      <button
                        type="button"
                        onClick={() => setSelected(i)}
                        className={`flex w-full justify-between rounded-lg px-3 py-2 text-left ${
                          i === selected ? "bg-pink/40" : "bg-blue/25"
                        }`}
                      >
                        <span>{f.timeSec.toFixed(1)}s</span>
                        <span className="font-medium">{f.finalRisk}%</span>
                      </button>
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
