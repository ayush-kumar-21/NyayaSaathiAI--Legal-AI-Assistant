import React, { useState } from 'react';
import {
    PieChart, FileText, Search, Filter,
    ArrowRight, Binary, ScanEye
} from 'lucide-react';

const DocumentAnalysisPage: React.FC = () => {
    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <PieChart className="w-8 h-8 text-purple-500" />
                    Document Analysis
                </h1>
                <p className="text-slate-400 mt-1">
                    Deep learning analysis of case documents, evidence, and filings.
                </p>
            </div>

            {/* Search/Filter Bar */}
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search document content, ID, or case number..."
                        className="w-full bg-slate-800 border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700">
                    <Filter className="w-4 h-4" />
                    Filters
                </button>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800/40 border border-slate-700/50 hover:border-purple-500/50 p-6 rounded-xl transition-all group cursor-pointer">
                    <div className="p-3 bg-purple-500/20 rounded-lg w-fit mb-4">
                        <Binary className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">Semantic Search</h3>
                    <p className="text-sm text-slate-400 mb-4">
                        Search across millions of documents using natural language queries powered by Vector Embeddings.
                    </p>
                    <ArrowRight className="w-5 h-5 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </div>

                <div className="bg-slate-800/40 border border-slate-700/50 hover:border-purple-500/50 p-6 rounded-xl transition-all group cursor-pointer">
                    <div className="p-3 bg-blue-500/20 rounded-lg w-fit mb-4">
                        <ScanEye className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Fraud Detection</h3>
                    <p className="text-sm text-slate-400 mb-4">
                        Identify forged documents, manipulated images, and inconsistent statements automatically.
                    </p>
                    <ArrowRight className="w-5 h-5 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </div>

                <div className="bg-slate-800/40 border border-slate-700/50 hover:border-purple-500/50 p-6 rounded-xl transition-all group cursor-pointer">
                    <div className="p-3 bg-emerald-500/20 rounded-lg w-fit mb-4">
                        <FileText className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">Auto-Summarization</h3>
                    <p className="text-sm text-slate-400 mb-4">
                        Generate concise summaries of lengthy judgments and petitions with key legal points extracted.
                    </p>
                    <ArrowRight className="w-5 h-5 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>

            {/* Recent Analysis Table */}
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl overflow-hidden p-6 text-center text-slate-500">
                <p>Select a tool above to begin analysis.</p>
            </div>
        </div>
    );
};

export default DocumentAnalysisPage;
