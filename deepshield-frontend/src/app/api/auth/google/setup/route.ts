import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { resolveGoogleRedirectUri } from "@/lib/googleOAuth";

/** Returns the redirect URI to register in Google Cloud Console (for setup debugging). */
export async function GET(request: NextRequest) {
  const redirectUri = resolveGoogleRedirectUri(request);
  return NextResponse.json({
    redirectUri,
    instructions:
      "Google Cloud Console → APIs & Services → Credentials → your OAuth Web client → Authorized redirect URIs → add redirectUri exactly (including https and path).",
  });
}
