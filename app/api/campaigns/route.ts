/**
 * Campaigns API Routes
 * GET /api/campaigns - List campaigns
 * POST /api/campaigns - Create a new campaign
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db/client';
import { CampaignType, CampaignStatus } from '@prisma/client';

// Helper to get organization ID from auth headers (set by middleware)
function getOrganizationId(request: NextRequest): string | null {
  return request.headers.get('x-organization-id');
}

const createCampaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required'),
  type: z.enum(['EMAIL', 'SMS', 'MULTI_CHANNEL']).optional(),
  status: z.enum(['DRAFT', 'SCHEDULED', 'ACTIVE', 'PAUSED', 'COMPLETED']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  settings: z.record(z.any()).optional(),
});

// GET /api/campaigns
export async function GET(request: NextRequest) {
  try {
    const organizationId = getOrganizationId(request);

    if (!organizationId) {
      return NextResponse.json({ data: [] });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    // Build where clause
    const where: { organizationId: string; status?: CampaignStatus; type?: CampaignType } = {
      organizationId,
    };

    if (status && ['DRAFT', 'SCHEDULED', 'ACTIVE', 'PAUSED', 'COMPLETED'].includes(status.toUpperCase())) {
      where.status = status.toUpperCase() as CampaignStatus;
    }

    if (type && ['EMAIL', 'SMS', 'MULTI_CHANNEL'].includes(type.toUpperCase())) {
      where.type = type.toUpperCase() as CampaignType;
    }

    // Get campaigns
    const campaigns = await prisma.campaign.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Transform to match frontend types
    const data = campaigns.map((c) => ({
      id: c.id,
      organizationId: c.organizationId,
      name: c.name,
      type: c.type.toLowerCase().replace('_', '-') as 'email' | 'sms' | 'multi-channel',
      status: c.status.toLowerCase() as 'draft' | 'scheduled' | 'active' | 'paused' | 'completed',
      startDate: c.startDate,
      endDate: c.endDate,
      settings: (c.settings as Record<string, unknown>) || {},
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Failed to fetch campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

// POST /api/campaigns
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

    // Validate input
    const validation = createCampaignSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, type, status, startDate, endDate, settings } = validation.data;

    // Create campaign in database
    const campaign = await prisma.campaign.create({
      data: {
        organizationId,
        name,
        type: (type as CampaignType) || 'EMAIL',
        status: (status as CampaignStatus) || 'DRAFT',
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        settings: settings || {},
      },
    });

    return NextResponse.json(
      {
        data: {
          id: campaign.id,
          organizationId: campaign.organizationId,
          name: campaign.name,
          type: campaign.type.toLowerCase().replace('_', '-'),
          status: campaign.status.toLowerCase(),
          startDate: campaign.startDate,
          endDate: campaign.endDate,
          settings: (campaign.settings as Record<string, unknown>) || {},
          createdAt: campaign.createdAt,
          updatedAt: campaign.updatedAt,
        },
        message: 'Campaign created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}

