'use client';

import { useState, useEffect, useCallback } from 'react';
import { getInventory, getInventorySummary } from '@/lib/api';

export function useInventory(initialFilters = {}) {
  const [inventory, setInventory] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getInventory(filters);
      setInventory(data.items || data || []);
      const sumData = await getInventorySummary();
      setSummary(sumData);
    } catch (err) {
      console.warn('Inventory fetch error, using local fallback if needed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  return {
    inventory,
    summary,
    loading,
    error,
    filters,
    setFilters,
    refresh: fetchInventory,
  };
}
