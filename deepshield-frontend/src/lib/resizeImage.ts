/** Downscale uploads so client ML + API stay fast and avoid main-thread stalls. */
export async function resizeImageForScan(
  file: File,
  maxDim = 1024,
  quality = 0.82,
): Promise<{ dataUrl: string; mimeType: string }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height, 1));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("Canvas not supported");
  }
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  const mimeType = "image/jpeg";
  const dataUrl = canvas.toDataURL(mimeType, quality);
  return { dataUrl, mimeType };
}
