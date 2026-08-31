import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware — JWT-based route protection.
 * Replaces NextAuth withAuth. Checks localStorage isn't available on edge,
 * so we use a cookie fallback set by the login page.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip login page
  if (pathname === '/admin/login') return NextResponse.next();

  // Check for auth cookie (set after login)
  const token = req.cookies.get('syntax_token')?.value;

  if (!token) {
    const loginUrl = new URL('/admin/login', req.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/dashboard/:path*', '/admin/services/:path*', '/admin/portfolio/:path*',
    '/admin/blog/:path*', '/admin/testimonials/:path*', '/admin/developers/:path*',
    '/admin/messages/:path*', '/admin/analytics/:path*'],
};
