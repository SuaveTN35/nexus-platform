'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Select, { SelectOption } from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import { Property, PropertyFormData, PropertyType, PropertyStatus } from '@/types';

/**
 * AEQUALIS Property Detail - Compass-Style Luxury Minimalist Design
 * Design System: Monochromatic (Black/White/Gray)
 * Typography: System fonts with clear hierarchy
 * Focus: Photography-first, data clarity, minimal UI chrome
 */

const propertyTypeOptions: SelectOption[] = [
  { value: 'SINGLE_FAMILY', label: 'Single Family Home' },
  { value: 'CONDO', label: 'Condominium' },
  { value: 'TOWNHOUSE', label: 'Townhouse' },
  { value: 'MULTI_FAMILY', label: 'Multi-Family' },
  { value: 'LAND', label: 'Land' },
  { value: 'COMMERCIAL', label: 'Commercial' },
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'OTHER', label: 'Other' },
];

const statusOptions: SelectOption[] = [
  { value: 'DRAFT', label: 'Coming Soon' },
  { value: 'ACTIVE', label: 'For Sale' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'SOLD', label: 'Sold' },
  { value: 'OFF_MARKET', label: 'Off Market' },
  { value: 'RENTED', label: 'For Rent' },
];

const statusLabels: Record<PropertyStatus, string> = {
  DRAFT: 'Coming Soon',
  ACTIVE: 'For Sale',
  PENDING: 'Pending',
  SOLD: 'Sold',
  OFF_MARKET: 'Off Market',
  RENTED: 'For Rent',
};

const formatPrice = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(value);
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

// High-quality property images
const propertyImages = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400&q=80',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1400&q=80',
];

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState<Partial<PropertyFormData>>({});

  useEffect(() => {
    fetchProperty();
  }, [params.id]);

  const fetchProperty = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/properties/${params.id}`);
      if (response.ok) {
        const result = await response.json();
        setProperty(result.data);
        setFormData({
          address: result.data.address,
          city: result.data.city,
          state: result.data.state,
          zipCode: result.data.zipCode,
          propertyType: result.data.propertyType,
          status: result.data.status,
          listPrice: result.data.listPrice,
          bedrooms: result.data.bedrooms,
          bathrooms: result.data.bathrooms,
          squareFeet: result.data.squareFeet,
          lotSize: result.data.lotSize,
          yearBuilt: result.data.yearBuilt,
          title: result.data.title,
          description: result.data.description,
          mlsNumber: result.data.mlsNumber,
        });
      } else if (response.status === 404) {
        router.push('/properties');
      }
    } catch (error) {
      console.error('Failed to fetch property:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/properties/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const result = await response.json();
        setProperty(result.data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to update property:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/properties/${params.id}`, { method: 'DELETE' });
      if (response.ok) {
        router.push('/properties');
      }
    } catch (error) {
      console.error('Failed to delete property:', error);
    }
  };

  // Mortgage calculation
  const calculateMortgage = (principal: number, rate = 6.5, years = 30) => {
    const monthlyRate = rate / 100 / 12;
    const numPayments = years * 12;
    const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                   (Math.pow(1 + monthlyRate, numPayments) - 1);
    return Math.round(payment);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="animate-pulse">
          <div className="h-[600px] bg-gray-200" />
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="h-8 bg-gray-200 w-48 mb-4" />
            <div className="h-6 bg-gray-200 w-96" />
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-[18px] text-gray-500 mb-6">Property not found</p>
          <button
            onClick={() => router.push('/properties')}
            className="h-10 px-6 border border-gray-300 text-[13px] font-medium hover:border-black transition-colors"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  const images = property.photos?.length ? property.photos : propertyImages;
  const monthlyPayment = calculateMortgage(property.listPrice * 0.8);
  const pricePerSqFt = property.squareFeet ? Math.round(property.listPrice / property.squareFeet) : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => router.push('/properties')}
            className="flex items-center gap-2 text-[14px] text-gray-600 hover:text-black transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to listings
          </button>
          <div className="flex items-center gap-3">
            <button className="h-9 px-4 text-[13px] text-gray-600 hover:text-black transition-colors">
              Share
            </button>
            <button className="h-9 px-4 text-[13px] text-gray-600 hover:text-black transition-colors">
              Save
            </button>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="h-9 px-4 text-[13px] bg-black text-white hover:bg-gray-900 transition-colors"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </nav>

      {isEditing ? (
        /* Edit Mode */
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-[28px] font-light text-black">Edit Listing</h1>
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="h-10 px-6 text-[13px] font-medium border border-gray-300 hover:border-black transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="h-10 px-6 text-[13px] font-medium bg-black text-white hover:bg-gray-900 disabled:opacity-50 transition-colors"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {/* Basic Info */}
            <section>
              <h2 className="text-[11px] font-medium tracking-wider uppercase text-gray-500 mb-4">
                Listing Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Input
                    label="Title"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <Input
                  label="Price"
                  type="number"
                  value={formData.listPrice || ''}
                  onChange={(e) => setFormData({ ...formData, listPrice: parseFloat(e.target.value) || 0 })}
                />
                <Select
                  label="Status"
                  options={statusOptions}
                  value={formData.status || ''}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as PropertyStatus })}
                />
                <Select
                  label="Type"
                  options={propertyTypeOptions}
                  value={formData.propertyType || ''}
                  onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as PropertyType })}
                />
                <Input
                  label="MLS Number"
                  value={formData.mlsNumber || ''}
                  onChange={(e) => setFormData({ ...formData, mlsNumber: e.target.value })}
                />
              </div>
            </section>

            {/* Address */}
            <section>
              <h2 className="text-[11px] font-medium tracking-wider uppercase text-gray-500 mb-4">
                Address
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Input
                    label="Street"
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <Input
                  label="City"
                  value={formData.city || ''}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="State"
                    value={formData.state || ''}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                  <Input
                    label="ZIP"
                    value={formData.zipCode || ''}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  />
                </div>
              </div>
            </section>

            {/* Property Details */}
            <section>
              <h2 className="text-[11px] font-medium tracking-wider uppercase text-gray-500 mb-4">
                Property Details
              </h2>
              <div className="grid grid-cols-4 gap-4">
                <Input
                  label="Beds"
                  type="number"
                  value={formData.bedrooms ?? ''}
                  onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) || undefined })}
                />
                <Input
                  label="Baths"
                  type="number"
                  step="0.5"
                  value={formData.bathrooms ?? ''}
                  onChange={(e) => setFormData({ ...formData, bathrooms: parseFloat(e.target.value) || undefined })}
                />
                <Input
                  label="Sq Ft"
                  type="number"
                  value={formData.squareFeet ?? ''}
                  onChange={(e) => setFormData({ ...formData, squareFeet: parseInt(e.target.value) || undefined })}
                />
                <Input
                  label="Year Built"
                  type="number"
                  value={formData.yearBuilt ?? ''}
                  onChange={(e) => setFormData({ ...formData, yearBuilt: parseInt(e.target.value) || undefined })}
                />
              </div>
            </section>

            {/* Description */}
            <section>
              <h2 className="text-[11px] font-medium tracking-wider uppercase text-gray-500 mb-4">
                Description
              </h2>
              <textarea
                className="w-full px-3 py-3 text-[14px] border border-gray-300 focus:border-black focus:ring-0 outline-none resize-none"
                rows={6}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </section>

            {/* Danger Zone */}
            <section className="pt-8 border-t border-gray-200">
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="text-[13px] text-red-600 hover:text-red-700 transition-colors"
              >
                Delete this listing
              </button>
            </section>
          </div>
        </div>
      ) : (
        /* View Mode */
        <>
          {/* Image Gallery */}
          <div className="relative h-[600px] bg-gray-100">
            <img
              src={images[currentImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover"
            />

            {/* Status Badge */}
            <div className="absolute top-6 left-6">
              <span className="inline-block px-4 py-2 bg-white text-[12px] font-medium tracking-wider uppercase text-black">
                {statusLabels[property.status]}
              </span>
            </div>

            {/* Image Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex((i) => (i === 0 ? images.length - 1 : i - 1))}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentImageIndex((i) => (i === images.length - 1 ? 0 : i + 1))}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Photo Count */}
            <div className="absolute bottom-6 right-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-black/70 text-white text-[12px]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {currentImageIndex + 1} / {images.length}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="grid grid-cols-3 gap-16">
              {/* Main Content */}
              <div className="col-span-2">
                {/* Header */}
                <header className="mb-12">
                  <p className="text-[42px] font-light text-black tracking-tight">
                    {formatPrice(property.listPrice)}
                  </p>
                  <div className="flex items-center gap-3 mt-3 text-[16px] text-gray-600">
                    {property.bedrooms !== null && <span>{property.bedrooms} beds</span>}
                    {property.bathrooms !== null && (
                      <>
                        <span className="text-gray-300">|</span>
                        <span>{property.bathrooms} baths</span>
                      </>
                    )}
                    {property.squareFeet !== null && (
                      <>
                        <span className="text-gray-300">|</span>
                        <span>{property.squareFeet.toLocaleString()} sqft</span>
                      </>
                    )}
                  </div>
                  <p className="text-[16px] text-black mt-4">
                    {property.address}
                  </p>
                  <p className="text-[16px] text-gray-500">
                    {property.city}, {property.state} {property.zipCode}
                  </p>
                </header>

                {/* Description */}
                {property.description && (
                  <section className="mb-12">
                    <h2 className="text-[11px] font-medium tracking-wider uppercase text-gray-500 mb-4">
                      About this home
                    </h2>
                    <p className="text-[15px] text-gray-700 leading-relaxed whitespace-pre-line">
                      {property.description}
                    </p>
                  </section>
                )}

                {/* Property Facts */}
                <section className="mb-12">
                  <h2 className="text-[11px] font-medium tracking-wider uppercase text-gray-500 mb-4">
                    Property facts
                  </h2>
                  <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-[14px] text-gray-500">Property type</span>
                      <span className="text-[14px] text-black">{propertyTypeOptions.find(o => o.value === property.propertyType)?.label}</span>
                    </div>
                    {property.yearBuilt && (
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-[14px] text-gray-500">Year built</span>
                        <span className="text-[14px] text-black">{property.yearBuilt}</span>
                      </div>
                    )}
                    {property.squareFeet && (
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-[14px] text-gray-500">Living area</span>
                        <span className="text-[14px] text-black">{property.squareFeet.toLocaleString()} sqft</span>
                      </div>
                    )}
                    {property.lotSize && (
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-[14px] text-gray-500">Lot size</span>
                        <span className="text-[14px] text-black">{property.lotSize.toLocaleString()} sqft</span>
                      </div>
                    )}
                    {pricePerSqFt && (
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-[14px] text-gray-500">Price per sqft</span>
                        <span className="text-[14px] text-black">{formatPrice(pricePerSqFt)}</span>
                      </div>
                    )}
                    {property.mlsNumber && (
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-[14px] text-gray-500">MLS®</span>
                        <span className="text-[14px] text-black font-mono">{property.mlsNumber}</span>
                      </div>
                    )}
                  </div>
                </section>

                {/* Features */}
                {property.features && property.features.length > 0 && (
                  <section className="mb-12">
                    <h2 className="text-[11px] font-medium tracking-wider uppercase text-gray-500 mb-4">
                      Features
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                      {property.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[14px] text-gray-700">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Contact Card */}
                <div className="border border-gray-200 p-6">
                  <p className="text-[13px] text-gray-500 mb-4">Interested in this property?</p>
                  <button className="w-full h-12 bg-black text-white text-[13px] font-medium tracking-wide uppercase hover:bg-gray-900 transition-colors mb-3">
                    Request a Tour
                  </button>
                  <button className="w-full h-12 border border-gray-300 text-[13px] font-medium tracking-wide uppercase hover:border-black transition-colors">
                    Contact Agent
                  </button>
                </div>

                {/* Mortgage Calculator */}
                <div className="border border-gray-200 p-6">
                  <h3 className="text-[11px] font-medium tracking-wider uppercase text-gray-500 mb-4">
                    Payment calculator
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-[14px]">
                      <span className="text-gray-500">Home price</span>
                      <span className="text-black">{formatPrice(property.listPrice)}</span>
                    </div>
                    <div className="flex justify-between text-[14px]">
                      <span className="text-gray-500">Down payment (20%)</span>
                      <span className="text-black">{formatPrice(property.listPrice * 0.2)}</span>
                    </div>
                    <div className="flex justify-between text-[14px]">
                      <span className="text-gray-500">Loan amount</span>
                      <span className="text-black">{formatPrice(property.listPrice * 0.8)}</span>
                    </div>
                    <div className="flex justify-between text-[14px]">
                      <span className="text-gray-500">Interest rate</span>
                      <span className="text-black">6.5%</span>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex justify-between">
                        <span className="text-[14px] text-gray-500">Est. monthly</span>
                        <span className="text-[20px] font-medium text-black">{formatPrice(monthlyPayment)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Listing Details */}
                <div className="border border-gray-200 p-6">
                  <h3 className="text-[11px] font-medium tracking-wider uppercase text-gray-500 mb-4">
                    Listing details
                  </h3>
                  <div className="space-y-3 text-[14px]">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Listed</span>
                      <span className="text-black">{formatDate(new Date(property.createdAt))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Updated</span>
                      <span className="text-black">{formatDate(new Date(property.updatedAt))}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Listing"
        size="sm"
        footer={
          <>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="h-10 px-6 text-[13px] font-medium border border-gray-300 hover:border-black transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="h-10 px-6 text-[13px] font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </>
        }
      >
        <p className="text-[14px] text-gray-600 py-4">
          Are you sure you want to delete &quot;{property?.title}&quot;? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
