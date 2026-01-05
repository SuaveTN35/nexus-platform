/**
 * Platform Constants
 * Core configuration and constants for the NEXUS platform
 */

export const PLATFORM_CONFIG = {
  name: 'NEXUS Platform',
  tagline: 'AI-Native Business Intelligence',
  version: '0.1.0',
  description: 'Next-generation all-in-one business management platform',
};

export const PLATFORM_FEATURES = {
  aiNative: true,
  predictiveIntelligence: true,
  autonomousOperations: true,
  industryModules: true,
  realTimeAnalytics: true,
} as const;

export const SUPPORTED_INDUSTRIES = [
  'real-estate',
  'service-business',
  'marketing-agency',
  'sales',
] as const;

export type Industry = (typeof SUPPORTED_INDUSTRIES)[number];

