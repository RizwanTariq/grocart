import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function proxy(request: NextRequest) {
  const publicRoutes = [
    "/login",
    "/register",
    "/api/auth",
    "/favicon.ico",
    "/_next",
  ];
  const { pathname } = request.nextUrl;
  const isPublicRoute = publicRoutes.some((path) => pathname.startsWith(path));
  if (isPublicRoute) {
    return NextResponse.next();
  }
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Default continue normally
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|favicon.ico|_next/static|_next/image|assets|images).*)",
  ],
};
