import React, { createContext, useContext, useState, ReactNode } from 'react';
import toast, { Toaster, ToastPosition } from 'react-hot-toast';

interface ToastContextType {
    showToast: (message: string, type?: 'success' | 'error' | 'loading' | 'info') => string;
    updateToast: (id: string, message: string, type?: 'success' | 'error' | 'loading' | 'info') => void;
    dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const showToast = (message: string, type: 'success' | 'error' | 'loading' | 'info' = 'info') => {
        switch (type) {
            case 'success':
                return toast.success(message);
            case 'error':
                return toast.error(message);
            case 'loading':
                return toast.loading(message);
            default:
                return toast(message);
        }
    };

    const updateToast = (id: string, message: string, type: 'success' | 'error' | 'loading' | 'info' = 'info') => {
        switch (type) {
            case 'success':
                toast.success(message, { id });
                break;
            case 'error':
                toast.error(message, { id });
                break;
            case 'loading':
                toast.loading(message, { id });
                break;
            default:
                toast(message, { id });
                break;
        }
    };

    const dismissToast = (id: string) => {
        toast.dismiss(id);
    };

    return (
        <ToastContext.Provider value={{ showToast, updateToast, dismissToast }}>
            {children}
            <Toaster position="top-right" />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
