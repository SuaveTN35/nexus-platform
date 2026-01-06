'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  maxContacts: number;
  maxProperties: number;
  maxTeamMembers: number;
  maxCampaignsPerMonth: number;
  maxEmailsPerMonth: number;
  hasApiAccess: boolean;
  hasAdvancedAnalytics: boolean;
  hasPrioritySupport: boolean;
  hasCustomIntegrations: boolean;
  hasWhiteLabeling: boolean;
}

interface Subscription {
  id: string;
  status: string;
  billingCycle: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEndsAt: string | null;
  cancelAtPeriodEnd: boolean;
  plan: Plan;
}

interface Usage {
  contactsCount: number;
  propertiesCount: number;
  campaignsSent: number;
  emailsSent: number;
  teamMembersCount: number;
}

interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: string;
  invoiceDate: string;
  invoiceUrl: string | null;
}

const statusColors: Record<string, string> = {
  TRIALING: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  ACTIVE: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  PAST_DUE: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  CANCELED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  UNPAID: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  PAUSED: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400',
};

const statusLabels: Record<string, string> = {
  TRIALING: 'Trial',
  ACTIVE: 'Active',
  PAST_DUE: 'Past Due',
  CANCELED: 'Canceled',
  UNPAID: 'Unpaid',
  PAUSED: 'Paused',
};

export default function BillingPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      const res = await fetch('/api/billing');
      if (res.ok) {
        const data = await res.json();
        setSubscription(data.subscription);
        setPlans(data.plans);
        setUsage(data.usage);
        setInvoices(data.invoices);
        if (data.subscription?.billingCycle) {
          setBillingCycle(data.subscription.billingCycle);
        }
      }
    } catch (error) {
      console.error('Failed to fetch billing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePlan = async (planId: string) => {
    try {
      const res = await fetch('/api/billing/change-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, billingCycle }),
      });
      if (res.ok) {
        await fetchBillingData();
        setShowPlanModal(false);
      }
    } catch (error) {
      console.error('Failed to change plan:', error);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will lose access at the end of your billing period.')) {
      return;
    }
    try {
      const res = await fetch('/api/billing/cancel', { method: 'POST' });
      if (res.ok) {
        await fetchBillingData();
      }
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
    }
  };

  const getUsagePercentage = (current: number, max: number) => {
    if (max >= 999999) return 0; // Unlimited
    return Math.min((current / max) * 100, 100);
  };

  const formatLimit = (value: number) => {
    if (value >= 999999) return 'Unlimited';
    return value.toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Billing & Subscription</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your subscription, usage, and payment methods</p>
      </div>

      <div className="space-y-6">
        {/* Current Plan */}
        <Card padding="lg">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Current Plan</h2>
              {subscription ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {subscription.plan.name}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[subscription.status]}`}>
                      {statusLabels[subscription.status]}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {formatCurrency(
                      subscription.billingCycle === 'YEARLY'
                        ? subscription.plan.yearlyPrice
                        : subscription.plan.monthlyPrice
                    )}
                    /{subscription.billingCycle === 'YEARLY' ? 'year' : 'month'}
                  </p>
                  {subscription.trialEndsAt && subscription.status === 'TRIALING' && (
                    <p className="text-sm text-purple-600 dark:text-purple-400">
                      Trial ends {new Date(subscription.trialEndsAt).toLocaleDateString()}
                    </p>
                  )}
                  {subscription.cancelAtPeriodEnd && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Cancels on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Current period: {new Date(subscription.currentPeriodStart).toLocaleDateString()} - {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">No active subscription</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="primary" onClick={() => setShowPlanModal(true)}>
                {subscription ? 'Change Plan' : 'Subscribe'}
              </Button>
              {subscription && !subscription.cancelAtPeriodEnd && (
                <Button variant="outline" onClick={handleCancelSubscription}>
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Usage */}
        {subscription && usage && (
          <Card padding="lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Usage This Period</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Contacts */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Contacts</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {usage.contactsCount.toLocaleString()} / {formatLimit(subscription.plan.maxContacts)}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      getUsagePercentage(usage.contactsCount, subscription.plan.maxContacts) > 90
                        ? 'bg-red-500'
                        : getUsagePercentage(usage.contactsCount, subscription.plan.maxContacts) > 75
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                    }`}
                    style={{ width: `${getUsagePercentage(usage.contactsCount, subscription.plan.maxContacts)}%` }}
                  />
                </div>
              </div>

              {/* Properties */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Properties</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {usage.propertiesCount.toLocaleString()} / {formatLimit(subscription.plan.maxProperties)}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      getUsagePercentage(usage.propertiesCount, subscription.plan.maxProperties) > 90
                        ? 'bg-red-500'
                        : getUsagePercentage(usage.propertiesCount, subscription.plan.maxProperties) > 75
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                    }`}
                    style={{ width: `${getUsagePercentage(usage.propertiesCount, subscription.plan.maxProperties)}%` }}
                  />
                </div>
              </div>

              {/* Team Members */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Team Members</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {usage.teamMembersCount.toLocaleString()} / {formatLimit(subscription.plan.maxTeamMembers)}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      getUsagePercentage(usage.teamMembersCount, subscription.plan.maxTeamMembers) > 90
                        ? 'bg-red-500'
                        : getUsagePercentage(usage.teamMembersCount, subscription.plan.maxTeamMembers) > 75
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                    }`}
                    style={{ width: `${getUsagePercentage(usage.teamMembersCount, subscription.plan.maxTeamMembers)}%` }}
                  />
                </div>
              </div>

              {/* Campaigns */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Campaigns (this month)</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {usage.campaignsSent.toLocaleString()} / {formatLimit(subscription.plan.maxCampaignsPerMonth)}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      getUsagePercentage(usage.campaignsSent, subscription.plan.maxCampaignsPerMonth) > 90
                        ? 'bg-red-500'
                        : getUsagePercentage(usage.campaignsSent, subscription.plan.maxCampaignsPerMonth) > 75
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                    }`}
                    style={{ width: `${getUsagePercentage(usage.campaignsSent, subscription.plan.maxCampaignsPerMonth)}%` }}
                  />
                </div>
              </div>

              {/* Emails */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Emails Sent (this month)</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {usage.emailsSent.toLocaleString()} / {formatLimit(subscription.plan.maxEmailsPerMonth)}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      getUsagePercentage(usage.emailsSent, subscription.plan.maxEmailsPerMonth) > 90
                        ? 'bg-red-500'
                        : getUsagePercentage(usage.emailsSent, subscription.plan.maxEmailsPerMonth) > 75
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                    }`}
                    style={{ width: `${getUsagePercentage(usage.emailsSent, subscription.plan.maxEmailsPerMonth)}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Plan Features */}
        {subscription && (
          <Card padding="lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Plan Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <FeatureItem
                label="API Access"
                enabled={subscription.plan.hasApiAccess}
              />
              <FeatureItem
                label="Advanced Analytics"
                enabled={subscription.plan.hasAdvancedAnalytics}
              />
              <FeatureItem
                label="Priority Support"
                enabled={subscription.plan.hasPrioritySupport}
              />
              <FeatureItem
                label="Custom Integrations"
                enabled={subscription.plan.hasCustomIntegrations}
              />
              <FeatureItem
                label="White Labeling"
                enabled={subscription.plan.hasWhiteLabeling}
              />
            </div>
          </Card>
        )}

        {/* Payment Method */}
        <Card padding="lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Payment Method</h2>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">VISA</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Visa ending in 4242</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Expires 12/2026</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Update
            </Button>
          </div>
        </Card>

        {/* Billing History */}
        <Card padding="lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Billing History</h2>
          {invoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                    <th className="pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Date</th>
                    <th className="pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Amount</th>
                    <th className="pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Status</th>
                    <th className="pb-3 text-sm font-medium text-gray-600 dark:text-gray-400"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="py-4 text-gray-900 dark:text-white">
                        {new Date(invoice.invoiceDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 text-gray-900 dark:text-white">
                        {formatCurrency(invoice.amount)}
                      </td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          invoice.status === 'PAID'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        {invoice.invoiceUrl && (
                          <a
                            href={invoice.invoiceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm"
                          >
                            Download
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">
              No invoices yet
            </p>
          )}
        </Card>
      </div>

      {/* Plan Selection Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Choose a Plan</h2>
                <button
                  onClick={() => setShowPlanModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center justify-center gap-4 mt-4">
                <span className={`text-sm ${billingCycle === 'MONTHLY' ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500'}`}>
                  Monthly
                </span>
                <button
                  onClick={() => setBillingCycle(billingCycle === 'MONTHLY' ? 'YEARLY' : 'MONTHLY')}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    billingCycle === 'YEARLY' ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                      billingCycle === 'YEARLY' ? 'translate-x-7' : ''
                    }`}
                  />
                </button>
                <span className={`text-sm ${billingCycle === 'YEARLY' ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500'}`}>
                  Yearly <span className="text-green-600 dark:text-green-400">(Save 20%)</span>
                </span>
              </div>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`rounded-xl border-2 p-5 transition-all ${
                    subscription?.plan.id === plan.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(billingCycle === 'YEARLY' ? plan.yearlyPrice / 12 : plan.monthlyPrice)}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">/mo</span>
                    {billingCycle === 'YEARLY' && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Billed annually ({formatCurrency(plan.yearlyPrice)})
                      </p>
                    )}
                  </div>
                  <ul className="mt-4 space-y-2 text-sm">
                    <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <CheckIcon /> {formatLimit(plan.maxContacts)} contacts
                    </li>
                    <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <CheckIcon /> {formatLimit(plan.maxProperties)} properties
                    </li>
                    <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <CheckIcon /> {formatLimit(plan.maxTeamMembers)} team members
                    </li>
                    <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <CheckIcon /> {formatLimit(plan.maxEmailsPerMonth)} emails/mo
                    </li>
                  </ul>
                  <Button
                    variant={subscription?.plan.id === plan.id ? 'outline' : 'primary'}
                    className="w-full mt-4"
                    onClick={() => handleChangePlan(plan.id)}
                    disabled={subscription?.plan.id === plan.id}
                  >
                    {subscription?.plan.id === plan.id ? 'Current Plan' : 'Select Plan'}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FeatureItem({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {enabled ? (
        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      <span className={enabled ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}>
        {label}
      </span>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}
