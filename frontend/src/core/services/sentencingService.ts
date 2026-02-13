import api from '../services/api';
import { SentencingReport, SentencingRequest } from '../types/sentencing';

class SentencingService {
    /**
     * Analyze Sentencing Guidelines
     */
    async analyzeSentencing(data: SentencingRequest): Promise<SentencingReport> {
        const response = await api.post<SentencingReport>('/judge/sentencing/analyze', data);
        return response.data;
    }

    /**
     * Get Report
     */
    async getReport(id: string): Promise<SentencingReport> {
        const response = await api.get<SentencingReport>(`/judge/sentencing/${id}`);
        return response.data;
    }
}

export default new SentencingService();
