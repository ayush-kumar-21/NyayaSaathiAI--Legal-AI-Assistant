import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Zap, LayoutList, CheckCircle, AlertTriangle, FileText, ChevronRight } from 'lucide-react';
import { listingService } from '../../../core/services/listingService';
import { CaseListing, OptimizedSchedule, ScheduledSlot } from '../../../core/types/listing';
import { useMetricData, useSubmitData } from '../../../core/hooks/useMetricData';
import { VirtualList } from '../../../components/common/VirtualList';



const ListingOptimizer: React.FC = () => {
    const { data: cases, isLoading, error: loadError } = useMetricData<CaseListing>('/judge/listing/pending');
    const { submit: optimize } = useSubmitData<any, OptimizedSchedule>('/judge/listing/optimize');

    const [schedule, setSchedule] = useState<OptimizedSchedule | null>(null);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Consolidated error handling
    useEffect(() => {
        if (loadError) setError('Failed to load cases');
    }, [loadError]);

    const handleOptimize = async () => {
        setIsOptimizing(true);
        try {
            // Optimistic UI update
            await new Promise(r => setTimeout(r, 800));

            const result = await optimize({
                court_id: 'COURT-01',
                cases: cases || []
            });
            setSchedule(result);
        } catch (err) {
            setError('Optimization failed');
        } finally {
            setIsOptimizing(false);
        }
    };

    return (
        <div className="p-6 min-h-screen bg-slate-900 text-white">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center gap-3">
                        <LayoutList className="w-8 h-8 text-blue-400" />
                        AI Listing Optimizer (Skill 20)
                    </h1>
                    <p className="text-slate-400 mt-2">
                        Intelligent Cause List Management for Maximum Judicial Efficiency
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg">
                    <div className="text-right border-r border-slate-700 pr-4">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Judge</p>
                        <p className="text-sm font-bold text-white">Hon. R.K. Sharma</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Working Hours</p>
                        <p className="text-xl font-bold text-blue-400">5.5 Hrs</p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Pending Pool */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 flex justify-between items-center sticky top-4 z-10 backdrop-blur-md shadow-sm">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <Clock className="w-5 h-5 text-slate-400" />
                            Pending Cases ({(cases || []).length})
                        </h2>
                        <button
                            onClick={handleOptimize}
                            disabled={isOptimizing || (cases || []).length === 0}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-lg ${isOptimizing
                                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 hover:shadow-cyan-500/20'
                                }`}
                        >
                            {isOptimizing ? <Zap className="w-4 h-4 animate-pulse" /> : <Zap className="w-4 h-4" />}
                            {isOptimizing ? 'Optimizing...' : 'Auto-Schedule'}
                        </button>
                    </div>

                    <div className="h-[calc(100vh-200px)] pr-2">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-10 space-y-3">
                                <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                <span className="text-slate-500">Fetching cases...</span>
                            </div>
                        ) : (
                            <VirtualList
                                items={cases || []}
                                itemHeight={100} // Approximate height of card
                                renderItem={(c, i) => (
                                    <div key={i} className="mb-3 bg-slate-800/30 p-4 rounded-xl border border-slate-700/50 hover:border-blue-500/30 transition-all group hover:bg-slate-800/50">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-xs px-2 py-0.5 rounded border ${listingService.getUrgencyColor(c.urgency)}`}>
                                                {c.urgency}
                                            </span>
                                            <span className="text-xs text-slate-500 font-mono bg-slate-900/50 px-1.5 py-0.5 rounded">{c.cino}</span>
                                        </div>
                                        <h3 className="font-semibold text-sm truncate group-hover:text-blue-300 transition-colors">{c.title}</h3>
                                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                                            <span className="capitalize">{c.stage}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-600" />
                                            <span className="capitalize" style={{ color: listingService.getCaseTypeColor(c.case_type) }}>{c.case_type}</span>
                                        </div>
                                    </div>
                                )}
                            />
                        )}
                    </div>
                </div>

                {/* Optimized Schedule */}
                <div className="lg:col-span-8">
                    {schedule ? (
                        <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                            <div className="bg-slate-800/80 p-6 border-b border-slate-700 backdrop-blur-sm">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-emerald-400" />
                                            Optimized Cause List
                                        </h2>
                                        <p className="text-sm text-slate-400 mt-1">{schedule.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="inline-flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/20">
                                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                                            <span className="text-emerald-400 font-bold">{schedule.utilization_percentage}% Utilization</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-1 h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar">
                                {schedule.schedule.map((slot: ScheduledSlot, i: number) => (
                                    <div key={i} className="flex gap-4 group">
                                        <div className="w-24 text-right pt-2 flex flex-col items-end">
                                            <span className="text-sm font-mono text-slate-300 font-bold">{listingService.formatTime(slot.start_time)}</span>
                                            <span className="text-xs text-slate-500">{slot.duration_minutes}m</span>
                                        </div>
                                        <div className="flex-1 pb-6 border-l-2 border-slate-700 pl-6 relative">
                                            <div className={`absolute -left-[9px] top-3 w-4 h-4 rounded-full border-4 border-slate-900 shadow-md ${slot.case.urgency === 'Urgent' ? 'bg-red-500' :
                                                slot.case.urgency === 'High' ? 'bg-amber-500' : 'bg-blue-500'
                                                }`} />

                                            <div className="p-4 rounded-xl border bg-slate-800 border-slate-700 hover:border-blue-500/50 transition-all shadow-sm group-hover:shadow-md group-hover:translate-x-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">Slot #{slot.slot_id}</span>
                                                    <span className={`text-xs px-2 py-0.5 rounded border ${listingService.getUrgencyColor(slot.case.urgency)}`}>
                                                        {slot.case.urgency}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-white mb-1 text-lg">{slot.case.title}</h3>
                                                <div className="text-sm text-slate-400 flex items-center gap-3">
                                                    <div className="flex items-center gap-1.5">
                                                        <FileText className="w-3.5 h-3.5" />
                                                        <span className="capitalize">{slot.case.stage}</span>
                                                    </div>
                                                    <span>•</span>
                                                    <span className="font-mono text-slate-500">{slot.case.case_number}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {schedule.unlisted_cases.length > 0 && (
                                <div className="bg-amber-500/5 border-t border-amber-500/20 p-4 flex justify-between items-center">
                                    <h3 className="text-amber-400/80 font-bold flex items-center gap-2 text-sm">
                                        <AlertTriangle className="w-4 h-4" />
                                        Unlisted Cases ({schedule.unlisted_cases.length}) - Rescheduled for next working day
                                    </h3>
                                    <button className="text-xs text-amber-400 hover:underline flex items-center gap-1">
                                        View List <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center bg-slate-800/30 rounded-2xl border border-slate-700/50 border-dashed">
                            <div className="text-center p-10 max-w-md">
                                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border border-slate-700">
                                    <LayoutList className="w-10 h-10 text-slate-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Ready to Optimize</h3>
                                <p className="text-slate-400">
                                    The AI bin-packing algorithm will analyze all pending cases, consider urgency, estimated duration, and case type to generate the most efficient schedule for today.
                                </p>
                                <button
                                    onClick={handleOptimize}
                                    disabled={!cases || cases.length === 0}
                                    className="mt-8 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-500/25"
                                >
                                    Generate Schedule
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListingOptimizer;
