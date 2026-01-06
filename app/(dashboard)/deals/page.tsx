'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select, { SelectOption } from '@/components/ui/Select';
import SearchInput from '@/components/ui/SearchInput';
import { Deal, DealFormData, DealStatus } from '@/types';

// Mock data
const mockDeals: Deal[] = [
  {
    id: '1',
    organizationId: 'org-1',
    contactId: 'contact-1',
    name: 'Enterprise Software License',
    value: 50000,
    stage: 'Proposal',
    probability: 75,
    expectedCloseDate: new Date('2025-02-15'),
    actualCloseDate: null,
    status: 'open',
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-15'),
  },
  {
    id: '2',
    organizationId: 'org-1',
    contactId: 'contact-2',
    name: 'Marketing Campaign Services',
    value: 25000,
    stage: 'Negotiation',
    probability: 60,
    expectedCloseDate: new Date('2025-01-30'),
    actualCloseDate: null,
    status: 'open',
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-18'),
  },
];

const pipelineStages = [
  'Lead',
  'Qualified',
  'Proposal',
  'Negotiation',
  'Closed Won',
  'Closed Lost',
];

const stageOptions: SelectOption[] = pipelineStages.map((stage) => ({
  value: stage,
  label: stage,
}));

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(value);
};

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>(mockDeals);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<DealFormData>({
    name: '',
    contactId: '',
    value: 0,
    stage: 'Lead',
    probability: 50,
    expectedCloseDate: '',
  });

  const filteredDeals = searchQuery
    ? deals.filter(
        (deal) =>
          deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          deal.stage.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : deals;

  const dealsByStage = pipelineStages.reduce((acc, stage) => {
    acc[stage] = filteredDeals.filter((deal) => deal.stage === stage && deal.status === 'open');
    return acc;
  }, {} as Record<string, Deal[]>);

  const totalValue = deals.reduce((sum, deal) => sum + (deal.status === 'open' ? deal.value : 0), 0);
  const wonValue = deals.filter((deal) => deal.status === 'won').reduce((sum, deal) => sum + deal.value, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call
    const newDeal: Deal = {
      id: Date.now().toString(),
      organizationId: 'org-1',
      contactId: formData.contactId,
      name: formData.name,
      value: formData.value,
      stage: formData.stage,
      probability: formData.probability,
      expectedCloseDate: formData.expectedCloseDate ? new Date(formData.expectedCloseDate) : null,
      actualCloseDate: null,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setDeals([...deals, newDeal]);
    setIsModalOpen(false);
    setFormData({ name: '', contactId: '', value: 0, stage: 'Lead', probability: 50, expectedCloseDate: '' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Deals Pipeline</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your sales pipeline and track deals</p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          + New Deal
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Pipeline Value</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{formatCurrency(totalValue)}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Open Deals</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
              {deals.filter((d) => d.status === 'open').length}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Won Deals</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
              {deals.filter((d) => d.status === 'won').length}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Won Value</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{formatCurrency(wonValue)}</p>
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchInput
          placeholder="Search deals by name or stage..."
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
          className="max-w-md"
        />
      </div>

      {/* Pipeline View */}
      <div className="overflow-x-auto">
        <div className="flex space-x-4 min-w-max pb-4">
          {pipelineStages.map((stage) => (
            <Card key={stage} className="min-w-[300px] flex-shrink-0" padding="md">
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">{stage}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {dealsByStage[stage]?.length || 0} deals ·{' '}
                  {formatCurrency(
                    dealsByStage[stage]?.reduce((sum, deal) => sum + deal.value, 0) || 0
                  )}
                </p>
              </div>
              <div className="space-y-3">
                {dealsByStage[stage]?.map((deal) => (
                  <Link
                    key={deal.id}
                    href={`/deals/${deal.id}`}
                    className="block bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="font-medium text-gray-900 dark:text-white mb-1">{deal.name}</div>
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {formatCurrency(deal.value)}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{deal.probability}% probability</span>
                      {deal.expectedCloseDate && (
                        <span className="text-gray-600 dark:text-gray-400">
                          {deal.expectedCloseDate.toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* New Deal Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Deal"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Create Deal
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Deal Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Contact ID"
            value={formData.contactId}
            onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
            required
            helperText="Select a contact for this deal"
          />
          <Input
            label="Deal Value"
            type="number"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
            required
          />
          <Select
            label="Stage"
            options={stageOptions}
            value={formData.stage}
            onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
          />
          <Input
            label="Probability (%)"
            type="number"
            min="0"
            max="100"
            value={formData.probability}
            onChange={(e) =>
              setFormData({ ...formData, probability: parseInt(e.target.value) || 0 })
            }
          />
          <Input
            label="Expected Close Date"
            type="date"
            value={formData.expectedCloseDate}
            onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
          />
        </form>
      </Modal>
    </div>
  );
}

