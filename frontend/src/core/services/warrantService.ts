import api from '../services/api';
import { Warrant, WarrantIssueRequest, WarrantUpdateRequest, WarrantStatus } from '../types/warrant';

class WarrantService {
    /**
     * List Warrants
     */
    async listWarrants(status?: WarrantStatus): Promise<Warrant[]> {
        const params = new URLSearchParams();
        if (status) params.append('status', status);

        const response = await api.get<Warrant[]>(`/police/warrant/list?${params.toString()}`);
        return response.data;
    }

    /**
     * Issue Warrant
     */
    async issueWarrant(request: WarrantIssueRequest): Promise<Warrant> {
        const response = await api.post<Warrant>('/police/warrant/issue', request);
        return response.data;
    }

    /**
     * Update Warrant Status
     */
    async updateWarrant(id: string, request: WarrantUpdateRequest): Promise<Warrant> {
        const response = await api.patch<Warrant>(`/police/warrant/${id}`, request);
        return response.data;
    }
}

export default new WarrantService();
