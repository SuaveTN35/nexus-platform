/**
 * Core Type Definitions for AEQUALIS Platform
 */

// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'admin' | 'user' | 'viewer';

// Organization Types
export interface Organization {
  id: string;
  name: string;
  plan: PlanType;
  status: OrganizationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type PlanType = 'starter' | 'professional' | 'enterprise' | 'agency';
export type OrganizationStatus = 'active' | 'suspended' | 'canceled';

// Contact Types
export interface Contact {
  id: string;
  organizationId: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  tags: string[];
  customFields: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Deal Types
export interface Deal {
  id: string;
  organizationId: string;
  contactId: string;
  name: string;
  value: number;
  stage: string;
  probability: number;
  expectedCloseDate: Date | null;
  actualCloseDate: Date | null;
  status: DealStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type DealStatus = 'open' | 'won' | 'lost';

// Campaign Types
export interface Campaign {
  id: string;
  organizationId: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  startDate: Date | null;
  endDate: Date | null;
  settings: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export type CampaignType = 'email' | 'sms' | 'multi-channel';
export type CampaignStatus = 'draft' | 'scheduled' | 'active' | 'paused' | 'completed';

// Activity Types
export interface Activity {
  id: string;
  organizationId: string;
  contactId: string | null;
  type: ActivityType;
  subject: string;
  description: string | null;
  metadata: Record<string, any>;
  createdAt: Date;
  createdBy: string;
}

export type ActivityType = 'call' | 'email' | 'meeting' | 'note' | 'task';

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface ContactFormData {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  company?: string;
  tags?: string[];
}

export interface DealFormData {
  name: string;
  contactId: string;
  value: number;
  stage: string;
  probability: number;
  expectedCloseDate?: string;
}

// Property Types (Real Estate)
export interface Property {
  id: string;
  organizationId: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  listPrice: number;
  bedrooms: number | null;
  bathrooms: number | null;
  squareFeet: number | null;
  lotSize: number | null;
  yearBuilt: number | null;
  title: string;
  description: string | null;
  features: string[];
  photos: string[];
  virtualTourUrl: string | null;
  mlsNumber: string | null;
  listingDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type PropertyType =
  | 'SINGLE_FAMILY'
  | 'CONDO'
  | 'TOWNHOUSE'
  | 'MULTI_FAMILY'
  | 'LAND'
  | 'COMMERCIAL'
  | 'APARTMENT'
  | 'OTHER';

export type PropertyStatus =
  | 'DRAFT'
  | 'ACTIVE'
  | 'PENDING'
  | 'SOLD'
  | 'OFF_MARKET'
  | 'RENTED';

export interface PropertyFormData {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
  propertyType: PropertyType;
  status?: PropertyStatus;
  listPrice: number;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  lotSize?: number;
  yearBuilt?: number;
  title: string;
  description?: string;
  features?: string[];
  photos?: string[];
  virtualTourUrl?: string;
  mlsNumber?: string;
  listingDate?: string;
}

