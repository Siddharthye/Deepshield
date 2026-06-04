import type { NextRequest } from "next/server";

export const GOOGLE_AUTH_COOKIE_STATE = "google_oauth_state";
export const GOOGLE_AUTH_COOKIE_FROM = "google_oauth_from";
export const PENDING_USER_COOKIE = "deepshield_user_pending";

/** Canonical site origin for OAuth (must match Google Console redirect URIs). */
export function getGoogleOAuthBaseUrl(request: NextRequest): string {
  const explicit = process.env.GOOGLE_REDIRECT_URI?.trim();
  if (explicit) {
    return explicit
      .replace(/\/api\/auth\/google\/callback\/?$/i, "")
      .replace(/\/$/, "");
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  if (forwardedHost) {
    const proto = request.headers.get("x-forwarded-proto") ?? "https";
    const host = forwardedHost.split(",")[0]?.trim();
    if (host) return `${proto}://${host}`.replace(/\/$/, "");
  }

  if (process.env.NODE_ENV !== "production") {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
    if (appUrl) return appUrl.replace(/\/$/, "");
  }

  return request.nextUrl.origin.replace(/\/$/, "");
}

export function getGoogleRedirectUri(baseUrl: string): string {
  return `${baseUrl.replace(/\/$/, "")}/api/auth/google/callback`;
}

export function resolveGoogleRedirectUri(request: NextRequest): string {
  return getGoogleRedirectUri(getGoogleOAuthBaseUrl(request));
}

export function appUrl(request: NextRequest, pathname: string): URL {
  return new URL(pathname, `${getGoogleOAuthBaseUrl(request)}/`);
}

export function buildGoogleAuthUrl(params: {
  clientId: string;
  redirectUri: string;
  state: string;
}): string {
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", params.clientId);
  url.searchParams.set("redirect_uri", params.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", params.state);
  url.searchParams.set("prompt", "select_account");
  url.searchParams.set("access_type", "online");
  return url.toString();
}

export async function exchangeGoogleCode(
  code: string,
  redirectUri: string,
  clientId: string,
  clientSecret: string,
): Promise<{ access_token: string }> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`token_exchange_failed:${res.status}:${detail.slice(0, 200)}`);
  }
  return res.json() as Promise<{ access_token: string }>;
}

export type GoogleUserInfo = {
  email: string;
  name: string;
  picture?: string;
  sub: string;
};

export async function fetchGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const res = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    throw new Error(`userinfo_failed:${res.status}`);
  }
  const data = (await res.json()) as GoogleUserInfo;
  if (!data.email) throw new Error("userinfo_missing_email");
  return data;
}

export function isGoogleOAuthConfigured(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}
