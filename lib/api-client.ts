/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * API Client for NEXUS Platform
 * Centralized API request handling
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // TODO: Add authentication token
  // const token = getAuthToken();
  // if (token) {
  //   config.headers = {
  //     ...config.headers,
  //     Authorization: `Bearer ${token}`,
  //   };
  // }

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || 'An error occurred',
      response.status,
      errorData
    );
  }

  return response.json();
}

// Contacts API
export const contactsApi = {
  getAll: (params?: { page?: number; pageSize?: number; search?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.pageSize) queryParams.set('pageSize', params.pageSize.toString());
    if (params?.search) queryParams.set('search', params.search);
    
    const query = queryParams.toString();
    return request(`/contacts${query ? `?${query}` : ''}`);
  },
  
  getById: (id: string) => request(`/contacts/${id}`),
  
  create: (data: any) =>
    request('/contacts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: string, data: any) =>
    request(`/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) =>
    request(`/contacts/${id}`, {
      method: 'DELETE',
    }),
};

// Campaigns API
export const campaignsApi = {
  getAll: () => request('/campaigns'),
  getById: (id: string) => request(`/campaigns/${id}`),
  create: (data: any) =>
    request('/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    request(`/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request(`/campaigns/${id}`, {
      method: 'DELETE',
    }),
};

// Deals API
export const dealsApi = {
  getAll: (params?: { status?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.set('status', params.status);
    const query = queryParams.toString();
    return request(`/deals${query ? `?${query}` : ''}`);
  },
  getById: (id: string) => request(`/deals/${id}`),
  create: (data: any) =>
    request('/deals', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    request(`/deals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request(`/deals/${id}`, {
      method: 'DELETE',
    }),
};

