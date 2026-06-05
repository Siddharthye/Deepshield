import type { NextRequest } from "next/server";

export const GOOGLE_AUTH_COOKIE_STATE = "google_oauth_state";
export const GOOGLE_AUTH_COOKIE_FROM = "google_oauth_from";
export const GOOGLE_AUTH_COOKIE_RETURN_ORIGIN = "google_oauth_return_origin";
export const GOOGLE_AUTH_COOKIE_REDIRECT = "google_oauth_redirect";

function trimSecret(value: string | undefined): string {
  return value?.trim() ?? "";
}

export function getRequestOrigin(request: NextRequest): string {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  if (host) {
    return `${proto}://${host}`.replace(/\/$/, "");
  }
  return request.nextUrl.origin.replace(/\/$/, "");
}

export function getGoogleRedirectUri(request: NextRequest): string {
  return `${getRequestOrigin(request)}/api/auth/google/callback`;
}

export function safeReturnPath(from: string | null | undefined): string {
  if (from && from.startsWith("/") && !from.startsWith("//") && !from.startsWith("/login")) {
    return from;
  }
  return "/";
}

export function safeReturnOrigin(raw: string | null | undefined): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (url.username || url.password) return null;
    return url.origin;
  } catch {
    return null;
  }
}

export function createOAuthState(returnTo: string, returnOrigin: string | null): {
  state: string;
  nonce: string;
} {
  const nonce = crypto.randomUUID();
  const payload = JSON.stringify({
    returnTo,
    returnOrigin: returnOrigin ?? "",
  });
  const encoded = Buffer.from(payload, "utf8").toString("base64url");
  return { state: `${nonce}.${encoded}`, nonce };
}

export function parseOAuthState(state: string): {
  nonce: string;
  returnTo: string;
  returnOrigin: string | null;
} | null {
  const dot = state.indexOf(".");
  if (dot <= 0) return null;
  const nonce = state.slice(0, dot);
  const encoded = state.slice(dot + 1);
  try {
    const parsed = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    ) as { returnTo?: string; returnOrigin?: string };
    return {
      nonce,
      returnTo: safeReturnPath(parsed.returnTo),
      returnOrigin: safeReturnOrigin(parsed.returnOrigin),
    };
  } catch {
    return { nonce, returnTo: "/", returnOrigin: null };
  }
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
    throw new Error(`token_exchange_failed:${res.status}:${detail.slice(0, 160)}`);
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
