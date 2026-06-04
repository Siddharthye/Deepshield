import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
const AUTH_COOKIE = "deepshield_auth";

const LOGIN_PATH = "/login";

const PUBLIC_PREFIXES = ["/api/auth", "/auth/"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const authed = request.cookies.get(AUTH_COOKIE)?.value === "1";

  if (pathname === LOGIN_PATH) {
    if (authed) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (!authed) {
    const login = request.nextUrl.clone();
    login.pathname = LOGIN_PATH;
    if (pathname !== "/") {
      login.searchParams.set("from", pathname);
    }
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/).*)",
  ],
};
