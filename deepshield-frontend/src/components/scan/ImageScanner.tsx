"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { explainRisk, scanImage } from "@/lib/api";
import { computeRisk, verdictLabel } from "@/lib/riskScoring";
import { saveScanSession } from "@/lib/scanSession";
import { useLanguage } from "@/context/LanguageContext";
import type { ExplainResult, RiskResult } from "@/lib/types";

const SCAN_STEPS = [
  "Analyzing facial geometry…",
  "Checking compression artifacts…",
  "Running deepfake model…",
  "Preparing your explanation…",
];

function estimateClientScores(): { artifactScore: number; symmetryScore: number } {
  return { artifactScore: 0.35, symmetryScore: 0.28 };
}

export function ImageScanner() {
  const { language } = useLanguage();
  const [preview, setPreview] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState("image/jpeg");
  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [risk, setRisk] = useState<RiskResult | null>(null);
  const [explain, setExplain] = useState<ExplainResult | null>(null);

  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => {
      setStepIndex((i) => (i + 1) % SCAN_STEPS.length);
    }, 1400);
    return () => clearInterval(id);
  }, [loading]);

  async function onFile(file: File) {
    setError(null);
    setRisk(null);
    setExplain(null);
    setStepIndex(0);

    const mt = file.type || "image/jpeg";
    setMimeType(mt);

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);
      setLoading(true);
      try {
        const { modelScore } = await scanImage({
          imageBase64: dataUrl,
          mimeType: mt,
        });
        const client = estimateClientScores();
        const riskResult = computeRisk({
          modelScore,
          artifactScore: client.artifactScore,
          symmetryScore: client.symmetryScore,
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
          <span className="font-display text-lg font-medium text-espresso">
            Upload JPG or PNG
          </span>
          <span className="mt-2 text-sm text-espresso/60">Max 8MB · stays in your browser</span>
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
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <GlassCard className="relative overflow-hidden">
              {preview && (
                <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-xl">
                  <Image
                    src={preview}
                    alt="Scanning"
                    fill
                    className="object-contain opacity-90"
                    unoptimized
                  />
                  <motion.div
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-rose to-transparent shadow-[0_0_20px_rgba(219,161,162,0.8)]"
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              )}
              <p className="text-center text-sm font-medium text-espresso">
                {SCAN_STEPS[stepIndex]}
              </p>
              <div className="mt-4 flex justify-center gap-1.5">
                {SCAN_STEPS.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-6 rounded-full transition-colors ${
                      i === stepIndex ? "bg-rose" : "bg-sage/40"
                    }`}
                  />
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <GlassCard className="border-rose/50">
          <p className="text-sm text-espresso">{error}</p>
        </GlassCard>
      )}

      {preview && risk && !loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid gap-6 lg:grid-cols-2"
        >
          <GlassCard>
            <div className="relative aspect-square w-full overflow-hidden rounded-xl ring-1 ring-blush/50">
              <Image
                src={preview}
                alt="Uploaded"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </GlassCard>
          <GlassCard>
            <p className="text-sm text-espresso/70">Manipulation risk</p>
            <p className="font-display text-5xl font-semibold text-espresso">
              {risk.finalRisk}%
            </p>
            <p className="mt-2 text-xl font-medium text-rose">
              {verdictLabel(risk.verdict)}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-espresso/80">
              <li className="flex justify-between gap-4">
                <span>Model signal</span>
                <span className="font-medium">
                  {(risk.breakdown.modelScore * 100).toFixed(0)}%
                </span>
              </li>
              <li className="flex justify-between gap-4">
                <span>Artifacts</span>
                <span className="font-medium">
                  {(risk.breakdown.artifactScore * 100).toFixed(0)}%
                </span>
              </li>
              <li className="flex justify-between gap-4">
                <span>Symmetry</span>
                <span className="font-medium">
                  {(risk.breakdown.symmetryScore * 100).toFixed(0)}%
                </span>
              </li>
            </ul>
            {explain && (
              <div className="mt-6 space-y-3 border-t border-blush/40 pt-4 text-sm leading-relaxed">
                <p>{explain.explanation}</p>
                <ul className="list-disc space-y-1 pl-5 text-espresso/80">
                  {explain.key_signals.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <p className="rounded-xl bg-blush/30 px-4 py-3 font-medium text-espresso">
                  {explain.recommendation}
                </p>
              </div>
            )}
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
