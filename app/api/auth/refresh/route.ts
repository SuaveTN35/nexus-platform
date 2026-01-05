/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */

import { NextRequest, NextResponse } from 'next/server';
import { rotateRefreshToken, findSessionByRefreshToken } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refresh_token')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token provided' },
        { status: 401 }
      );
    }

    // Find session
    const session = await findSessionByRefreshToken(refreshToken);

    if (!session) {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    if (session.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Refresh token expired' },
        { status: 401 }
      );
    }

    // Get user's primary organization
    const primaryMembership = session.user.organizations.find((m: { role: string }) => m.role === 'OWNER') ||
                              session.user.organizations[0];

    if (!primaryMembership) {
      return NextResponse.json(
        { error: 'No organization associated with this account' },
        { status: 401 }
      );
    }

    // Rotate tokens
    const newTokens = await rotateRefreshToken(refreshToken, {
      userId: session.userId,
      email: session.user.email,
      organizationId: primaryMembership.organizationId,
      role: primaryMembership.role,
    });

    if (!newTokens) {
      return NextResponse.json(
        { error: 'Failed to refresh token' },
        { status: 401 }
      );
    }

    // Build response
    const response = NextResponse.json({
      data: {
        user: {
          id: session.user.id,
          email: session.user.email,
          firstName: session.user.firstName,
          lastName: session.user.lastName,
        },
        organization: {
          id: primaryMembership.organization.id,
          name: primaryMembership.organization.name,
          slug: primaryMembership.organization.slug,
        },
      },
      message: 'Token refreshed successfully',
    });

    // Set new cookies
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
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    );
  }
}
