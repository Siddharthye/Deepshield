import { NextResponse } from "next/server";
import { apiError, makeRequestId } from "@/lib/apiError";
import { assertRateLimit } from "@/lib/rateLimit";
import {
  lookupReverseImage,
  publishImageBase64,
} from "@/lib/reverseTraceLookup";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
    const body = await request.json();
    const imageUrl = typeof body?.imageUrl === "string" ? body.imageUrl.trim() : "";
    const imageBase64 = typeof body?.imageBase64 === "string" ? body.imageBase64.trim() : "";

    const ip = getClientIp(request);
    assertRateLimit({
      key: `reverse-trace:${ip}`,
      windowMs: 60_000,
      maxRequests: 15,
    });

    let publicUrl = imageUrl;
    if (!publicUrl && imageBase64) {
      publicUrl = (await publishImageBase64(imageBase64)) ?? "";
    }

    if (!publicUrl || !publicUrl.startsWith("http")) {
      return NextResponse.json(
        apiError(
          "BAD_REQUEST",
          "imageUrl or imageBase64 required; could not publish image for search",
          undefined,
          requestId,
        ),
        { status: 400 },
      );
    }

    const { hits, sources } = await lookupReverseImage(publicUrl);

    return NextResponse.json({
      publicImageUrl: publicUrl,
      hits: hits.map((h) => ({ ...h, id: crypto.randomUUID() })),
      sources,
      count: hits.length,
      requestId,
    });
  } catch (e: unknown) {
    const err = e as { code?: string; message?: string };
    if (err?.code === "RATE_LIMITED") {
      return NextResponse.json(
        apiError("RATE_LIMITED", "Too many trace requests", undefined, requestId),
        { status: 429 },
      );
    }
    return NextResponse.json(
      apiError("INTERNAL_ERROR", err?.message ?? "Reverse trace failed", undefined, requestId),
      { status: 500 },
    );
  }
}
