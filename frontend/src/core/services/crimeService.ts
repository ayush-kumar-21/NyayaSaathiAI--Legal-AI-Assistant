import api from '../services/api';
import { CrimeScene, CreateSceneRequest, AddMarkerRequest, EvidenceMarker } from '../types/crime3d';

class CrimeService {
    /**
     * Get Crime Scene by ID
     */
    async getScene(sceneId: string): Promise<CrimeScene> {
        const response = await api.get<CrimeScene>(`/police/crime-scene/${sceneId}`);
        return response.data;
    }

    /**
     * Get Crime Scene by Case ID
     */
    async getSceneByCase(caseId: string): Promise<CrimeScene> {
        const response = await api.get<CrimeScene>(`/police/crime-scene/case/${caseId}`);
        return response.data;
    }

    /**
     * Create New Crime Scene
     */
    async createScene(request: CreateSceneRequest): Promise<CrimeScene> {
        const response = await api.post<CrimeScene>('/police/crime-scene/', request);
        return response.data;
    }

    /**
     * Add Evidence Marker
     */
    async addMarker(sceneId: string, request: AddMarkerRequest): Promise<EvidenceMarker> {
        const response = await api.post<EvidenceMarker>(`/police/crime-scene/${sceneId}/marker`, request);
        return response.data;
    }
}

export default new CrimeService();
