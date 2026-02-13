import React, { useState } from 'react';
import { Search, Book, Bookmark, ChevronRight, BookOpen } from 'lucide-react';

const LegalKnowledgeBank: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'BNS' | 'BNSS' | 'BSA'>('BNS');
    const [searchQuery, setSearchQuery] = useState('');

    const laws = {
        BNS: [
            { section: '103', title: 'Punishment for Murder', desc: 'Replaces IPC 302. Capital punishment or life imprisonment.' },
            { section: '304', title: 'Snatching', desc: 'New defined offence. Imprisonment up to 3 years.' },
            { section: '69', title: 'Sexual Intercourse by Deceitful Means', desc: 'Criminalizes "love jihad" style offences.' },
            { section: '111', title: 'Organised Crime', desc: 'New specific provision for syndicates and gangs.' },
        ],
        BNSS: [
            { section: '173', title: 'Registration of FIR', desc: 'Mandates e-FIR and Zero FIR provisions.' },
            { section: '480', title: 'Bail Provisions', desc: 'Simplifies bail process for first-time offenders.' },
        ],
        BSA: [
            { section: '61', title: 'Electronic Evidence', desc: 'Admissibility of digital records as primary evidence.' },
        ]
    };

    const filteredLaws = laws[activeTab].filter(law =>
        law.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
        law.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <header className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                    <Book className="w-8 h-8 text-amber-500" />
                    Legal Knowledge Bank
                </h1>
                <p className="text-slate-400">
                    Bharatiya Nyaya Sanhita (BNS), Nagarik Suraksha Sanhita (BNSS), and Sakshya Adhiniyam (BSA) Repository
                </p>
            </header>

            {/* Search & Tabs */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex gap-2 bg-slate-900/50 p-1 rounded-lg">
                    {(['BNS', 'BNSS', 'BSA'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === tab
                                    ? 'bg-amber-600 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder={`Search ${activeTab} sections...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 text-slate-200 pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-amber-500/50 transition-colors"
                    />
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLaws.length > 0 ? (
                    filteredLaws.map((law, idx) => (
                        <div key={idx} className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 hover:border-amber-500/30 transition-all group group-hover:shadow-xl cursor-pointer">
                            <div className="flex justify-between items-start mb-3">
                                <span className="px-3 py-1 bg-amber-500/10 text-amber-400 rounded-lg text-sm font-bold border border-amber-500/20">
                                    Section {law.section}
                                </span>
                                <button className="text-slate-500 hover:text-amber-400 transition-colors">
                                    <Bookmark className="w-5 h-5" />
                                </button>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-100">{law.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-4">{law.desc}</p>
                            <div className="flex items-center text-amber-500 text-sm font-medium gap-1 group-hover:translate-x-1 transition-transform">
                                Read Full Text <ChevronRight className="w-4 h-4" />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 text-slate-500">
                        <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p className="text-lg">No sections found matching "{searchQuery}"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LegalKnowledgeBank;
