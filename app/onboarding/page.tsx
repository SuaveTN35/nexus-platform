'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

type Step = 'welcome' | 'organization' | 'profile' | 'plan' | 'complete';

const steps: { id: Step; title: string }[] = [
  { id: 'welcome', title: 'Welcome' },
  { id: 'organization', title: 'Organization' },
  { id: 'profile', title: 'Profile' },
  { id: 'plan', title: 'Choose Plan' },
  { id: 'complete', title: 'All Done!' },
];

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    description: 'Perfect for getting started',
    features: ['500 contacts', '50 properties', '2 team members', '1,000 emails/mo'],
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 79,
    description: 'For growing businesses',
    features: ['5,000 contacts', '500 properties', '5 team members', '10,000 emails/mo', 'API Access'],
    popular: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: 199,
    description: 'For established businesses',
    features: ['25,000 contacts', 'Unlimited properties', '15 team members', '50,000 emails/mo', 'Priority support'],
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [formData, setFormData] = useState({
    organizationName: '',
    industry: '',
    teamSize: '',
    firstName: '',
    lastName: '',
    phone: '',
    selectedPlan: 'professional',
  });

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const handleComplete = async () => {
    // TODO: Save onboarding data
    console.log('Onboarding complete:', formData);
    router.push('/dashboard');
  };

  const handleSkip = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Progress Bar */}
      <div className="w-full h-1 bg-gray-200 dark:bg-gray-700">
        <div
          className="h-full bg-blue-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <span className="font-semibold text-gray-900 dark:text-white">NEXUS</span>
        </div>
        <button
          onClick={handleSkip}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          Skip for now
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                      index < currentStepIndex
                        ? 'bg-green-500 text-white'
                        : index === currentStepIndex
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    }`}
                  >
                    {index < currentStepIndex ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className={`text-xs mt-2 ${
                    index <= currentStepIndex ? 'text-gray-900 dark:text-white' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-2 -mt-6 ${
                      index < currentStepIndex ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Welcome Step */}
          {currentStep === 'welcome' && (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome to NEXUS!
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Let&apos;s get you set up in just a few minutes. We&apos;ll help you configure your workspace for success.
              </p>
              <Button variant="primary" size="lg" onClick={handleNext}>
                Get Started
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </div>
          )}

          {/* Organization Step */}
          {currentStep === 'organization' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                Tell us about your organization
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
                This helps us customize your experience
              </p>
              <div className="space-y-4 max-w-md mx-auto">
                <Input
                  label="Organization Name"
                  value={formData.organizationName}
                  onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                  placeholder="Your Company Inc."
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Industry
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Select an industry</option>
                    <option value="real_estate">Real Estate</option>
                    <option value="technology">Technology</option>
                    <option value="finance">Finance</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="retail">Retail</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Team Size
                  </label>
                  <select
                    value={formData.teamSize}
                    onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Select team size</option>
                    <option value="1">Just me</option>
                    <option value="2-5">2-5 people</option>
                    <option value="6-10">6-10 people</option>
                    <option value="11-25">11-25 people</option>
                    <option value="25+">25+ people</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-between mt-8 max-w-md mx-auto">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button variant="primary" onClick={handleNext}>
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Profile Step */}
          {currentStep === 'profile' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                Complete your profile
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
                Add some personal details to your account
              </p>
              <div className="space-y-4 max-w-md mx-auto">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="John"
                  />
                  <Input
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Doe"
                  />
                </div>
                <Input
                  label="Phone Number (optional)"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="flex justify-between mt-8 max-w-md mx-auto">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button variant="primary" onClick={handleNext}>
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Plan Selection Step */}
          {currentStep === 'plan' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                Choose your plan
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
                Start with a 14-day free trial. No credit card required.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setFormData({ ...formData, selectedPlan: plan.id })}
                    className={`relative p-5 rounded-xl border-2 text-left transition-all ${
                      formData.selectedPlan === plan.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-blue-600 text-white text-xs font-medium rounded-full">
                        Most Popular
                      </span>
                    )}
                    <h3 className="font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
                    <div className="mt-2">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">${plan.price}</span>
                      <span className="text-gray-500">/mo</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{plan.description}</p>
                    <ul className="mt-4 space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button variant="primary" onClick={handleNext}>
                  Start Free Trial
                </Button>
              </div>
            </div>
          )}

          {/* Complete Step */}
          {currentStep === 'complete' && (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                You&apos;re all set!
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Your account is ready to go. Start exploring your new CRM platform.
              </p>
              <div className="space-y-3 max-w-sm mx-auto">
                <Button variant="primary" size="lg" className="w-full" onClick={handleComplete}>
                  Go to Dashboard
                </Button>
                <Button variant="outline" size="lg" className="w-full" onClick={() => router.push('/contacts')}>
                  Import Contacts
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
