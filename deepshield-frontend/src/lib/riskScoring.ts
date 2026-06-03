import type { I18nKey } from "@/lib/i18n";
import type { DetectionScores, RiskResult, Verdict } from "./types";

export function computeRisk(scores: DetectionScores): RiskResult {
  const finalRisk = Math.round(
    (scores.modelScore * 0.6 +
      scores.artifactScore * 0.25 +
      scores.symmetryScore * 0.15) *
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
