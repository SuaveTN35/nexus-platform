'use client';

import React from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils';

// Mock data - will be replaced with API calls
const stats = {
  totalContacts: 42,
  activeDeals: 8,
  campaigns: 5,
  revenue: 125000,
  pipelineValue: 250000,
  conversionRate: 24.5,
  avgDealSize: 31250,
  recentActivity: [
    { id: '1', type: 'contact', message: 'New contact "John Doe" added', time: new Date('2025-01-20T10:30:00') },
    { id: '2', type: 'deal', message: 'Deal "Enterprise License" moved to Proposal', time: new Date('2025-01-20T09:15:00') },
    { id: '3', type: 'campaign', message: 'Campaign "Q1 Launch" started', time: new Date('2025-01-19T14:20:00') },
  ],
};

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-900">Dashboard</h1>
        <p className="text-primary-600 mt-2">Welcome back! Here's what's happening with your business.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card hover>
          <Link href="/contacts">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary-600">Total Contacts</p>
                <p className="text-3xl font-bold text-primary-900 mt-2">{stats.totalContacts}</p>
                <p className="text-xs text-primary-500 mt-1">+12% from last month</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </Link>
        </Card>

        <Card hover>
          <Link href="/deals">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary-600">Active Deals</p>
                <p className="text-3xl font-bold text-primary-900 mt-2">{stats.activeDeals}</p>
                <p className="text-xs text-primary-500 mt-1">{formatCurrency(250000)} in pipeline</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </Link>
        </Card>

        <Card hover>
          <Link href="/campaigns">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary-600">Campaigns</p>
                <p className="text-3xl font-bold text-primary-900 mt-2">{stats.campaigns}</p>
                <p className="text-xs text-primary-500 mt-1">3 active</p>
              </div>
              <div className="text-4xl">📧</div>
            </div>
          </Link>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-600">Revenue (MTD)</p>
              <p className="text-3xl font-bold text-primary-900 mt-2">{formatCurrency(stats.revenue)}</p>
              <p className="text-xs text-primary-500 mt-1">+8% from last month</p>
            </div>
            <div className="text-4xl">📈</div>
          </div>
        </Card>
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card hover>
          <div className="text-center">
            <p className="text-sm text-primary-600">Pipeline Value</p>
            <p className="text-2xl font-bold text-primary-900 mt-2">{formatCurrency(stats.pipelineValue)}</p>
            <p className="text-xs text-primary-500 mt-1">Active opportunities</p>
          </div>
        </Card>

        <Card hover>
          <div className="text-center">
            <p className="text-sm text-primary-600">Conversion Rate</p>
            <p className="text-2xl font-bold text-primary-900 mt-2">{stats.conversionRate}%</p>
            <p className="text-xs text-primary-500 mt-1">Lead to customer</p>
          </div>
        </Card>

        <Card hover>
          <div className="text-center">
            <p className="text-sm text-primary-600">Avg Deal Size</p>
            <p className="text-2xl font-bold text-primary-900 mt-2">{formatCurrency(stats.avgDealSize)}</p>
            <p className="text-xs text-primary-500 mt-1">Per closed deal</p>
          </div>
        </Card>

        <Card hover>
          <div className="text-center">
            <p className="text-sm text-primary-600">Active Campaigns</p>
            <p className="text-2xl font-bold text-primary-900 mt-2">3</p>
            <p className="text-xs text-primary-500 mt-1">Currently running</p>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-primary-900">Recent Activity</h2>
            <Link href="/activity">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b border-primary-100 last:border-0 last:pb-0">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary-500 mt-2"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-primary-900">{activity.message}</p>
                  <p className="text-xs text-primary-500 mt-1">{formatDate(activity.time)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card padding="lg">
          <h2 className="text-xl font-semibold text-primary-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/contacts?action=new">
              <button className="w-full text-left px-4 py-3 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors">
                <div className="font-medium text-primary-900">Add New Contact</div>
                <div className="text-sm text-primary-600">Create a new contact in your CRM</div>
              </button>
            </Link>
            <Link href="/campaigns?action=new">
              <button className="w-full text-left px-4 py-3 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors">
                <div className="font-medium text-primary-900">Create Campaign</div>
                <div className="text-sm text-primary-600">Start a new marketing campaign</div>
              </button>
            </Link>
            <Link href="/deals?action=new">
              <button className="w-full text-left px-4 py-3 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors">
                <div className="font-medium text-primary-900">New Deal</div>
                <div className="text-sm text-primary-600">Add a new deal to your pipeline</div>
              </button>
            </Link>
            <Link href="/analytics">
              <button className="w-full text-left px-4 py-3 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors">
                <div className="font-medium text-primary-900">View Analytics</div>
                <div className="text-sm text-primary-600">See detailed reports and insights</div>
              </button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
