import React, { useState } from 'react';
import {
    Plus, FileText, Clock, CheckCircle, AlertCircle,
    MoreVertical, Search, Filter, ChevronRight, Briefcase
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedPageWrapper from '../../../features/main/components/common/AnimatedPageWrapper';

// ==========================================
// MOCK DATA
// ==========================================
interface Filing {
    id: string;
    caseTitle: string;
    type: string;
    status: 'draft' | 'submitted' | 'scrutiny' | 'registered' | 'defect';
    date: string;
    progress: number;
}

const MOCK_FILINGS: Filing[] = [
    {
        id: 'DRAFT-2024-001',
        caseTitle: 'Property Dispute - Sector 45',
        type: 'Civil Suit',
        status: 'draft',
        date: '2 hours ago',
        progress: 40
    },
    {
        id: 'FIL-2023-892',
        caseTitle: 'Consumer Complaint vs. ABC Corp',
        type: 'Consumer',
        status: 'submitted',
        date: '10 Dec 2023',
        progress: 60
    },
    {
        id: 'REG-2023-456',
        caseTitle: 'Vehicle Theft FIR',
        type: 'Criminal',
        status: 'registered',
        date: '15 Nov 2023',
        progress: 100
    },
    {
        id: 'FIL-2023-999',
        caseTitle: 'Family Maintenance Petition',
        type: 'Family',
        status: 'defect',
        date: '01 Dec 2023',
        progress: 50
    }
];

// ==========================================
// HELPERS
// ==========================================
const getStatusColor = (status: Filing['status']) => {
    switch (status) {
        case 'draft': return 'bg-slate-700 text-slate-300';
        case 'submitted': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
        case 'registered': return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
        case 'defect': return 'bg-red-500/20 text-red-400 border border-red-500/30';
        case 'scrutiny': return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
        default: return 'bg-slate-700 text-slate-300';
    }
};

const getStatusLabel = (status: Filing['status']) => {
    switch (status) {
        case 'draft': return 'Draft Pending';
        case 'submitted': return 'Under Review';
        case 'registered': return 'Case Registered';
        case 'defect': return 'Defect Found';
        case 'scrutiny': return 'In Scrutiny';
        default: return status;
    }
};

// ==========================================
// COMPONENT
// ==========================================
const FilingDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('all');

    return (
        <AnimatedPageWrapper>
            <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">

                {/* HEADER */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                            <Briefcase className="w-8 h-8 text-emerald-400" />
                            e-Filing Dashboard
                        </h1>
                        <p className="text-slate-400">Manage your legal applications and drafts</p>
                    </div>
                    <button
                        onClick={() => navigate('/citizen/file/wizard')}
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all transform hover:scale-105"
                    >
                        <Plus className="w-5 h-5" /> Start New Filing
                    </button>
                </header>

                {/* FILTERS & SEARCH */}
                <div className="flex flex-col sm:flex-row gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by case title or filing number..."
                            className="w-full bg-slate-900 border-slate-700 text-white rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <div className="flex gap-2 overflows-x-auto">
                        {['all', 'draft', 'submitted', 'registered'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${filter === f
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* FILINGS LIST */}
                <div className="grid gap-4">
                    {MOCK_FILINGS.map((filing) => (
                        <div
                            key={filing.id}
                            className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 hover:border-emerald-500/30 rounded-xl p-5 transition-all group"
                        >
                            <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-xl ${getStatusColor(filing.status)} bg-opacity-10`}>
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                                                {filing.caseTitle}
                                            </h3>
                                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${getStatusColor(filing.status)}`}>
                                                {getStatusLabel(filing.status)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-slate-500">
                                            <span>ID: {filing.id}</span>
                                            <span>•</span>
                                            <span>{filing.type}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> Last updated: {filing.date}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 pl-14 md:pl-0">
                                    {filing.status === 'draft' && (
                                        <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors">
                                            Resume Filing
                                        </button>
                                    )}
                                    {filing.status === 'defect' && (
                                        <button className="px-4 py-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 text-sm rounded-lg border border-red-500/30 transition-colors flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4" /> View Defects
                                        </button>
                                    )}
                                    <button className="p-2 text-slate-400 hover:text-white transition-colors">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* PROGRESS BAR (Visual Flair) */}
                            {filing.status !== 'registered' && (
                                <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center gap-4 pl-14 md:pl-0">
                                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                                            style={{ width: `${filing.progress}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-slate-500 font-medium">{filing.progress}% Completed</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* EMPTY STATE MOCK */}
                {filter === 'registered' && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-slate-600" />
                        </div>
                        <h3 className="text-white font-medium">No registered cases found</h3>
                        <p className="text-slate-500 text-sm mt-1">Try changing the filter criteria</p>
                    </div>
                )}
            </div>
        </AnimatedPageWrapper>
    );
};

export default FilingDashboard;
