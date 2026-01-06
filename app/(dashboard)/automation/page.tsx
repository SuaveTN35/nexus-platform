'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';

interface Automation {
  id: string;
  name: string;
  description: string;
  trigger: string;
  actions: string[];
  status: 'active' | 'paused' | 'draft';
  runsToday: number;
  runsTotal: number;
  lastRun: string | null;
}

const mockAutomations: Automation[] = [
  {
    id: '1',
    name: 'Welcome Sequence',
    description: 'Send welcome emails to new contacts',
    trigger: 'Contact Created',
    actions: ['Send Welcome Email', 'Wait 2 days', 'Send Follow-up'],
    status: 'active',
    runsToday: 12,
    runsTotal: 1250,
    lastRun: '2025-01-06T10:30:00',
  },
  {
    id: '2',
    name: 'Deal Stage Notifications',
    description: 'Notify team when deals move to negotiation',
    trigger: 'Deal Stage Changed',
    actions: ['Send Slack Notification', 'Update CRM'],
    status: 'active',
    runsToday: 5,
    runsTotal: 340,
    lastRun: '2025-01-06T09:15:00',
  },
  {
    id: '3',
    name: 'Abandoned Cart Recovery',
    description: 'Follow up on abandoned opportunities',
    trigger: 'No Activity for 7 days',
    actions: ['Send Reminder Email', 'Create Task'],
    status: 'paused',
    runsToday: 0,
    runsTotal: 890,
    lastRun: '2025-01-01T14:20:00',
  },
  {
    id: '4',
    name: 'Lead Scoring Update',
    description: 'Update lead scores based on activity',
    trigger: 'Email Opened',
    actions: ['Update Lead Score', 'Tag Contact'],
    status: 'active',
    runsToday: 28,
    runsTotal: 4520,
    lastRun: '2025-01-06T10:45:00',
  },
];

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
  paused: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
  draft: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

export default function AutomationPage() {
  const [automations] = useState<Automation[]>(mockAutomations);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const activeCount = automations.filter((a) => a.status === 'active').length;
  const totalRuns = automations.reduce((sum, a) => sum + a.runsToday, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Automation</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Create and manage workflow automations</p>
        </div>
        <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>+ New Automation</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Automations</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{automations.length}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{activeCount}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Runs Today</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">{totalRuns}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Runs</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">
              {automations.reduce((sum, a) => sum + a.runsTotal, 0).toLocaleString()}
            </p>
          </div>
        </Card>
      </div>

      {/* Automations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {automations.map((automation) => (
          <Card key={automation.id} padding="lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{automation.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{automation.description}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[automation.status]}`}>
                {automation.status.charAt(0).toUpperCase() + automation.status.slice(1)}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Trigger:</span>
                <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded">
                  {automation.trigger}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions:</span>
                {automation.actions.map((action, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                    {action}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-6">
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{automation.runsToday}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Runs today</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{automation.runsTotal.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total runs</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">Edit</Button>
                <Button
                  variant={automation.status === 'active' ? 'outline' : 'primary'}
                  size="sm"
                >
                  {automation.status === 'active' ? 'Pause' : 'Activate'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Automation Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Automation"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button variant="primary">Create Automation</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Automation Name" placeholder="Enter automation name..." />
          <Input label="Description" placeholder="Describe what this automation does..." />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Trigger</label>
            <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <option>Contact Created</option>
              <option>Deal Stage Changed</option>
              <option>Email Opened</option>
              <option>Form Submitted</option>
              <option>No Activity for X days</option>
            </select>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            You can add actions after creating the automation.
          </p>
        </div>
      </Modal>
    </div>
  );
}
