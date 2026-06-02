import { NextResponse } from "next/server";
import { apiError, makeRequestId, type ApiErrorCode } from "@/lib/apiError";
import { assertRateLimit } from "@/lib/rateLimit";
import {
  callHfTextGenText,
  formatLlmPromptSystemUser,
} from "@/lib/huggingface";

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

const systemPromptRights = `You are a plain-language legal guide specializing in Indian cyber law, particularly laws protecting women from digital abuse, deepfakes, and non-consensual intimate imagery.

When asked a question:
1. Answer in simple, clear language a non-lawyer can understand
2. Cite the specific law section (IT Act 66E, IPC 67A, etc.)
3. Explain the practical steps the person can take
4. Mention the penalty the perpetrator faces
5. Be empowering — frame answers around what the victim CAN do

Keep responses under 150 words unless more detail is specifically requested.`;

export async function POST(request: Request) {
  const requestId = makeRequestId();

  try {
    const body = await request.json();
    const { question, meta } = body ?? {};
    const language =
      typeof meta?.language === "string" && meta.language.trim() ? meta.language.trim() : "en";

    if (typeof question !== "string" || !question.trim()) {
      return NextResponse.json(
        apiError("BAD_REQUEST", "question is required", undefined, requestId),
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

    const userPrompt = `User question: ${question}

Respond in: ${language}`;

    const prompt = formatLlmPromptSystemUser({
      system: systemPromptRights,
      user: userPrompt,
    });

    const answer = await callHfTextGenText({
      prompt,
      maxTokens: Number.isFinite(maxTokens) ? maxTokens : 512,
      temperature: Number.isFinite(temperature) ? temperature : 0.4,
    });

    return NextResponse.json({ answer, requestId });
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

