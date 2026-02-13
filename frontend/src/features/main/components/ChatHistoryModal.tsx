
import React, { useEffect, useState } from 'react';
import { X, MessageSquare, Clock, Trash2, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sqliteChatService, ChatMessage } from '../../../core/services/storage/SqliteChatService';
import GlassCard from '../../../shared/components/3d/GlassCard';

interface ChatHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ChatHistoryModal: React.FC<ChatHistoryModalProps> = ({ isOpen, onClose }) => {
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadHistory();
        }
    }, [isOpen]);

    const loadHistory = async () => {
        setLoading(true);
        try {
            const data = await sqliteChatService.getHistory();
            setHistory(data);
        } catch (error) {
            console.error("Failed to load history:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = async () => {
        if (confirm("Are you sure you want to delete all chat history? This cannot be undone.")) {
            await sqliteChatService.clearHistory();
            setHistory([]);
        }
    };

    const handleExport = () => {
        const text = history.map(m => `[${new Date(m.timestamp).toLocaleString()}] ${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nyayabot-history-${new Date().toISOString()}.txt`;
        a.click();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="w-full max-w-2xl max-h-[80vh] flex flex-col"
                    onClick={e => e.stopPropagation()}
                >
                    <GlassCard className="flex flex-col h-full overflow-hidden" variant="default">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Clock className="w-5 h-5 text-emerald-400" />
                                Chat History
                            </h2>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleExport}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-300 hover:text-white"
                                    title="Export History"
                                >
                                    <Download className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleClear}
                                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-slate-300 hover:text-red-400"
                                    title="Clear History"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-300 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                            {loading ? (
                                <div className="text-center py-12 text-slate-400">Loading...</div>
                            ) : history.length === 0 ? (
                                <div className="text-center py-12 text-slate-400">
                                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    No chat history found.
                                </div>
                            ) : (
                                history.map((msg, idx) => (
                                    <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.role === 'user'
                                                ? 'bg-emerald-500/20 border border-emerald-500/30 text-white rounded-tr-sm'
                                                : 'bg-slate-800/50 border border-slate-700/50 text-slate-200 rounded-tl-sm'
                                            }`}>
                                            <p className="text-sm">{msg.content}</p>
                                        </div>
                                        <span className="text-[10px] text-slate-500 mt-1 px-1">
                                            {new Date(msg.timestamp).toLocaleString()}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </GlassCard>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ChatHistoryModal;
