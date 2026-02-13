import api from '../services/api';
import {
    Witness,
    WitnessCreate,
    RiskAssessment
} from '../types/witness';

class WitnessService {
    /**
     * Register a new witness for protection
     */
    async registerWitness(data: WitnessCreate): Promise<Witness> {
        const response = await api.post<Witness>('/police/witness/register', data);
        return response.data;
    }

    /**
     * Get secure witness details
     */
    async getWitnessDetails(witnessId: string): Promise<Witness> {
        const response = await api.get<Witness>(`/police/witness/${witnessId}`);
        return response.data;
    }

    /**
     * List protected witnesses for a case
     */
    async listCaseWitnesses(caseId: string): Promise<Witness[]> {
        const response = await api.get<Witness[]>(`/police/witness/case/${caseId}`);
        return response.data;
    }
}

export default new WitnessService();
