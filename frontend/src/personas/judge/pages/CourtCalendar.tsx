import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Gavel, Clock, MapPin } from 'lucide-react';

const CourtCalendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Mock Events
    const events = [
        { id: 1, title: 'State vs. Kumar', time: '10:30 AM', type: 'Hearing', color: 'bg-red-500' },
        { id: 2, title: 'Bail Hearing: 45/2024', time: '02:00 PM', type: 'Bail', color: 'bg-amber-500' },
        { id: 3, title: 'Judgment: Civil Suit', time: '04:00 PM', type: 'Judgment', color: 'bg-green-500' },
    ];

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const renderCalendarGrid = () => {
        const days = [];
        // Empty slots for previous month
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-32 bg-slate-900/30 border border-slate-700/30 rounded-lg"></div>);
        }

        // Days of current month
        for (let i = 1; i <= daysInMonth; i++) {
            const isToday = i === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();
            const dayEvents = i === 12 || i === 15 ? events : []; // Mock adding events to specific days

            days.push(
                <div key={i} className={`h-32 bg-slate-800/50 border ${isToday ? 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'border-slate-700/50'} rounded-lg p-2 transition-all hover:bg-slate-800`}>
                    <div className="flex justify-between items-start mb-2">
                        <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-amber-500 text-black' : 'text-slate-400'}`}>
                            {i}
                        </span>
                        {dayEvents.length > 0 && <span className="text-[10px] text-slate-500">{dayEvents.length} Cases</span>}
                    </div>
                    <div className="space-y-1.5 overflow-hidden">
                        {dayEvents.map((ev, idx) => (
                            <div key={idx} className={`text-[10px] px-1.5 py-1 rounded border-l-2 border-white/20 text-white truncate ${ev.color}`}>
                                {ev.time} - {ev.title}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return days;
    };

    return (
        <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
            <header className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                    <CalendarIcon className="w-8 h-8 text-amber-500" />
                    Court Calendar
                </h1>

                <div className="flex items-center gap-4 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
                    <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-lg font-bold text-white min-w-[140px] text-center">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                    <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <div className="flex-1 bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 overflow-hidden flex flex-col">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-slate-500 text-sm font-bold uppercase tracking-wider">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {renderCalendarGrid()}
                </div>
            </div>

            {/* Upcoming List (Bottom Panel) */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex gap-6 overflow-x-auto">
                {events.map(ev => (
                    <div key={ev.id} className="min-w-[250px] flex items-center gap-4 bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                        <div className={`w-1 h-12 rounded-full ${ev.color}`}></div>
                        <div>
                            <p className="font-bold text-white text-sm">{ev.title}</p>
                            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {ev.time}</span>
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Hall 4</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourtCalendar;
