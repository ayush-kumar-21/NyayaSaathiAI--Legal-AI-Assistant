import React from 'react';
import LegalTechHub from '../../main/components/LegalTechHub';
import { useLocalization, Language } from '../../main/hooks/useLocalization';
import { useAppSettings } from '../../../core/context/AppSettingsContext';
import LoadingFallback from '../../../core/components/ui/LoadingFallback';

// Local Error Boundary to catch Hub specific crashes
class HubErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; error: Error | null }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 text-center text-white bg-red-900/20 rounded-xl border border-red-500/30 m-4 flex flex-col items-center">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                        <i className="fas fa-exclamation-triangle text-2xl text-red-400"></i>
                    </div>
                    <h2 className="text-xl font-bold text-red-400 mb-2">Legal Tech Hub Error</h2>
                    <p className="text-slate-300 mb-4 max-w-md">
                        We encountered an issue loading the Legal Tech tools. This might be due to a temporary service disruption.
                    </p>
                    <div className="text-left bg-black/50 p-4 rounded-lg overflow-auto max-h-40 mb-6 font-mono text-xs text-red-300 w-full max-w-lg">
                        {this.state.error?.message}
                    </div>
                    <button
                        onClick={() => this.setState({ hasError: false, error: null })}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                    >
                        Retry Loading
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

const LegalTechHubWrapper: React.FC = () => {
    // Try to get language from settings, fallback to 'en'
    const context = useAppSettings();
    const language = (context?.language || 'en') as Language;
    const { t } = useLocalization(language);

    // Safety wrapper for translation function
    const safeT = (key: string): string => {
        try {
            return t(key);
        } catch (e) {
            return key;
        }
    };

    return (
        <HubErrorBoundary>
            <React.Suspense fallback={<LoadingFallback message="Loading Legal Tech Tools..." />}>
                <LegalTechHub t={safeT} />
            </React.Suspense>
        </HubErrorBoundary>
    );
};

export default LegalTechHubWrapper;
