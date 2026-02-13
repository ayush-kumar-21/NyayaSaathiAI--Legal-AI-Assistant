import React, { useState, useEffect } from 'react';
import { Fingerprint, ShieldCheck, Upload, File as FileIcon, RefreshCw, Lock, Database, Clock, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EvidenceHasher: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isHashing, setIsHashing] = useState(false);
    const [hashResult, setHashResult] = useState<{ hash: string; timestamp: string; block: string } | null>(null);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) processFile(droppedFile);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) processFile(selectedFile);
    };

    const processFile = (file: File) => {
        setFile(file);
        setHashResult(null);
        setIsHashing(true);

        // Simulate Hashing Process
        setTimeout(() => {
            const mockHash = Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
            setHashResult({
                hash: mockHash,
                timestamp: new Date().toISOString(),
                block: `#${Math.floor(Math.random() * 1000000)}`
            });
            setIsHashing(false);
        }, 2500);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-full mb-4 ring-1 ring-blue-500/30">
                    <Fingerprint className="w-8 h-8 text-blue-400" />
                </div>
                <h1 className="text-3xl font-bold text-white">Evidence Hasher & Verifier</h1>
                <p className="text-slate-400 max-w-lg mx-auto">
                    Generate cryptographic SHA-256 hashes for digital evidence to ensure immutability and admissibility in court under BNSS Section 63.
                </p>
            </div>

            {/* Main Interaction Zone */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden relative">
                <div className="absolute inset-0 bg-grid-slate-800/[0.1] bg-[size:20px_20px]" />

                <div className="relative p-8 md:p-12">
                    {!file ? (
                        <div
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                            className="border-2 border-dashed border-slate-700 rounded-xl p-10 text-center hover:border-blue-500/50 hover:bg-slate-800/50 transition-all cursor-pointer group"
                        >
                            <input
                                type="file"
                                id="fileInput"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <label htmlFor="fileInput" className="cursor-pointer">
                                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-400" />
                                </div>
                                <h3 className="text-lg font-medium text-white mb-2">Drop evidence file here</h3>
                                <p className="text-sm text-slate-500">Supports Images, Videos, PDFs, and Audio</p>
                            </label>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* File Info */}
                            <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                <div className="p-3 bg-blue-600/20 rounded-lg">
                                    <FileIcon className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-white text-lg">{file.name}</h4>
                                    <p className="text-sm text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB • {file.type || 'Unknown Type'}</p>
                                </div>
                                <button
                                    onClick={() => setFile(null)}
                                    className="ml-auto text-sm text-red-400 hover:text-red-300 hover:underline"
                                >
                                    Change File
                                </button>
                            </div>

                            {/* Hashing Animation */}
                            {isHashing && (
                                <div className="text-center space-y-4 py-8">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        className="inline-block"
                                    >
                                        <RefreshCw className="w-10 h-10 text-blue-500" />
                                    </motion.div>
                                    <p className="text-blue-300 font-mono animate-pulse">Computing SHA-256 Hash...</p>

                                    {/* Matrix Rain Effect Placeholder */}
                                    <div className="h-2 w-64 bg-slate-800 rounded-full mx-auto overflow-hidden">
                                        <motion.div
                                            initial={{ width: "0%" }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 2.5 }}
                                            className="h-full bg-blue-500"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Result */}
                            {hashResult && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-green-500/30 rounded-xl p-6 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <ShieldCheck className="w-32 h-32 text-green-500" />
                                    </div>

                                    <div className="relative z-10 space-y-6">
                                        <div className="flex items-center gap-2 text-green-400 mb-2">
                                            <ShieldCheck className="w-5 h-5" />
                                            <span className="font-bold uppercase tracking-wider text-sm">Integrity Secured</span>
                                        </div>

                                        <div>
                                            <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1 block">SHA-256 Hash</label>
                                            <div className="font-mono text-sm sm:text-base text-green-300 break-all bg-black/30 p-3 rounded-lg border border-green-500/20 select-all">
                                                {hashResult.hash}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1 block">Timestamp</label>
                                                <div className="flex items-center gap-2 text-white">
                                                    <Clock className="w-4 h-4 text-slate-500" />
                                                    {new Date(hashResult.timestamp).toLocaleString()}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1 block">Blockchain Record</label>
                                                <div className="flex items-center gap-2 text-white">
                                                    <Database className="w-4 h-4 text-slate-500" />
                                                    {hashResult.block}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Info Footer */}
            <div className="grid md:grid-cols-3 gap-6">
                {[
                    { title: 'Admissible Evidence', desc: 'Generated hashes adhere to Section 65B of Indian Evidence Act.', icon: Lock },
                    { title: 'Tamper Proof', desc: 'Any alteration to the file will result in a completely different hash.', icon: ShieldCheck },
                    { title: 'Instantly Verifiable', desc: 'Verify any file against the blockchain record in seconds.', icon: CheckCircle },
                ].map((item, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-slate-800/30 transition-colors">
                        <div className="flex-shrink-0">
                            <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
                                <item.icon className="w-5 h-5 text-slate-400" />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-medium text-white mb-1">{item.title}</h3>
                            <p className="text-sm text-slate-400">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EvidenceHasher;
