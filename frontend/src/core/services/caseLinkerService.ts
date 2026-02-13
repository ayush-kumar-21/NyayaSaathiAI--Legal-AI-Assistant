import api from '../services/api';
import { CaseLinkResponse } from '../types/caseLinker';

class CaseLinkerService {
    /**
     * Analyze case for patterns and links
     */
    async analyzeCase(caseId: string): Promise<CaseLinkResponse> {
        const response = await api.post<CaseLinkResponse>('/police/linker/analyze', {
            case_id: caseId,
            include_closed_cases: true,
            min_confidence: 0.6
        });
        return response.data;
    }
}

export default new CaseLinkerService();
