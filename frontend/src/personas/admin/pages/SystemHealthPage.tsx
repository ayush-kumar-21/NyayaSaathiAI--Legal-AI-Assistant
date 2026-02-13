import React from 'react';
import { Activity, Server, Database, Wifi, CheckCircle, AlertTriangle } from 'lucide-react';

const SystemHealthPage: React.FC = () => {
    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Activity className="w-8 h-8 text-emerald-500" />
                    System Health
                </h1>
                <p className="text-slate-400 mt-1">
                    Real-time infrastructure monitoring and status.
                </p>
            </div>

            {/* Health Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/20 rounded-lg text-emerald-400">
                        <Server className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold">API Server</h3>
                        <p className="text-emerald-400 text-sm font-medium">99.9% Uptime</p>
                        <p className="text-slate-500 text-xs mt-1">Latency: 45ms</p>
                    </div>
                </div>

                <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/20 rounded-lg text-emerald-400">
                        <Database className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold">Database</h3>
                        <p className="text-emerald-400 text-sm font-medium">Healthy</p>
                        <p className="text-slate-500 text-xs mt-1">Conn: 42/100</p>
                    </div>
                </div>

                <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/20 rounded-lg text-emerald-400">
                        <Wifi className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold">Network</h3>
                        <p className="text-emerald-400 text-sm font-medium">Stable</p>
                        <p className="text-slate-500 text-xs mt-1">Throughput: 1.2GB/s</p>
                    </div>
                </div>

                <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-amber-500/20 rounded-lg text-amber-400">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold">Storage</h3>
                        <p className="text-amber-400 text-sm font-medium">Warning</p>
                        <p className="text-slate-500 text-xs mt-1">85% Used</p>
                    </div>
                </div>
            </div>

            {/* Alerts Section */}
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-white font-bold mb-4">Active Alerts</h3>
                <div className="space-y-3">
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                        <div>
                            <p className="text-amber-400 font-medium text-sm">High Storage Usage</p>
                            <p className="text-slate-400 text-xs">Volume /mnt/data is at 85% capacity. Consider scaling up.</p>
                        </div>
                    </div>
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                        <div>
                            <p className="text-emerald-400 font-medium text-sm">System Backup Completed</p>
                            <p className="text-slate-400 text-xs">Daily snapshot created successfully at 03:00 AM.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemHealthPage;
