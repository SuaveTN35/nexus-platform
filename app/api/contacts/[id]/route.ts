import { NextRequest, NextResponse } from 'next/server';
import { Contact, ApiResponse } from '@/types';

// Mock data store (in real app, this would be a database)
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

// GET /api/contacts/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contact = mockContacts.find((c) => c.id === id);

    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    const response: ApiResponse<Contact> = {
      data: contact,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch contact' },
      { status: 500 }
    );
  }
}

// PUT /api/contacts/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const contactIndex = mockContacts.findIndex((c) => c.id === id);

    if (contactIndex === -1) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    const updatedContact: Contact = {
      ...mockContacts[contactIndex],
      ...body,
      updatedAt: new Date(),
    };

    mockContacts[contactIndex] = updatedContact;

    const response: ApiResponse<Contact> = {
      data: updatedContact,
      message: 'Contact updated successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update contact' },
      { status: 500 }
    );
  }
}

// DELETE /api/contacts/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contactIndex = mockContacts.findIndex((c) => c.id === id);

    if (contactIndex === -1) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    mockContacts = mockContacts.filter((c) => c.id !== id);

    return NextResponse.json(
      { message: 'Contact deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 }
    );
  }
}
