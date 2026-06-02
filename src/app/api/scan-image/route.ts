import { NextResponse } from "next/server";
import { assertRateLimit } from "@/lib/rateLimit";
import {
  apiError,
  makeRequestId,
  type ApiErrorCode,
} from "@/lib/apiError";
import {
  assertBase64SizeLimits,
  isSupportedImageMime,
  stripDataUrlPrefix,
} from "@/lib/media";
import { callHfDeepfakeModelBase64 } from "@/lib/huggingface";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_DECODED_IMAGE_BYTES = 8 * 1024 * 1024;

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

export async function POST(request: Request) {
  const requestId = makeRequestId();
  try {
    const body = await request.json();
    const { imageBase64, mimeType, meta } = body ?? {};

    if (typeof imageBase64 !== "string" || typeof mimeType !== "string") {
      return NextResponse.json(
        apiError("BAD_REQUEST", "imageBase64 and mimeType are required", undefined, requestId),
        { status: 400 },
      );
    }

    if (!isSupportedImageMime(mimeType)) {
      return NextResponse.json(
        apiError("UNSUPPORTED_MEDIA", "Unsupported image mimeType", { mimeType }, requestId),
        { status: 415 },
      );
    }

    const { base64: base64Raw, mimeTypeFromPrefix } = stripDataUrlPrefix(imageBase64);
    if (mimeTypeFromPrefix && mimeTypeFromPrefix !== mimeType) {
      return NextResponse.json(
        apiError(
          "BAD_REQUEST",
          "mimeType does not match data-url prefix",
          { expected: mimeType, received: mimeTypeFromPrefix },
          requestId,
        ),
        { status: 400 },
      );
    }

    assertBase64SizeLimits({ base64: base64Raw, decodedBytesMax: MAX_DECODED_IMAGE_BYTES });

    // Validate decoding size (actual bytes)
    let bytesLen = 0;
    try {
      const buf = Buffer.from(base64Raw, "base64");
      bytesLen = buf.length;
    } catch {
      return NextResponse.json(
        apiError("BAD_REQUEST", "imageBase64 is not valid base64", undefined, requestId),
        { status: 400 },
      );
    }

    if (bytesLen > MAX_DECODED_IMAGE_BYTES) {
      return NextResponse.json(
        apiError("PAYLOAD_TOO_LARGE", "Image payload too large", { bytesLen }, requestId),
        { status: 413 },
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

    const t0 = Date.now();
    const modelScore = await callHfDeepfakeModelBase64({ base64: base64Raw });
    const t1 = Date.now();

    return NextResponse.json({
      modelScore,
      requestId,
      timingsMs: { hf: t1 - t0 },
      meta: meta && typeof meta === "object" ? meta : undefined,
    });
  } catch (e: any) {
    const code: ApiErrorCode = e?.code ?? "INTERNAL_ERROR";
    const status =
      code === "PAYLOAD_TOO_LARGE"
        ? 413
        : code === "UNSUPPORTED_MEDIA"
          ? 415
          : code === "RATE_LIMITED"
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

