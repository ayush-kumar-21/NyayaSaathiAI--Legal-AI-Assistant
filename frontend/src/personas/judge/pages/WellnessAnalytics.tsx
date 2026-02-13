import React from 'react';
import { Heart, Activity, Brain, Coffee, Zap, Moon } from 'lucide-react';

const WellnessAnalytics: React.FC = () => {
    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                    <Heart className="w-8 h-8 text-amber-500" />
                    Judge Wellness Dashboard
                </h1>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Cognitive Load', value: 'High', icon: Brain, color: 'text-red-400', bg: 'bg-red-500/10' },
                    { label: 'Avg Sleep', value: '6.5 hrs', icon: Moon, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'Energy Level', value: 'Good', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                    { label: 'Screen Time', value: '8.2 hrs', icon: Activity, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                ].map((stat, i) => (
                    <div key={i} className={`p-4 rounded-xl border border-slate-700/50 bg-slate-800/50 flex items-center gap-4`}>
                        <div className={`p-3 rounded-full ${stat.bg}`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs uppercase">{stat.label}</p>
                            <p className="text-xl font-bold text-white">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Simple Recommendations */}
            <div className="bg-gradient-to-r from-teal-900/30 to-slate-800 p-6 rounded-xl border border-teal-500/30">
                <h3 className="text-lg font-bold text-teal-400 mb-2 flex items-center gap-2">
                    <Coffee className="w-5 h-5" /> Recommended Break
                </h3>
                <p className="text-slate-300 text-sm mb-4">
                    High cognitive load detected. A 10-minute mindfulness break is recommended.
                </p>
                <button className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    Start Guided Breathing
                </button>
            </div>
        </div>
    );
};

export default WellnessAnalytics;
