import { auth } from "@/auth";

// NextAuth's 'auth' function works as a default export, which is perfectly
// compatible with the new Next.js 16 Proxy convention.
export default auth((req) => {
  // logic to protect routes can go here later
  // e.g. if (!req.auth && req.nextUrl.pathname === "/dashboard") ...
});

export const config = {
  // The matcher tells Next.js which routes this Proxy should run on.
  // We exclude static files (images, css) and the API routes themselves.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};