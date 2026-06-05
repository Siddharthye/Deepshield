import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getGoogleClientId,
  isGoogleOAuthConfigured,
  resolveGoogleRedirectUri,
} from "@/lib/googleOAuth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Returns the redirect URI to register in Google Cloud Console (for setup debugging). */
export async function GET(request: NextRequest) {
  const redirectUri = resolveGoogleRedirectUri(request);
  const clientId = getGoogleClientId();
  return NextResponse.json(
    {
      ok: isGoogleOAuthConfigured(),
      origin: request.nextUrl.origin,
      redirectUri,
      clientIdHint: clientId ? `${clientId.slice(0, 12)}…` : null,
      envRedirectOverride: Boolean(process.env.GOOGLE_REDIRECT_URI?.trim()),
      note:
        "redirectUri always uses the current site origin so OAuth cookies stay on the same host.",
      instructions:
        "Add redirectUri exactly under Google Cloud Console → Credentials → OAuth Web client → Authorized redirect URIs. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET on the FRONTEND Vercel project.",
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
