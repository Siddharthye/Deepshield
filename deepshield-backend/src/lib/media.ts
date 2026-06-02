export const SUPPORTED_IMAGE_MIME_TYPES = ["image/png", "image/jpeg", "image/webp"] as const;

export type SupportedImageMime = (typeof SUPPORTED_IMAGE_MIME_TYPES)[number];

export function isSupportedImageMime(mimeType: string): mimeType is SupportedImageMime {
  return (SUPPORTED_IMAGE_MIME_TYPES as readonly string[]).includes(mimeType);
}

export function stripDataUrlPrefix(dataUrl: string): { base64: string; mimeTypeFromPrefix?: string } {
  // Accept either raw base64 or data-url.
  if (!dataUrl.startsWith("data:")) return { base64: dataUrl };
  const match = dataUrl.match(/^data:([^;]+);base64,(.*)$/);
  if (!match) return { base64: dataUrl };
  const mimeTypeFromPrefix = match[1];
  const base64 = match[2];
  return { base64, mimeTypeFromPrefix };
}

export function assertBase64SizeLimits(args: { base64: string; decodedBytesMax: number }) {
  // Rough guard before decoding.
  // base64 expands ~4/3. We allow some slack.
  const approxDecoded = (args.base64.length * 3) / 4;
  if (approxDecoded > args.decodedBytesMax) {
    const err: any = new Error("Payload too large");
    err.code = "PAYLOAD_TOO_LARGE";
    throw err;
  }
}

