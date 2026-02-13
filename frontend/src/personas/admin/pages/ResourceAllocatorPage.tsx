import React, { useState } from 'react';
import {
    Cpu, Users, Gavel, LayoutGrid,
    AlertTriangle, CheckCircle, BarChart3
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';

const RESOURCE_DATA = [
    { name: 'Court A', judges: 2, staff: 5, status: 'Optimal' },
    { name: 'Court B', judges: 1, staff: 4, status: 'Understaffed' },
    { name: 'Court C', judges: 3, staff: 6, status: 'Optimal' },
    { name: 'Fast Track', judges: 4, staff: 8, status: 'Overloaded' },
];

const WORKLOAD_DATA = [
    { name: 'Judge Sharma', cases: 45, clearance: 80 },
    { name: 'Judge Gupta', cases: 32, clearance: 95 },
    { name: 'Judge Patel', cases: 58, clearance: 65 },
    { name: 'Judge Singh', cases: 40, clearance: 85 },
];

const ResourceAllocatorPage: React.FC = () => {
    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Cpu className="w-8 h-8 text-cyan-500" />
                    Resource Allocator
                </h1>
                <p className="text-slate-400 mt-1">
                    Optimize judicial resource distribution and staff workload.
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-cyan-500/20 rounded-lg text-cyan-400">
                        <Gavel className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">42</p>
                        <p className="text-xs text-slate-400">Total Judges</p>
                    </div>
                </div>
                <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">128</p>
                        <p className="text-xs text-slate-400">Court Staff</p>
                    </div>
                </div>
                <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-red-500/20 rounded-lg text-red-400">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">3</p>
                        <p className="text-xs text-slate-400">Critical Shortages</p>
                    </div>
                </div>
                <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/20 rounded-lg text-emerald-400">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">94%</p>
                        <p className="text-xs text-slate-400">Resource Efficiency</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Court Allocation Table */}
                <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-slate-700/50 font-bold text-white flex justify-between items-center">
                        <span>Courtroom Allocation</span>
                        <button className="text-xs text-cyan-400 hover:text-cyan-300">Rebalance Resources</button>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-800/50 text-slate-400">
                            <tr>
                                <th className="p-3 pl-4">Court Name</th>
                                <th className="p-3">Judges</th>
                                <th className="p-3">Staff</th>
                                <th className="p-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {RESOURCE_DATA.map((row, idx) => (
                                <tr key={idx} className="hover:bg-slate-800/30">
                                    <td className="p-3 pl-4 font-medium text-white">{row.name}</td>
                                    <td className="p-3 text-slate-300">{row.judges}</td>
                                    <td className="p-3 text-slate-300">{row.staff}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${row.status === 'Optimal' ? 'bg-emerald-500/10 text-emerald-400' :
                                                row.status === 'Overloaded' ? 'bg-red-500/10 text-red-400' :
                                                    'bg-amber-500/10 text-amber-400'
                                            }`}>
                                            {row.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Workload Chart */}
                <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4">
                    <h3 className="font-bold text-white mb-4">Judge Workload vs Clearance Rate</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={WORKLOAD_DATA} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                                <XAxis type="number" stroke="#94a3b8" />
                                <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                />
                                <Bar dataKey="cases" name="Active Cases" fill="#06b6d4" radius={[0, 4, 4, 0]} barSize={20} />
                                <Bar dataKey="clearance" name="Clearance %" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResourceAllocatorPage;
