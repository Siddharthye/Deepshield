import type { HeatmapCell } from "./clientAnalysis";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Renders base image + heatmap grid to a PNG data URL (for PDF / vault). */
export async function exportHeatmapDataUrl(
  imageSrc: string,
  cells: HeatmapCell[],
  grid = 8,
  width = 640,
): Promise<string> {
  const img = await loadImage(imageSrc);
  const height = Math.round((width * img.height) / img.width);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return imageSrc;

  ctx.drawImage(img, 0, 0, width, height);
  const cw = width / grid;
  const ch = height / grid;

  cells.forEach((c) => {
    const alpha = 0.22 + c.intensity * 0.68;
    ctx.fillStyle = `rgba(214, 90, 110, ${alpha})`;
    ctx.fillRect(c.x * cw, c.y * ch, cw, ch);
  });

  return canvas.toDataURL("image/png");
}
