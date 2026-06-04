import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE } from "@/lib/authStorage";
import type { AuthUser } from "@/lib/authStorage";
import {
  exchangeGoogleCode,
  fetchGoogleUserInfo,
  getGoogleRedirectUri,
  GOOGLE_AUTH_COOKIE_FROM,
  GOOGLE_AUTH_COOKIE_STATE,
  isGoogleOAuthConfigured,
  PENDING_USER_COOKIE,
} from "@/lib/googleOAuth";

const COOKIE_MAX_AGE = 30 * 24 * 60 * 60;

function redirectToLogin(request: NextRequest, error: string) {
  return NextResponse.redirect(new URL(`/login?error=${error}`, request.url));
}

export async function GET(request: NextRequest) {
  if (!isGoogleOAuthConfigured()) {
    return redirectToLogin(request, "google_not_configured");
  }

  const { searchParams } = request.nextUrl;
  const oauthError = searchParams.get("error");
  if (oauthError) {
    return redirectToLogin(request, oauthError === "access_denied" ? "google_denied" : "google_failed");
  }

  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const savedState = request.cookies.get(GOOGLE_AUTH_COOKIE_STATE)?.value;

  if (!code || !state || !savedState || state !== savedState) {
    return redirectToLogin(request, "oauth_state");
  }

  const clientId = process.env.GOOGLE_CLIENT_ID!;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
  const origin = request.nextUrl.origin;
  const redirectUri = getGoogleRedirectUri(origin);
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
    const secure = process.env.NODE_ENV === "production";

    response.cookies.set(AUTH_COOKIE, "1", {
      path: "/",
      maxAge: COOKIE_MAX_AGE,
      sameSite: "lax",
      secure,
    });
    response.cookies.set(PENDING_USER_COOKIE, JSON.stringify(user), {
      path: "/",
      maxAge: 120,
      sameSite: "lax",
      secure,
      httpOnly: false,
    });
    response.cookies.set(GOOGLE_AUTH_COOKIE_STATE, "", { path: "/", maxAge: 0 });
    response.cookies.set(GOOGLE_AUTH_COOKIE_FROM, "", { path: "/", maxAge: 0 });

    return response;
  } catch {
    return redirectToLogin(request, "google_failed");
  }
}
