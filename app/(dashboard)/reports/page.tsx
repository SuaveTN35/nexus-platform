'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Select, { SelectOption } from '@/components/ui/Select';
import { formatCurrency } from '@/lib/utils';

interface Report {
  id: string;
  name: string;
  type: string;
  lastUpdated: string;
  schedule: string | null;
}

const mockReports: Report[] = [
  { id: '1', name: 'Sales Performance', type: 'Revenue', lastUpdated: '2025-01-06', schedule: 'Weekly' },
  { id: '2', name: 'Pipeline Analysis', type: 'Deals', lastUpdated: '2025-01-06', schedule: 'Daily' },
  { id: '3', name: 'Contact Growth', type: 'Contacts', lastUpdated: '2025-01-05', schedule: 'Monthly' },
  { id: '4', name: 'Campaign ROI', type: 'Marketing', lastUpdated: '2025-01-04', schedule: null },
  { id: '5', name: 'Team Activity', type: 'Activity', lastUpdated: '2025-01-06', schedule: 'Daily' },
];

const timeRangeOptions: SelectOption[] = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: 'ytd', label: 'Year to date' },
];

const mockSalesData = {
  totalRevenue: 485000,
  deals: 42,
  avgDealSize: 11547,
  conversionRate: 23.5,
};

export default function ReportsPage() {
  const [reports] = useState<Report[]>(mockReports);
  const [timeRange, setTimeRange] = useState<string>('30d');
  const [selectedReportType, setSelectedReportType] = useState<string>('all');

  const filteredReports = selectedReportType === 'all'
    ? reports
    : reports.filter((r) => r.type.toLowerCase() === selectedReportType);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Generate and view business reports</p>
        </div>
        <div className="flex gap-4">
          <Select
            options={timeRangeOptions}
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-40"
          />
          <Button variant="primary">+ Create Report</Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{formatCurrency(mockSalesData.totalRevenue)}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Deals Closed</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">{mockSalesData.deals}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Deal Size</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{formatCurrency(mockSalesData.avgDealSize)}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">{mockSalesData.conversionRate}%</p>
          </div>
        </Card>
      </div>

      {/* Report Type Filter */}
      <div className="flex gap-2 mb-6">
        {['all', 'revenue', 'deals', 'contacts', 'marketing', 'activity'].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedReportType(type)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
              selectedReportType === type
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card padding="lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Revenue by Month</h2>
          <div className="h-64 flex items-end justify-between space-x-2">
            {[45, 52, 48, 61, 55, 67].map((value, index) => {
              const height = (value / 70) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-600 rounded-t hover:bg-blue-700 transition-colors"
                    style={{ height: `${height}%`, minHeight: '4px' }}
                    title={formatCurrency(value * 1000)}
                  />
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>

        <Card padding="lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Deals by Stage</h2>
          <div className="space-y-4">
            {[
              { name: 'Lead', count: 25, color: 'bg-gray-500' },
              { name: 'Qualified', count: 18, color: 'bg-blue-500' },
              { name: 'Proposal', count: 12, color: 'bg-yellow-500' },
              { name: 'Negotiation', count: 8, color: 'bg-purple-500' },
              { name: 'Closed Won', count: 15, color: 'bg-green-500' },
            ].map((stage) => {
              const percentage = (stage.count / 25) * 100;
              return (
                <div key={stage.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{stage.name}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{stage.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className={`${stage.color} h-2 rounded-full`} style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Saved Reports */}
      <Card padding="none">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Saved Reports</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Report Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Last Updated</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Schedule</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{report.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {new Date(report.lastUpdated).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {report.schedule || 'Manual'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">View</Button>
                      <Button variant="ghost" size="sm">Export</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
