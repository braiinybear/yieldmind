import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Protect pages when there is no authenticated user and enforce admin role
// for admin routes. This runs for matched routes in `config.matcher`.
export default auth(async (req) => {
  const { pathname, origin } = req.nextUrl;

  // If no user is logged in, redirect attempts to access protected pages
  if (!req.auth || !req.auth.user) {
    if (pathname.startsWith("/careers") || pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/login", origin));
    }

    // Not a protected path — allow through
    return;
  }

  // If user is logged in but trying to access admin routes, verify role
  if (pathname.startsWith("/admin")) {
    // Prefer id from req.auth.user, fallback to token sub
    type AuthUser = { id?: string };
    type AuthToken = { sub?: string };
    const userId = (req.auth.user && (req.auth.user as AuthUser).id) ||
      ((req.auth as { token?: AuthToken })?.token && (req.auth as { token?: AuthToken }).token?.sub);

    if (!userId) {
      return NextResponse.redirect(new URL("/login", origin));
    }

    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user || user.role !== "ADMIN") {
        // Not authorized — send them back to home (or an unauthorized page)
        return NextResponse.redirect(new URL("/", origin));
      }
    } catch (err) {
      // If DB check fails, be conservative and block access
      console.error("proxy admin role check error:", err);
      return NextResponse.redirect(new URL("/", origin));
    }
  }

  // Allow request to continue
  return;
});

export const config = {
  // The matcher tells Next.js which routes this Proxy should run on.
  // We exclude static files (images, css) and the API routes themselves.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};