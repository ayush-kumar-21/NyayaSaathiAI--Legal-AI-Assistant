import React from 'react';
import { Video, Users, Play, Calendar, Clock, Star, BookOpen, Plus, TrendingUp } from 'lucide-react';

const MootScenarioLibrary: React.FC = () => {
    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <Video className="w-8 h-8 text-amber-500" />
                        Moot Court Scenarios
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Select a case scenario to simulate courtroom proceedings
                    </p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl shadow-lg transition-all">
                    <Plus className="w-5 h-5" /> New Scenario
                </button>
            </header>

            {/* Categories */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Criminal Trial', 'Civil Dispute', 'Constitutional', 'Bail Hearing'].map((cat, i) => (
                    <div key={i} className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-slate-800 transition-colors group">
                        <div className="p-2 bg-slate-700/50 rounded-lg group-hover:bg-amber-500/20 group-hover:text-amber-400 transition-colors">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-slate-200">{cat}</span>
                    </div>
                ))}
            </div>

            {/* Scenarios List */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mt-8 mb-4">Recommended Scenarios</h3>

                {[
                    { title: 'State vs. Sharma (Murder Trial)', type: 'Criminal', difficulty: 'Hard', duration: '2 hrs', roles: ['Judge', 'Prosecutor', 'Defense'], active: 12 },
                    { title: 'Property Dispute: A vs B', type: 'Civil', difficulty: 'Medium', duration: '1.5 hrs', roles: ['Judge', 'Plaintiff', 'Defendant'], active: 8 },
                    { title: 'Bail Application: Fraud Case', type: 'Criminal', difficulty: 'Easy', duration: '45 mins', roles: ['Judge', 'Defense', 'IO'], active: 25 },
                ].map((scenario, index) => (
                    <div key={index} className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/50 hover:border-amber-500/30 transition-all flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <div className="p-4 bg-slate-900 rounded-xl border border-slate-700/50 hidden md:block">
                            <ScaleIcon className="w-8 h-8 text-amber-500" />
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider 
                                    ${scenario.type === 'Criminal' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                                    {scenario.type}
                                </span>
                                <span className="text-amber-500/50 flex text-xs">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3 h-3 fill-current" />)}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{scenario.title}</h3>
                            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                                <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {scenario.roles.join(', ')}</span>
                                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {scenario.duration}</span>
                                <span className="flex items-center gap-1"><TrendingUp className="w-4 h-4" /> {scenario.difficulty}</span>
                            </div>
                        </div>

                        <div className="flex gap-3 w-full md:w-auto">
                            <button className="flex-1 md:flex-none px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors">
                                Preview
                            </button>
                            <button className="flex-1 md:flex-none px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2 transition-transform hover:scale-105">
                                <Play className="w-4 h-4 fill-current" /> Start
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Sessions */}
            <div className="mt-8">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Practice Sessions</h3>
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase">
                            <tr>
                                <th className="p-4">Scenario</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Role Played</th>
                                <th className="p-4">Score</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {[
                                { title: 'State vs. Sharma', date: 'Yesterday', role: 'Judge', score: '85/100' },
                                { title: 'Bail App: Fraud', date: '10 Feb 2026', role: 'Defense', score: '92/100' },
                            ].map((session, i) => (
                                <tr key={i} className="hover:bg-slate-800/30 text-slate-300">
                                    <td className="p-4 font-medium text-white">{session.title}</td>
                                    <td className="p-4 text-slate-400">{session.date}</td>
                                    <td className="p-4">{session.role}</td>
                                    <td className="p-4 text-green-400 font-bold">{session.score}</td>
                                    <td className="p-4 text-right">
                                        <button className="text-amber-500 hover:text-amber-400 text-xs">View Report</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Simple icon wrapper if not imported
const ScaleIcon = (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" /><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" /><path d="M7 21h10" /><path d="M12 3v18" /><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" /></svg>
);

export default MootScenarioLibrary;
