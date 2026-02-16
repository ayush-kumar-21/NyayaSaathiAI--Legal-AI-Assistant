import { useState } from 'react';
import { api } from '../lib/api';

export interface VerificationResult {
  evidence_id: string;
  original_hash: string;
  blockchain_hash: string;
  is_verified: boolean;
  block_number: number | null;
  verified_at: string;
  bsa_certificate?: string;
}

export function useEvidenceVerify() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const verify = async (evidenceId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<VerificationResult>(`/judge/evidence/${evidenceId}/verify`);
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return { verify, result, loading, error };
}
