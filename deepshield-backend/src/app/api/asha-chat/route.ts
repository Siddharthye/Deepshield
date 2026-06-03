import { NextResponse } from "next/server";
import { apiError, makeRequestId, type ApiErrorCode } from "@/lib/apiError";
import { assertRateLimit } from "@/lib/rateLimit";
import { formatLlmPromptSystemUser, streamHfTextGenTokens } from "@/lib/huggingface";
import { isAshaInScope, outOfScopeReply } from "@/lib/ashaScope";

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

const systemPromptAsha = `You are Asha, a compassionate AI safety companion on DeepShield — a platform that helps women who are victims of deepfake abuse and digital violence.

SCOPE (mandatory — never break):
- ONLY: emotional support after digital abuse; Indian legal rights (IT Act 66E/67/67A, IPC 354C, POCSO where relevant); how to use DeepShield (scan, trace, vault, report, cybercrime.gov.in); crisis helplines (1930, NCW 181, iCall 9152987821).
- NEVER answer: recipes, cooking, weather, sports, coding, homework, trivia, entertainment, finance, dating, or any general knowledge.
- If off-topic: refuse in ONE short paragraph. Say you are Asha on DeepShield and can only help with support, rights, and platform steps. Do NOT provide the requested off-topic content even partially.

Your personality:
- Warm, calm, and deeply empathetic — never clinical or robotic
- Speak like a trusted friend who also happens to know the law
- Always validate feelings BEFORE offering solutions
- Never question whether the abuse happened
- Never use terms like "alleged" or "claimed"
- Use simple, clear language — cite law sections when explaining rights

Your role:
- Listen and validate what the user is going through
- Answer legal rights questions in plain language (IT Act 66E, 67, 67A, IPC 354C, filing at cybercrime.gov.in)
- Gently guide toward practical next steps (scan image, generate report, vault evidence)
- Provide Indian helpline numbers naturally: Cyber Crime 1930, NCW 181, iCall 9152987821
- If user seems in crisis, immediately surface helplines

Never store, repeat, or reference personal details beyond the immediate conversation.`;

type AshaMessage = { role: "user" | "assistant" | string; content: string };

export async function POST(request: Request) {
  const requestId = makeRequestId();

  const headers = {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  };

  try {
    const body = await request.json();
    const { messages, meta } = body ?? {};
    const language =
      typeof meta?.language === "string" && meta.language.trim() ? meta.language.trim() : "en";

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        apiError("BAD_REQUEST", "messages must be a non-empty array", undefined, requestId),
        { status: 400 },
      );
    }

    const lastUser = [...messages].reverse().find((m: any) => m?.role === "user" && typeof m?.content === "string");
    if (!lastUser) {
      return NextResponse.json(
        apiError("BAD_REQUEST", "At least one user message with content is required", undefined, requestId),
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
    const temperature = Number(process.env.LLM_TEMPERATURE ?? 0.25);

    const lastUserText = String(lastUser.content).trim();
    if (!isAshaInScope(lastUserText)) {
      const reply = outOfScopeReply(language);
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          const emit = (event: string, data: object) => {
            controller.enqueue(
              encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
            );
          };
          emit("token", { t: reply });
          emit("done", { ok: true, scoped: false });
          controller.close();
        },
      });
      return new Response(stream, { headers });
    }

    const conversation = messages
      .slice(-8)
      .map((m: AshaMessage) => `${m.role.toLowerCase()}: ${m.content}`)
      .join("\n");

    const systemWithLanguage = `${systemPromptAsha}\n\nAlways respond in the user's selected language: ${language}.`;
    const userPrompt = `Conversation so far:\n${conversation}\n\nUser language: ${language}\n\nWrite the assistant response now. Stay strictly within Asha's scope. If the latest user message is off-topic, refuse without answering it.`;

    const prompt = formatLlmPromptSystemUser({
      system: systemWithLanguage,
      user: userPrompt,
    });

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const emit = (event: string, data: any) => {
          controller.enqueue(
            encoder.encode(
              `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`,
            ),
          );
        };

        try {
          for await (const token of streamHfTextGenTokens({
            prompt,
            maxTokens: Number.isFinite(maxTokens) ? maxTokens : 512,
            temperature: Number.isFinite(temperature) ? temperature : 0.4,
          })) {
            emit("token", { t: token });
          }
          emit("done", { ok: true });
          controller.close();
        } catch (e: any) {
          emit("error", { message: e?.message ?? "Streaming failed", requestId });
          controller.close();
        }
      },
    });

    return new Response(stream, { headers });
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

