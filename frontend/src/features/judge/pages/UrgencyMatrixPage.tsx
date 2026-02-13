
import React, { useState, useMemo } from 'react';
// Translation hook removed - react-i18next not installed in this project
import {
    AlertCircle,
    Clock,
    User,
    Scale,
    Activity,
    ArrowUpRight,
    Filter,
    Search
} from 'lucide-react';

const MOCK_URGENCY_CASES = [
    {
        id: 'CNR-DL-2021-9821',
        title: 'State vs. Raj Kumar',
        offense: 'Theft (IPC 379)',
        undertrialYears: 5.2,
        accusedAge: 32,
        health: 'Normal',
        urgencyScore: 85,
        reason: 'Undertrial > 5 Years (BNSS Sec 479)',
        status: 'URGENT'
    },
    {
        id: 'CNR-MH-2023-1102',
        title: 'Ramesh vs. Suresh',
        offense: 'Property Dispute',
        undertrialYears: 2.1,
        accusedAge: 78,
        health: 'Critical',
        urgencyScore: 92,
        reason: 'Senior Citizen + Critical Health',
        status: 'CRITICAL'
    },
    {
        id: 'CNR-KA-2022-4451',
        title: 'State vs. Vijay Singh',
        offense: 'Cyber Fraud',
        undertrialYears: 1.5,
        accusedAge: 24,
        health: 'Normal',
        urgencyScore: 45,
        reason: 'Routine Hearing',
        status: 'NORMAL'
    },
    {
        id: 'CNR-TN-2020-3321',
        title: 'Meena vs. State',
        offense: 'Domestic Violence',
        undertrialYears: 3.8,
        accusedAge: 45,
        health: 'Post-Surgery',
        urgencyScore: 78,
        reason: 'Health complications + >3 Years',
        status: 'HIGH'
    },
    {
        id: 'CNR-UP-2019-5512',
        title: 'State vs. Unknown',
        offense: 'NDPS Act',
        undertrialYears: 6.1,
        accusedAge: 29,
        health: 'Normal',
        urgencyScore: 88,
        reason: 'Undertrial > 50% Max Sentence',
        status: 'URGENT'
    }
];

const UrgencyMatrixPage: React.FC = () => {
    // Translation not needed - all strings are hardcoded
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('ALL');

    const filteredCases = useMemo(() => {
        return MOCK_URGENCY_CASES.filter(c => {
            const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filter === 'ALL' || c.status === filter;
            return matchesSearch && matchesFilter;
        }).sort((a, b) => b.urgencyScore - a.urgencyScore);
    }, [searchTerm, filter]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CRITICAL': return 'bg-red-500/20 text-red-400 border-red-500/50';
            case 'URGENT': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
            case 'HIGH': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
            default: return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Activity className="w-8 h-8 text-amber-500" />
                        Case Prioritization Matrix
                    </h1>
                    <p className="text-slate-400 mt-2">
                        AI-driven analysis of case backlog based on <span className="text-amber-400">BNSS Section 479</span> (Undertrial Rights) & Seniority.
                    </p>
                </div>

                {/* Search & Filter */}
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search CNR or Name..."
                            className="bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-white focus:outline-none focus:border-amber-500 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* AI Insight Banner */}
            <div className="bg-gradient-to-r from-amber-900/40 to-purple-900/40 border border-amber-500/30 rounded-xl p-6 flex justify-between items-center backdrop-blur-sm">
                <div className="flex gap-4 items-center">
                    <div className="p-3 bg-amber-500/20 rounded-full animate-pulse">
                        <AlertCircle className="w-8 h-8 text-amber-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">AI Suggestion</h3>
                        <p className="text-amber-200/80">
                            3 Cases are eligible for immediate bail under BNSS Sec 479 (Half-time serve).
                            Review recommended immediately.
                        </p>
                    </div>
                </div>
                <button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-amber-900/50">
                    Auto-Draft Bail Orders
                </button>
            </div>

            {/* The Matrix Table */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-md">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-950/50 border-b border-slate-800 text-slate-400 text-sm uppercase tracking-wider">
                            <th className="p-5 font-semibold">Urgency Score</th>
                            <th className="p-5 font-semibold">Case Details</th>
                            <th className="p-5 font-semibold">Undertrial Duration</th>
                            <th className="p-5 font-semibold">Accused Profile</th>
                            <th className="p-5 font-semibold">AI Reasoning</th>
                            <th className="p-5 font-semibold text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {filteredCases.map((caseItem, idx) => (
                            <tr key={caseItem.id} className="hover:bg-slate-800/30 transition-colors group">
                                <td className="p-5">
                                    <div className="relative w-16 h-16 flex items-center justify-center">
                                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                            <path
                                                className="text-slate-800"
                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="3"
                                            />
                                            <path
                                                className={`${caseItem.urgencyScore > 80 ? 'text-red-500' : 'text-amber-500'} transition-all duration-1000 ease-out`}
                                                strokeDasharray={`${caseItem.urgencyScore}, 100`}
                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="3"
                                            />
                                        </svg>
                                        <span className={`absolute text-sm font-bold ${caseItem.urgencyScore > 80 ? 'text-red-400' : 'text-amber-400'}`}>
                                            {caseItem.urgencyScore}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-5">
                                    <p className="text-white font-medium text-lg group-hover:text-amber-400 transition-colors">{caseItem.title}</p>
                                    <p className="text-slate-500 text-sm">{caseItem.id}</p>
                                    <p className="text-slate-400 text-xs mt-1 bg-slate-800 inline-block px-2 py-0.5 rounded border border-slate-700">
                                        {caseItem.offense}
                                    </p>
                                </td>
                                <td className="p-5">
                                    <div className="flex items-center gap-2 text-slate-300">
                                        <Clock className="w-4 h-4 text-slate-500" />
                                        <span className={caseItem.undertrialYears > 3 ? 'text-red-400 font-bold' : ''}>
                                            {caseItem.undertrialYears} Years
                                        </span>
                                    </div>
                                </td>
                                <td className="p-5">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <User className="w-4 h-4 text-slate-500" />
                                            <span>{caseItem.accusedAge} Yrs</span>
                                        </div>
                                        {caseItem.health !== 'Normal' && (
                                            <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30">
                                                {caseItem.health}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="p-5">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(caseItem.status)}`}>
                                        {caseItem.status === 'CRITICAL' && <AlertCircle className="w-3 h-3" />}
                                        {caseItem.reason}
                                    </span>
                                </td>
                                <td className="p-5 text-right">
                                    <button className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition-colors">
                                        <ArrowUpRight className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UrgencyMatrixPage;
