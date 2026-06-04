"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { CompareSlider } from "@/components/ui/CompareSlider";
import { HeatmapOverlay } from "@/components/scan/HeatmapOverlay";
import { ShieldOverlay } from "@/components/ui/ShieldOverlay";
import { explainRisk, scanImage } from "@/lib/api";
import { analyzeFaceOnce, preloadFaceApi } from "@/lib/faceAnalysis";
import { analyzeOpenCvArtifactScore } from "@/lib/opencvAnalysis";
import { analyzeMorphScore } from "@/lib/morphDetection";
import { buildModelGuidedHeatmap } from "@/lib/modelGuidedHeatmap";
import { withTimeout } from "@/lib/withTimeout";
import type { HeatmapCell } from "@/lib/clientAnalysis";
import { exportHeatmapDataUrl } from "@/lib/heatmapExport";
import { resizeImageForScan } from "@/lib/resizeImage";
import { computeRisk, verdictLabelKey } from "@/lib/riskScoring";
import { loadScanSession, saveScanSession } from "@/lib/scanSession";
import { tryAddToVault } from "@/lib/vaultHelpers";
import { playScanChime } from "@/lib/ambientSound";
import { deferToIdle, yieldToMain } from "@/lib/yieldToMain";
import { formatScanError } from "@/lib/scanErrors";
import { useLanguage } from "@/context/LanguageContext";
import type { ExplainResult, RiskResult, ScanSession } from "@/lib/types";
import type { I18nKey } from "@/lib/i18n";

function AnimatedRisk({ value }: { value: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
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
  const { apiLanguage, t } = useLanguage();
  useEffect(() => {
    preloadFaceApi();
  }, []);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [stepKey, setStepKey] = useState<I18nKey>("scanStepPrepare");
  const [error, setError] = useState<string | null>(null);
  const [risk, setRisk] = useState<RiskResult | null>(null);
  const [explain, setExplain] = useState<ExplainResult | null>(null);
  const [explainLoading, setExplainLoading] = useState(false);
  const [heatmap, setHeatmap] = useState<HeatmapCell[]>([]);
  const [shield, setShield] = useState(false);
  const [modelUnavailable, setModelUnavailable] = useState(false);

  async function onFile(file: File) {
    setError(null);
    setRisk(null);
    setExplain(null);
    setHeatmap([]);
    setModelUnavailable(false);
    setLoading(true);

    try {
      setStepKey("scanStepPrepare");
      const { dataUrl, mimeType } = await resizeImageForScan(file);
      setPreview(dataUrl);
      await yieldToMain();

      setStepKey("scanStep3");
      const scan = await scanImage({
        imageBase64: dataUrl,
        mimeType,
      });
      const {
        modelScore,
        hfModelScore,
        sightengineScore,
        modelUnavailable: modelsDown,
      } = scan;
      setModelUnavailable(!!modelsDown);
      await yieldToMain();

      setStepKey("scanStep1");
      const { symmetryScore, faceBox } = await analyzeFaceOnce(dataUrl);
      await yieldToMain();

      setStepKey("scanStep2");
      const [artifactScore, morphScore] = await Promise.all([
        analyzeOpenCvArtifactScore(dataUrl),
        analyzeMorphScore(dataUrl, faceBox),
      ]);
      await yieldToMain();

      setStepKey("scanStep4");
      const cells = await withTimeout(
        buildModelGuidedHeatmap(dataUrl, modelScore, 8, faceBox, morphScore),
        12_000,
        "heatmap",
      ).catch(() => [] as HeatmapCell[]);
      setHeatmap(cells);

      const riskResult = computeRisk(
        {
          modelScore,
          artifactScore,
          symmetryScore,
          morphScore,
          hfModelScore,
          sightengineScore,
        },
        { modelUnavailable: modelsDown },
      );
      setRisk(riskResult);
      setLoading(false);

      setShield(true);
      playScanChime();
      setTimeout(() => setShield(false), 900);

      const baseSession: ScanSession = {
        imageDataUrl: dataUrl,
        mimeType,
        risk: riskResult,
        scannedAt: new Date().toISOString(),
      };
      saveScanSession(baseSession);

      setExplainLoading(true);
      setStepKey("scanStep5");
      void explainRisk({ risk: riskResult, language: apiLanguage })
        .then((explanation) => {
          setExplain(explanation);
          saveScanSession({ ...baseSession, explain: explanation });
        })
        .catch(() => {
          /* results still usable without LLM text */
        })
        .finally(() => setExplainLoading(false));

      deferToIdle(() => {
        void exportHeatmapDataUrl(dataUrl, cells)
          .then((heatmapDataUrl) => {
            const session = loadScanSession();
            saveScanSession({
              ...(session ?? baseSession),
              heatmapDataUrl,
            });
          })
          .catch(() => {
            /* optional */
          });
        tryAddToVault({
          name: `scan_${Date.now()}.jpg`,
          kind: "scan",
          sizeBytes: Math.round(dataUrl.length * 0.75),
          payload: dataUrl,
        });
      });
    } catch (e) {
      const raw = e instanceof Error ? e.message : t("scanFailed");
      const key = formatScanError(raw);
      setError(key.startsWith("scan") ? t(key as I18nKey) : raw);
      setLoading(false);
      setPreview(null);
    }
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
              if (f) void onFile(f);
              e.target.value = "";
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
                  <div
                    className="scan-beam absolute inset-x-0 h-1 bg-pink shadow-[0_0_24px_rgba(244,196,208,0.85)]"
                    aria-hidden
                  />
                </div>
              )}
              <p className="text-center text-sm text-ink">{t(stepKey)}</p>
              <p className="mt-2 text-center text-xs text-ink-subtle">{t("scanPleaseWait")}</p>
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
                <HeatmapOverlay imageSrc={preview} cells={heatmap} showBaseImage />
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
                  animateReveal
                />
              </div>
              <p className="mt-2 text-xs text-ink-subtle">{t("heatmapFullHint")}</p>
            </div>
          </GlassCard>
          <GlassCard>
            <p className="text-sm text-ink-muted">{t("manipulationRisk")}</p>
            <AnimatedRisk value={risk.finalRisk} />
            <p className="mt-2 text-xl font-medium text-accent">{t(verdictLabelKey(risk.verdict))}</p>
            {modelUnavailable && (
              <p className="mt-2 rounded-xl bg-peach/35 px-3 py-2 text-xs text-ink-muted">
                {t("scanModelUnavailable")}
              </p>
            )}
            <ul className="mt-4 space-y-2 text-sm text-ink-muted">
              <li className="flex justify-between">
                <span>{t("breakdownCombinedModel")}</span>
                <span>{(risk.breakdown.modelScore * 100).toFixed(0)}%</span>
              </li>
              {risk.breakdown.hfModelScore != null && (
                <li className="flex justify-between pl-2 text-xs">
                  <span>{t("breakdownHf")}</span>
                  <span>{(risk.breakdown.hfModelScore * 100).toFixed(0)}%</span>
                </li>
              )}
              {risk.breakdown.sightengineScore != null && (
                <li className="flex justify-between pl-2 text-xs">
                  <span>{t("breakdownSightengine")}</span>
                  <span>{(risk.breakdown.sightengineScore * 100).toFixed(0)}%</span>
                </li>
              )}
              <li className="flex justify-between">
                <span>{t("breakdownOpenCv")}</span>
                <span>{(risk.breakdown.artifactScore * 100).toFixed(0)}%</span>
              </li>
              <li className="flex justify-between">
                <span>{t("breakdownFace")}</span>
                <span>{(risk.breakdown.symmetryScore * 100).toFixed(0)}%</span>
              </li>
              {risk.breakdown.morphScore != null && (
                <li className="flex justify-between">
                  <span>{t("breakdownMorph")}</span>
                  <span>{(risk.breakdown.morphScore * 100).toFixed(0)}%</span>
                </li>
              )}
            </ul>
            {explainLoading && (
              <p className="mt-6 animate-pulse text-sm text-ink-subtle">{t("scanExplainLoading")}</p>
            )}
            {explain && !explainLoading && (
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
