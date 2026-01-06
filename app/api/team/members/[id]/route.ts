/**
 * Team Member Management API Routes
 * PATCH /api/team/members/[id] - Update member role
 * DELETE /api/team/members/[id] - Remove member from team
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db/client';

function getOrganizationId(request: NextRequest): string | null {
  return request.headers.get('x-organization-id');
}

const updateMemberSchema = z.object({
  role: z.enum(['ADMIN', 'MEMBER']),
});

export async function PATCH(
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

    const body = await request.json();
    const validation = updateMemberSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { role } = validation.data;

    // Verify member belongs to organization
    const member = await prisma.organizationMember.findFirst({
      where: {
        id,
        organizationId,
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    // Cannot change owner role
    if (member.role === 'OWNER') {
      return NextResponse.json(
        { error: 'Cannot change the owner role' },
        { status: 400 }
      );
    }

    // Update member role
    const updatedMember = await prisma.organizationMember.update({
      where: { id },
      data: { role },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json({
      member: {
        id: updatedMember.id,
        role: updatedMember.role,
        user: updatedMember.user,
      },
      message: 'Member role updated successfully',
    });
  } catch (error) {
    console.error('Failed to update member:', error);
    return NextResponse.json(
      { error: 'Failed to update member' },
      { status: 500 }
    );
  }
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

    // Verify member belongs to organization
    const member = await prisma.organizationMember.findFirst({
      where: {
        id,
        organizationId,
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    // Cannot remove owner
    if (member.role === 'OWNER') {
      return NextResponse.json(
        { error: 'Cannot remove the organization owner' },
        { status: 400 }
      );
    }

    // Remove member
    await prisma.organizationMember.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Member removed successfully',
    });
  } catch (error) {
    console.error('Failed to remove member:', error);
    return NextResponse.json(
      { error: 'Failed to remove member' },
      { status: 500 }
    );
  }
}
