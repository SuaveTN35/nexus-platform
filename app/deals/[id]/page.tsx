'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select, { SelectOption } from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import { formatCurrency, formatDate } from '@/lib/utils';

// Mock deal data
const mockDeal = {
  id: '1',
  organizationId: 'org-1',
  contactId: 'contact-1',
  name: 'Enterprise Software License',
  value: 50000,
  stage: 'Proposal',
  probability: 75,
  expectedCloseDate: new Date('2025-02-15'),
  actualCloseDate: null,
  status: 'open' as const,
  createdAt: new Date('2025-01-10'),
  updatedAt: new Date('2025-01-15'),
};

const stageOptions: SelectOption[] = [
  { value: 'Lead', label: 'Lead' },
  { value: 'Qualified', label: 'Qualified' },
  { value: 'Proposal', label: 'Proposal' },
  { value: 'Negotiation', label: 'Negotiation' },
  { value: 'Closed Won', label: 'Closed Won' },
  { value: 'Closed Lost', label: 'Closed Lost' },
];

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [deal, setDeal] = useState(mockDeal);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: deal.name,
    value: deal.value,
    stage: deal.stage,
    probability: deal.probability,
    expectedCloseDate: deal.expectedCloseDate
      ? deal.expectedCloseDate.toISOString().split('T')[0]
      : '',
  });

  const handleSave = () => {
    // TODO: Implement API call
    setDeal({
      ...deal,
      ...formData,
      expectedCloseDate: formData.expectedCloseDate ? new Date(formData.expectedCloseDate) : null,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    // TODO: Implement API call
    router.push('/deals');
  };

  const handleStageChange = (newStage: string) => {
    if (newStage === 'Closed Won' || newStage === 'Closed Lost') {
      setDeal({
        ...deal,
        stage: newStage,
        status: newStage === 'Closed Won' ? 'won' : 'lost',
        actualCloseDate: new Date(),
      });
    } else {
      setDeal({ ...deal, stage: newStage });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Button variant="ghost" onClick={() => router.back()}>
            ← Back
          </Button>
          <h1 className="text-3xl font-bold text-primary-900 mt-4">{deal.name}</h1>
          <p className="text-primary-600 mt-2">
            {formatCurrency(deal.value)} · {deal.stage}
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
            <h2 className="text-xl font-semibold text-primary-900 mb-4">Deal Information</h2>
            {isEditing ? (
              <div className="space-y-4">
                <Input
                  label="Deal Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <Input
                  label="Deal Value"
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
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
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-primary-600">Deal Value</label>
                    <p className="text-2xl font-bold text-primary-900">{formatCurrency(deal.value)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-primary-600">Probability</label>
                    <p className="text-2xl font-bold text-primary-900">{deal.probability}%</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-primary-600">Stage</label>
                  <p className="text-primary-900 font-medium">{deal.stage}</p>
                </div>
                <div>
                  <label className="text-sm text-primary-600">Status</label>
                  <p className="text-primary-900">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        deal.status === 'won'
                          ? 'bg-green-100 text-green-800'
                          : deal.status === 'lost'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {deal.status === 'won' ? 'Won' : deal.status === 'lost' ? 'Lost' : 'Open'}
                    </span>
                  </p>
                </div>
                {deal.expectedCloseDate && (
                  <div>
                    <label className="text-sm text-primary-600">Expected Close Date</label>
                    <p className="text-primary-900">{formatDate(deal.expectedCloseDate)}</p>
                  </div>
                )}
                {deal.actualCloseDate && (
                  <div>
                    <label className="text-sm text-primary-600">Actual Close Date</label>
                    <p className="text-primary-900">{formatDate(deal.actualCloseDate)}</p>
                  </div>
                )}
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
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleStageChange('Closed Won')}
              >
                Mark as Won
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleStageChange('Closed Lost')}
              >
                Mark as Lost
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Send Email
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Schedule Meeting
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
                <label className="text-primary-600">Contact ID</label>
                <p className="text-primary-900">{deal.contactId}</p>
              </div>
              <div>
                <label className="text-primary-600">Created</label>
                <p className="text-primary-900">{formatDate(deal.createdAt)}</p>
              </div>
              <div>
                <label className="text-primary-600">Last Updated</label>
                <p className="text-primary-900">{formatDate(deal.updatedAt)}</p>
              </div>
            </div>
          </Card>

          <Card padding="lg">
            <h3 className="font-semibold text-primary-900 mb-4">Pipeline Progress</h3>
            <div className="space-y-2">
              {['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed'].map((stage, index) => {
                const stages = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won'];
                const currentIndex = stages.indexOf(deal.stage);
                const isActive = index <= currentIndex;
                const isCurrent = stages[index] === deal.stage;

                return (
                  <div key={stage} className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        isActive ? 'bg-primary-600' : 'bg-primary-200'
                      } ${isCurrent ? 'ring-2 ring-primary-400' : ''}`}
                    />
                    <span
                      className={`text-sm ${isActive ? 'text-primary-900 font-medium' : 'text-primary-400'}`}
                    >
                      {stage}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Deal"
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
          Are you sure you want to delete "{deal.name}"? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}

