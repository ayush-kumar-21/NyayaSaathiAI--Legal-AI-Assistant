import React, { useState, useRef } from 'react';
import {
    Scan,
    Upload,
    FileText,
    CheckCircle,
    Brain,
    Loader,
    Image as ImageIcon
} from 'lucide-react';
import scannerService from '../../../core/services/scannerService';
import { ScannedDocument } from '../../../core/types/scanner';

const DocumentScanner: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [document, setDocument] = useState<ScannedDocument | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setDocument(null);
        }
    };

    const handleScan = async () => {
        if (!file) return;
        setIsScanning(true);
        try {
            const result = await scannerService.scanDocument(file);
            setDocument(result);
        } catch (error) {
            console.error("Scanning failed", error);
        } finally {
            setIsScanning(false);
        }
    };

    return (
        <div className="p-6 min-h-screen bg-neutral-900 text-neutral-100 font-sans">
            <header className="mb-8 border-b border-neutral-800 pb-6">
                <h1 className="text-3xl font-serif font-bold flex items-center gap-3 text-blue-500">
                    <Scan className="w-8 h-8" />
                    Smart Document Scanner (Nyaya Setu)
                </h1>
                <p className="text-neutral-400 mt-2 font-serif text-lg italic">
                    AI-powered OCR and categorization for legal petitions, FIRs, and summons.
                </p>
            </header>

            <div className="max-w-4xl mx-auto space-y-8">
                {/* Upload Area */}
                <div
                    className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-all cursor-pointer ${file ? 'border-blue-500 bg-blue-500/5' : 'border-neutral-700 hover:border-blue-500 hover:bg-neutral-800'
                        }`}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*,application/pdf"
                    />

                    {preview ? (
                        <div className="relative">
                            <img src={preview} alt="Preview" className="max-h-64 rounded shadow-lg border border-neutral-700" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded">
                                <span className="text-white font-bold flex items-center gap-2">
                                    <Upload className="w-5 h-5" /> Change File
                                </span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Upload className="w-16 h-16 text-neutral-500 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Click to Upload Document</h3>
                            <p className="text-neutral-400">Supports JPG, PNG, PDF</p>
                        </>
                    )}
                </div>

                {/* Action Button */}
                {file && !document && (
                    <button
                        onClick={handleScan}
                        disabled={isScanning}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold text-xl shadow-lg shadow-blue-900/50 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {isScanning ? (
                            <>
                                <Loader className="w-6 h-6 animate-spin" /> Processing OCR...
                            </>
                        ) : (
                            <>
                                <Scan className="w-6 h-6" /> Scan & Analyze
                            </>
                        )}
                    </button>
                )}

                {/* Results */}
                {document && (
                    <div className="bg-neutral-800 rounded-xl p-8 border border-neutral-700 shadow-xl animate-fade-in-up">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
                                <CheckCircle className="w-6 h-6 text-green-500" /> Analysis Complete
                            </h2>
                            <span className="bg-blue-900/50 text-blue-200 px-3 py-1 rounded-full text-sm font-bold border border-blue-500/30 uppercase">
                                {document.document_type}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="bg-neutral-900/50 p-4 rounded-lg border border-neutral-700">
                                    <span className="text-sm text-neutral-400 block mb-1">Confidence Score</span>
                                    <div className="text-2xl font-bold text-green-400 block">{(document.confidence_score * 100).toFixed(1)}%</div>
                                </div>
                                <div className="bg-neutral-900/50 p-4 rounded-lg border border-neutral-700">
                                    <span className="text-sm text-neutral-400 block mb-1">Detected Language</span>
                                    <div className="text-xl font-bold uppercase text-white">{document.detected_language === 'en' ? 'English' : document.detected_language}</div>
                                </div>
                            </div>

                            <div className="bg-neutral-900/50 p-6 rounded-lg border border-neutral-700">
                                <h3 className="font-bold text-blue-400 mb-3 flex items-center gap-2">
                                    <FileText className="w-5 h-5" /> Extracted Text (Snippet)
                                </h3>
                                <p className="text-neutral-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                                    {document.extracted_text}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-2 transition-colors">
                                <Brain className="w-5 h-5" /> Proceed to Case Filing
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentScanner;
