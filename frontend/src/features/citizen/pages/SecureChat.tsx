import React, { useState, useEffect, useRef } from 'react';
import {
    Send,
    Lock,
    User,
    Shield,
    MoreVertical,
    Phone,
    Video
} from 'lucide-react';
import chatService from '../../../core/services/chatService';
import { ChatMessage } from '../../../core/types/chat';

const SecureChatPage: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [receiverId, setReceiverId] = useState('LAWYER-001'); // Mock receiver
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        loadHistory();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadHistory = async () => {
        try {
            const history = await chatService.getHistory(receiverId);
            setMessages(history);
        } catch (error) {
            console.error("Failed to load history", error);
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        try {
            const msg = await chatService.sendMessage(receiverId, input);
            setMessages(prev => [...prev, msg]);
            setInput('');
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    return (
        <div className="h-screen flex flex-col bg-neutral-900 font-sans text-neutral-100">
            {/* Header */}
            <header className="bg-neutral-800 p-4 border-b border-neutral-700 flex items-center justify-between shadow-md z-10">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg">
                        <User className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="font-bold flex items-center gap-2">
                            Adv. Priya Sharma
                            <Shield className="w-4 h-4 text-green-400" />
                        </h1>
                        <p className="text-xs text-green-400 flex items-center gap-1">
                            <Lock className="w-3 h-3" /> End-to-End Encrypted
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-neutral-400">
                    <Phone className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                    <Video className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                    <MoreVertical className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                </div>
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/50 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                <div className="text-center text-xs text-neutral-500 my-4">
                    <span className="bg-neutral-800 px-3 py-1 rounded-full border border-neutral-700">
                        Messages are secured with 256-bit AES encryption
                    </span>
                </div>

                {messages.map((msg) => {
                    const isMe = msg.sender_id === 'CITIZEN-001';
                    // Strip the [ENCRYPTED] tag for display if it exists
                    const content = msg.encrypted_content.replace('[ENCRYPTED] ', '');

                    return (
                        <div
                            key={msg.id}
                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[75%] p-3 rounded-2xl shadow-md ${isMe
                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                        : 'bg-neutral-800 text-neutral-200 rounded-tl-none border border-neutral-700'
                                    }`}
                            >
                                <p className="text-sm">{content}</p>
                                <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-neutral-500'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    {isMe && <span className="ml-1">✓✓</span>}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-neutral-800 p-4 border-t border-neutral-700">
                <div className="flex items-center gap-3 max-w-4xl mx-auto">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type a secure message..."
                        className="flex-1 bg-neutral-900 text-white p-3 rounded-full border border-neutral-700 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                    <button
                        onClick={handleSend}
                        className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg shadow-blue-900/50 transition-all active:scale-95"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SecureChatPage;
