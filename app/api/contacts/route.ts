/**
 * Contacts API Routes
 * GET /api/contacts - List contacts with pagination and search
 * POST /api/contacts - Create a new contact
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db/client';
import { Prisma } from '@prisma/client';
import { PaginatedResponse } from '@/types';

// Helper to get organization ID from auth headers (set by middleware)
function getOrganizationId(request: NextRequest): string | null {
  return request.headers.get('x-organization-id');
}

const createContactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
});

// GET /api/contacts
export async function GET(request: NextRequest) {
  try {
    const organizationId = getOrganizationId(request);

    // For now, if no org ID (demo mode), use a default or return empty
    if (!organizationId) {
      // Demo mode - return empty list or could query all
      return NextResponse.json({
        data: [],
        pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 },
      });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '10')));
    const search = searchParams.get('search') || '';

    // Build where clause
    const where: Prisma.ContactWhereInput = {
      organizationId,
    };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count
    const total = await prisma.contact.count({ where });

    // Get paginated contacts
    const contacts = await prisma.contact.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    // Transform to match frontend types
    const data = contacts.map((c) => ({
      id: c.id,
      organizationId: c.organizationId,
      firstName: c.firstName,
      lastName: c.lastName,
      email: c.email,
      phone: c.phone,
      company: c.company,
      tags: (c.tags as string[]) || [],
      customFields: (c.customFields as Record<string, unknown>) || {},
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

    const response: PaginatedResponse<typeof data[0]> = {
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to fetch contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

// POST /api/contacts
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
    const validation = createContactSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, phone, company, tags } = validation.data;

    // Create contact in database
    const contact = await prisma.contact.create({
      data: {
        organizationId,
        firstName,
        lastName,
        email: email || null,
        phone: phone || null,
        company: company || null,
        tags: tags || [],
        customFields: {},
      },
    });

    return NextResponse.json(
      {
        data: {
          id: contact.id,
          organizationId: contact.organizationId,
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          phone: contact.phone,
          company: contact.company,
          tags: (contact.tags as string[]) || [],
          customFields: (contact.customFields as Record<string, unknown>) || {},
          createdAt: contact.createdAt,
          updatedAt: contact.updatedAt,
        },
        message: 'Contact created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create contact:', error);
    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    );
  }
}

