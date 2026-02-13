
import React, { useState } from 'react';
import { Cpu, TrendingUp, Users, ArrowRight, BarChart } from 'lucide-react';

const ResourceAllocatorPage: React.FC = () => {
    const [optimizationLevel, setOptimizationLevel] = useState(0);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Cpu className="w-8 h-8 text-cyan-400" />
                        Resource Allocation AI
                    </h1>
                    <p className="text-slate-400 mt-2">
                        Predictive modeling for judicial resource distribution to minimize pendency.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-lg font-medium shadow-lg shadow-cyan-500/20"
                        onClick={() => setOptimizationLevel(100)}
                    >
                        Auto-Optimize (AI)
                    </button>
                </div>
            </div>

            {/* AI Suggestion Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 rounded-xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <TrendingUp className="w-24 h-24 text-cyan-400" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-white">Load Imbalance Detected</h3>
                            <span className="bg-red-500/20 text-red-300 px-2 py-1 rounded text-xs font-bold border border-red-500/30">CRITICAL</span>
                        </div>
                        <p className="text-slate-300 mb-4">
                            Family Court (District 4) is at <span className="text-red-400 font-bold">145%</span> capacity while Civil Court (District 2) is at <span className="text-green-400 font-bold">60%</span>.
                        </p>
                        <div className="bg-black/40 rounded-lg p-4 border border-white/5 mb-4">
                            <p className="text-cyan-300 text-sm font-semibold mb-2">AI Recommendation:</p>
                            <div className="flex items-center gap-4 text-white">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-slate-400" />
                                    <span>2 Judges</span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-cyan-500" />
                                <span>Transfer to Dist 4</span>
                            </div>
                        </div>
                        <button className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg border border-slate-600 transition-colors">
                            Simulate Impact
                        </button>
                    </div>
                </div>

                {/* Pendency Forecast */}
                <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Pendency Forecast (Next 6 Months)</h3>
                    <div className="h-40 flex items-end gap-2">
                        {[40, 45, 60, 55, 30, 25].map((h, i) => (
                            <div key={i} className="flex-1 bg-slate-800 rounded-t-lg relative group">
                                <div
                                    className={`absolute bottom-0 left-0 right-0 rounded-t-lg transition-all duration-1000 ${i > 3 ? 'bg-cyan-500' : 'bg-slate-600'}`}
                                    style={{ height: `${optimizationLevel > 0 && i > 3 ? h - 20 : h}%` }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-slate-500 text-xs mt-2">
                        <span>Jan</span><span>Jun</span>
                    </div>
                    <p className="text-center text-cyan-400 text-sm mt-4">
                        {optimizationLevel > 0
                            ? "Projected Reduction: 18% with AI allocation"
                            : "Current Trend: +12% backlog increase"
                        }
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResourceAllocatorPage;
