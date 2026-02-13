
import React, { useState } from 'react';
import { Video, Mic, FileText, User, MessageSquare, Shield } from 'lucide-react';

const VirtualCourtPage: React.FC = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState<string[]>([
        "Judge: Case number 4421 is now in session.",
        "Prosecutor: Your Honor, the accused was found with the stolen property.",
        "Defense: Objection, the search was conducted without a warrant."
    ]);

    const toggleRecording = () => {
        setIsRecording(!isRecording);
        if (!isRecording) {
            // Mock adding new lines
            setTimeout(() => setTranscript(prev => [...prev, "Judge: Objection overruled. Proceed."]), 2000);
        }
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col gap-4 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Video className="w-6 h-6 text-blue-400" />
                        Virtual Courtroom #4
                    </h1>
                    <p className="text-slate-400">Case: State vs. Raj Kumar (Theft)</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-red-500/10 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-500/20">
                        <Shield className="w-4 h-4" />
                        End Session
                    </button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
                {/* Video Grid */}
                <div className="col-span-8 grid grid-rows-2 gap-4">
                    {/* Main Feed (Judge/Witness) */}
                    <div className="bg-black rounded-xl border border-slate-700 relative overflow-hidden group">
                        <img src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800"
                            alt="Judge View" className="w-full h-full object-cover opacity-80" />
                        <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded text-white text-sm">
                            Hon. Justice Sharma
                        </div>
                        <div className="absolute top-4 right-4 flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-xs text-red-500 font-bold">LIVE</span>
                        </div>
                    </div>

                    {/* Participants Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-900 rounded-xl border border-slate-700 relative overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                                <User className="w-16 h-16 text-slate-600" />
                            </div>
                            <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-1 rounded text-white text-xs">
                                Defense Counsel
                            </div>
                        </div>
                        <div className="bg-slate-900 rounded-xl border border-slate-700 relative overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                                <User className="w-16 h-16 text-slate-600" />
                            </div>
                            <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-1 rounded text-white text-xs">
                                Prosecutor
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Transcription & Controls */}
                <div className="col-span-4 flex flex-col gap-4">
                    {/* Live Transcript */}
                    <div className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl p-4 flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-white flex items-center gap-2">
                                <FileText className="w-4 h-4 text-blue-400" />
                                AI Transcription
                            </h3>
                            <button
                                onClick={toggleRecording}
                                className={`p-2 rounded-full ${isRecording ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-400'}`}
                            >
                                <Mic className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                            {transcript.map((line, i) => (
                                <p key={i} className="text-slate-300 text-sm p-2 bg-slate-800/50 rounded hover:bg-slate-800 transition-colors">
                                    <span className="text-blue-400 font-bold mr-1">
                                        {line.split(':')[0]}:
                                    </span>
                                    {line.split(':')[1]}
                                </p>
                            ))}
                            {isRecording && (
                                <div className="flex gap-2 items-center text-slate-500 text-xs italic">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" />
                                    Listening...
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="h-40 bg-slate-900/50 border border-slate-700 rounded-xl p-4">
                        <h3 className="font-semibold text-white mb-3">Judicial Actions</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <button className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded text-xs font-medium">
                                Issue Warrant
                            </button>
                            <button className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded text-xs font-medium">
                                Adjourn Case
                            </button>
                            <button className="bg-amber-600 hover:bg-amber-500 text-white p-2 rounded text-xs font-medium col-span-2">
                                Auto-Draft Order (AI)
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VirtualCourtPage;
