import api from '../services/api';
import { VoiceGrievance, Language } from '../types/speech';

class SpeechService {
    /**
     * Submit Voice Grievance
     */
    async submitVoiceGrievance(file: Blob, languageHint?: Language): Promise<VoiceGrievance> {
        const formData = new FormData();
        formData.append('file', file, 'recording.webm');
        if (languageHint) {
            formData.append('language_hint', languageHint);
        }

        const response = await api.post<VoiceGrievance>('/citizen/voice-grievance/submit', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
}

export default new SpeechService();
