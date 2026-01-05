/**
 * Session Management
 * Handles user sessions and token storage
 */

import { prisma } from '@/lib/db/client';
import { generateAccessToken, generateRefreshToken, TokenPayload } from './jwt';

export interface CreateSessionParams {
  userId: string;
  email: string;
  organizationId: string;
  role: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

/**
 * Create a new session for a user
 */
export async function createSession(params: CreateSessionParams): Promise<SessionTokens> {
  const { userId, email, organizationId, role, userAgent, ipAddress } = params;

  const tokenPayload: TokenPayload = {
    userId,
    email,
    organizationId,
    role,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  // Store session in database
  await prisma.session.create({
    data: {
      userId,
      token: accessToken,
      refreshToken,
      expiresAt,
      userAgent: userAgent || null,
      ipAddress: ipAddress || null,
    },
  });

  return {
    accessToken,
    refreshToken,
    expiresAt,
  };
}

/**
 * Revoke a session by access token
 */
export async function revokeSession(token: string): Promise<boolean> {
  try {
    await prisma.session.deleteMany({
      where: { token },
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Revoke all sessions for a user
 */
export async function revokeAllUserSessions(userId: string): Promise<number> {
  const result = await prisma.session.deleteMany({
    where: { userId },
  });
  return result.count;
}

/**
 * Find session by refresh token
 */
export async function findSessionByRefreshToken(refreshToken: string) {
  return prisma.session.findUnique({
    where: { refreshToken },
    include: {
      user: {
        include: {
          organizations: {
            include: {
              organization: true,
            },
          },
        },
      },
    },
  });
}

/**
 * Rotate refresh token (security best practice)
 */
export async function rotateRefreshToken(
  oldRefreshToken: string,
  newTokenPayload: TokenPayload
): Promise<SessionTokens | null> {
  const session = await findSessionByRefreshToken(oldRefreshToken);

  if (!session || session.expiresAt < new Date()) {
    return null;
  }

  const accessToken = generateAccessToken(newTokenPayload);
  const refreshToken = generateRefreshToken(newTokenPayload);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // Update session with new tokens
  await prisma.session.update({
    where: { id: session.id },
    data: {
      token: accessToken,
      refreshToken,
      expiresAt,
    },
  });

  return {
    accessToken,
    refreshToken,
    expiresAt,
  };
}

/**
 * Clean up expired sessions
 */
export async function cleanupExpiredSessions(): Promise<number> {
  const result = await prisma.session.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
  return result.count;
}
