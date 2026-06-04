import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  buildGoogleAuthUrl,
  getGoogleRedirectUri,
  GOOGLE_AUTH_COOKIE_FROM,
  GOOGLE_AUTH_COOKIE_STATE,
  isGoogleOAuthConfigured,
} from "@/lib/googleOAuth";

function safeReturnPath(from: string | null): string {
  if (from && from.startsWith("/") && !from.startsWith("//") && !from.startsWith("/login")) {
    return from;
  }
  return "/";
}

export async function GET(request: NextRequest) {
  if (!isGoogleOAuthConfigured()) {
    return NextResponse.redirect(
      new URL("/login?error=google_not_configured", request.url),
    );
  }

  const clientId = process.env.GOOGLE_CLIENT_ID!;
  const origin = request.nextUrl.origin;
  const redirectUri = getGoogleRedirectUri(origin);
  const state = crypto.randomUUID();
  const returnTo = safeReturnPath(request.nextUrl.searchParams.get("from"));

  const response = NextResponse.redirect(
    buildGoogleAuthUrl({ clientId, redirectUri, state }),
  );

  const secure = process.env.NODE_ENV === "production";
  const cookieBase = {
    httpOnly: true,
    secure,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 600,
  };

  response.cookies.set(GOOGLE_AUTH_COOKIE_STATE, state, cookieBase);
  response.cookies.set(GOOGLE_AUTH_COOKIE_FROM, returnTo, cookieBase);

  return response;
}
