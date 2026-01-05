import { useState, useEffect } from 'react';
import { Contact, PaginatedResponse } from '@/types';
import { contactsApi } from '@/lib/api-client';

interface UseContactsOptions {
  page?: number;
  pageSize?: number;
  search?: string;
}

export function useContacts(options: UseContactsOptions = {}) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = (await contactsApi.getAll({
          page: options.page || 1,
          pageSize: options.pageSize || 10,
          search: options.search,
        })) as PaginatedResponse<Contact>;
        
        setContacts(response.data);
        setPagination(response.pagination);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch contacts'));
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [options.page, options.pageSize, options.search]);

  const createContact = async (data: any) => {
    try {
      const newContact = await contactsApi.create(data);
      setContacts((prev) => [newContact.data, ...prev]);
      return newContact.data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create contact'));
      throw err;
    }
  };

  const updateContact = async (id: string, data: any) => {
    try {
      const updated = await contactsApi.update(id, data);
      setContacts((prev) => prev.map((c) => (c.id === id ? updated.data : c)));
      return updated.data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update contact'));
      throw err;
    }
  };

  const deleteContact = async (id: string) => {
    try {
      await contactsApi.delete(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete contact'));
      throw err;
    }
  };

  return {
    contacts,
    loading,
    error,
    pagination,
    createContact,
    updateContact,
    deleteContact,
    refetch: () => {
      // Trigger refetch by changing a dependency
      setLoading(true);
    },
  };
}

