import api from './api';
import { BenchMemo, GenerateMemoRequest } from '../types/bench_memo';
import { BailReport, BailAnalysisRequest } from '../types/bail_reckoner';

class JudgeService {
    // ── Skill 08: Bench Memo Generator ──
    async generateMemo(data: GenerateMemoRequest): Promise<BenchMemo> {
        const response = await api.post<BenchMemo>('/judge/bench-memo/generate', data);
        return response.data;
    }

    async getMemo(memoId: string): Promise<BenchMemo> {
        const response = await api.get<BenchMemo>(`/judge/bench-memo/${memoId}`);
        return response.data;
    }

    async testGenerateMemo(): Promise<BenchMemo> {
        const response = await api.post<BenchMemo>('/judge/bench-memo/test-generate');
        return response.data;
    }

    // ── Skill 09: Bail Reckoner ──
    async analyzeBail(data: BailAnalysisRequest): Promise<BailReport> {
        const response = await api.post<BailReport>('/judge/bail-reckoner/analyze', data);
        return response.data;
    }

    async getBailReport(reportId: string): Promise<BailReport> {
        const response = await api.get<BailReport>(`/judge/bail-reckoner/${reportId}`);
        return response.data;
    }

    async testBailAnalysis(): Promise<BailReport> {
        const response = await api.post<BailReport>('/judge/bail-reckoner/test-analyze');
        return response.data;
    }

    // ── Helpers ──
    getRiskColor(risk: string): string {
        const colors: Record<string, string> = {
            'critical': 'bg-red-500/20 text-red-400 border-red-500/30',
            'high': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
            'medium': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            'low': 'bg-green-500/20 text-green-400 border-green-500/30',
        };
        return colors[risk] || 'bg-gray-500/20 text-gray-400';
    }

    getRecommendationStyle(rec: string): { bg: string; text: string; label: string } {
        const styles: Record<string, { bg: string; text: string; label: string }> = {
            'grant': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: '✅ GRANT BAIL' },
            'grant_with_conditions': { bg: 'bg-amber-500/20', text: 'text-amber-400', label: '⚠️ GRANT WITH CONDITIONS' },
            'reject': { bg: 'bg-red-500/20', text: 'text-red-400', label: '❌ REJECT BAIL' },
        };
        return styles[rec] || styles['reject'];
    }

    formatConfidence(val: number): string {
        return `${val.toFixed(0)}%`;
    }
}

export const judgeService = new JudgeService();
