import { withTimeout } from "@/lib/withTimeout";

const MODEL_URL =
  "https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.15/model";

const MODEL_LOAD_MS = 45_000;
const DETECT_MS = 20_000;

let ready = false;
let loadPromise: Promise<Awaited<ReturnType<typeof importFaceApi>>> | null = null;

export type FaceBox = { x: number; y: number; width: number; height: number };

export type FaceAnalysisResult = {
  symmetryScore: number;
  faceBox: FaceBox | null;
};

async function importFaceApi() {
  return import("@vladmandic/face-api");
}

async function loadFaceApi() {
  if (loadPromise) return loadPromise;
  loadPromise = withTimeout(
    (async () => {
      const faceapi = await importFaceApi();
      if (!ready) {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        ]);
        ready = true;
      }
      return faceapi;
    })(),
    MODEL_LOAD_MS,
    "face-api models",
  ).catch((e) => {
    loadPromise = null;
    throw e;
  });
  return loadPromise;
}

/** Warm models on the scan page so the first upload is faster. */
export function preloadFaceApi(): void {
  if (typeof window === "undefined") return;
  void loadFaceApi().catch(() => {
    /* fallback scores used on failure */
  });
}

function symmetryFromLandmarks(
  pts: { x: number; y: number }[],
  midX: number,
): number {
  const pairs: [number, number][] = [
    [0, 16],
    [1, 15],
    [2, 14],
    [3, 13],
    [4, 12],
    [5, 11],
    [6, 10],
    [7, 9],
  ];
  let diff = 0;
  for (const [a, b] of pairs) {
    const da = Math.abs(pts[a].x - midX);
    const db = Math.abs(pts[b].x - midX);
    diff += Math.abs(da - db) / Math.max(midX, 1);
  }
  const asym = diff / pairs.length;
  return Math.min(0.95, Math.max(0.08, asym * 4));
}

const FALLBACK: FaceAnalysisResult = { symmetryScore: 0.32, faceBox: null };

async function detectFace(imageSrc: string): Promise<FaceAnalysisResult> {
  const faceapi = await loadFaceApi();
  const img = await faceapi.fetchImage(imageSrc);
  const det = await faceapi.detectSingleFace(img).withFaceLandmarks();
  if (!det) return FALLBACK;

  const box = det.detection.box;
  const faceBox: FaceBox = {
    x: box.x,
    y: box.y,
    width: box.width,
    height: box.height,
  };
  const pts = det.landmarks.positions;
  const midX = pts.reduce((s, p) => s + p.x, 0) / pts.length;
  return {
    symmetryScore: symmetryFromLandmarks(pts, midX),
    faceBox,
  };
}

/** Single face-api pass — symmetry + box for heatmap (avoids duplicate inference). */
export async function analyzeFaceOnce(imageSrc: string): Promise<FaceAnalysisResult> {
  try {
    return await withTimeout(detectFace(imageSrc), DETECT_MS, "face detection");
  } catch {
    return FALLBACK;
  }
}

export async function getFaceBox(imageSrc: string): Promise<FaceBox | null> {
  return (await analyzeFaceOnce(imageSrc)).faceBox;
}

export async function analyzeFaceSymmetryScore(imageSrc: string): Promise<number> {
  return (await analyzeFaceOnce(imageSrc)).symmetryScore;
}
