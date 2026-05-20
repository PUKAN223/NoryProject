import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "nory-super-secret-key-for-dev",
);

const protectedRoutes = ["/", "/timeline", "/analytics", "/profile"];
const publicRoutes = ["/login", "/signup"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.includes(pathname);
  const isPublic = publicRoutes.includes(pathname);

  if (!isProtected && !isPublic) {
    return NextResponse.next();
  }

  const token = request.cookies.get("nory-session")?.value;
  let isAuthenticated = false;

  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isAuthenticated = true;
    } catch (err) {
      isAuthenticated = false;
    }
  }

  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isPublic && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon.png|sw.js|manifest.webmanifest).*)",
  ],
};
