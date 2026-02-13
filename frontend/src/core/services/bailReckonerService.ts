import api from '../services/api';
import { BailReport, BailAnalysisRequest } from '../types/bailReckoner';

class BailReckonerService {
    /**
     * Analyze Bail
     */
    async analyzeBail(data: BailAnalysisRequest): Promise<BailReport> {
        const response = await api.post<BailReport>('/judge/bail-reckoner/analyze', data);
        return response.data;
    }

    /**
     * Get Report
     */
    async getReport(id: string): Promise<BailReport> {
        const response = await api.get<BailReport>(`/judge/bail-reckoner/${id}`);
        return response.data;
    }

    /**
     * Test Analyze (sample data)
     */
    async testAnalyze(): Promise<BailReport> {
        const response = await api.post<BailReport>('/judge/bail-reckoner/test-analyze');
        return response.data;
    }

    /** Risk color helper */
    getRiskColor(level: string): string {
        const colors: Record<string, string> = {
            'critical': 'text-red-500 bg-red-500/10 border-red-500/20',
            'high': 'text-orange-500 bg-orange-500/10 border-orange-500/20',
            'medium': 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
            'low': 'text-green-500 bg-green-500/10 border-green-500/20',
        };
        return colors[level] || 'text-gray-500';
    }

    /** Recommendation label helper */
    getRecommendationLabel(rec: string): string {
        const labels: Record<string, string> = {
            'grant': '✅ GRANT BAIL',
            'grant_with_conditions': '⚠️ GRANT WITH CONDITIONS',
            'reject': '❌ REJECT BAIL',
        };
        return labels[rec] || rec;
    }
}

export default new BailReckonerService();
