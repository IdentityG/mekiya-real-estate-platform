import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes
  if (pathname.startsWith("/admin")) {
    const session = await auth();

    // Redirect to login if not authenticated
    if (!session?.user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if user has admin privileges (not 'public' role)
    const userRole = session.user.role;
    if (userRole === "public") {
      // Regular users cannot access admin panel
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Optional: Super strict protection - only super_admin can access certain routes
    if (pathname.startsWith("/admin/users") && userRole !== "super_admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

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
