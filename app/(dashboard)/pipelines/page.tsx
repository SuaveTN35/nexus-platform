'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { formatCurrency } from '@/lib/utils';

interface PipelineStage {
  id: string;
  name: string;
  probability: number;
  deals: number;
  value: number;
  color: string;
}

interface Pipeline {
  id: string;
  name: string;
  description: string;
  stages: PipelineStage[];
  isDefault: boolean;
}

const mockPipelines: Pipeline[] = [
  {
    id: '1',
    name: 'Sales Pipeline',
    description: 'Main sales process for all deals',
    isDefault: true,
    stages: [
      { id: 's1', name: 'Lead', probability: 10, deals: 12, value: 240000, color: 'bg-gray-500' },
      { id: 's2', name: 'Qualified', probability: 25, deals: 8, value: 180000, color: 'bg-blue-500' },
      { id: 's3', name: 'Proposal', probability: 50, deals: 15, value: 420000, color: 'bg-yellow-500' },
      { id: 's4', name: 'Negotiation', probability: 75, deals: 10, value: 350000, color: 'bg-purple-500' },
      { id: 's5', name: 'Closed Won', probability: 100, deals: 28, value: 680000, color: 'bg-green-500' },
    ],
  },
  {
    id: '2',
    name: 'Enterprise Pipeline',
    description: 'For enterprise-level deals over $100k',
    isDefault: false,
    stages: [
      { id: 'e1', name: 'Discovery', probability: 10, deals: 4, value: 600000, color: 'bg-gray-500' },
      { id: 'e2', name: 'Technical Review', probability: 30, deals: 3, value: 450000, color: 'bg-blue-500' },
      { id: 'e3', name: 'Proposal', probability: 50, deals: 2, value: 280000, color: 'bg-yellow-500' },
      { id: 'e4', name: 'Legal Review', probability: 70, deals: 2, value: 320000, color: 'bg-orange-500' },
      { id: 'e5', name: 'Contract Signed', probability: 100, deals: 5, value: 750000, color: 'bg-green-500' },
    ],
  },
];

export default function PipelinesPage() {
  const [pipelines] = useState<Pipeline[]>(mockPipelines);
  const [selectedPipeline, setSelectedPipeline] = useState<Pipeline>(pipelines[0]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPipelineName, setNewPipelineName] = useState('');

  const totalDeals = selectedPipeline.stages.reduce((sum, stage) => sum + stage.deals, 0);
  const totalValue = selectedPipeline.stages.reduce((sum, stage) => sum + stage.value, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pipelines</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your sales pipelines and stages</p>
        </div>
        <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>+ New Pipeline</Button>
      </div>

      {/* Pipeline Selector */}
      <div className="flex gap-4 mb-8">
        {pipelines.map((pipeline) => (
          <button
            key={pipeline.id}
            onClick={() => setSelectedPipeline(pipeline)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedPipeline.id === pipeline.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {pipeline.name}
            {pipeline.isDefault && (
              <span className="ml-2 text-xs opacity-75">(Default)</span>
            )}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Deals</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{totalDeals}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Value</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">{formatCurrency(totalValue)}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Stages</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{selectedPipeline.stages.length}</p>
          </div>
        </Card>
      </div>

      {/* Pipeline Visualization */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedPipeline.name}</h2>
          <p className="text-gray-600 dark:text-gray-400">{selectedPipeline.description}</p>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4">
          {selectedPipeline.stages.map((stage, index) => (
            <div key={stage.id} className="min-w-[200px] flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                <h3 className="font-medium text-gray-900 dark:text-white">{stage.name}</h3>
                {index < selectedPipeline.stages.length - 1 && (
                  <svg className="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stage.deals}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">deals</div>
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(stage.value)}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stage.probability}% probability</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Create Pipeline Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Pipeline"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setIsCreateModalOpen(false)}>Create Pipeline</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Pipeline Name"
            value={newPipelineName}
            onChange={(e) => setNewPipelineName(e.target.value)}
            placeholder="Enter pipeline name"
          />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            You can customize stages after creating the pipeline.
          </p>
        </div>
      </Modal>
    </div>
  );
}
