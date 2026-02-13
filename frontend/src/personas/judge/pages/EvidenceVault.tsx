import React, { useState } from 'react';
import { Briefcase, Search, FileText, Shield, AlertTriangle } from 'lucide-react';
import { VisualEvidencePanel } from '../../../shared/components/VisualEvidencePanel';

const MOCK_CASES = [
    { id: '1', title: 'State vs. Ramesh Kumar', cnr: 'DLCT/2025/00123', type: 'Criminal' },
    { id: '2', title: 'Priya Devi vs. Municipal Corp', cnr: 'DLCT/2025/00156', type: 'Civil' },
    { id: '3', title: 'State vs. Suresh Patel', cnr: 'DLCT/2025/00089', type: 'Criminal' },
];

const EvidenceVault: React.FC = () => {
    const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCases = MOCK_CASES.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.cnr.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedCase = MOCK_CASES.find(c => c.id === selectedCaseId);

    return (
        <div className="flex h-[calc(100vh-8rem)] gap-6">
            {/* Sidebar: Case Selector */}
            <div className="w-80 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-800">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
                        <Briefcase className="w-5 h-5 text-amber-500" /> Case Evidence
                    </h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search Cases..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {filteredCases.map(c => (
                        <button
                            key={c.id}
                            onClick={() => setSelectedCaseId(c.id)}
                            className={`w-full text-left p-3 rounded-lg transition-all border ${selectedCaseId === c.id
                                    ? 'bg-amber-500/10 border-amber-500/50'
                                    : 'bg-transparent border-transparent hover:bg-slate-800'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${selectedCaseId === c.id ? 'bg-amber-500 text-black' : 'bg-slate-700 text-slate-400'}`}>
                                    {c.type}
                                </span>
                                {selectedCaseId === c.id && <Shield className="w-3 h-3 text-amber-500" />}
                            </div>
                            <p className={`font-medium text-sm truncate ${selectedCaseId === c.id ? 'text-white' : 'text-slate-300'}`}>
                                {c.title}
                            </p>
                            <p className="text-xs text-slate-500 truncate">{c.cnr}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content: Visual Evidence Panel */}
            <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
                {selectedCase ? (
                    <div className="h-full flex flex-col">
                        <div className="p-4 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-1">{selectedCase.title}</h2>
                                <p className="text-sm text-slate-400">Viewing Evidence Locker • Secured by Blockchain</p>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-bold animate-pulse">
                                <AlertTriangle className="w-3 h-3" />
                                CHAIN OF CUSTODY ACTIVE
                            </div>
                        </div>
                        <div className="flex-1 overflow-hidden p-4">
                            <VisualEvidencePanel />
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500">
                        <Shield className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-lg">Select a case to view secured evidence</p>
                        <p className="text-sm opacity-60">Authentication required for access</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EvidenceVault;
