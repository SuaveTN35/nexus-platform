'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-primary-200 sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-primary-900">NEXUS</div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="text-primary-700 hover:text-primary-900 transition-colors">
              Dashboard
            </Link>
            <Link href="/contacts" className="text-primary-700 hover:text-primary-900 transition-colors">
              Contacts
            </Link>
            <Link href="/campaigns" className="text-primary-700 hover:text-primary-900 transition-colors">
              Campaigns
            </Link>
            <Link href="/analytics" className="text-primary-700 hover:text-primary-900 transition-colors">
              Analytics
            </Link>
            <Button variant="primary" size="sm">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-primary-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <Link href="/dashboard" className="block text-primary-700 hover:text-primary-900">
              Dashboard
            </Link>
            <Link href="/contacts" className="block text-primary-700 hover:text-primary-900">
              Contacts
            </Link>
            <Link href="/campaigns" className="block text-primary-700 hover:text-primary-900">
              Campaigns
            </Link>
            <Link href="/analytics" className="block text-primary-700 hover:text-primary-900">
              Analytics
            </Link>
            <Button variant="primary" size="sm" className="w-full">
              Get Started
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
}

