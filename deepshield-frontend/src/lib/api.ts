import type { ChatMessage, ExplainResult, RiskResult } from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "https://deepshield-xi.vercel.app";

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    const msg =
      (data as { error?: { message?: string } })?.error?.message ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data as T;
}

export async function scanImage(args: {
  imageBase64: string;
  mimeType: string;
}): Promise<{ modelScore: number; requestId: string }> {
  return postJson("/api/scan-image", {
    imageBase64: args.imageBase64,
    mimeType: args.mimeType,
    meta: { clientTimeIso: new Date().toISOString() },
  });
}

export async function explainRisk(args: {
  risk: RiskResult;
  language: string;
}): Promise<ExplainResult> {
  return postJson("/api/explain", {
    risk: args.risk,
    meta: { language: args.language },
  });
}

export async function askRights(args: {
  question: string;
  language: string;
}): Promise<{ answer: string; requestId: string }> {
  return postJson("/api/rights-explainer", {
    question: args.question,
    meta: { language: args.language },
  });
}

export async function moderatePost(args: {
  text: string;
  language: string;
}): Promise<{ allowed: boolean; reason: string }> {
  return postJson("/api/moderate-post", {
    text: args.text,
    meta: { language: args.language },
  });
}

export async function streamAshaChat(args: {
  messages: ChatMessage[];
  language: string;
  onToken: (token: string) => void;
  onDone?: () => void;
  onError?: (message: string) => void;
}): Promise<void> {
  const res = await fetch(`${API_BASE}/api/asha-chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: args.messages,
      meta: { language: args.language },
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const msg =
      (data as { error?: { message?: string } })?.error?.message ||
      `Chat failed (${res.status})`;
    args.onError?.(msg);
    return;
  }

  const reader = res.body?.getReader();
  if (!reader) {
    args.onError?.("No response stream");
    return;
  }

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const parts = buffer.split("\n\n");
    buffer = parts.pop() ?? "";

    for (const part of parts) {
      let event = "message";
      let data = "";
      for (const line of part.split("\n")) {
        if (line.startsWith("event:")) event = line.slice(6).trim();
        if (line.startsWith("data:")) data = line.slice(5).trim();
      }
      if (!data) continue;
      if (event === "token") {
        try {
          const parsed = JSON.parse(data) as { t?: string };
          if (parsed.t) args.onToken(parsed.t);
        } catch {
          /* ignore */
        }
      }
      if (event === "done") args.onDone?.();
      if (event === "error") {
        try {
          const parsed = JSON.parse(data) as { message?: string };
          args.onError?.(parsed.message ?? "Stream error");
        } catch {
          args.onError?.("Stream error");
        }
      }
    }
  }
  args.onDone?.();
}
