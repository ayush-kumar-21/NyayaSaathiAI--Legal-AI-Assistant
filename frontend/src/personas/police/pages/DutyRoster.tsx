import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    MapPin,
    User,
    Shield,
    RefreshCw,
    Filter
} from 'lucide-react';
import dutyService from '../../../core/services/dutyService';
import { DutyShift, ShiftType, OfficerStatus } from '../../../core/types/duty';

const DutyRoster: React.FC = () => {
    const [shifts, setShifts] = useState<DutyShift[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRoster();
    }, []);

    const loadRoster = async () => {
        setLoading(true);
        try {
            const data = await dutyService.getRoster();
            setShifts(data);
        } catch (error) {
            console.error("Failed to load roster", error);
        } finally {
            setLoading(false);
        }
    };

    const getShiftColor = (type: ShiftType) => {
        switch (type) {
            case ShiftType.MORNING: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
            case ShiftType.EVENING: return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
            case ShiftType.NIGHT: return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
            default: return 'bg-neutral-800 text-neutral-400';
        }
    };

    return (
        <div className="p-6 min-h-screen bg-neutral-900 text-neutral-100 font-sans">
            <header className="mb-8 border-b border-neutral-800 pb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold flex items-center gap-3 text-blue-500">
                        <Calendar className="w-8 h-8" />
                        Duty Roster (Nyaya Rakshak)
                    </h1>
                    <p className="text-neutral-400 mt-2 font-serif text-lg italic">
                        Automated shift management and deployment tracking.
                    </p>
                </div>
                <button
                    onClick={loadRoster}
                    className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 px-4 py-2 rounded-lg border border-neutral-700 transition-colors"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
                {/* Week View Mockup */}
                {[0, 1, 2, 3, 4, 5, 6].map((dayOffset) => {
                    const date = new Date();
                    date.setDate(date.getDate() + dayOffset);
                    const dateStr = date.toISOString().split('T')[0];
                    const dayShifts = shifts.filter(s => s.date === dateStr);

                    return (
                        <div key={dayOffset} className="bg-neutral-800/50 border border-neutral-700 rounded-xl overflow-hidden flex flex-col h-[600px]">
                            <div className="bg-neutral-800 p-3 border-b border-neutral-700 text-center">
                                <span className="block text-sm font-bold text-neutral-400 uppercase">
                                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                </span>
                                <span className="block text-xl font-bold text-white">
                                    {date.getDate()}
                                </span>
                            </div>

                            <div className="flex-1 p-2 space-y-2 overflow-y-auto custom-scrollbar">
                                {dayShifts.map(shift => (
                                    <div
                                        key={shift.id}
                                        className={`p-3 rounded-lg border text-sm ${getShiftColor(shift.shift_type)}`}
                                    >
                                        <div className="font-bold flex items-center gap-2 mb-1">
                                            <User className="w-3 h-3" /> {shift.officer_name.split(' ').pop()}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs opacity-80 mb-1">
                                            <Clock className="w-3 h-3" /> {shift.shift_type.toUpperCase()}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs opacity-80 truncate">
                                            <MapPin className="w-3 h-3" /> {shift.location}
                                        </div>
                                    </div>
                                ))}
                                {dayShifts.length === 0 && (
                                    <div className="text-center text-neutral-600 text-xs py-4">
                                        No shifts assigned
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// Fix for icon renaming if RefreshRr doesn't exist (it likely doesn't in Lucide)
// Using RefreshCcw instead
const RefreshCcw = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16h5v5" /></svg>
);

export default DutyRoster;
