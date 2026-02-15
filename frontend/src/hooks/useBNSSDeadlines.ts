import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export interface BNSSDeadlineCase {
  cnr: string;
  case_id: string;
  days_remaining: number;
  deadline_days: number;
  status: string;
  priority: string;
  fir_registered_date: string | null;
  state: string | null;
  district: string | null;
}

export function useBNSSDeadlines() {
  const [data, setData] = useState<BNSSDeadlineCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<BNSSDeadlineCase[]>('/admin/analytics/bnss-deadlines')
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
