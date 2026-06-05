import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getGoogleClientId,
  getGoogleOAuthBaseUrl,
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
  const canonicalOrigin = getGoogleOAuthBaseUrl(request);
  const clientId = getGoogleClientId();

  const registerInGoogleConsole = [redirectUri];
  if (requestOrigin !== canonicalOrigin) {
    registerInGoogleConsole.push(
      `${requestOrigin.replace(/\/$/, "")}/api/auth/google/callback`,
    );
  }

  return NextResponse.json(
    {
      ok: isGoogleOAuthConfigured(),
      requestOrigin,
      canonicalOrigin,
      redirectUri,
      registerInGoogleConsole: [...new Set(registerInGoogleConsole)],
      clientIdHint: clientId ? `${clientId.slice(0, 12)}…` : null,
      env: {
        GOOGLE_REDIRECT_URI: Boolean(process.env.GOOGLE_REDIRECT_URI?.trim()),
        NEXT_PUBLIC_APP_URL: Boolean(process.env.NEXT_PUBLIC_APP_URL?.trim()),
        VERCEL_PROJECT_PRODUCTION_URL: Boolean(
          process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim(),
        ),
      },
      instructions:
        "In Google Cloud Console → Credentials → your OAuth Web client → Authorized redirect URIs, add every URL in registerInGoogleConsole exactly (including https and /api/auth/google/callback). Set GOOGLE_REDIRECT_URI on Vercel to your main production callback URL if you use a custom domain.",
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
