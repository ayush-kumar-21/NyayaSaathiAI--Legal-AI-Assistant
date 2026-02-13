import React, { useState, useEffect, useRef } from 'react';
import {
    Share2,
    Search,
    AlertOctagon,
    Link as LinkIcon,
    User,
    FileText,
    Target
} from 'lucide-react';
import caseLinkerService from '../../../core/services/caseLinkerService';
import { CaseLinkResponse, PatternType, LinkStrength } from '../../../core/types/caseLinker';

const CaseLinker: React.FC = () => {
    const [caseId, setCaseId] = useState('');
    const [data, setData] = useState<CaseLinkResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Very basic force-directed graph info (in real app, use d3 or react-force-graph)
    // We will just render nodes in a circle for now to demonstrate connectivity

    const analyzeCase = async () => {
        if (!caseId) return;
        setIsLoading(true);
        try {
            const result = await caseLinkerService.analyzeCase(caseId);
            setData(result);
        } catch (error) {
            console.error("Analysis failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStrengthColor = (strength: LinkStrength) => {
        switch (strength) {
            case LinkStrength.CONFIRMED: return 'bg-red-500';
            case LinkStrength.HIGH: return 'bg-orange-500';
            case LinkStrength.MEDIUM: return 'bg-yellow-500';
            default: return 'bg-slate-500';
        }
    };

    return (
        <div className="p-6 min-h-screen bg-slate-900 text-white">
            <header className="mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
                    <Share2 className="w-8 h-8 text-purple-400" />
                    Case Linker & Pattern Detection
                </h1>
                <p className="text-slate-400 mt-2">
                    Advanced graph analysis to detect serial offenders and modus operandi clusters.
                </p>
            </header>

            <div className="flex gap-4 mb-8 bg-slate-800 p-4 rounded-xl border border-slate-700">
                <input
                    type="text"
                    placeholder="Enter Focal Case ID (e.g., FIR-2025-001)"
                    value={caseId}
                    onChange={(e) => setCaseId(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 w-96 text-white"
                />
                <button
                    onClick={analyzeCase}
                    disabled={isLoading}
                    className="bg-purple-600 hover:bg-purple-500 px-6 py-2 rounded-lg transition-colors flex items-center gap-2 font-semibold disabled:opacity-50"
                >
                    {isLoading ? 'Analyzing...' : (
                        <>
                            <Search className="w-4 h-4" /> Analyze Connections
                        </>
                    )}
                </button>
            </div>

            {data ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Graph Visualization Area */}
                    <div className="lg:col-span-2 bg-slate-800 rounded-xl p-6 border border-slate-700 min-h-[500px] flex flex-col relative overflow-hidden">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Share2 className="w-5 h-5 text-purple-400" />
                            Crime Graph
                        </h2>

                        {/* Mock Graph Visualization */}
                        <div className="flex-1 bg-slate-900/50 rounded-lg relative border border-slate-700/50 flex items-center justify-center p-10">
                            {/* Central Node */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                                <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center border-4 border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.4)] animate-pulse">
                                    <div className="text-center">
                                        <FileText className="w-8 h-8 mx-auto mb-1" />
                                        <span className="text-xs font-bold">{data.case_id}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Satellite Nodes */}
                            {data.graph.nodes.filter(n => n.id !== data.case_id).map((node, i, arr) => {
                                const angle = (i / arr.length) * 2 * Math.PI;
                                const radius = 180;
                                const x = Math.cos(angle) * radius;
                                const y = Math.sin(angle) * radius;

                                // Node Icon
                                let Icon = AlertOctagon;
                                if (node.type === 'Suspect') Icon = User;
                                if (node.type === 'MO') Icon = Target;

                                return (
                                    <div
                                        key={node.id}
                                        className="absolute z-10 flex flex-col items-center"
                                        style={{
                                            transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
                                            top: '50%',
                                            left: '50%'
                                        }}
                                    >
                                        <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 border-slate-600 bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer group`}>
                                            <Icon className="w-6 h-6 text-slate-300 group-hover:text-white" />
                                        </div>
                                        <div className="bg-slate-900 border border-slate-600 px-2 py-1 rounded text-xs mt-2 whitespace-nowrap">
                                            {node.label}
                                        </div>

                                        {/* Connector Line (In a real implementation, SVG lines would be used) */}
                                        <div
                                            className="absolute w-1 bg-slate-700"
                                            style={{
                                                height: '140px',
                                                top: '50%',
                                                left: '50%',
                                                transformOrigin: 'top center',
                                                transform: `rotate(${angle + Math.PI / 2}rad) translateX(-50%)`,
                                                zIndex: -1,
                                                opacity: 0.3
                                            }}
                                        ></div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-4 flex gap-4 justify-center">
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <span className="w-3 h-3 rounded-full bg-purple-600"></span> Focal Case
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <span className="w-3 h-3 rounded-full bg-slate-700 border border-slate-500"></span> Linked Entity
                            </div>
                        </div>
                    </div>

                    {/* Alerts Panel */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <AlertOctagon className="w-5 h-5 text-red-400" />
                                Pattern Alerts
                            </h2>
                            <div className="space-y-4">
                                {data.patterns.length > 0 ? (
                                    data.patterns.map(alert => (
                                        <div key={alert.id} className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-red-200 text-sm">{alert.title}</h3>
                                                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                                                    {(alert.confidence_score * 100).toFixed(0)}% CONF
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-300 mb-2">{alert.description}</p>
                                            <div className="text-xs bg-slate-900/50 p-2 rounded text-slate-400">
                                                <span className="font-bold block mb-1">Recommendation:</span>
                                                {alert.recommended_action}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-slate-500 text-center py-4">No critical patterns detected</div>
                                )}
                            </div>
                        </div>

                        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <LinkIcon className="w-5 h-5 text-blue-400" />
                                Similar Cases
                            </h2>
                            <div className="space-y-3">
                                {data.similar_cases.length > 0 ? (
                                    data.similar_cases.map((scItem, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer border border-transparent hover:border-slate-600">
                                            <div>
                                                <div className="font-mono text-sm font-semibold text-blue-300">{scItem.id}</div>
                                                <div className="text-xs text-slate-400">{scItem.reason}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-white">{(scItem.similarity * 100).toFixed(0)}%</div>
                                                <div className="text-[10px] text-slate-500 uppercase">Match</div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-slate-500 text-center py-4">No similar cases found</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-20 bg-slate-800/30 rounded-xl border border-dashed border-slate-700 text-slate-500">
                    <Share2 className="w-20 h-20 mb-6 opacity-20" />
                    <h2 className="text-2xl font-bold mb-2">Ready to Analyze</h2>
                    <p>Enter a Case ID above to detect connections and patterns.</p>
                </div>
            )}
        </div>
    );
};

export default CaseLinker;
