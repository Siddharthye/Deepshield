import { NextResponse } from "next/server";
import { assertRateLimit } from "@/lib/rateLimit";
import { apiError, makeRequestId, type ApiErrorCode } from "@/lib/apiError";
import { callHfTextGenJson } from "@/lib/huggingface";

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

const systemPromptDeepfakeExplanation = `You are a forensic image analysis explainer. You will receive the output of a deepfake detection pipeline — not the image itself. Your job is ONLY to explain the results in plain, empathetic language.

You will receive:
- model_score: fake probability from the deepfake detection model (0–1)
- artifact_score: OpenCV artifact density score (0–1)
- symmetry_score: facial symmetry deviation score (0–1)
- final_risk: combined weighted risk percentage (0–100)
- verdict: "authentic" | "likely_manipulated" | "highly_suspicious"

Respond ONLY in this JSON format:
{
  "explanation": string (2-3 sentences in plain language explaining what the scores mean),
  "key_signals": [string] (list of 2-3 specific signals that drove the verdict),
  "recommendation": string (what the user should do next)
}

Never say "I analyzed the image." Always say "The detection system found..."`;

type ExplainRiskPayload = {
  finalRisk: number;
  verdict: "authentic" | "likely_manipulated" | "highly_suspicious";
  breakdown: {
    modelScore: number;
    artifactScore: number;
    symmetryScore: number;
  };
};

export async function POST(request: Request) {
  const requestId = makeRequestId();

  try {
    const body = await request.json();
    const { risk, meta } = body ?? {};
    const language = meta?.language;

    if (!risk || typeof risk !== "object") {
      return NextResponse.json(
        apiError("BAD_REQUEST", "risk is required", undefined, requestId),
        { status: 400 },
      );
    }

    const typedRisk = risk as ExplainRiskPayload;
    if (
      typeof typedRisk.finalRisk !== "number" ||
      typeof typedRisk.verdict !== "string" ||
      !typedRisk.breakdown ||
      typeof typedRisk.breakdown.modelScore !== "number" ||
      typeof typedRisk.breakdown.artifactScore !== "number" ||
      typeof typedRisk.breakdown.symmetryScore !== "number"
    ) {
      return NextResponse.json(
        apiError("BAD_REQUEST", "risk fields are invalid", { risk }, requestId),
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

    const userPrompt = `Here are the detector outputs (scores only; do NOT analyze the image):

model_score: ${typedRisk.breakdown.modelScore}
hf_model_score: ${typeof (typedRisk.breakdown as { hfModelScore?: number }).hfModelScore === "number" ? (typedRisk.breakdown as { hfModelScore?: number }).hfModelScore : "n/a"}
sightengine_score: ${typeof (typedRisk.breakdown as { sightengineScore?: number }).sightengineScore === "number" ? (typedRisk.breakdown as { sightengineScore?: number }).sightengineScore : "n/a"}
artifact_score: ${typedRisk.breakdown.artifactScore}
symmetry_score: ${typedRisk.breakdown.symmetryScore}
morph_score: ${typeof (typedRisk.breakdown as { morphScore?: number }).morphScore === "number" ? (typedRisk.breakdown as { morphScore?: number }).morphScore : "n/a"}
final_risk: ${typedRisk.finalRisk}
verdict: "${typedRisk.verdict}"

Respond in: ${typeof language === "string" && language.trim() ? language : "en"}.`;

    const json = await callHfTextGenJson<{
      explanation: string;
      key_signals: string[];
      recommendation: string;
    }>({
      prompt: `${systemPromptDeepfakeExplanation}\n\n${userPrompt}`,
      maxTokens: Number.isFinite(maxTokens) ? maxTokens : 512,
      temperature: Number.isFinite(temperature) ? temperature : 0.4,
    });

    return NextResponse.json({
      explanation: json.explanation,
      key_signals: json.key_signals,
      recommendation: json.recommendation,
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

