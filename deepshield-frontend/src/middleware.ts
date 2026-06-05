import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE } from "@/lib/authStorage";
import {
  PENDING_USER_COOKIE,
  safeReturnPath,
  SESSION_BOOTSTRAP_COOKIE,
} from "@/lib/googleOAuth";

const LOGIN_PATH = "/login";

/** Routes that never require the auth cookie. */
function isPublicPath(pathname: string): boolean {
  return (
    pathname === LOGIN_PATH ||
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/api/auth/")
  );
}

/** App routes that require sign-in. */
const PROTECTED = [
  "/scan",
  "/trace",
  "/report",
  "/vault",
  "/rights",
  "/community",
  "/asha",
  "/learn",
] as const;

function isProtectedPath(pathname: string): boolean {
  if (pathname === "/") return true;
  return PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function isAuthed(request: NextRequest): boolean {
  if (request.cookies.get(AUTH_COOKIE)?.value === "1") return true;
  if (request.cookies.get(PENDING_USER_COOKIE)?.value) return true;
  if (request.cookies.get(SESSION_BOOTSTRAP_COOKIE)?.value) return true;
  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === LOGIN_PATH) {
    if (isAuthed(request)) {
      const dest = safeReturnPath(request.nextUrl.searchParams.get("from"));
      return NextResponse.redirect(new URL(dest, request.url));
    }
    return NextResponse.next();
  }

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  if (isAuthed(request)) {
    return NextResponse.next();
  }

  const login = request.nextUrl.clone();
  login.pathname = LOGIN_PATH;
  login.searchParams.set("from", pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/scan/:path*",
    "/trace/:path*",
    "/report/:path*",
    "/vault/:path*",
    "/rights/:path*",
    "/community/:path*",
    "/asha/:path*",
    "/learn/:path*",
  ],
};
