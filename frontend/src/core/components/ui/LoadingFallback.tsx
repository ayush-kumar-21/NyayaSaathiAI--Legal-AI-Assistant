import React from 'react';


interface LoadingFallbackProps {
    message?: string;
}

const LoadingFallback: React.FC<LoadingFallbackProps> = ({ message = 'Loading...' }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[200px] w-full p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
            <p className="text-slate-400 text-sm font-medium">{message}</p>
        </div>
    );
};

export default LoadingFallback;
