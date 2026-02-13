import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

const OfflineIndicator: React.FC = () => {
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!isOffline) return null;

    return (
        <div className="fixed bottom-4 left-4 z-50 bg-neutral-900 border border-red-500 text-red-500 px-4 py-2 rounded-lg shadow-2xl flex items-center gap-2 animate-bounce">
            <WifiOff className="w-5 h-5" />
            <span className="font-bold text-sm">You are offline. Accessing cached mode.</span>
        </div>
    );
};

export default OfflineIndicator;
