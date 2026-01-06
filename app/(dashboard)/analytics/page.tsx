'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Select, { SelectOption } from '@/components/ui/Select';
import { formatCurrency } from '@/lib/utils';

const timeRangeOptions: SelectOption[] = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '1y', label: 'Last year' },
  { value: 'all', label: 'All time' },
];

// Mock analytics data
const mockMetrics = {
  totalRevenue: 485000,
  revenueGrowth: 12.5,
  totalDeals: 42,
  dealsWon: 28,
  winRate: 66.7,
  avgDealSize: 17321,
  totalContacts: 156,
  contactsGrowth: 8.3,
  campaignsActive: 5,
  emailOpenRate: 24.8,
  emailClickRate: 5.2,
};

const revenueData = [
  { month: 'Jan', value: 45000 },
  { month: 'Feb', value: 52000 },
  { month: 'Mar', value: 48000 },
  { month: 'Apr', value: 61000 },
  { month: 'May', value: 55000 },
  { month: 'Jun', value: 67000 },
  { month: 'Jul', value: 58000 },
  { month: 'Aug', value: 73000 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<string>('30d');

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Track your business performance and insights</p>
        </div>
        <Select
          options={timeRangeOptions}
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="w-48"
        />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card padding="lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
            <span className="text-xs bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
              +{mockMetrics.revenueGrowth}%
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(mockMetrics.totalRevenue)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Revenue for selected period</p>
        </Card>

        <Card padding="lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Win Rate</p>
            <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
              Excellent
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{mockMetrics.winRate}%</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {mockMetrics.dealsWon} of {mockMetrics.totalDeals} deals won
          </p>
        </Card>

        <Card padding="lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Deal Size</p>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(mockMetrics.avgDealSize)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Average value per deal</p>
        </Card>

        <Card padding="lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Email Open Rate</p>
            <span className="text-xs bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
              Good
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{mockMetrics.emailOpenRate}%</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{mockMetrics.emailClickRate}% click rate</p>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <Card padding="lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Revenue Trend</h2>
          <div className="h-64 flex items-end justify-between space-x-2">
            {revenueData.map((item, index) => {
              const maxValue = Math.max(...revenueData.map((d) => d.value));
              const height = (item.value / maxValue) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-600 dark:bg-blue-500 rounded-t hover:bg-blue-700 dark:hover:bg-blue-400 transition-colors"
                    style={{ height: `${height}%`, minHeight: '4px' }}
                    title={formatCurrency(item.value)}
                  />
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">{item.month}</p>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Deal Pipeline Chart */}
        <Card padding="lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Deal Pipeline Distribution</h2>
          <div className="space-y-4">
            {['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won'].map((stage, index) => {
              const values = [12, 8, 15, 10, 28];
              const total = values.reduce((a, b) => a + b, 0);
              const percentage = ((values[index] / total) * 100).toFixed(0);
              return (
                <div key={stage}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{stage}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {values[index]} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card padding="lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Performing Campaigns</h3>
          <div className="space-y-3">
            {['Q1 Product Launch', 'Holiday Special', 'Spring Promotion'].map((campaign, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">{campaign}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatCurrency([45000, 32000, 28000][index])}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Growth</h3>
          <div className="flex items-end space-x-2 h-32">
            {[45, 52, 48, 61, 55, 67, 58, 73].map((value, index) => {
              const maxValue = 80;
              const height = (value / maxValue) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-purple-500 rounded-t"
                    style={{ height: `${height}%`, minHeight: '4px' }}
                  />
                </div>
              );
            })}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
            +{mockMetrics.contactsGrowth}% growth rate
          </p>
        </Card>

        <Card padding="lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Conversion Funnel</h3>
          <div className="space-y-3">
            {[
              { label: 'Leads', value: 156, percentage: 100 },
              { label: 'Qualified', value: 98, percentage: 63 },
              { label: 'Proposals', value: 45, percentage: 29 },
              { label: 'Closed Won', value: 28, percentage: 18 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.value} ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

