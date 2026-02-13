import React from 'react';
import { AlertTriangle, Clock, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const PriorityMatrix: React.FC = () => {
    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <AlertTriangle className="w-8 h-8 text-amber-500" />
                        Case Urgency Matrix
                    </h1>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-12rem)]">
                {/* Quadrant 1 */}
                <div className="bg-red-900/10 border border-red-500/30 rounded-xl p-4 flex flex-col relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-red-500/50"></div>
                    <h2 className="text-red-400 font-bold uppercase tracking-wider text-sm mb-4 pl-3">Urgent & Important</h2>
                    <div className="space-y-3 pl-3 overflow-y-auto">
                        <div className="bg-slate-900/80 border-l-4 border-red-500 p-3 rounded shadow-lg">
                            <h3 className="font-semibold text-white text-sm">State vs. Roy (Bail)</h3>
                            <span className="text-xs text-amber-500 flex items-center gap-1 mt-1"><Clock className="w-3 h-3" /> 240 days</span>
                        </div>
                    </div>
                </div>

                {/* Quadrant 2 */}
                <div className="bg-amber-900/10 border border-amber-500/30 rounded-xl p-4 flex flex-col relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/50"></div>
                    <h2 className="text-amber-400 font-bold uppercase tracking-wider text-sm mb-4 pl-3">Important (Schedule)</h2>
                    <div className="space-y-3 pl-3 overflow-y-auto">
                        <div className="bg-slate-900/80 border-l-4 border-amber-500 p-3 rounded shadow-lg">
                            <h3 className="font-semibold text-white text-sm">Final Arguments: Theft</h3>
                            <span className="text-xs text-slate-400 mt-1">Disposal Target</span>
                        </div>
                    </div>
                </div>

                {/* Quadrant 3 */}
                <div className="bg-blue-900/10 border border-blue-500/30 rounded-xl p-4 flex flex-col relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50"></div>
                    <h2 className="text-blue-400 font-bold uppercase tracking-wider text-sm mb-4 pl-3">Urgent (Delegate)</h2>
                    <div className="space-y-3 pl-3 overflow-y-auto">
                        <div className="bg-slate-900/80 border-l-4 border-blue-500 p-3 rounded shadow-lg">
                            <h3 className="font-semibold text-white text-sm">Exemption App</h3>
                            <span className="text-xs text-slate-400 mt-1">Advocate unwell</span>
                        </div>
                    </div>
                </div>

                {/* Quadrant 4 */}
                <div className="bg-slate-800/30 border border-slate-600/30 rounded-xl p-4 flex flex-col relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-slate-500/50"></div>
                    <h2 className="text-slate-400 font-bold uppercase tracking-wider text-sm mb-4 pl-3">Backlog</h2>
                    <div className="space-y-3 pl-3 overflow-y-auto">
                        <div className="bg-slate-900/80 border-l-4 border-slate-500 p-3 rounded shadow-lg opacity-75">
                            <h3 className="font-semibold text-white text-sm">Written Args Pending</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PriorityMatrix;
