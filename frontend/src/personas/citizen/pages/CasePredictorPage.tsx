import React, { useState, useEffect } from 'react';
import {
    TrendingUp, Calculator, Calendar, AlertTriangle,
    CheckCircle, Scale, DollarSign, ChevronRight,
    Info, ArrowLeft, BarChart2, Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { RadialBarChart, RadialBar, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';
import { useCitizenTranslation } from '../../../features/citizen/hooks/useCitizenTranslation';
import AnimatedPageWrapper from '../../../features/main/components/common/AnimatedPageWrapper';
import { motion, AnimatePresence } from 'framer-motion';

// ==========================================
// TYPES
// ==========================================
interface CaseDetails {
    caseType: 'criminal' | 'civil' | 'family' | 'property' | 'consumer';
    subType: string;
    courtType: 'district' | 'high' | 'supreme' | 'consumer_forum';
    evidenceStrength: 1 | 2 | 3 | 4 | 5;
    lawyerExperience: 'junior' | 'mid' | 'senior' | 'expert';
    caseValue?: number; // For civil/property
}

interface PredictionResult {
    winProbability: number; // 0-100
    timeline: {
        minMonths: number;
        maxMonths: number;
        confidence: number;
    };
    costEstimate: {
        min: number;
        max: number;
    };
    settlementLikelihood: number; // 0-100
    similarCasesCount: number;
}

// ==========================================
// MOCK AI SERVICE (Simulating Backend)
// ==========================================
const simulatePrediction = async (details: CaseDetails): Promise<PredictionResult> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Logic to vary results based on inputs
            const baseProb = details.evidenceStrength * 15 + (details.lawyerExperience === 'expert' ? 20 : 0);
            const winProb = Math.min(Math.max(baseProb + Math.random() * 10, 20), 95);

            resolve({
                winProbability: Math.floor(winProb),
                timeline: {
                    minMonths: details.caseType === 'civil' ? 12 : 6,
                    maxMonths: details.caseType === 'civil' ? 36 : 18,
                    confidence: 85
                },
                costEstimate: {
                    min: details.caseValue ? details.caseValue * 0.05 : 15000,
                    max: details.caseValue ? details.caseValue * 0.15 : 50000
                },
                settlementLikelihood: details.caseType === 'family' ? 70 : 30,
                similarCasesCount: Math.floor(Math.random() * 1000) + 50
            });
        }, 2000); // 2s loading simulation
    });
};

// ==========================================
// COMPONENTS
// ==========================================

const WinProbabilityGauge: React.FC<{ probability: number }> = ({ probability }) => {
    const data = [
        { name: 'Win Probability', value: probability, fill: probability > 70 ? '#10b981' : probability > 40 ? '#f59e0b' : '#ef4444' },
        { name: 'Max', value: 100, fill: '#1e293b' } // Background track
    ];

    return (
        <div className="relative h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                    innerRadius="70%"
                    outerRadius="100%"
                    barSize={20}
                    data={data}
                    startAngle={180}
                    endAngle={0}
                >
                    <RadialBar
                        background
                        dataKey="value"
                        cornerRadius={10}
                    />
                </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/3 text-center">
                <p className="text-4xl font-bold text-white">{probability}%</p>
                <p className="text-sm text-slate-400">Success Rate</p>
            </div>
        </div>
    );
};

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================
const CasePredictorPage: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useCitizenTranslation(); // Assuming hook works or fallback
    const [step, setStep] = useState<'input' | 'analyzing' | 'results'>('input');
    const [details, setDetails] = useState<CaseDetails>({
        caseType: 'criminal',
        subType: '',
        courtType: 'district',
        evidenceStrength: 3,
        lawyerExperience: 'mid'
    });
    const [result, setResult] = useState<PredictionResult | null>(null);

    const handlePredict = async () => {
        setStep('analyzing');
        try {
            const data = await simulatePrediction(details);
            setResult(data);
            setStep('results');
        } catch (error) {
            console.error(error);
            setStep('input');
        }
    };

    return (
        <AnimatedPageWrapper>
            <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">

                {/* HEADER */}
                <header className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => step === 'results' ? setStep('input') : navigate('/citizen/home')}
                        className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                            <TrendingUp className="w-8 h-8 text-indigo-400" />
                            Case Status Predictor
                        </h1>
                        <p className="text-slate-400">AI-powered insights based on 1.2M+ historical case records</p>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {/* STEP 1: INPUT FORM */}
                    {step === 'input' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid md:grid-cols-2 gap-8"
                        >
                            <div className="space-y-6">
                                <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50">
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                        <Scale className="w-5 h-5 text-indigo-400" /> Case Details
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm text-slate-400 mb-1">Case Type</label>
                                            <select
                                                className="w-full bg-slate-800 border-slate-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
                                                value={details.caseType}
                                                onChange={(e) => setDetails({ ...details, caseType: e.target.value as any })}
                                            >
                                                <option value="criminal">Criminal (BNS/IPC)</option>
                                                <option value="civil">Civil Suit</option>
                                                <option value="family">Family/Matrimonial</option>
                                                <option value="property">Property Dispute</option>
                                                <option value="consumer">Consumer Complaint</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-slate-400 mb-1">Court Level</label>
                                            <select
                                                className="w-full bg-slate-800 border-slate-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
                                                value={details.courtType}
                                                onChange={(e) => setDetails({ ...details, courtType: e.target.value as any })}
                                            >
                                                <option value="district">District Court</option>
                                                <option value="high">High Court</option>
                                                <option value="consumer_forum">Consumer Forum</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50">
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-emerald-400" /> Strength Factors
                                    </h3>

                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex justify-between mb-2">
                                                <label className="text-sm text-slate-400">Evidence Strength</label>
                                                <span className={`text-sm font-bold ${details.evidenceStrength > 3 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                                    {details.evidenceStrength}/5
                                                </span>
                                            </div>
                                            <input
                                                type="range" min="1" max="5"
                                                value={details.evidenceStrength}
                                                onChange={(e) => setDetails({ ...details, evidenceStrength: parseInt(e.target.value) as any })}
                                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                            />
                                            <p className="text-xs text-slate-500 mt-1">1 = Oral only, 5 = Forensic/Documentary proof</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-slate-400 mb-2">Legal Representation</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {(['junior', 'mid', 'senior', 'expert'] as const).map((level) => (
                                                    <button
                                                        key={level}
                                                        onClick={() => setDetails({ ...details, lawyerExperience: level })}
                                                        className={`p-2 rounded-lg text-sm border transition-all ${details.lawyerExperience === level
                                                            ? 'bg-indigo-600 border-indigo-500 text-white'
                                                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}`}
                                                    >
                                                        {level.charAt(0).toUpperCase() + level.slice(1)} ({level === 'expert' ? '15+' : level === 'senior' ? '10+' : level === 'mid' ? '5+' : '<5'} yrs)
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handlePredict}
                                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
                                >
                                    <BarChart2 className="w-5 h-5" /> Analyze Case Probability
                                </button>
                            </div>

                            {/* RIGHT SIDE: INFO */}
                            <div className="hidden md:block space-y-6">
                                <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 p-6 rounded-2xl">
                                    <h3 className="text-lg font-semibold text-indigo-300 mb-2">How it works?</h3>
                                    <p className="text-slate-300 text-sm leading-relaxed mb-4">
                                        Our AI analyzes over 1.2 million publicly available judgments (eCourts data) to find patterns similar to your case.
                                    </p>
                                    <ul className="space-y-3">
                                        {[
                                            'Win probability based on case type & court trends',
                                            'Estimated timeline for final verdict',
                                            'Likelihood of out-of-court settlement',
                                            'Projected legal costs'
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                                                <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                                    <div className="flex items-center gap-3 mb-3">
                                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                                        <h4 className="font-semibold text-amber-500">Disclaimer</h4>
                                    </div>
                                    <p className="text-xs text-slate-400">
                                        This tool provides AI-generated ESTIMATES only. It does not guarantee any legal outcome. Always consult a qualified advocate for legal advice.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: ANALYZING */}
                    {step === 'analyzing' && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center min-h-[400px] text-center"
                        >
                            <div className="relative w-32 h-32 mb-8">
                                <div className="absolute inset-0 border-4 border-indigo-900/50 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
                                <Scale className="absolute inset-0 m-auto text-indigo-400 w-12 h-12" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Analyzing Similar Cases...</h2>
                            <p className="text-slate-400">Comparing your details with {Math.floor(Math.random() * 5000) + 1000} records</p>
                        </motion.div>
                    )}

                    {/* STEP 3: RESULTS */}
                    {step === 'results' && result && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="grid lg:grid-cols-3 gap-6"
                        >
                            {/* MAIN GAUGE */}
                            <div className="lg:col-span-1 bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50 flex flex-col items-center justify-center">
                                <h3 className="text-lg font-medium text-slate-300 mb-4">Estimated Win Probability</h3>
                                <WinProbabilityGauge probability={result.winProbability} />
                                <div className="mt-6 text-center">
                                    <p className="text-sm text-slate-400">Based on {result.similarCasesCount} similar cases</p>
                                    <div className="flex gap-2 justify-center mt-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${result.winProbability > 60 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                            {result.winProbability > 60 ? 'Favorable' : 'Moderate Risk'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* DETAILS GRID */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {/* TIMELINE */}
                                    <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                                                <Calendar className="w-5 h-5" />
                                            </div>
                                            <h4 className="font-semibold text-slate-200">Timeline</h4>
                                        </div>
                                        <p className="text-2xl font-bold text-white">{result.timeline.minMonths}-{result.timeline.maxMonths} <span className="text-sm font-normal text-slate-400">months</span></p>
                                        <div className="w-full bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                                            <div className="bg-blue-500 h-full rounded-full" style={{ width: '60%' }}></div>
                                        </div>
                                    </div>

                                    {/* COST */}
                                    <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-pink-500/20 rounded-lg text-pink-400">
                                                <DollarSign className="w-5 h-5" />
                                            </div>
                                            <h4 className="font-semibold text-slate-200">Est. Cost</h4>
                                        </div>
                                        <p className="text-2xl font-bold text-white">₹{(result.costEstimate.min / 1000).toFixed(1)}k - {(result.costEstimate.max / 1000).toFixed(1)}k</p>
                                        <p className="text-xs text-slate-500 mt-1">Includes court fees & lawyer charges</p>
                                    </div>
                                </div>

                                {/* RECOMMENDATIONS */}
                                <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 p-6 rounded-2xl border border-emerald-500/20">
                                    <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5" /> AI Recommendations
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-xl">
                                            <div className="mt-1 min-w-[6px] h-1.5 rounded-full bg-emerald-500"></div>
                                            <p className="text-sm text-slate-200">
                                                {result.winProbability > 70
                                                    ? "Strong case detected. Proceed with filing immediately to preserve evidence relevance."
                                                    : "Moderate case strength. Consider collecting more documentary evidence before filing."}
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-xl">
                                            <div className="mt-1 min-w-[6px] h-1.5 rounded-full bg-blue-500"></div>
                                            <p className="text-sm text-slate-200">
                                                {result.settlementLikelihood > 50
                                                    ? "High chance of settlement. Mediation could save you 8-12 months."
                                                    : "Litigation likely necessary. Prepare for court procedures."}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 mt-6">
                                        <button onClick={() => navigate('/citizen/file')} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition-colors">
                                            Proceed to File Case
                                        </button>
                                        <button className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl text-sm transition-colors">
                                            Contact Legal Aid
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </AnimatedPageWrapper>
    );
};

export default CasePredictorPage;
