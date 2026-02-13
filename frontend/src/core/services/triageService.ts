// Service for Case Intake Triage - Skill 18
import api from './api';
import { TriageRequest, TriageResult } from '../types/triage';

export const triageService = {
    analyze: (data: TriageRequest) =>
        api.post<TriageResult>('/judge/triage/analyze', data),

    testAnalyze: () =>
        api.post<TriageResult>('/judge/triage/test-analyze'),
};

export const getUrgencyColor = (level: string): string => {
    const colors: Record<string, string> = {
        critical: '#ef4444',
        high: '#f97316',
        medium: '#eab308',
        low: '#22c55e',
        deferred: '#6b7280',
    };
    return colors[level] || '#6b7280';
};

export default triageService;
