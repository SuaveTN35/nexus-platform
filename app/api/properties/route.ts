/**
 * Properties API Routes
 * GET /api/properties - List properties with filters and pagination
 * POST /api/properties - Create a new property
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db/client';
import { PropertyType, PropertyStatus, Prisma } from '@prisma/client';

// Helper to get organization ID from auth headers
function getOrganizationId(request: NextRequest): string | null {
  return request.headers.get('x-organization-id');
}

const createPropertySchema = z.object({
  // Address
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'ZIP code is required'),
  country: z.string().optional().default('USA'),

  // Property Details
  propertyType: z.enum([
    'SINGLE_FAMILY', 'CONDO', 'TOWNHOUSE', 'MULTI_FAMILY',
    'LAND', 'COMMERCIAL', 'APARTMENT', 'OTHER'
  ]),
  status: z.enum([
    'DRAFT', 'ACTIVE', 'PENDING', 'SOLD', 'OFF_MARKET', 'RENTED'
  ]).optional(),
  listPrice: z.number().positive('List price must be positive'),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  squareFeet: z.number().int().positive().optional(),
  lotSize: z.number().positive().optional(),
  yearBuilt: z.number().int().min(1800).max(new Date().getFullYear() + 5).optional(),

  // Description
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),

  // Media
  photos: z.array(z.string().url()).optional(),
  virtualTourUrl: z.string().url().optional(),

  // Listing Info
  mlsNumber: z.string().optional(),
  listingDate: z.string().optional(),
});

// GET /api/properties
export async function GET(request: NextRequest) {
  try {
    const organizationId = getOrganizationId(request);

    if (!organizationId) {
      return NextResponse.json({
        data: [],
        pagination: { page: 1, pageSize: 12, total: 0, totalPages: 0 },
      });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get('pageSize') || '12')));
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const propertyType = searchParams.get('type');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const bedrooms = searchParams.get('bedrooms');
    const city = searchParams.get('city');
    const state = searchParams.get('state');

    // Build where clause
    const where: Prisma.PropertyWhereInput = {
      organizationId,
    };

    // Search across title, address, city
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { mlsNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Status filter
    if (status && Object.values(PropertyStatus).includes(status as PropertyStatus)) {
      where.status = status as PropertyStatus;
    }

    // Property type filter
    if (propertyType && Object.values(PropertyType).includes(propertyType as PropertyType)) {
      where.propertyType = propertyType as PropertyType;
    }

    // Price range filters
    if (minPrice || maxPrice) {
      where.listPrice = {};
      if (minPrice) where.listPrice.gte = parseFloat(minPrice);
      if (maxPrice) where.listPrice.lte = parseFloat(maxPrice);
    }

    // Bedrooms filter
    if (bedrooms) {
      const beds = parseInt(bedrooms);
      if (beds >= 5) {
        where.bedrooms = { gte: 5 };
      } else {
        where.bedrooms = beds;
      }
    }

    // Location filters
    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (state) where.state = state;

    // Get total count
    const total = await prisma.property.count({ where });

    // Get paginated properties
    const properties = await prisma.property.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    // Transform for frontend
    const data = properties.map((p) => ({
      id: p.id,
      organizationId: p.organizationId,
      address: p.address,
      city: p.city,
      state: p.state,
      zipCode: p.zipCode,
      country: p.country,
      propertyType: p.propertyType,
      status: p.status,
      listPrice: Number(p.listPrice),
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms ? Number(p.bathrooms) : null,
      squareFeet: p.squareFeet,
      lotSize: p.lotSize ? Number(p.lotSize) : null,
      yearBuilt: p.yearBuilt,
      title: p.title,
      description: p.description,
      features: (p.features as string[]) || [],
      photos: (p.photos as string[]) || [],
      virtualTourUrl: p.virtualTourUrl,
      mlsNumber: p.mlsNumber,
      listingDate: p.listingDate,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return NextResponse.json({
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('Failed to fetch properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

// POST /api/properties
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
    const validation = createPropertySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Create property in database
    const property = await prisma.property.create({
      data: {
        organizationId,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country || 'USA',
        propertyType: data.propertyType as PropertyType,
        status: (data.status as PropertyStatus) || 'DRAFT',
        listPrice: data.listPrice,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        squareFeet: data.squareFeet,
        lotSize: data.lotSize,
        yearBuilt: data.yearBuilt,
        title: data.title,
        description: data.description,
        features: data.features || [],
        photos: data.photos || [],
        virtualTourUrl: data.virtualTourUrl,
        mlsNumber: data.mlsNumber,
        listingDate: data.listingDate ? new Date(data.listingDate) : null,
      },
    });

    return NextResponse.json(
      {
        data: {
          id: property.id,
          organizationId: property.organizationId,
          address: property.address,
          city: property.city,
          state: property.state,
          zipCode: property.zipCode,
          country: property.country,
          propertyType: property.propertyType,
          status: property.status,
          listPrice: Number(property.listPrice),
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms ? Number(property.bathrooms) : null,
          squareFeet: property.squareFeet,
          lotSize: property.lotSize ? Number(property.lotSize) : null,
          yearBuilt: property.yearBuilt,
          title: property.title,
          description: property.description,
          features: (property.features as string[]) || [],
          photos: (property.photos as string[]) || [],
          virtualTourUrl: property.virtualTourUrl,
          mlsNumber: property.mlsNumber,
          listingDate: property.listingDate,
          createdAt: property.createdAt,
          updatedAt: property.updatedAt,
        },
        message: 'Property created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create property:', error);
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
}
