/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Campaign } from '@/types';
import { campaignsApi } from '@/lib/api-client';

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = (await campaignsApi.getAll()) as { data: Campaign[] };
        setCampaigns(response.data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch campaigns'));
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const createCampaign = async (data: Partial<Campaign>) => {
    try {
      const newCampaign = (await campaignsApi.create(data)) as { data: Campaign };
      setCampaigns((prev) => [newCampaign.data, ...prev]);
      return newCampaign.data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create campaign'));
      throw err;
    }
  };

  const updateCampaign = async (id: string, data: Partial<Campaign>) => {
    try {
      const updated = (await campaignsApi.update(id, data)) as { data: Campaign };
      setCampaigns((prev) => prev.map((c) => (c.id === id ? updated.data : c)));
      return updated.data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update campaign'));
      throw err;
    }
  };

  const deleteCampaign = async (id: string) => {
    try {
      await campaignsApi.delete(id);
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete campaign'));
      throw err;
    }
  };

  return {
    campaigns,
    loading,
    error,
    createCampaign,
    updateCampaign,
    deleteCampaign,
  };
}

