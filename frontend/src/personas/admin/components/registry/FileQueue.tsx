import React from 'react';
import { FileText, CheckCircle, AlertTriangle, XCircle, Loader2, Pause, Play, RefreshCw, Trash2, Eye } from 'lucide-react';

export interface FileQueueItem {
    id: string;
    file: File;
    status: 'queued' | 'processing' | 'completed' | 'failed' | 'paused'; // Added paused
    progress: number;
    defects?: number;
    message?: string;
}

interface FileQueueProps {
    items: FileQueueItem[];
    onRemove: (id: string) => void;
    onRetry: (id: string) => void;
}

const FileQueue: React.FC<FileQueueProps> = ({ items, onRemove, onRetry }) => {
    if (items.length === 0) return null;

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                Processing Queue ({items.length})
            </h3>

            <div className="space-y-2">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className={`
                            group flex items-center gap-4 p-3 rounded-xl border transition-all
                            ${item.status === 'processing' ? 'bg-slate-800/80 border-blue-500/30' :
                                item.status === 'completed' ? 'bg-slate-800/40 border-emerald-500/20' :
                                    item.status === 'failed' ? 'bg-red-900/10 border-red-500/20' :
                                        'bg-slate-800/40 border-slate-700/50'}
                        `}
                    >
                        {/* Icon based on status */}
                        <div className={`
                            w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                            ${item.status === 'processing' ? 'bg-blue-500/20' :
                                item.status === 'completed' ? 'bg-emerald-500/20' :
                                    item.status === 'failed' ? 'bg-red-500/20' :
                                        'bg-slate-700/50'}
                        `}>
                            {item.status === 'processing' && <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />}
                            {item.status === 'completed' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                            {item.status === 'failed' && <XCircle className="w-5 h-5 text-red-400" />}
                            {item.status === 'queued' && <FileText className="w-5 h-5 text-slate-400" />}
                        </div>

                        {/* File Info & Progress */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-medium text-white truncate max-w-[200px]" title={item.file.name}>
                                    {item.file.name}
                                </p>
                                <span className={`text-xs font-bold ${item.status === 'completed' ? 'text-emerald-400' :
                                        item.status === 'failed' ? 'text-red-400' :
                                            item.status === 'processing' ? 'text-blue-400' :
                                                'text-slate-500'
                                    }`}>
                                    {item.status === 'processing' ? `${item.progress}%` :
                                        item.status === 'completed' ? (item.defects && item.defects > 0 ? `${item.defects} Defects` : 'Clean') :
                                            item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-300 ${item.status === 'completed' ? 'bg-emerald-500' :
                                            item.status === 'failed' ? 'bg-red-500' :
                                                'bg-blue-500'
                                        }`}
                                    style={{ width: `${item.progress}%` }}
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                            {item.status === 'failed' && (
                                <button
                                    onClick={() => onRetry(item.id)}
                                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                                    title="Retry"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </button>
                            )}
                            {item.status === 'completed' && (
                                <button
                                    className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                    title="View Report"
                                >
                                    <Eye className="w-4 h-4" />
                                </button>
                            )}
                            <button
                                onClick={() => onRemove(item.id)}
                                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Remove"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FileQueue;
