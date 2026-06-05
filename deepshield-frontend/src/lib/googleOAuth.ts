import type { NextRequest } from "next/server";

export const GOOGLE_AUTH_COOKIE_STATE = "google_oauth_state";
export const GOOGLE_AUTH_COOKIE_FROM = "google_oauth_from";
export const GOOGLE_AUTH_COOKIE_REDIRECT = "google_oauth_redirect";
export const PENDING_USER_COOKIE = "deepshield_user_pending";

function trimSecret(value: string | undefined): string {
  return value?.trim() ?? "";
}

/**
 * Site origin for OAuth redirects.
 * Prefer GOOGLE_REDIRECT_URI (stable production URL). Otherwise use the current request host
 * (works for Vercel preview URLs — add each preview callback to Google Console if needed).
 */
export function getGoogleOAuthBaseUrl(request: NextRequest): string {
  const explicit = process.env.GOOGLE_REDIRECT_URI?.trim();
  if (explicit) {
    return explicit
      .replace(/\/api\/auth\/google\/callback\/?$/i, "")
      .replace(/\/$/, "");
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
    let googleError = "";
    try {
      const parsed = JSON.parse(detail) as { error?: string };
      googleError = parsed.error ?? "";
    } catch {
      /* plain text */
    }
    throw new Error(
      `token_exchange_failed:${res.status}:${googleError}:${detail.slice(0, 120)}`,
    );
  }
  return res.json() as Promise<{ access_token: string }>;
}

export function mapGoogleOAuthError(error: unknown): string {
  const msg = error instanceof Error ? error.message : "";
  if (msg.includes("token_exchange_failed")) {
    if (msg.includes("redirect_uri_mismatch") || msg.includes("redirect_uri")) {
      return "google_redirect";
    }
    if (msg.includes("invalid_client") || msg.includes("invalid_grant")) {
      return "google_credentials";
    }
    return "google_token";
  }
  if (msg.includes("userinfo_failed") || msg.includes("userinfo_missing")) {
    return "google_userinfo";
  }
  return "google_failed";
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

export function getGoogleClientId(): string {
  return trimSecret(process.env.GOOGLE_CLIENT_ID);
}

export function getGoogleClientSecret(): string {
  return trimSecret(process.env.GOOGLE_CLIENT_SECRET);
}

export function isGoogleOAuthConfigured(): boolean {
  return Boolean(getGoogleClientId() && getGoogleClientSecret());
}

export function oauthCookieSecure(request: NextRequest): boolean {
  const proto = request.headers.get("x-forwarded-proto");
  return proto === "https" || process.env.NODE_ENV === "production";
}

export function authCookieOptions(request: NextRequest, maxAge: number) {
  return {
    path: "/",
    sameSite: "lax" as const,
    secure: oauthCookieSecure(request),
    maxAge,
  };
}
