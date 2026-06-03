import type { HeatmapCell } from "@/lib/clientAnalysis";
import { buildArtifactHeatmap } from "@/lib/clientAnalysis";
import { getFaceBox } from "@/lib/faceAnalysis";

/** Grad-CAM fallback: artifact density + model-weighted face-region saliency. */
export async function buildModelGuidedHeatmap(
  imageSrc: string,
  modelScore: number,
  grid = 8,
): Promise<HeatmapCell[]> {
  const [cells, face] = await Promise.all([
    buildArtifactHeatmap(imageSrc, grid),
    getFaceBox(imageSrc),
  ]);

  if (!face) {
    return cells.map((c) => ({
      ...c,
      intensity: Math.min(1, c.intensity * (0.5 + modelScore * 0.5)),
    }));
  }

  const img = await loadImageSize(imageSrc);
  const cx = (face.x + face.width / 2) / img.width;
  const cy = (face.y + face.height / 2) / img.height;
  const rx = (face.width / img.width) * 0.6;
  const ry = (face.height / img.height) * 0.6;

  return cells.map((c) => {
    const gx = (c.x + 0.5) / grid;
    const gy = (c.y + 0.5) / grid;
    const dx = (gx - cx) / rx;
    const dy = (gy - cy) / ry;
    const gaussian = Math.exp(-(dx * dx + dy * dy));
    const saliency = gaussian * modelScore;
    return {
      ...c,
      intensity: Math.min(1, c.intensity * 0.45 + saliency * 0.55),
    };
  });
}

function loadImageSize(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = src;
  });
}
