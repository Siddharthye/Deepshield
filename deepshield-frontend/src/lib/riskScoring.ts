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
    ? { model: 0, artifact: 0.22, symmetry: 0.18, morph: 0.6 }
    : { model: 0.32, artifact: 0.14, symmetry: 0.1, morph: 0.44 };

  const weighted =
    model * weights.model +
    artifact * weights.artifact +
    symmetry * weights.symmetry +
    morph * weights.morph;

  const peak = Math.max(model, artifact, symmetry, morph);
  let blended = weighted * 0.5 + peak * 0.5;

  // Server models often miss subtle morphs; trust visible blend / eye mismatch cues.
  if (morph >= 0.22 && model < 0.25) {
    blended = Math.max(blended, morph * 0.92);
  }
  if (morph >= 0.3) {
    blended = Math.max(blended, 0.42);
  }
  if (morph >= 0.4) {
    blended = Math.max(blended, 0.58);
  }

  const finalRisk = Math.round(Math.min(100, Math.max(0, blended * 100)));

  const verdict: Verdict =
    finalRisk >= 58
      ? "highly_suspicious"
      : finalRisk >= 28
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
