import { withTimeout } from "@/lib/withTimeout";

/** Browser-side artifact & symmetry heuristics (canvas edge pass; no opencv.js). */

export async function analyzeArtifactScore(imageSrc: string): Promise<number> {
  const img = await withTimeout(loadImage(imageSrc), 5_000, "load image");
  const canvas = document.createElement("canvas");
  const size = 128;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return 0.35;

  ctx.drawImage(img, 0, 0, size, size);
  const { data } = ctx.getImageData(0, 0, size, size);

  let edgeSum = 0;
  let count = 0;
  for (let y = 1; y < size - 1; y++) {
    for (let x = 1; x < size - 1; x++) {
      const i = (y * size + x) * 4;
      const gx = Math.abs(data[i] - data[i - 4]);
      const gy = Math.abs(data[i] - data[i - size * 4]);
      edgeSum += gx + gy;
      count++;
    }
  }
  const avgEdge = edgeSum / (count * 255 * 2);
  return Math.min(0.95, Math.max(0.1, avgEdge * 2.2));
}

export async function analyzeSymmetryScore(imageSrc: string): Promise<number> {
  const img = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  const w = 128;
  const h = 128;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return 0.3;

  ctx.drawImage(img, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);

  let diff = 0;
  let pixels = 0;
  const mid = Math.floor(w / 2);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < mid; x++) {
      const left = (y * w + x) * 4;
      const right = (y * w + (w - 1 - x)) * 4;
      diff +=
        Math.abs(data[left] - data[right]) +
        Math.abs(data[left + 1] - data[right + 1]) +
        Math.abs(data[left + 2] - data[right + 2]);
      pixels++;
    }
  }
  const asymmetry = diff / (pixels * 255 * 3);
  return Math.min(0.95, Math.max(0.08, asymmetry * 1.8));
}

export type HeatmapCell = { x: number; y: number; intensity: number };

export async function buildArtifactHeatmap(
  imageSrc: string,
  grid = 8,
): Promise<HeatmapCell[]> {
  const {
    drawImageLetterboxed,
    computeArtifactCellsFromCanvas,
    HEATMAP_CANVAS_SIZE,
  } = await import("@/lib/heatmapBuilder");
  const img = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  const size = HEATMAP_CANVAS_SIZE;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return [];

  const layout = drawImageLetterboxed(ctx, img, size);
  return computeArtifactCellsFromCanvas(ctx, layout, grid, size);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image load failed"));
    img.src = src;
  });
}
