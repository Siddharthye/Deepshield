import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE } from "@/lib/authStorage";
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
  oauthCookieSecure,
  PENDING_USER_COOKIE,
  resolveGoogleRedirectUri,
} from "@/lib/googleOAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clearAuthCookies(response: NextResponse) {
  for (const name of [
    AUTH_COOKIE,
    PENDING_USER_COOKIE,
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
  const response = NextResponse.redirect(login);
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
  const state = searchParams.get("state");
  const savedState = request.cookies.get(GOOGLE_AUTH_COOKIE_STATE)?.value;

  if (!code || !state || !savedState || state !== savedState) {
    console.error("[google/callback] oauth_state mismatch", {
      hasCode: Boolean(code),
      hasState: Boolean(state),
      hasSavedState: Boolean(savedState),
    });
    return redirectToLogin(request, "oauth_state");
  }

  const clientId = getGoogleClientId();
  const clientSecret = getGoogleClientSecret();
  const redirectUri =
    request.cookies.get(GOOGLE_AUTH_COOKIE_REDIRECT)?.value ||
    resolveGoogleRedirectUri(request);
  const returnTo =
    request.cookies.get(GOOGLE_AUTH_COOKIE_FROM)?.value?.startsWith("/") &&
    !request.cookies.get(GOOGLE_AUTH_COOKIE_FROM)?.value?.startsWith("//")
      ? request.cookies.get(GOOGLE_AUTH_COOKIE_FROM)!.value
      : "/";

  try {
    const tokens = await exchangeGoogleCode(code, redirectUri, clientId, clientSecret);
    const profile = await fetchGoogleUserInfo(tokens.access_token);

    const user: AuthUser = {
      email: profile.email,
      name: profile.name || profile.email.split("@")[0] || "User",
      provider: "google",
      picture: profile.picture,
    };

    const completeUrl = new URL("/auth/complete", request.url);
    completeUrl.searchParams.set("from", returnTo);

    const response = NextResponse.redirect(completeUrl);

    response.cookies.set(PENDING_USER_COOKIE, JSON.stringify(user), {
      path: "/",
      maxAge: 300,
      sameSite: "lax",
      secure: oauthCookieSecure(request),
      httpOnly: false,
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
