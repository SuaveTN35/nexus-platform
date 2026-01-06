'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import SearchInput from '@/components/ui/SearchInput';
import { formatCurrency } from '@/lib/utils';

interface Opportunity {
  id: string;
  name: string;
  company: string;
  value: number;
  probability: number;
  stage: string;
  owner: string;
  expectedClose: string;
}

const mockOpportunities: Opportunity[] = [
  { id: '1', name: 'Enterprise Software License', company: 'Acme Corp', value: 50000, probability: 75, stage: 'Proposal', owner: 'John Doe', expectedClose: '2025-02-15' },
  { id: '2', name: 'Marketing Campaign Services', company: 'TechStart Inc', value: 25000, probability: 60, stage: 'Negotiation', owner: 'Jane Smith', expectedClose: '2025-01-30' },
  { id: '3', name: 'Cloud Migration Project', company: 'Global Industries', value: 120000, probability: 40, stage: 'Qualified', owner: 'John Doe', expectedClose: '2025-03-20' },
  { id: '4', name: 'Annual Support Contract', company: 'Retail Solutions', value: 35000, probability: 90, stage: 'Negotiation', owner: 'Mike Johnson', expectedClose: '2025-01-25' },
  { id: '5', name: 'Custom Integration', company: 'FinTech Pro', value: 80000, probability: 55, stage: 'Proposal', owner: 'Jane Smith', expectedClose: '2025-02-28' },
];

const stageColors: Record<string, string> = {
  'Lead': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  'Qualified': 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  'Proposal': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
  'Negotiation': 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
  'Closed Won': 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
  'Closed Lost': 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
};

export default function OpportunitiesPage() {
  const [opportunities] = useState<Opportunity[]>(mockOpportunities);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOpportunities = searchQuery
    ? opportunities.filter(
        (opp) =>
          opp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          opp.company.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : opportunities;

  const totalValue = opportunities.reduce((sum, opp) => sum + opp.value, 0);
  const weightedValue = opportunities.reduce((sum, opp) => sum + (opp.value * opp.probability / 100), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Opportunities</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Track and manage your sales opportunities</p>
        </div>
        <Button variant="primary">+ New Opportunity</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Pipeline</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{formatCurrency(totalValue)}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Weighted Value</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">{formatCurrency(weightedValue)}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Open Opportunities</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{opportunities.length}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Probability</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">
              {Math.round(opportunities.reduce((sum, opp) => sum + opp.probability, 0) / opportunities.length)}%
            </p>
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchInput
          placeholder="Search opportunities..."
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
          className="max-w-md"
        />
      </div>

      {/* Opportunities Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Opportunity</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Company</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Value</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Probability</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Stage</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Owner</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Expected Close</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredOpportunities.map((opp) => (
                <tr key={opp.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/deals/${opp.id}`} className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                      {opp.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{opp.company}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{formatCurrency(opp.value)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div className="h-2 bg-blue-600 rounded-full" style={{ width: `${opp.probability}%` }} />
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{opp.probability}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${stageColors[opp.stage] || stageColors['Lead']}`}>
                      {opp.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{opp.owner}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{new Date(opp.expectedClose).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
