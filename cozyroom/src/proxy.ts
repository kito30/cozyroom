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

  console.log("[Middleware] Checking auth for path:", pathname, {
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
  });

  // 1. If access_token exists, verify with backend
  // Backend will handle all validation including expiration
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
        
        console.log("[Middleware] /auth response:", {
          hasUser: !!authData.user,
          hasAccessToken: !!authData.access_token,
          hasRefreshToken: !!authData.refresh_token,
        });
        
        // Backend says token is valid - allow request
        if (authData.user) {
          const response = NextResponse.next();
          
          // If backend refreshed tokens (returned new tokens), update cookies
          if (authData.access_token) {
            response.cookies.set('access_token', authData.access_token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
              maxAge: authData.expires_in || 3600,
            });
            
            // Update refresh_token if backend returned a new one (token rotation)
            if (authData.refresh_token) {
              response.cookies.set('refresh_token', authData.refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 24 * 7, // 7 Days
              });
            }
            
            console.log("[Middleware] Tokens refreshed by /auth endpoint");
          }
          
          return response;
        } else {
          console.log("[Middleware] /auth returned null user, will try refresh");
        }
      } else {
        console.log("[Middleware] /auth response not ok:", authCheckResponse.status);
      }
    } catch (error) {
      console.error("[Middleware] Auth check failed:", error);
    }
  }

  // 2. Token invalid on backend or missing - try to refresh
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



export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};