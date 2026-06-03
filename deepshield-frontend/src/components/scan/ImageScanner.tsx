"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { CompareSlider } from "@/components/ui/CompareSlider";
import { HeatmapOverlay } from "@/components/scan/HeatmapOverlay";
import { ShieldOverlay } from "@/components/ui/ShieldOverlay";
import { explainRisk, scanImage } from "@/lib/api";
import { analyzeFaceSymmetryScore } from "@/lib/faceAnalysis";
import { analyzeOpenCvArtifactScore } from "@/lib/opencvAnalysis";
import { buildModelGuidedHeatmap } from "@/lib/modelGuidedHeatmap";
import { buildArtifactHeatmap, type HeatmapCell } from "@/lib/clientAnalysis";
import { computeRisk, verdictLabelKey } from "@/lib/riskScoring";
import { saveScanSession } from "@/lib/scanSession";
import { tryAddToVault } from "@/lib/vaultHelpers";
import { playScanChime } from "@/lib/ambientSound";
import { useLanguage } from "@/context/LanguageContext";
import type { ExplainResult, RiskResult } from "@/lib/types";

const SCAN_STEP_KEYS = [
  "scanStep1",
  "scanStep2",
  "scanStep3",
  "scanStep4",
  "scanStep5",
] as const;

function AnimatedRisk({ value }: { value: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let start = 0;
    const t0 = performance.now();
    const run = (now: number) => {
      const p = Math.min(1, (now - t0) / 1400);
      setN(Math.round(value * p));
      if (p < 1) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
  }, [value]);
  return <span className="font-display text-5xl text-ink">{n}%</span>;
}

export function ImageScanner() {
  const { language, t } = useLanguage();
  const [preview, setPreview] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState("image/jpeg");
  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [risk, setRisk] = useState<RiskResult | null>(null);
  const [explain, setExplain] = useState<ExplainResult | null>(null);
  const [heatmap, setHeatmap] = useState<HeatmapCell[]>([]);
  const [shield, setShield] = useState(false);

  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => setStepIndex((i) => (i + 1) % SCAN_STEP_KEYS.length), 1100);
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
        const symmetryScore = await analyzeFaceSymmetryScore(dataUrl);
        const artifactScore = await analyzeOpenCvArtifactScore(dataUrl);

        const { modelScore } = await scanImage({ imageBase64: dataUrl, mimeType: mt });
        let cells: HeatmapCell[] = [];
        try {
          cells = await buildModelGuidedHeatmap(dataUrl, modelScore);
        } catch {
          cells = await buildArtifactHeatmap(dataUrl);
        }
        if (
          cells.length === 0 ||
          cells.every((c) => c.intensity < 0.08)
        ) {
          cells = await buildArtifactHeatmap(dataUrl);
        }
        cells = cells.map((c) => ({
          ...c,
          intensity: Math.min(1, Math.max(c.intensity, 0.12) * 1.15),
        }));
        if (cells.length === 0) {
          cells = Array.from({ length: 64 }, (_, i) => ({
            x: i % 8,
            y: Math.floor(i / 8),
            intensity: 0.2 + modelScore * 0.45,
          }));
        }
        setHeatmap(cells);

        const riskResult = computeRisk({ modelScore, artifactScore, symmetryScore });
        setRisk(riskResult);

        const explanation = await explainRisk({ risk: riskResult, language });
        setExplain(explanation);

        const session = {
          imageDataUrl: dataUrl,
          mimeType: mt,
          risk: riskResult,
          explain: explanation,
          scannedAt: new Date().toISOString(),
        };
        saveScanSession(session);

        tryAddToVault({
          name: `scan_${Date.now()}.jpg`,
          kind: "scan",
          sizeBytes: file.size,
          payload: dataUrl,
        });

        setShield(true);
        playScanChime();
        setTimeout(() => setShield(false), 900);
      } catch (e) {
        setError(e instanceof Error ? e.message : t("scanFailed"));
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-6">
      <ShieldOverlay show={shield} />

      <GlassCard>
        <label className="upload-zone">
          <span className="font-display text-lg text-ink">{t("uploadImageTitle")}</span>
          <span className="mt-2 text-sm text-ink-subtle">{t("uploadImageHint")}</span>
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-ink/50 p-6 backdrop-blur-sm"
          >
            <GlassCard className="max-w-lg w-full">
              {preview && (
                <div className="relative mb-4 aspect-video overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="" className="h-full w-full object-contain" />
                  <motion.div
                    className="absolute inset-x-0 h-1 bg-pink shadow-[0_0_24px_rgba(253,200,194,0.9)]"
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  {[0, 1, 2].map((r) => (
                    <motion.span
                      key={r}
                      className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-pink/60"
                      animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity, delay: r * 0.35 }}
                    />
                  ))}
                </div>
              )}
              <p className="text-center text-sm text-ink">{t(SCAN_STEP_KEYS[stepIndex])}</p>
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
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid gap-6 lg:grid-cols-2"
        >
          <GlassCard className="space-y-4">
            <div>
              <p className="text-sm font-medium text-ink">{t("compareTitle")}</p>
              <p className="text-xs text-ink-subtle">{t("compareHint")}</p>
            </div>
            <CompareSlider
              originalSrc={preview}
              overlay={
                <HeatmapOverlay
                  imageSrc={preview}
                  cells={heatmap}
                  showBaseImage
                />
              }
              originalLabel={t("originalLabel")}
              overlayLabel={t("heatmapLabel")}
            />
            <div>
              <p className="mb-2 text-sm font-medium text-ink">{t("heatmapFullTitle")}</p>
              <div className="relative aspect-square w-full overflow-hidden rounded-xl ring-1 ring-peach/50">
                <HeatmapOverlay
                  imageSrc={preview}
                  cells={heatmap}
                  showBaseImage
                />
              </div>
              <p className="mt-2 text-xs text-ink-subtle">{t("heatmapFullHint")}</p>
            </div>
          </GlassCard>
          <GlassCard>
            <p className="text-sm text-ink-muted">{t("manipulationRisk")}</p>
            <AnimatedRisk value={risk.finalRisk} />
            <p className="mt-2 text-xl font-medium text-accent">{t(verdictLabelKey(risk.verdict))}</p>
            <ul className="mt-4 space-y-2 text-sm text-ink-muted">
              <li className="flex justify-between">
                <span>{t("breakdownHf")}</span>
                <span>{(risk.breakdown.modelScore * 100).toFixed(0)}%</span>
              </li>
              <li className="flex justify-between">
                <span>{t("breakdownOpenCv")}</span>
                <span>{(risk.breakdown.artifactScore * 100).toFixed(0)}%</span>
              </li>
              <li className="flex justify-between">
                <span>{t("breakdownFace")}</span>
                <span>{(risk.breakdown.symmetryScore * 100).toFixed(0)}%</span>
              </li>
            </ul>
            {explain && (
              <div className="mt-6 space-y-3 border-t border-peach/40 pt-4 text-sm">
                <p>{explain.explanation}</p>
                <p className="rounded-xl bg-peach/35 px-4 py-3 font-medium">{explain.recommendation}</p>
              </div>
            )}
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
