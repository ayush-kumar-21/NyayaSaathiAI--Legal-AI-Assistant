// Service for Case Status Tracker - Skill 23
import api from './api';
import { CaseStatusRequest, CaseStatusResponse } from '../types/caseStatus';

export const caseStatusService = {
    track: (data: CaseStatusRequest) =>
        api.post<CaseStatusResponse>('/citizen/case-status/track', data),

    testTrack: () =>
        api.post<CaseStatusResponse>('/citizen/case-status/test-track'),
};

export const getStageColor = (stage: string): string => {
    const colors: Record<string, string> = {
        fir_filed: '#ef4444',
        investigation: '#f97316',
        chargesheet_filed: '#eab308',
        trial_commenced: '#a855f7',
        evidence_stage: '#3b82f6',
        arguments: '#6366f1',
        judgment_reserved: '#8b5cf6',
        judgment_delivered: '#22c55e',
        appeal: '#f97316',
        disposed: '#6b7280',
    };
    return colors[stage] || '#6b7280';
};

export const getStageLabel = (stage: string): string => {
    return stage.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

export default caseStatusService;
