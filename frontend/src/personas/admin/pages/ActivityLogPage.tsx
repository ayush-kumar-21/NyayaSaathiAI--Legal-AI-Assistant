import React from 'react';
import { ClipboardList, Shield, User, Clock, FileText, AlertOctagon } from 'lucide-react';

const LOGS = [
    { id: 1, user: 'Registry Officer A', action: 'Approved Filing', target: 'C-2024-105', time: '10:45 AM', type: 'success' },
    { id: 2, user: 'Judge Sharma', action: 'Drafted Order', target: 'O-2024-002', time: '10:30 AM', type: 'info' },
    { id: 3, user: 'System Admin', action: 'Login Failed', target: 'IP: 192.168.1.5', time: '10:15 AM', type: 'warning' },
    { id: 4, user: 'Registry Officer B', action: 'Uploaded Document', target: 'petition.pdf', time: '09:55 AM', type: 'info' },
    { id: 5, user: 'System', action: 'Batch Processing', target: '12 Files', time: '09:00 AM', type: 'success' },
];

const ActivityLogPage: React.FC = () => {
    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <ClipboardList className="w-8 h-8 text-amber-500" />
                        Activity Logs
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Comprehensive audit trail of all system actions.
                    </p>
                </div>
            </div>

            {/* Logs List */}
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl overflow-hidden">
                <div className="divide-y divide-slate-700/50">
                    {LOGS.map((log) => (
                        <div key={log.id} className="p-4 flex items-center gap-4 hover:bg-slate-800/30 transition-colors">
                            <div className={`p-2 rounded-lg ${log.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                                    log.type === 'warning' ? 'bg-red-500/20 text-red-400' :
                                        'bg-blue-500/20 text-blue-400'
                                }`}>
                                {log.type === 'success' ? <Shield className="w-5 h-5" /> :
                                    log.type === 'warning' ? <AlertOctagon className="w-5 h-5" /> :
                                        <User className="w-5 h-5" />}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-white font-medium">{log.user}</span>
                                    <span className="text-slate-500 text-sm">•</span>
                                    <span className="text-slate-300">{log.action}</span>
                                </div>
                                <p className="text-xs text-slate-500 font-mono mt-0.5">
                                    Target: {log.target}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 text-slate-500 text-xs">
                                <Clock className="w-3 h-3" />
                                <span>{log.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-4 border-t border-slate-700/50 text-center">
                    <button className="text-amber-500 text-sm font-medium hover:text-amber-400">Load More Logs</button>
                </div>
            </div>
        </div>
    );
};

export default ActivityLogPage;
