import type { ScanSession } from "./types";

const KEY = "deepshield_last_scan";

export function saveScanSession(session: ScanSession) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(session));
}

export function loadScanSession(): ScanSession | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ScanSession;
  } catch {
    return null;
  }
}
