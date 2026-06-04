import { analyzeArtifactScore } from "@/lib/clientAnalysis";
import { withTimeout } from "@/lib/withTimeout";

declare global {
  interface Window {
    cv?: {
      Mat: new () => CvMat;
      matFromImageData: (d: ImageData) => CvMat;
      Laplacian: (src: CvMat, dst: CvMat, dtype: number) => void;
      CV_64F: number;
      meanStdDev: (src: CvMat, mean: CvMat, std: CvMat) => void;
      [key: string]: unknown;
    };
  }
}

type CvMat = {
  delete: () => void;
  cols: number;
  rows: number;
};

const OPENCV_SCRIPT = "https://docs.opencv.org/4.9.0/opencv.js";
const LOAD_MS = 12_000;
const ANALYZE_MS = 8_000;

let loadPromise: Promise<typeof window.cv> | null = null;

function loadOpenCv(): Promise<typeof window.cv> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("OpenCV runs in browser only"));
  }
  if (window.cv?.Mat) return Promise.resolve(window.cv);
  if (!loadPromise) {
    loadPromise = withTimeout(
      new Promise<NonNullable<typeof window.cv>>((resolve, reject) => {
        const existing = document.querySelector(`script[src="${OPENCV_SCRIPT}"]`);
        const startWait = () => {
          const deadline = Date.now() + LOAD_MS;
          const wait = () => {
            if (window.cv?.Mat) {
              resolve(window.cv);
              return;
            }
            if (Date.now() > deadline) {
              reject(new Error("OpenCV init timeout"));
              return;
            }
            setTimeout(wait, 80);
          };
          wait();
        };

        if (existing) {
          startWait();
          return;
        }

        const script = document.createElement("script");
        script.src = OPENCV_SCRIPT;
        script.async = true;
        script.onload = startWait;
        script.onerror = () => reject(new Error("Failed to load OpenCV.js"));
        document.head.appendChild(script);
      }),
      LOAD_MS + 2_000,
      "OpenCV load",
    ).catch((e) => {
      loadPromise = null;
      throw e;
    });
  }
  return loadPromise;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function laplacianScore(imageSrc: string): Promise<number> {
  const cv = await loadOpenCv();
  const img = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx || !cv) return 0.35;
  ctx.drawImage(img, 0, 0, 256, 256);
  const imageData = ctx.getImageData(0, 0, 256, 256);
  const src = cv.matFromImageData(imageData);
  const dst = new cv.Mat();
  const mean = new cv.Mat();
  const stddev = new cv.Mat();
  cv.Laplacian(src, dst, cv.CV_64F);
  cv.meanStdDev(dst, mean, stddev);
  const variance = (stddev as unknown as { data64F: Float64Array }).data64F[0] ** 2;
  src.delete();
  dst.delete();
  mean.delete();
  stddev.delete();
  const normalized = Math.min(1, variance / 1200);
  return Math.max(0.1, normalized);
}

/** Laplacian variance when OpenCV loads; fast canvas fallback otherwise. */
export async function analyzeOpenCvArtifactScore(imageSrc: string): Promise<number> {
  try {
    return await withTimeout(laplacianScore(imageSrc), ANALYZE_MS, "OpenCV analyze");
  } catch {
    return analyzeArtifactScore(imageSrc);
  }
}
