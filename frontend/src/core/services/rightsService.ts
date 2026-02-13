// Service for Know Your Rights - Skill 22
import api from './api';
import { RightsQueryRequest, RightsQueryResponse } from '../types/rights';

export const rightsService = {
    query: (data: RightsQueryRequest) =>
        api.post<RightsQueryResponse>('/citizen/rights/query', data),

    testQuery: () =>
        api.post<RightsQueryResponse>('/citizen/rights/test-query'),
};

export const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
        arrest: '🚔',
        bail: '⚖️',
        fir: '📋',
        women: '👩',
        children: '👶',
        cyber: '💻',
        property: '🏠',
        consumer: '🛒',
        labour: '👷',
        rti: '📜',
        general: '📖',
    };
    return icons[category] || '📖';
};

export default rightsService;
