import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { USER_ROLE } from "./types/enums";

export default auth(async function proxy(req) {
  const { nextUrl } = req;
  const path = nextUrl.pathname;

  const publicRoutes = ["/favicon.ico", "/_next", "/api/auth"];
  const authRoutes = ["/login", "/register"];

  // Skip public asset routes
  if (publicRoutes.some((p) => path.startsWith(p))) {
    return NextResponse.next();
  }

  const isAuthRoute = authRoutes.some((p) => path.startsWith(p));

  // Check if user is logged in
  const isLoggedIn = !!req.auth;

  // 🔥 1. If logged in and visiting login/register → redirect home
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 🔥 2. If not logged in and visiting a protected route → redirect to login
  if (!isLoggedIn && !isAuthRoute) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirectUrl", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // 🔥 3. If logged in and visiting a unauthorized route
  if (
    (path.includes("/admin") && req.auth?.user?.role !== USER_ROLE.ADMIN) ||
    (path.includes("/delivery") &&
      req.auth?.user?.role !== USER_ROLE.DELIVERY_BOY) ||
    (path.includes("/user") && req.auth?.user?.role !== USER_ROLE.USER)
  ) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api/auth|favicon.ico|_next/static|_next/image|assets|images).*)",
  ],
};
