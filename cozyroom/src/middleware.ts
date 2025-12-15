import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/home"];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login (and any non‑protected route) through without checks
  if (pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  // Only run auth check on protected paths
  const isProtected = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path),
  );
  if (!isProtected) {
    return NextResponse.next();
  }

  let res: Response;

  try {
    // Call backend /auth to validate current auth state
    res = await fetch("http://localhost:3001/auth", {
      // TODO: once you store a token in a cookie, forward it here (e.g. Authorization header)
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });
  } catch (error) {
    // If backend is down or request fails, don't crash the app
    console.error("Auth check failed in middleware:", error);
    return NextResponse.next();
  }

  if (res.status === 401) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home/:path*"],
};