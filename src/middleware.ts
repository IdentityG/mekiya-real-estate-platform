import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Note: Auth checking is now handled at the page/layout level
// Middleware in Next.js 15+ with NextAuth v5 should be minimal
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // For admin routes, we'll rely on page-level auth checks
  // This is because Edge Runtime doesn't support bcrypt/database calls
  // See: https://nextjs.org/docs/messages/node-module-in-edge-runtime

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|images).*)",
  ],
};
