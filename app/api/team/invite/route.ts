/**
 * Team Invite API Routes
 * POST /api/team/invite - Create a new team invitation
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db/client';

function getOrganizationId(request: NextRequest): string | null {
  return request.headers.get('x-organization-id');
}

function getUserId(request: NextRequest): string | null {
  return request.headers.get('x-user-id');
}

const inviteSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['ADMIN', 'MEMBER']),
});

export async function POST(request: NextRequest) {
  try {
    const organizationId = getOrganizationId(request);
    const invitedById = getUserId(request);

    if (!organizationId || !invitedById) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = inviteSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, role } = validation.data;

    // Check if user is already a member
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: {
        organizations: {
          where: { organizationId },
        },
      },
    });

    if (existingUser?.organizations?.length) {
      return NextResponse.json(
        { error: 'User is already a member of this organization' },
        { status: 400 }
      );
    }

    // Check if there's already a pending invite
    const existingInvite = await prisma.teamInvite.findUnique({
      where: {
        organizationId_email: {
          organizationId,
          email,
        },
      },
    });

    if (existingInvite?.status === 'PENDING') {
      return NextResponse.json(
        { error: 'An invitation has already been sent to this email' },
        { status: 400 }
      );
    }

    // Calculate expiration (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Create or update invite
    const invite = existingInvite
      ? await prisma.teamInvite.update({
          where: { id: existingInvite.id },
          data: {
            role,
            status: 'PENDING',
            invitedById,
            expiresAt,
            token: crypto.randomUUID(),
          },
        })
      : await prisma.teamInvite.create({
          data: {
            organizationId,
            email,
            role,
            invitedById,
            expiresAt,
          },
        });

    // TODO: Send invitation email with invite.token
    // For now, just log the invite URL
    console.log(`Invite URL: /invite/${invite.token}`);

    return NextResponse.json({
      invite: {
        id: invite.id,
        email: invite.email,
        role: invite.role,
        status: invite.status,
        expiresAt: invite.expiresAt.toISOString(),
      },
      message: 'Invitation sent successfully',
    });
  } catch (error) {
    console.error('Failed to create invite:', error);
    return NextResponse.json(
      { error: 'Failed to create invitation' },
      { status: 500 }
    );
  }
}
