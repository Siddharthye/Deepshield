import { NextResponse } from "next/server";
import { apiError, makeRequestId, type ApiErrorCode } from "@/lib/apiError";
import { assertRateLimit } from "@/lib/rateLimit";
import { callHfTextGenJson, formatLlmPromptSystemUser } from "@/lib/huggingface";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getClientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function rateLimitConfig() {
  const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60000);
  const maxRequests = Number(process.env.RATE_LIMIT_MAX_REQUESTS ?? 30);
  return {
    windowMs: Number.isFinite(windowMs) ? windowMs : 60000,
    maxRequests: Number.isFinite(maxRequests) ? maxRequests : 30,
  };
}

const systemPromptTranslate = `You are a translation engine for a product UI.

You MUST output only valid JSON (no markdown, no explanations).
Do not add or remove keys. Preserve the meaning and keep the tone natural for UI strings.`;

export async function POST(request: Request) {
  const requestId = makeRequestId();

  try {
    const body = await request.json();
    const { targetLanguage, strings } = body ?? {};

    if (typeof targetLanguage !== "string" || !targetLanguage.trim()) {
      return NextResponse.json(
        apiError("BAD_REQUEST", "targetLanguage is required", undefined, requestId),
        { status: 400 },
      );
    }
    if (!strings || typeof strings !== "object" || Array.isArray(strings)) {
      return NextResponse.json(
        apiError("BAD_REQUEST", "strings must be an object of key->text", undefined, requestId),
        { status: 400 },
      );
    }

    const ip = getClientIp(request);
    const { windowMs, maxRequests } = rateLimitConfig();
    try {
      assertRateLimit({ key: ip, windowMs, maxRequests });
    } catch (e: any) {
      if (e?.code === "RATE_LIMITED") {
        return NextResponse.json(
          apiError("RATE_LIMITED", "Too many requests", { ip }, requestId),
          { status: 429 },
        );
      }
      throw e;
    }

    const maxTokens = Number(process.env.LLM_MAX_TOKENS ?? 512);
    const temperature = Number(process.env.LLM_TEMPERATURE ?? 0.4);

    const userPrompt = `Target language: ${targetLanguage}

Translate these UI strings exactly:
${JSON.stringify(strings)}

Return JSON ONLY in the following shape:
{
  "targetLanguage": "${targetLanguage}",
  "strings": { "key1": "translated text", "key2": "translated text" }
}`;

    const prompt = formatLlmPromptSystemUser({
      system: systemPromptTranslate,
      user: userPrompt,
    });

    const json = await callHfTextGenJson<{
      targetLanguage: string;
      strings: Record<string, string>;
    }>({
      prompt,
      maxTokens: Number.isFinite(maxTokens) ? maxTokens : 512,
      temperature: Number.isFinite(temperature) ? temperature : 0.4,
    });

    return NextResponse.json({ targetLanguage: json.targetLanguage, strings: json.strings, requestId });
  } catch (e: any) {
    const code: ApiErrorCode = e?.code ?? "INTERNAL_ERROR";
    const status =
      code === "RATE_LIMITED"
        ? 429
        : code === "BAD_REQUEST"
          ? 400
          : code === "UPSTREAM_TIMEOUT"
            ? 504
            : code === "UPSTREAM_ERROR"
              ? 502
              : 500;

    return NextResponse.json(
      apiError(code, e?.message ?? "Request failed", undefined, requestId),
      { status },
    );
  }
}

