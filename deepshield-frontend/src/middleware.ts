import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE } from "@/lib/authStorage";

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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const authed = request.cookies.get(AUTH_COOKIE)?.value === "1";
  if (authed) {
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
