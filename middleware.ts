import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const session = getSessionCookie(request);

  const { pathname } = request.nextUrl;

  const protectedRoute = pathname.startsWith("/dashboard");
  const authRoute = pathname.startsWith("/auth");

  /**
   * If not authenticated don't allow /dashboard pages
   * Redirect to /auth/sign-in
   */
  if (protectedRoute) {
    return session
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  /**
   * If authenticated don't allow /auth pages
   * Redirect to /dashboard
   */
  if (authRoute) {
    return session
      ? NextResponse.redirect(new URL("/dashboard", request.url))
      : NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
