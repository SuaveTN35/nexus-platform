/**
 * Resend Team Invite API Route
 * POST /api/team/invite/[id]/resend - Resend an invitation
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';

function getOrganizationId(request: NextRequest): string | null {
  return request.headers.get('x-organization-id');
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const organizationId = getOrganizationId(request);
    const { id } = await params;

    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization ID required' },
        { status: 401 }
      );
    }

    // Verify invite belongs to organization
    const invite = await prisma.teamInvite.findFirst({
      where: {
        id,
        organizationId,
      },
    });

    if (!invite) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      );
    }

    // Update expiration and generate new token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const updatedInvite = await prisma.teamInvite.update({
      where: { id },
      data: {
        status: 'PENDING',
        expiresAt,
        token: crypto.randomUUID(),
      },
    });

    // TODO: Send invitation email with updatedInvite.token
    console.log(`Resend invite URL: /invite/${updatedInvite.token}`);

    return NextResponse.json({
      invite: {
        id: updatedInvite.id,
        email: updatedInvite.email,
        expiresAt: updatedInvite.expiresAt.toISOString(),
      },
      message: 'Invitation resent successfully',
    });
  } catch (error) {
    console.error('Failed to resend invite:', error);
    return NextResponse.json(
      { error: 'Failed to resend invitation' },
      { status: 500 }
    );
  }
}
