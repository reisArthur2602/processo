import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const getSecret = () => new TextEncoder().encode(process.env.JWT_SECRET ?? "");

const verifyToken = async (token: string): Promise<boolean> => {
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
};

export const proxy = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;

  const isProtected = pathname.startsWith("/dashboard");
  const isAuthRoute = pathname.startsWith("/auth");

  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
    const valid = await verifyToken(token);
    if (!valid) {
      const response = NextResponse.redirect(new URL("/auth", request.url));
      response.cookies.delete("auth_token");
      return response;
    }
  }

  if (isAuthRoute && token) {
    const valid = await verifyToken(token);
    if (valid) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/dashboard/:path*", "/auth"],
};
