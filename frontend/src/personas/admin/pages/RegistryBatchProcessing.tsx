import React, { useState } from 'react';
import { Layers, Play, Pause, Download, RefreshCw, AlertTriangle, FileText } from 'lucide-react';
import BatchUploadZone from '../components/registry/BatchUploadZone';
import FileQueue, { FileQueueItem } from '../components/registry/FileQueue';
import { useToast } from '../../../shared/hooks/useToast';
import { mockDelay } from '../../../shared/utils/mockApi';

const RegistryBatchProcessing: React.FC = () => {
    const { showToast, updateToast } = useToast();
    const [queue, setQueue] = useState<FileQueueItem[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFilesSelected = (files: File[]) => {
        const newItems: FileQueueItem[] = files.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            status: 'queued',
            progress: 0
        }));
        setQueue(prev => [...prev, ...newItems]);
        showToast(`Added ${files.length} files to queue`, 'info');
    };

    const handleRemove = (id: string) => {
        setQueue(prev => prev.filter(item => item.id !== id));
    };

    const handleRetry = (id: string) => {
        setQueue(prev => prev.map(item =>
            item.id === id ? { ...item, status: 'queued', progress: 0, message: undefined } : item
        ));
    };

    const processQueue = async () => {
        if (isProcessing) return;
        setIsProcessing(true);
        showToast('Starting batch processing...', 'loading');

        // Process sequentially for demo
        const itemsToProcess = queue.filter(i => i.status === 'queued' || i.status === 'failed');

        for (const item of itemsToProcess) {
            // Update status to processing
            setQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'processing', progress: 0 } : q));

            // Simulate processing steps
            try {
                for (let i = 10; i <= 100; i += 10) {
                    await mockDelay(300); // Simulate AI thinking
                    setQueue(prev => prev.map(q => q.id === item.id ? { ...q, progress: i } : q));
                }

                // Random success/failure
                const isSuccess = Math.random() > 0.2;
                const defects = isSuccess ? Math.floor(Math.random() * 5) : 0;

                setQueue(prev => prev.map(q => q.id === item.id ? {
                    ...q,
                    status: isSuccess ? 'completed' : 'failed',
                    defects,
                    progress: 100
                } : q));

            } catch (error) {
                setQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'failed', progress: 0 } : q));
            }
        }

        setIsProcessing(false);
        showToast('Batch processing complete', 'success');
    };

    const completedCount = queue.filter(i => i.status === 'completed').length;
    const failedCount = queue.filter(i => i.status === 'failed').length;

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Layers className="w-8 h-8 text-amber-500" />
                    Batch Document Processing
                </h1>
                <p className="text-slate-400 mt-1">
                    Upload multiple case files for automated AI scrutiny and defect detection.
                </p>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left: Upload & Queue */}
                <div className="lg:col-span-2 space-y-6">
                    <BatchUploadZone onFilesSelected={handleFilesSelected} />

                    <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-white">Queue Management</h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={processQueue}
                                    disabled={isProcessing || queue.filter(i => i.status === 'queued').length === 0}
                                    className={`
                                        flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all
                                        ${isProcessing
                                            ? 'bg-amber-500/20 text-amber-400 cursor-not-allowed'
                                            : 'bg-amber-500 hover:bg-amber-600 text-slate-900 hover:shadow-lg hover:shadow-amber-500/20'}
                                    `}
                                >
                                    {isProcessing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                    {isProcessing ? 'Processing...' : 'Start Processing'}
                                </button>
                            </div>
                        </div>

                        <FileQueue
                            items={queue}
                            onRemove={handleRemove}
                            onRetry={handleRetry}
                        />

                        {queue.length === 0 && (
                            <div className="text-center py-12 text-slate-500">
                                <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>Queue is empty</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Summary & Stats */}
                <div className="space-y-6">
                    {/* Summary Card */}
                    <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6">
                        <h3 className="font-bold text-white mb-4">Session Summary</h3>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                                <span className="text-slate-400 text-sm">Total Files</span>
                                <span className="text-white font-bold">{queue.length}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                                <span className="text-emerald-400 text-sm">Completed</span>
                                <span className="text-emerald-300 font-bold">{completedCount}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                                <span className="text-red-400 text-sm">Failed</span>
                                <span className="text-red-300 font-bold">{failedCount}</span>
                            </div>
                        </div>

                        {completedCount > 0 && (
                            <button className="w-full mt-6 flex items-center justify-center gap-2 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors font-medium">
                                <Download className="w-4 h-4" />
                                Export Report
                            </button>
                        )}
                    </div>

                    {/* Guidelines */}
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-blue-400 text-sm">Supported Formats</h4>
                                <p className="text-xs text-blue-300/80 mt-1 leading-relaxed">
                                    • PDF (Searchable preferred)<br />
                                    • DOCX (Word Documents)<br />
                                    • TXT (Plain Text)<br />
                                    • Max size: 50MB per file
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistryBatchProcessing;
