// src/core/services/api.ts
import axios from 'axios';
import {
    CaseListing,
    OptimizedSchedule,
    OptimizationRequest,
    ListingCreate,
    ListingUpdate
} from '../types/listing';
import {
    ScrutinyRequest,
    ScrutinyResponse,
    FeeCalculationRequest,
    FeeCalculationResponse
} from '../types/registry';

// Create axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token if needed
api.interceptors.request.use((config: any) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const adminApi = {
    // ===== Skill 19: Registry Automator =====
    registry: {
        scrutinize: (documentUrl: string) =>
            api.post<ScrutinyResponse>('/admin/registry/scrutiny', null, {
                params: { document_url: documentUrl }
            }),

        calculateFees: (data: FeeCalculationRequest) =>
            api.post<FeeCalculationResponse>('/admin/registry/calculate-fees', data),

        test: () =>
            api.post<ScrutinyResponse>('/admin/registry/test-scrutiny'),
    },

    // ===== Skill 20: Listing Optimizer =====
    listing: {
        getCauseList: (courtId: string) =>
            api.get<CaseListing[]>(`/admin/listing/court/${courtId}/pending-cases`),

        optimize: (cases: CaseListing[]) =>
            api.post<OptimizedSchedule>('/admin/listing/optimize', {
                court_id: 'COURT-01',
                judge_id: 'JUDGE-01',
                date: new Date().toISOString().split('T')[0],
                cases: cases,
                max_daily_minutes: 330
            }),

        optimizeSchedule: (data: OptimizationRequest) =>
            api.post<OptimizedSchedule>('/admin/listing/optimize', data),

        test: () =>
            api.post<OptimizedSchedule>('/admin/listing/test-optimize', null, {
                params: { court_id: 'COURT-01' }
            }),

        getAll: () =>
            api.get('/admin/listing/listings/'),

        getById: (id: string) =>
            api.get(`/admin/listing/listings/${id}`),

        create: (data: ListingCreate) =>
            api.post('/admin/listing/listings/', data),

        update: (id: string, data: ListingUpdate) =>
            api.put(`/admin/listing/listings/${id}`, data),

        delete: (id: string) =>
            api.delete(`/admin/listing/listings/${id}`),
    }
};

export const judgeApi = {
    // ===== Skill 18: Case Intake Triage =====
    triage: {
        analyze: (data: any) => api.post('/judge/triage/analyze', data),
        test: () => api.post('/judge/triage/test-analyze'),
    },
    // ===== Skill 21: Judgment Validator =====
    judgment: {
        validate: (data: any) => api.post('/judge/judgment/validate', data),
        test: () => api.post('/judge/judgment/test-validate'),
    },
};

export const citizenApi = {
    // ===== Authentication =====
    auth: {
        google: (token: string) => api.post('/auth/google', { token }),
        login: (data: any) => api.post('/auth/login', data),
        signup: (data: any) => api.post('/auth/signup', data),
    },
    // ===== Skill 22: Know Your Rights =====
    rights: {
        query: (data: any) => api.post('/citizen/rights/query', data),
        test: () => api.post('/citizen/rights/test-query'),
    },
    // ===== Skill 23: Case Status Tracker =====
    caseStatus: {
        track: (data: any) => api.post('/citizen/case-status/track', data),
        test: () => api.post('/citizen/case-status/test-track'),
    },
    legalAid: {
        find: (data: any) => api.post('/citizen/legal-aid/find', data),
        test: () => api.post('/citizen/legal-aid/test-find'),
    },
    // ===== Feedback System =====
    feedback: {
        submit: (data: { nps_score: number; comment: string }) => api.post('/citizen/feedback/', data),
        getStats: () => api.get('/citizen/feedback/stats'),
    }
};

export default api;
