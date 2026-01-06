'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import SearchInput from '@/components/ui/SearchInput';

interface HelpArticle {
  id: string;
  title: string;
  description: string;
  category: string;
}

interface FAQ {
  question: string;
  answer: string;
}

const helpCategories = [
  { id: 'getting-started', name: 'Getting Started', icon: '🚀', count: 12 },
  { id: 'contacts', name: 'Contacts & CRM', icon: '👥', count: 18 },
  { id: 'deals', name: 'Deals & Pipeline', icon: '💰', count: 15 },
  { id: 'campaigns', name: 'Campaigns', icon: '📣', count: 10 },
  { id: 'automation', name: 'Automation', icon: '⚡', count: 8 },
  { id: 'integrations', name: 'Integrations', icon: '🔗', count: 14 },
];

const popularArticles: HelpArticle[] = [
  { id: '1', title: 'How to import contacts from CSV', description: 'Learn how to bulk import contacts using CSV files', category: 'Contacts & CRM' },
  { id: '2', title: 'Setting up your first pipeline', description: 'Create and customize deal pipelines for your sales process', category: 'Deals & Pipeline' },
  { id: '3', title: 'Creating email campaigns', description: 'Build and send effective email marketing campaigns', category: 'Campaigns' },
  { id: '4', title: 'Automation workflow basics', description: 'Automate repetitive tasks with workflow triggers and actions', category: 'Automation' },
];

const faqs: FAQ[] = [
  { question: 'How do I reset my password?', answer: 'Go to Settings > Security > Change Password. You can also use the "Forgot Password" link on the login page.' },
  { question: 'Can I export my data?', answer: 'Yes! Go to Settings > Data Management > Export Data. You can export contacts, deals, and campaigns in CSV or JSON format.' },
  { question: 'How do I connect my email account?', answer: 'Navigate to Settings > Integrations > Email. We support Gmail, Outlook, and custom SMTP configurations.' },
  { question: 'What are the API rate limits?', answer: 'The API allows 1000 requests per hour for standard plans and 10,000 requests per hour for enterprise plans.' },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">How can we help you?</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Search our knowledge base or browse categories below</p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto mb-12">
        <SearchInput
          placeholder="Search for help articles..."
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
          className="w-full"
        />
      </div>

      {/* Categories */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {helpCategories.map((category) => (
            <Card key={category.id} padding="lg" className="cursor-pointer hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{category.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{category.count} articles</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Popular Articles */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Popular Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {popularArticles.map((article) => (
            <Card key={article.id} padding="lg" className="cursor-pointer hover:shadow-lg transition-shadow">
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase">{article.category}</span>
              <h3 className="font-semibold text-gray-900 dark:text-white mt-2">{article.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{article.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
        <Card padding="none">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {faqs.map((faq, index) => (
              <div key={index} className="px-6 py-4">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <span className="font-medium text-gray-900 dark:text-white">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${expandedFaq === index ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedFaq === index && (
                  <p className="mt-3 text-gray-600 dark:text-gray-400">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Contact Support */}
      <Card padding="lg" className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Still need help?</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Our support team is here to assist you</p>
        <div className="flex justify-center gap-4">
          <Button variant="outline">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email Support
          </Button>
          <Button variant="primary">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Live Chat
          </Button>
        </div>
      </Card>
    </div>
  );
}
