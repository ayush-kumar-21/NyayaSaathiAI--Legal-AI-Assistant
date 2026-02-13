
import React, { Suspense } from 'react';
import { useCitizenTranslation } from '../../citizen/hooks/useCitizenTranslation';
import LoadingFallback from '../../../core/components/ui/LoadingFallback';
import { ErrorBoundary } from 'react-error-boundary';
import { AlertTriangle } from 'lucide-react';

// Lazy load the existing component from features/main
const LitigantHappiness = React.lazy(() => import('../../main/components/LitigantHappiness'));

const FeedbackErrorBoundary: React.FC<any> = ({ error }) => (
    <div className="flex flex-col items-center justify-center p-8 text-center h-[50vh]">
        <AlertTriangle className="w-12 h-12 text-red-400 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Feedback System Temporarily Unavailable</h3>
        <p className="text-slate-400 max-w-md">{error.message}</p>
    </div>
);

const LitigantHappinessWrapper: React.FC = () => {
    const { t } = useCitizenTranslation();

    return (
        <div className="min-h-screen pt-4 pb-20">
            <ErrorBoundary FallbackComponent={FeedbackErrorBoundary}>
                <Suspense fallback={<LoadingFallback message="Loading Feedback System..." />}>
                    <LitigantHappiness t={t as any} />
                </Suspense>
            </ErrorBoundary>
        </div>
    );
};

export default LitigantHappinessWrapper;
