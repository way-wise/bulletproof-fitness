import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
   const session = getSessionCookie(request);
   const onlyProtectedRoutes = ["/upload-video"];


   const { pathname } = request.nextUrl;

   if (onlyProtectedRoutes.includes(pathname)) {
    if (!session) {
      return NextResponse.redirect(new URL("/forms-button", request.url));
    }
   }

  /**
   * Trailing slash is important in the route prefix.
   * Prefix is defined to avoid manually declaring routes.
   * RoutePrefix type ensures that the correct route prefix is used, preventing unintended access.
   */
  type RoutePrefix = `/${string}/`;
  const authRoutePrefix: RoutePrefix[] = ["/auth/"];
  const protectedRoutePrefix: RoutePrefix[] = ["/dashboard/"];

  // Auth routes (e.g., /auth/login)
  const isAuthRoute =
    pathname == "/auth" ||
    authRoutePrefix.some((prefix) => pathname.startsWith(prefix));

  // Protected routes (e.g., /dashboard/settings)
  const isProtectedRoute =
    pathname == "/dashboard" ||
    protectedRoutePrefix.some((prefix) => pathname.startsWith(prefix));

  /**
   * If not authenticated don't allow /dashboard pages
   * Redirect to /auth/sign-in
   */
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  /**
   * If authenticated don't allow /auth pages
   * Redirect to /dashboard
   */
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
