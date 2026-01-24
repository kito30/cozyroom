import { NextRequest, NextResponse } from "next/server";
import { isPublicPath, ROUTES } from "./config/routes";
import { getApiUrl } from "./config/api";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("access_token");
  const refreshToken = request.cookies.get("refresh_token");

  // If we have valid access token, let it through
  if (accessToken) {
    return NextResponse.next();
  }

  // No access token but have refresh token → refresh it
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
        // Only delete cookies if it's a 401 (invalid/expired token)
        // For other errors (500, 503, network issues), keep cookies for retry
        if (res.status === 401) {
          console.error("[Middleware] Token invalid (401) - logging out");
          return redirectToLogin(request);
        }
        
        return NextResponse.next();
      }

      const tokens: { access_token: string; refresh_token: string; expires_in: number } =
        await res.json();

      const response = NextResponse.next();

      // Set new cookies
      response.cookies.set("access_token", tokens.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: tokens.expires_in,
      });

      response.cookies.set("refresh_token", tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      return response;
    } catch (error) {
      console.error("[Middleware] Network error during token refresh:", error instanceof Error ? error.message : error);
      return NextResponse.next();
    }
  }

  // No tokens at all → redirect to login
  return redirectToLogin(request);
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL(ROUTES.login, request.url);
  loginUrl.searchParams.set("redirect", request.nextUrl.pathname);

  const response = NextResponse.redirect(loginUrl);

  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};