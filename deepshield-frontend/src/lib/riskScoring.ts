import type { I18nKey } from "@/lib/i18n";
import type { DetectionScores, RiskResult, Verdict } from "./types";

/** Amplify weak-but-nonzero model outputs (morphs often score low on deepfake-only models). */
function calibrateModelScore(raw: number): number {
  const x = Math.min(1, Math.max(0, raw));
  if (x <= 0.02) return x;
  return Math.min(0.98, 1 - (1 - x) ** 0.65);
}

export function computeRisk(
  scores: DetectionScores,
  opts?: { modelUnavailable?: boolean },
): RiskResult {
  const model = calibrateModelScore(scores.modelScore);
  const artifact = Math.min(0.98, scores.artifactScore * 1.35);
  const symmetry = scores.symmetryScore;
  const morph = scores.morphScore ?? 0;

  const weights = opts?.modelUnavailable
    ? { model: 0, artifact: 0.3, symmetry: 0.25, morph: 0.45 }
    : { model: 0.42, artifact: 0.18, symmetry: 0.12, morph: 0.28 };

  const weighted =
    model * weights.model +
    artifact * weights.artifact +
    symmetry * weights.symmetry +
    morph * weights.morph;

  const peak = Math.max(model, artifact, symmetry, morph);
  const blended = weighted * 0.55 + peak * 0.45;

  const finalRisk = Math.round(Math.min(100, Math.max(0, blended * 100)));

  const verdict: Verdict =
    finalRisk >= 62
      ? "highly_suspicious"
      : finalRisk >= 32
        ? "likely_manipulated"
        : "authentic";

  return {
    finalRisk,
    verdict,
    breakdown: {
      modelScore: scores.modelScore,
      artifactScore: scores.artifactScore,
      symmetryScore: scores.symmetryScore,
      morphScore: scores.morphScore,
      hfModelScore: scores.hfModelScore,
      sightengineScore: scores.sightengineScore,
    },
  };
}

export function verdictLabelKey(verdict: Verdict): I18nKey {
  switch (verdict) {
    case "highly_suspicious":
      return "verdictHighlySuspicious";
    case "likely_manipulated":
      return "verdictLikelyManipulated";
    default:
      return "verdictAuthentic";
  }
}

/** @deprecated Use verdictLabelKey with t() */
export function verdictLabel(verdict: Verdict): string {
  switch (verdict) {
    case "highly_suspicious":
      return "Highly Suspicious";
    case "likely_manipulated":
      return "Likely Manipulated";
    default:
      return "Authentic";
  }
}
