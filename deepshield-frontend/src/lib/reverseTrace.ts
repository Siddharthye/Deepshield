import type { TraceHit } from "./traceStorage";

const PLATFORM_RULES: { match: RegExp; name: string }[] = [
  { match: /instagram\.com/i, name: "Instagram" },
  { match: /facebook\.com|fb\.com/i, name: "Facebook" },
  { match: /twitter\.com|x\.com/i, name: "X (Twitter)" },
  { match: /telegram\.org|t\.me/i, name: "Telegram" },
  { match: /reddit\.com/i, name: "Reddit" },
  { match: /pinterest\./i, name: "Pinterest" },
  { match: /tiktok\.com/i, name: "TikTok" },
  { match: /youtube\.com|youtu\.be/i, name: "YouTube" },
  { match: /linkedin\.com/i, name: "LinkedIn" },
  { match: /whatsapp\.com/i, name: "WhatsApp" },
  { match: /snapchat\.com/i, name: "Snapchat" },
];

export function detectPlatform(url: string): string {
  for (const { match, name } of PLATFORM_RULES) {
    if (match.test(url)) return name;
  }
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return host.split(".")[0]?.replace(/-/g, " ") || "Web";
  } catch {
    return "Web";
  }
}

function titleFromUrl(url: string): string {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1] || u.hostname;
    const decoded = decodeURIComponent(last).replace(/[-_+]/g, " ");
    return decoded.slice(0, 80) || u.hostname;
  } catch {
    return url.slice(0, 80);
  }
}

export function parseTraceUrlsFromText(text: string): TraceHit[] {
  const urlRegex = /https?:\/\/[^\s<>"')\]]+/gi;
  const seen = new Set<string>();
  const hits: TraceHit[] = [];
  const matches = text.match(urlRegex) ?? [];

  for (const raw of matches) {
    const url = raw.replace(/[.,;:!?)]+$/, "");
    if (!url || seen.has(url)) continue;
    seen.add(url);
    hits.push({
      id: crypto.randomUUID(),
      platform: detectPlatform(url),
      title: titleFromUrl(url),
      url,
      firstSeen: new Date().toISOString().slice(0, 10),
    });
  }
  return hits;
}

export type TraceSearchEngine = {
  id: string;
  labelKey: "traceOpenLens" | "traceOpenTinEye" | "traceOpenBing" | "traceOpenYandex";
  buildUrl: (publicImageUrl?: string) => string;
};

export const TRACE_SEARCH_ENGINES: TraceSearchEngine[] = [
  {
    id: "lens",
    labelKey: "traceOpenLens",
    buildUrl: (url) =>
      url
        ? `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(url)}`
        : "https://lens.google.com/",
  },
  {
    id: "tineye",
    labelKey: "traceOpenTinEye",
    buildUrl: (url) =>
      url ? `https://tineye.com/search?url=${encodeURIComponent(url)}` : "https://tineye.com/",
  },
  {
    id: "bing",
    labelKey: "traceOpenBing",
    buildUrl: (url) =>
      url
        ? `https://www.bing.com/images/search?view=detailv2&iss=sbi&form=SBIIDP&q=imgurl:${encodeURIComponent(url)}`
        : "https://www.bing.com/visualsearch",
  },
  {
    id: "yandex",
    labelKey: "traceOpenYandex",
    buildUrl: (url) =>
      url
        ? `https://yandex.com/images/search?rpt=imageview&url=${encodeURIComponent(url)}`
        : "https://yandex.com/images/",
  },
];

/** Best-effort public URL for reverse search-by-URL engines (via same-origin API). */
export async function publishTraceImage(dataUrl: string): Promise<string> {
  const { resizeDataUrlForTrace } = await import("./resizeImage");
  const { uploadTraceImageFile } = await import("./api");
  const resized = await resizeDataUrlForTrace(dataUrl);
  const blob = await (await fetch(resized)).blob();
  const type = blob.type || "image/jpeg";
  const ext = type.includes("png") ? "png" : "jpg";
  return uploadTraceImageFile(blob, `deepshield-trace.${ext}`);
}

export async function copyImageToClipboard(dataUrl: string): Promise<boolean> {
  try {
    const blob = await (await fetch(dataUrl)).blob();
    if (!navigator.clipboard?.write || !window.ClipboardItem) return false;
    const type = blob.type || "image/png";
    await navigator.clipboard.write([new ClipboardItem({ [type]: blob })]);
    return true;
  } catch {
    return false;
  }
}

/** Opens one reverse-search tab (Bing) — avoids popup spam. */
export function openTraceSearchEngines(publicImageUrl?: string) {
  const bing = TRACE_SEARCH_ENGINES.find((e) => e.id === "bing");
  const url = bing?.buildUrl(publicImageUrl) ?? "https://www.bing.com/visualsearch";
  window.open(url, "_blank", "noopener,noreferrer");
}

/** Optional: open TinEye, Yandex, and Lens as well (user-initiated). */
export function openAllTraceSearchEngines(publicImageUrl?: string) {
  for (const engine of TRACE_SEARCH_ENGINES) {
    window.open(engine.buildUrl(publicImageUrl), "_blank", "noopener,noreferrer");
  }
}
