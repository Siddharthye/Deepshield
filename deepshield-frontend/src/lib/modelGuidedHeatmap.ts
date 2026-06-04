import type { HeatmapCell } from "@/lib/clientAnalysis";
import type { FaceBox } from "@/lib/faceAnalysis";
import {
  boostHeatmapVisibility,
  computeArtifactCellsFromCanvas,
  drawImageLetterboxed,
  faceOnLetterbox,
  fallbackHeatmapCells,
  HEATMAP_CANVAS_SIZE,
  HEATMAP_GRID,
} from "@/lib/heatmapBuilder";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image load failed"));
    img.src = src;
  });
}

function normalizeCells(cells: HeatmapCell[], suspicion: number): HeatmapCell[] {
  let out = boostHeatmapVisibility(cells, suspicion);
  if (out.length === 0 || out.every((c) => c.intensity < 0.1)) {
    out = fallbackHeatmapCells(HEATMAP_GRID, suspicion);
  }
  return out;
}

/** Saliency heatmap: artifact edges + face/morph-weighted regions. */
export async function buildModelGuidedHeatmap(
  imageSrc: string,
  modelScore: number,
  grid = HEATMAP_GRID,
  faceBox: FaceBox | null = null,
  morphScore = 0,
): Promise<HeatmapCell[]> {
  const suspicion = Math.min(1, Math.max(modelScore, morphScore, modelScore + morphScore * 0.35));

  try {
    const img = await loadImage(imageSrc);
    const canvas = document.createElement("canvas");
    const size = HEATMAP_CANVAS_SIZE;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return fallbackHeatmapCells(grid, suspicion);

    const layout = drawImageLetterboxed(ctx, img, size);
    const cells = computeArtifactCellsFromCanvas(ctx, layout, grid, size);
    const saliencyBoost = Math.min(1, Math.max(suspicion, 0.15));

    if (!faceBox) {
      return normalizeCells(
        cells.map((c) => ({
          ...c,
          intensity: Math.min(1, c.intensity * (0.55 + saliencyBoost * 0.65)),
        })),
        suspicion,
      );
    }

    const face = faceOnLetterbox(faceBox, layout, size);

    const weighted = cells.map((c) => {
      const gx = (c.x + 0.5) / grid;
      const gy = (c.y + 0.5) / grid;
      const dx = (gx - face.cx) / face.rx;
      const dy = (gy - face.cy) / face.ry;
      const gaussian = Math.exp(-(dx * dx + dy * dy));
      const saliency = gaussian * saliencyBoost;
      const morphBoost = morphScore > 0.18 ? gaussian * morphScore * 0.55 : 0;
      const seamBoost =
        morphScore > 0.18 && Math.abs(gx - 0.5) < 0.08 ? morphScore * 0.45 : 0;
      return {
        ...c,
        intensity: Math.min(
          1,
          c.intensity * 0.35 + saliency * 0.55 + morphBoost + seamBoost,
        ),
      };
    });

    return normalizeCells(weighted, suspicion);
  } catch {
    return fallbackHeatmapCells(grid, suspicion);
  }
}
