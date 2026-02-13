// Service for Judgment Validator - Skill 21
import api from './api';
import { JudgmentValidateRequest, JudgmentValidateResponse } from '../types/judgment';

export const judgmentService = {
    validate: (data: JudgmentValidateRequest) =>
        api.post<JudgmentValidateResponse>('/judge/judgment/validate', data),

    testValidate: () =>
        api.post<JudgmentValidateResponse>('/judge/judgment/test-validate'),
};

export const getValidityColor = (status: string): string => {
    const colors: Record<string, string> = {
        valid: '#22c55e',
        needs_review: '#eab308',
        critical_issues: '#ef4444',
    };
    return colors[status] || '#6b7280';
};

export const getSeverityColor = (severity: string): string => {
    const colors: Record<string, string> = {
        critical: '#ef4444',
        warning: '#f97316',
        info: '#3b82f6',
    };
    return colors[severity] || '#6b7280';
};

export default judgmentService;
