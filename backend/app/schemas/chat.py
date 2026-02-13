"""
Secure Chat Schemas - Skill 14
E2E Encrypted Chat
"""
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime


class ChatMessage(BaseModel):
    id: str
    sender_id: str
    receiver_id: str
    
    # Encrypted Content
    encrypted_content: str
    
    is_read: bool
    timestamp: datetime
    metadata: Dict[str, Any] = {}


class SendMessageRequest(BaseModel):
    receiver_id: str
    encrypted_content: str
