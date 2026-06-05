import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE, encodePendingUserCookie } from "@/lib/authStorage";
import type { AuthUser } from "@/lib/authStorage";
import {
  exchangeGoogleCode,
  fetchGoogleUserInfo,
  getGoogleClientId,
  getGoogleClientSecret,
  GOOGLE_AUTH_COOKIE_FROM,
  GOOGLE_AUTH_COOKIE_REDIRECT,
  GOOGLE_AUTH_COOKIE_STATE,
  isGoogleOAuthConfigured,
  mapGoogleOAuthError,
  parseOAuthState,
  PENDING_USER_COOKIE,
  authCookieOptions,
  resolveGoogleRedirectUri,
  safeReturnPath,
  SESSION_BOOTSTRAP_COOKIE,
} from "@/lib/googleOAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clearAuthCookies(response: NextResponse) {
  for (const name of [
    AUTH_COOKIE,
    PENDING_USER_COOKIE,
    SESSION_BOOTSTRAP_COOKIE,
    GOOGLE_AUTH_COOKIE_STATE,
    GOOGLE_AUTH_COOKIE_FROM,
    GOOGLE_AUTH_COOKIE_REDIRECT,
  ]) {
    response.cookies.set(name, "", { path: "/", maxAge: 0 });
  }
}

function redirectToLogin(request: NextRequest, error: string) {
  const login = new URL("/login", request.url);
  login.searchParams.set("error", error);
  const response = NextResponse.redirect(login, 303);
  clearAuthCookies(response);
  return response;
}

export async function GET(request: NextRequest) {
  if (!isGoogleOAuthConfigured()) {
    return redirectToLogin(request, "google_not_configured");
  }

  const { searchParams } = request.nextUrl;
  const oauthError = searchParams.get("error");
  if (oauthError) {
    return redirectToLogin(
      request,
      oauthError === "access_denied" ? "google_denied" : "google_failed",
    );
  }

  const code = searchParams.get("code");
  const state = searchParams.get("state") ?? "";
  const parsedState = parseOAuthState(state);
  const savedNonce = request.cookies.get(GOOGLE_AUTH_COOKIE_STATE)?.value;

  if (!code || !parsedState || !savedNonce || parsedState.nonce !== savedNonce) {
    console.error("[google/callback] oauth_state mismatch", {
      hasCode: Boolean(code),
      hasState: Boolean(state),
      hasSavedNonce: Boolean(savedNonce),
    });
    return redirectToLogin(request, "oauth_state");
  }

  const clientId = getGoogleClientId();
  const clientSecret = getGoogleClientSecret();
  const redirectUri =
    request.cookies.get(GOOGLE_AUTH_COOKIE_REDIRECT)?.value ||
    resolveGoogleRedirectUri(request);
  const returnTo = safeReturnPath(
    request.cookies.get(GOOGLE_AUTH_COOKIE_FROM)?.value ?? parsedState.returnTo,
  );

  try {
    const tokens = await exchangeGoogleCode(code, redirectUri, clientId, clientSecret);
    const profile = await fetchGoogleUserInfo(tokens.access_token);

    const user: AuthUser = {
      email: profile.email,
      name: profile.name || profile.email.split("@")[0] || "User",
      provider: "google",
      picture: profile.picture,
    };

    const finalizeUrl = new URL("/api/auth/finalize", request.url);
    finalizeUrl.searchParams.set("from", returnTo);

    const response = NextResponse.redirect(finalizeUrl, 303);
    response.cookies.set(PENDING_USER_COOKIE, encodePendingUserCookie(user), {
      ...authCookieOptions(request, 300),
      httpOnly: true,
    });
    response.cookies.set(GOOGLE_AUTH_COOKIE_STATE, "", { path: "/", maxAge: 0 });
    response.cookies.set(GOOGLE_AUTH_COOKIE_FROM, "", { path: "/", maxAge: 0 });
    response.cookies.set(GOOGLE_AUTH_COOKIE_REDIRECT, "", { path: "/", maxAge: 0 });

    return response;
  } catch (error) {
    console.error("[google/callback]", error);
    return redirectToLogin(request, mapGoogleOAuthError(error));
  }
}
