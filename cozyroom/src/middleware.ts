import { NextRequest, NextResponse } from "next/server";
import { isPublicPath, ROUTES } from "./config/routes";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Only run auth check on protected paths
  if(isPublicPath(pathname)) {
    return NextResponse.next();
  }
  const token = request.cookies.get("token");

  if(!token) {
    return redirectToLogin(request);
  }
  try {
    // Call backend /auth to validate current auth state
    const res = await fetch("http://localhost:3001/auth", {
      // TODO: once you store a token in a cookie, forward it here (e.g. Authorization header)
      method: "GET",
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });
    if(res.status === 401) {
      return redirectToLogin(request);
    }
    return NextResponse.next();
  } catch (error) {
    // If backend is down or request fails, don't crash the app
    console.error("Auth check failed in middleware:", error);
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