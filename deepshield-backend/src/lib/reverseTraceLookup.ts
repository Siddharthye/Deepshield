export type TraceLookupHit = {
  platform: string;
  title: string;
  url: string;
  firstSeen: string;
};

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

function detectPlatform(url: string): string {
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
    return decodeURIComponent(last).replace(/[-_+]/g, " ").slice(0, 80) || u.hostname;
  } catch {
    return url.slice(0, 80);
  }
}

function normalizeUrl(raw: string): string | null {
  try {
    const u = new URL(raw.trim());
    if (!/^https?:$/i.test(u.protocol)) return null;
    return u.toString();
  } catch {
    return null;
  }
}

function addHit(seen: Set<string>, hits: TraceLookupHit[], url: string, title?: string) {
  const normalized = normalizeUrl(url);
  if (!normalized || seen.has(normalized)) return;
  seen.add(normalized);
  hits.push({
    platform: detectPlatform(normalized),
    title: (title?.trim() || titleFromUrl(normalized)).slice(0, 120),
    url: normalized,
    firstSeen: new Date().toISOString().slice(0, 10),
  });
}

async function fetchYandex(imageUrl: string): Promise<TraceLookupHit[]> {
  const endpoint = `https://yandex.com/images/search?rpt=imageview&url=${encodeURIComponent(imageUrl)}&format=json`;
  const res = await fetch(endpoint, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      Accept: "application/json,text/plain,*/*",
    },
    signal: AbortSignal.timeout(12_000),
  });
  if (!res.ok) return [];

  const data = (await res.json()) as {
    blocks?: Array<{
      params?: { text?: Array<{ title?: string; url?: string }> };
      sites?: Array<{ title?: string; url?: string; link?: string }>;
    }>;
  };

  const seen = new Set<string>();
  const hits: TraceLookupHit[] = [];

  for (const block of data.blocks ?? []) {
    for (const site of block.sites ?? []) {
      const url = site.url ?? site.link;
      if (url) addHit(seen, hits, url, site.title);
    }
    for (const row of block.params?.text ?? []) {
      if (row.url) addHit(seen, hits, row.url, row.title);
    }
  }

  return hits;
}

async function fetchSerpApi(imageUrl: string): Promise<TraceLookupHit[]> {
  const key = process.env.SERPAPI_API_KEY?.trim();
  if (!key) return [];

  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("engine", "google_lens");
  url.searchParams.set("url", imageUrl);
  url.searchParams.set("api_key", key);

  const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
  if (!res.ok) return [];

  const data = (await res.json()) as {
    visual_matches?: Array<{ title?: string; link?: string; source?: string }>;
    exact_matches?: Array<{ title?: string; link?: string; source?: string }>;
  };

  const seen = new Set<string>();
  const hits: TraceLookupHit[] = [];

  for (const row of [...(data.visual_matches ?? []), ...(data.exact_matches ?? [])]) {
    if (row.link) addHit(seen, hits, row.link, row.title ?? row.source);
  }

  return hits;
}

/** Extract outbound links from Bing visual search HTML (best-effort). */
async function fetchBingHtml(imageUrl: string): Promise<TraceLookupHit[]> {
  const pageUrl = `https://www.bing.com/images/search?view=detailv2&iss=sbi&form=SBIIDP&sbisrc=ImgDropper&q=imgurl:${encodeURIComponent(imageUrl)}`;
  const res = await fetch(pageUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    },
    signal: AbortSignal.timeout(12_000),
  });
  if (!res.ok) return [];

  const html = await res.text();
  const seen = new Set<string>();
  const hits: TraceLookupHit[] = [];
  const linkRegex = /"(?:murl|purl|imgurl|url)":"(https?:\\\/\\\/[^"]+)"/gi;
  let match: RegExpExecArray | null;
  while ((match = linkRegex.exec(html)) !== null) {
    const raw = match[1].replace(/\\\//g, "/");
    addHit(seen, hits, raw);
  }
  return hits;
}

export async function lookupReverseImage(imageUrl: string): Promise<{
  hits: TraceLookupHit[];
  sources: string[];
}> {
  const seen = new Set<string>();
  const merged: TraceLookupHit[] = [];
  const sources: string[] = [];

  const addBatch = (label: string, batch: TraceLookupHit[]) => {
    if (batch.length === 0) return;
    sources.push(label);
    for (const hit of batch) {
      if (seen.has(hit.url)) continue;
      seen.add(hit.url);
      merged.push(hit);
    }
  };

  const [yandex, serp, bing] = await Promise.all([
    fetchYandex(imageUrl).catch(() => []),
    fetchSerpApi(imageUrl).catch(() => []),
    fetchBingHtml(imageUrl).catch(() => []),
  ]);

  addBatch("yandex", yandex);
  addBatch("serpapi", serp);
  addBatch("bing", bing);

  return { hits: merged.slice(0, 40), sources };
}

export async function publishImageBase64(dataUrl: string): Promise<string | null> {
  try {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const fd = new FormData();
    fd.append("file", blob, "deepshield-trace.jpg");
    const up = await fetch("https://0x0.st", { method: "POST", body: fd });
    if (!up.ok) return null;
    const url = (await up.text()).trim();
    return url.startsWith("http") ? url : null;
  } catch {
    return null;
  }
}
