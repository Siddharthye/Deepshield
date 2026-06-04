import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

/** Proxy match thumbnails for trace UI (avoids hotlink/CORS blocks). */
export async function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get("url")?.trim();
  if (!raw) {
    return NextResponse.json({ error: "url required" }, { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(raw);
  } catch {
    return NextResponse.json({ error: "invalid url" }, { status: 400 });
  }

  if (!ALLOWED_PROTOCOLS.has(target.protocol)) {
    return NextResponse.json({ error: "invalid protocol" }, { status: 400 });
  }

  const host = target.hostname.toLowerCase();
  if (
    host === "localhost" ||
    host.endsWith(".local") ||
    /^127\./.test(host) ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    host === "0.0.0.0"
  ) {
    return NextResponse.json({ error: "host not allowed" }, { status: 403 });
  }

  try {
    const res = await fetch(target.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; DeepShield/1.0; +https://deepshield.app)",
        Accept: "image/*,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(12_000),
      redirect: "follow",
    });

    if (!res.ok) {
      return NextResponse.json({ error: "upstream failed" }, { status: 502 });
    }

    const contentType = res.headers.get("content-type") ?? "image/jpeg";
    if (!contentType.startsWith("image/")) {
      return NextResponse.json({ error: "not an image" }, { status: 415 });
    }

    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length === 0 || buf.length > MAX_BYTES) {
      return NextResponse.json({ error: "image too large" }, { status: 413 });
    }

    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "fetch failed" }, { status: 502 });
  }
}
