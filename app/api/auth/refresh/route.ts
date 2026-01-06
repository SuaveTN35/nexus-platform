/**
 * Refresh Token API Route
 * POST /api/auth/refresh
 * Generates new access token using refresh token
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { rotateRefreshToken, findSessionByRefreshToken } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookie
    const refreshToken = request.cookies.get('refresh_token')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token not provided' },
        { status: 401 }
      );
    }

    // Find session by refresh token
    const session = await findSessionByRefreshToken(refreshToken);

    if (!session) {
      // Clear cookies since refresh token is invalid
      const response = NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      );
      response.cookies.delete('access_token');
      response.cookies.delete('refresh_token');
      return response;
    }

    // Check if session is expired
    if (session.expiresAt < new Date()) {
      // Delete expired session
      await prisma.session.delete({ where: { id: session.id } });

      const response = NextResponse.json(
        { error: 'Session expired. Please login again.' },
        { status: 401 }
      );
      response.cookies.delete('access_token');
      response.cookies.delete('refresh_token');
      return response;
    }

    // Check if user is still active
    if (!session.user.isActive) {
      await prisma.session.delete({ where: { id: session.id } });

      const response = NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 403 }
      );
      response.cookies.delete('access_token');
      response.cookies.delete('refresh_token');
      return response;
    }

    // Get primary organization
    const primaryMembership = session.user.organizations.find((m) => m.isActive);
    if (!primaryMembership) {
      return NextResponse.json(
        { error: 'User has no active organization' },
        { status: 403 }
      );
    }

    // Rotate refresh token (security best practice)
    const newTokens = await rotateRefreshToken(refreshToken, {
      userId: session.user.id,
      email: session.user.email,
      organizationId: primaryMembership.organizationId,
      role: primaryMembership.role,
    });

    if (!newTokens) {
      const response = NextResponse.json(
        { error: 'Failed to refresh token' },
        { status: 401 }
      );
      response.cookies.delete('access_token');
      response.cookies.delete('refresh_token');
      return response;
    }

    // Create response with new tokens
    const response = NextResponse.json({
      message: 'Token refreshed successfully',
      expiresAt: newTokens.expiresAt.toISOString(),
    });

    // Set new HTTP-only cookies
    response.cookies.set('access_token', newTokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
      path: '/',
    });

    response.cookies.set('refresh_token', newTokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Token refresh error:', error);

    // If token verification fails, clear cookies
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      const response = NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
      response.cookies.delete('access_token');
      response.cookies.delete('refresh_token');
      return response;
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
