import { NextRequest, NextResponse } from "next/server";
import { isPublicPath, ROUTES } from "@/src/config/routes";
import { getApiUrl } from "@/src/config/api";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) 
    return NextResponse.next();

  const accessToken = request.cookies.get("access_token");
  const refreshToken = request.cookies.get("refresh_token");

  // Trust existing access token – expiry is enforced by cookie maxAge
  if (accessToken) {
    return NextResponse.next();
  }

  // No access token but have refresh token → try refresh once
  if (refreshToken) {
    try {
      const res = await fetch(getApiUrl("refresh"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: request.headers.get("cookie") || "",
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          // real invalid/expired → clear cookies + redirect
          return redirectToLogin(request);
        }
        // backend error → keep cookies, don’t log out
        return NextResponse.next();
      }

      const tokens = await res.json();
      const response = NextResponse.next();

      response.cookies.set("access_token", tokens.access_token, {
        ...COOKIE_OPTIONS,
        maxAge: tokens.expires_in ?? 3600,
      });

      response.cookies.set("refresh_token", tokens.refresh_token, {
        ...COOKIE_OPTIONS,
        maxAge: 60 * 60 * 24 * 30,
      });

      return response;
    } catch {
      // network / backend down → keep cookies, don’t log out
      return NextResponse.next();
    }
  }

  // No tokens at all
  return redirectToLogin(request);
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL(ROUTES.login, request.url);
  loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
  const response = NextResponse.redirect(loginUrl);

  // Clear cookies by setting maxAge: 0 with same path/options
  response.cookies.set("access_token", "", { ...COOKIE_OPTIONS, maxAge: 0 });
  response.cookies.set("refresh_token", "", { ...COOKIE_OPTIONS, maxAge: 0 });

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};