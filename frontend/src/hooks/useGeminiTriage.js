'use client';

import { useState } from 'react';
import { submitTriage } from '@/lib/api';

export function useGeminiTriage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const runTriage = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await submitTriage(payload);
      setResult(data);
      return data;
    } catch (err) {
      console.error('Triage error:', err);
      setError(err.message || 'Failed to process triage');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetTriage = () => {
    setResult(null);
    setError(null);
  };

  return {
    loading,
    error,
    result,
    setResult,
    runTriage,
    resetTriage,
  };
}
