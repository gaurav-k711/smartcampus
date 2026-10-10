import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAccessingAdmin = req.nextUrl.pathname.startsWith("/admin");

    if (isAccessingAdmin && token?.role !== "ADMIN") {
      // If user is logged in but not an ADMIN, redirect them to user dashboard
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // Admin paths require authentication + admin role
        if (path.startsWith("/admin")) {
          return token?.role === "ADMIN";
        }

        // Other protected app pages require being authenticated
        if (
          path.startsWith("/dashboard") ||
          path.startsWith("/bookings") ||
          path.startsWith("/notifications") ||
          path.startsWith("/profile") ||
          path.startsWith("/calendar")
        ) {
          return !!token;
        }

        // Public paths (home, catalog, login, register) are allowed
        return true;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/bookings/:path*",
    "/notifications/:path*",
    "/profile/:path*",
    "/calendar/:path*",
  ],
};
