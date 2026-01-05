'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-50 px-4">
      <Card padding="xl" className="max-w-md w-full text-center">
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-red-600 mb-4">⚠️</h1>
          <h2 className="text-3xl font-bold text-primary-900 mt-4">Something went wrong!</h2>
          <p className="text-primary-600 mt-4">
            We encountered an unexpected error. Please try again.
          </p>
          {process.env.NODE_ENV === 'development' && error.message && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
              <p className="text-sm font-mono text-red-800 break-all">{error.message}</p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Button variant="primary" onClick={reset} className="w-full">
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = '/dashboard')}
            className="w-full"
          >
            Go to Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
}

