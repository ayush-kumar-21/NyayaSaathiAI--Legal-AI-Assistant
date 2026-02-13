import React, { useState } from 'react';
import { Microscope, FlaskConical, Clock, CheckCircle, AlertTriangle, FileText, Plus, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data for Forensic Requests
const MOCK_REQUESTS = [
    {
        id: 'FR-2024-001',
        caseId: 'FIR-2024-102',
        type: 'DNA Analysis',
        status: 'Processing',
        lab: 'Central Forensic Lab, Delhi',
        priority: 'High',
        submittedDate: '2024-02-10',
        eta: '2 Days'
    },
    {
        id: 'FR-2024-002',
        caseId: 'FIR-2024-098',
        type: 'Ballistics',
        status: 'Completed',
        lab: 'State Forensic Lab, Jaipur',
        priority: 'Critical',
        submittedDate: '2024-02-08',
        eta: 'Completed'
    },
    {
        id: 'FR-2024-003',
        caseId: 'FIR-2024-105',
        type: 'Toxicology',
        status: 'Pending',
        lab: 'Regional Forensic Lab',
        priority: 'Medium',
        submittedDate: '2024-02-11',
        eta: '5 Days'
    },
    {
        id: 'FR-2024-004',
        caseId: 'FIR-2024-110',
        type: 'Digital Forensics',
        status: 'In Transit',
        lab: 'Cyber Forensics Div',
        priority: 'High',
        submittedDate: '2024-02-12',
        eta: '3 Days'
    }
];

const ForensicInterlock: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'all'>('active');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredRequests = MOCK_REQUESTS.filter(req => {
        const matchesSearch = req.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.type.toLowerCase().includes(searchQuery.toLowerCase());
        if (activeTab === 'all') return matchesSearch;
        if (activeTab === 'completed') return matchesSearch && req.status === 'Completed';
        return matchesSearch && req.status !== 'Completed';
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed': return 'text-green-400 bg-green-500/10 border-green-500/20';
            case 'Processing': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            case 'Pending': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            case 'In Transit': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
            default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'Critical': return 'text-red-400';
            case 'High': return 'text-orange-400';
            default: return 'text-slate-400';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <Microscope className="w-8 h-8 text-blue-400" />
                        Forensic Interlock
                    </h1>
                    <p className="text-slate-400">Seamless integration with Forensic Science Labs (FSL)</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-blue-900/20">
                    <Plus className="w-5 h-5" />
                    New Lab Request
                </button>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Pending Requests', value: '12', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                    { label: 'Processing', value: '5', icon: FlaskConical, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'Critical Cases', value: '3', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
                    { label: 'Completed (This Month)', value: '28', icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' }
                ].map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl backdrop-blur-sm"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className={`p-2 rounded-lg ${stat.bg}`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                        </div>
                        <p className="text-sm text-slate-400">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Main Content */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
                {/* Tabs & Filters */}
                <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-800/20">
                    <div className="flex gap-2 bg-slate-900/50 p-1 rounded-lg">
                        {(['active', 'completed', 'all'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === tab
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search Case ID or Type..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider font-medium text-left">
                            <tr>
                                <th className="px-6 py-4">Request ID</th>
                                <th className="px-6 py-4">Case / FIR</th>
                                <th className="px-6 py-4">Forensic Type</th>
                                <th className="px-6 py-4">Assigned Lab</th>
                                <th className="px-6 py-4">Priority</th>
                                <th className="px-6 py-4">Status & ETA</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            <AnimatePresence>
                                {filteredRequests.map((req) => (
                                    <motion.tr
                                        key={req.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="hover:bg-slate-800/30 transition-colors group"
                                    >
                                        <td className="px-6 py-4 font-mono text-sm text-slate-300">{req.id}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-white">{req.caseId}</td>
                                        <td className="px-6 py-4 text-sm text-slate-300">{req.type}</td>
                                        <td className="px-6 py-4 text-sm text-slate-400">{req.lab}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                <AlertTriangle className={`w-3 h-3 ${getPriorityColor(req.priority)}`} />
                                                <span className={`text-xs font-medium ${getPriorityColor(req.priority)}`}>
                                                    {req.priority}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className={`inline-flex self-start items-center px-2 py-0.5 rounded textxs font-medium border ${getStatusColor(req.status)}`}>
                                                    {req.status}
                                                </span>
                                                <span className="text-[10px] text-slate-500">ETA: {req.eta}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium hover:underline">
                                                View Report
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {filteredRequests.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                        <Filter className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No requests found matching your filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForensicInterlock;
