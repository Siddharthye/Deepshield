import { apiError, type ApiErrorCode, type ApiErrorResponse } from "./apiError";

type HfJson = unknown;

function hfToken() {
  const token = process.env.HF_API_TOKEN;
  if (!token) throw new Error("HF_API_TOKEN missing");
  return token;
}

function hfDeepfakeModelUrl() {
  const url = process.env.HF_DEEPFAKE_MODEL_URL;
  if (!url) throw new Error("HF_DEEPFAKE_MODEL_URL missing");
  return url;
}

function hfLlmModelUrl() {
  const url = process.env.HF_LLM_MODEL_URL;
  if (!url) throw new Error("HF_LLM_MODEL_URL missing");
  return url;
}

function hfTimeoutMs() {
  const raw = process.env.HF_TIMEOUT_MS;
  const n = raw ? Number(raw) : 30000;
  return Number.isFinite(n) ? n : 30000;
}

function clamp01(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

function extractFirstJsonObject(text: string): string | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  return text.slice(start, end + 1);
}

function safeJsonParse<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export async function callHfDeepfakeModelBase64(args: {
  base64: string; // raw base64 (no data: prefix)
}): Promise<number> {
  const url = hfDeepfakeModelUrl();

  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), hfTimeoutMs());

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${hfToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: args.base64 }),
      signal: ctrl.signal,
    });

    if (!res.ok) {
      throw new Error(`HF deepfake model http ${res.status}`);
    }

    const data: HfJson = await res.json();
    // Expected: array of { label, score }
    if (Array.isArray(data)) {
      const arr = data as Array<{ label?: string; score?: number }>;
      const fake = arr.find((x) => {
        const label = (x.label ?? "").toLowerCase();
        return label.includes("fake") || label.includes("deepfake");
      });
      if (fake && typeof fake.score === "number") return clamp01(fake.score);

      // Fallback: REAL/FAKE label
      const byLabel = (label: string) =>
        arr.find((x) => (x.label ?? "").toUpperCase() === label && typeof x.score === "number");
      const fake2 = byLabel("FAKE") ?? byLabel("DEEPFAKE");
      if (fake2) return clamp01(fake2.score as number);

      // Else: first with score
      const first = arr.find((x) => typeof x.score === "number");
      if (first) return clamp01(first.score as number);
    }

    // Unknown shape → best-effort return 0
    return 0;
  } finally {
    clearTimeout(t);
  }
}

async function hfTextGen(args: {
  prompt: string;
  maxTokens: number;
  temperature: number;
}): Promise<string> {
  const url = hfLlmModelUrl();
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), hfTimeoutMs());

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${hfToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: args.prompt,
        parameters: {
          max_new_tokens: args.maxTokens,
          temperature: args.temperature,
          return_full_text: false,
        },
        options: { wait_for_model: true },
      }),
      signal: ctrl.signal,
    });

    if (!res.ok) {
      throw new Error(`HF LLM http ${res.status}`);
    }

    const data: any = await res.json();

    // Common patterns across text-generation models:
    // - [{ generated_text: "..." }]
    // - { generated_text: "..." }
    if (Array.isArray(data) && data.length > 0 && typeof data[0]?.generated_text === "string") {
      return data[0].generated_text;
    }
    if (typeof data?.generated_text === "string") return data.generated_text;
    if (typeof data?.text === "string") return data.text;

    // Unknown: stringify for best-effort parsing.
    return typeof data === "string" ? data : JSON.stringify(data);
  } finally {
    clearTimeout(t);
  }
}

export async function callHfTextGenJson<T>(args: {
  prompt: string;
  maxTokens: number;
  temperature: number;
}): Promise<T> {
  const text = await hfTextGen(args);
  const jsonCandidate = extractFirstJsonObject(text);
  if (!jsonCandidate) {
    throw new Error("HF LLM did not return JSON object");
  }
  const parsed = safeJsonParse<T>(jsonCandidate);
  if (!parsed) throw new Error("HF LLM JSON parse failed");
  return parsed;
}

export async function callHfTextGenText(args: {
  prompt: string;
  maxTokens: number;
  temperature: number;
}): Promise<string> {
  const text = await hfTextGen(args);
  return text.trim();
}

function tokenFromUnknownChunk(chunkText: string): string | null {
  // HF streaming is SSE-ish. We try to parse `data:` payloads if present.
  // If we can't parse JSON, we fall back to returning raw chunk text.
  const trimmed = chunkText.trim();
  if (!trimmed) return null;

  // Some SSE payloads look like: {"token": {"text": "H"}}
  const asObj = safeJsonParse<any>(trimmed);
  if (asObj) {
    const t = asObj?.token?.text;
    if (typeof t === "string") return t;
    const text = asObj?.token?.content;
    if (typeof text === "string") return text;
    if (typeof asObj?.generated_text === "string") return asObj.generated_text;
    if (typeof asObj?.text === "string") return asObj.text;
  }

  // Sometimes the payload is plain token text.
  return trimmed;
}

export async function* streamHfTextGenTokens(args: {
  prompt: string;
  maxTokens: number;
  temperature: number;
}): AsyncGenerator<string> {
  const url = hfLlmModelUrl();
  const ctrl = new AbortController();
  const timeout = hfTimeoutMs();
  const t = setTimeout(() => ctrl.abort(), timeout);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${hfToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: args.prompt,
        parameters: {
          max_new_tokens: args.maxTokens,
          temperature: args.temperature,
        },
        stream: true,
        options: { wait_for_model: true },
      }),
      signal: ctrl.signal,
    });

    if (!res.ok) {
      throw new Error(`HF LLM streaming http ${res.status}`);
    }

    // Parse SSE stream. We don't assume a strict format; we extract `data:` lines.
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    const body = res.body;
    if (!body) throw new Error("HF LLM streaming has no body");

    for await (const chunk of body as any) {
      buffer += decoder.decode(chunk, { stream: true });

      // SSE events separated by blank line.
      const parts = buffer.split("\n\n");
      buffer = parts.pop() ?? "";

      for (const part of parts) {
        for (const line of part.split("\n")) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const payload = trimmed.slice("data:".length).trim();
          if (!payload || payload === "[DONE]") continue;

          const maybeToken = tokenFromUnknownChunk(payload);
          if (maybeToken) yield maybeToken;
        }
      }
    }
  } finally {
    clearTimeout(t);
  }
}

export function formatLlmPromptSystemUser(args: { system: string; user: string }) {
  // Generic text-generation prompt wrapper that works for many instruct models.
  return `System:\n${args.system}\n\nUser:\n${args.user}\n\nAssistant:`;
}

