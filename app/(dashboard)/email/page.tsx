'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import SearchInput from '@/components/ui/SearchInput';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  openRate: number;
  clickRate: number;
  sentCount: number;
  lastUsed: string;
}

interface EmailDraft {
  id: string;
  subject: string;
  recipients: number;
  status: 'draft' | 'scheduled' | 'sent';
  scheduledFor?: string;
  createdAt: string;
}

const mockTemplates: EmailTemplate[] = [
  { id: '1', name: 'Welcome Email', subject: 'Welcome to NEXUS!', openRate: 68, clickRate: 24, sentCount: 1250, lastUsed: '2025-01-05' },
  { id: '2', name: 'Monthly Newsletter', subject: 'Your Monthly Update', openRate: 42, clickRate: 12, sentCount: 3200, lastUsed: '2025-01-01' },
  { id: '3', name: 'Follow-up', subject: 'Just checking in...', openRate: 55, clickRate: 18, sentCount: 890, lastUsed: '2024-12-28' },
  { id: '4', name: 'Product Announcement', subject: 'Exciting New Features!', openRate: 61, clickRate: 28, sentCount: 2100, lastUsed: '2024-12-20' },
];

const mockDrafts: EmailDraft[] = [
  { id: '1', subject: 'Q1 Product Updates', recipients: 1500, status: 'scheduled', scheduledFor: '2025-01-15 09:00', createdAt: '2025-01-05' },
  { id: '2', subject: 'Customer Appreciation', recipients: 2400, status: 'draft', createdAt: '2025-01-04' },
  { id: '3', subject: 'Holiday Special Offer', recipients: 3200, status: 'sent', createdAt: '2024-12-24' },
];

export default function EmailPage() {
  const [templates] = useState<EmailTemplate[]>(mockTemplates);
  const [drafts] = useState<EmailDraft[]>(mockDrafts);
  const [searchQuery, setSearchQuery] = useState('');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'templates' | 'campaigns'>('templates');

  const filteredTemplates = searchQuery
    ? templates.filter((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : templates;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Email Marketing</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Create and manage email campaigns</p>
        </div>
        <Button variant="primary" onClick={() => setIsComposeOpen(true)}>+ Compose Email</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Sent</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">7,440</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Open Rate</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">56.5%</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Click Rate</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">20.5%</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Subscribers</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">3,250</p>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'templates'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Templates
        </button>
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'campaigns'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Campaigns
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchInput
          placeholder={`Search ${activeTab}...`}
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
          className="max-w-md"
        />
      </div>

      {activeTab === 'templates' ? (
        /* Templates Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} padding="lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{template.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 truncate">{template.subject}</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{template.openRate}%</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Open Rate</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{template.clickRate}%</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Click Rate</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Sent {template.sentCount.toLocaleString()} times</span>
                <Button variant="outline" size="sm">Use Template</Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Campaigns List */
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Subject</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Recipients</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {drafts.map((draft) => (
                  <tr key={draft.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{draft.subject}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{draft.recipients.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        draft.status === 'sent' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' :
                        draft.status === 'scheduled' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {draft.status.charAt(0).toUpperCase() + draft.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {draft.scheduledFor || new Date(draft.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Compose Modal */}
      <Modal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        title="Compose Email"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsComposeOpen(false)}>Save as Draft</Button>
            <Button variant="primary">Send Email</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="To" placeholder="Select recipients or lists..." />
          <Input label="Subject" placeholder="Enter email subject..." />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Body</label>
            <textarea
              className="w-full h-48 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your email content..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
