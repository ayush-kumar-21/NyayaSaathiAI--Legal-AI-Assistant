
import React from 'react';
// Translation hook removed - react-i18next not installed in this project
import { FileWarning, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react';

const WarrantManagerPage: React.FC = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <FileWarning className="w-8 h-8 text-red-500" />
                        Warrant & Summons Manager
                    </h1>
                    <p className="text-slate-400 mt-2">
                        Track, serve, and update status of judicial orders.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium">
                        + Issue New Notice
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <p className="text-red-400 text-sm font-medium">Pending Warrants (NBW)</p>
                    <p className="text-3xl font-bold text-white mt-1">12</p>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                    <p className="text-orange-400 text-sm font-medium">Unserved Summons</p>
                    <p className="text-3xl font-bold text-white mt-1">45</p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <p className="text-yellow-400 text-sm font-medium">Expiring in 24h</p>
                    <p className="text-3xl font-bold text-white mt-1">3</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                    <p className="text-green-400 text-sm font-medium">Served This Week</p>
                    <p className="text-3xl font-bold text-white mt-1">28</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-slate-800/50 p-1 rounded-lg w-fit">
                <button className="px-4 py-2 bg-slate-700 rounded shadow text-white text-sm font-medium">All Open</button>
                <button className="px-4 py-2 text-slate-400 hover:text-white text-sm font-medium">Priority (Blue Corner)</button>
                <button className="px-4 py-2 text-slate-400 hover:text-white text-sm font-medium">Expired</button>
            </div>

            {/* List */}
            <div className="grid gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold">
                                {i === 1 ? 'NBW' : 'SUM'}
                            </div>
                            <div>
                                <h4 className="text-white font-semibold text-lg">Vijay Mallya (Alias)</h4>
                                <p className="text-slate-400 text-sm">Case: CNR-MH-2023-1102 • Fraud</p>
                                <div className="flex gap-3 mt-1 text-xs">
                                    <span className="flex items-center gap-1 text-red-400">
                                        <Clock className="w-3 h-3" /> Due: 2 Days
                                    </span>
                                    <span className="flex items-center gap-1 text-blue-400">
                                        <MapPin className="w-3 h-3" /> Last Seen: Bandra West
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg">
                                <MapPin className="w-5 h-5" />
                            </button>
                            <button className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Mark Served
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WarrantManagerPage;
