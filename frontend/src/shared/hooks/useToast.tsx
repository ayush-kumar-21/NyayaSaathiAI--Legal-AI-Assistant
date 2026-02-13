// src/shared/hooks/useToast.tsx
// Re-export from core ToastContext for backward compatibility
// This ensures all components use the same ToastProvider context

export { useToast, ToastProvider } from '../../core/context/ToastContext';
export type { } from '../../core/context/ToastContext';

// Re-export compatible types
export type ToastType = 'success' | 'error' | 'info' | 'loading';
