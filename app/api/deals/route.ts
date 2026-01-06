/**
 * Deals API Routes
 * GET /api/deals - List deals with filters
 * POST /api/deals - Create a new deal
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db/client';
import { DealStatus, Prisma } from '@prisma/client';

// Helper to get organization ID from auth headers (set by middleware)
function getOrganizationId(request: NextRequest): string | null {
  return request.headers.get('x-organization-id');
}

const createDealSchema = z.object({
  name: z.string().min(1, 'Deal name is required'),
  contactId: z.string().min(1, 'Contact ID is required'),
  value: z.number().positive('Value must be positive'),
  stage: z.string().min(1, 'Stage is required'),
  probability: z.number().min(0).max(100).optional(),
  expectedCloseDate: z.string().optional(),
});

// GET /api/deals
export async function GET(request: NextRequest) {
  try {
    const organizationId = getOrganizationId(request);

    if (!organizationId) {
      return NextResponse.json({ data: [] });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const stage = searchParams.get('stage');

    // Build where clause
    const where: Prisma.DealWhereInput = {
      organizationId,
    };

    if (status && ['OPEN', 'WON', 'LOST'].includes(status.toUpperCase())) {
      where.status = status.toUpperCase() as DealStatus;
    }

    if (stage) {
      where.stage = stage;
    }

    // Get deals with contact info
    const deals = await prisma.deal.findMany({
      where,
      include: {
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform to match frontend types
    const data = deals.map((d) => ({
      id: d.id,
      organizationId: d.organizationId,
      contactId: d.contactId,
      name: d.name,
      value: Number(d.value),
      stage: d.stage,
      probability: d.probability,
      expectedCloseDate: d.expectedCloseDate,
      actualCloseDate: d.actualCloseDate,
      status: d.status.toLowerCase() as 'open' | 'won' | 'lost',
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
      contact: d.contact,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Failed to fetch deals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deals' },
      { status: 500 }
    );
  }
}

// POST /api/deals
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
    const validation = createDealSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, contactId, value, stage, probability, expectedCloseDate } = validation.data;

    // Verify contact belongs to organization
    const contact = await prisma.contact.findFirst({
      where: { id: contactId, organizationId },
    });

    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    // Create deal in database
    const deal = await prisma.deal.create({
      data: {
        organizationId,
        contactId,
        name,
        value,
        stage,
        probability: probability ?? 50,
        expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate) : null,
        status: 'OPEN',
      },
      include: {
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        data: {
          id: deal.id,
          organizationId: deal.organizationId,
          contactId: deal.contactId,
          name: deal.name,
          value: Number(deal.value),
          stage: deal.stage,
          probability: deal.probability,
          expectedCloseDate: deal.expectedCloseDate,
          actualCloseDate: deal.actualCloseDate,
          status: deal.status.toLowerCase(),
          createdAt: deal.createdAt,
          updatedAt: deal.updatedAt,
          contact: deal.contact,
        },
        message: 'Deal created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create deal:', error);
    return NextResponse.json(
      { error: 'Failed to create deal' },
      { status: 500 }
    );
  }
}

