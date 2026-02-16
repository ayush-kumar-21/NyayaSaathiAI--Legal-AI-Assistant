import React from 'react';
import { useBNSSDeadlines } from '../../hooks/useBNSSDeadlines';
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';

const BNSSDeadlineTimer: React.FC = () => {
  const { data, loading, error } = useBNSSDeadlines();

  if (loading) return <div>Loading Deadlines...</div>;
  if (error) return <div>Error loading deadlines</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
        <Clock className="w-5 h-5 text-blue-600" />
        BNSS Section 193 Compliance Tracker
      </h3>

      <div className="grid gap-3">
        {data.map((item) => {
          const isCritical = item.days_remaining < 10;
          const isBreached = item.days_remaining <= 0;

          return (
            <div
              key={item.case_id}
              className={`p-4 rounded-lg border flex items-center justify-between transition-all hover:shadow-md ${
                isBreached
                  ? 'bg-slate-900 border-slate-700 text-white'
                  : isCritical
                    ? 'bg-red-50 border-red-200'
                    : 'bg-white border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-sm font-bold px-2 py-0.5 rounded ${
                    isBreached ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {item.cnr}
                  </span>
                  <span className="text-xs opacity-75">{item.state}</span>
                </div>
                <div className="text-sm opacity-90">
                  Registered: {new Date(item.fir_registered_date!).toLocaleDateString()}
                </div>
              </div>

              <div className="text-right">
                <div className={`text-2xl font-bold font-mono ${
                  isBreached ? 'text-red-500' : isCritical ? 'text-red-600' : 'text-green-600'
                }`}>
                  {isBreached ? 'BREACHED' : `${item.days_remaining} Days`}
                </div>
                <div className="text-xs uppercase tracking-wider opacity-75">
                  Remaining
                </div>
              </div>

              {isBreached && (
                <div className="animate-pulse">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                </div>
              )}
            </div>
          );
        })}

        {data.length === 0 && (
          <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
            No pending investigations approaching deadline.
          </div>
        )}
      </div>
    </div>
  );
};

export default BNSSDeadlineTimer;
