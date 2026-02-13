import React, { useState } from 'react';
import { Gavel, Search, Filter, BookOpen, Scale, ArrowRight, ExternalLink } from 'lucide-react';

const SentencingPrecedents: React.FC = () => {
    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                    <Gavel className="w-8 h-8 text-amber-500" />
                    Sentencing Precedents
                </h1>
                <p className="text-slate-400 mt-1">
                    Search and compare similar cases to ensure consistent sentencing
                </p>
            </header>

            {/* Search Bar */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6 rounded-xl shadow-lg">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by offense (e.g., BNS 303), keyword, or case law..."
                            className="w-full bg-slate-900/50 border border-slate-600 text-slate-200 pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-lg"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select className="bg-slate-900/50 border border-slate-600 text-slate-300 px-4 py-3 rounded-lg focus:outline-none hover:bg-slate-800">
                            <option>High Court</option>
                            <option>Supreme Court</option>
                            <option>District Court</option>
                        </select>
                        <select className="bg-slate-900/50 border border-slate-600 text-slate-300 px-4 py-3 rounded-lg focus:outline-none hover:bg-slate-800">
                            <option>Last 5 Years</option>
                            <option>Last 10 Years</option>
                            <option>All Time</option>
                        </select>
                        <button className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg shadow-amber-900/20">
                            Search
                        </button>
                    </div>
                </div>

                {/* Active Filters */}
                <div className="flex gap-2 mt-4">
                    <span className="text-xs bg-slate-700/50 text-slate-300 px-3 py-1 rounded-full border border-slate-600 flex items-center gap-2">
                        BNS 103(1) <span className="cursor-pointer hover:text-white">×</span>
                    </span>
                    <span className="text-xs bg-slate-700/50 text-slate-300 px-3 py-1 rounded-full border border-slate-600 flex items-center gap-2">
                        Murder <span className="cursor-pointer hover:text-white">×</span>
                    </span>
                    <span className="text-xs text-amber-500 hover:text-amber-400 cursor-pointer flex items-center gap-1 px-2 py-1">
                        <Filter className="w-3 h-3" /> Advanced Filters
                    </span>
                </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Case List */}
                <div className="lg:col-span-2 space-y-4">
                    {[
                        { title: 'State vs. Rajesh Kumar', year: 2024, court: 'Supreme Court', citation: '2024 SCC 123', offense: 'Murder (BNS 103)', outcome: 'Life Imprisonment', similarity: 98 },
                        { title: 'Amit Singh vs. State of UP', year: 2023, court: 'Allahabad High Court', citation: '2023 All 456', offense: 'Culpable Homicide', outcome: '10 Years Rigorous', similarity: 85 },
                        { title: 'Narendra vs. State', year: 2022, court: 'Delhi High Court', citation: '2022 Del 789', offense: 'Murder (IPC 302)', outcome: 'Acquitted', similarity: 72 },
                    ].map((item, i) => (
                        <div key={i} className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5 hover:bg-slate-800/50 hover:border-amber-500/30 transition-all cursor-pointer group">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-lg font-bold text-amber-100 group-hover:text-amber-400 transition-colors flex items-center gap-2">
                                        <Scale className="w-4 h-4 text-slate-500" />
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-slate-400">{item.court} • {item.year} • {item.citation}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${item.similarity > 90 ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                        {item.similarity}% Match
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-4 my-3 text-sm">
                                <span className="bg-slate-900/50 px-3 py-1.5 rounded border border-slate-700 text-slate-300">
                                    <span className="text-slate-500 mr-2">Offense:</span>{item.offense}
                                </span>
                                <span className="bg-slate-900/50 px-3 py-1.5 rounded border border-slate-700 text-slate-300">
                                    <span className="text-slate-500 mr-2">Outcome:</span>{item.outcome}
                                </span>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-between items-center">
                                <div className="flex gap-2">
                                    <span className="text-xs bg-slate-700/30 text-slate-400 px-2 py-1 rounded">Heinous Crime</span>
                                    <span className="text-xs bg-slate-700/30 text-slate-400 px-2 py-1 rounded">Premeditated</span>
                                </div>
                                <button className="text-amber-500 text-sm font-medium flex items-center gap-1 hover:translate-x-1 transition-transform">
                                    View Judgment <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Analysis/Comparison Sidebar */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 h-fit sticky top-24">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-amber-500" />
                        Analysis
                    </h3>

                    <div className="space-y-6">
                        <div>
                            <h4 className="text-sm font-medium text-slate-400 mb-2">Sentencing Range</h4>
                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden flex">
                                <div className="w-[10%] bg-green-500/50" title="Acquittal"></div>
                                <div className="w-[30%] bg-amber-500/50" title="10-14 Years"></div>
                                <div className="w-[60%] bg-red-500/50" title="Life Imprisonment"></div>
                            </div>
                            <div className="flex justify-between text-xs text-slate-500 mt-1">
                                <span>Min</span>
                                <span>Avg: 14Y</span>
                                <span>Max: Life</span>
                            </div>
                        </div>

                        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                            <h4 className="text-sm font-medium text-amber-400 mb-2">Key Precedent</h4>
                            <p className="text-xs text-slate-300 leading-relaxed mb-3">
                                "In cases of premeditated murder under BNS 103, life imprisonment is the rule, and death penalty is the exception..."
                            </p>
                            <a href="#" className="text-xs text-amber-500 hover:text-amber-400 flex items-center gap-1">
                                Bachan Singh vs State of Punjab <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>

                        <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg transition-colors border border-slate-600 hover:border-slate-500">
                            Add to Sentencing Draft
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SentencingPrecedents;
