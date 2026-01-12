import { NextRequest, NextResponse } from "next/server";
import { isPublicPath, ROUTES } from "./config/routes";
import { getApiUrl } from "./config/api";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Only run auth check on protected paths
  if(isPublicPath(pathname)) {
    return NextResponse.next();
  }
  const token = request.cookies.get("token");

  if(!token) {
    console.log("[Middleware] No token found for path:", pathname);
    return redirectToLogin(request);
  }
  try {
    // Call backend /auth to validate current auth state
    // Pass all cookies to the backend
    const res = await fetch(getApiUrl('auth'), {
      method: "GET",
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
      credentials: "include",
    });
    
    console.log("[Middleware] Auth check for", pathname, "- Status:", res.status);
    
    if(res.status === 401) {
      console.log("[Middleware] Unauthorized, redirecting to login");
      return redirectToLogin(request);
    }
    return NextResponse.next();
  } catch (error) {
    // If backend is down or request fails, don't crash the app
    console.error("[Middleware] Auth check failed:", error);
    return redirectToLogin(request);
  }
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL(ROUTES.login, request.url);
  loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};