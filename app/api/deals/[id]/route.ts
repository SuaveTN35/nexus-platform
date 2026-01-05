import { NextRequest, NextResponse } from 'next/server';
import { Deal, ApiResponse } from '@/types';

// Mock data store
let mockDeals: Deal[] = [
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

// GET /api/deals/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deal = mockDeals.find((d) => d.id === id);

    if (!deal) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      );
    }

    const response: ApiResponse<Deal> = {
      data: deal,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch deal' },
      { status: 500 }
    );
  }
}

// PUT /api/deals/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const dealIndex = mockDeals.findIndex((d) => d.id === id);

    if (dealIndex === -1) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      );
    }

    const updatedDeal: Deal = {
      ...mockDeals[dealIndex],
      ...body,
      updatedAt: new Date(),
    };

    mockDeals[dealIndex] = updatedDeal;

    const response: ApiResponse<Deal> = {
      data: updatedDeal,
      message: 'Deal updated successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update deal' },
      { status: 500 }
    );
  }
}

// DELETE /api/deals/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const dealIndex = mockDeals.findIndex((d) => d.id === id);

    if (dealIndex === -1) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      );
    }

    mockDeals = mockDeals.filter((d) => d.id !== id);

    return NextResponse.json(
      { message: 'Deal deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete deal' },
      { status: 500 }
    );
  }
}
