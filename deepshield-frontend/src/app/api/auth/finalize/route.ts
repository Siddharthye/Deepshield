import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  AUTH_COOKIE,
  AUTH_COOKIE_MAX_AGE_SECONDS,
  decodePendingUserCookie,
  encodePendingUserCookie,
} from "@/lib/authStorage";
import {
  authCookieOptions,
  getGoogleClientSecret,
  PENDING_USER_COOKIE,
  safeReturnPath,
  SESSION_BOOTSTRAP_COOKIE,
} from "@/lib/googleOAuth";
import { verifyHandoffToken } from "@/lib/oauthHandoff";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const returnTo = safeReturnPath(request.nextUrl.searchParams.get("from"));
  const handoff = request.nextUrl.searchParams.get("handoff");
  const handoffUser = handoff
    ? verifyHandoffToken(handoff, getGoogleClientSecret())
    : null;

  let user = handoffUser;
  if (!user) {
    const pendingRaw = request.cookies.get(PENDING_USER_COOKIE)?.value;
    if (!pendingRaw) {
      if (request.cookies.get(AUTH_COOKIE)?.value === "1") {
        return NextResponse.redirect(new URL(returnTo, request.url), 303);
      }
      return NextResponse.redirect(new URL("/login?error=oauth_missing", request.url), 303);
    }
    user = decodePendingUserCookie(pendingRaw);
  }

  if (!user) {
    return NextResponse.redirect(new URL("/login?error=oauth_missing", request.url), 303);
  }

  const response = NextResponse.redirect(new URL(returnTo, request.url), 303);
  response.cookies.set(AUTH_COOKIE, "1", {
    ...authCookieOptions(request, AUTH_COOKIE_MAX_AGE_SECONDS),
    httpOnly: true,
  });
  response.cookies.set(SESSION_BOOTSTRAP_COOKIE, encodePendingUserCookie(user), {
    ...authCookieOptions(request, 300),
    httpOnly: false,
  });
  response.cookies.set(PENDING_USER_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}
