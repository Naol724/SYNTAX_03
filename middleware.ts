import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

/**
 * Protect /admin routes. Missing NEXTAUTH_SECRET must not crash the whole site.
 */
export default withAuth(
  function middleware() {
    return NextResponse.next()
  },
  {
    pages: {
      signIn: "/admin/login",
    },
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ["/admin", "/admin/((?!login).*)"],
}
