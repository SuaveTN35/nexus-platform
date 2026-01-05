'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import SearchInput from '@/components/ui/SearchInput';
import Table, { TableColumn } from '@/components/ui/Table';
import Modal from '@/components/ui/Modal';
import { Contact, ContactFormData } from '@/types';

// Mock data - will be replaced with API calls
const mockContacts: Contact[] = [
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
  {
    id: '2',
    organizationId: 'org-1',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+1 (555) 987-6543',
    company: 'Tech Solutions Inc',
    tags: ['customer'],
    customFields: {},
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-10'),
  },
];

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    tags: [],
  });

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to create contact
    const newContact: Contact = {
      id: Date.now().toString(),
      organizationId: 'org-1',
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email || null,
      phone: formData.phone || null,
      company: formData.company || null,
      tags: formData.tags || [],
      customFields: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setContacts([...contacts, newContact]);
    setIsModalOpen(false);
    setFormData({ firstName: '', lastName: '', email: '', phone: '', company: '', tags: [] });
  };

  const columns: TableColumn<Contact>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (contact) => (
        <Link
          href={`/contacts/${contact.id}`}
          className="text-primary-700 hover:text-primary-900 font-medium"
        >
          {contact.firstName} {contact.lastName}
        </Link>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (contact) => contact.email || '-',
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (contact) => contact.phone || '-',
    },
    {
      key: 'company',
      header: 'Company',
      render: (contact) => contact.company || '-',
    },
    {
      key: 'tags',
      header: 'Tags',
      render: (contact) => (
        <div className="flex flex-wrap gap-1">
          {contact.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: () => (
        <div className="flex space-x-2">
          <button className="text-primary-600 hover:text-primary-900 text-sm">Edit</button>
          <button className="text-red-600 hover:text-red-900 text-sm">Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary-900">Contacts</h1>
          <p className="text-primary-600 mt-2">Manage your contacts and relationships</p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          + Add Contact
        </Button>
      </div>

      <Card padding="lg">
        <div className="mb-6">
          <SearchInput
            placeholder="Search contacts by name, email, or company..."
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            className="max-w-md"
          />
        </div>

        <Table
          data={filteredContacts}
          columns={columns}
          keyExtractor={(contact) => contact.id}
          onRowClick={(contact) => {
            // TODO: Navigate to contact detail page
            console.log('View contact:', contact.id);
          }}
          emptyMessage="No contacts found. Create your first contact to get started!"
        />
      </Card>

      {/* Add Contact Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Contact"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Create Contact
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            label="Phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <Input
            label="Company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          />
        </form>
      </Modal>
    </div>
  );
}

