import type { FaceBox } from "@/lib/faceAnalysis";
import { withTimeout } from "@/lib/withTimeout";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image load failed"));
    img.src = src;
  });
}

type Region = { x0: number; y0: number; x1: number; y1: number };

function regionFromFace(
  imgW: number,
  imgH: number,
  faceBox: FaceBox | null | undefined,
): Region {
  if (faceBox && faceBox.width > 8 && faceBox.height > 8) {
    const padX = faceBox.width * 0.15;
    const padY = faceBox.height * 0.12;
    return {
      x0: Math.max(0, Math.floor(faceBox.x - padX)),
      y0: Math.max(0, Math.floor(faceBox.y - padY)),
      x1: Math.min(imgW, Math.ceil(faceBox.x + faceBox.width + padX)),
      y1: Math.min(imgH, Math.ceil(faceBox.y + faceBox.height + padY)),
    };
  }
  return {
    x0: Math.floor(imgW * 0.2),
    y0: Math.floor(imgH * 0.12),
    x1: Math.floor(imgW * 0.8),
    y1: Math.floor(imgH * 0.88),
  };
}

/** Left vs right half mismatch inside face region (common in morphs / face swaps). */
function halfFaceMismatch(data: Uint8ClampedArray, w: number, r: Region): number {
  const mid = Math.floor((r.x0 + r.x1) / 2);
  let diff = 0;
  let n = 0;
  for (let y = r.y0; y < r.y1; y++) {
    for (let x = r.x0; x < mid; x++) {
      const mirrorX = mid + (mid - x);
      if (mirrorX >= r.x1) continue;
      const i = (y * w + x) * 4;
      const j = (y * w + mirrorX) * 4;
      diff +=
        Math.abs(data[i] - data[j]) +
        Math.abs(data[i + 1] - data[j + 1]) +
        Math.abs(data[i + 2] - data[j + 2]);
      n++;
    }
  }
  if (!n) return 0.2;
  const norm = diff / (n * 255 * 3);
  return Math.min(0.95, Math.max(0.12, norm * 4.8));
}

/** Left vs right eye-band color mismatch (e.g. different eye colors in a morph). */
function eyeBandAsymmetry(data: Uint8ClampedArray, w: number, r: Region): number {
  const bandH = Math.max(8, Math.floor((r.y1 - r.y0) * 0.42));
  const y0 = r.y0 + Math.floor((r.y1 - r.y0) * 0.18);
  const y1 = Math.min(r.y1, y0 + bandH);
  const mid = Math.floor((r.x0 + r.x1) / 2);
  const left: number[] = [0, 0, 0];
  const right: number[] = [0, 0, 0];
  let ln = 0;
  let rn = 0;

  for (let y = y0; y < y1; y++) {
    for (let x = r.x0; x < mid; x++) {
      const i = (y * w + x) * 4;
      left[0] += data[i];
      left[1] += data[i + 1];
      left[2] += data[i + 2];
      ln++;
    }
    for (let x = mid; x < r.x1; x++) {
      const i = (y * w + x) * 4;
      right[0] += data[i];
      right[1] += data[i + 1];
      right[2] += data[i + 2];
      rn++;
    }
  }
  if (!ln || !rn) return 0.15;

  const lc = left.map((v) => v / ln);
  const rc = right.map((v) => v / rn);
  const diff =
    (Math.abs(lc[0] - rc[0]) + Math.abs(lc[1] - rc[1]) + Math.abs(lc[2] - rc[2])) /
    (255 * 3);
  return Math.min(0.95, Math.max(0.15, diff * 5.5));
}

/** Strong vertical edge on face midline (blend seam). */
function centerSeamScore(data: Uint8ClampedArray, w: number, r: Region): number {
  const mid = Math.floor((r.x0 + r.x1) / 2);
  let seam = 0;
  let n = 0;
  for (let y = r.y0 + 1; y < r.y1 - 1; y++) {
    for (const x of [mid - 1, mid, mid + 1]) {
      if (x <= r.x0 || x >= r.x1 - 1) continue;
      const i = (y * w + x) * 4;
      const gx =
        Math.abs(data[i] - data[i - 4]) +
        Math.abs(data[i + 1] - data[i - 3]) +
        Math.abs(data[i + 2] - data[i - 2]);
      seam += gx;
      n++;
    }
  }
  if (!n) return 0.15;
  const norm = seam / (n * 255 * 3);
  return Math.min(0.95, Math.max(0.1, norm * 4.5));
}

/** ELA-lite: recompress and measure residual (patches / splicing). */
async function elaScore(canvas: HTMLCanvasElement): Promise<number> {
  try {
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", 0.88),
    );
    if (!blob) return 0.2;
    const url = URL.createObjectURL(blob);
    try {
      const recompressed = await loadImage(url);
      const w = canvas.width;
      const h = canvas.height;
      const c2 = document.createElement("canvas");
      c2.width = w;
      c2.height = h;
      const ctx2 = c2.getContext("2d");
      if (!ctx2) return 0.2;
      ctx2.drawImage(recompressed, 0, 0, w, h);
      const a = canvas.getContext("2d")!.getImageData(0, 0, w, h).data;
      const b = ctx2.getImageData(0, 0, w, h).data;
      let diff = 0;
      let n = 0;
      for (let i = 0; i < a.length; i += 4) {
        diff +=
          Math.abs(a[i] - b[i]) +
          Math.abs(a[i + 1] - b[i + 1]) +
          Math.abs(a[i + 2] - b[i + 2]);
        n++;
      }
      const norm = diff / (n * 255 * 3);
      return Math.min(0.95, Math.max(0.1, norm * 5));
    } finally {
      URL.revokeObjectURL(url);
    }
  } catch {
    return 0.2;
  }
}

/**
 * Heuristic morph / face-swap score (0–1). Complements HF deepfake model.
 */
export async function analyzeMorphScore(
  imageSrc: string,
  faceBox?: FaceBox | null,
): Promise<number> {
  const img = await withTimeout(loadImage(imageSrc), 5_000, "morph load");
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return 0.35;

  const scale = Math.min(1, size / Math.max(img.width, img.height, 1));
  const dw = Math.round(img.width * scale);
  const dh = Math.round(img.height * scale);
  const ox = Math.floor((size - dw) / 2);
  const oy = Math.floor((size - dh) / 2);
  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, size, size);
  ctx.drawImage(img, ox, oy, dw, dh);

  const { data } = ctx.getImageData(0, 0, size, size);
  const boxOnCanvas: FaceBox | null = faceBox
    ? {
        x: ox + faceBox.x * scale,
        y: oy + faceBox.y * scale,
        width: faceBox.width * scale,
        height: faceBox.height * scale,
      }
    : null;
  const region = regionFromFace(size, size, boxOnCanvas);

  const half = halfFaceMismatch(data, size, region);
  const seam = centerSeamScore(data, size, region);
  const eyes = eyeBandAsymmetry(data, size, region);
  const ela = await elaScore(canvas);

  const combined =
    Math.max(half, eyes) * 0.4 + seam * 0.3 + eyes * 0.2 + ela * 0.1;
  return Math.min(0.95, Math.max(0.15, combined));
}
