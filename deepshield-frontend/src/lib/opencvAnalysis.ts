import { analyzeArtifactScore } from "@/lib/clientAnalysis";
import { withTimeout } from "@/lib/withTimeout";

const ARTIFACT_MS = 6_000;

/**
 * Artifact score for scan breakdown.
 * Uses a fast in-browser edge heuristic (no opencv.js — it often hangs on Vercel/mobile).
 */
export async function analyzeOpenCvArtifactScore(imageSrc: string): Promise<number> {
  try {
    return await withTimeout(
      analyzeArtifactScore(imageSrc),
      ARTIFACT_MS,
      "artifact analysis",
    );
  } catch {
    return 0.35;
  }
}
