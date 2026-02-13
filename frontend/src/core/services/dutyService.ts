import api from '../services/api';
import { DutyShift, RosterGenerateRequest } from '../types/duty';

class DutyService {
    /**
     * Get Duty Roster
     */
    async getRoster(startDate?: string, endDate?: string): Promise<DutyShift[]> {
        const params = new URLSearchParams();
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);

        const response = await api.get<DutyShift[]>(`/police/duty/list?${params.toString()}`);
        return response.data;
    }

    /**
     * Generate Roster
     */
    async generateRoster(request: RosterGenerateRequest): Promise<DutyShift[]> {
        const response = await api.post<DutyShift[]>('/police/duty/generate', request);
        return response.data;
    }
}

export default new DutyService();
