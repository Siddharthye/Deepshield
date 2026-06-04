import type { HeatmapCell } from "@/lib/clientAnalysis";
import type { FaceBox } from "@/lib/faceAnalysis";

export const HEATMAP_GRID = 8;
export const HEATMAP_CANVAS_SIZE = 256;

export type LetterboxLayout = {
  ox: number;
  oy: number;
  dw: number;
  dh: number;
  imgW: number;
  imgH: number;
};

export function drawImageLetterboxed(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  size = HEATMAP_CANVAS_SIZE,
): LetterboxLayout {
  const scale = Math.min(1, size / Math.max(img.width, img.height, 1));
  const dw = Math.round(img.width * scale);
  const dh = Math.round(img.height * scale);
  const ox = Math.floor((size - dw) / 2);
  const oy = Math.floor((size - dh) / 2);
  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, size, size);
  ctx.drawImage(img, ox, oy, dw, dh);
  return { ox, oy, dw, dh, imgW: img.width, imgH: img.height };
}

/** Map face box (image pixels) to normalized 0–1 centers on the letterboxed canvas. */
export function faceOnLetterbox(
  faceBox: FaceBox,
  layout: LetterboxLayout,
  size = HEATMAP_CANVAS_SIZE,
): { cx: number; cy: number; rx: number; ry: number } {
  const fcx = faceBox.x + faceBox.width / 2;
  const fcy = faceBox.y + faceBox.height / 2;
  const cx = (layout.ox + (fcx / layout.imgW) * layout.dw) / size;
  const cy = (layout.oy + (fcy / layout.imgH) * layout.dh) / size;
  const rx = Math.max(0.08, ((faceBox.width / layout.imgW) * layout.dw) / size * 0.55);
  const ry = Math.max(0.08, ((faceBox.height / layout.imgH) * layout.dh) / size * 0.55);
  return { cx, cy, rx, ry };
}

export function fallbackHeatmapCells(
  grid: number,
  suspicion: number,
  face?: { cx: number; cy: number; rx: number; ry: number } | null,
): HeatmapCell[] {
  const cells: HeatmapCell[] = [];
  const base = 0.25 + Math.min(0.7, suspicion * 0.85);
  for (let y = 0; y < grid; y++) {
    for (let x = 0; x < grid; x++) {
      const gx = (x + 0.5) / grid;
      const gy = (y + 0.5) / grid;
      let intensity = base * 0.35;
      if (face) {
        const dx = (gx - face.cx) / face.rx;
        const dy = (gy - face.cy) / face.ry;
        const g = Math.exp(-(dx * dx + dy * dy));
        intensity = base * (0.25 + g * 0.75);
      } else {
        const d = Math.hypot(gx - 0.5, gy - 0.5);
        intensity = base * Math.max(0.2, 1 - d * 1.35);
      }
      cells.push({ x, y, intensity: Math.min(1, intensity) });
    }
  }
  return cells;
}

export function computeArtifactCellsFromCanvas(
  ctx: CanvasRenderingContext2D,
  layout: LetterboxLayout,
  grid: number,
  size = HEATMAP_CANVAS_SIZE,
): HeatmapCell[] {
  const cellSize = size / grid;
  const cells: HeatmapCell[] = [];

  for (let gy = 0; gy < grid; gy++) {
    for (let gx = 0; gx < grid; gx++) {
      const px = Math.floor(gx * cellSize);
      const py = Math.floor(gy * cellSize);
      const { data } = ctx.getImageData(px, py, cellSize, cellSize);
      let edge = 0;
      let n = 0;
      const w = cellSize;
      for (let y = 1; y < w - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const i = (y * w + x) * 4;
          edge +=
            Math.abs(data[i] - data[i - 4]) + Math.abs(data[i] - data[i - w * 4]);
          n++;
        }
      }
      const gxNorm = (gx + 0.5) / grid;
      const gyNorm = (gy + 0.5) / grid;
      const onImage =
        gxNorm >= layout.ox / size &&
        gxNorm <= (layout.ox + layout.dw) / size &&
        gyNorm >= layout.oy / size &&
        gyNorm <= (layout.oy + layout.dh) / size;
      const edgeScore = n ? Math.min(1, edge / (n * 220)) : 0;
      cells.push({
        x: gx,
        y: gy,
        intensity: onImage ? edgeScore : edgeScore * 0.15,
      });
    }
  }
  return cells;
}

export function boostHeatmapVisibility(
  cells: HeatmapCell[],
  suspicion: number,
): HeatmapCell[] {
  if (cells.length === 0) return cells;
  const floor = 0.12 + suspicion * 0.2;
  const scaled = cells.map((c) => ({
    ...c,
    intensity: Math.min(1, Math.max(c.intensity, floor) * (1.05 + suspicion * 0.45)),
  }));
  const maxI = Math.max(...scaled.map((c) => c.intensity), 0.01);
  if (maxI < 0.38 && suspicion >= 0.2) {
    const target = 0.42 + suspicion * 0.35;
    const gain = target / maxI;
    return scaled.map((c) => ({
      ...c,
      intensity: Math.min(1, c.intensity * gain),
    }));
  }
  return scaled;
}
