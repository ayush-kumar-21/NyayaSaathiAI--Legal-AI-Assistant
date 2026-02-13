import React from 'react';
import {
    BarChart3, TrendingUp, AlertTriangle, Clock,
    PieChart, Download, Calendar, Filter
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart as RePieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const DEFECT_DATA = [
    { name: 'Missing Docs', value: 400 },
    { name: 'Incorrect Fee', value: 300 },
    { name: 'Format Error', value: 300 },
    { name: 'Jurisdiction', value: 200 },
];

const FILING_TREND_DATA = [
    { name: 'Mon', filings: 24, defects: 4 },
    { name: 'Tue', filings: 38, defects: 6 },
    { name: 'Wed', filings: 45, defects: 8 },
    { name: 'Thu', filings: 30, defects: 3 },
    { name: 'Fri', filings: 52, defects: 12 },
    { name: 'Sat', filings: 18, defects: 2 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RegistryAnalytics: React.FC = () => {
    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <BarChart3 className="w-8 h-8 text-blue-500" />
                        Registry Analytics
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Insights into filing trends, defect rates, and operational efficiency.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors border border-slate-700">
                        <Calendar className="w-4 h-4" />
                        Last 7 Days
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20">
                        <Download className="w-4 h-4" />
                        Export Report
                    </button>
                </div>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Filings', value: '1,248', change: '+12%', icon: FileText, color: 'blue' },
                    { label: 'Defect Rate', value: '18%', change: '-5%', icon: AlertTriangle, color: 'amber' },
                    { label: 'Avg Processing', value: '4.2 hrs', change: '-15%', icon: Clock, color: 'emerald' },
                    { label: 'Revenue', value: '₹42.5L', change: '+8%', icon: TrendingUp, color: 'purple' },
                ].map((kpi, idx) => {
                    const Icon = kpi.icon || BarChart3;
                    return (
                        <div key={idx} className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-xl">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-lg bg-${kpi.color}-500/10 text-${kpi.color}-500`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${kpi.change.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                                    }`}>
                                    {kpi.change}
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-1">{kpi.value}</h3>
                            <p className="text-sm text-slate-400">{kpi.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Filing Trend Chart */}
                <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-xl">
                    <h3 className="font-bold text-white mb-6">Weekly Filing Volume</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={FILING_TREND_DATA}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                />
                                <Bar dataKey="filings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Defect Distribution */}
                <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-xl">
                    <h3 className="font-bold text-white mb-6">Common Defect Types</h3>
                    <div className="h-[300px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <RePieChart>
                                <Pie
                                    data={DEFECT_DATA}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {DEFECT_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                />
                            </RePieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recommendations Section */}
            <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-500/20 rounded-xl p-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-full">
                        <TrendingUp className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Efficiency Insights</h3>
                        <div className="mt-3 space-y-2">
                            <p className="text-sm text-slate-300 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                High defect rate observed in "Writ Petitions" (Format Errors). Suggest updating the template.
                            </p>
                            <p className="text-sm text-slate-300 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                Processing time improved by 15% after recent batch processing update.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Start imports at the top
// I suspect imports were missing 'FileText' usage in KPI array
import { FileText } from 'lucide-react';

export default RegistryAnalytics;
