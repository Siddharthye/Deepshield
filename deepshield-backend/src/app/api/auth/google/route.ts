import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  buildGoogleAuthUrl,
  createOAuthState,
  getGoogleClientId,
  getGoogleRedirectUri,
  GOOGLE_AUTH_COOKIE_FROM,
  GOOGLE_AUTH_COOKIE_REDIRECT,
  GOOGLE_AUTH_COOKIE_RETURN_ORIGIN,
  GOOGLE_AUTH_COOKIE_STATE,
  isGoogleOAuthConfigured,
  oauthCookieSecure,
  safeReturnOrigin,
  safeReturnPath,
} from "@/lib/googleOAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const returnOrigin =
    safeReturnOrigin(request.nextUrl.searchParams.get("return_origin")) ??
    safeReturnOrigin(request.headers.get("origin"));

  if (!isGoogleOAuthConfigured()) {
    if (returnOrigin) {
      const login = new URL("/login", `${returnOrigin}/`);
      login.searchParams.set("error", "google_not_configured");
      return NextResponse.redirect(login, 303);
    }
    return NextResponse.json({ error: "google_not_configured" }, { status: 503 });
  }

  const returnTo = safeReturnPath(request.nextUrl.searchParams.get("from"));

  const clientId = getGoogleClientId();  const redirectUri = getGoogleRedirectUri(request);
  const { state, nonce } = createOAuthState(returnTo, returnOrigin);

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
  if (returnOrigin) {
    response.cookies.set(GOOGLE_AUTH_COOKIE_RETURN_ORIGIN, returnOrigin, cookieBase);
  }

  return response;
}
