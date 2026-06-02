import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // 1. User is logged in, but tries to access login/register pages
  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 2. User is NOT logged in, but tries to access dashboard console
  if (!token && pathname.startsWith('/dashboard')) {
    // Save original intent URL to redirect back after login if desired
    const loginUrl = new URL('/login', request.url);
    if (pathname !== '/dashboard') {
      loginUrl.searchParams.set('redirect', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Map routes to trigger middleware interception
export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/login', 
    '/register'
  ],
};
