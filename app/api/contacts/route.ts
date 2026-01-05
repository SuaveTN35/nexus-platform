import { NextRequest, NextResponse } from 'next/server';
import { Contact, ApiResponse, PaginatedResponse } from '@/types';

// Mock data store (will be replaced with database)
let mockContacts: Contact[] = [
  {
    id: '1',
    organizationId: 'org-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Acme Corp',
    tags: ['lead', 'hot'],
    customFields: {},
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15'),
  },
];

// GET /api/contacts
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const search = searchParams.get('search') || '';

    let filteredContacts = mockContacts;

    // Apply search filter
    if (search) {
      filteredContacts = mockContacts.filter(
        (contact) =>
          contact.firstName.toLowerCase().includes(search.toLowerCase()) ||
          contact.lastName.toLowerCase().includes(search.toLowerCase()) ||
          contact.email?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedContacts = filteredContacts.slice(startIndex, endIndex);

    const response: PaginatedResponse<Contact> = {
      data: paginatedContacts,
      pagination: {
        page,
        pageSize,
        total: filteredContacts.length,
        totalPages: Math.ceil(filteredContacts.length / pageSize),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

// POST /api/contacts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, company, tags } = body;

    const newContact: Contact = {
      id: Date.now().toString(),
      organizationId: 'org-1', // TODO: Get from auth context
      firstName,
      lastName,
      email: email || null,
      phone: phone || null,
      company: company || null,
      tags: tags || [],
      customFields: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockContacts.push(newContact);

    const response: ApiResponse<Contact> = {
      data: newContact,
      message: 'Contact created successfully',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    );
  }
}

