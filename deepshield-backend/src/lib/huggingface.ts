type HfJson = unknown;

const HF_ROUTER_CHAT_URL =
  "https://router.huggingface.co/v1/chat/completions";
const HF_ROUTER_INFERENCE_BASE =
  "https://router.huggingface.co/hf-inference/models";

function hfToken() {
  const token = process.env.HF_API_TOKEN;
  if (!token) throw new Error("HF_API_TOKEN missing");
  return token;
}

function hfTimeoutMs() {
  const raw = process.env.HF_TIMEOUT_MS;
  const n = raw ? Number(raw) : 30000;
  return Number.isFinite(n) ? n : 30000;
}

/** Extract model id from env (plain id or legacy full URL). */
function resolveModelId(envValue: string | undefined, fallback: string): string {
  const v = (envValue ?? "").trim();
  if (!v) return fallback;
  if (!v.includes("://") && !v.startsWith("http")) return v;
  // Model ids include a slash (e.g. mistralai/Mistral-7B-Instruct-v0.3)
  const match = v.match(/\/models\/([^?#]+)/);
  return match?.[1]?.replace(/\/$/, "") ?? fallback;
}

function hfDeepfakeInferenceUrl() {
  const modelId = resolveModelId(
    process.env.HF_DEEPFAKE_MODEL_URL,
    "dima806/deepfake_vs_real_image_detection",
  );
  return `${HF_ROUTER_INFERENCE_BASE}/${modelId}`;
}

function hfLlmModelId() {
  const resolved = resolveModelId(
    process.env.HF_LLM_MODEL_URL,
    "meta-llama/Llama-3.1-8B-Instruct",
  );
  // Legacy default pointed at a text-generation model, not router chat.
  if (resolved === "mistralai/Mistral-7B-Instruct-v0.3") {
    return "meta-llama/Llama-3.1-8B-Instruct";
  }
  return resolved;
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

async function hfFetch(
  url: string,
  init: RequestInit,
): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), hfTimeoutMs());
  try {
    const res = await fetch(url, { ...init, signal: ctrl.signal });
    return res;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "fetch failed";
    const err = new Error(msg);
    (err as { code?: string }).code = "UPSTREAM_ERROR";
    throw err;
  } finally {
    clearTimeout(t);
  }
}

async function readUpstreamError(res: Response): Promise<string> {
  try {
    const text = await res.text();
    return text.slice(0, 500);
  } catch {
    return "";
  }
}

export async function callHfDeepfakeModelBase64(args: {
  base64: string;
}): Promise<number> {
  const url = hfDeepfakeInferenceUrl();

  const res = await hfFetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${hfToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: args.base64 }),
  });

  if (!res.ok) {
    const detail = await readUpstreamError(res);
    throw new Error(
      `HF deepfake model http ${res.status}${detail ? `: ${detail}` : ""}`,
    );
  }

  const data: HfJson = await res.json();
  if (Array.isArray(data)) {
    const arr = data as Array<{ label?: string; score?: number }>;
    const fake = arr.find((x) => {
      const label = (x.label ?? "").toLowerCase();
      return label.includes("fake") || label.includes("deepfake");
    });
    if (fake && typeof fake.score === "number") return clamp01(fake.score);

    const byLabel = (label: string) =>
      arr.find(
        (x) =>
          (x.label ?? "").toUpperCase() === label && typeof x.score === "number",
      );
    const fake2 = byLabel("FAKE") ?? byLabel("DEEPFAKE");
    if (fake2) return clamp01(fake2.score as number);

    const first = arr.find((x) => typeof x.score === "number");
    if (first) return clamp01(first.score as number);
  }

  return 0;
}

function parseSystemUserPrompt(prompt: string): {
  system?: string;
  user: string;
} {
  const match = prompt.match(
    /^System:\n([\s\S]*?)\n\nUser:\n([\s\S]*?)\n\nAssistant:\s*$/,
  );
  if (match) {
    return { system: match[1], user: match[2] };
  }
  return { user: prompt };
}

function buildChatMessages(prompt: string): Array<{
  role: "system" | "user" | "assistant";
  content: string;
}> {
  const { system, user } = parseSystemUserPrompt(prompt);
  const messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }> = [];
  if (system) messages.push({ role: "system", content: system });
  messages.push({ role: "user", content: user });
  return messages;
}

function extractChatCompletionText(data: unknown): string {
  const d = data as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = d?.choices?.[0]?.message?.content;
  if (typeof content === "string") return content;
  throw new Error("HF LLM returned unexpected chat completion shape");
}

async function hfChatCompletion(args: {
  prompt: string;
  maxTokens: number;
  temperature: number;
  stream?: boolean;
}): Promise<Response> {
  const res = await hfFetch(HF_ROUTER_CHAT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${hfToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: hfLlmModelId(),
      messages: buildChatMessages(args.prompt),
      max_tokens: args.maxTokens,
      temperature: args.temperature,
      stream: args.stream ?? false,
    }),
  });

  if (!res.ok) {
    const detail = await readUpstreamError(res);
    throw new Error(
      `HF LLM http ${res.status}${detail ? `: ${detail}` : ""}`,
    );
  }

  return res;
}

async function hfTextGen(args: {
  prompt: string;
  maxTokens: number;
  temperature: number;
}): Promise<string> {
  const res = await hfChatCompletion({ ...args, stream: false });
  const data = await res.json();
  return extractChatCompletionText(data);
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

function tokenFromOpenAiChunk(chunkText: string): string | null {
  const trimmed = chunkText.trim();
  if (!trimmed || trimmed === "[DONE]") return null;

  const asObj = safeJsonParse<{
    choices?: Array<{ delta?: { content?: string } }>;
    token?: { text?: string };
    generated_text?: string;
  }>(trimmed);

  if (asObj?.choices?.[0]?.delta?.content) {
    return asObj.choices[0].delta.content;
  }
  if (asObj?.token?.text) return asObj.token.text;
  if (asObj?.generated_text) return asObj.generated_text;

  return null;
}

export async function* streamHfTextGenTokens(args: {
  prompt: string;
  maxTokens: number;
  temperature: number;
}): AsyncGenerator<string> {
  const res = await hfChatCompletion({ ...args, stream: true });

  const decoder = new TextDecoder("utf-8");
  let buffer = "";
  const body = res.body;
  if (!body) throw new Error("HF LLM streaming has no body");

  const reader = body.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const parts = buffer.split("\n\n");
      buffer = parts.pop() ?? "";

      for (const part of parts) {
        for (const line of part.split("\n")) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const payload = trimmed.slice("data:".length).trim();
          const token = tokenFromOpenAiChunk(payload);
          if (token) yield token;
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export function formatLlmPromptSystemUser(args: {
  system: string;
  user: string;
}) {
  return `System:\n${args.system}\n\nUser:\n${args.user}\n\nAssistant:`;
}
