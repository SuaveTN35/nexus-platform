import { NextRequest, NextResponse } from 'next/server';
import { Deal, ApiResponse } from '@/types';

// Mock data store
const mockDeals: Deal[] = [
  {
    id: '1',
    organizationId: 'org-1',
    contactId: 'contact-1',
    name: 'Enterprise Software License',
    value: 50000,
    stage: 'Proposal',
    probability: 75,
    expectedCloseDate: new Date('2025-02-15'),
    actualCloseDate: null,
    status: 'open',
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-15'),
  },
];

// GET /api/deals
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    
    let filteredDeals = mockDeals;
    
    if (status) {
      filteredDeals = mockDeals.filter((deal) => deal.status === status);
    }

    return NextResponse.json({ data: filteredDeals });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch deals' },
      { status: 500 }
    );
  }
}

// POST /api/deals
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, contactId, value, stage, probability, expectedCloseDate } = body;

    const newDeal: Deal = {
      id: Date.now().toString(),
      organizationId: 'org-1', // TODO: Get from auth context
      contactId,
      name,
      value,
      stage,
      probability,
      expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate) : null,
      actualCloseDate: null,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockDeals.push(newDeal);

    const response: ApiResponse<Deal> = {
      data: newDeal,
      message: 'Deal created successfully',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create deal' },
      { status: 500 }
    );
  }
}

