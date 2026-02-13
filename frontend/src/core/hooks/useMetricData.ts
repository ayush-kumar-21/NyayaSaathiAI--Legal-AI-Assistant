/**
 * Generic Hook for all dashboard metrics
 * Replaces 24 separate API hooks
 */
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Create a configured axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export function useMetricData<T>(endpoint: string) {
    const { data, error, isLoading, refetch } = useQuery<T[]>({
        queryKey: [endpoint],
        queryFn: async () => {
            const { data } = await api.get<T[]>(endpoint);
            return data;
        },
        staleTime: 60000, // 1 min cache
        retry: 1
    });

    return { data, error, isLoading, refetch };
}

export function useSubmitData<T, R>(endpoint: string) {
    const submit = async (payload: T): Promise<R> => {
        const { data } = await api.post<R>(endpoint, payload);
        return data;
    };
    return { submit };
}
