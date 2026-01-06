/**
 * Change Plan API Route
 * POST /api/billing/change-plan - Change subscription plan
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db/client';

function getOrganizationId(request: NextRequest): string | null {
  return request.headers.get('x-organization-id');
}

const changePlanSchema = z.object({
  planId: z.string().uuid(),
  billingCycle: z.enum(['MONTHLY', 'YEARLY']),
});

export async function POST(request: NextRequest) {
  try {
    const organizationId = getOrganizationId(request);

    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization ID required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = changePlanSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { planId, billingCycle } = validation.data;

    // Verify plan exists
    const plan = await prisma.plan.findUnique({
      where: { id: planId, isActive: true },
    });

    if (!plan) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      );
    }

    // Calculate period dates
    const now = new Date();
    const periodEnd = new Date(now);
    if (billingCycle === 'YEARLY') {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    } else {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    }

    // Get existing subscription or create new one
    const existingSubscription = await prisma.subscription.findUnique({
      where: { organizationId },
    });

    let subscription;
    if (existingSubscription) {
      // Update existing subscription
      subscription = await prisma.subscription.update({
        where: { id: existingSubscription.id },
        data: {
          planId,
          billingCycle,
          status: 'ACTIVE',
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
          cancelAtPeriodEnd: false,
          canceledAt: null,
        },
        include: { plan: true },
      });
    } else {
      // Create new subscription with 14-day trial
      const trialEnd = new Date(now);
      trialEnd.setDate(trialEnd.getDate() + 14);

      subscription = await prisma.subscription.create({
        data: {
          organizationId,
          planId,
          billingCycle,
          status: 'TRIALING',
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
          trialEndsAt: trialEnd,
        },
        include: { plan: true },
      });
    }

    // Initialize usage record for this month if it doesn't exist
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    await prisma.usageRecord.upsert({
      where: {
        organizationId_month: {
          organizationId,
          month: firstDayOfMonth,
        },
      },
      create: {
        organizationId,
        month: firstDayOfMonth,
      },
      update: {},
    });

    return NextResponse.json({
      subscription: {
        id: subscription.id,
        status: subscription.status,
        billingCycle: subscription.billingCycle,
        currentPeriodStart: subscription.currentPeriodStart.toISOString(),
        currentPeriodEnd: subscription.currentPeriodEnd.toISOString(),
        trialEndsAt: subscription.trialEndsAt?.toISOString() || null,
        plan: {
          id: subscription.plan.id,
          name: subscription.plan.name,
          slug: subscription.plan.slug,
        },
      },
      message: 'Plan changed successfully',
    });
  } catch (error) {
    console.error('Failed to change plan:', error);
    return NextResponse.json(
      { error: 'Failed to change plan' },
      { status: 500 }
    );
  }
}
