import api from '../services/api';
import { BenchMemo, GenerateMemoRequest } from '../types/benchMemo';

class BenchMemoService {
    /**
     * Generate Memo
     */
    async generateMemo(data: GenerateMemoRequest): Promise<BenchMemo> {
        const response = await api.post<BenchMemo>('/judge/bench-memo/generate', data);
        return response.data;
    }

    /**
     * Get Memo
     */
    async getMemo(id: string): Promise<BenchMemo> {
        const response = await api.get<BenchMemo>(`/judge/bench-memo/${id}`);
        return response.data;
    }

    /**
     * Get Memo by Case
     */
    async getMemoByCase(caseId: string): Promise<BenchMemo> {
        const response = await api.get<BenchMemo>(`/judge/bench-memo/case/${caseId}`);
        return response.data;
    }

    /**
     * Test Generate (sample data)
     */
    async testGenerate(): Promise<BenchMemo> {
        const response = await api.post<BenchMemo>('/judge/bench-memo/test-generate');
        return response.data;
    }

    /** Status color helper */
    getStatusColor(status: string): string {
        const colors: Record<string, string> = {
            'generated': 'text-emerald-400',
            'draft': 'text-yellow-400',
            'reviewed': 'text-blue-400',
        };
        return colors[status] || 'text-gray-400';
    }
}

export default new BenchMemoService();
