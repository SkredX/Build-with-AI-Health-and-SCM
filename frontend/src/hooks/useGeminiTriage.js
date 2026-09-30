'use client';

import { useState } from 'react';
import { offlineTriage } from '@/lib/offlineTriage';
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
      console.error('Triage error (backend unreachable?):', err);
      // Never leave the health worker with nothing: show a basic offline estimate.
      const data = offlineTriage(payload);
      setResult(data);
      setError(err.message || 'Could not reach the server');
      return data;
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
