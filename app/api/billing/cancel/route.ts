/**
 * Cancel Subscription API Route
 * POST /api/billing/cancel - Cancel subscription at end of period
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';

function getOrganizationId(request: NextRequest): string | null {
  return request.headers.get('x-organization-id');
}

export async function POST(request: NextRequest) {
  try {
    const organizationId = getOrganizationId(request);

    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization ID required' },
        { status: 401 }
      );
    }

    // Get existing subscription
    const subscription = await prisma.subscription.findUnique({
      where: { organizationId },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    if (subscription.cancelAtPeriodEnd) {
      return NextResponse.json(
        { error: 'Subscription is already scheduled for cancellation' },
        { status: 400 }
      );
    }

    // Mark subscription for cancellation at period end
    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        cancelAtPeriodEnd: true,
        canceledAt: new Date(),
      },
      include: { plan: true },
    });

    return NextResponse.json({
      subscription: {
        id: updatedSubscription.id,
        status: updatedSubscription.status,
        cancelAtPeriodEnd: updatedSubscription.cancelAtPeriodEnd,
        currentPeriodEnd: updatedSubscription.currentPeriodEnd.toISOString(),
        plan: {
          id: updatedSubscription.plan.id,
          name: updatedSubscription.plan.name,
        },
      },
      message: `Subscription will be canceled on ${updatedSubscription.currentPeriodEnd.toLocaleDateString()}`,
    });
  } catch (error) {
    console.error('Failed to cancel subscription:', error);
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}
