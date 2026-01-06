'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Select, { SelectOption } from '@/components/ui/Select';

const planOptions: SelectOption[] = [
  { value: 'starter', label: 'Starter - $97/month' },
  { value: 'professional', label: 'Professional - $197/month' },
  { value: 'enterprise', label: 'Enterprise - $497/month' },
  { value: 'agency', label: 'Agency - $997/month' },
];

export default function SettingsPage() {
  const [organizationName, setOrganizationName] = useState('My Organization');
  const [plan, setPlan] = useState('professional');
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving settings...');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your organization and preferences</p>
      </div>

      <div className="space-y-6">
        {/* Organization Settings */}
        <Card padding="lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Organization Settings</h2>
          <div className="space-y-4 max-w-2xl">
            <Input
              label="Organization Name"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
            />
            <Select
              label="Plan"
              options={planOptions}
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              helperText="Upgrade or downgrade your plan at any time"
            />
            <div className="pt-4">
              <Button variant="primary" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        </Card>

        {/* Notification Preferences */}
        <Card padding="lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Notification Preferences</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receive updates via email</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:bg-gray-700"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">SMS Notifications</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receive updates via text message</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.sms}
                onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:bg-gray-700"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Push Notifications</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receive browser push notifications</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.push}
                onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:bg-gray-700"
              />
            </label>
            <div className="pt-4">
              <Button variant="primary" onClick={handleSave}>
                Save Preferences
              </Button>
            </div>
          </div>
        </Card>

        {/* Team Members */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Team Members</h2>
            <Button variant="outline" size="sm">
              + Invite Member
            </Button>
          </div>
          <div className="space-y-3">
            {[
              { name: 'John Doe', email: 'john@example.com', role: 'Admin' },
              { name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
            ].map((member, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{member.email}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{member.role}</span>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Billing */}
        <Card padding="lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Billing</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Current Plan</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Professional Plan</p>
              </div>
              <Button variant="outline" size="sm">
                Change Plan
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Payment Method</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">•••• •••• •••• 4242</p>
              </div>
              <Button variant="outline" size="sm">
                Update
              </Button>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card padding="lg" className="border-red-200 dark:border-red-900/50">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">Danger Zone</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Delete Organization</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Permanently delete your organization and all data</p>
              </div>
              <Button variant="outline" size="sm" className="border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30">
                Delete
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

