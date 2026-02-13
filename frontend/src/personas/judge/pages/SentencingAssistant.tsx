import React, { useState } from 'react';
import {
    Gavel,
    Scale,
    AlertTriangle,
    BookOpen,
    User,
    TrendingUp,
    TrendingDown,
    Activity
} from 'lucide-react';
import sentencingService from '../../../core/services/sentencingService';
import { SentencingReport, SentenceType } from '../../../core/types/sentencing';

const SentencingAssistant: React.FC = () => {
    // Form State
    const [caseId, setCaseId] = useState('');
    const [convictId, setConvictId] = useState('');
    const [offenses, setOffenses] = useState('');
    const [age, setAge] = useState(25);
    const [priorConvictions, setPriorConvictions] = useState(0);
    const [backgroundInfo, setBackgroundInfo] = useState('');

    // Result State
    const [report, setReport] = useState<SentencingReport | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleAnalyze = async () => {
        if (!caseId || !convictId || !offenses) return;
        setIsLoading(true);
        try {
            const data = await sentencingService.analyzeSentencing({
                case_id: caseId,
                convict_id: convictId,
                offenses: offenses.split(',').map(s => s.trim()),
                age,
                prior_convictions: priorConvictions,
                background_info: backgroundInfo
            });
            setReport(data);
        } catch (error) {
            console.error("Analysis failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 min-h-screen bg-neutral-900 text-neutral-100 font-sans">
            <header className="mb-8 border-b border-neutral-800 pb-6">
                <h1 className="text-3xl font-serif font-bold flex items-center gap-3 text-red-500">
                    <Gavel className="w-8 h-8" />
                    Sentencing Assistant (Nyaya Mitra)
                </h1>
                <p className="text-neutral-400 mt-2 font-serif text-lg italic">
                    AI-driven sentencing recommendations compliant with BNS guidelines and proportionality principles.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Input Panel */}
                <div className="lg:col-span-4 bg-neutral-800 p-6 rounded-xl border border-neutral-700 h-fit sticky top-6">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-red-400">
                        <User className="w-5 h-5" /> Convict Profile
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-neutral-500 mb-1">Case ID</label>
                            <input
                                type="text"
                                value={caseId}
                                onChange={(e) => setCaseId(e.target.value)}
                                className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 w-full text-neutral-100 focus:ring-2 focus:ring-red-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-neutral-500 mb-1">Convict ID / Name</label>
                            <input
                                type="text"
                                value={convictId}
                                onChange={(e) => setConvictId(e.target.value)}
                                className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 w-full text-neutral-100 focus:ring-2 focus:ring-red-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-neutral-500 mb-1">Convicted Sections (comma separated)</label>
                            <input
                                type="text"
                                placeholder="e.g. BNS 303(2)"
                                value={offenses}
                                onChange={(e) => setOffenses(e.target.value)}
                                className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 w-full text-neutral-100 focus:ring-2 focus:ring-red-500 outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-neutral-500 mb-1">Age</label>
                                <input
                                    type="number"
                                    min="10"
                                    value={age}
                                    onChange={(e) => setAge(parseInt(e.target.value))}
                                    className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 w-full text-neutral-100 focus:ring-2 focus:ring-red-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-neutral-500 mb-1">Priors</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={priorConvictions}
                                    onChange={(e) => setPriorConvictions(parseInt(e.target.value))}
                                    className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 w-full text-neutral-100 focus:ring-2 focus:ring-red-500 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-neutral-500 mb-1">Background / Remedial Actions</label>
                            <textarea
                                placeholder="e.g., Showed remorse, paid victim compensation..."
                                value={backgroundInfo}
                                onChange={(e) => setBackgroundInfo(e.target.value)}
                                className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 w-full text-neutral-100 min-h-[80px] focus:ring-2 focus:ring-red-500 outline-none"
                            />
                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={isLoading}
                            className="w-full bg-red-700 hover:bg-red-600 text-white py-3 rounded-lg font-bold shadow-lg shadow-red-900/50 transition-all mt-4 disabled:opacity-50"
                        >
                            {isLoading ? 'Calculating Quantum...' : 'Generate Sentence'}
                        </button>
                    </div>
                </div>

                {/* Results Panel */}
                <div className="lg:col-span-8 space-y-6">
                    {report ? (
                        <>
                            {/* Recommendation Card */}
                            <div className="bg-neutral-800 rounded-xl p-8 border border-neutral-700 shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 bg-red-600 text-white font-bold text-xs uppercase rounded-bl-xl shadow-lg">
                                    Judicial Guide
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <Scale className="w-8 h-8 text-red-500" /> Recommended Sentence
                                </h2>

                                <div className="flex flex-col md:flex-row items-center justify-center gap-8 bg-neutral-900/50 p-6 rounded-xl border border-neutral-700">
                                    <div className="text-center">
                                        <div className="text-sm text-neutral-400 mb-1 uppercase font-bold">Type</div>
                                        <div className="text-2xl font-bold text-white">{report.recommended_sentence.type.replace('_', ' ').toUpperCase()}</div>
                                    </div>

                                    <div className="h-10 w-px bg-neutral-700 hidden md:block"></div>

                                    <div className="text-center">
                                        <div className="text-sm text-neutral-400 mb-1 uppercase font-bold">Quantum</div>
                                        <div className="text-3xl font-bold text-red-400">
                                            {report.recommended_sentence.min_years} - {report.recommended_sentence.max_years} Years
                                        </div>
                                    </div>

                                    <div className="h-10 w-px bg-neutral-700 hidden md:block"></div>

                                    <div className="text-center">
                                        <div className="text-sm text-neutral-400 mb-1 uppercase font-bold">Fine</div>
                                        <div className="text-xl font-bold text-neutral-300">₹ {report.recommended_sentence.fine_amount.toLocaleString()}</div>
                                    </div>
                                </div>

                                <p className="mt-6 text-neutral-300 italic text-center p-4 bg-neutral-900/30 rounded border border-neutral-700/50">
                                    "{report.reasoning}"
                                </p>
                            </div>

                            {/* Factor Analysis */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Aggravating */}
                                <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
                                    <h3 className="font-bold text-lg mb-4 text-orange-400 flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5" /> Aggravating Factors
                                    </h3>
                                    {report.aggravating_factors.length > 0 ? (
                                        <ul className="space-y-3">
                                            {report.aggravating_factors.map((f, i) => (
                                                <li key={i} className="flex justify-between bg-neutral-900/50 p-3 rounded border border-orange-500/20">
                                                    <span className="text-sm">{f.description}</span>
                                                    <span className="font-bold text-xs bg-orange-900/50 px-2 py-1 rounded text-orange-200">+{f.weight}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="text-neutral-500 text-sm italic">None Identified</div>
                                    )}
                                </div>

                                {/* Mitigating */}
                                <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
                                    <h3 className="font-bold text-lg mb-4 text-emerald-400 flex items-center gap-2">
                                        <TrendingDown className="w-5 h-5" /> Mitigating Factors
                                    </h3>
                                    {report.mitigating_factors.length > 0 ? (
                                        <ul className="space-y-3">
                                            {report.mitigating_factors.map((f, i) => (
                                                <li key={i} className="flex justify-between bg-neutral-900/50 p-3 rounded border border-emerald-500/20">
                                                    <span className="text-sm">{f.description}</span>
                                                    <span className="font-bold text-xs bg-emerald-900/50 px-2 py-1 rounded text-emerald-200">-{f.weight}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="text-neutral-500 text-sm italic">None Identified</div>
                                    )}
                                </div>
                            </div>

                            {/* Comparison */}
                            <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
                                <h3 className="font-bold text-lg mb-4 text-white flex items-center gap-2">
                                    <Activity className="w-5 h-5" /> Statutory Limits vs Recommendation
                                </h3>
                                <div className="relative pt-6 pb-2">
                                    {/* Range Visualization */}
                                    <div className="h-4 bg-neutral-700 rounded-full relative w-full">
                                        {/* Statutory Range */}
                                        <div
                                            className="absolute h-full bg-neutral-600 rounded-full opacity-50"
                                            style={{ left: '0%', width: '100%' }} // Assuming 0-Max scale normalization for demo
                                            title="Statutory Range"
                                        ></div>

                                        {/* Recommended Range */}
                                        <div
                                            className="absolute top-[-4px] h-6 bg-red-500/50 border-2 border-red-500 rounded-lg shadow-lg"
                                            style={{
                                                left: `${(report.recommended_sentence.min_years / report.statutory_max.max_years) * 100}%`,
                                                width: `${((report.recommended_sentence.max_years - report.recommended_sentence.min_years) / report.statutory_max.max_years) * 100}%`,
                                                minWidth: '20px'
                                            }}
                                            title="Recommended Range"
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-neutral-400 mt-2 font-mono">
                                        <span>0 Yrs</span>
                                        <span>Statutory Max: {report.statutory_max.max_years} Yrs</span>
                                    </div>
                                </div>
                            </div>

                            {/* Precedents */}
                            <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
                                <h3 className="font-bold text-lg mb-4 text-white flex items-center gap-2">
                                    <BookOpen className="w-5 h-5" /> Relevant Sentencing Precedents
                                </h3>
                                <ul className="space-y-2">
                                    {report.precedents_cited.map((cite, i) => (
                                        <li key={i} className="text-sm text-neutral-300 flex items-start gap-2">
                                            <span className="text-red-500">•</span> {cite}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center bg-neutral-800/50 rounded-xl border-2 border-dashed border-neutral-700 p-12 text-neutral-500">
                            <Gavel className="w-16 h-16 mb-4 opacity-20" />
                            <h3 className="text-xl font-bold mb-2">Awaiting Input</h3>
                            <p>Enter conviction details to calculate guidelines.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SentencingAssistant;
