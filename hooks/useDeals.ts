import { useState, useEffect } from 'react';
import { Deal } from '@/types';
import { dealsApi } from '@/lib/api-client';

interface UseDealsOptions {
  status?: string;
}

export function useDeals(options: UseDealsOptions = {}) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = (await dealsApi.getAll({ status: options.status })) as { data: Deal[] };
        setDeals(response.data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch deals'));
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [options.status]);

  const createDeal = async (data: any) => {
    try {
      const newDeal = await dealsApi.create(data);
      setDeals((prev) => [newDeal.data, ...prev]);
      return newDeal.data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create deal'));
      throw err;
    }
  };

  const updateDeal = async (id: string, data: any) => {
    try {
      const updated = await dealsApi.update(id, data);
      setDeals((prev) => prev.map((d) => (d.id === id ? updated.data : d)));
      return updated.data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update deal'));
      throw err;
    }
  };

  const deleteDeal = async (id: string) => {
    try {
      await dealsApi.delete(id);
      setDeals((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete deal'));
      throw err;
    }
  };

  return {
    deals,
    loading,
    error,
    createDeal,
    updateDeal,
    deleteDeal,
  };
}

