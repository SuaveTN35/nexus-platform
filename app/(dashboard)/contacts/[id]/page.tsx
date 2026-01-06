'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { formatDate, formatPhone } from '@/lib/utils';

// Mock contact data - will be replaced with API call
const mockContact = {
  id: '1',
  organizationId: 'org-1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+15551234567',
  company: 'Acme Corp',
  tags: ['lead', 'hot'],
  customFields: {},
  createdAt: new Date('2025-01-15'),
  updatedAt: new Date('2025-01-15'),
};

export default function ContactDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [contact, setContact] = useState(mockContact);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email || '',
    phone: contact.phone || '',
    company: contact.company || '',
  });

  const handleSave = () => {
    // TODO: Implement API call
    setContact({ ...contact, ...formData });
    setIsEditing(false);
  };

  const handleDelete = () => {
    // TODO: Implement API call
    router.push('/contacts');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Button variant="ghost" onClick={() => router.back()}>
            ← Back
          </Button>
          <h1 className="text-3xl font-bold text-primary-900 mt-4">
            {contact.firstName} {contact.lastName}
          </h1>
        </div>
        <div className="flex space-x-3">
          {!isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(true)}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                Delete
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Save
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card padding="lg">
            <h2 className="text-xl font-semibold text-primary-900 mb-4">Contact Information</h2>
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                  <Input
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
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
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-primary-600">Email</label>
                  <p className="text-primary-900">{contact.email || '-'}</p>
                </div>
                <div>
                  <label className="text-sm text-primary-600">Phone</label>
                  <p className="text-primary-900">{contact.phone ? formatPhone(contact.phone) : '-'}</p>
                </div>
                <div>
                  <label className="text-sm text-primary-600">Company</label>
                  <p className="text-primary-900">{contact.company || '-'}</p>
                </div>
                <div>
                  <label className="text-sm text-primary-600">Tags</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {contact.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Activity Timeline */}
          <Card padding="lg">
            <h2 className="text-xl font-semibold text-primary-900 mb-4">Activity Timeline</h2>
            <div className="text-center py-12 text-primary-500">
              <p>No activity yet</p>
              <p className="text-sm mt-2">Activity will appear here as interactions are logged</p>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card padding="lg">
            <h3 className="font-semibold text-primary-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Send Email
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Schedule Call
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Create Deal
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Add Note
              </Button>
            </div>
          </Card>

          <Card padding="lg">
            <h3 className="font-semibold text-primary-900 mb-4">Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <label className="text-primary-600">Created</label>
                <p className="text-primary-900">{formatDate(contact.createdAt)}</p>
              </div>
              <div>
                <label className="text-primary-600">Last Updated</label>
                <p className="text-primary-900">{formatDate(contact.updatedAt)}</p>
              </div>
            </div>
          </Card>

          <Card padding="lg">
            <h3 className="font-semibold text-primary-900 mb-4">Related Deals</h3>
            <div className="text-center py-8 text-primary-500 text-sm">
              No deals associated
            </div>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Contact"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-primary-700">
          Are you sure you want to delete {contact.firstName} {contact.lastName}? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}

