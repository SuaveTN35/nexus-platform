import { NextRequest, NextResponse } from 'next/server';
import { Campaign, ApiResponse } from '@/types';

// Mock data store
let mockCampaigns: Campaign[] = [
  {
    id: '1',
    organizationId: 'org-1',
    name: 'Q1 Product Launch',
    type: 'email',
    status: 'active',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-03-31'),
    settings: {},
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2025-01-01'),
  },
];

// GET /api/campaigns/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const campaign = mockCampaigns.find((c) => c.id === id);

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    const response: ApiResponse<Campaign> = {
      data: campaign,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch campaign' },
      { status: 500 }
    );
  }
}

// PUT /api/campaigns/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const campaignIndex = mockCampaigns.findIndex((c) => c.id === id);

    if (campaignIndex === -1) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    const updatedCampaign: Campaign = {
      ...mockCampaigns[campaignIndex],
      ...body,
      updatedAt: new Date(),
    };

    mockCampaigns[campaignIndex] = updatedCampaign;

    const response: ApiResponse<Campaign> = {
      data: updatedCampaign,
      message: 'Campaign updated successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update campaign' },
      { status: 500 }
    );
  }
}

// DELETE /api/campaigns/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const campaignIndex = mockCampaigns.findIndex((c) => c.id === id);

    if (campaignIndex === -1) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    mockCampaigns = mockCampaigns.filter((c) => c.id !== id);

    return NextResponse.json(
      { message: 'Campaign deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete campaign' },
      { status: 500 }
    );
  }
}
