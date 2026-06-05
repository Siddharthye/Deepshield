import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getGoogleClientId,
  getRequestOrigin,
  isGoogleOAuthConfigured,
  resolveGoogleRedirectUri,
} from "@/lib/googleOAuth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Returns the redirect URI to register in Google Cloud Console (for setup debugging). */
export async function GET(request: NextRequest) {
  const redirectUri = resolveGoogleRedirectUri(request);
  const requestOrigin = getRequestOrigin(request);
  const clientId = getGoogleClientId();

  return NextResponse.json(
    {
      ok: isGoogleOAuthConfigured(),
      requestOrigin,
      redirectUri,
      registerInGoogleConsole: [redirectUri],
      backendOAuthCallback:
        "When NEXT_PUBLIC_API_URL points to the API host, Google sign-in runs there. Also register:",
      backendRedirectUri:
        "https://deepshield-xi.vercel.app/api/auth/google/callback",
      clientIdHint: clientId ? `${clientId.slice(0, 12)}…` : null,
      instructions:
        "Add every URL in registerInGoogleConsole (and backendRedirectUri when using split deploy) to Google Cloud Console → Credentials → OAuth Web client → Authorized redirect URIs.",
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
