/** Same-origin proxy for trace match thumbnails (rewrites to backend). */
export function traceThumbnailProxySrc(thumbnailUrl: string | undefined): string | null {
  if (!thumbnailUrl?.startsWith("http")) return null;
  return `/api/trace-image-proxy?url=${encodeURIComponent(thumbnailUrl)}`;
}
