/**
 * Single Property API Routes
 * GET /api/properties/[id] - Get property by ID
 * PUT /api/properties/[id] - Update property
 * DELETE /api/properties/[id] - Delete property
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db/client';
import { PropertyType, PropertyStatus } from '@prisma/client';

function getOrganizationId(request: NextRequest): string | null {
  return request.headers.get('x-organization-id');
}

const updatePropertySchema = z.object({
  address: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  state: z.string().min(1).optional(),
  zipCode: z.string().min(1).optional(),
  country: z.string().optional(),
  propertyType: z.enum([
    'SINGLE_FAMILY', 'CONDO', 'TOWNHOUSE', 'MULTI_FAMILY',
    'LAND', 'COMMERCIAL', 'APARTMENT', 'OTHER'
  ]).optional(),
  status: z.enum([
    'DRAFT', 'ACTIVE', 'PENDING', 'SOLD', 'OFF_MARKET', 'RENTED'
  ]).optional(),
  listPrice: z.number().positive().optional(),
  bedrooms: z.number().int().min(0).optional().nullable(),
  bathrooms: z.number().min(0).optional().nullable(),
  squareFeet: z.number().int().positive().optional().nullable(),
  lotSize: z.number().positive().optional().nullable(),
  yearBuilt: z.number().int().min(1800).max(new Date().getFullYear() + 5).optional().nullable(),
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  features: z.array(z.string()).optional(),
  photos: z.array(z.string().url()).optional(),
  virtualTourUrl: z.string().url().optional().nullable(),
  mlsNumber: z.string().optional().nullable(),
  listingDate: z.string().optional().nullable(),
});

// GET /api/properties/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const organizationId = getOrganizationId(request);

    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization ID required' },
        { status: 401 }
      );
    }

    const property = await prisma.property.findFirst({
      where: {
        id,
        organizationId,
      },
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error('Failed to fetch property:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    );
  }
}

// PUT /api/properties/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const organizationId = getOrganizationId(request);

    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization ID required' },
        { status: 401 }
      );
    }

    // Check property exists and belongs to organization
    const existing = await prisma.property.findFirst({
      where: { id, organizationId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validation = updatePropertySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = validation.data;

    const property = await prisma.property.update({
      where: { id },
      data: {
        ...(data.address && { address: data.address }),
        ...(data.city && { city: data.city }),
        ...(data.state && { state: data.state }),
        ...(data.zipCode && { zipCode: data.zipCode }),
        ...(data.country && { country: data.country }),
        ...(data.propertyType && { propertyType: data.propertyType as PropertyType }),
        ...(data.status && { status: data.status as PropertyStatus }),
        ...(data.listPrice && { listPrice: data.listPrice }),
        ...(data.bedrooms !== undefined && { bedrooms: data.bedrooms }),
        ...(data.bathrooms !== undefined && { bathrooms: data.bathrooms }),
        ...(data.squareFeet !== undefined && { squareFeet: data.squareFeet }),
        ...(data.lotSize !== undefined && { lotSize: data.lotSize }),
        ...(data.yearBuilt !== undefined && { yearBuilt: data.yearBuilt }),
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.features && { features: data.features }),
        ...(data.photos && { photos: data.photos }),
        ...(data.virtualTourUrl !== undefined && { virtualTourUrl: data.virtualTourUrl }),
        ...(data.mlsNumber !== undefined && { mlsNumber: data.mlsNumber }),
        ...(data.listingDate !== undefined && {
          listingDate: data.listingDate ? new Date(data.listingDate) : null,
        }),
      },
    });

    return NextResponse.json({
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
      message: 'Property updated successfully',
    });
  } catch (error) {
    console.error('Failed to update property:', error);
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    );
  }
}

// DELETE /api/properties/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const organizationId = getOrganizationId(request);

    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization ID required' },
        { status: 401 }
      );
    }

    // Check property exists and belongs to organization
    const existing = await prisma.property.findFirst({
      where: { id, organizationId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    await prisma.property.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Property deleted successfully',
    });
  } catch (error) {
    console.error('Failed to delete property:', error);
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    );
  }
}
