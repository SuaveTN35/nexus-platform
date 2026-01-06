/**
 * Team Invite Management API Routes
 * DELETE /api/team/invite/[id] - Revoke an invitation
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';

function getOrganizationId(request: NextRequest): string | null {
  return request.headers.get('x-organization-id');
}

export async function DELETE(
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

    // Revoke the invite
    await prisma.teamInvite.update({
      where: { id },
      data: { status: 'REVOKED' },
    });

    return NextResponse.json({
      message: 'Invitation revoked successfully',
    });
  } catch (error) {
    console.error('Failed to revoke invite:', error);
    return NextResponse.json(
      { error: 'Failed to revoke invitation' },
      { status: 500 }
    );
  }
}
