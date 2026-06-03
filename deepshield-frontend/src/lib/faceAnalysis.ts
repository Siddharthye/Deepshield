const MODEL_URL =
  "https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.15/model";

let ready = false;

export type FaceBox = { x: number; y: number; width: number; height: number };

async function loadFaceApi() {
  const faceapi = await import("@vladmandic/face-api");
  if (!ready) {
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    ]);
    ready = true;
  }
  return faceapi;
}

export async function getFaceBox(imageSrc: string): Promise<FaceBox | null> {
  try {
    const faceapi = await loadFaceApi();
    const img = await faceapi.fetchImage(imageSrc);
    const det = await faceapi.detectSingleFace(img);
    if (!det) return null;
    const box = det.box;
    return { x: box.x, y: box.y, width: box.width, height: box.height };
  } catch {
    return null;
  }
}

export async function analyzeFaceSymmetryScore(imageSrc: string): Promise<number> {
  try {
    const faceapi = await loadFaceApi();
    const img = await faceapi.fetchImage(imageSrc);
    const det = await faceapi.detectSingleFace(img).withFaceLandmarks();
    if (!det) return 0.32;

    const pts = det.landmarks.positions;
    const midX = pts.reduce((s, p) => s + p.x, 0) / pts.length;
    let diff = 0;
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
    for (const [a, b] of pairs) {
      const da = Math.abs(pts[a].x - midX);
      const db = Math.abs(pts[b].x - midX);
      diff += Math.abs(da - db) / Math.max(midX, 1);
    }
    const asym = diff / pairs.length;
    return Math.min(0.95, Math.max(0.08, asym * 4));
  } catch {
    return 0.32;
  }
}
