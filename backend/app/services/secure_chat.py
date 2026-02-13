"""
Secure Chat Service - Skill 14
"""
import uuid
from datetime import datetime
from typing import List, Optional, Dict
from app.schemas.chat import ChatMessage, SendMessageRequest


class SecureChatService:
    """
    Service for secure messaging
    """
    
    def __init__(self):
        self.messages: List[ChatMessage] = []
        
    async def send_message(self, request: SendMessageRequest, sender: dict) -> ChatMessage:
        """Send a secure message"""
        msg_id = str(uuid.uuid4())
        
        message = ChatMessage(
            id=msg_id,
            sender_id=sender.get("id", "USER-001"),
            receiver_id=request.receiver_id,
            encrypted_content=request.encrypted_content,
            is_read=False,
            timestamp=datetime.now()
        )
        
        self.messages.append(message)
        return message

    async def get_history(self, user_id: str, other_user_id: str) -> List[ChatMessage]:
        """Get chat history between two users"""
        return [
            msg for msg in self.messages
            if (msg.sender_id == user_id and msg.receiver_id == other_user_id) or
               (msg.sender_id == other_user_id and msg.receiver_id == user_id)
        ]


# Singleton
chat_service = SecureChatService()
