
import React from 'react';
import { Activity, Server, Database, ShieldCheck, CheckCircle, Wifi, Cpu } from 'lucide-react';

const SystemHealthPage: React.FC = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Activity className="w-8 h-8 text-green-400" />
                        System Health & Infrastructure
                    </h1>
                    <p className="text-slate-400 mt-2">
                        Real-time monitoring of judicial digital infrastructure.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-green-400 bg-green-900/20 px-4 py-2 rounded-full border border-green-500/30">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="font-semibold text-sm">All Systems Operational</span>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Server Status */}
                <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-500/20 rounded-lg">
                            <Server className="w-6 h-6 text-blue-400" />
                        </div>
                        <span className="text-green-400 text-sm font-bold">99.99% Uptime</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">Core API Server</h3>
                    <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-slate-400 text-sm">
                            <span>Latency</span>
                            <span className="text-white">12ms</span>
                        </div>
                        <div className="flex justify-between text-slate-400 text-sm">
                            <span>Load</span>
                            <span className="text-white">34%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '34%' }} />
                        </div>
                    </div>
                </div>

                {/* Blockchain */}
                <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-500/20 rounded-lg">
                            <ShieldCheck className="w-6 h-6 text-purple-400" />
                        </div>
                        <span className="text-purple-400 text-sm font-bold">Synced</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">Evidence Blockchain</h3>
                    <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-slate-400 text-sm">
                            <span>Block Height</span>
                            <span className="text-white">#1,204,551</span>
                        </div>
                        <div className="flex justify-between text-slate-400 text-sm">
                            <span>Peers</span>
                            <span className="text-white">12/12</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                            <div className="bg-purple-500 h-1.5 rounded-full animate-pulse" style={{ width: '100%' }} />
                        </div>
                    </div>
                </div>

                {/* Database */}
                <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-amber-500/20 rounded-lg">
                            <Database className="w-6 h-6 text-amber-400" />
                        </div>
                        <span className="text-green-400 text-sm font-bold">Healthy</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">Firestore DB</h3>
                    <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-slate-400 text-sm">
                            <span>Writes/Sec</span>
                            <span className="text-white">1,240</span>
                        </div>
                        <div className="flex justify-between text-slate-400 text-sm">
                            <span>Region</span>
                            <span className="text-white">asia-south1</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                            <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '45%' }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemHealthPage;
