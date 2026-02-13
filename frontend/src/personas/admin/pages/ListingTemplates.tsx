import React, { useState } from 'react';
import {
    Save, Plus, Copy, Trash2, Clock, Calendar,
    ArrowRight, Check, Edit3, Briefcase
} from 'lucide-react';

const MOCK_TEMPLATES = [
    {
        id: '1',
        name: 'Standard Civil Day',
        category: 'Civil',
        cases: 8,
        hours: 5.5,
        blocks: [
            { time: '10:00-11:30', type: 'Admission', count: 2 },
            { time: '11:30-13:00', type: 'Arguments', count: 2 },
            { time: '14:00-15:30', type: 'Evidence', count: 2 },
        ]
    },
    {
        id: '2',
        name: 'Criminal Trial Heavy',
        category: 'Criminal',
        cases: 5,
        hours: 5,
        blocks: [
            { time: '10:30-13:00', type: 'Trial/Evidence', count: 2 },
            { time: '14:00-16:00', type: 'Trial/Evidence', count: 2 },
            { time: '16:00-16:30', type: 'Bail Hearings', count: 5 },
        ]
    },
    {
        id: '3',
        name: 'Fast Track Misc',
        category: 'Fast Track',
        cases: 15,
        hours: 6,
        blocks: [
            { time: '10:00-11:00', type: 'Misc Hearing', count: 5 },
            { time: '11:00-13:00', type: 'Evidence', count: 5 },
            { time: '14:00-16:00', type: 'Arguments', count: 5 },
        ]
    }
];

const ListingTemplates: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredTemplates = selectedCategory === 'All'
        ? MOCK_TEMPLATES
        : MOCK_TEMPLATES.filter(t => t.category === selectedCategory);

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Save className="w-8 h-8 text-indigo-500" />
                        Schedule Templates
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Define reusable scheduling patterns to standardize court operations.
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold shadow-lg shadow-indigo-500/20 transition-all">
                    <Plus className="w-4 h-4" />
                    Create Template
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-700/50 pb-4">
                {['All', 'Civil', 'Criminal', 'Fast Track'].map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === cat
                                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTemplates.map(template => (
                    <div key={template.id} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 hover:border-indigo-500/30 transition-all group">

                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                                    {template.name}
                                </h3>
                                <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded mt-1 inline-block">
                                    {template.category}
                                </span>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-700">
                                    <Copy className="w-4 h-4" />
                                </button>
                                <button className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-700">
                                    <Edit3 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Basic Stats */}
                        <div className="flex items-center gap-4 mb-6 text-sm text-slate-300">
                            <div className="flex items-center gap-1.5">
                                <Briefcase className="w-4 h-4 text-slate-500" />
                                <span>{template.cases} Cases</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-slate-500" />
                                <span>{template.hours} Hours</span>
                            </div>
                        </div>

                        {/* Schedule Blocks Preview */}
                        <div className="space-y-3 mb-6">
                            {template.blocks.map((block, idx) => (
                                <div key={idx} className="flex items-center text-sm border-l-2 border-indigo-500/30 pl-3">
                                    <span className="text-slate-400 w-24 font-mono text-xs">{block.time}</span>
                                    <div className="flex-1">
                                        <p className="text-white font-medium">{block.type}</p>
                                        <p className="text-xs text-slate-500">{block.count} slots</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="w-full py-2.5 bg-slate-700/50 hover:bg-indigo-600 hover:text-white text-slate-300 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 group-hover:shadow-lg">
                            Apply Template <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                ))}

                {/* New Template Card */}
                <button className="border-2 border-dashed border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group">
                    <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Plus className="w-6 h-6 text-slate-400 group-hover:text-indigo-400" />
                    </div>
                    <span className="font-bold text-slate-400 group-hover:text-white">Create New Template</span>
                </button>
            </div>
        </div>
    );
};

export default ListingTemplates;
