import React, { useState } from 'react';
import {
    FilePlus, Search, Edit3, Trash2, Plus,
    FileText, CheckSquare, AlertCircle, DollarSign
} from 'lucide-react';

const MOCK_TEMPLATES = [
    {
        id: '1',
        name: 'Civil Suit (Original)',
        type: 'Civil',
        baseFee: 1500,
        requiredDocs: ['Plaint', 'Vakalatnama', 'Affidavit'],
        lastModified: '2025-01-15'
    },
    {
        id: '2',
        name: 'Writ Petition (Civil)',
        type: 'Constitutional',
        baseFee: 1000,
        requiredDocs: ['Petition', 'Affidavit', 'Annexures'],
        lastModified: '2025-02-10'
    },
    {
        id: '3',
        name: 'Bail Application',
        type: 'Criminal',
        baseFee: 500,
        requiredDocs: ['Application', 'FIR Copy', 'Vakalatnama'],
        lastModified: '2025-02-11'
    }
];

const RegistryTemplates: React.FC = () => {
    const [templates, setTemplates] = useState(MOCK_TEMPLATES);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTemplates = templates.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <FilePlus className="w-8 h-8 text-indigo-500" />
                        Filing Templates
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Manage reusable templates for common case filings and defects.
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold shadow-lg shadow-indigo-500/20 transition-all">
                    <Plus className="w-4 h-4" />
                    Create Template
                </button>
            </div>

            {/* Search & Filter */}
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search templates..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-800 border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    />
                </div>
                <select className="bg-slate-800 border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                    <option value="all">All Types</option>
                    <option value="civil">Civil</option>
                    <option value="criminal">Criminal</option>
                </select>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                    <div
                        key={template.id}
                        className="group bg-slate-800/40 border border-slate-700/50 hover:border-indigo-500/50 rounded-xl p-6 transition-all hover:bg-slate-800/60"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-indigo-500/20 rounded-lg text-indigo-400">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                                    <Edit3 className="w-4 h-4" />
                                </button>
                                <button className="p-2 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">
                            {template.name}
                        </h3>
                        <span className="inline-block px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-300 mb-4">
                            {template.type}
                        </span>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <DollarSign className="w-4 h-4 text-emerald-500" />
                                <span>Base Fee: ₹{template.baseFee}</span>
                            </div>
                            <div className="flex items-start gap-2 text-sm text-slate-400">
                                <CheckSquare className="w-4 h-4 text-blue-500 mt-0.5" />
                                <span>{template.requiredDocs.length} Required Docs</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-500">
                            <span>Last modified: {template.lastModified}</span>
                            <button className="text-indigo-400 font-medium hover:underline">Use Template →</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create New Prompt (Empty State) */}
            <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all cursor-pointer group">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Plus className="w-6 h-6 text-slate-400 group-hover:text-indigo-400" />
                </div>
                <h3 className="font-bold text-white mb-1">Create Custom Template</h3>
                <p className="text-sm text-slate-400">Define fees, document checklists, and validation rules.</p>
            </div>
        </div>
    );
};

export default RegistryTemplates;
