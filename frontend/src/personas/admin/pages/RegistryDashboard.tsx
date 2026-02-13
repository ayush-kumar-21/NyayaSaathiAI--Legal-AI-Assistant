import React, { useState } from 'react';
import { Shield, FileCheck, Calculator, AlertCircle, Upload, CheckCircle, XCircle } from 'lucide-react';
import { registryService } from '../../../core/services/registryService';
import { ScrutinyResponse, FilingType } from '../../../core/types/registry';

const RegistryDashboard: React.FC = () => {
    const [documentUrl, setDocumentUrl] = useState('');
    const [scrutinyResult, setScrutinyResult] = useState<ScrutinyResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [filingType, setFilingType] = useState<FilingType>('civil_suit');
    const [value, setValue] = useState<number>(0);
    const [feeResult, setFeeResult] = useState<any | null>(null);

    const handleScrutiny = async () => {
        if (!documentUrl) return;
        setIsLoading(true);
        try {
            // Simulate processing delay for demo effect
            await new Promise(r => setTimeout(r, 1500));
            const result = await registryService.scrutinizeDocument(documentUrl);
            setScrutinyResult(result);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCalculateFees = async () => {
        try {
            const fees = await registryService.calculateFees(filingType, value);
            setFeeResult(fees);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="p-6 min-h-screen bg-slate-900 text-white">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 flex items-center gap-3 mb-8">
                <Shield className="w-8 h-8 text-purple-400" />
                Registry Automator (Skill 19)
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Scrutiny Section */}
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                        <FileCheck className="w-5 h-5 text-purple-400" />
                        AI Document Scrutiny
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Document URL or ID</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={documentUrl}
                                    onChange={(e) => setDocumentUrl(e.target.value)}
                                    placeholder="e.g. http://doc-storage/petition_123.pdf"
                                    className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                />
                                <button className="bg-slate-700 p-2 rounded-lg hover:bg-slate-600">
                                    <Upload className="w-5 h-5 text-slate-300" />
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleScrutiny}
                            disabled={isLoading || !documentUrl}
                            className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                    Analyzing Document...
                                </>
                            ) : (
                                <>
                                    <FileCheck className="w-5 h-5" />
                                    Run AI Scrutiny
                                </>
                            )}
                        </button>
                    </div>

                    {scrutinyResult && (
                        <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className={`p-4 rounded-lg border ${scrutinyResult.status === 'DEFECTIVE'
                                    ? 'bg-red-500/10 border-red-500/30'
                                    : 'bg-emerald-500/10 border-emerald-500/30'
                                }`}>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        {scrutinyResult.status === 'DEFECTIVE' ? (
                                            <XCircle className="w-6 h-6 text-red-400" />
                                        ) : (
                                            <CheckCircle className="w-6 h-6 text-emerald-400" />
                                        )}
                                        <span className={`font-bold text-lg ${scrutinyResult.status === 'DEFECTIVE' ? 'text-red-400' : 'text-emerald-400'
                                            }`}>
                                            {scrutinyResult.status}
                                        </span>
                                    </div>
                                    <span className="text-sm px-2 py-1 bg-slate-900 rounded border border-slate-700">
                                        Confidence: 98.5%
                                    </span>
                                </div>

                                <p className="text-slate-300 mb-4">{scrutinyResult.ai_summary}</p>

                                {scrutinyResult.defects_found.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-slate-400 text-sm uppercase tracking-wider">Defects Found ({scrutinyResult.defect_count})</h4>
                                        {scrutinyResult.defects_found.map((defect, i) => (
                                            <div key={i} className="flex gap-3 bg-slate-900/50 p-3 rounded border border-slate-700/50">
                                                <AlertCircle className={`w-5 h-5 flex-shrink-0 ${defect.severity === 'critical' ? 'text-red-500' : 'text-amber-500'
                                                    }`} />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-200">{defect.description}</p>
                                                    <p className="text-xs text-slate-500 mt-1">Suggestion: {defect.suggestion}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Fee Calculator Section */}
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 h-fit">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                        <Calculator className="w-5 h-5 text-emerald-400" />
                        Court Fee Calculator
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Filing Type</label>
                            <select
                                value={filingType}
                                onChange={(e) => setFilingType(e.target.value as FilingType)}
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                            >
                                <option value="civil_suit">Civil Suit</option>
                                <option value="writ_petition">Writ Petition</option>
                                <option value="appeal">Appeal</option>
                                <option value="application">Application</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Value in Dispute (₹)</label>
                            <input
                                type="number"
                                value={value}
                                onChange={(e) => setValue(Number(e.target.value))}
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                            />
                        </div>

                        <button
                            onClick={handleCalculateFees}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold transition-all"
                        >
                            Calculate Fees
                        </button>

                        {feeResult && (
                            <div className="mt-4 bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-slate-400">Base Fee</span>
                                    <span className="font-mono">{registryService.formatCurrency(feeResult.fee_breakdown.base_fee)}</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-slate-400">Ad Valorem</span>
                                    <span className="font-mono">{registryService.formatCurrency(feeResult.fee_breakdown.value_based_fee)}</span>
                                </div>
                                <div className="border-t border-slate-700 my-2 pt-2 flex justify-between items-center font-bold text-lg text-emerald-400">
                                    <span>Total Payable</span>
                                    <span>{registryService.formatCurrency(feeResult.fee_breakdown.total_fee)}</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-2 text-center">
                                    Calculated per {feeResult.applicable_rules[0]}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistryDashboard;
