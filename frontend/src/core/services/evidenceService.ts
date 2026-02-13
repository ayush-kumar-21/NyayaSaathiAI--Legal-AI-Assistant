import api from '../services/api';
import {
    Evidence,
    EvidenceCreate,
    EvidenceResponse,
    CustodyTransferRequest
} from '../types/evidence';

class EvidenceService {
    /**
     * Upload new evidence
     */
    async uploadEvidence(data: EvidenceCreate): Promise<Evidence> {
        const response = await api.post<Evidence>('/police/evidence/upload', data);
        return response.data;
    }

    /**
     * Get evidence details with chain of custody
     */
    async getEvidenceDetails(evidenceId: string): Promise<EvidenceResponse> {
        const response = await api.get<EvidenceResponse>(`/police/evidence/${evidenceId}`);
        return response.data;
    }

    /**
     * List all evidence for a case
     */
    async listCaseEvidence(caseId: string): Promise<Evidence[]> {
        const response = await api.get<Evidence[]>(`/police/evidence/case/${caseId}`);
        return response.data;
    }

    /**
     * Transfer custody or update status
     */
    async transferCustody(request: CustodyTransferRequest): Promise<EvidenceResponse> {
        const response = await api.post<EvidenceResponse>('/police/evidence/transfer', request);
        return response.data;
    }
}

export default new EvidenceService();
