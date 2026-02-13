import React, { useState } from 'react';
import {
    LayoutGrid, Calendar, Filter, Settings,
    MoreHorizontal, Download, AlertCircle
} from 'lucide-react';

const MOCK_COURTS = [
    {
        id: '1',
        name: 'District Court - Civil Hall 1',
        judge: 'Hon. R.K. Sharma',
        utilization: 82,
        status: 'optimal',
        schedule: [
            { time: '10:00', case: 'C-2024-102', type: 'Hearing' },
            { time: '11:30', case: 'C-2024-105', type: 'Evidence' },
            { time: '14:00', case: 'C-2024-108', type: 'Arguments' },
            { time: '15:30', case: 'C-2024-110', type: 'Orders' },
        ]
    },
    {
        id: '2',
        name: 'District Court - Criminal Hall A',
        judge: 'Hon. S. Gupta',
        utilization: 65,
        status: 'under',
        schedule: [
            { time: '10:30', case: 'CR-2024-055', type: 'Bail' },
            { time: '11:00', case: 'CR-2024-058', type: 'Remand' },
            { time: '14:30', case: 'CR-2024-060', type: 'Trial' },
        ]
    },
    {
        id: '3',
        name: 'Fast Track Court - POCSO',
        judge: 'Hon. M. Patel',
        utilization: 94,
        status: 'over',
        schedule: [
            { time: '10:00', case: 'FT-2024-012', type: 'Trial' },
            { time: '11:00', case: 'FT-2024-015', type: 'Evidence' },
            { time: '12:00', case: 'FT-2024-018', type: 'Medical' },
            { time: '14:00', case: 'FT-2024-019', type: 'Arguments' },
            { time: '15:00', case: 'FT-2024-022', type: 'Judgment' },
        ]
    }
];

const ListingMultiCourt: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState('2025-02-12');

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <LayoutGrid className="w-8 h-8 text-indigo-500" />
                        Multi-Court View
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Monitor and optimize schedules across all court halls in real-time.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-slate-800 border-slate-700 text-white rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <button className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-colors">
                        <Filter className="w-5 h-5" />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold shadow-lg shadow-indigo-500/20 transition-all">
                        <Settings className="w-4 h-4" />
                        Optimize All
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-xl flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 text-sm">Avg Utilization</p>
                        <p className="text-2xl font-bold text-white">78%</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                    </div>
                </div>
                <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-xl flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 text-sm">Total Cases</p>
                        <p className="text-2xl font-bold text-white">45</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-400" />
                    </div>
                </div>
                <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-xl flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 text-sm">Conflict Alerts</p>
                        <p className="text-2xl font-bold text-red-400">3</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                    </div>
                </div>
            </div>

            {/* Courts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {MOCK_COURTS.map(court => (
                    <div key={court.id} className="bg-slate-900/50 border border-slate-700/50 rounded-xl overflow-hidden hover:border-indigo-500/30 transition-all">
                        {/* Court Header */}
                        <div className="p-4 bg-slate-800/50 border-b border-slate-700/50 flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-white text-lg">{court.name}</h3>
                                <p className="text-sm text-slate-400">{court.judge}</p>
                            </div>
                            <button className="text-slate-400 hover:text-white">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Utilization Bar */}
                        <div className="px-4 py-3 border-b border-slate-700/50 bg-slate-800/20">
                            <div className="flex justify-between items-center text-xs mb-1">
                                <span className="text-slate-400">Daily Utilization</span>
                                <span className={`font-bold ${court.utilization > 90 ? 'text-red-400' :
                                        court.utilization < 70 ? 'text-amber-400' : 'text-emerald-400'
                                    }`}>
                                    {court.utilization}%
                                </span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${court.utilization > 90 ? 'bg-red-500' :
                                            court.utilization < 70 ? 'bg-amber-500' : 'bg-emerald-500'
                                        }`}
                                    style={{ width: `${court.utilization}%` }}
                                />
                            </div>
                            {court.utilization > 90 && (
                                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> Overbooked
                                </p>
                            )}
                        </div>

                        {/* Schedule List */}
                        <div className="p-4 space-y-3">
                            {court.schedule.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-2 bg-slate-800/40 rounded-lg border border-slate-700/30">
                                    <span className="text-xs font-mono font-bold text-slate-300 bg-slate-700/50 px-1.5 py-0.5 rounded">
                                        {item.time}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">{item.case}</p>
                                        <p className="text-xs text-slate-500">{item.type}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Actions Footer */}
                        <div className="p-3 bg-slate-800/30 border-t border-slate-700/50 flex gap-2">
                            <button className="flex-1 py-1.5 text-xs font-medium bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors">
                                View Details
                            </button>
                            <button className="flex-1 py-1.5 text-xs font-medium bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 rounded transition-colors border border-indigo-500/30">
                                Rebalance
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Add missing icon import
import { TrendingUp } from 'lucide-react';

export default ListingMultiCourt;
