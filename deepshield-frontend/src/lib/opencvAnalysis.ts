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

let loadPromise: Promise<typeof window.cv> | null = null;

function loadOpenCv(): Promise<typeof window.cv> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("OpenCV runs in browser only"));
  }
  if (window.cv?.Mat) return Promise.resolve(window.cv);
  if (!loadPromise) {
    loadPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://docs.opencv.org/4.9.0/opencv.js";
      script.async = true;
      script.onload = () => {
        const wait = () => {
          if (window.cv?.Mat) resolve(window.cv);
          else setTimeout(wait, 80);
        };
        wait();
      };
      script.onerror = () => reject(new Error("Failed to load OpenCV.js"));
      document.head.appendChild(script);
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

/** Laplacian variance — higher often means sharper / more artifact edges. */
export async function analyzeOpenCvArtifactScore(imageSrc: string): Promise<number> {
  try {
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
  } catch {
    return 0.35;
  }
}
