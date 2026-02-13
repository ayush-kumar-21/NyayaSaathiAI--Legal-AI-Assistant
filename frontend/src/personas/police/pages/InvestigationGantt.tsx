import React from 'react';
import { Calendar, CheckCircle, Clock, AlertCircle, ChevronRight, BarChart } from 'lucide-react';
import { motion } from 'framer-motion';

const InvestigationGantt: React.FC = () => {
    // Mock Data for Investigation Timeline
    const tasks = [
        { id: 1, name: 'FIR Registration', start: 1, duration: 1, status: 'completed', assignee: 'SHO Sharma' },
        { id: 2, name: 'Crime Scene Analysis', start: 2, duration: 2, status: 'completed', assignee: 'Forensic Team' },
        { id: 3, name: 'Witness Statements', start: 3, duration: 4, status: 'in-progress', assignee: 'IO Verma' },
        { id: 4, name: 'Digital Evidence Collection', start: 4, duration: 3, status: 'in-progress', assignee: 'Cyber Cell' },
        { id: 5, name: 'Suspect Interrogation', start: 6, duration: 3, status: 'pending', assignee: 'IO Verma' },
        { id: 6, name: 'Forensic Report', start: 8, duration: 5, status: 'pending', assignee: 'FSL Lab' },
        { id: 7, name: 'Charge Sheet Drafting', start: 12, duration: 4, status: 'pending', assignee: 'Legal Cell' },
        { id: 8, name: 'Final Submission', start: 15, duration: 1, status: 'pending', assignee: 'SHO Sharma' },
    ];

    const days = Array.from({ length: 16 }, (_, i) => i + 1);

    return (
        <div className="h-[calc(100vh-6rem)] flex flex-col gap-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <BarChart className="w-8 h-8 text-blue-500" />
                        Investigation Planner
                    </h1>
                    <p className="text-slate-400">Timeline & Resource Management for FIR-2024-102</p>
                </div>
                <div className="flex gap-4">
                    <div className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-500" />
                        <span className="text-slate-300 text-sm">Days Remaining: <strong className="text-white">42</strong></span>
                    </div>
                </div>
            </header>

            <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-800 bg-slate-800/30 flex justify-between items-center">
                    <h3 className="font-semibold text-white">Investigation Roadmap</h3>
                    <div className="flex gap-4 text-xs">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Completed</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> In Progress</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-600"></span> Pending</span>
                    </div>
                </div>

                <div className="flex-1 overflow-x-auto p-6">
                    <div className="min-w-[800px]">
                        {/* Timeline Header */}
                        <div className="grid grid-cols-12 mb-4 border-b border-slate-800 pb-2">
                            <div className="col-span-3 text-slate-500 font-medium text-sm pl-2">Task Name</div>
                            <div className="col-span-9 flex justify-between px-2">
                                {days.map(d => (
                                    <div key={d} className="text-xs text-slate-600 w-8 text-center">{d}</div>
                                ))}
                            </div>
                        </div>

                        {/* Tasks */}
                        <div className="space-y-3">
                            {tasks.map((task, index) => (
                                <motion.div
                                    key={task.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="grid grid-cols-12 items-center hover:bg-slate-800/20 rounded-lg py-1"
                                >
                                    <div className="col-span-3 pl-2 pr-4">
                                        <div className="font-medium text-slate-200 text-sm">{task.name}</div>
                                        <div className="text-[10px] text-slate-500">{task.assignee}</div>
                                    </div>
                                    <div className="col-span-9 relative h-8 px-2 flex items-center">
                                        {/* Grid Lines */}
                                        <div className="absolute inset-0 flex justify-between pointer-events-none opacity-10">
                                            {days.map(d => <div key={d} className="w-px bg-slate-400 h-full"></div>)}
                                        </div>

                                        {/* Task Bar */}
                                        <div
                                            className={`absolute h-6 rounded-md shadow-lg flex items-center px-2 text-[10px] font-bold text-white whitespace-nowrap overflow-hidden transition-all hover:scale-[1.02] cursor-pointer
                                                ${task.status === 'completed' ? 'bg-green-600/80 border border-green-500' :
                                                    task.status === 'in-progress' ? 'bg-blue-600/80 border border-blue-500' : 'bg-slate-700/80 border border-slate-600'}`}
                                            style={{
                                                left: `${(task.start - 1) * 6.66}%`,
                                                width: `${task.duration * 6.66}%`
                                            }}
                                        >
                                            {task.duration} Days
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvestigationGantt;
