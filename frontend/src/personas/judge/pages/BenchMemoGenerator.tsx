import React, { useState } from 'react';
import {
    FileText,
    Search,
    BookOpen,
    Gavel,
    Scale,
    Clock,
    Printer,
    Download
} from 'lucide-react';
import benchMemoService from '../../../core/services/benchMemoService';
import { BenchMemo } from '../../../core/types/benchMemo';

const BenchMemoGenerator: React.FC = () => {
    const [caseId, setCaseId] = useState('');
    const [focusArea, setFocusArea] = useState('');
    const [memo, setMemo] = useState<BenchMemo | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const generateMemo = async () => {
        if (!caseId) return;
        setIsLoading(true);
        try {
            const data = await benchMemoService.generateMemo({
                case_id: caseId,
                focus_area: focusArea || "General Admissibility"
            });
            setMemo(data);
        } catch (error) {
            console.error("Generation failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 min-h-screen bg-neutral-900 text-neutral-100 font-sans">
            <header className="mb-8 border-b border-neutral-800 pb-6">
                <h1 className="text-3xl font-serif font-bold flex items-center gap-3 text-amber-500">
                    <Scale className="w-8 h-8" />
                    Bench Memo Generator (Nyaya Mitra)
                </h1>
                <p className="text-neutral-400 mt-2 font-serif text-lg italic">
                    AI-assisted judicial summaries, precedent analysis, and legal reasoning support.
                </p>
            </header>

            {!memo ? (
                <div className="flex flex-col items-center justify-center max-w-2xl mx-auto bg-neutral-800 p-10 rounded-xl shadow-2xl border border-neutral-700 mt-10">
                    <div className="bg-amber-500/10 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                        <Gavel className="w-10 h-10 text-amber-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3 text-amber-100">Prepare New Bench Memo</h2>
                    <p className="text-neutral-400 mb-8 text-center">
                        Enter a Case CNR or Filing Number to instantly generate a comprehensive legal brief, including case facts, issues, and relevant precedents.
                    </p>

                    <div className="w-full space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-neutral-500 mb-1">Case Identifier</label>
                            <input
                                type="text"
                                placeholder="e.g., CRL-APP-2025-045"
                                value={caseId}
                                onChange={(e) => setCaseId(e.target.value)}
                                className="bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 w-full text-neutral-100 focus:ring-2 focus:ring-amber-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-neutral-500 mb-1">Focus Area (Optional)</label>
                            <input
                                type="text"
                                placeholder="e.g., Bail, Admissibility of Electronic Evidence"
                                value={focusArea}
                                onChange={(e) => setFocusArea(e.target.value)}
                                className="bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 w-full text-neutral-100 focus:ring-2 focus:ring-amber-500 outline-none"
                            />
                        </div>

                        <button
                            onClick={generateMemo}
                            disabled={isLoading || !caseId}
                            className="w-full bg-amber-600 hover:bg-amber-500 text-white py-3 rounded-lg font-bold text-lg shadow-lg shadow-amber-900/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                            {isLoading ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Analyzing Case Files...
                                </>
                            ) : (
                                <>
                                    <BookOpen className="w-5 h-5" /> Generate Brief
                                </>
                            )}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Document View */}
                    <div className="lg:col-span-9 bg-neutral-100 text-neutral-900 rounded-lg shadow-2xl min-h-[800px] flex flex-col font-serif">
                        {/* Header */}
                        <div className="bg-neutral-200 border-b border-neutral-300 p-8 text-center relative">
                            <div className="absolute top-4 right-4 text-xs text-neutral-500 font-sans font-bold flex flex-col items-end">
                                <span>CONFIDENTIAL</span>
                                <span>FOR JUDICIAL USE ONLY</span>
                            </div>
                            <h2 className="text-3xl font-bold mb-2 uppercase tracking-wide">Bench Memorandum</h2>
                            <p className="text-lg font-bold text-neutral-700">Re: Case No. {memo.case_id}</p>
                            <p className="text-sm text-neutral-600 mt-1">Generated: {new Date(memo.created_at).toLocaleDateString()}</p>
                        </div>

                        {/* Content */}
                        <div className="p-10 space-y-8 flex-1">

                            <section>
                                <h3 className="text-xl font-bold border-b-2 border-neutral-400 pb-2 mb-4 uppercase tracking-wider text-neutral-700 flex items-center gap-2">
                                    <FileText className="w-5 h-5" /> Executive Summary
                                </h3>
                                <p className="text-lg leading-relaxed text-neutral-800 text-justify">
                                    {memo.case_summary}
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-bold border-b-2 border-neutral-400 pb-2 mb-4 uppercase tracking-wider text-neutral-700 flex items-center gap-2">
                                    <Clock className="w-5 h-5" /> Procedural History
                                </h3>
                                <p className="text-lg leading-relaxed text-neutral-800">
                                    {memo.procedural_history}
                                </p>
                            </section>

                            <section>
                                <h3 className="text-xl font-bold border-b-2 border-neutral-400 pb-2 mb-4 uppercase tracking-wider text-neutral-700 flex items-center gap-2">
                                    <Scale className="w-5 h-5" /> Legal Issues & Analysis
                                </h3>
                                <div className="space-y-6">
                                    {memo.legal_issues.map((issue, idx) => (
                                        <div key={idx} className="bg-neutral-50 p-6 rounded border-l-4 border-amber-500 shadow-sm">
                                            <h4 className="font-bold text-lg mb-2 text-amber-900">Issue: {issue.issue}</h4>
                                            <div className="mb-2">
                                                <span className="font-bold text-neutral-600 text-sm uppercase">Rule of Law:</span>
                                                <p className="font-mono text-sm bg-neutral-200 inline-block px-2 py-1 rounded ml-2">{issue.rule_of_law}</p>
                                            </div>
                                            <p className="text-neutral-800 mb-3">{issue.analysis}</p>
                                            <div className="bg-amber-100 p-3 rounded font-bold text-amber-900">
                                                Conclusion: {issue.conclusion}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h3 className="text-xl font-bold border-b-2 border-neutral-400 pb-2 mb-4 uppercase tracking-wider text-neutral-700 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5" /> Relevant Precedents
                                </h3>
                                <div className="grid gap-4">
                                    {memo.precedents.map((prec, idx) => (
                                        <div key={idx} className="border border-neutral-300 p-4 rounded hover:bg-neutral-50 transition-colors">
                                            <h4 className="font-bold text-lg text-indigo-900 underline decoration-indigo-300 underline-offset-4">{prec.title}</h4>
                                            <p className="text-sm font-bold text-neutral-500 mb-2">{prec.citation}</p>
                                            <p className="mb-2 italic text-neutral-700">"{prec.summary}"</p>
                                            <p className="text-sm font-bold text-amber-700">Relevance: {prec.relevance}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h3 className="text-xl font-bold border-b-2 border-neutral-400 pb-2 mb-4 uppercase tracking-wider text-neutral-700 flex items-center gap-2">
                                    <Gavel className="w-5 h-5" /> Recommended Ruling
                                </h3>
                                <div className="bg-neutral-800 text-neutral-100 p-6 rounded-lg text-lg leading-relaxed shadow-inner font-sans">
                                    {memo.recommended_ruling}
                                </div>
                            </section>

                        </div>

                        {/* Footer */}
                        <div className="bg-neutral-200 p-4 text-center text-xs text-neutral-500 font-sans">
                            Generated by NyayaSahayak AI (Nyaya Mitra Module) • Verify all citations before use.
                        </div>
                    </div>

                    {/* Sidebar Actions */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700 sticky top-6">
                            <h3 className="font-bold text-amber-500 mb-4 uppercase text-sm tracking-wider">Actions</h3>
                            <button className="w-full bg-neutral-700 hover:bg-neutral-600 text-neutral-200 py-3 rounded-lg flex items-center justify-center gap-2 mb-3 shadow-lg transition-all font-bold">
                                <Printer className="w-5 h-5" /> Print Brief
                            </button>
                            <button className="w-full bg-neutral-700 hover:bg-neutral-600 text-neutral-200 py-3 rounded-lg flex items-center justify-center gap-2 mb-3 shadow-lg transition-all font-bold">
                                <Download className="w-5 h-5" /> Download PDF
                            </button>
                            <hr className="border-neutral-700 my-4" />
                            <div className="text-sm text-neutral-400">
                                <p className="mb-2"><strong>Status:</strong> <span className="text-green-400 uppercase font-bold">{memo.status}</span></p>
                                <p><strong>Model:</strong> Legal-BERT-v2</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BenchMemoGenerator;
