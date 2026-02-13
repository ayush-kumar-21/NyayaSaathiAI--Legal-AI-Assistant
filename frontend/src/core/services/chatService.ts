import api from '../services/api';
import { ChatMessage, SendMessageRequest } from '../types/chat';

class SecureChatService {
    /**
     * Send Secure Message
     */
    async sendMessage(receiverId: string, content: string): Promise<ChatMessage> {
        // In a real app, content would be encrypted here with receiver's public key
        // We simulate encryption by prefixing [ENCRYPTED]
        const request: SendMessageRequest = {
            receiver_id: receiverId,
            encrypted_content: `[ENCRYPTED] ${content}`
        };

        const response = await api.post<ChatMessage>('/citizen/chat/send', request);
        return response.data;
    }

    /**
     * Get Chat History
     */
    async getHistory(otherUserId: string): Promise<ChatMessage[]> {
        const response = await api.get<ChatMessage[]>(`/citizen/chat/history/${otherUserId}`);
        return response.data;
    }
}

export default new SecureChatService();
