export type VideoFrameResult = {
  timeSec: number;
  dataUrl: string;
  modelScore?: number;
  finalRisk?: number;
};

export async function extractVideoFrames(
  file: File,
  intervalSec = 1,
  maxFrames = 20,
): Promise<VideoFrameResult[]> {
  const url = URL.createObjectURL(file);
  const video = document.createElement("video");
  video.src = url;
  video.muted = true;
  video.playsInline = true;

  await new Promise<void>((resolve, reject) => {
    video.onloadedmetadata = () => resolve();
    video.onerror = () => reject(new Error("Could not load video"));
  });

  const duration = video.duration;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    URL.revokeObjectURL(url);
    return [];
  }

  const frames: VideoFrameResult[] = [];
  const times: number[] = [];
  for (let t = 0; t < duration && times.length < maxFrames; t += intervalSec) {
    times.push(t);
  }
  if (times[times.length - 1] !== duration - 0.01 && times.length < maxFrames) {
    times.push(Math.max(0, duration - 0.05));
  }

  for (const timeSec of times) {
    video.currentTime = timeSec;
    await new Promise<void>((r) => {
      video.onseeked = () => r();
    });
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 360;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    frames.push({ timeSec, dataUrl: canvas.toDataURL("image/jpeg", 0.85) });
  }

  URL.revokeObjectURL(url);
  return frames;
}
