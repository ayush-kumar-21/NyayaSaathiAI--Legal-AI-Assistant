import React, { useState } from 'react';
import { Search, Filter, Calendar, FileText, ChevronRight, Eye, Download, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data for FIRs
const FIRS = [
    {
        id: 'FIR-2024-102',
        station: 'Cyber Crime PS',
        type: 'Online Fraud',
        complainant: 'Rahul Sharma',
        date: '2024-02-10',
        status: 'Investigating',
        io: 'Inspector V. Singh',
        sections: ['420 IPC', '66D IT Act']
    },
    {
        id: 'FIR-2024-101',
        station: 'Central PS',
        type: 'Theft',
        complainant: 'Amit Verma',
        date: '2024-02-09',
        status: 'Charge Sheet Filed',
        io: 'SI R. Kumar',
        sections: ['379 IPC']
    },
    {
        id: 'FIR-2024-099',
        station: 'North PS',
        type: 'Assault',
        complainant: 'Priya Singh',
        date: '2024-02-08',
        status: 'Closed',
        io: 'Inspector P. Das',
        sections: ['323 IPC', '506 IPC']
    },
    {
        id: 'FIR-2024-098',
        station: 'Cyber Crime PS',
        type: 'Identity Theft',
        complainant: 'Bank of India',
        date: '2024-02-05',
        status: 'Investigating',
        io: 'Inspector V. Singh',
        sections: ['66C IT Act']
    }
];

const FIRHistory: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    const filteredFIRs = FIRS.filter(fir => {
        const matchesSearch = fir.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fir.complainant.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fir.type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || fir.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Investigating': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            case 'Charge Sheet Filed': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            case 'Closed': return 'text-green-400 bg-green-500/10 border-green-500/20';
            default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
                        <FileText className="w-8 h-8 text-blue-500" />
                        FIR Repository
                    </h1>
                    <p className="text-slate-400">Digital Archive of First Information Reports</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors border border-slate-700">
                        <Download className="w-4 h-4" />
                        Export Data
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-blue-900/20">
                        <Printer className="w-4 h-4" />
                        Print Register
                    </button>
                </div>
            </header>

            {/* Filters */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search FIR No, Complainant, or Crime Type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
                    <Filter className="w-4 h-4 text-slate-500" />
                    {['All', 'Investigating', 'Charge Sheet Filed', 'Closed'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border ${filterStatus === status
                                    ? 'bg-blue-600 text-white border-blue-500'
                                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* FIR Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                    {filteredFIRs.map((fir, index) => (
                        <motion.div
                            key={fir.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5 hover:bg-slate-800/50 hover:border-blue-500/30 transition-all group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{fir.id}</h3>
                                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${getStatusColor(fir.status)}`}>
                                            {fir.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-400">{fir.type} • {fir.station}</p>
                                </div>
                                <div className="p-2 bg-slate-800 rounded-lg text-slate-500 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors">
                                    <FileText className="w-5 h-5" />
                                </div>
                            </div>

                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Complainant</span>
                                    <span className="text-slate-300 font-medium">{fir.complainant}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Date</span>
                                    <span className="text-slate-300 font-medium flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {fir.date}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">IO</span>
                                    <span className="text-slate-300 font-medium">{fir.io}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Sections</span>
                                    <div className="flex gap-1">
                                        {fir.sections.map(sec => (
                                            <span key={sec} className="bg-slate-700 px-1.5 py-0.5 rounded textxs text-slate-300">
                                                {sec}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-auto">
                                <button className="flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors">
                                    <Eye className="w-4 h-4" />
                                    View
                                </button>
                                <button className="flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors">
                                    <Download className="w-4 h-4" />
                                    PDF
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredFIRs.length === 0 && (
                <div className="p-12 text-center text-slate-500 bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed">
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No FIRs found matching your criteria.</p>
                </div>
            )}
        </div>
    );
};

export default FIRHistory;
