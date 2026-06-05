import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  AUTH_COOKIE,
  AUTH_COOKIE_MAX_AGE_SECONDS,
  decodePendingUserCookie,
} from "@/lib/authStorage";
import { authCookieOptions, PENDING_USER_COOKIE } from "@/lib/googleOAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const raw = request.cookies.get(PENDING_USER_COOKIE)?.value;
  const authed = request.cookies.get(AUTH_COOKIE)?.value === "1";

  if (!raw) {
    return NextResponse.json({ user: null, authed });
  }

  const user = decodePendingUserCookie(raw);
  if (!user) {
    return NextResponse.json({ user: null, authed: false }, { status: 400 });
  }

  const response = NextResponse.json({ user, authed: true });
  response.cookies.set(AUTH_COOKIE, "1", {
    ...authCookieOptions(request, AUTH_COOKIE_MAX_AGE_SECONDS),
    httpOnly: true,
  });
  response.cookies.set(PENDING_USER_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}
