export type TraceHit = {
  id: string;
  platform: string;
  title: string;
  url: string;
  firstSeen: string;
};

const RESULTS_KEY = "deepshield_trace_results";
const URLS_KEY = "deepshield_trace_urls";

export function loadTraceHits(): TraceHit[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RESULTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as TraceHit[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function loadTraceUrls(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(URLS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
