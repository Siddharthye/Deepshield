/** User-facing scan errors (hide raw upstream stack traces). */
export function formatScanError(message: string): string {
  const m = message.toLowerCase();
  if (
    m.includes("hf deepfake") ||
    m.includes("hypererror") ||
    m.includes("scheme is not http") ||
    m.includes("upstream")
  ) {
    return "scanServiceUnavailable";
  }
  if (m.includes("rate limit") || m.includes("429")) {
    return "scanRateLimited";
  }
  if (m.includes("too large") || m.includes("413")) {
    return "scanImageTooLarge";
  }
  return message;
}
