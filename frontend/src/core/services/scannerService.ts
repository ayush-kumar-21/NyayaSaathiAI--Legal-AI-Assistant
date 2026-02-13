import api from '../services/api';
import { ScannedDocument } from '../types/scanner';

class ScannerService {
    /**
     * Scan Document
     */
    async scanDocument(file: File): Promise<ScannedDocument> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post<ScannedDocument>('/citizen/scanner/scan', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
}

export default new ScannerService();
