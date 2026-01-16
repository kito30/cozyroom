import { NextRequest, NextResponse } from "next/server";
import { isPublicPath, ROUTES } from "./config/routes";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Only run auth check on protected paths
  if(isPublicPath(pathname)) {
    return NextResponse.next();
  }
  
  // Check if token cookie exists
  // Backend endpoints will validate the token via AuthGuard
  const token = request.cookies.get("token");

  if(!token) {
    console.log("[Middleware] No token found for path:", pathname);
    return redirectToLogin(request);
  }
  
  // Token exists, allow request through
  // Backend AuthGuard will validate the token
  return NextResponse.next();
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