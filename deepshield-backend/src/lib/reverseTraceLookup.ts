export type TraceLookupHit = {
  platform: string;
  title: string;
  url: string;
  firstSeen: string;
  thumbnailUrl?: string;
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

function normalizeThumb(raw: unknown): string | undefined {
  if (typeof raw !== "string" || !raw.startsWith("http")) return undefined;
  return normalizeUrl(raw) ?? undefined;
}

function addHit(
  seen: Set<string>,
  hits: TraceLookupHit[],
  url: string,
  opts?: { title?: string; thumbnailUrl?: string },
) {
  const normalized = normalizeUrl(url);
  if (!normalized || seen.has(normalized)) return;
  seen.add(normalized);
  hits.push({
    platform: detectPlatform(normalized),
    title: (opts?.title?.trim() || titleFromUrl(normalized)).slice(0, 120),
    url: normalized,
    firstSeen: new Date().toISOString().slice(0, 10),
    thumbnailUrl: opts?.thumbnailUrl,
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
      if (url) addHit(seen, hits, url, { title: site.title });
    }
    for (const row of block.params?.text ?? []) {
      if (row.url) addHit(seen, hits, row.url, { title: row.title });
    }
  }

  return hits;
}

export function getConfiguredLookupProviders(): string[] {
  const providers: string[] = [];
  if (process.env.SERPAPI_API_KEY?.trim()) providers.push("serpapi");
  if (process.env.SERPER_API_KEY?.trim()) providers.push("serper");
  return providers;
}

function addLensRows(
  seen: Set<string>,
  hits: TraceLookupHit[],
  rows: Array<Record<string, unknown>>,
) {
  for (const row of rows) {
    const pageUrl =
      typeof row.link === "string"
        ? row.link
        : typeof row.url === "string" && !String(row.url).match(/\.(jpe?g|png|webp|gif)(\?|$)/i)
          ? row.url
          : undefined;
    const imageOnly =
      typeof row.image === "string"
        ? row.image
        : typeof row.imageUrl === "string"
          ? row.imageUrl
          : undefined;
    const target = pageUrl ?? imageOnly;
    if (!target) continue;

    const title = row.title ?? row.source ?? row.name;
    const thumbnailUrl =
      normalizeThumb(row.thumbnail) ??
      normalizeThumb(row.thumbnailUrl) ??
      normalizeThumb(row.image) ??
      normalizeThumb(row.imageUrl);

    addHit(seen, hits, target, {
      title: typeof title === "string" ? title : undefined,
      thumbnailUrl: thumbnailUrl && thumbnailUrl !== normalizeUrl(target) ? thumbnailUrl : thumbnailUrl,
    });
  }
}

async function fetchSerpApi(imageUrl: string): Promise<TraceLookupHit[]> {
  const key = process.env.SERPAPI_API_KEY?.trim();
  if (!key) return [];

  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("engine", "google_lens");
  url.searchParams.set("url", imageUrl);
  url.searchParams.set("api_key", key);

  const res = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  if (!res.ok) return [];

  const data = (await res.json()) as {
    visual_matches?: Array<Record<string, unknown>>;
    exact_matches?: Array<Record<string, unknown>>;
    image_results?: Array<Record<string, unknown>>;
  };

  const seen = new Set<string>();
  const hits: TraceLookupHit[] = [];
  addLensRows(seen, hits, data.visual_matches ?? []);
  addLensRows(seen, hits, data.exact_matches ?? []);
  addLensRows(seen, hits, data.image_results ?? []);
  return hits;
}

async function fetchSerperLens(imageUrl: string): Promise<TraceLookupHit[]> {
  const key = process.env.SERPER_API_KEY?.trim();
  if (!key) return [];

  const res = await fetch("https://google.serper.dev/lens", {
    method: "POST",
    headers: {
      "X-API-KEY": key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: imageUrl }),
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) return [];

  const data = (await res.json()) as Record<string, unknown>;
  const seen = new Set<string>();
  const hits: TraceLookupHit[] = [];
  const lists = [
    data.visualMatches,
    data.visual_matches,
    data.organic,
    data.images,
  ];
  for (const list of lists) {
    if (Array.isArray(list)) addLensRows(seen, hits, list as Array<Record<string, unknown>>);
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

/** Prefer direct file URLs for reverse-search APIs. */
export function normalizeSearchImageUrl(imageUrl: string): string {
  const trimmed = imageUrl.trim();
  if (/tempfile\.org\/[^/]+\/preview$/i.test(trimmed)) {
    return trimmed.replace(/\/preview$/i, "/download");
  }
  return trimmed;
}

async function fetchYandexHtml(imageUrl: string): Promise<TraceLookupHit[]> {
  const page = `https://yandex.com/images/search?rpt=imageview&url=${encodeURIComponent(imageUrl)}`;
  const res = await fetch(page, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
    },
    signal: AbortSignal.timeout(14_000),
  });
  if (!res.ok) return [];

  const html = await res.text();
  const seen = new Set<string>();
  const hits: TraceLookupHit[] = [];
  const patterns = [
    /"url"\s*:\s*"(https?:[^"\\]+)"/gi,
    /"pageUrl"\s*:\s*"(https?:[^"\\]+)"/gi,
    /href="(https?:\/\/(?![^"]*(?:yandex|yastatic))[^"]+)"/gi,
  ];
  for (const re of patterns) {
    let match: RegExpExecArray | null;
    while ((match = re.exec(html)) !== null) {
      const raw = match[1].replace(/\\u002F/g, "/").replace(/\\\//g, "/");
      addHit(seen, hits, raw);
    }
  }
  return hits;
}

export async function lookupReverseImage(imageUrl: string): Promise<{
  hits: TraceLookupHit[];
  sources: string[];
  autoLookupConfigured: boolean;
  lookupHint: string | null;
}> {
  imageUrl = normalizeSearchImageUrl(imageUrl);
  const seen = new Set<string>();
  const merged: TraceLookupHit[] = [];
  const sources: string[] = [];
  const providersConfigured = getConfiguredLookupProviders();

  const addBatch = (label: string, batch: TraceLookupHit[]) => {
    if (batch.length === 0) return;
    sources.push(label);
    for (const hit of batch) {
      const existingIdx = merged.findIndex((h) => h.url === hit.url);
      if (existingIdx >= 0) {
        if (!merged[existingIdx].thumbnailUrl && hit.thumbnailUrl) {
          merged[existingIdx] = { ...merged[existingIdx], thumbnailUrl: hit.thumbnailUrl };
        }
        continue;
      }
      if (seen.has(hit.url)) continue;
      seen.add(hit.url);
      merged.push(hit);
    }
  };

  const hasSerpApi = Boolean(process.env.SERPAPI_API_KEY?.trim());
  const serp = hasSerpApi ? await fetchSerpApi(imageUrl).catch(() => []) : [];
  addBatch("serpapi", serp);

  if (serp.length < 5) {
    const [serper, yandex, yandexHtml, bing] = await Promise.all([
      fetchSerperLens(imageUrl).catch(() => []),
      fetchYandex(imageUrl).catch(() => []),
      fetchYandexHtml(imageUrl).catch(() => []),
      fetchBingHtml(imageUrl).catch(() => []),
    ]);
    addBatch("serper", serper);
    addBatch("yandex", yandex);
    addBatch("yandex-html", yandexHtml);
    addBatch("bing", bing);
  }

  const hits = merged.slice(0, 40);
  let lookupHint: string | null = null;
  if (hits.length === 0 && providersConfigured.length === 0) {
    lookupHint =
      "Add SERPAPI_API_KEY or SERPER_API_KEY to the backend Vercel project for in-app matches (free tiers at serpapi.com / serper.dev).";
  } else if (hits.length === 0) {
    lookupHint =
      "No matches returned for this image. Try Open Bing search or paste URLs from Lens manually.";
  }

  return {
    hits,
    sources,
    autoLookupConfigured: providersConfigured.length > 0,
    lookupHint,
  };
}

function parseDataUrl(dataUrl: string): { bytes: Buffer; mime: string; ext: string } | null {
  const match = /^data:([\w/+.-]+);base64,([\s\S]+)$/i.exec(dataUrl.trim());
  if (!match) return null;
  const mime = match[1];
  const bytes = Buffer.from(match[2].replace(/\s/g, ""), "base64");
  if (bytes.length === 0 || bytes.length > 3_500_000) return null;
  const ext = mime.includes("png") ? "png" : mime.includes("webp") ? "webp" : "jpg";
  return { bytes, mime, ext };
}

async function uploadToTempfile(blob: Blob, filename: string): Promise<string | null> {
  const fd = new FormData();
  fd.append("files", blob, filename);
  fd.append("expiryHours", "48");
  const res = await fetch("https://tempfile.org/api/upload/local", {
    method: "POST",
    body: fd,
    signal: AbortSignal.timeout(25_000),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    success?: boolean;
    files?: Array<{ id?: string }>;
  };
  const id = data.files?.[0]?.id;
  if (!data.success || !id) return null;
  const isImage = /\.(jpe?g|png|webp|gif)$/i.test(filename) || blob.type.startsWith("image/");
  return isImage
    ? `https://tempfile.org/${id}/download`
    : `https://tempfile.org/${id}/download`;
}

async function uploadToCatbox(blob: Blob, filename: string): Promise<string | null> {
  const fd = new FormData();
  fd.append("reqtype", "fileupload");
  fd.append("fileToUpload", blob, filename);
  const res = await fetch("https://catbox.moe/user/api.php", {
    method: "POST",
    body: fd,
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) return null;
  const url = (await res.text()).trim();
  return url.startsWith("http") ? url : null;
}

async function uploadToLitterbox(blob: Blob, filename: string): Promise<string | null> {
  const fd = new FormData();
  fd.append("reqtype", "fileupload");
  fd.append("time", "72h");
  fd.append("fileToUpload", blob, filename);
  const res = await fetch("https://litterbox.catbox.moe/resources/internals/api.php", {
    method: "POST",
    body: fd,
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) return null;
  const url = (await res.text()).trim();
  return url.startsWith("http") ? url : null;
}

export async function uploadTraceBuffer(
  bytes: Buffer,
  mime: string,
  filename: string,
): Promise<string | null> {
  const blob = new Blob([new Uint8Array(bytes)], { type: mime });
  const hosts = [uploadToCatbox, uploadToTempfile, uploadToLitterbox];
  for (const upload of hosts) {
    try {
      const url = await upload(blob, filename);
      if (url) return url;
    } catch {
      /* try next host */
    }
  }
  return null;
}

export async function publishImageBase64(dataUrl: string): Promise<string | null> {
  const parsed = parseDataUrl(dataUrl);
  if (!parsed) return null;
  return uploadTraceBuffer(parsed.bytes, parsed.mime, `deepshield-trace.${parsed.ext}`);
}
