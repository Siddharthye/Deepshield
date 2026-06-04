import type { HeatmapCell } from "@/lib/clientAnalysis";
import { buildArtifactHeatmap } from "@/lib/clientAnalysis";
import type { FaceBox } from "@/lib/faceAnalysis";

function normalizeCells(
  cells: HeatmapCell[],
  modelScore: number,
): HeatmapCell[] {
  let out = cells.map((c) => ({
    ...c,
    intensity: Math.min(1, Math.max(c.intensity, 0.12) * 1.15),
  }));
  if (out.length === 0 || out.every((c) => c.intensity < 0.08)) {
    out = Array.from({ length: 64 }, (_, i) => ({
      x: i % 8,
      y: Math.floor(i / 8),
      intensity: 0.2 + modelScore * 0.45,
    }));
  }
  return out;
}

/** Grad-CAM fallback: artifact density + model-weighted face-region saliency. */
export async function buildModelGuidedHeatmap(
  imageSrc: string,
  modelScore: number,
  grid = 8,
  faceBox: FaceBox | null = null,
  morphScore = 0,
): Promise<HeatmapCell[]> {
  const saliencyBoost = Math.min(1, Math.max(modelScore, morphScore * 0.85));
  const cells = await buildArtifactHeatmap(imageSrc, grid);

  if (!faceBox) {
    return normalizeCells(
      cells.map((c) => ({
        ...c,
        intensity: Math.min(1, c.intensity * (0.5 + saliencyBoost * 0.55)),
      })),
      saliencyBoost,
    );
  }

  const img = await loadImageSize(imageSrc);
  const cx = (faceBox.x + faceBox.width / 2) / img.width;
  const cy = (faceBox.y + faceBox.height / 2) / img.height;
  const rx = (faceBox.width / img.width) * 0.6;
  const ry = (faceBox.height / img.height) * 0.6;

  const weighted = cells.map((c) => {
    const gx = (c.x + 0.5) / grid;
    const gy = (c.y + 0.5) / grid;
    const dx = (gx - cx) / rx;
    const dy = (gy - cy) / ry;
    const gaussian = Math.exp(-(dx * dx + dy * dy));
    const saliency = gaussian * saliencyBoost;
    const morphBoost = morphScore > 0.35 ? gaussian * morphScore * 0.35 : 0;
    return {
      ...c,
      intensity: Math.min(1, c.intensity * 0.4 + saliency * 0.5 + morphBoost),
    };
  });

  return normalizeCells(weighted, saliencyBoost);
}

function loadImageSize(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = src;
  });
}
