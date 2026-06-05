import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { AuthUser } from "@/lib/authTypes";
import {
  exchangeGoogleCode,
  fetchGoogleUserInfo,
  getGoogleClientId,
  getGoogleClientSecret,
  getRequestOrigin,
  GOOGLE_AUTH_COOKIE_FROM,
  GOOGLE_AUTH_COOKIE_REDIRECT,
  GOOGLE_AUTH_COOKIE_RETURN_ORIGIN,
  GOOGLE_AUTH_COOKIE_STATE,
  isGoogleOAuthConfigured,
  parseOAuthState,
  safeReturnOrigin,
  safeReturnPath,
} from "@/lib/googleOAuth";
import { createHandoffToken } from "@/lib/oauthHandoff";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function loginErrorUrl(origin: string, code: string): URL {
  const login = new URL("/login", `${origin}/`);
  login.searchParams.set("error", code);
  return login;
}

export async function GET(request: NextRequest) {
  const fallbackOrigin =
    safeReturnOrigin(request.cookies.get(GOOGLE_AUTH_COOKIE_RETURN_ORIGIN)?.value) ??
    getRequestOrigin(request);

  if (!isGoogleOAuthConfigured()) {
    return NextResponse.redirect(loginErrorUrl(fallbackOrigin, "google_not_configured"), 303);
  }

  const { searchParams } = request.nextUrl;
  const oauthError = searchParams.get("error");
  if (oauthError) {
    return NextResponse.redirect(
      loginErrorUrl(
        fallbackOrigin,
        oauthError === "access_denied" ? "google_denied" : "google_failed",
      ),
      303,
    );
  }

  const code = searchParams.get("code");
  const state = searchParams.get("state") ?? "";
  const parsedState = parseOAuthState(state);
  const savedNonce = request.cookies.get(GOOGLE_AUTH_COOKIE_STATE)?.value;

  if (!code || !parsedState || !savedNonce || parsedState.nonce !== savedNonce) {
    return NextResponse.redirect(loginErrorUrl(fallbackOrigin, "oauth_state"), 303);
  }

  const returnOrigin =
    parsedState.returnOrigin ??
    safeReturnOrigin(request.cookies.get(GOOGLE_AUTH_COOKIE_RETURN_ORIGIN)?.value) ??
    getRequestOrigin(request);
  const returnTo = safeReturnPath(
    request.cookies.get(GOOGLE_AUTH_COOKIE_FROM)?.value ?? parsedState.returnTo,
  );

  const clientId = getGoogleClientId();
  const clientSecret = getGoogleClientSecret();
  const redirectUri =
    request.cookies.get(GOOGLE_AUTH_COOKIE_REDIRECT)?.value ??
    `${getRequestOrigin(request)}/api/auth/google/callback`;

  try {
    const tokens = await exchangeGoogleCode(code, redirectUri, clientId, clientSecret);
    const profile = await fetchGoogleUserInfo(tokens.access_token);

    const user: AuthUser = {
      email: profile.email,
      name: profile.name || profile.email.split("@")[0] || "User",
      provider: "google",
      picture: profile.picture,
    };

    const handoff = createHandoffToken(user, clientSecret);
    const finalizeUrl = new URL("/api/auth/finalize", `${returnOrigin}/`);
    finalizeUrl.searchParams.set("handoff", handoff);
    finalizeUrl.searchParams.set("from", returnTo);

    const response = NextResponse.redirect(finalizeUrl, 303);
    for (const name of [
      GOOGLE_AUTH_COOKIE_STATE,
      GOOGLE_AUTH_COOKIE_FROM,
      GOOGLE_AUTH_COOKIE_REDIRECT,
      GOOGLE_AUTH_COOKIE_RETURN_ORIGIN,
    ]) {
      response.cookies.set(name, "", { path: "/", maxAge: 0 });
    }
    return response;
  } catch (error) {
    console.error("[google/callback]", error);
    const msg = error instanceof Error ? error.message : "";
    const errorCode = msg.includes("redirect_uri") ? "google_redirect" : "google_failed";
    return NextResponse.redirect(loginErrorUrl(returnOrigin, errorCode), 303);
  }
}
