import { useState, useEffect } from 'react';
import { caseService } from '../services/caseService';
import { Case } from '../types/index';

export const useCases = (role: 'citizen' | 'police' | 'judge') => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCases = async () => {
    try {
      setLoading(true);
      let data;
      if (role === 'citizen') {
        data = await caseService.getMyCases();
      } else if (role === 'police') {
        data = await caseService.getAssignedCases(); // Police see assigned
      } else {
        data = await caseService.getAllCases(); // Judges see all relevant
      }
      setCases(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch cases');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [role]);

  return { cases, loading, error, refresh: fetchCases };
};
