/**
 * Logout API Route
 * POST /api/auth/logout
 * Revokes session and clears authentication cookies
 */

import { NextRequest, NextResponse } from 'next/server';
import { revokeSession } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    // Get access token from cookie
    const accessToken = request.cookies.get('access_token')?.value;

    // Revoke session if token exists
    if (accessToken) {
      await revokeSession(accessToken);
    }

    // Create response and clear cookies
    const response = NextResponse.json({
      message: 'Logged out successfully',
    });

    // Clear authentication cookies
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

    // Even if there's an error, still clear cookies
    const response = NextResponse.json({
      message: 'Logged out',
    });

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
  }
}
