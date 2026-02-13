export interface ChatMessage {
    id: string;
    sender_id: string;
    receiver_id: string;
    encrypted_content: string;
    is_read: boolean;
    timestamp: string;
    metadata: Record<string, any>;
}

export interface SendMessageRequest {
    receiver_id: string;
    encrypted_content: string;
}
