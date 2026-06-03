import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

let ffmpeg: FFmpeg | null = null;

async function getFfmpeg() {
  if (ffmpeg?.loaded) return ffmpeg;
  ffmpeg = new FFmpeg();
  const base = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
  await ffmpeg.load({
    coreURL: await toBlobURL(`${base}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${base}/ffmpeg-core.wasm`, "application/wasm"),
  });
  return ffmpeg;
}

export async function extractFramesFfmpeg(
  file: File,
  fps = 1,
  maxFrames = 20,
): Promise<{ timeSec: number; dataUrl: string }[]> {
  const ff = await getFfmpeg();
  const inputName = "input" + (file.name.endsWith(".mov") ? ".mov" : ".mp4");
  await ff.writeFile(inputName, await fetchFile(file));

  await ff.exec([
    "-i",
    inputName,
    "-vf",
    `fps=${fps}`,
    "-frames:v",
    String(maxFrames),
    "frame_%03d.jpg",
  ]);

  const frames: { timeSec: number; dataUrl: string }[] = [];
  for (let i = 1; i <= maxFrames; i++) {
    const name = `frame_${String(i).padStart(3, "0")}.jpg`;
    try {
      const data = await ff.readFile(name);
      let blob: Blob;
      if (typeof data === "string") {
        blob = new Blob([Uint8Array.from(data, (c) => c.charCodeAt(0))], {
          type: "image/jpeg",
        });
      } else {
        blob = new Blob([new Uint8Array(data)], { type: "image/jpeg" });
      }
      const dataUrl = await new Promise<string>((res) => {
        const r = new FileReader();
        r.onload = () => res(r.result as string);
        r.readAsDataURL(blob);
      });
      frames.push({ timeSec: (i - 1) * fps, dataUrl });
      await ff.deleteFile(name);
    } catch {
      break;
    }
  }
  await ff.deleteFile(inputName);
  return frames;
}
