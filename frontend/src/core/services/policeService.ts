import api from '../services/api';
import { FIRCreateRequest, FIRResponse, BNSSection } from '../types/fir';
import { FinancialAnalysisRequest, FinancialAnalysisResponse } from '../types/financial';

class PoliceService {
    // ── Skill 01: Smart-FIR ──
    async generateFIR(data: FIRCreateRequest): Promise<FIRResponse> {
        const response = await api.post<FIRResponse>('/police/fir/generate', data);
        return response.data;
    }

    async getFIR(firId: string): Promise<FIRResponse> {
        const response = await api.get<FIRResponse>(`/police/fir/${firId}`);
        return response.data;
    }

    async listFIRs(params?: { status?: string; limit?: number }): Promise<FIRResponse[]> {
        const response = await api.get<FIRResponse[]>('/police/fir', { params });
        return response.data;
    }

    async getBNSSections(): Promise<BNSSection[]> {
        const response = await api.get('/police/bns-sections');
        return response.data;
    }

    async testGenerateFIR(): Promise<FIRResponse> {
        const response = await api.post<FIRResponse>('/police/fir/test-generate');
        return response.data;
    }

    // ── Skill 02: Financial Trail Analyzer ──
    async analyzeFinancialTrail(data: FinancialAnalysisRequest): Promise<FinancialAnalysisResponse> {
        const response = await api.post<FinancialAnalysisResponse>('/police/financial/analyze', data);
        return response.data;
    }

    async testFinancialAnalysis(): Promise<FinancialAnalysisResponse> {
        const response = await api.post<FinancialAnalysisResponse>('/police/financial/test-analyze');
        return response.data;
    }

    // ── Helpers ──
    getSeverityColor(severity: string): string {
        const colors: Record<string, string> = {
            'heinous': 'bg-red-500 text-white',
            'serious': 'bg-orange-500 text-white',
            'moderate': 'bg-yellow-500 text-black',
            'minor': 'bg-blue-500 text-white'
        };
        return colors[severity] || 'bg-gray-500';
    }

    getRiskColor(risk: string): string {
        const colors: Record<string, string> = {
            'critical': 'bg-red-500/20 text-red-400 border-red-500/30',
            'high': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
            'medium': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            'low': 'bg-green-500/20 text-green-400 border-green-500/30'
        };
        return colors[risk] || 'bg-gray-500/20 text-gray-400';
    }

    formatConfidence(confidence: number): string {
        return `${(confidence * 100).toFixed(0)}%`;
    }

    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
    }
}

export const policeService = new PoliceService();
