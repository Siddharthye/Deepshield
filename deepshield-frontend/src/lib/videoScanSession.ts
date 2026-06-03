import type { VideoScanSession } from "./types";

const KEY = "deepshield_last_video_scan";

export function saveVideoScanSession(session: VideoScanSession) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(session));
}

export function loadVideoScanSession(): VideoScanSession | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as VideoScanSession;
  } catch {
    return null;
  }
}
