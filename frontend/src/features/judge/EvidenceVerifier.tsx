import React, { useState } from 'react';
import { useEvidenceVerify } from '../../hooks/useEvidenceVerify';
import { ShieldCheck, AlertTriangle, FileText, Loader2 } from 'lucide-react';

interface Props {
  evidenceId: string;
  fileName: string;
}

const EvidenceVerifier: React.FC<Props> = ({ evidenceId, fileName }) => {
  const { verify, result, loading, error } = useEvidenceVerify();
  const [showCertificate, setShowCertificate] = useState(false);

  return (
    <div className="mt-4 border-t pt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-slate-500" />
          <span className="font-medium text-slate-700">{fileName}</span>
        </div>

        {!result && !loading && (
          <button
            onClick={() => verify(evidenceId)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            Verify Integrity
          </button>
        )}

        {loading && (
          <div className="flex items-center gap-2 text-indigo-600 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Verifying Blockchain Hash...
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Verification Failed: {error}
        </div>
      )}

      {result && (
        <div className={`mt-4 p-4 rounded-xl border ${
          result.is_verified ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start gap-3">
            {result.is_verified ? (
              <ShieldCheck className="w-6 h-6 text-green-600 mt-1" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
            )}

            <div className="flex-1">
              <h4 className={`font-bold ${
                result.is_verified ? 'text-green-800' : 'text-red-800'
              }`}>
                {result.is_verified ? 'Evidence Integrity Verified' : 'INTEGRITY CHECK FAILED'}
              </h4>

              <div className="mt-2 space-y-1 text-sm font-mono text-slate-600">
                <div className="flex justify-between">
                  <span>Block #:</span>
                  <span>{result.block_number}</span>
                </div>
                <div className="flex justify-between">
                  <span>Stored Hash:</span>
                  <span title={result.original_hash}>{result.original_hash.substring(0, 16)}...</span>
                </div>
                {!result.is_verified && (
                  <div className="flex justify-between text-red-600 font-bold">
                    <span>Computed:</span>
                    <span title={result.current_hash}>{result.current_hash.substring(0, 16)}...</span>
                  </div>
                )}
              </div>

              {result.is_verified && (
                <button
                  onClick={() => setShowCertificate(!showCertificate)}
                  className="mt-3 text-xs text-green-700 underline hover:text-green-800"
                >
                  {showCertificate ? 'Hide Certificate' : 'View BSA Section 63 Certificate'}
                </button>
              )}
            </div>
          </div>

          {showCertificate && result.bsa_certificate && (
            <div className="mt-4 p-4 bg-white rounded border border-green-100 font-mono text-xs text-slate-600 whitespace-pre-wrap">
              {result.bsa_certificate}
              <div className="mt-4 pt-2 border-t text-center text-slate-400">
                Digitally Signed by NyayaSaathi Blockchain Authority
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EvidenceVerifier;
