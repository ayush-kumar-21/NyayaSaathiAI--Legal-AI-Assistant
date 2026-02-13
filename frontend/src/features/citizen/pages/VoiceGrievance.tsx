import React, { useState, useRef } from 'react';
import {
    Mic,
    Square,
    Send,
    MessageSquare,
    Globe,
    Loader,
    CheckCircle,
    Volume2
} from 'lucide-react';
import speechService from '../../../core/services/speechService';
import { VoiceGrievance, Language } from '../../../core/types/speech';

const VoiceGrievancePage: React.FC = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [grievance, setGrievance] = useState<VoiceGrievance | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<Language>(Language.HINDI);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<BlobPart[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setRecordedBlob(blob);
                chunksRef.current = [];
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setGrievance(null);
            setRecordedBlob(null);
        } catch (err) {
            console.error("Error accessing microphone", err);
            alert("Could not access microphone. Please allow permissions.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);

            // Stop logic handles the blob creation via onstop event
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    const handleSubmit = async () => {
        if (!recordedBlob) return;
        setIsProcessing(true);
        try {
            const result = await speechService.submitVoiceGrievance(recordedBlob, selectedLanguage);
            setGrievance(result);
        } catch (error) {
            console.error("Submission failed", error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="p-6 min-h-screen bg-neutral-900 text-neutral-100 font-sans">
            <header className="mb-8 border-b border-neutral-800 pb-6">
                <h1 className="text-3xl font-serif font-bold flex items-center gap-3 text-orange-500">
                    <Mic className="w-8 h-8" />
                    Voice Grievance (Nyaya Setu)
                </h1>
                <p className="text-neutral-400 mt-2 font-serif text-lg italic">
                    File complaints in your own language using AI-powered speech-to-text.
                </p>
            </header>

            <div className="max-w-2xl mx-auto">
                <div className="bg-neutral-800 rounded-2xl p-8 border border-neutral-700 shadow-2xl relative overflow-hidden">

                    {/* Visualizer Placeholder */}
                    <div className="h-32 bg-black/50 rounded-xl mb-8 flex items-center justify-center border border-neutral-800 relative overflow-hidden">
                        {isRecording ? (
                            <div className="flex items-center gap-1 h-full">
                                {[...Array(20)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-1 bg-orange-500 rounded-full animate-pulse"
                                        style={{ height: `${Math.random() * 100}%`, animationDuration: `${Math.random() * 0.5 + 0.2}s` }}
                                    ></div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-neutral-600 flex flex-col items-center gap-2">
                                <Volume2 className="w-8 h-8" />
                                <span className="text-sm">Ready to record</span>
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col items-center gap-6">
                        {/* Language Selector */}
                        <div className="flex items-center gap-3 bg-neutral-900 p-2 rounded-full border border-neutral-700">
                            <Globe className="w-5 h-5 text-neutral-400 ml-2" />
                            <select
                                value={selectedLanguage}
                                onChange={(e) => setSelectedLanguage(e.target.value as Language)}
                                className="bg-transparent text-neutral-200 outline-none pr-4 font-bold"
                            >
                                <option value={Language.HINDI}>Hindi (हिन्दी)</option>
                                <option value={Language.ENGLISH}>English</option>
                                <option value={Language.TAMIL}>Tamil (தமிழ்)</option>
                                <option value={Language.TELUGU}>Telugu (తెలుగు)</option>
                                <option value={Language.BENGALI}>Bengali (বাংলা)</option>
                            </select>
                        </div>

                        {/* Record Button */}
                        <div className="relative">
                            {!isRecording ? (
                                <button
                                    onClick={startRecording}
                                    className="w-20 h-20 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-900/50 transition-all scale-100 hover:scale-105 active:scale-95"
                                >
                                    <Mic className="w-8 h-8 text-white" />
                                </button>
                            ) : (
                                <button
                                    onClick={stopRecording}
                                    className="w-20 h-20 bg-neutral-700 hover:bg-neutral-600 rounded-full flex items-center justify-center shadow-lg transition-all border-4 border-red-500 animate-pulse"
                                >
                                    <Square className="w-8 h-8 text-white fill-white" />
                                </button>
                            )}
                        </div>

                        <p className="text-neutral-400 font-bold">
                            {isRecording ? "Listening..." : recordedBlob ? "Recording Saved" : "Tap to Speak"}
                        </p>
                    </div>

                    {/* Submit Action */}
                    {recordedBlob && !grievance && (
                        <div className="mt-8 pt-6 border-t border-neutral-700">
                            <button
                                onClick={handleSubmit}
                                disabled={isProcessing}
                                className="w-full bg-orange-600 hover:bg-orange-500 text-white py-4 rounded-xl font-bold text-xl shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader className="w-6 h-6 animate-spin" /> Processing Audio...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-6 h-6" /> Submit Complaint
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Result */}
                    {grievance && (
                        <div className="mt-8 bg-neutral-900/80 rounded-xl p-6 border border-orange-500/30 animate-fade-in-up">
                            <div className="flex items-center gap-2 mb-4 text-green-400 font-bold">
                                <CheckCircle className="w-5 h-5" /> Complaint Registered Successfully
                            </div>

                            <div className="space-y-4">
                                <div className="bg-neutral-800 p-4 rounded-lg">
                                    <div className="text-xs font-bold text-neutral-500 uppercase mb-1">Transcript ({grievance.detected_language})</div>
                                    <p className="text-neutral-200 italic">"{grievance.transcript}"</p>
                                </div>

                                <div className="bg-neutral-800 p-4 rounded-lg border-l-4 border-orange-500">
                                    <div className="text-xs font-bold text-neutral-500 uppercase mb-1">AI Summary</div>
                                    <p className="text-white font-medium">{grievance.summary}</p>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-neutral-400">Category: <span className="text-orange-400">{grievance.category}</span></span>
                                    <span className="text-neutral-400">ID: <span className="font-mono text-neutral-300">{grievance.id.split('-')[0]}...</span></span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VoiceGrievancePage;
