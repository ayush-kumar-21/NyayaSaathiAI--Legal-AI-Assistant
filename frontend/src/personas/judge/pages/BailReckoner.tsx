import React, { useState } from 'react';
import {
    Scale,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Shield,
    User,
    Activity,
    Gavel
} from 'lucide-react';
import bailReckonerService from '../../../core/services/bailReckonerService';
import { BailReport, RiskLevel, BailRecommendation } from '../../../core/types/bailReckoner';

const BailReckoner: React.FC = () => {
    // Form State
    const [caseId, setCaseId] = useState('');
    const [accusedId, setAccusedId] = useState('');
    const [offenses, setOffenses] = useState('');
    const [priorConvictions, setPriorConvictions] = useState(0);
    const [isFlightRisk, setIsFlightRisk] = useState(false);
    const [isTamperingRisk, setIsTamperingRisk] = useState(false);

    // Result State
    const [report, setReport] = useState<BailReport | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleAnalyze = async () => {
        if (!caseId || !accusedId || !offenses) return;
        setIsLoading(true);
        try {
            const data = await bailReckonerService.analyzeBail({
                case_id: caseId,
                accused_id: accusedId,
                offenses: offenses.split(',').map(s => s.trim()),
                prior_convictions: priorConvictions,
                is_flight_risk: isFlightRisk,
                is_witness_tampering_risk: isTamperingRisk
            });
            setReport(data);
        } catch (error) {
            console.error("Analysis failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getRiskColor = (level: RiskLevel) => {
        switch (level) {
            case RiskLevel.CRITICAL: return 'text-red-500 bg-red-500/10 border-red-500/20';
            case RiskLevel.HIGH: return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
            case RiskLevel.MEDIUM: return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            case RiskLevel.LOW: return 'text-green-500 bg-green-500/10 border-green-500/20';
            default: return 'text-slate-500';
        }
    };

    const RecommendationBadge = ({ rec }: { rec: BailRecommendation }) => {
        let color = 'bg-slate-500';
        let icon = <Scale className="w-5 h-5" />;
        let text = 'Decision Pending';

        if (rec === BailRecommendation.GRANT) {
            color = 'bg-green-600';
            icon = <CheckCircle className="w-5 h-5" />;
            text = 'GRANT BAIL';
        } else if (rec === BailRecommendation.GRANT_WITH_CONDITIONS) {
            color = 'bg-yellow-600';
            icon = <Shield className="w-5 h-5" />;
            text = 'GRANT WITH CONDITIONS';
        } else if (rec === BailRecommendation.REJECT) {
            color = 'bg-red-600';
            icon = <XCircle className="w-5 h-5" />;
            text = 'REJECT BAIL';
        }

        return (
            <div className={`${color} text-white px-6 py-3 rounded-lg flex items-center gap-3 font-bold text-lg shadow-lg`}>
                {icon} {text}
            </div>
        );
    };

    return (
        <div className="p-6 min-h-screen bg-neutral-900 text-neutral-100 font-sans">
            <header className="mb-8 border-b border-neutral-800 pb-6">
                <h1 className="text-3xl font-serif font-bold flex items-center gap-3 text-emerald-500">
                    <Scale className="w-8 h-8" />
                    Bail Reckoner (Nyaya Mitra)
                </h1>
                <p className="text-neutral-400 mt-2 font-serif text-lg italic">
                    Algorithmic risk assessment for bail decisions under BNSS Section 479/480.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Input Panel */}
                <div className="lg:col-span-4 bg-neutral-800 p-6 rounded-xl border border-neutral-700 h-fit sticky top-6">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-emerald-400">
                        <Activity className="w-5 h-5" /> Case Parameters
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-neutral-500 mb-1">Case CNR / Case ID</label>
                            <input
                                type="text"
                                value={caseId}
                                onChange={(e) => setCaseId(e.target.value)}
                                className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 w-full text-neutral-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-neutral-500 mb-1">Accused ID</label>
                            <input
                                type="text"
                                value={accusedId}
                                onChange={(e) => setAccusedId(e.target.value)}
                                className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 w-full text-neutral-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-neutral-500 mb-1">Offense Sections (comma separated)</label>
                            <input
                                type="text"
                                placeholder="e.g. BNS 303(2), BNS 109"
                                value={offenses}
                                onChange={(e) => setOffenses(e.target.value)}
                                className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 w-full text-neutral-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>

                        <div className="pt-4 border-t border-neutral-700">
                            <label className="block text-sm font-bold text-neutral-500 mb-2">Aggravating Factors</label>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between bg-neutral-900 p-3 rounded-lg border border-neutral-700">
                                    <span className="text-sm">Prior Convictions</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={priorConvictions}
                                        onChange={(e) => setPriorConvictions(parseInt(e.target.value))}
                                        className="w-16 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-center"
                                    />
                                </div>
                                <div className="flex items-center gap-3 bg-neutral-900 p-3 rounded-lg border border-neutral-700">
                                    <input
                                        type="checkbox"
                                        checked={isFlightRisk}
                                        onChange={(e) => setIsFlightRisk(e.target.checked)}
                                        className="w-4 h-4 rounded border-neutral-600 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <span className="text-sm">Flight Risk (No local roots)</span>
                                </div>
                                <div className="flex items-center gap-3 bg-neutral-900 p-3 rounded-lg border border-neutral-700">
                                    <input
                                        type="checkbox"
                                        checked={isTamperingRisk}
                                        onChange={(e) => setIsTamperingRisk(e.target.checked)}
                                        className="w-4 h-4 rounded border-neutral-600 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <span className="text-sm">Witness Tampering Risk</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={isLoading}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg font-bold shadow-lg shadow-emerald-900/50 transition-all mt-4 disabled:opacity-50"
                        >
                            {isLoading ? 'Analyzing Risks...' : 'Calculate Eligibility'}
                        </button>
                    </div>
                </div>

                {/* Results Panel */}
                <div className="lg:col-span-8 space-y-6">
                    {report ? (
                        <>
                            {/* Top Summary Card */}
                            <div className="bg-neutral-800 rounded-xl p-8 border border-neutral-700 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Analysis Result</h2>
                                    <p className="text-neutral-400">Risk Score: <span className="text-white font-bold text-xl">{report.overall_risk_score}/100</span></p>
                                </div>
                                <RecommendationBadge rec={report.recommendation} />
                            </div>

                            {/* Detailed Analysis Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Offense Details */}
                                <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
                                    <h3 className="font-bold text-lg mb-4 text-emerald-400 flex items-center gap-2">
                                        <Gavel className="w-5 h-5" /> Offense Profile
                                    </h3>
                                    <ul className="space-y-3 text-sm">
                                        <li className="flex justify-between border-b border-neutral-700 pb-2">
                                            <span className="text-neutral-400">Nature:</span>
                                            <span className="font-bold">{report.is_bailable_offense ? 'Bailable' : 'Non-Bailable'}</span>
                                        </li>
                                        <li className="flex justify-between border-b border-neutral-700 pb-2">
                                            <span className="text-neutral-400">Max Punishment:</span>
                                            <span className="font-bold">{report.max_punishment_years} Years</span>
                                        </li>
                                        <li className="flex justify-between border-b border-neutral-700 pb-2">
                                            <span className="text-neutral-400">Charges:</span>
                                            <span className="font-mono text-emerald-300">{report.offenses.join(", ")}</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Risk Scores */}
                                <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
                                    <h3 className="font-bold text-lg mb-4 text-emerald-400 flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5" /> Risk Breakdown
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span>Flight Risk</span>
                                                <span>{report.flight_risk_score}%</span>
                                            </div>
                                            <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-red-500" style={{ width: `${report.flight_risk_score}%` }}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span>Repeat Offense Risk</span>
                                                <span>{report.criminal_history_score}%</span>
                                            </div>
                                            <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-orange-500" style={{ width: `${report.criminal_history_score}%` }}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span>Tampering Risk</span>
                                                <span>{report.tampering_risk_score}%</span>
                                            </div>
                                            <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-yellow-500" style={{ width: `${report.tampering_risk_score}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Risk Factors List */}
                            {report.risk_factors.length > 0 && (
                                <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
                                    <h3 className="font-bold text-lg mb-4 text-white">Identified Risk Factors</h3>
                                    <div className="grid gap-3">
                                        {report.risk_factors.map((factor, idx) => (
                                            <div key={idx} className={`p-4 rounded-lg border ${getRiskColor(factor.risk_level)} flex items-center justify-between`}>
                                                <div>
                                                    <span className="font-bold block text-sm uppercase mb-1">{factor.category}</span>
                                                    <span>{factor.description}</span>
                                                </div>
                                                <div className="font-bold text-xs uppercase px-2 py-1 rounded bg-black/20">
                                                    {factor.risk_level}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Suggested Conditions */}
                            {report.suggested_conditions.length > 0 && (
                                <div className="bg-emerald-500/10 p-6 rounded-xl border border-emerald-500/20">
                                    <h3 className="font-bold text-lg mb-4 text-emerald-400 flex items-center gap-2">
                                        <Shield className="w-5 h-5" /> Suggested Conditions
                                    </h3>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {report.suggested_conditions.map((cond, idx) => (
                                            <li key={idx} className="flex items-center gap-3 bg-neutral-900/50 p-3 rounded-lg border border-emerald-500/10">
                                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                <span className="text-neutral-200">{cond}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="text-center text-xs text-neutral-500 mt-4">
                                Disclaimer: This tool provides suggestions based on data heuristics. Final discretion lies with the Hon'ble Court.
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center bg-neutral-800/50 rounded-xl border-2 border-dashed border-neutral-700 p-12 text-neutral-500">
                            <Scale className="w-16 h-16 mb-4 opacity-20" />
                            <h3 className="text-xl font-bold mb-2">Awaiting Input</h3>
                            <p>Fill in the case parameters on the left to generate an analysis report.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BailReckoner;
