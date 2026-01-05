import { NextRequest, NextResponse } from 'next/server';
import { Campaign, ApiResponse } from '@/types';

// Mock data store (will be replaced with database)
const mockCampaigns: Campaign[] = [
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

// GET /api/campaigns
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({ data: mockCampaigns });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

// POST /api/campaigns
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, status, startDate, endDate, settings } = body;

    const newCampaign: Campaign = {
      id: Date.now().toString(),
      organizationId: 'org-1', // TODO: Get from auth context
      name,
      type: type || 'email',
      status: status || 'draft',
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      settings: settings || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockCampaigns.push(newCampaign);

    const response: ApiResponse<Campaign> = {
      data: newCampaign,
      message: 'Campaign created successfully',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}

