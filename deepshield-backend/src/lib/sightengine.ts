const SIGHTENGINE_CHECK_URL = "https://api.sightengine.com/1.0/check.json";
const TIMEOUT_MS = 20_000;

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

function credentials(): { user: string; secret: string } | null {
  const user = process.env.SIGHTENGINE_API_USER?.trim();
  const secret = process.env.SIGHTENGINE_API_SECRET?.trim();
  if (!user || !secret) return null;
  return { user, secret };
}

function parseDeepfakeScore(data: unknown): number {
  const d = data as {
    status?: string;
    type?: { deepfake?: number };
    error?: { message?: string };
  };
  if (d.status === "failure") {
    throw new Error(d.error?.message ?? "Sightengine request failed");
  }
  const score = d.type?.deepfake;
  if (typeof score === "number") return clamp01(score);
  return 0;
}

export function isSightengineConfigured(): boolean {
  return credentials() != null;
}

/** Face-swap / morph detection via Sightengine (5 ops per image on their billing). */
export async function callSightengineDeepfake(args: {
  base64: string;
  mimeType: string;
}): Promise<number> {
  const creds = credentials();
  if (!creds) throw new Error("SIGHTENGINE_API_USER / SIGHTENGINE_API_SECRET missing");

  const bytes = Buffer.from(args.base64, "base64");
  const ext = args.mimeType.includes("png")
    ? "png"
    : args.mimeType.includes("webp")
      ? "webp"
      : "jpg";

  const form = new FormData();
  form.append("models", "deepfake");
  form.append("api_user", creds.user);
  form.append("api_secret", creds.secret);
  form.append(
    "media",
    new Blob([bytes], { type: args.mimeType }),
    `scan.${ext}`,
  );

  const res = await fetch(SIGHTENGINE_CHECK_URL, {
    method: "POST",
    body: form,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  const data: unknown = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = data as { error?: { message?: string } };
    throw new Error(
      err.error?.message ?? `Sightengine http ${res.status}`,
    );
  }

  return parseDeepfakeScore(data);
}

export async function callSightengineDeepfakeSafe(args: {
  base64: string;
  mimeType: string;
}): Promise<{ sightengineScore: number; sightengineUnavailable: boolean }> {
  if (!isSightengineConfigured()) {
    return { sightengineScore: 0, sightengineUnavailable: true };
  }
  try {
    const sightengineScore = await callSightengineDeepfake(args);
    return { sightengineScore, sightengineUnavailable: false };
  } catch (e) {
    console.warn(
      "[scan] Sightengine skipped:",
      e instanceof Error ? e.message : e,
    );
    return { sightengineScore: 0, sightengineUnavailable: true };
  }
}
