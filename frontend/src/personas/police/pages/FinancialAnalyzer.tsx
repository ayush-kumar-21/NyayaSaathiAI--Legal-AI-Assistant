import React, { useState, useMemo } from 'react';
import {
    Network,
    AlertTriangle,
    TrendingUp,
    Search,
    Loader2,
    ShieldAlert,
    ArrowRight,
    Banknote,
    Activity,
    Eye
} from 'lucide-react';
import { policeService } from '../../../core/services/policeService';
import { FinancialAnalysisResponse, AnomalyAlert } from '../../../core/types/financial';

const FinancialAnalyzer: React.FC = () => {
    const [analysis, setAnalysis] = useState<FinancialAnalysisResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const runDemoAnalysis = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await policeService.testFinancialAnalysis();
            setAnalysis(result);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Analysis failed. Is the backend running?');
        } finally {
            setIsLoading(false);
        }
    };

    const riskStats = useMemo(() => {
        if (!analysis) return null;
        return {
            totalVolume: analysis.metrics?.total_volume || 0,
            txnCount: analysis.metrics?.transaction_count || 0,
            riskScore: analysis.metrics?.risk_score || 0,
            anomalyCount: analysis.anomalies?.length || 0,
            leadCount: analysis.leads?.length || 0,
            nodeCount: analysis.network?.nodes?.length || 0,
            edgeCount: analysis.network?.edges?.length || 0,
        };
    }, [analysis]);

    return (
        <div className="p-6 min-h-screen bg-slate-900 text-white">
            {/* Header */}
            <header className="mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center gap-3">
                    <Network className="w-8 h-8 text-emerald-400" />
                    Financial Trail Analyzer (Skill 02)
                </h1>
                <p className="text-slate-400 mt-2">
                    Graph-based network analysis for financial crime detection
                </p>
            </header>

            {/* Action Bar */}
            {!analysis && (
                <div className="max-w-2xl mx-auto text-center py-16">
                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-700 shadow-xl">
                        <Activity className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3">Transaction Network Analysis</h2>
                    <p className="text-slate-400 mb-8 max-w-md mx-auto">
                        Uses DFS cycle detection and pattern matching to identify circular trading,
                        money layering, and structuring in financial transaction data.
                    </p>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-6 inline-flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <button
                        onClick={runDemoAnalysis}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 mx-auto disabled:opacity-50 transition-all shadow-lg hover:shadow-emerald-500/25"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Analyzing Transaction Graph...
                            </>
                        ) : (
                            <>
                                <Search className="w-5 h-5" />
                                Run Demo Analysis (5 Transactions)
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Results */}
            {analysis && riskStats && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                        <StatCard label="Volume" value={policeService.formatCurrency(riskStats.totalVolume)} color="emerald" />
                        <StatCard label="Transactions" value={riskStats.txnCount} color="blue" />
                        <StatCard label="Network Nodes" value={riskStats.nodeCount} color="cyan" />
                        <StatCard label="Connections" value={riskStats.edgeCount} color="purple" />
                        <StatCard label="Anomalies" value={riskStats.anomalyCount} color={riskStats.anomalyCount > 0 ? 'red' : 'green'} />
                        <StatCard label="Leads" value={riskStats.leadCount} color="amber" />
                        <StatCard label="Risk Score" value={`${riskStats.riskScore}/100`} color={riskStats.riskScore > 50 ? 'red' : 'green'} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Anomalies Panel */}
                        <div className="lg:col-span-7 space-y-4">
                            <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700 shadow-xl">
                                <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                                    <ShieldAlert className="w-5 h-5 text-red-400" />
                                    Detected Anomalies ({analysis.anomalies.length})
                                </h2>
                                {analysis.anomalies.length === 0 ? (
                                    <p className="text-slate-500 italic text-sm">No anomalies detected in this dataset.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {analysis.anomalies.map((anomaly, idx) => (
                                            <AnomalyCard key={anomaly.id || idx} anomaly={anomaly} />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Network Visualization (Simplified) */}
                            <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700 shadow-xl">
                                <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                                    <Network className="w-5 h-5 text-cyan-400" />
                                    Transaction Network
                                </h2>
                                <div className="space-y-2">
                                    {analysis.network.edges.map((edge, idx) => (
                                        <div key={idx} className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-xl border border-slate-800 text-sm">
                                            <span className="font-mono text-blue-300 bg-blue-500/10 px-2 py-1 rounded">{edge.source}</span>
                                            <ArrowRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
                                            <span className="font-mono text-purple-300 bg-purple-500/10 px-2 py-1 rounded">{edge.target}</span>
                                            <span className="ml-auto font-bold text-emerald-400">
                                                {policeService.formatCurrency(edge.amount || 0)}
                                            </span>
                                            <span className="text-slate-500 text-xs">
                                                ({edge.transactions} txn{edge.transactions > 1 ? 's' : ''})
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Panel: Leads + Entities */}
                        <div className="lg:col-span-5 space-y-4">
                            {/* Investigation Leads */}
                            <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700 shadow-xl">
                                <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                                    <Eye className="w-5 h-5 text-amber-400" />
                                    Investigation Leads
                                </h2>
                                {analysis.leads.length === 0 ? (
                                    <p className="text-slate-500 italic text-sm">No investigation leads generated.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {analysis.leads.map((lead, idx) => (
                                            <div key={idx} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                                                <div className="flex items-start gap-3">
                                                    <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm flex-shrink-0">
                                                        {lead.priority}
                                                    </span>
                                                    <div>
                                                        <h3 className="font-bold text-white text-sm">{lead.title}</h3>
                                                        <p className="text-slate-400 text-xs mt-1 leading-relaxed">{lead.description}</p>
                                                        <div className="mt-2 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2">
                                                            <p className="text-amber-300 text-xs font-medium">
                                                                ⚡ {lead.recommended_action}
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-wrap gap-1 mt-2">
                                                            {lead.accounts_to_investigate.map((acc, i) => (
                                                                <span key={i} className="font-mono text-[10px] bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-slate-400">
                                                                    {acc}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Entities */}
                            <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700 shadow-xl">
                                <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                                    <Banknote className="w-5 h-5 text-blue-400" />
                                    Network Entities ({analysis.network.nodes.length})
                                </h2>
                                <div className="space-y-2">
                                    {analysis.network.nodes.map((node) => (
                                        <div key={node.id} className="flex items-center justify-between bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                                            <div>
                                                <p className="font-medium text-sm text-white">{node.label}</p>
                                                <p className="text-xs text-slate-500 font-mono">{node.id} · {node.properties?.bank || 'N/A'}</p>
                                            </div>
                                            <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full border ${policeService.getRiskColor(node.risk_level)}`}>
                                                {node.risk_level}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4">
                                <p className="text-emerald-300 text-sm leading-relaxed">
                                    📊 {analysis.summary}
                                </p>
                            </div>

                            {/* Re-run */}
                            <button
                                onClick={() => setAnalysis(null)}
                                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl font-medium transition-colors text-sm"
                            >
                                ← Run New Analysis
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ── Sub-components ──

const StatCard: React.FC<{ label: string; value: string | number; color: string }> = ({ label, value, color }) => (
    <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-3 border border-slate-700 text-center">
        <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{label}</p>
        <p className={`text-lg font-bold text-${color}-400`}>{value}</p>
    </div>
);

const AnomalyCard: React.FC<{ anomaly: AnomalyAlert }> = ({ anomaly }) => (
    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 hover:border-red-500/30 transition-colors">
        <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <h3 className="font-bold text-sm text-white">{anomaly.title}</h3>
            </div>
            <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full border ${policeService.getRiskColor(anomaly.risk_level)}`}>
                {anomaly.risk_level}
            </span>
        </div>
        <p className="text-slate-400 text-xs leading-relaxed mb-2">{anomaly.description}</p>
        <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>Type: <span className="text-slate-300 font-mono">{anomaly.type}</span></span>
            <span>Confidence: <span className="text-emerald-400 font-bold">{policeService.formatConfidence(anomaly.confidence_score)}</span></span>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
            {anomaly.affected_accounts.map((acc, i) => (
                <span key={i} className="font-mono text-[10px] bg-red-500/10 border border-red-500/20 text-red-300 px-2 py-0.5 rounded">
                    {acc}
                </span>
            ))}
        </div>
    </div>
);

export default FinancialAnalyzer;
