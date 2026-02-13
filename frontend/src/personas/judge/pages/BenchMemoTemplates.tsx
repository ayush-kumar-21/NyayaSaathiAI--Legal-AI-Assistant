import React, { useState } from 'react';
import { FileText, Plus, Search, Edit2, Copy, Trash2, Eye } from 'lucide-react';

interface Template {
    id: string;
    title: string;
    category: 'Criminal' | 'Civil' | 'Bail' | 'Appellate';
    lastUsed: string;
    sections: string[];
}

const BenchMemoTemplates: React.FC = () => {
    const [templates, setTemplates] = useState<Template[]>([
        { id: 't1', title: 'Bail Application Review', category: 'Bail', lastUsed: '2 days ago', sections: ['Facts', 'Arguments', 'Precedents', 'Risk Assessment', 'Conclusion'] },
        { id: 't2', title: 'Criminal Appeal Summary', category: 'Appellate', lastUsed: '5 days ago', sections: ['Procedural History', 'Grounds of Appeal', 'Issue Analysis', 'Judgment Recommendation'] },
        { id: 't3', title: 'Civil Suit First Hearing', category: 'Civil', lastUsed: '1 week ago', sections: ['Plaint Summary', 'Written Statement', 'Framing of Issues', 'Document Verification'] },
        { id: 't4', title: 'Witness Testimony Review', category: 'Criminal', lastUsed: '2 weeks ago', sections: ['Witness Details', 'Examination-in-Chief', 'Cross-Examination', 'Credibility Assessment'] },
    ]);

    const [filterCategory, setFilterCategory] = useState('All');

    const filteredTemplates = filterCategory === 'All'
        ? templates
        : templates.filter(t => t.category === filterCategory);

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <FileText className="w-8 h-8 text-amber-500" />
                        Bench Memo Templates
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Standardized templates for judicial note-taking and analysis
                    </p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white rounded-xl shadow-lg shadow-amber-900/20 font-medium transition-all transform hover:scale-105">
                    <Plus className="w-5 h-5" /> Create Template
                </button>
            </header>

            {/* Filter & Search */}
            <div className="flex flex-col md:flex-row gap-4 bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    {['All', 'Criminal', 'Civil', 'Bail', 'Appellate'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilterCategory(cat)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filterCategory === cat
                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search templates..."
                        className="w-full bg-slate-900/50 border border-slate-700 text-slate-300 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-amber-500/50"
                    />
                </div>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map(template => (
                    <div key={template.id} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 hover:border-amber-500/30 hover:bg-slate-800/60 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg">
                                <FileText className="w-8 h-8" />
                            </div>
                            <div className="text-right">
                                <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Last Used</span>
                                <span className="text-xs text-slate-300">{template.lastUsed}</span>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-200 transition-colors">{template.title}</h3>
                        <span className="inline-block px-2 py-1 bg-slate-700/50 text-slate-400 text-xs rounded mb-4 border border-slate-600/50">
                            {template.category}
                        </span>

                        <div className="space-y-2 mb-6">
                            {template.sections.slice(0, 3).map((section, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm text-slate-400">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                                    {section}
                                </div>
                            ))}
                            {template.sections.length > 3 && (
                                <div className="text-xs text-slate-500 pl-3.5">+ {template.sections.length - 3} more sections</div>
                            )}
                        </div>

                        <div className="flex gap-2 pt-4 border-t border-slate-700/50">
                            <button className="flex-1 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-medium transition-colors">
                                Use Template
                            </button>
                            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors" title="Edit">
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors" title="Preview">
                                <Eye className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Create New Card */}
                <button className="border-2 border-dashed border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-slate-500 hover:text-amber-400 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all gap-4 min-h-[300px]">
                    <div className="p-4 bg-slate-800 rounded-full group-hover:scale-110 transition-transform">
                        <Plus className="w-8 h-8" />
                    </div>
                    <span className="font-medium">Create New Template</span>
                </button>
            </div>
        </div>
    );
};

export default BenchMemoTemplates;
