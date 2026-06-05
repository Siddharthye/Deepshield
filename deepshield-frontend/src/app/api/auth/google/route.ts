import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  buildGoogleAuthUrl,
  createOAuthState,
  getGoogleClientId,
  getGoogleOAuthBaseUrl,
  getRequestOrigin,
  GOOGLE_AUTH_COOKIE_FROM,
  GOOGLE_AUTH_COOKIE_REDIRECT,
  GOOGLE_AUTH_COOKIE_STATE,
  isGoogleOAuthConfigured,
  oauthCookieSecure,
  resolveGoogleRedirectUri,
  safeReturnPath,
  shouldRedirectToCanonicalOAuthHost,
} from "@/lib/googleOAuth";

export async function GET(request: NextRequest) {
  if (!isGoogleOAuthConfigured()) {
    return NextResponse.redirect(
      new URL("/login?error=google_not_configured", request.url),
    );
  }

  const returnTo = safeReturnPath(request.nextUrl.searchParams.get("from"));

  if (shouldRedirectToCanonicalOAuthHost(request)) {
    const canonicalBase = getGoogleOAuthBaseUrl(request);
    const start = new URL("/api/auth/google", `${canonicalBase}/`);
    start.searchParams.set("from", returnTo);
    return NextResponse.redirect(start);
  }

  const clientId = getGoogleClientId();
  const redirectUri = resolveGoogleRedirectUri(request);
  const { state, nonce } = createOAuthState(returnTo);

  const response = NextResponse.redirect(
    buildGoogleAuthUrl({ clientId, redirectUri, state }),
  );

  const cookieBase = {
    httpOnly: true,
    secure: oauthCookieSecure(request),
    sameSite: "lax" as const,
    path: "/",
    maxAge: 600,
  };

  response.cookies.set(GOOGLE_AUTH_COOKIE_STATE, nonce, cookieBase);
  response.cookies.set(GOOGLE_AUTH_COOKIE_FROM, returnTo, cookieBase);
  response.cookies.set(GOOGLE_AUTH_COOKIE_REDIRECT, redirectUri, cookieBase);

  return response;
}
