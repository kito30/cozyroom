import { NextRequest, NextResponse } from "next/server";
import { isPublicPath, ROUTES } from "./config/routes";
import { getApiUrl } from "./config/api";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if(isPublicPath(pathname)) {
    return NextResponse.next();
  }
  
  const accessToken = request.cookies.get("access_token");
  const refreshToken = request.cookies.get("refresh_token");

  // 1. If access_token exists, always verify with backend first
  // Backend will decide if token is valid (even if client-side check says expired)
  if(accessToken) {
    const cookieHeader = request.headers.get('cookie') || '';
    
    try {
      const authCheckResponse = await fetch(getApiUrl('auth'), {
        method: 'GET',
        headers: {
          'Cookie': cookieHeader,
        },
      });

      if (authCheckResponse.ok) {
        const authData = await authCheckResponse.json();
        
        // Backend says token is valid - allow request
        if (authData.user) {
          // If token appears expired client-side but backend says it's valid,
          // backend might have different expiration logic or grace period
          if (isTokenExpired(accessToken.value)) {
            console.log("[Middleware] Token appears expired but validated by backend");
          }
          return NextResponse.next();
        }
      }
    } catch (error) {
      console.error("[Middleware] Auth check failed:", error);
    }
  }

  // 3. Token invalid on backend or missing - try to refresh
  if(refreshToken) {
    try {
      console.log("[Middleware] Access token expired/invalid. Attempting refresh...");

      const cookieHeader = request.headers.get('cookie') || '';
      
      const refreshResponse = await fetch(getApiUrl('refresh'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookieHeader,
        },
      });

      if (refreshResponse.ok) {
        const tokens = await refreshResponse.json();
        const response = NextResponse.next();
        
        // Set new access_token with expires_in from backend
        response.cookies.set('access_token', tokens.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: tokens.expires_in || 3600,
        });

        // Update refresh_token if backend returns a new one (token rotation)
        if (tokens.refresh_token) {
          response.cookies.set('refresh_token', tokens.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 Days
          });
        }

        console.log("[Middleware] Token refreshed successfully");
        return response;
      } else {
        console.log("[Middleware] Refresh token expired or invalid");
      }
    } catch (error) {
      console.error("[Middleware] Refresh failed:", error);
    }
  }

  // 4. FAILURE: No valid tokens found. Redirect to login.
  return redirectToLogin(request);
}

// --- Helpers ---

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL(ROUTES.login, request.url);
  loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
  const response = NextResponse.redirect(loginUrl);
  
  // Clean up dead cookies so we don't get loops
  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");
  return response;
}

// Helper to check JWT expiration (works in Next.js Edge Runtime)
function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    
    const payloadBase64 = parts[1];
    if (!payloadBase64) return true;
    
    // Decode Base64 URL-safe (handle padding)
    const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    
    // Decode Base64 to string
    const binaryString = atob(paddedBase64);
    const jsonPayload = decodeURIComponent(
      binaryString.split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    
    const { exp } = JSON.parse(jsonPayload);
    
    if (!exp || typeof exp !== 'number') return true;
    
    // Check if expired (current time > expiration time)
    // Add 10-second buffer to account for clock skew
    const expirationTime = exp * 1000;
    const bufferTime = 10 * 1000; // 10 seconds
    return Date.now() >= (expirationTime - bufferTime);
  } catch {
    // If we can't decode it, assume it's expired
    return true;
  }
}


export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};