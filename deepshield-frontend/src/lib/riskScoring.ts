import type { I18nKey } from "@/lib/i18n";
import type { DetectionScores, RiskResult, Verdict } from "./types";

export function computeRisk(
  scores: DetectionScores,
  opts?: { modelUnavailable?: boolean },
): RiskResult {
  const weights = opts?.modelUnavailable
    ? { model: 0, artifact: 0.55, symmetry: 0.45 }
    : { model: 0.6, artifact: 0.25, symmetry: 0.15 };

  const finalRisk = Math.round(
    (scores.modelScore * weights.model +
      scores.artifactScore * weights.artifact +
      scores.symmetryScore * weights.symmetry) *
      100,
  );

  const verdict: Verdict =
    finalRisk >= 75
      ? "highly_suspicious"
      : finalRisk >= 45
        ? "likely_manipulated"
        : "authentic";

  return { finalRisk, verdict, breakdown: scores };
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
