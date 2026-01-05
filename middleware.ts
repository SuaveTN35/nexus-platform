/**
 * Next.js Middleware
 * Handles authentication and route protection
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
];

// Public API routes
const PUBLIC_API_ROUTES = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
];

// Static assets and Next.js internals
const IGNORED_PATHS = [
  '/_next',
  '/favicon.ico',
  '/images',
  '/fonts',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // DEMO MODE: Skip auth until Phase 1 is complete
  // TODO: Remove this when authentication is implemented
  return NextResponse.next();

  // Skip static assets and Next.js internals
  if (IGNORED_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Allow public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Allow public API routes
  if (PUBLIC_API_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check for access token
  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  // No tokens - redirect to login or return 401 for API
  if (!accessToken) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // If we have a refresh token, the client should try to refresh
    // Otherwise redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Token exists - try to decode and validate
  try {
    // Decode JWT payload (without verification - verification happens in API routes)
    const [, payloadBase64] = accessToken.split('.');
    if (!payloadBase64) {
      throw new Error('Invalid token format');
    }

    const payload = JSON.parse(
      Buffer.from(payloadBase64, 'base64').toString('utf-8')
    );

    // Check if token is expired
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      // Token expired - if we have refresh token, let client handle refresh
      if (refreshToken && pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Token expired', code: 'TOKEN_EXPIRED' },
          { status: 401 }
        );
      }

      // For pages, redirect to login
      if (!pathname.startsWith('/api/')) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    // Token valid - add user info to request headers for use in API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId || '');
    requestHeaders.set('x-user-email', payload.email || '');
    requestHeaders.set('x-organization-id', payload.organizationId || '');
    requestHeaders.set('x-user-role', payload.role || '');

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    // Invalid token
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
