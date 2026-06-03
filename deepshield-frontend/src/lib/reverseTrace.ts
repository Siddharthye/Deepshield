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
    buildUrl: () => "https://lens.google.com/",
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

/** Best-effort public URL for reverse search-by-URL engines. */
export async function publishTraceImage(dataUrl: string): Promise<string | null> {
  try {
    const blob = await (await fetch(dataUrl)).blob();
    const fd = new FormData();
    fd.append("file", blob, "deepshield-trace.jpg");
    const res = await fetch("https://0x0.st", { method: "POST", body: fd });
    if (!res.ok) return null;
    const url = (await res.text()).trim();
    return url.startsWith("http") ? url : null;
  } catch {
    return null;
  }
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

export function openTraceSearchEngines(publicImageUrl?: string) {
  for (const engine of TRACE_SEARCH_ENGINES) {
    window.open(engine.buildUrl(publicImageUrl), "_blank", "noopener,noreferrer");
  }
}
