'use client';

import { useState } from 'react';

const faqs = [
  {
    question: 'How does the 14-day free trial work?',
    answer: 'Start your trial with full access to all Professional features. No credit card required. At the end of 14 days, choose a plan that fits your needs or continue with our free tier.',
  },
  {
    question: 'Can I import my existing data?',
    answer: 'Absolutely! We support imports from all major CRMs including Salesforce, HubSpot, Pipedrive, and more. Our team will help you migrate your data at no extra cost.',
  },
  {
    question: 'What kind of support do you offer?',
    answer: 'All plans include email support. Professional and above get priority support with response times under 4 hours. Business and Enterprise plans include dedicated account managers and 24/7 phone support.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Security is our top priority. We use bank-level encryption (AES-256), are SOC 2 Type II certified, and GDPR compliant. Your data is backed up hourly and stored in secure, geo-redundant data centers.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes, you can cancel your subscription at any time. If you cancel, you\'ll retain access until the end of your billing period. We also offer a 30-day money-back guarantee for annual plans.',
  },
  {
    question: 'Do you offer discounts for nonprofits or startups?',
    answer: 'Yes! We offer 50% off for verified nonprofits and early-stage startups (under $1M in funding). Contact our sales team to learn more about our special programs.',
  },
  {
    question: 'What integrations are available?',
    answer: 'We integrate with 100+ tools including Zapier, Slack, Google Workspace, Microsoft 365, Stripe, QuickBooks, and many more. Our open API also allows custom integrations.',
  },
  {
    question: 'How does the AI actually work?',
    answer: 'Our AI is built into every feature, not bolted on. It analyzes your data to score leads, predict deal outcomes, optimize send times, and automate routine tasks. The more you use AEQUALIS, the smarter it gets.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">FAQ</span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Can&apos;t find what you&apos;re looking for?{' '}
            <a href="/contact" className="text-blue-600 hover:text-blue-700 font-medium">
              Contact our team
            </a>
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
