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

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("access_token");
  const refreshToken = request.cookies.get("refresh_token");

  // If we have an access token, validate it (might be expired)
  if (accessToken) {
    try {
      const authRes = await fetch(getApiUrl("auth"), {
        method: "GET",
        headers: {
          Cookie: request.headers.get("cookie") || "",
        },
      });
      if (authRes.ok) {
        return NextResponse.next();
      }
      // 401 or other error → token invalid or expired, try refresh below
    } catch {
      // Network error → allow through, API will return 401 if needed
      return NextResponse.next();
    }
  }

  // No valid access token; try refresh if we have refresh_token
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
          return redirectToLogin(request);
        }
        return NextResponse.next();
      }

      const tokens: { access_token: string; refresh_token: string; expires_in: number } =
        await res.json();

      const response = NextResponse.next();

      response.cookies.set("access_token", tokens.access_token, {
        ...COOKIE_OPTIONS,
        maxAge: tokens.expires_in ?? 3600,
      });
      response.cookies.set("refresh_token", tokens.refresh_token, {
        ...COOKIE_OPTIONS,
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      return response;
    } catch (error) {
      console.error("[Middleware] Refresh failed:", error instanceof Error ? error.message : error);
      return redirectToLogin(request);
    }
  }

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