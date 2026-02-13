import React, { useState } from 'react';
import { useAuth } from '../../../core/auth/AuthContext';
import { useLocalization, Language } from '../../../features/main/hooks/useLocalization';
import { ChatMessage } from '../../../features/main/types';
import Nyayabot from '../../../features/main/components/Nyayabot';
import LoadingFallback from '../../../core/components/ui/LoadingFallback';

// Local Error Boundary to catch NyayaBot specific crashes
class BotErrorBoundary extends React.Component<
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
                <div className="p-8 text-center text-white bg-red-900/20 rounded-xl border border-red-500/30 m-4">
                    <h2 className="text-xl font-bold text-red-400 mb-2"><i className="fas fa-bug mr-2"></i>NyayaBot Encountered an Error</h2>
                    <p className="text-slate-300 mb-4">The AI assistant could not be loaded.</p>
                    <div className="text-left bg-black/50 p-4 rounded-lg overflow-auto max-h-60 mb-4 font-mono text-xs text-red-300">
                        {this.state.error?.message}
                        <br />
                        {this.state.error?.stack}
                    </div>
                    <button
                        onClick={() => this.setState({ hasError: false, error: null })}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

const NyayaBotWrapper: React.FC = () => {
    const { user } = useAuth();
    const [language] = useState<Language>('en');
    const { t } = useLocalization(language);

    // Safety check for localization
    const safeT = (key: string) => {
        try {
            return t(key);
        } catch (e) {
            return key;
        }
    };

    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', content: safeT('nyayabot_welcome') || "Hello! I'm NyayaBot." }
    ]);

    if (!user) return <LoadingFallback message="Authenticating..." />;

    return (
        <div className="h-[calc(100vh-120px)]">
            <BotErrorBoundary>
                <React.Suspense fallback={<LoadingFallback message="Initializing AI..." />}>
                    <Nyayabot
                        t={safeT}
                        messages={messages}
                        setMessages={setMessages}
                        currentUser={{
                            email: (user?.id || 'guest') + '@nyaya.gov.in',
                            name: user?.name || 'Guest',
                            role: user?.role || 'CITIZEN'
                        }}
                    />
                </React.Suspense>
            </BotErrorBoundary>
        </div>
    );
};

export default NyayaBotWrapper;
