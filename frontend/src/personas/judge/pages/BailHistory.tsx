import React, { useState } from 'react';
import {
    Calendar,
    TrendingUp,
    Filter,
    Download,
    ChevronDown,
    Search,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Clock
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

// Mock Data
const bailStats = [
    { month: 'Sep', granted: 45, rejected: 12, conditional: 28 },
    { month: 'Oct', granted: 52, rejected: 15, conditional: 32 },
    { month: 'Nov', granted: 48, rejected: 10, conditional: 35 },
    { month: 'Dec', granted: 60, rejected: 18, conditional: 40 },
    { month: 'Jan', granted: 55, rejected: 14, conditional: 38 },
    { month: 'Feb', granted: 65, rejected: 20, conditional: 42 },
];

const BailHistory: React.FC = () => {
    const [filterPeriod, setFilterPeriod] = useState('90days');
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="space-y-6">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <TrendingUp className="w-8 h-8 text-amber-500" />
                        Bail Decision History
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Analytics and archives of past bail orders and risk assessments
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700">
                        <Download className="w-4 h-4" />
                        Export Report
                    </button>
                    <div className="relative">
                        <select
                            value={filterPeriod}
                            onChange={(e) => setFilterPeriod(e.target.value)}
                            className="appearance-none bg-amber-900/20 border border-amber-500/30 text-amber-300 pl-4 pr-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        >
                            <option value="30days">Last 30 Days</option>
                            <option value="90days">Last 90 Days</option>
                            <option value="year">This Year</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500 pointer-events-none" />
                    </div>
                </div>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Decisions', value: '325', sub: '+12% vs last month', icon: Calendar, color: 'blue' },
                    { label: 'Grant Rate', value: '68%', sub: 'Consistent', icon: CheckCircle, color: 'green' },
                    { label: 'Avg Bail Amount', value: '₹45,000', sub: '-5% vs avg', icon: AlertTriangle, color: 'amber' },
                    { label: 'Avg Process Time', value: '4.2 Days', sub: 'Top 10% Efficiency', icon: Clock, color: 'purple' },
                ].map((stat, index) => (
                    <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-5 rounded-xl hover:border-amber-500/30 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-lg bg-${stat.color}-500/10 text-${stat.color}-400 group-hover:bg-${stat.color}-500/20 transition-colors`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${stat.sub.includes('+') || stat.sub.includes('Top') ? 'bg-green-500/10 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                                {stat.sub}
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                        <p className="text-slate-400 text-sm">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Trend Chart */}
                <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-amber-500" />
                        Decision Trends
                    </h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={bailStats}>
                                <defs>
                                    <linearGradient id="colorGranted" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorRejected" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="month" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }}
                                    itemStyle={{ color: '#cbd5e1' }}
                                />
                                <Legend />
                                <Area type="monotone" dataKey="granted" name="Granted" stroke="#10b981" fillOpacity={1} fill="url(#colorGranted)" />
                                <Area type="monotone" dataKey="rejected" name="Rejected" stroke="#ef4444" fillOpacity={1} fill="url(#colorRejected)" />
                                <Area type="monotone" dataKey="conditional" name="Conditional" stroke="#f59e0b" fillOpacity={0} strokeDasharray="5 5" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Distribution Chart */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-6">Decision Distribution</h3>
                    <div className="h-80 flex flex-col justify-center items-center">
                        {/* Placeholder for a Pie Chart or simple stats list */}
                        <div className="w-48 h-48 rounded-full border-8 border-slate-700 flex items-center justify-center relative">
                            <div className="absolute inset-0 rounded-full border-8 border-green-500 border-t-transparent border-l-transparent rotate-45" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}></div>
                            <div className="text-center">
                                <span className="text-3xl font-bold text-white block">68%</span>
                                <span className="text-xs text-green-400">Granted</span>
                            </div>
                        </div>
                        <div className="mt-8 w-full space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span className="text-slate-300">Granted</span>
                                </div>
                                <span className="text-white font-medium">68%</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                    <span className="text-slate-300">Conditional</span>
                                </div>
                                <span className="text-white font-medium">20%</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <span className="text-slate-300">Rejected</span>
                                </div>
                                <span className="text-white font-medium">12%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* List Section */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-slate-700/50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h3 className="text-lg font-semibold text-white">Recent Decisions</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search case no, accused..."
                            className="bg-slate-900/50 border border-slate-700 text-slate-300 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-amber-500/50 w-64"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/30 text-slate-400 text-xs uppercase tracking-wider">
                                <th className="p-4 font-medium">Case Details</th>
                                <th className="p-4 font-medium">Date</th>
                                <th className="p-4 font-medium">Decision</th>
                                <th className="p-4 font-medium">Bail Amount</th>
                                <th className="p-4 font-medium">Risk Level</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50 text-sm">
                            {[
                                { id: 'CRL-2025-001', title: 'State vs. Rajesh Kumar', date: '12 Feb 2026', decision: 'Granted', amount: '₹50,000', risk: 'Low', type: 'Theft' },
                                { id: 'CRL-2025-002', title: 'State vs. Amit Singh', date: '11 Feb 2026', decision: 'Rejected', amount: '-', risk: 'High', type: 'Assault' },
                                { id: 'CRL-2025-003', title: 'Verma vs. State', date: '10 Feb 2026', decision: 'Conditional', amount: '₹25,000', risk: 'Medium', type: 'Fraud' },
                                { id: 'CRL-2025-004', title: 'State vs. Khan', date: '09 Feb 2026', decision: 'Granted', amount: '₹10,000', risk: 'Low', type: 'Petty Theft' },
                                { id: 'CRL-2025-005', title: 'State vs. P. Sharma', date: '08 Feb 2026', decision: 'Review', amount: '-', risk: 'Critical', type: 'Murder' },
                            ].map((row, index) => (
                                <tr key={index} className="hover:bg-slate-800/30 transition-colors group">
                                    <td className="p-4">
                                        <div className="font-medium text-white">{row.id}</div>
                                        <div className="text-slate-400 text-xs">{row.title} • {row.type}</div>
                                    </td>
                                    <td className="p-4 text-slate-300">{row.date}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${row.decision === 'Granted' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                row.decision === 'Rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                    row.decision === 'Review' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                            }`}>
                                            {row.decision}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-300">{row.amount}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${row.risk === 'Low' ? 'bg-green-500' :
                                                    row.risk === 'Medium' ? 'bg-amber-500' :
                                                        'bg-red-500'
                                                }`}></div>
                                            <span className="text-slate-300">{row.risk}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 px-3 py-1 rounded transition-colors text-xs">
                                            View Order
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BailHistory;
