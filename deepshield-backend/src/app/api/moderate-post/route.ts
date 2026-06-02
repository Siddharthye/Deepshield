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

const systemPromptModerate = `You are a content moderation engine for a community safety feed.

You MUST output only valid JSON (no markdown, no explanations).

Rules:
- Check whether the post includes harmful content, instructions, threats, harassment, sexual content that could retraumatize, or requests to disclose private information.
- If you are uncertain, set "allowed" to false with a safe reason.
- "reason" should be short and practical (why it’s blocked / what to change).`;

export async function POST(request: Request) {
  const requestId = makeRequestId();

  try {
    const body = await request.json();
    const { text, meta } = body ?? {};
    const language =
      typeof meta?.language === "string" && meta.language.trim() ? meta.language.trim() : "en";

    if (typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        apiError("BAD_REQUEST", "text is required", undefined, requestId),
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

    const userPrompt = `Moderate this community post.

Language for reason: ${language}

Post text:
${text}

Return JSON ONLY in this shape:
{
  "allowed": boolean,
  "reason": string
}`;

    const prompt = formatLlmPromptSystemUser({
      system: systemPromptModerate,
      user: userPrompt,
    });

    const json = await callHfTextGenJson<{
      allowed: boolean;
      reason: string;
    }>({
      prompt,
      maxTokens: Number.isFinite(maxTokens) ? maxTokens : 512,
      temperature: Number.isFinite(temperature) ? temperature : 0.4,
    });

    return NextResponse.json({
      allowed: !!json.allowed,
      reason: typeof json.reason === "string" ? json.reason : "",
      requestId,
    });
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

