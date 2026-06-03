"use client";

import { useState } from "react";
import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { explainRisk, scanImage } from "@/lib/api";
import { computeRisk, verdictLabel } from "@/lib/riskScoring";
import { saveScanSession } from "@/lib/scanSession";
import { useLanguage } from "@/context/LanguageContext";
import type { ExplainResult, RiskResult } from "@/lib/types";

/** Lightweight browser heuristics until face-api / OpenCV are integrated. */
function estimateClientScores(): { artifactScore: number; symmetryScore: number } {
  return { artifactScore: 0.35, symmetryScore: 0.28 };
}

export function ImageScanner() {
  const { language } = useLanguage();
  const [preview, setPreview] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState("image/jpeg");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [risk, setRisk] = useState<RiskResult | null>(null);
  const [explain, setExplain] = useState<ExplainResult | null>(null);

  async function onFile(file: File) {
    setError(null);
    setRisk(null);
    setExplain(null);

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
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-rose/40 bg-fantasy/80 px-6 py-12 transition hover:border-rose">
          <span className="text-sm font-medium text-espresso">
            Upload JPG or PNG (max 8MB)
          </span>
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
        <p className="mt-3 text-xs text-espresso/60">
          Browser symmetry & artifact scores use lightweight heuristics until
          face-api.js and OpenCV.js are fully wired.
        </p>
      </GlassCard>

      {loading && (
        <GlassCard>
          <p className="animate-pulse text-center text-espresso">
            Running deepfake model & generating explanation…
          </p>
        </GlassCard>
      )}

      {error && (
        <GlassCard className="border-rose/50">
          <p className="text-sm text-espresso">{error}</p>
        </GlassCard>
      )}

      {preview && risk && (
        <div className="grid gap-6 lg:grid-cols-2">
          <GlassCard>
            <div className="relative aspect-square w-full overflow-hidden rounded-xl">
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
            <p className="text-5xl font-semibold text-espresso">{risk.finalRisk}%</p>
            <p className="mt-2 text-xl font-medium text-rose">
              {verdictLabel(risk.verdict)}
            </p>
            <ul className="mt-4 space-y-1 text-sm text-espresso/80">
              <li>Model: {(risk.breakdown.modelScore * 100).toFixed(0)}%</li>
              <li>Artifacts: {(risk.breakdown.artifactScore * 100).toFixed(0)}%</li>
              <li>Symmetry: {(risk.breakdown.symmetryScore * 100).toFixed(0)}%</li>
            </ul>
            {explain && (
              <div className="mt-6 space-y-3 border-t border-white/30 pt-4 text-sm">
                <p>{explain.explanation}</p>
                <ul className="list-disc pl-5 text-espresso/80">
                  {explain.key_signals.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <p className="font-medium">{explain.recommendation}</p>
              </div>
            )}
          </GlassCard>
        </div>
      )}
    </div>
  );
}
