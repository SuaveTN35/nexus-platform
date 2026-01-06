/**
 * Billing API Routes
 * GET /api/billing - Get billing data (subscription, plans, usage, invoices)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';

function getOrganizationId(request: NextRequest): string | null {
  return request.headers.get('x-organization-id');
}

export async function GET(request: NextRequest) {
  try {
    const organizationId = getOrganizationId(request);

    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization ID required' },
        { status: 401 }
      );
    }

    // Get all plans
    const plans = await prisma.plan.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });

    // Get organization subscription
    const subscription = await prisma.subscription.findUnique({
      where: { organizationId },
      include: { plan: true },
    });

    // Get current month usage
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const usageRecord = await prisma.usageRecord.findUnique({
      where: {
        organizationId_month: {
          organizationId,
          month: firstDayOfMonth,
        },
      },
    });

    // Get actual counts for total usage (not monthly)
    const [contactsCount, propertiesCount, teamMembersCount] = await Promise.all([
      prisma.contact.count({ where: { organizationId } }),
      prisma.property.count({ where: { organizationId } }),
      prisma.organizationMember.count({ where: { organizationId, isActive: true } }),
    ]);

    const usage = {
      contactsCount,
      propertiesCount,
      teamMembersCount,
      campaignsSent: usageRecord?.campaignsSent || 0,
      emailsSent: usageRecord?.emailsSent || 0,
    };

    // Get recent invoices
    const invoices = await prisma.invoice.findMany({
      where: { organizationId },
      orderBy: { invoiceDate: 'desc' },
      take: 10,
    });

    // Transform data for response
    const transformedPlans = plans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      slug: plan.slug,
      description: plan.description,
      monthlyPrice: Number(plan.monthlyPrice),
      yearlyPrice: Number(plan.yearlyPrice),
      maxContacts: plan.maxContacts,
      maxProperties: plan.maxProperties,
      maxTeamMembers: plan.maxTeamMembers,
      maxCampaignsPerMonth: plan.maxCampaignsPerMonth,
      maxEmailsPerMonth: plan.maxEmailsPerMonth,
      hasApiAccess: plan.hasApiAccess,
      hasAdvancedAnalytics: plan.hasAdvancedAnalytics,
      hasPrioritySupport: plan.hasPrioritySupport,
      hasCustomIntegrations: plan.hasCustomIntegrations,
      hasWhiteLabeling: plan.hasWhiteLabeling,
    }));

    const transformedSubscription = subscription
      ? {
          id: subscription.id,
          status: subscription.status,
          billingCycle: subscription.billingCycle,
          currentPeriodStart: subscription.currentPeriodStart.toISOString(),
          currentPeriodEnd: subscription.currentPeriodEnd.toISOString(),
          trialEndsAt: subscription.trialEndsAt?.toISOString() || null,
          cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
          plan: {
            id: subscription.plan.id,
            name: subscription.plan.name,
            slug: subscription.plan.slug,
            description: subscription.plan.description,
            monthlyPrice: Number(subscription.plan.monthlyPrice),
            yearlyPrice: Number(subscription.plan.yearlyPrice),
            maxContacts: subscription.plan.maxContacts,
            maxProperties: subscription.plan.maxProperties,
            maxTeamMembers: subscription.plan.maxTeamMembers,
            maxCampaignsPerMonth: subscription.plan.maxCampaignsPerMonth,
            maxEmailsPerMonth: subscription.plan.maxEmailsPerMonth,
            hasApiAccess: subscription.plan.hasApiAccess,
            hasAdvancedAnalytics: subscription.plan.hasAdvancedAnalytics,
            hasPrioritySupport: subscription.plan.hasPrioritySupport,
            hasCustomIntegrations: subscription.plan.hasCustomIntegrations,
            hasWhiteLabeling: subscription.plan.hasWhiteLabeling,
          },
        }
      : null;

    const transformedInvoices = invoices.map((invoice) => ({
      id: invoice.id,
      amount: Number(invoice.amount),
      currency: invoice.currency,
      status: invoice.status,
      invoiceDate: invoice.invoiceDate.toISOString(),
      invoiceUrl: invoice.invoiceUrl,
    }));

    return NextResponse.json({
      plans: transformedPlans,
      subscription: transformedSubscription,
      usage,
      invoices: transformedInvoices,
    });
  } catch (error) {
    console.error('Failed to fetch billing data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch billing data' },
      { status: 500 }
    );
  }
}
