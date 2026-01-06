'use client';

import { useState } from 'react';
import Link from 'next/link';

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for small teams getting started',
    monthlyPrice: 29,
    yearlyPrice: 290,
    features: [
      '500 contacts',
      '50 properties',
      '2 team members',
      '3 campaigns/month',
      '1,000 emails/month',
      'Basic analytics',
      'Email support',
    ],
    notIncluded: ['API access', 'Priority support', 'Custom integrations'],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Professional',
    description: 'For growing businesses that need more power',
    monthlyPrice: 79,
    yearlyPrice: 790,
    features: [
      '5,000 contacts',
      '500 properties',
      '5 team members',
      '20 campaigns/month',
      '10,000 emails/month',
      'Advanced analytics',
      'Priority support',
      'API access',
    ],
    notIncluded: ['Custom integrations'],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Business',
    description: 'For teams that want unlimited potential',
    monthlyPrice: 199,
    yearlyPrice: 1990,
    features: [
      '25,000 contacts',
      'Unlimited properties',
      '15 team members',
      'Unlimited campaigns',
      '50,000 emails/month',
      'Advanced analytics',
      'Dedicated support',
      'API access',
      'Custom integrations',
    ],
    notIncluded: [],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Enterprise',
    description: 'For large organizations with custom needs',
    monthlyPrice: null,
    yearlyPrice: null,
    features: [
      'Unlimited contacts',
      'Unlimited properties',
      'Unlimited team members',
      'Unlimited campaigns',
      'Unlimited emails',
      'Custom analytics',
      '24/7 dedicated support',
      'Full API access',
      'Custom integrations',
      'SSO & advanced security',
      'Custom contracts',
    ],
    notIncluded: [],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Pricing</span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Start free for 14 days. No credit card required. Cancel anytime.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-sm font-medium ${!isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isYearly ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isYearly ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
            Yearly
            <span className="ml-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Save 20%
            </span>
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? 'bg-gradient-to-b from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-500/25 scale-105 z-10'
                  : 'bg-white border border-gray-200 shadow-sm'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 text-xs font-bold rounded-full shadow-lg">
                  MOST POPULAR
                </span>
              )}

              <h3 className={`text-xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                {plan.name}
              </h3>
              <p className={`mt-2 text-sm ${plan.popular ? 'text-blue-100' : 'text-gray-500'}`}>
                {plan.description}
              </p>

              <div className="mt-6 mb-8">
                {plan.monthlyPrice !== null ? (
                  <>
                    <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                      ${isYearly ? Math.round(plan.yearlyPrice! / 12) : plan.monthlyPrice}
                    </span>
                    <span className={`text-sm ${plan.popular ? 'text-blue-100' : 'text-gray-500'}`}>
                      /month
                    </span>
                    {isYearly && (
                      <p className={`text-sm mt-1 ${plan.popular ? 'text-blue-100' : 'text-gray-500'}`}>
                        Billed ${plan.yearlyPrice}/year
                      </p>
                    )}
                  </>
                ) : (
                  <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                    Custom
                  </span>
                )}
              </div>

              <Link
                href={plan.cta === 'Contact Sales' ? '/contact' : '/auth/register'}
                className={`block w-full py-3 px-4 text-center font-semibold rounded-xl transition-all ${
                  plan.popular
                    ? 'bg-white text-blue-600 hover:bg-blue-50'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {plan.cta}
              </Link>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <svg
                      className={`w-5 h-5 flex-shrink-0 ${plan.popular ? 'text-blue-200' : 'text-green-500'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className={`text-sm ${plan.popular ? 'text-blue-100' : 'text-gray-600'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
                {plan.notIncluded.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 opacity-50">
                    <svg
                      className={`w-5 h-5 flex-shrink-0 ${plan.popular ? 'text-blue-300' : 'text-gray-400'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className={`text-sm ${plan.popular ? 'text-blue-200' : 'text-gray-400'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
