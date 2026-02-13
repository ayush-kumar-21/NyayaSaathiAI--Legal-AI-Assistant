import React from 'react';
import LoadingFallback from '../../../core/components/ui/LoadingFallback';

const JusticeTimelineWrapper: React.FC = () => {
    return (
        <React.Suspense fallback={<LoadingFallback />}>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Justice Timeline</h1>
                <p>Coming Soon...</p>
            </div>
        </React.Suspense>
    );
};

export default JusticeTimelineWrapper;
