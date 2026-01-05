/**
 * POST /api/auth/logout
 * Revoke session and clear cookies
 */

import { NextRequest, NextResponse } from 'next/server';
import { revokeSession } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('access_token')?.value;

    // Revoke session if token exists
    if (accessToken) {
      await revokeSession(accessToken);
    }

    // Build response
    const response = NextResponse.json({
      message: 'Logout successful',
    });

    // Clear cookies
    response.cookies.set('access_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    response.cookies.set('refresh_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    // Still clear cookies even if session revocation fails
    const response = NextResponse.json({
      message: 'Logout successful',
    });

    response.cookies.set('access_token', '', { maxAge: 0, path: '/' });
    response.cookies.set('refresh_token', '', { maxAge: 0, path: '/' });

    return response;
  }
}
