"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { HeatmapOverlay } from "@/components/scan/HeatmapOverlay";
import { explainRisk, scanImage } from "@/lib/api";
import {
  analyzeArtifactScore,
  analyzeSymmetryScore,
  buildArtifactHeatmap,
  type HeatmapCell,
} from "@/lib/clientAnalysis";
import { computeRisk, verdictLabel } from "@/lib/riskScoring";
import { saveScanSession } from "@/lib/scanSession";
import { useLanguage } from "@/context/LanguageContext";
import type { ExplainResult, RiskResult } from "@/lib/types";

const SCAN_STEPS = [
  "Analyzing facial geometry…",
  "Checking compression artifacts…",
  "Running deepfake model…",
  "Building heatmap…",
  "Preparing your explanation…",
];

export function ImageScanner() {
  const { language } = useLanguage();
  const [preview, setPreview] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState("image/jpeg");
  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [risk, setRisk] = useState<RiskResult | null>(null);
  const [explain, setExplain] = useState<ExplainResult | null>(null);
  const [heatmap, setHeatmap] = useState<HeatmapCell[]>([]);
  const [showHeatmap, setShowHeatmap] = useState(true);

  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => {
      setStepIndex((i) => (i + 1) % SCAN_STEPS.length);
    }, 1200);
    return () => clearInterval(id);
  }, [loading]);

  async function onFile(file: File) {
    setError(null);
    setRisk(null);
    setExplain(null);
    setHeatmap([]);
    setStepIndex(0);

    const mt = file.type || "image/jpeg";
    setMimeType(mt);

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);
      setLoading(true);
      try {
        const [artifactScore, symmetryScore, cells] = await Promise.all([
          analyzeArtifactScore(dataUrl),
          analyzeSymmetryScore(dataUrl),
          buildArtifactHeatmap(dataUrl),
        ]);
        setHeatmap(cells);

        const { modelScore } = await scanImage({
          imageBase64: dataUrl,
          mimeType: mt,
        });
        const riskResult = computeRisk({
          modelScore,
          artifactScore,
          symmetryScore,
        });
        setRisk(riskResult);

        const explanation = await explainRisk({
          risk: riskResult,
          language,
        });
        setExplain(explanation);

        saveScanSession({
          imageDataUrl: dataUrl,
          mimeType: mt,
          risk: riskResult,
          explain: explanation,
          scannedAt: new Date().toISOString(),
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Scan failed");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-6">
      <GlassCard>
        <label className="upload-zone">
          <span className="font-display text-lg text-ink">Upload JPG or PNG</span>
          <span className="mt-2 text-sm text-ink/60">Max 8MB · analyzed in your browser</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
            }}
          />
        </label>
      </GlassCard>

      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <GlassCard>
              {preview && (
                <div className="relative mb-4 aspect-video overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="" className="h-full w-full object-contain opacity-90" />
                  <motion.div
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-pink to-transparent"
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              )}
              <p className="text-center text-sm text-ink">{SCAN_STEPS[stepIndex]}</p>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <GlassCard>
          <p className="text-sm text-ink">{error}</p>
        </GlassCard>
      )}

      {preview && risk && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-6 lg:grid-cols-2"
        >
          <GlassCard>
            <div className="mb-3 flex gap-2">
              <button
                type="button"
                onClick={() => setShowHeatmap(false)}
                className={`rounded-full px-3 py-1 text-xs ${!showHeatmap ? "bg-pink/50" : "bg-blue/40"}`}
              >
                Original
              </button>
              <button
                type="button"
                onClick={() => setShowHeatmap(true)}
                className={`rounded-full px-3 py-1 text-xs ${showHeatmap ? "bg-pink/50" : "bg-blue/40"}`}
              >
                Heatmap
              </button>
            </div>
            <div className="relative aspect-square w-full overflow-hidden rounded-xl ring-1 ring-peach/50">
              {showHeatmap && heatmap.length > 0 ? (
                <HeatmapOverlay imageSrc={preview} cells={heatmap} />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="Uploaded" className="h-full w-full object-contain" />
              )}
            </div>
          </GlassCard>
          <GlassCard>
            <p className="text-sm text-ink/70">Manipulation risk</p>
            <p className="font-display text-5xl text-ink">{risk.finalRisk}%</p>
            <p className="mt-2 text-xl font-medium text-pink">{verdictLabel(risk.verdict)}</p>
            <ul className="mt-4 space-y-2 text-sm text-ink/80">
              <li className="flex justify-between">
                <span>Model</span>
                <span>{(risk.breakdown.modelScore * 100).toFixed(0)}%</span>
              </li>
              <li className="flex justify-between">
                <span>Artifacts</span>
                <span>{(risk.breakdown.artifactScore * 100).toFixed(0)}%</span>
              </li>
              <li className="flex justify-between">
                <span>Symmetry</span>
                <span>{(risk.breakdown.symmetryScore * 100).toFixed(0)}%</span>
              </li>
            </ul>
            {explain && (
              <div className="mt-6 space-y-3 border-t border-peach/40 pt-4 text-sm">
                <p>{explain.explanation}</p>
                <ul className="list-disc pl-5 text-ink/80">
                  {explain.key_signals.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <p className="rounded-xl bg-peach/35 px-4 py-3 font-medium">{explain.recommendation}</p>
              </div>
            )}
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
