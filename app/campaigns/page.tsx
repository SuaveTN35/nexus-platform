'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Select, { SelectOption } from '@/components/ui/Select';
import SearchInput from '@/components/ui/SearchInput';
import Table, { TableColumn } from '@/components/ui/Table';
import { Campaign, CampaignStatus, CampaignType } from '@/types';

// Mock data - will be replaced with API calls
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
  {
    id: '2',
    organizationId: 'org-1',
    name: 'Holiday Special',
    type: 'multi-channel',
    status: 'completed',
    startDate: new Date('2024-12-01'),
    endDate: new Date('2024-12-31'),
    settings: {},
    createdAt: new Date('2024-11-20'),
    updatedAt: new Date('2024-12-31'),
  },
];

const statusOptions: SelectOption[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' },
];

const getStatusColor = (status: CampaignStatus): string => {
  const colors = {
    draft: 'bg-gray-100 text-gray-800',
    scheduled: 'bg-blue-100 text-blue-800',
    active: 'bg-green-100 text-green-800',
    paused: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-primary-100 text-primary-800',
  };
  return colors[status] || colors.draft;
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const columns: TableColumn<Campaign>[] = [
    {
      key: 'name',
      header: 'Campaign Name',
      render: (campaign) => (
        <Link
          href={`/campaigns/${campaign.id}`}
          className="text-primary-700 hover:text-primary-900 font-medium"
        >
          {campaign.name}
        </Link>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (campaign) => (
        <span className="capitalize">{campaign.type.replace('-', ' ')}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (campaign) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
        </span>
      ),
    },
    {
      key: 'dates',
      header: 'Duration',
      render: (campaign) => {
        if (!campaign.startDate) return '-';
        const start = campaign.startDate.toLocaleDateString();
        const end = campaign.endDate?.toLocaleDateString() || 'Ongoing';
        return `${start} - ${end}`;
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: () => (
        <div className="flex space-x-2">
          <button className="text-primary-600 hover:text-primary-900 text-sm">View</button>
          <button className="text-primary-600 hover:text-primary-900 text-sm">Edit</button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary-900">Campaigns</h1>
          <p className="text-primary-600 mt-2">Manage your marketing campaigns and automations</p>
        </div>
        <Button variant="primary">+ Create Campaign</Button>
      </div>

      <Card padding="lg">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-4 flex-1">
            <SearchInput
              placeholder="Search campaigns by name or type..."
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
              className="max-w-md"
            />
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-48"
            />
          </div>
        </div>

        <Table
          data={filteredCampaigns}
          columns={columns}
          keyExtractor={(campaign) => campaign.id}
          onRowClick={(campaign) => {
            // TODO: Navigate to campaign detail page
            console.log('View campaign:', campaign.id);
          }}
          emptyMessage="No campaigns found. Create your first campaign to get started!"
        />
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <Card>
          <div className="text-center">
            <p className="text-sm text-primary-600">Total Campaigns</p>
            <p className="text-3xl font-bold text-primary-900 mt-2">{campaigns.length}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-primary-600">Active</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {campaigns.filter((c) => c.status === 'active').length}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-primary-600">Scheduled</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {campaigns.filter((c) => c.status === 'scheduled').length}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-primary-600">Completed</p>
            <p className="text-3xl font-bold text-primary-600 mt-2">
              {campaigns.filter((c) => c.status === 'completed').length}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

