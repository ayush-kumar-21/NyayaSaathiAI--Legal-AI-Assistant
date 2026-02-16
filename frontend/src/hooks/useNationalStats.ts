import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export interface HeatmapData {
  state: string;
  total_cases: number;
  pending_cases: number;
  sla_breaches: number;
  sla_breach_rate: number;
  intensity: number;
}

export interface NationalStats {
  total_cases: number;
  pending_cases: number;
  disposed_cases: number;
  avg_disposal_days: number;
  sla_compliance_rate: number;
  critical_districts: number;
  conviction_rate: number;
  states: HeatmapData[];
}

export function useNationalStats() {
  const [data, setData] = useState<NationalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, we would handle auth token here or in a context
    // For demo, we might need a way to set the admin token
    // api.setToken('admin-token');

    api.get<NationalStats>('/admin/analytics/national')
      .then(setData)
      .catch(e => {
          console.error(e);
          setError(e.message)
      })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
