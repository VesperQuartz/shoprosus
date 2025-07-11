import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export const middleware = (request: NextRequest) => {
  const sessionCookie = getSessionCookie(request);
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }
  return NextResponse.next();
};

export const config = {
  matcher: ["/"], // Specify the routes the middleware applies to
};
