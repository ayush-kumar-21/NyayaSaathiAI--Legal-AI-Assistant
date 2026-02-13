import React, { useCallback, useState } from 'react';
import { Upload, File, X, AlertCircle } from 'lucide-react';

interface BatchUploadZoneProps {
    onFilesSelected: (files: File[]) => void;
}

const BatchUploadZone: React.FC<BatchUploadZoneProps> = ({ onFilesSelected }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            onFilesSelected(files);
        }
    }, [onFilesSelected]);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            onFilesSelected(files);
        }
    }, [onFilesSelected]);

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
                relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
                ${isDragging
                    ? 'border-amber-400 bg-amber-500/10 scale-[1.02]'
                    : 'border-slate-700 hover:border-slate-500 bg-slate-800/30'
                }
            `}
        >
            <input
                type="file"
                multiple
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".pdf,.docx,.doc,.txt"
            />

            <div className="flex flex-col items-center gap-4 pointer-events-none">
                <div className={`
                    w-16 h-16 rounded-full flex items-center justify-center transition-colors
                    ${isDragging ? 'bg-amber-500/20' : 'bg-slate-700/50'}
                `}>
                    <Upload className={`w-8 h-8 ${isDragging ? 'text-amber-400' : 'text-slate-400'}`} />
                </div>

                <div>
                    <h3 className="text-lg font-bold text-white mb-1">
                        Drag & Drop or Click to Upload
                    </h3>
                    <p className="text-sm text-slate-400">
                        Support for PDF, DOCX, TXT (Max 50MB each)
                    </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
                    <AlertCircle className="w-3 h-3" />
                    <span>AI Scrutiny enabled for all uploads</span>
                </div>
            </div>
        </div>
    );
};

export default BatchUploadZone;
