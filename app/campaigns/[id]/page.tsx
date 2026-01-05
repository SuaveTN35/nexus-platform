'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select, { SelectOption } from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import { formatDate } from '@/lib/utils';

// Mock campaign data
const mockCampaign = {
  id: '1',
  organizationId: 'org-1',
  name: 'Q1 Product Launch',
  type: 'email' as const,
  status: 'active' as const,
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-03-31'),
  settings: {},
  createdAt: new Date('2024-12-15'),
  updatedAt: new Date('2025-01-01'),
};

const typeOptions: SelectOption[] = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
  { value: 'multi-channel', label: 'Multi-Channel' },
];

const statusOptions: SelectOption[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' },
];

const getStatusColor = (status: string): string => {
  const colors = {
    draft: 'bg-gray-100 text-gray-800',
    scheduled: 'bg-blue-100 text-blue-800',
    active: 'bg-green-100 text-green-800',
    paused: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-primary-100 text-primary-800',
  };
  return colors[status as keyof typeof colors] || colors.draft;
};

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [campaign, setCampaign] = useState(mockCampaign);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: campaign.name,
    type: campaign.type,
    status: campaign.status,
    startDate: campaign.startDate ? campaign.startDate.toISOString().split('T')[0] : '',
    endDate: campaign.endDate ? campaign.endDate.toISOString().split('T')[0] : '',
  });

  const handleSave = () => {
    // TODO: Implement API call
    setCampaign({
      ...campaign,
      ...formData,
      startDate: formData.startDate ? new Date(formData.startDate) : null,
      endDate: formData.endDate ? new Date(formData.endDate) : null,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    // TODO: Implement API call
    router.push('/campaigns');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Button variant="ghost" onClick={() => router.back()}>
            ← Back
          </Button>
          <h1 className="text-3xl font-bold text-primary-900 mt-4">{campaign.name}</h1>
          <p className="text-primary-600 mt-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
            </span>
            {' · '}
            {campaign.type.replace('-', ' ').charAt(0).toUpperCase() + campaign.type.replace('-', ' ').slice(1)}
          </p>
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
            <h2 className="text-xl font-semibold text-primary-900 mb-4">Campaign Information</h2>
            {isEditing ? (
              <div className="space-y-4">
                <Input
                  label="Campaign Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <Select
                  label="Type"
                  options={typeOptions}
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                />
                <Select
                  label="Status"
                  options={statusOptions}
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Start Date"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                  <Input
                    label="End Date"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-primary-600">Campaign Type</label>
                  <p className="text-primary-900 capitalize">{campaign.type.replace('-', ' ')}</p>
                </div>
                <div>
                  <label className="text-sm text-primary-600">Status</label>
                  <p className="text-primary-900">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </span>
                  </p>
                </div>
                {campaign.startDate && (
                  <div>
                    <label className="text-sm text-primary-600">Start Date</label>
                    <p className="text-primary-900">{formatDate(campaign.startDate)}</p>
                  </div>
                )}
                {campaign.endDate && (
                  <div>
                    <label className="text-sm text-primary-600">End Date</label>
                    <p className="text-primary-900">{formatDate(campaign.endDate)}</p>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Campaign Stats */}
          <Card padding="lg">
            <h2 className="text-xl font-semibold text-primary-900 mb-4">Campaign Performance</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-primary-50 rounded-lg">
                <p className="text-2xl font-bold text-primary-900">1,234</p>
                <p className="text-sm text-primary-600 mt-1">Sent</p>
              </div>
              <div className="text-center p-4 bg-primary-50 rounded-lg">
                <p className="text-2xl font-bold text-primary-900">308</p>
                <p className="text-sm text-primary-600 mt-1">Opened</p>
              </div>
              <div className="text-center p-4 bg-primary-50 rounded-lg">
                <p className="text-2xl font-bold text-primary-900">64</p>
                <p className="text-sm text-primary-600 mt-1">Clicked</p>
              </div>
              <div className="text-center p-4 bg-primary-50 rounded-lg">
                <p className="text-2xl font-bold text-primary-900">24.8%</p>
                <p className="text-sm text-primary-600 mt-1">Open Rate</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card padding="lg">
            <h3 className="font-semibold text-primary-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Send Test Email
              </Button>
              <Button variant="outline" className="w-full justify-start">
                View Recipients
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Edit Content
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Schedule Send
              </Button>
            </div>
          </Card>

          <Card padding="lg">
            <h3 className="font-semibold text-primary-900 mb-4">Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <label className="text-primary-600">Created</label>
                <p className="text-primary-900">{formatDate(campaign.createdAt)}</p>
              </div>
              <div>
                <label className="text-primary-600">Last Updated</label>
                <p className="text-primary-900">{formatDate(campaign.updatedAt)}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Campaign"
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
          Are you sure you want to delete "{campaign.name}"? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}

