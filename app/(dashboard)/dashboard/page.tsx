'use client';

import React from 'react';
import Link from 'next/link';

// Mock data - will be replaced with API calls
const stats = {
  opportunities: {
    total: 24,
    open: 18,
    won: 4,
    lost: 2,
    value: 485000,
    openValue: 320000,
    wonValue: 145000,
    lostValue: 20000,
  },
  contacts: {
    total: 1247,
    new: 42,
    active: 856,
  },
  properties: {
    total: 38,
    active: 24,
    pending: 8,
    sold: 6,
  },
  campaigns: {
    active: 3,
    emails: 12500,
    openRate: 24.5,
    clickRate: 3.2,
  },
  conversionRate: 22.2,
  avgDealSize: 36250,
};

const pipelineStages = [
  { name: 'New Lead', count: 8, value: 120000, color: 'bg-blue-500' },
  { name: 'Qualified', count: 5, value: 85000, color: 'bg-indigo-500' },
  { name: 'Proposal', count: 3, value: 75000, color: 'bg-purple-500' },
  { name: 'Negotiation', count: 2, value: 40000, color: 'bg-pink-500' },
];

const recentActivity = [
  { id: 1, type: 'contact', message: 'New contact added: Sarah Johnson', time: '2 min ago', icon: '👤' },
  { id: 2, type: 'deal', message: 'Deal moved to Proposal: 123 Oak Street', time: '15 min ago', icon: '💰' },
  { id: 3, type: 'email', message: 'Email campaign "Spring Listings" sent', time: '1 hour ago', icon: '📧' },
  { id: 4, type: 'property', message: 'Property listed: 456 Elm Avenue', time: '2 hours ago', icon: '🏠' },
  { id: 5, type: 'call', message: 'Call logged with Mike Chen', time: '3 hours ago', icon: '📞' },
];

const tasks = [
  { id: 1, title: 'Follow up with Sarah Johnson', due: 'Today', priority: 'high' },
  { id: 2, title: 'Schedule property showing - 789 Pine St', due: 'Tomorrow', priority: 'medium' },
  { id: 3, title: 'Review contract for Oak Street deal', due: 'Jan 8', priority: 'high' },
  { id: 4, title: 'Send weekly newsletter', due: 'Jan 10', priority: 'low' },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="h-9 px-3 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none text-gray-900 dark:text-gray-100">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
          </select>
          <button className="h-9 px-4 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
            Download Report
          </button>
        </div>
      </div>

      {/* KPI Cards Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Opportunities */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-card transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Opportunities</span>
            <span className="p-2 bg-primary-50 rounded-lg">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <p className="text-3xl font-semibold text-gray-900 dark:text-white">{stats.opportunities.total}</p>
          <div className="flex items-center gap-4 mt-3 text-sm">
            <span className="text-success-600">{stats.opportunities.open} open</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-500">{stats.opportunities.won} won</span>
            <span className="text-gray-400">|</span>
            <span className="text-danger-500">{stats.opportunities.lost} lost</span>
          </div>
        </div>

        {/* Pipeline Value */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-card transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Pipeline Value</span>
            <span className="p-2 bg-success-50 rounded-lg">
              <svg className="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </span>
          </div>
          <p className="text-3xl font-semibold text-gray-900 dark:text-white">{formatCurrency(stats.opportunities.value)}</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success-100 text-success-700">
              +12.5%
            </span>
            <span className="text-sm text-gray-500">vs last month</span>
          </div>
        </div>

        {/* Contacts */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-card transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Contacts</span>
            <span className="p-2 bg-indigo-50 rounded-lg">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </span>
          </div>
          <p className="text-3xl font-semibold text-gray-900 dark:text-white">{formatNumber(stats.contacts.total)}</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-700">
              +{stats.contacts.new} new
            </span>
            <span className="text-sm text-gray-500">this week</span>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-card transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Conversion Rate</span>
            <span className="p-2 bg-purple-50 rounded-lg">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </span>
          </div>
          <p className="text-3xl font-semibold text-gray-900 dark:text-white">{stats.conversionRate}%</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success-100 text-success-700">
              +2.1%
            </span>
            <span className="text-sm text-gray-500">vs last month</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Overview - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pipeline Overview</h2>
            <Link href="/pipelines" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View all
            </Link>
          </div>

          {/* Pipeline Stages */}
          <div className="space-y-4">
            {pipelineStages.map((stage, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-28 flex-shrink-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{stage.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{stage.count} deals</p>
                </div>
                <div className="flex-1">
                  <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <div
                      className={`h-full ${stage.color} rounded-lg transition-all duration-500`}
                      style={{ width: `${(stage.value / stats.opportunities.value) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="w-24 text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(stage.value)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pipeline Summary */}
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{formatCurrency(stats.opportunities.openValue)}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Open Pipeline</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-success-600">{formatCurrency(stats.opportunities.wonValue)}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Won (MTD)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{formatCurrency(stats.avgDealSize)}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Avg Deal Size</p>
            </div>
          </div>
        </div>

        {/* Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tasks</h2>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Add task
            </button>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 dark:bg-gray-700"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Due: {task.due}</p>
                </div>
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded ${
                    task.priority === 'high'
                      ? 'bg-danger-100 dark:bg-danger-900/30 text-danger-600 dark:text-danger-400'
                      : task.priority === 'medium'
                      ? 'bg-warning-100 dark:bg-warning-900/30 text-warning-600 dark:text-warning-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {task.priority}
                </span>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
            View all tasks
          </button>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View all
            </button>
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <span className="text-2xl">{activity.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          {/* Properties Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Properties</span>
              <Link href="/properties" className="text-sm text-primary-600 hover:text-primary-700">
                View
              </Link>
            </div>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.properties.total}</p>
            <div className="flex items-center gap-3 mt-3 text-xs">
              <span className="px-2 py-1 bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400 rounded">{stats.properties.active} Active</span>
              <span className="px-2 py-1 bg-warning-100 dark:bg-warning-900/30 text-warning-600 dark:text-warning-400 rounded">{stats.properties.pending} Pending</span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">{stats.properties.sold} Sold</span>
            </div>
          </div>

          {/* Campaigns Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Campaigns</span>
              <Link href="/campaigns" className="text-sm text-primary-600 hover:text-primary-700">
                View
              </Link>
            </div>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.campaigns.active}</p>
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Emails sent</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatNumber(stats.campaigns.emails)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Open rate</span>
                <span className="font-medium text-success-600">{stats.campaigns.openRate}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Click rate</span>
                <span className="font-medium text-gray-900 dark:text-white">{stats.campaigns.clickRate}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
