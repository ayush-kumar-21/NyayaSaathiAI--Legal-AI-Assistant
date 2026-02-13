import React, { useState, useEffect } from 'react';
import {
    Shield,
    FileText,
    Lock,
    Unlock,
    Activity,
    CheckCircle,
    AlertTriangle,
    Upload,
    Search
} from 'lucide-react';
import evidenceService from '../../../core/services/evidenceService';
import { Evidence, EvidenceResponse, EvidenceType } from '../../../core/types/evidence';

const EvidenceLocker: React.FC = () => {
    const [caseId, setCaseId] = useState('');
    const [evidenceList, setEvidenceList] = useState<Evidence[]>([]);
    const [selectedEvidence, setSelectedEvidence] = useState<EvidenceResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDetailsLoading, setIsDetailsLoading] = useState(false);

    const fetchEvidence = async () => {
        if (!caseId) return;
        setIsLoading(true);
        try {
            const data = await evidenceService.listCaseEvidence(caseId);
            setEvidenceList(data);
            setSelectedEvidence(null);
        } catch (error) {
            console.error("Failed to fetch evidence", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDetails = async (id: string) => {
        setIsDetailsLoading(true);
        try {
            const data = await evidenceService.getEvidenceDetails(id);
            setSelectedEvidence(data);
        } catch (error) {
            console.error("Failed to fetch details", error);
        } finally {
            setIsDetailsLoading(false);
        }
    };

    return (
        <div className="p-6 min-h-screen bg-slate-900 text-white">
            <header className="mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
                    <Shield className="w-8 h-8 text-indigo-400" />
                    Digital Evidence Locker (Sakshya)
                </h1>
                <p className="text-slate-400 mt-2">
                    Blockchain-secured chain of custody for digital assets.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Panel: Search & List */}
                <div className="lg:col-span-1 bg-slate-800 rounded-xl p-6 border border-slate-700">
                    <div className="flex gap-2 mb-6">
                        <input
                            type="text"
                            placeholder="Enter Case ID (e.g., FIR-2025-001)"
                            value={caseId}
                            onChange={(e) => setCaseId(e.target.value)}
                            className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 w-full text-white"
                        />
                        <button
                            onClick={fetchEvidence}
                            className="bg-indigo-600 hover:bg-indigo-500 p-2 rounded-lg transition-colors"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="text-center py-10 text-slate-500">Loading assets...</div>
                        ) : evidenceList.length > 0 ? (
                            evidenceList.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => fetchDetails(item.id)}
                                    className={`p-4 rounded-lg cursor-pointer border transition-all ${selectedEvidence?.evidence.id === item.id
                                            ? 'bg-indigo-900/30 border-indigo-500'
                                            : 'bg-slate-700/30 border-slate-700 hover:border-slate-500'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-indigo-400" />
                                            <span className="font-semibold text-sm">{item.title}</span>
                                        </div>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${item.is_tampered ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                                            }`}>
                                            {item.is_tampered ? 'TAMPERED' : 'SECURE'}
                                        </span>
                                    </div>
                                    <div className="text-xs text-slate-400 flex justify-between">
                                        <span>{new Date(item.collection_date).toLocaleDateString()}</span>
                                        <span>{item.evidence_type}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-slate-500 border border-dashed border-slate-700 rounded-lg">
                                No evidence found or search not started
                            </div>
                        )}
                    </div>

                    {/* Placeholder Upload Button */}
                    <button className="w-full mt-6 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                        <Upload className="w-4 h-4" />
                        Upload New Evidence
                    </button>
                </div>

                {/* Right Panel: Details & Chain of Custody */}
                <div className="lg:col-span-2 space-y-6">
                    {selectedEvidence ? (
                        <>
                            {/* Evidence Header Card */}
                            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-2">{selectedEvidence.evidence.title}</h2>
                                        <p className="text-slate-400">{selectedEvidence.evidence.description}</p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/30">
                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                        <span className="text-green-400 font-mono font-bold">
                                            HASH VERIFIED
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="bg-slate-900/50 p-3 rounded-lg">
                                        <span className="text-xs text-slate-500 block mb-1">Type</span>
                                        <span className="font-mono text-sm">{selectedEvidence.evidence.evidence_type}</span>
                                    </div>
                                    <div className="bg-slate-900/50 p-3 rounded-lg">
                                        <span className="text-xs text-slate-500 block mb-1">Status</span>
                                        <span className="font-mono text-sm">{selectedEvidence.evidence.current_status}</span>
                                    </div>
                                    <div className="bg-slate-900/50 p-3 rounded-lg md:col-span-2">
                                        <span className="text-xs text-slate-500 block mb-1">Digital Fingerprint (SHA-256)</span>
                                        <span className="font-mono text-xs text-indigo-300 break-all">
                                            {selectedEvidence.evidence.file_hash}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Chain of Custody Timeline */}
                            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-indigo-400" />
                                    Chain of Custody
                                </h3>

                                <div className="space-y-0 relative">
                                    {/* Vertical Line */}
                                    <div className="absolute left-4 top-2 bottom-4 w-0.5 bg-slate-700"></div>

                                    {selectedEvidence.chain_of_custody.map((event, idx) => (
                                        <div key={event.id} className="relative pl-12 pb-8 group">
                                            {/* Integrity Dot */}
                                            <div className="absolute left-[11px] top-1 w-3 h-3 rounded-full bg-slate-900 border-2 border-indigo-500 group-hover:bg-indigo-500 transition-colors z-10"></div>

                                            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 hover:border-indigo-500/30 transition-all">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="font-bold text-indigo-100">{event.action.replace('_', ' ').toUpperCase()}</span>
                                                    <span className="text-xs text-slate-500 font-mono">
                                                        {new Date(event.timestamp).toLocaleString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-300 mb-2">
                                                    Performed by <span className="text-white font-semibold">{event.actor_name}</span> ({event.actor_role})
                                                </p>
                                                {event.comments && (
                                                    <p className="text-sm text-slate-400 italic">"{event.comments}"</p>
                                                )}
                                                <div className="mt-3 pt-3 border-t border-slate-700/50 flex gap-4 text-xs font-mono text-slate-500">
                                                    <span className="truncate max-w-[150px]" title={event.event_hash}>
                                                        Block: {event.event_hash.substring(0, 12)}...
                                                    </span>
                                                    <span className="flex items-center gap-1 text-green-500/70">
                                                        <Lock className="w-3 h-3" /> Ledger Secured
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 p-10 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
                            <Shield className="w-16 h-16 mb-4 opacity-20" />
                            <p className="text-lg">Select an evidence item to view its Chain of Custody</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EvidenceLocker;
