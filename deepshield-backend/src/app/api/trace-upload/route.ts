import { NextResponse } from "next/server";
import { apiError, makeRequestId } from "@/lib/apiError";
import { assertRateLimit } from "@/lib/rateLimit";
import { uploadTraceBuffer } from "@/lib/reverseTraceLookup";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 4 * 1024 * 1024;

function getClientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request: Request) {
  const requestId = makeRequestId();
  try {
    const ip = getClientIp(request);
    assertRateLimit({
      key: `trace-upload:${ip}`,
      windowMs: 60_000,
      maxRequests: 20,
    });

    const form = await request.formData();
    const file = form.get("image");
    if (!file || typeof file === "string") {
      return NextResponse.json(
        apiError("BAD_REQUEST", "Missing image file", undefined, requestId),
        { status: 400 },
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    if (bytes.length === 0 || bytes.length > MAX_BYTES) {
      return NextResponse.json(
        apiError("BAD_REQUEST", "Image empty or too large", undefined, requestId),
        { status: 400 },
      );
    }

    const mime = file.type || "image/jpeg";
    const ext = mime.includes("png") ? "png" : mime.includes("webp") ? "webp" : "jpg";
    const publicImageUrl = await uploadTraceBuffer(bytes, mime, `deepshield-trace.${ext}`);

    if (!publicImageUrl) {
      return NextResponse.json(
        apiError(
          "INTERNAL_ERROR",
          "Could not host image on public storage",
          undefined,
          requestId,
        ),
        { status: 502 },
      );
    }

    return NextResponse.json({ publicImageUrl, requestId });
  } catch (e: unknown) {
    const err = e as { code?: string; message?: string };
    if (err?.code === "RATE_LIMITED") {
      return NextResponse.json(
        apiError("RATE_LIMITED", "Too many upload requests", undefined, requestId),
        { status: 429 },
      );
    }
    return NextResponse.json(
      apiError("INTERNAL_ERROR", err?.message ?? "Trace upload failed", undefined, requestId),
      { status: 500 },
    );
  }
}
