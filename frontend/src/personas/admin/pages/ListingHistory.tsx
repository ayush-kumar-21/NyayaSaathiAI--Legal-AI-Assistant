import React from 'react';
import {
    History, Filter, Download, ChevronLeft, ChevronRight,
    Calendar, CheckCircle, AlertTriangle, TrendingUp
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    BarChart, Bar
} from 'recharts';

const HISTORY_DATA = [
    { id: 'S-1001', date: '2025-02-12', court: 'District Civil', cases: 12, utilization: 82, status: 'completed' },
    { id: 'S-1002', date: '2025-02-12', court: 'District Criminal', cases: 8, utilization: 65, status: 'completed' },
    { id: 'S-1003', date: '2025-02-11', court: 'Fast Track', cases: 15, utilization: 91, status: 'overbooked' },
    { id: 'S-1004', date: '2025-02-11', court: 'District Civil', cases: 10, utilization: 78, status: 'completed' },
    { id: 'S-1005', date: '2025-02-10', court: 'Family Court', cases: 6, utilization: 55, status: 'completed' },
];

const UTILIZATION_TREND = [
    { name: 'Mon', value: 65 },
    { name: 'Tue', value: 72 },
    { name: 'Wed', value: 78 },
    { name: 'Thu', value: 85 },
    { name: 'Fri', value: 70 },
    { name: 'Sat', value: 45 },
];

const ListingHistory: React.FC = () => {
    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <History className="w-8 h-8 text-indigo-500" />
                        Schedule History
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Archive of past schedules and efficiency performance logs.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors border border-slate-700">
                        <Calendar className="w-4 h-4" />
                        Last 30 Days
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors border border-slate-700">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-800/40 border border-slate-700/50 p-6 rounded-xl">
                    <h3 className="font-bold text-white mb-6">Efficiency Trend (Last 7 Days)</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={UTILIZATION_TREND}>
                                <defs>
                                    <linearGradient id="colorUtil" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#6366f1" fillOpacity={1} fill="url(#colorUtil)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-emerald-500/20 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-emerald-400" />
                            </div>
                            <span className="text-slate-400 text-sm">On-Time Start Rate</span>
                        </div>
                        <p className="text-3xl font-bold text-white">89%</p>
                        <p className="text-xs text-emerald-400 mt-1">↑ 2% from last month</p>
                    </div>
                    <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-amber-500/20 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-amber-400" />
                            </div>
                            <span className="text-slate-400 text-sm">Avg Daily Utilization</span>
                        </div>
                        <p className="text-3xl font-bold text-white">76%</p>
                        <p className="text-xs text-slate-500 mt-1">Target: &gt;85%</p>
                    </div>
                </div>
            </div>

            {/* History Table */}
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-700/50 font-bold text-white">
                    Recent Schedules
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-800/50 text-slate-400 text-sm">
                                <th className="p-4 font-medium">Schedule ID</th>
                                <th className="p-4 font-medium">Date</th>
                                <th className="p-4 font-medium">Court</th>
                                <th className="p-4 font-medium">Cases</th>
                                <th className="p-4 font-medium">Utilization</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-slate-700/50">
                            {HISTORY_DATA.map(item => (
                                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="p-4 font-mono text-slate-300">{item.id}</td>
                                    <td className="p-4 text-white">{item.date}</td>
                                    <td className="p-4 text-slate-300">{item.court}</td>
                                    <td className="p-4 text-slate-300">{item.cases}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-16 bg-slate-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${item.utilization > 90 ? 'bg-red-500' : 'bg-emerald-500'}`}
                                                    style={{ width: `${item.utilization}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-slate-400">{item.utilization}%</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                                            'bg-red-500/10 text-red-400'
                                            }`}>
                                            {item.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-indigo-400 hover:text-indigo-300 font-medium text-xs">View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                <div className="p-4 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
                    <span>Showing 5 of 127 entries</span>
                    <div className="flex gap-1">
                        <button className="p-1 hover:bg-slate-700 rounded"><ChevronLeft className="w-4 h-4" /></button>
                        <button className="p-1 hover:bg-slate-700 rounded"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingHistory;
