import { betterFetch } from "@better-fetch/fetch";
import { NextResponse, type NextRequest } from "next/server";
import type { auth } from "@/lib/auth";

type Session = typeof auth.$Infer.Session;

export default async function authMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAuthRoute = pathname.startsWith("/auth");
  const isProtectedRoute = pathname.startsWith("/dashboard");

  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: process.env.BETTER_AUTH_URL,
      headers: {
        //get the cookie from the request
        cookie: request.headers.get("cookie") || "",
      },
    },
  );

  // Redirect to login if user is not authenticated
  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.nextUrl));
  }

  // Redirect to dashboard if user is authenticated and trying to access auth routes
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
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
