import api from '../services/api';
import { ChargeSheet, ChargeSheetCreate, ChargeSheetUpdate } from '../types/chargesheet';

class ChargeSheetService {
    /**
     * Generate Draft from FIR
     */
    async generateDraft(firId: string): Promise<ChargeSheet> {
        const response = await api.post<ChargeSheet>('/police/chargesheet/generate', { fir_id: firId });
        return response.data;
    }

    /**
     * Get Charge Sheet
     */
    async getChargeSheet(id: string): Promise<ChargeSheet> {
        const response = await api.get<ChargeSheet>(`/police/chargesheet/${id}`);
        return response.data;
    }

    /**
     * Update Charge Sheet
     */
    async updateChargeSheet(id: string, data: ChargeSheetUpdate): Promise<ChargeSheet> {
        const response = await api.put<ChargeSheet>(`/police/chargesheet/${id}`, data);
        return response.data;
    }
}

export default new ChargeSheetService();
