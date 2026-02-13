// Service for Legal Aid Finder - Skill 24
import api from './api';
import { LegalAidRequest, LegalAidResponse } from '../types/legalAid';

export const legalAidService = {
    find: (data: LegalAidRequest) =>
        api.post<LegalAidResponse>('/citizen/legal-aid/find', data),

    testFind: () =>
        api.post<LegalAidResponse>('/citizen/legal-aid/test-find'),
};

export const getEligibilityColor = (status: string): string => {
    const colors: Record<string, string> = {
        eligible: '#22c55e',
        likely_eligible: '#a3e635',
        needs_verification: '#eab308',
        not_eligible: '#ef4444',
    };
    return colors[status] || '#6b7280';
};

export const getAidTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
        free_lawyer: 'Free Lawyer',
        legal_clinic: 'Legal Clinic',
        nalsa_scheme: 'NALSA Scheme',
        district_authority: 'District Authority',
        ngo: 'NGO',
        pro_bono: 'Pro Bono',
    };
    return labels[type] || type;
};

export default legalAidService;
